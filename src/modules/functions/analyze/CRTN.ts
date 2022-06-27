import * as THREE from 'three';
import {
    arrMakeFlat,
    distance,
    EEntType,
    GIModel,
    idsBreak,
    multMatrix,
    project,
    TEntTypeIdx,
    TId,
    TPlane,
    TRay,
    Txy,
    Txyz,
    vecAdd,
    vecAng,
    vecAvg,
    vecCross,
    vecDiv,
    vecDot,
    vecFromTo,
    vecLen,
    vecMult,
    vecNorm,
} from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import * as d3poly from 'd3-polygon';
import lodash from 'lodash';
import { _getSensorRays, _rayOrisDirsTjs } from './_shared';
// import { Plane } from '../visualize/Plane';
const EPS = 1e-6;
// ================================================================================================
interface TNoiseResult {
    noise_level: number[]
}
// =================================================================================================
/**
 * Calculates the noise impact on a set of sensors from a set of noise sources, using the CRTN
 * method (Calculation of Road Traffic Noise, 1988).
 * \n
 * Typically, the sensors are created as centroids of a set of windows. The noise sources are 
 * typically polylines placed along road centrelines. The CRTN method psecified that the 
 * centrelines should be inset 3.5 meters from the road kerb that is closest to the sensors.
 * \n
 * The noise impact is calculated by shooting rays out from the sensors towards the noise sources.
 * The 'radius' argument defines the maximum radius of the calculation.
 * (The radius is used to define the maximum distance for shooting the rays.)
 * \n
 * Returns a dictionary containing the noise level values, in decibels (dB).
 * \n
 * @param __model__
 * @param sensors A list of Rays or Planes, to be used as the origins for calculating the unobstructed views.
 * @param entities The obstructions: faces, polygons, or collections.
 * @param radius The maximum radius of the visibility analysis.
 * @param roads Polylines defining the road segments as noise sources. 
 * @param noise_levels The noise level for each road polyline, in dB. Either a single number for all
 * roads, or a list of numbers matching the list of roads.
 * @param length The length of each road segment, in meters.
 * @returns A dictionary containing different visibility metrics.
 */
export function CRTN(
    __model__: GIModel,
    sensors: TRay[] | TPlane[] | TRay[][] | TPlane[][],
    entities: TId | TId[] | TId[][],
    radius: number | [number, number],
    roads: TId | TId[] | TId[][],
    noise_levels: number|number[],
    length: number,
): TNoiseResult | [TNoiseResult, TNoiseResult] {
    entities = arrMakeFlat(entities) as TId[];
    roads = arrMakeFlat(roads) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.CRTN";
    let ents_arrs1: TEntTypeIdx[];
    let ents_arrs2: TEntTypeIdx[];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "sensors", sensors, 
            [chk.isRayL, chk.isPlnL, chk.isRayLL, chk.isPlnLL]);
        ents_arrs1 = checkIDs(__model__, fn_name, "entities", entities, 
            [ID.isIDL1], 
            [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        chk.checkArgs(fn_name, "radius", radius, [chk.isNum, chk.isNumL]);
        if (Array.isArray(radius)) {
            if (radius.length !== 2) {
                throw new Error('If "radius" is a list, it must have a length of two: \
                [min_dist, max_dist].');
            }
            if (radius[0] >= radius[1]) {
                throw new Error('If "radius" is a list, the "min_dist" must be less than \
                the "max_dist": [min_dist, max_dist].');
            }
        }
        ents_arrs2 = checkIDs(__model__, fn_name, "roads", roads, 
            [ID.isIDL1], 
            [EEntType.PLINE]) as TEntTypeIdx[];
        chk.checkArgs(fn_name, "noise_levels", noise_levels, [chk.isNum, chk.isNumL]);
        if (Array.isArray(noise_levels)) {
            if (noise_levels.length !== roads.length) {
                throw new Error('The number of noise levels must match the number of road polylines.');
            }
        }
        chk.checkArgs(fn_name, "length", length, [chk.isNum]);
        if (length === 0) {
            throw new Error('The road segment length cannot be zero.');
        }
    } else {
        ents_arrs1 = idsBreak(entities) as TEntTypeIdx[];
        ents_arrs2 = idsBreak(roads) as TEntTypeIdx[];
    }
    // --- Error Check ---
    radius = Array.isArray(radius) ? radius : [1, radius];
    noise_levels = Array.isArray(noise_levels) ? noise_levels : Array(roads.length).fill(noise_levels);
    // get xyz and normal for each sensor point
    const sensor_rays: TRay[][] = _getSensorRays(sensors, 0.01); // offset by 0.01
    // get edges of obstructions
    const edges_map: Map<string, [Txyz, Txyz]> = new Map();
    const rej_edges: Set<string> = new Set();
    for (const [ent_type, ent_i] of ents_arrs1) {
        const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const edge_i of edges_i) {
            const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            posis_i.sort();
            const key: string = posis_i[0] + '_' + posis_i[1];
            if (!edges_map.has(key) && !rej_edges.has(key)) {
                const a: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
                const b: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
                if (Math.abs(vecDot(vecNorm(vecFromTo(a, b)), [0,0,1])) > 0.9) {
                    rej_edges.add(key);
                } else if(a[2] < EPS && b[2] < EPS) {
                    rej_edges.add(key);
                } else {
                    edges_map.set(key, [a, b]);
                }
            }
        }
    }
    const edges: [Txyz, Txyz][] = Array.from(edges_map.values());
    // create a list of all segments
    const segs: {start: Txyz, mid: Txyz, end: Txyz, noise: number}[] = [];
    for (let i = 0; i < ents_arrs2.length; i++) {
        const pline_i: number = ents_arrs2[i][1];
        const noise: number = noise_levels[i];
        const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(EEntType.PLINE, pline_i);
        for (const edge_i of edges_i) {
            // get start and end of edge
            const [edge_start, edge_end]: [Txyz, Txyz] = __model__.modeldata.attribs.get.getEntAttribVal(
                EEntType.POSI, __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i), 
                'xyz') as [Txyz, Txyz];
            // div into segments
            const xyzs: Txyz[] = segments(edge_start, edge_end, length);
            // save each seg
            for (let j = 0; j < xyzs.length - 1; j++) {
                segs.push({
                    start: xyzs[j], 
                    mid: vecAvg([xyzs[j], xyzs[j + 1]]),
                    end: xyzs[j + 1],
                    noise: noise
                });
            }
        }
    }
    // run simulation
    const results0: TNoiseResult = _calcNoise(__model__, 
        sensor_rays[0], segs, edges, radius, false);
    const results1: TNoiseResult = _calcNoise(__model__, 
        sensor_rays[1], segs, edges, radius, true);
    // return the results
    if (results0 && results1) { return [results0, results1]; }
    if (results0) { return results0; }
    if (results1) { return results1; }
    return null;
}
// =================================================================================================
// The following code is based on the document: Calculation of Road Traffic Noise, 1988. In the
// comments in the code we reference various charts and paragraphsin this document. Some
// simplifications have been made.
// - The ground is assumed to be flat.
// - The ground absorbtion coefficient is fixed at 1. 
// - No reflections.
//
// The document is written to allow for hand calculation. Since we are using computation, we take a
// slightly different appraoch that is easier to compute.
// - Many very short road segments are created.
// - For each road segment, we create a vertical plane that cuts through the reciever and the center
//   of the road segment.
// - For each plane, we see if it cuts through any obstructions. 
// - Any obstructions that are found are assumed to have a constant height and to completley cover
//   the view angle of the segment. 
//
// With this method, the smaller the segments, the more accurate the result. 
// 
function _calcNoise(
    __model__: GIModel,
    sensor_rays: TRay[],
    segments: {start: Txyz, mid: Txyz, end: Txyz, noise: number}[],
    edges:  [Txyz, Txyz][],
    radius: [number, number],
    generate_lines: boolean
): TNoiseResult {
    const PRINT = false;
    const results: number[] = [];
    for (const [sensor_xyz, sensor_dir] of sensor_rays) {
        if (PRINT) { console.log("    ================================="); }
        const noise_lvls: number[] = [];
        for (const {start, mid, end, noise: road_noise} of segments) {
            if (PRINT) { console.log("    ---------------------------------"); }
            let sensor_xyz2: Txyz = sensor_xyz;
            const dir: Txyz = vecNorm(vecFromTo(sensor_xyz2, mid));
            // check if segment is behind sensor
            if (vecDot(dir, sensor_dir) <= 0) { continue; } 
            // check if segment is beyong radius
            const seg_dist: number = distance(sensor_xyz, mid) ;
            if (seg_dist < radius[0] || seg_dist > radius[1]) { continue; } 
            // create seg vector
            const seg_vec: Txyz = vecNorm(vecFromTo(start, end));
            const seg_vec_perp: Txyz = vecCross(seg_vec, [0,0,1]);
            // // decided to disable this, if base_dist < 4m, then we force it to be 4m
            // // check dist from sensor to seg plane
            // const check_dist: number = distance(sensor_xyz2, [start, seg_vec, [0,0,1]]);
            // if (check_dist < 7.5) {
            //     // when the distance is below 7.5m, the equations are no longer valid
            //     // we need to move the sensor point and print a warning to the console
            //     const dir: number = vecDot(vecNorm(vecFromTo(start, sensor_xyz2)), seg_vec_perp);
            //     const move_dist: number = dir > 0 ? 7.6 - check_dist : - 7.6 + check_dist;
            //     console.log("Noise warning: Distance too small so moving sensor point by");
            //     let move_vec: Txyz = vecCross(sensor_dir, [0,0,1])
            //     if (vecDot(move_vec, seg_vec_perp) < 0) { move_vec = vecRev(move_vec); }
            //     const vec_ang: number = vecAng(move_vec, seg_vec_perp);
            //     let move_dist_facade: number = move_dist / Math.cos(vec_ang);
            //     if (move_dist_facade > 5) {
            //         console.log("    Move distance was too large:", move_dist_facade);
            //         console.log("    Limiting move distance to 5m.");
            //         move_dist_facade = 5;
            //     }
            //     move_vec = vecSetLen(move_vec, move_dist_facade);
            //     sensor_xyz2 = vecAdd(sensor_xyz2, move_vec);
            //     console.log("   Moved from", sensor_xyz, "to", sensor_xyz2);
            // }
            // calc detour
            const [path, zone]: [Txyz[], ZONE] = _calcDetour(sensor_xyz2, mid, edges);
            // create plane through sensor perpendicular to segment
            const pln: TPlane = [sensor_xyz2, seg_vec_perp, [0,0,1]];
            // project path onto plane 
            const path_proj: Txyz[] = path.map( xyz => project(xyz, pln));
            const path_start: Txyz = path_proj[0];
            const path_end: Txyz = path_proj[path_proj.length - 1];
            // calc base distance - see Figure 1
            const sensor_base: Txyz = [path_start[0], path_start[1], 0];
            const source_base: Txyz = [path_end[0], path_end[1], 0];
            let base_dist = distance(sensor_base, source_base) - 3.5;
            // calc straight line dist - see Figure 1
            let slant_dist = distance(path_start, path_end);
            // calc the view angle - see Annex 4
            const vec_st: Txyz = vecFromTo(sensor_xyz2, start);
            const vec_en: Txyz = vecFromTo(sensor_xyz2, end);
            const view_ang: number = vecAng([vec_st[0], vec_st[1], 0],[vec_en[0], vec_en[1], 0]);
            // set the initial noise level
            let noise_lvl: number = road_noise;
            if (PRINT) { console.log("    noise_lvl base", noise_lvl); }
            // apply distance correction - see chart 7
            // this is +ve if slant_dist < 13.5, i.e. if base_dist = 7.5 and hight < 11.22 
            let dist_corr: number = base_dist > 4 ? 
                -10 * Math.log10(slant_dist/13.5) : 
                -10 * Math.log10(Math.sqrt(path_start[2] ^ 2 + 4 ^ 2)/13.5);
            if (dist_corr > 0) { dist_corr = 0; }
            noise_lvl += dist_corr;
            if (PRINT) { console.log("     dist_corr", dist_corr, noise_lvl); }
            if (zone === ZONE.UNOBSTRUCTED) {
                // road segment is unobstructed
                // calc mean height of the propogation - see para 20.2
                const h_mean: number = 0.5 * (sensor_xyz2[2] + 1);
                // check if ground absorbtion applies 
                if (base_dist >= 4 && h_mean < (base_dist + 5) / 6 ) {
                    // apply ground absorbtion correction - see chart 8
                    const ground_abs: number = 1;
                    let ground_abs_corr: number;
                    if (h_mean < 0.75) {
                        ground_abs_corr  = 5.2 * ground_abs * 
                            Math.log10( 3 / (base_dist + 3.5) );
                    } else {
                        ground_abs_corr  = 5.2 * ground_abs * 
                            Math.log10( ((6 * h_mean) - 1.5) / (base_dist + 3.5) );
                    }
                    noise_lvl += ground_abs_corr;
                    if (PRINT) { console.log("     ground_abs_corr", ground_abs_corr, noise_lvl); }
                }
            } else {
                // road segment is obstructed
                // calc length of detour
                let detour_dist: number = 0;
                for (let i = 0; i < path_proj.length - 1; i++) {
                    detour_dist += distance(path_proj[i], path_proj[i + 1]);
                }
                // calculate delta
                const delta: number = detour_dist - slant_dist;
                // calculate barrier correction - see Chart 9a
                const x: number = Math.log10(delta);
                let barrier_corr: number = 0;
                const shadow_zone = zone === ZONE.SHADOW;
                if (shadow_zone && x < -3) {
                    barrier_corr = -5;
                } else if (shadow_zone && x > 1.2) {
                    barrier_corr = -30;
                } else if (!shadow_zone && x < -4) {
                    barrier_corr = -5;
                } else if (!shadow_zone && x > 0) {
                    barrier_corr = 0;
                } else {
                    let coefs: number[];
                    if (shadow_zone) {
                        // SHADOW ZONE
                        coefs = [-15.4, -8.26, -2.787, -0.831, -0.198, 0.1539, 0.12248, 0.02175];
                    } else {
                        // ILLUMINATED ZONE
                        coefs = [0, 0.109, -0.815, 0.479, 0.3284, 0.04385];
                    }
                    for (let i = 0; i < coefs.length; i++) {
                        barrier_corr += coefs[i] * Math.pow(x, i);
                    }
                }
                noise_lvl += barrier_corr;
                if (PRINT) { console.log("     barrier_corr", barrier_corr, noise_lvl); }
            }
            // apply view angle correction - see chart 10
            const view_ang_corr: number = 10 * Math.log10(view_ang / Math.PI);
            noise_lvl += view_ang_corr;
            if (PRINT) { console.log("     view_ang", view_ang * (180/Math.PI), "degrees"); }
            if (PRINT) { console.log("     view_ang_corr", view_ang_corr, noise_lvl); }
            // check if noise level is below zero 
            if (noise_lvl < 0) { noise_lvl = 0; }
            // save the noise level for segment
            noise_lvls.push(noise_lvl);
            // generate calculation lines
            if (generate_lines) {
                const tmp_posis_i: number[] = [];
                if (sensor_xyz !== sensor_xyz2) {
                    path.splice(0, 0, sensor_xyz);
                }
                for (const xyz of path) {
                    const posi_i: number = __model__.modeldata.geom.add.addPosi();
                    __model__.modeldata.attribs.set.setEntAttribVal(EEntType.POSI, posi_i, 'xyz', xyz);
                    tmp_posis_i.push(posi_i);
                }
                __model__.modeldata.geom.add.addPline(tmp_posis_i, false);
            }
        }
        // merge results from multiple road segments - see chart 11 
        // L = 10 * Log(  sum( Antilog(Ln/10) )  )
        const noise_lvls_pow: number[] = noise_lvls.map( lvl =>  Math.pow(10, lvl / 10) );
        const noise_lvls_sum: number = noise_lvls_pow.reduce( (a,b) => a + b, 0 );
        const noise_lvl_final: number = 10 * Math.log10(noise_lvls_sum);
        if (PRINT) { console.log("    ---------------------------------"); }
        if (PRINT) { console.log("    noise_lvl ALL", noise_lvls); }
        if (PRINT) { console.log("    noise_lvl COMBINED", noise_lvl_final); }
        results.push(noise_lvl_final);
    }
    return { noise_level: results };
}
// =================================================================================================
enum ZONE {
    SHADOW,
    ILLUMINATED,
    UNOBSTRUCTED
}
// =================================================================================================
function _calcDetour(sensor: Txyz, source: Txyz, edges:  [Txyz, Txyz][]): [Txyz[], ZONE] {
    // create vector on ground that starts at sensor and points towards source
    const x_axis: Txyz = vecNorm(vecFromTo(
        [sensor[0], sensor[1], 0], 
        [source[0], source[1], 0]
    ));
    // create a plane, origin at sensor
    const plane: TPlane = [[sensor[0], sensor[1], 0], x_axis, [0,0,1]];
    // create matrix from plane
    const matrix0: THREE.Matrix4 = _xformMatrix(plane, true);
    const sensor_xform: Txyz = multMatrix(sensor, matrix0);
    const source_xform: Txyz = multMatrix(source, matrix0);
    const max_x: number = source_xform[0];
    // calc isects
    const isects: Txyz[] = [];
    for (const [start, end] of edges) {
        const a: Txyz = multMatrix(start, matrix0);
        const b: Txyz = multMatrix(end, matrix0);
        if ((a[2] < 0 && b[2] < 0) || (a[2] > 0 && b[2] > 0)) { continue; }
        if ((a[0] < 0 && b[0] < 0) || (a[2] > max_x && b[2] > max_x)) { continue; }
        const pq: [Txyz, Txyz] = a[2] < b[2] ? [a, b] : [b, a];
        const vec_pq: Txyz = vecFromTo(pq[0], pq[1]);
        const zp: number = -1 * pq[0][2];
        const zpq: number = zp + pq[1][2];
        
        const isect: Txyz = vecAdd(pq[0], vecMult(vec_pq, zp/zpq));
        if (isect[0] > 0 && isect[0] < max_x) {
            isects.push(isect)
        }
    }
    // if no isects, then this is unobstructed
    if (isects.length === 0) {
        return [[sensor, source], ZONE.UNOBSTRUCTED];
    }
    let [path, zone]: [Txyz[], ZONE] = _convexHullDetour(sensor_xform, source_xform, isects);
    // reverse the matrix transformation
    const matrix1: THREE.Matrix4 = _xformMatrix(plane, false);
    path = path.map( xyz => multMatrix(xyz, matrix1) );
    // return teh result
    return [path, zone];
}
// =================================================================================================
function _convexHullDetour(sensor: Txyz, source: Txyz, isects: Txyz[]): [Txyz[], ZONE] {
    // for any x val, get isects with the higest y val
    const x_to_isect: Map<number, Txyz> = new Map();
    for (const isect of isects) {
        if (isect[1] <= EPS) { continue; }
        const x_rnd = lodash.round(isect[0], 2);
        if (!x_to_isect.has(x_rnd) || x_to_isect.get(x_rnd)[1] < isect[1]) {
            x_to_isect.set(x_rnd, isect);
        }
    }
    // create a list of filtered isects
    const isects_filt: Txyz[] = Array.from(x_to_isect.values())
    // create list for d3 points
    const points_d3: Txy[] = isects_filt.map( isect => [isect[0], isect[1]] );
    // convert source, add second to last
    const source_d3: Txy = [source[0], source[1]];
    points_d3.push(source_d3);
    // convert sensor, add as last
    const sensor_d3: Txy = [sensor[0], sensor[1]];
    points_d3.push(sensor_d3);
    // try assuming shadow zone, the hull will go over the top
    const detour_a_xyz: Txyz[] = _convexHullDetourOver(sensor, source, isects_filt, points_d3);
    if (detour_a_xyz.length > 2) { return [detour_a_xyz, ZONE.SHADOW]; }
    // must be illuminated zone, to force hull over the top, move d3 sensor down
    // d3 sensor is last in list
    points_d3[points_d3.length - 1][1] = 0;
    const detour_b_xyz: Txyz[] = _convexHullDetourOver(sensor, source, isects_filt, points_d3);
    return [detour_b_xyz, ZONE.ILLUMINATED];
}
// =================================================================================================
function _convexHullDetourOver(sensor: Txyz, source: Txyz, isects: Txyz[], points_d3: Txy[]): Txyz[] {
    // create hull
    const hull_d3: [number, number][] = d3poly.polygonHull(points_d3);
    // get st
    const sensor_d3: Txy = points_d3[points_d3.length - 1];
    const source_d3: Txy = points_d3[points_d3.length - 2];
    // get the start and end indexes of the line that goes over the obstruction
    const start_idx: number = hull_d3.indexOf(sensor_d3);
    const end_idx: number = hull_d3.indexOf(source_d3);
    // get the xyzs of the detour line that goes over the obstruction
    const loop_end: number = end_idx < start_idx ? end_idx + hull_d3.length : end_idx;
    const detour_a_xyz: Txyz[] = [sensor]; // start
    for (let i = start_idx + 1; i < loop_end; i++ ) {
        const point_d3: Txy = hull_d3[i % hull_d3.length];
        const idx: number = points_d3.indexOf(point_d3);
        detour_a_xyz.push(isects[idx]);
    }
    detour_a_xyz.push(source); // end
    return detour_a_xyz;
}
// =================================================================================================
function _xformMatrix(plane: TPlane, neg: boolean): THREE.Matrix4 {
    const o: THREE.Vector3 = new THREE.Vector3(...plane[0]);
    const x: THREE.Vector3 = new THREE.Vector3(...plane[1]);
    const y: THREE.Vector3 = new THREE.Vector3(...plane[2]);
    const z: THREE.Vector3 = new THREE.Vector3(...vecCross(plane[1], plane[2]));
    if (neg) {
        o.negate();
    }
    // origin translate matrix
    const m1: THREE.Matrix4 = new THREE.Matrix4();
    m1.setPosition(o);
    // xfrom matrix
    const m2: THREE.Matrix4 = new THREE.Matrix4();
    m2.makeBasis(x, y, z);
    // combine two matrices
    const m3: THREE.Matrix4 = new THREE.Matrix4();
    if (neg) {
        const m2x = (new THREE.Matrix4()).copy( m2 ).invert();
        // first translate to origin, then xform, so m2 x m1
        m3.multiplyMatrices(m2x, m1);
    } else {
        // first xform, then translate to origin, so m1 x m2
        m3.multiplyMatrices(m1, m2);
    }
    // return the combined matrix
    return m3;
}
// =================================================================================================
function segments(xyz1: Txyz, xyz2: Txyz, len: number): Txyz[] {
    const vec: Txyz = vecFromTo(xyz1, xyz2);
    const num_segs: number = Math.floor(vecLen(vec) / len);
    if (num_segs < 2) { return [xyz1, xyz2]; }
    const sub_vec: Txyz = vecDiv(vec, num_segs);
    const xyzs: Txyz[] = [xyz1];
    for (let i = 0; i < num_segs; i++) {
        xyzs.push(vecAdd(xyz1, vecMult(sub_vec, i + 1)));
    }
    return xyzs;
}
// =================================================================================================
