import * as Mathjs from 'mathjs';
import * as THREE from 'three';
import {
    arrMakeFlat,
    createSingleMeshBufTjs,
    distance,
    EEntType,
    GIModel,
    idsBreak,
    isPlane,
    isRay,
    isXYZ,
    multMatrix,
    TEntTypeIdx,
    TId,
    TPlane,
    TRay,
    Txy,
    Txyz,
    vecAdd,
    vecCross,
    vecFromTo,
    vecLen,
    vecMult,
    vecNorm,
    vecRot,
    vecSetLen,
    xformMatrix,
    xfromSourceTargetMatrix,
    XYPLANE,
} from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { Ray } from '../visualize/Ray';
import * as d3poly from 'd3-polygon';
// import { Plane } from '../visualize/Plane';

// ================================================================================================
interface TNoiseResult {
    avg_dist?: number[];
    min_dist?: number[];
    max_dist?: number[];
    // count?: number[];
    // count_ratio?: number[];
    distance_ratio?: number[];
}
// =================================================================================================
/**
 * Calculates the noise impact on a set of sensors from a set of noise sources.
 * \n
 * Typically, the sensors are created as centroids of a set of windows. The noise sources are 
 * typically placed along road centrelines. 
 * \n
 * The noise impact is calculated by shooting rays out from the sensors towards the noise sources.
 * The 'radius' argument defines the maximum radius of the calculation.
 * (The radius is used to define the maximum distance for shooting the rays.)
 * \n
 * Returns a dictionary containing different metrics.
 * \n
 * @param __model__
 * @param sensors A list of Rays or Planes, to be used as the origins for calculating the unobstructed views.
 * @param entities The obstructions: faces, polygons, or collections.
 * @param limits The maximum radius of the visibility analysis.
 * @param sources Positions defining the noise sources. 
 * @returns A dictionary containing different visibility metrics.
 */
export function Noise(
    __model__: GIModel,
    sensors: Txyz[] | TRay[] | TPlane[],
    entities: TId | TId[] | TId[][],
    limits: number | [number, number],
    sources: TId | TId[] | TId[][],
): TNoiseResult {
    entities = arrMakeFlat(entities) as TId[];
    sources = arrMakeFlat(sources) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.View";
    let ents_arrs1: TEntTypeIdx[];
    let ents_arrs2: TEntTypeIdx[];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origins", sensors, [chk.isRayL, chk.isPlnL]);
        ents_arrs1 = checkIDs(__model__, fn_name, "entities", entities, 
            [ID.isIDL1], 
            [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        chk.checkArgs(fn_name, "radius", limits, [chk.isNum, chk.isNumL]);
        if (Array.isArray(limits)) {
            if (limits.length !== 2) {
                throw new Error('If "radius" is a list, it must have a length of two: \
                [min_dist, max_dist].');
            }
            if (limits[0] >= limits[1]) {
                throw new Error('If "radius" is a list, the "min_dist" must be less than \
                the "max_dist": [min_dist, max_dist].');
            }
        }
        ents_arrs2 = checkIDs(__model__, fn_name, "targets", sources, [ID.isIDL1], null) as TEntTypeIdx[];
    } else {
        ents_arrs1 = idsBreak(entities) as TEntTypeIdx[];
        ents_arrs2 = idsBreak(sources) as TEntTypeIdx[];
    }
    // --- Error Check ---
    limits = Array.isArray(limits) ? limits : [0, limits];
    // get xyz for each sensor point
    const sensors_xyz: Txyz[] = _getOriginXYZs(sensors, 0.01); // Offset by 0.01
    // Plane(__model__, sensors, 0.4);
    // get the target positions
    const target_posis_i: Set<number> = new Set();
    for (const [ent_type, ent_idx] of ents_arrs2) {
        if (ent_type === EEntType.POSI) {
            target_posis_i.add(ent_idx);
        } else {
            const ent_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_idx);
            for (const ent_posi_i of ent_posis_i) {
                target_posis_i.add(ent_posi_i);
            }
        }
    }
    const targets_xyz: Txyz[] = __model__.modeldata.attribs.get.getEntAttribVal(
        EEntType.POSI, Array.from(target_posis_i), 'xyz') as Txyz[];
    // get edges of obstructions
    const edges: Map<string, [Txyz, Txyz]> = new Map();
    for (const [ent_type, ent_i] of ents_arrs1) {
        const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const edge_i of edges_i) {
            const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            posis_i.sort();
            const key: string = posis_i[0] + '_' + posis_i[1];
            if (!edges.has(key)) {
                edges.set(key, [
                    __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]),
                    __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1])
                ]);
            }
        }
    }
    // create mesh
    const [mesh_tjs, _]: [THREE.Mesh, number[]] = createSingleMeshBufTjs(__model__, ents_arrs1);
    // run the simulation
    const results: TNoiseResult = _calcNoise(__model__, 
        sensors_xyz, targets_xyz, mesh_tjs, limits, edges);
    // cleanup
    mesh_tjs.geometry.dispose();
    (mesh_tjs.material as THREE.Material).dispose();
    // return the results
    return results;
}
// =================================================================================================
function _calcNoise(
    __model__: GIModel,
    sensors_xyz: Txyz[],
    sources_xyz: Txyz[],
    mesh_tjs: THREE.Mesh,
    limits: [number, number],
    edges:  Map<string, [Txyz, Txyz]>
): TNoiseResult {
    // create data structure
    const result: TNoiseResult = {};
    result.avg_dist = [];
    result.min_dist = [];
    result.max_dist = [];
    // result.count = [];
    // result.count_ratio = [];
    result.distance_ratio = [];
    // create tjs objects (to be resued for each ray)
    const origin_tjs: THREE.Vector3 = new THREE.Vector3();
    const dir_tjs: THREE.Vector3 = new THREE.Vector3();
    const ray_tjs: THREE.Raycaster = new THREE.Raycaster(origin_tjs, dir_tjs, limits[0], limits[1]);
    // shoot rays
    for (const sensor_xyz of sensors_xyz) {
        origin_tjs.x = sensor_xyz[0]; origin_tjs.y = sensor_xyz[1]; origin_tjs.z = sensor_xyz[2]; 
        const result_dists: number[] = [];
        const all_dists: number[] = [];
        for (const target_xyz of sources_xyz) {
            const dir: Txyz = vecNorm(vecFromTo(sensor_xyz, target_xyz));
            dir_tjs.x = dir[0]; dir_tjs.y = dir[1]; dir_tjs.z = dir[2];
            // Ray(__model__, [sensor_xyz, dir], 1);
            const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh_tjs, false);
            // get the result
            // if not intersection, the the target is visible
            const dist = distance(sensor_xyz, target_xyz);
            all_dists.push(dist);
            let path: Txyz[];
            if (isects.length === 0 || isects[0].distance >= dist) {
                // straight line from sensor to noise source
                // or it hit something behind the source
                path = [sensor_xyz, target_xyz];
                result_dists.push(dist);
            } else {
                // hit an obstruction
                // now we need to calc a path that goes around (over) obstacle
                let detour_dist: number = 0;
                [path, detour_dist] = _calcDetour(sensor_xyz, target_xyz, edges);
                result_dists.push(detour_dist);
            }
            // for debugging, draw the path
            const tmp_posis_i: number[] = [];
            for (const xyz of path) {
                const posi_i: number = __model__.modeldata.geom.add.addPosi();
                __model__.modeldata.attribs.set.setEntAttribVal(EEntType.POSI, posi_i, 'xyz', xyz);
                tmp_posis_i.push(posi_i);
            }
            __model__.modeldata.geom.add.addPline(tmp_posis_i, false);
        }
        // calc the metrics
        const total_dist = Mathjs.sum(result_dists);
        const avg_dist = total_dist / result_dists.length;
        const min_dist = Mathjs.min(result_dists);
        const max_dist = Mathjs.max(result_dists);
        // save the data
        result.avg_dist.push(avg_dist);
        result.min_dist.push(min_dist);
        result.max_dist.push(max_dist);
        // result.count.push(result_count);
        // result.count_ratio.push(result_count / targets_xyz.length);
        result.distance_ratio.push(total_dist / Mathjs.sum( all_dists ));
    }
    return result;
}
// =================================================================================================
function _getOriginXYZs(origins: Txyz[] | TRay[] | TPlane[], offset: number): Txyz[] {
    if (isXYZ(origins[0])) {
        // no offset in this case
        return origins as Txyz[];
    }
    const xyzs: Txyz[] = [];
    const is_ray: boolean = isRay(origins[0]);
    const is_pln: boolean = isPlane(origins[0]);
    for (const origin of origins) {
        if (is_ray) {
            xyzs.push( vecAdd(origin[0] as Txyz, vecSetLen(origin[1] as Txyz, offset)) );
        } else if (is_pln) {
            xyzs.push( vecAdd(origin[0] as Txyz, 
                vecSetLen(vecCross(origin[1] as Txyz, origin[2] as Txyz), offset)) );
        } else {
            throw new Error("analyze.Visibiltiy: origins arg contains an invalid value: " + origin);
        }
    }
    return xyzs;
}
// =================================================================================================
function _calcDetour(sensor: Txyz, source: Txyz, edges:  Map<string, [Txyz, Txyz]>): [Txyz[], number] {
    // create vector on ground that starts at sensor and points towards source
    const x_axis: Txyz = vecNorm(vecFromTo(
        [sensor[0], sensor[1], 0], 
        [source[0], source[1], 0]
    ));
    // create a plane, origin at sensor
    const plane: TPlane = [[sensor[0], sensor[1], 0], x_axis, [0,0,1]];
    const matrix0: THREE.Matrix4 = _xformMatrix(plane, true);
    const sensor_xform: Txyz = multMatrix(sensor, matrix0);
    const source_xform: Txyz = multMatrix(source, matrix0);
    const max_x: number = source_xform[0];
    const isects: Txyz[] = [];
    for (const [start, end] of edges.values()) {
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
    let [path, dist]: [Txyz[], number] = _convexHullDetour(sensor_xform, source_xform, isects);
    const matrix1: THREE.Matrix4 = _xformMatrix(plane, false); // debug only
    path = path.map( xyz => multMatrix(xyz, matrix1) ); // debug only
    return [path, dist];
}
// =================================================================================================
function _convexHullDetour(sensor: Txyz, source: Txyz, isects: Txyz[]): [Txyz[], number] {
    if (isects.length === 0) { return [[sensor, source], _dist(sensor, source)]; }
    // convert isects
    const points_d3: [number, number][] = [];
    for (const isect of isects) {
        points_d3.push([isect[0], isect[1]]);
    }
    // convert sensor and source
    const sensor_d3: Txy = [sensor[0], sensor[1]];
    const source_d3: Txy = [source[0], source[1]];
    points_d3.push(sensor_d3);
    points_d3.push(source_d3);
    // create hull
    const hull_d3: [number, number][] = d3poly.polygonHull(points_d3);
    // get the start and end indexes of the line that goes over the obstruction
    const start_idx: number = hull_d3.indexOf(sensor_d3);
    const end_idx: number = hull_d3.indexOf(source_d3);
    // get the xyzs of the detour line that goes over the obstruction
    const loop_end: number = end_idx < start_idx ? end_idx + hull_d3.length : end_idx;
    const detour_a_xyz: Txyz[] = [sensor]; // start
    let len_a: number = 0;
    for (let i = start_idx + 1; i < loop_end; i++ ) {
        const point_d3: Txy = hull_d3[i % hull_d3.length];
        if (point_d3[1] <= 0) {
            len_a = Infinity;
            break;
        }
        const idx: number = points_d3.indexOf(point_d3);
        detour_a_xyz.push(isects[idx]);
        len_a += _dist(detour_a_xyz.at(-2), detour_a_xyz.at(-1));
    }
    detour_a_xyz.push(source); // end
    len_a += _dist(detour_a_xyz.at(-2), detour_a_xyz.at(-1));
    // get the xyzs of the detour line that goes under the obstruction
    const loop_start: number = start_idx < start_idx ? start_idx + hull_d3.length : start_idx;
    const detour_b_xyz: Txyz[] = [sensor]; // start
    let len_b: number = 0;
    for (let i = loop_start - 1; i > end_idx; i-- ) {
        const point_d3: Txy = hull_d3[i % hull_d3.length];
        if (point_d3[1] <= 0) {
            len_b = Infinity;
            break;
        }
        const idx: number = points_d3.indexOf(point_d3);
        detour_b_xyz.push(isects[idx]);
        len_b += _dist(detour_b_xyz.at(-2), detour_b_xyz.at(-1));
    }
    detour_b_xyz.push(source); // end
    len_b += _dist(detour_b_xyz.at(-2), detour_b_xyz.at(-1));
    // return the list of xyzs and the dist for the shortest path
    return len_a > len_b ? [detour_b_xyz, len_b] : [detour_a_xyz, len_a];
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
// euclidean distance with x and y only
function _dist(c1: Txyz, c2: Txyz): number {
    const v: Txy = [
        c1[0] - c2[0],
        c1[1] - c2[1]
    ];
    return Math.hypot(v[0], v[1]);
}
// =================================================================================================