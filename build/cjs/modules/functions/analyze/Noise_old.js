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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Noise = void 0;
const Mathjs = __importStar(require("mathjs"));
const THREE = __importStar(require("three"));
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../_check_ids");
const chk = __importStar(require("../../_check_types"));
const d3poly = __importStar(require("d3-polygon"));
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
function Noise(__model__, sensors, entities, limits, sources) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    sources = (0, mobius_sim_1.arrMakeFlat)(sources);
    // --- Error Check ---
    const fn_name = "analyze.View";
    let ents_arrs1;
    let ents_arrs2;
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origins", sensors, [chk.isRayL, chk.isPlnL]);
        ents_arrs1 = (0, _check_ids_1.checkIDs)(__model__, fn_name, "entities", entities, [_check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.PGON, mobius_sim_1.EEntType.COLL]);
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
        ents_arrs2 = (0, _check_ids_1.checkIDs)(__model__, fn_name, "targets", sources, [_check_ids_1.ID.isIDL1], null);
    }
    else {
        ents_arrs1 = (0, mobius_sim_1.idsBreak)(entities);
        ents_arrs2 = (0, mobius_sim_1.idsBreak)(sources);
    }
    // --- Error Check ---
    limits = Array.isArray(limits) ? limits : [0, limits];
    // get xyz for each sensor point
    const sensors_xyz = _getOriginXYZs(sensors, 0.01); // Offset by 0.01
    // Plane(__model__, sensors, 0.4);
    // get the target positions
    const target_posis_i = new Set();
    for (const [ent_type, ent_idx] of ents_arrs2) {
        if (ent_type === mobius_sim_1.EEntType.POSI) {
            target_posis_i.add(ent_idx);
        }
        else {
            const ent_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_idx);
            for (const ent_posi_i of ent_posis_i) {
                target_posis_i.add(ent_posi_i);
            }
        }
    }
    const targets_xyz = __model__.modeldata.attribs.get.getEntAttribVal(mobius_sim_1.EEntType.POSI, Array.from(target_posis_i), 'xyz');
    // get edges of obstructions
    const edges = new Map();
    for (const [ent_type, ent_i] of ents_arrs1) {
        const edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const edge_i of edges_i) {
            const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.EDGE, edge_i);
            posis_i.sort();
            const key = posis_i[0] + '_' + posis_i[1];
            if (!edges.has(key)) {
                edges.set(key, [
                    __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]),
                    __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1])
                ]);
            }
        }
    }
    // create mesh
    const [mesh_tjs, _] = (0, mobius_sim_1.createSingleMeshBufTjs)(__model__, ents_arrs1);
    // run the simulation
    const results = _calcNoise(__model__, sensors_xyz, targets_xyz, mesh_tjs, limits, edges);
    // cleanup
    mesh_tjs.geometry.dispose();
    mesh_tjs.material.dispose();
    // return the results
    return results;
}
exports.Noise = Noise;
// =================================================================================================
function _calcNoise(__model__, sensors_xyz, sources_xyz, mesh_tjs, limits, edges) {
    // create data structure
    const result = {};
    result.avg_dist = [];
    result.min_dist = [];
    result.max_dist = [];
    // result.count = [];
    // result.count_ratio = [];
    result.distance_ratio = [];
    // create tjs objects (to be resued for each ray)
    const origin_tjs = new THREE.Vector3();
    const dir_tjs = new THREE.Vector3();
    const ray_tjs = new THREE.Raycaster(origin_tjs, dir_tjs, limits[0], limits[1]);
    // shoot rays
    for (const sensor_xyz of sensors_xyz) {
        origin_tjs.x = sensor_xyz[0];
        origin_tjs.y = sensor_xyz[1];
        origin_tjs.z = sensor_xyz[2];
        const result_dists = [];
        const all_dists = [];
        for (const target_xyz of sources_xyz) {
            const dir = (0, mobius_sim_1.vecNorm)((0, mobius_sim_1.vecFromTo)(sensor_xyz, target_xyz));
            dir_tjs.x = dir[0];
            dir_tjs.y = dir[1];
            dir_tjs.z = dir[2];
            // Ray(__model__, [sensor_xyz, dir], 1);
            const isects = ray_tjs.intersectObject(mesh_tjs, false);
            // get the result
            // if not intersection, the the target is visible
            const dist = (0, mobius_sim_1.distance)(sensor_xyz, target_xyz);
            all_dists.push(dist);
            let path;
            if (isects.length === 0 || isects[0].distance >= dist) {
                // straight line from sensor to noise source
                // or it hit something behind the source
                path = [sensor_xyz, target_xyz];
                result_dists.push(dist);
            }
            else {
                // hit an obstruction
                // now we need to calc a path that goes around (over) obstacle
                let detour_dist = 0;
                [path, detour_dist] = _calcDetour(sensor_xyz, target_xyz, edges);
                result_dists.push(detour_dist);
            }
            // for debugging, draw the path
            const tmp_posis_i = [];
            for (const xyz of path) {
                const posi_i = __model__.modeldata.geom.add.addPosi();
                __model__.modeldata.attribs.set.setEntAttribVal(mobius_sim_1.EEntType.POSI, posi_i, 'xyz', xyz);
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
        result.distance_ratio.push(total_dist / Mathjs.sum(all_dists));
    }
    return result;
}
// =================================================================================================
function _getOriginXYZs(origins, offset) {
    if ((0, mobius_sim_1.isXYZ)(origins[0])) {
        // no offset in this case
        return origins;
    }
    const xyzs = [];
    const is_ray = (0, mobius_sim_1.isRay)(origins[0]);
    const is_pln = (0, mobius_sim_1.isPlane)(origins[0]);
    for (const origin of origins) {
        if (is_ray) {
            xyzs.push((0, mobius_sim_1.vecAdd)(origin[0], (0, mobius_sim_1.vecSetLen)(origin[1], offset)));
        }
        else if (is_pln) {
            xyzs.push((0, mobius_sim_1.vecAdd)(origin[0], (0, mobius_sim_1.vecSetLen)((0, mobius_sim_1.vecCross)(origin[1], origin[2]), offset)));
        }
        else {
            throw new Error("analyze.Visibiltiy: origins arg contains an invalid value: " + origin);
        }
    }
    return xyzs;
}
// =================================================================================================
function _calcDetour(sensor, source, edges) {
    // create vector on ground that starts at sensor and points towards source
    const x_axis = (0, mobius_sim_1.vecNorm)((0, mobius_sim_1.vecFromTo)([sensor[0], sensor[1], 0], [source[0], source[1], 0]));
    // create a plane, origin at sensor
    const plane = [[sensor[0], sensor[1], 0], x_axis, [0, 0, 1]];
    const matrix0 = _xformMatrix(plane, true);
    const sensor_xform = (0, mobius_sim_1.multMatrix)(sensor, matrix0);
    const source_xform = (0, mobius_sim_1.multMatrix)(source, matrix0);
    const max_x = source_xform[0];
    const isects = [];
    for (const [start, end] of edges.values()) {
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
    let [path, dist] = _convexHullDetour(sensor_xform, source_xform, isects);
    const matrix1 = _xformMatrix(plane, false); // debug only
    path = path.map(xyz => (0, mobius_sim_1.multMatrix)(xyz, matrix1)); // debug only
    return [path, dist];
}
// =================================================================================================
function _convexHullDetour(sensor, source, isects) {
    if (isects.length === 0) {
        return [[sensor, source], _dist(sensor, source)];
    }
    // convert isects
    const points_d3 = [];
    for (const isect of isects) {
        points_d3.push([isect[0], isect[1]]);
    }
    // convert sensor and source
    const sensor_d3 = [sensor[0], sensor[1]];
    const source_d3 = [source[0], source[1]];
    points_d3.push(sensor_d3);
    points_d3.push(source_d3);
    // create hull
    const hull_d3 = d3poly.polygonHull(points_d3);
    // get the start and end indexes of the line that goes over the obstruction
    const start_idx = hull_d3.indexOf(sensor_d3);
    const end_idx = hull_d3.indexOf(source_d3);
    // get the xyzs of the detour line that goes over the obstruction
    const loop_end = end_idx < start_idx ? end_idx + hull_d3.length : end_idx;
    const detour_a_xyz = [sensor]; // start
    let len_a = 0;
    for (let i = start_idx + 1; i < loop_end; i++) {
        const point_d3 = hull_d3[i % hull_d3.length];
        if (point_d3[1] <= 0) {
            len_a = Infinity;
            break;
        }
        const idx = points_d3.indexOf(point_d3);
        detour_a_xyz.push(isects[idx]);
        len_a += _dist(detour_a_xyz.at(-2), detour_a_xyz.at(-1));
    }
    detour_a_xyz.push(source); // end
    len_a += _dist(detour_a_xyz.at(-2), detour_a_xyz.at(-1));
    // get the xyzs of the detour line that goes under the obstruction
    const loop_start = start_idx < start_idx ? start_idx + hull_d3.length : start_idx;
    const detour_b_xyz = [sensor]; // start
    let len_b = 0;
    for (let i = loop_start - 1; i > end_idx; i--) {
        const point_d3 = hull_d3[i % hull_d3.length];
        if (point_d3[1] <= 0) {
            len_b = Infinity;
            break;
        }
        const idx = points_d3.indexOf(point_d3);
        detour_b_xyz.push(isects[idx]);
        len_b += _dist(detour_b_xyz.at(-2), detour_b_xyz.at(-1));
    }
    detour_b_xyz.push(source); // end
    len_b += _dist(detour_b_xyz.at(-2), detour_b_xyz.at(-1));
    // return the list of xyzs and the dist for the shortest path
    return len_a > len_b ? [detour_b_xyz, len_b] : [detour_a_xyz, len_a];
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
// euclidean distance with x and y only
function _dist(c1, c2) {
    const v = [
        c1[0] - c2[0],
        c1[1] - c2[1]
    ];
    return Math.hypot(v[0], v[1]);
}
// =================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm9pc2Vfb2xkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2FuYWx5emUvTm9pc2Vfb2xkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0NBQWlDO0FBQ2pDLDZDQUErQjtBQUMvQiw4REE0QnVDO0FBQ3ZDLGlEQUFnRDtBQUNoRCx3REFBMEM7QUFFMUMsbURBQXFDO0FBWXJDLG9HQUFvRztBQUNwRzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBQ0gsU0FBZ0IsS0FBSyxDQUNqQixTQUFrQixFQUNsQixPQUFtQyxFQUNuQyxRQUErQixFQUMvQixNQUFpQyxFQUNqQyxPQUE4QjtJQUU5QixRQUFRLEdBQUcsSUFBQSx3QkFBVyxFQUFDLFFBQVEsQ0FBVSxDQUFDO0lBQzFDLE9BQU8sR0FBRyxJQUFBLHdCQUFXLEVBQUMsT0FBTyxDQUFVLENBQUM7SUFDeEMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQztJQUMvQixJQUFJLFVBQXlCLENBQUM7SUFDOUIsSUFBSSxVQUF5QixDQUFDO0lBQzlCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNyRSxVQUFVLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDMUQsQ0FBQyxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQ1gsQ0FBQyxxQkFBUSxDQUFDLElBQUksRUFBRSxxQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFrQixDQUFDO1FBQ3JELEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxN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