"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoiseCRTN = void 0;
const THREE = __importStar(require("three"));
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../_check_ids");
const chk = __importStar(require("../../_check_types"));
const d3poly = __importStar(require("d3-polygon"));
const lodash_1 = __importDefault(require("lodash"));
const _shared_1 = require("./_shared");
const EPS = 1e-6;
// TODO: insert diagrams about [RayL, [Ray]] output
// =================================================================================================
/**
 * Calculates the noise impact on a set of sensors from a set of noise sources, using the CRTN
 * method (Calculation of Road Traffic Noise, 1988).
 * \n
 * Typically, the sensors are created as centroids of a set of windows. The noise sources are
 * typically polylines placed along road centrelines. The CRTN method specified that the
 * centrelines should be inset 3.5 meters from the road kerb that is closest to the sensors.
 * \n
 * The noise impact is calculated by shooting rays out from the sensors towards the noise sources.
 * \n
 * There are several cases for the input of 'sensors'.
 * - `PlnL` will return a dictionary of values, with each value corresponding to each plane.
 * - `[PlnL, Pln]` will return a dictionary with two keys, while visualizing the raycasting process for `Pln`.
 * - `RayL` will return a dictionary of values, with each value corresponding to each ray.
 * - `[RayL, Ray]` will return a dictionary with two keys, while visualizing the raycasting process for `Ray`.
 * \n
 * The radius is used to define the distance of the resultant rays.
 * \n
 * - If 'radius' is a number, it defines the maximum radius of the calculation.
 * - If 'radius' is a list of two numbers, it defines the minimum and maximum distance of the calculation.
 * The "min_dist" must be less than the "max_dist": [min_dist, max_dist].
 * \n
 * Returns a dictionary containing the noise level values, in decibels (dB).
 * \n
 * @param __model__
 * @param sensors A list of Rays or Planes, to be used as the origins for calculating the unobstructed views.
 * @param entities A list of the obstructions: faces, polygons, or collections.
 * @param radius A number or list of two numbers. The maximum radius of the visibility analysis.
 * @param roads A Polyline or list of polylines defining the road segments as noise sources.
 * @param noise_levels The noise level for each road polyline, in dB. Either a single number for all
 * roads, or a list of numbers with the same length as the list of roads.
 * @param length The length of each road segment, in meters.
 * @returns A dictionary containing different visibility metrics.
 */
function NoiseCRTN(__model__, sensors, entities, radius, roads, noise_levels, length) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    roads = (0, mobius_sim_1.arrMakeFlat)(roads);
    // --- Error Check ---
    const fn_name = "analyze.CRTN";
    let ents_arrs1;
    let ents_arrs2;
    if (__model__.debug) {
        chk.checkArgs(fn_name, "sensors", sensors, [chk.isRayL, chk.isPlnL, chk.isRayLL, chk.isPlnLL]);
        ents_arrs1 = (0, _check_ids_1.checkIDs)(__model__, fn_name, "entities", entities, [_check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.PGON, mobius_sim_1.EEntType.COLL]);
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
        ents_arrs2 = (0, _check_ids_1.checkIDs)(__model__, fn_name, "roads", roads, [_check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.PLINE]);
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
    }
    else {
        ents_arrs1 = (0, mobius_sim_1.idsBreak)(entities);
        ents_arrs2 = (0, mobius_sim_1.idsBreak)(roads);
    }
    // --- Error Check ---
    radius = Array.isArray(radius) ? radius : [1, radius];
    noise_levels = Array.isArray(noise_levels) ? noise_levels : Array(roads.length).fill(noise_levels);
    // get xyz and normal for each sensor point
    const [sensors0, sensors1, two_lists] = (0, _shared_1._getSensorRays)(sensors, 0.01); // offset by 0.01
    // get edges of obstructions
    const edges_map = new Map();
    const rej_edges = new Set();
    for (const [ent_type, ent_i] of ents_arrs1) {
        const edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const edge_i of edges_i) {
            const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.EDGE, edge_i);
            posis_i.sort();
            const key = posis_i[0] + '_' + posis_i[1];
            if (!edges_map.has(key) && !rej_edges.has(key)) {
                const a = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
                const b = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
                if (Math.abs((0, mobius_sim_1.vecDot)((0, mobius_sim_1.vecNorm)((0, mobius_sim_1.vecFromTo)(a, b)), [0, 0, 1])) > 0.9) {
                    rej_edges.add(key);
                }
                else if (a[2] < EPS && b[2] < EPS) {
                    rej_edges.add(key);
                }
                else {
                    edges_map.set(key, [a, b]);
                }
            }
        }
    }
    const edges = Array.from(edges_map.values());
    // create a list of all segments
    const segs = [];
    for (let i = 0; i < ents_arrs2.length; i++) {
        const pline_i = ents_arrs2[i][1];
        const noise = noise_levels[i];
        const edges_i = __model__.modeldata.geom.nav.navAnyToEdge(mobius_sim_1.EEntType.PLINE, pline_i);
        for (const edge_i of edges_i) {
            // get start and end of edge
            const [edge_start, edge_end] = __model__.modeldata.attribs.get.getEntAttribVal(mobius_sim_1.EEntType.POSI, __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.EDGE, edge_i), 'xyz');
            // div into segments
            const xyzs = segments(edge_start, edge_end, length);
            // save each seg
            for (let j = 0; j < xyzs.length - 1; j++) {
                segs.push({
                    start: xyzs[j],
                    mid: (0, mobius_sim_1.vecAvg)([xyzs[j], xyzs[j + 1]]),
                    end: xyzs[j + 1],
                    noise: noise
                });
            }
        }
    }
    // run simulation
    const results0 = _calcNoise(__model__, sensors0, segs, edges, radius, false);
    const results1 = _calcNoise(__model__, sensors1, segs, edges, radius, true);
    // return the results
    if (two_lists) {
        return [results0, results1];
    }
    return results0;
}
exports.NoiseCRTN = NoiseCRTN;
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
function _calcNoise(__model__, sensor_rays, segments, edges, radius, generate_lines) {
    const PRINT = false;
    const results = [];
    for (const [sensor_xyz, sensor_dir] of sensor_rays) {
        if (PRINT) {
            console.log("    =================================");
        }
        const noise_lvls = [];
        for (const { start, mid, end, noise: road_noise } of segments) {
            if (PRINT) {
                console.log("    ---------------------------------");
            }
            let sensor_xyz2 = sensor_xyz;
            const dir = (0, mobius_sim_1.vecNorm)((0, mobius_sim_1.vecFromTo)(sensor_xyz2, mid));
            // check if segment is behind sensor
            if ((0, mobius_sim_1.vecDot)(dir, sensor_dir) <= 0) {
                continue;
            }
            // check if segment is beyong radius
            const seg_dist = (0, mobius_sim_1.distance)(sensor_xyz, mid);
            if (seg_dist < radius[0] || seg_dist > radius[1]) {
                continue;
            }
            // create seg vector
            const seg_vec = (0, mobius_sim_1.vecNorm)((0, mobius_sim_1.vecFromTo)(start, end));
            const seg_vec_perp = (0, mobius_sim_1.vecCross)(seg_vec, [0, 0, 1]);
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
            const [path, zone] = _calcDetour(sensor_xyz2, mid, edges);
            // create plane through sensor perpendicular to segment
            const pln = [sensor_xyz2, seg_vec_perp, [0, 0, 1]];
            // project path onto plane 
            const path_proj = path.map(xyz => (0, mobius_sim_1.project)(xyz, pln));
            const path_start = path_proj[0];
            const path_end = path_proj[path_proj.length - 1];
            // calc base distance - see Figure 1
            const sensor_base = [path_start[0], path_start[1], 0];
            const source_base = [path_end[0], path_end[1], 0];
            let base_dist = (0, mobius_sim_1.distance)(sensor_base, source_base) - 3.5;
            // calc straight line dist - see Figure 1
            let slant_dist = (0, mobius_sim_1.distance)(path_start, path_end);
            // calc the view angle - see Annex 4
            const vec_st = (0, mobius_sim_1.vecFromTo)(sensor_xyz2, start);
            const vec_en = (0, mobius_sim_1.vecFromTo)(sensor_xyz2, end);
            const view_ang = (0, mobius_sim_1.vecAng)([vec_st[0], vec_st[1], 0], [vec_en[0], vec_en[1], 0]);
            // set the initial noise level
            let noise_lvl = road_noise;
            if (PRINT) {
                console.log("    noise_lvl base", noise_lvl);
            }
            // apply distance correction - see chart 7
            // this is +ve if slant_dist < 13.5, i.e. if base_dist = 7.5 and hight < 11.22 
            let dist_corr = base_dist > 4 ?
                -10 * Math.log10(slant_dist / 13.5) :
                -10 * Math.log10(Math.sqrt(path_start[2] ^ 2 + 4 ^ 2) / 13.5);
            if (dist_corr > 0) {
                dist_corr = 0;
            }
            noise_lvl += dist_corr;
            if (PRINT) {
                console.log("     dist_corr", dist_corr, noise_lvl);
            }
            if (zone === ZONE.UNOBSTRUCTED) {
                // road segment is unobstructed
                // calc mean height of the propogation - see para 20.2
                const h_mean = 0.5 * (sensor_xyz2[2] + 1);
                // check if ground absorbtion applies 
                if (base_dist >= 4 && h_mean < (base_dist + 5) / 6) {
                    // apply ground absorbtion correction - see chart 8
                    const ground_abs = 1;
                    let ground_abs_corr;
                    if (h_mean < 0.75) {
                        ground_abs_corr = 5.2 * ground_abs *
                            Math.log10(3 / (base_dist + 3.5));
                    }
                    else {
                        ground_abs_corr = 5.2 * ground_abs *
                            Math.log10(((6 * h_mean) - 1.5) / (base_dist + 3.5));
                    }
                    noise_lvl += ground_abs_corr;
                    if (PRINT) {
                        console.log("     ground_abs_corr", ground_abs_corr, noise_lvl);
                    }
                }
            }
            else {
                // road segment is obstructed
                // calc length of detour
                let detour_dist = 0;
                for (let i = 0; i < path_proj.length - 1; i++) {
                    detour_dist += (0, mobius_sim_1.distance)(path_proj[i], path_proj[i + 1]);
                }
                // calculate delta
                const delta = detour_dist - slant_dist;
                // calculate barrier correction - see Chart 9a
                const x = Math.log10(delta);
                let barrier_corr = 0;
                const shadow_zone = zone === ZONE.SHADOW;
                if (shadow_zone && x < -3) {
                    barrier_corr = -5;
                }
                else if (shadow_zone && x > 1.2) {
                    barrier_corr = -30;
                }
                else if (!shadow_zone && x < -4) {
                    barrier_corr = -5;
                }
                else if (!shadow_zone && x > 0) {
                    barrier_corr = 0;
                }
                else {
                    let coefs;
                    if (shadow_zone) {
                        // SHADOW ZONE
                        coefs = [-15.4, -8.26, -2.787, -0.831, -0.198, 0.1539, 0.12248, 0.02175];
                    }
                    else {
                        // ILLUMINATED ZONE
                        coefs = [0, 0.109, -0.815, 0.479, 0.3284, 0.04385];
                    }
                    for (let i = 0; i < coefs.length; i++) {
                        barrier_corr += coefs[i] * Math.pow(x, i);
                    }
                }
                noise_lvl += barrier_corr;
                if (PRINT) {
                    console.log("     barrier_corr", barrier_corr, noise_lvl);
                }
            }
            // apply view angle correction - see chart 10
            const view_ang_corr = 10 * Math.log10(view_ang / Math.PI);
            noise_lvl += view_ang_corr;
            if (PRINT) {
                console.log("     view_ang", view_ang * (180 / Math.PI), "degrees");
            }
            if (PRINT) {
                console.log("     view_ang_corr", view_ang_corr, noise_lvl);
            }
            // check if noise level is below zero 
            if (noise_lvl < 0) {
                noise_lvl = 0;
            }
            // save the noise level for segment
            noise_lvls.push(noise_lvl);
            // generate calculation lines
            if (generate_lines) {
                (0, _shared_1._initLineCol)(__model__);
                const tmp_posis_i = [];
                if (sensor_xyz !== sensor_xyz2) {
                    path.splice(0, 0, sensor_xyz);
                }
                for (const xyz of path) {
                    const posi_i = (0, _shared_1._addPosi)(__model__, xyz);
                    tmp_posis_i.push(posi_i);
                }
                const pline_i = __model__.modeldata.geom.add.addPline(tmp_posis_i, false);
                const verts_i = __model__.modeldata.geom.nav.navAnyToVert(mobius_sim_1.EEntType.PLINE, pline_i);
                // line colour
                __model__.modeldata.attribs.set.setEntAttribVal(mobius_sim_1.EEntType.PLINE, pline_i, 'material', 'line_mat');
                // set col direct line is red, all other lines are white
                const col = path.length === 2 ? [1, 0, 0] : [0, 0, 1];
                __model__.modeldata.attribs.set.setEntsAttribVal(mobius_sim_1.EEntType.VERT, verts_i, 'rgb', col);
            }
        }
        // merge results from multiple road segments - see chart 11 
        // L = 10 * Log(  sum( Antilog(Ln/10) )  )
        const noise_lvls_pow = noise_lvls.map(lvl => Math.pow(10, lvl / 10));
        const noise_lvls_sum = noise_lvls_pow.reduce((a, b) => a + b, 0);
        const noise_lvl_final = 10 * Math.log10(noise_lvls_sum);
        if (PRINT) {
            console.log("    ---------------------------------");
        }
        if (PRINT) {
            console.log("    noise_lvl ALL", noise_lvls);
        }
        if (PRINT) {
            console.log("    noise_lvl COMBINED", noise_lvl_final);
        }
        results.push(noise_lvl_final);
    }
    return { noise_level: results };
}
// =================================================================================================
var ZONE;
(function (ZONE) {
    ZONE[ZONE["SHADOW"] = 0] = "SHADOW";
    ZONE[ZONE["ILLUMINATED"] = 1] = "ILLUMINATED";
    ZONE[ZONE["UNOBSTRUCTED"] = 2] = "UNOBSTRUCTED";
})(ZONE || (ZONE = {}));
// =================================================================================================
function _calcDetour(sensor, source, edges) {
    // create vector on ground that starts at sensor and points towards source
    const x_axis = (0, mobius_sim_1.vecNorm)((0, mobius_sim_1.vecFromTo)([sensor[0], sensor[1], 0], [source[0], source[1], 0]));
    // create a plane, origin at sensor
    const plane = [[sensor[0], sensor[1], 0], x_axis, [0, 0, 1]];
    // create matrix from plane
    const matrix0 = _xformMatrix(plane, true);
    const sensor_xform = (0, mobius_sim_1.multMatrix)(sensor, matrix0);
    const source_xform = (0, mobius_sim_1.multMatrix)(source, matrix0);
    const max_x = source_xform[0];
    // calc isects
    const isects = [];
    for (const [start, end] of edges) {
        const a = (0, mobius_sim_1.multMatrix)(start, matrix0);
        const b = (0, mobius_sim_1.multMatrix)(end, matrix0);
        if ((a[2] < 0 && b[2] < 0) || (a[2] > 0 && b[2] > 0)) {
            continue;
        }
        if ((a[0] < 0 && b[0] < 0) || (a[2] > max_x && b[2] > max_x)) {
            continue;
        }
        const pq = a[2] < b[2] ? [a, b] : [b, a];
        const vec_pq = (0, mobius_sim_1.vecFromTo)(pq[0], pq[1]);
        const zp = -1 * pq[0][2];
        const zpq = zp + pq[1][2];
        const isect = (0, mobius_sim_1.vecAdd)(pq[0], (0, mobius_sim_1.vecMult)(vec_pq, zp / zpq));
        if (isect[0] > 0 && isect[0] < max_x) {
            isects.push(isect);
        }
    }
    // if no isects, then this is unobstructed
    if (isects.length === 0) {
        return [[sensor, source], ZONE.UNOBSTRUCTED];
    }
    let [path, zone] = _convexHullDetour(sensor_xform, source_xform, isects);
    // reverse the matrix transformation
    const matrix1 = _xformMatrix(plane, false);
    path = path.map(xyz => (0, mobius_sim_1.multMatrix)(xyz, matrix1));
    // return teh result
    return [path, zone];
}
// =================================================================================================
function _convexHullDetour(sensor, source, isects) {
    // for any x val, get isects with the higest y val
    const x_to_isect = new Map();
    for (const isect of isects) {
        if (isect[1] <= EPS) {
            continue;
        }
        const x_rnd = lodash_1.default.round(isect[0], 2);
        if (!x_to_isect.has(x_rnd) || x_to_isect.get(x_rnd)[1] < isect[1]) {
            x_to_isect.set(x_rnd, isect);
        }
    }
    // create a list of filtered isects
    const isects_filt = Array.from(x_to_isect.values());
    // create list for d3 points
    const points_d3 = isects_filt.map(isect => [isect[0], isect[1]]);
    // convert source, add second to last
    const source_d3 = [source[0], source[1]];
    points_d3.push(source_d3);
    // convert sensor, add as last
    const sensor_d3 = [sensor[0], sensor[1]];
    points_d3.push(sensor_d3);
    // try assuming shadow zone, the hull will go over the top
    const detour_a_xyz = _convexHullDetourOver(sensor, source, isects_filt, points_d3);
    if (detour_a_xyz.length > 2) {
        return [detour_a_xyz, ZONE.SHADOW];
    }
    // must be illuminated zone, to force hull over the top, move d3 sensor down
    // d3 sensor is last in list
    points_d3[points_d3.length - 1][1] = 0;
    const detour_b_xyz = _convexHullDetourOver(sensor, source, isects_filt, points_d3);
    return [detour_b_xyz, ZONE.ILLUMINATED];
}
// =================================================================================================
function _convexHullDetourOver(sensor, source, isects, points_d3) {
    // create hull
    const hull_d3 = d3poly.polygonHull(points_d3);
    // get st
    const sensor_d3 = points_d3[points_d3.length - 1];
    const source_d3 = points_d3[points_d3.length - 2];
    // get the start and end indexes of the line that goes over the obstruction
    const start_idx = hull_d3.indexOf(sensor_d3);
    const end_idx = hull_d3.indexOf(source_d3);
    // get the xyzs of the detour line that goes over the obstruction
    const loop_end = end_idx < start_idx ? end_idx + hull_d3.length : end_idx;
    const detour_a_xyz = [sensor]; // start
    for (let i = start_idx + 1; i < loop_end; i++) {
        const point_d3 = hull_d3[i % hull_d3.length];
        const idx = points_d3.indexOf(point_d3);
        detour_a_xyz.push(isects[idx]);
    }
    detour_a_xyz.push(source); // end
    return detour_a_xyz;
}
// =================================================================================================
function _xformMatrix(plane, neg) {
    const o = new THREE.Vector3(...plane[0]);
    const x = new THREE.Vector3(...plane[1]);
    const y = new THREE.Vector3(...plane[2]);
    const z = new THREE.Vector3(...(0, mobius_sim_1.vecCross)(plane[1], plane[2]));
    if (neg) {
        o.negate();
    }
    // origin translate matrix
    const m1 = new THREE.Matrix4();
    m1.setPosition(o);
    // xfrom matrix
    const m2 = new THREE.Matrix4();
    m2.makeBasis(x, y, z);
    // combine two matrices
    const m3 = new THREE.Matrix4();
    if (neg) {
        const m2x = (new THREE.Matrix4()).copy(m2).invert();
        // first translate to origin, then xform, so m2 x m1
        m3.multiplyMatrices(m2x, m1);
    }
    else {
        // first xform, then translate to origin, so m1 x m2
        m3.multiplyMatrices(m1, m2);
    }
    // return the combined matrix
    return m3;
}
// =================================================================================================
function segments(xyz1, xyz2, len) {
    const vec = (0, mobius_sim_1.vecFromTo)(xyz1, xyz2);
    const num_segs = Math.floor((0, mobius_sim_1.vecLen)(vec) / len);
    if (num_segs < 2) {
        return [xyz1, xyz2];
    }
    const sub_vec = (0, mobius_sim_1.vecDiv)(vec, num_segs);
    const xyzs = [xyz1];
    for (let i = 0; i < num_segs; i++) {
        xyzs.push((0, mobius_sim_1.vecAdd)(xyz1, (0, mobius_sim_1.vecMult)(sub_vec, i + 1)));
    }
    return xyzs;
}
function _addPline() {
    throw new Error('Function not implemented.');
}
// =================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm9pc2VDUlROLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2FuYWx5emUvTm9pc2VDUlROLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBQy9CLDhEQXlCdUM7QUFDdkMsaURBQWdEO0FBQ2hELHdEQUEwQztBQUMxQyxtREFBcUM7QUFDckMsb0RBQTRCO0FBQzVCLHVDQUFvRjtBQUNwRixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFLakIsbURBQW1EO0FBQ25ELG9HQUFvRztBQUNwRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUNHO0FBQ0gsU0FBZ0IsU0FBUyxDQUNyQixTQUFrQixFQUNsQixPQUFrRCxFQUNsRCxRQUErQixFQUMvQixNQUFpQyxFQUNqQyxLQUE0QixFQUM1QixZQUE2QixFQUM3QixNQUFjO0lBRWQsUUFBUSxHQUFHLElBQUEsd0JBQVcsRUFBQyxRQUFRLENBQVUsQ0FBQztJQUMxQyxLQUFLLEdBQUcsSUFBQSx3QkFBVyxFQUFDLEtBQUssQ0FBVSxDQUFDO0lBQ3BDLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxjQUFjLENBQUM7SUFDL0IsSUFBSSxVQUF5QixDQUFDO0lBQzlCLElBQUksVUFBeUIsQ0FBQztJQUM5QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFDckMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN4RCxVQUFVLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFD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QixNQUFNLENBQUMsR0FBUyxJQUFBLHVCQUFVLEVBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxHQUFTLElBQUEsdUJBQVUsRUFBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFBRSxTQUFTO1NBQUU7UUFDbkUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUU7WUFBRSxTQUFTO1NBQUU7UUFDM0UsTUFBTSxFQUFFLEdBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2RCxNQUFNLE1BQU0sR0FBUyxJQUFBLHNCQUFTLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sRUFBRSxHQUFXLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxNQUFNLEdBQUcsR0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxDLE1BQU0sS0FBSyxH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