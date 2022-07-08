import * as Mathjs from 'mathjs';
import * as THREE from 'three';
import { arrMakeFlat, createSingleMeshBufTjs, distance, EEntType, idsBreak, isPlane, isRay, isXYZ, multMatrix, vecAdd, vecCross, vecFromTo, vecMult, vecNorm, vecSetLen, } from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import * as d3poly from 'd3-polygon';
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
export function Noise(__model__, sensors, entities, limits, sources) {
    entities = arrMakeFlat(entities);
    sources = arrMakeFlat(sources);
    // --- Error Check ---
    const fn_name = "analyze.View";
    let ents_arrs1;
    let ents_arrs2;
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origins", sensors, [chk.isRayL, chk.isPlnL]);
        ents_arrs1 = checkIDs(__model__, fn_name, "entities", entities, [ID.isIDL1], [EEntType.PGON, EEntType.COLL]);
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
        ents_arrs2 = checkIDs(__model__, fn_name, "targets", sources, [ID.isIDL1], null);
    }
    else {
        ents_arrs1 = idsBreak(entities);
        ents_arrs2 = idsBreak(sources);
    }
    // --- Error Check ---
    limits = Array.isArray(limits) ? limits : [0, limits];
    // get xyz for each sensor point
    const sensors_xyz = _getOriginXYZs(sensors, 0.01); // Offset by 0.01
    // Plane(__model__, sensors, 0.4);
    // get the target positions
    const target_posis_i = new Set();
    for (const [ent_type, ent_idx] of ents_arrs2) {
        if (ent_type === EEntType.POSI) {
            target_posis_i.add(ent_idx);
        }
        else {
            const ent_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_idx);
            for (const ent_posi_i of ent_posis_i) {
                target_posis_i.add(ent_posi_i);
            }
        }
    }
    const targets_xyz = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.POSI, Array.from(target_posis_i), 'xyz');
    // get edges of obstructions
    const edges = new Map();
    for (const [ent_type, ent_i] of ents_arrs1) {
        const edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const edge_i of edges_i) {
            const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
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
    const [mesh_tjs, _] = createSingleMeshBufTjs(__model__, ents_arrs1);
    // run the simulation
    const results = _calcNoise(__model__, sensors_xyz, targets_xyz, mesh_tjs, limits, edges);
    // cleanup
    mesh_tjs.geometry.dispose();
    mesh_tjs.material.dispose();
    // return the results
    return results;
}
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
            const dir = vecNorm(vecFromTo(sensor_xyz, target_xyz));
            dir_tjs.x = dir[0];
            dir_tjs.y = dir[1];
            dir_tjs.z = dir[2];
            // Ray(__model__, [sensor_xyz, dir], 1);
            const isects = ray_tjs.intersectObject(mesh_tjs, false);
            // get the result
            // if not intersection, the the target is visible
            const dist = distance(sensor_xyz, target_xyz);
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
        result.distance_ratio.push(total_dist / Mathjs.sum(all_dists));
    }
    return result;
}
// =================================================================================================
function _getOriginXYZs(origins, offset) {
    if (isXYZ(origins[0])) {
        // no offset in this case
        return origins;
    }
    const xyzs = [];
    const is_ray = isRay(origins[0]);
    const is_pln = isPlane(origins[0]);
    for (const origin of origins) {
        if (is_ray) {
            xyzs.push(vecAdd(origin[0], vecSetLen(origin[1], offset)));
        }
        else if (is_pln) {
            xyzs.push(vecAdd(origin[0], vecSetLen(vecCross(origin[1], origin[2]), offset)));
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
    const x_axis = vecNorm(vecFromTo([sensor[0], sensor[1], 0], [source[0], source[1], 0]));
    // create a plane, origin at sensor
    const plane = [[sensor[0], sensor[1], 0], x_axis, [0, 0, 1]];
    const matrix0 = _xformMatrix(plane, true);
    const sensor_xform = multMatrix(sensor, matrix0);
    const source_xform = multMatrix(source, matrix0);
    const max_x = source_xform[0];
    const isects = [];
    for (const [start, end] of edges.values()) {
        const a = multMatrix(start, matrix0);
        const b = multMatrix(end, matrix0);
        if ((a[2] < 0 && b[2] < 0) || (a[2] > 0 && b[2] > 0)) {
            continue;
        }
        if ((a[0] < 0 && b[0] < 0) || (a[2] > max_x && b[2] > max_x)) {
            continue;
        }
        const pq = a[2] < b[2] ? [a, b] : [b, a];
        const vec_pq = vecFromTo(pq[0], pq[1]);
        const zp = -1 * pq[0][2];
        const zpq = zp + pq[1][2];
        const isect = vecAdd(pq[0], vecMult(vec_pq, zp / zpq));
        if (isect[0] > 0 && isect[0] < max_x) {
            isects.push(isect);
        }
    }
    let [path, dist] = _convexHullDetour(sensor_xform, source_xform, isects);
    const matrix1 = _xformMatrix(plane, false); // debug only
    path = path.map(xyz => multMatrix(xyz, matrix1)); // debug only
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
    const z = new THREE.Vector3(...vecCross(plane[1], plane[2]));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm9pc2Vfb2xkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2FuYWx5emUvTm9pc2Vfb2xkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQ2pDLE9BQU8sS0FBSyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQy9CLE9BQU8sRUFDSCxXQUFXLEVBQ1gsc0JBQXNCLEVBQ3RCLFFBQVEsRUFDUixRQUFRLEVBRVIsUUFBUSxFQUNSLE9BQU8sRUFDUCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFPVixNQUFNLEVBQ04sUUFBUSxFQUNSLFNBQVMsRUFFVCxPQUFPLEVBQ1AsT0FBTyxFQUVQLFNBQVMsR0FJWixNQUFNLCtCQUErQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDaEQsT0FBTyxLQUFLLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQztBQUUxQyxPQUFPLEtBQUssTUFBTSxNQUFNLFlBQVksQ0FBQztBQVlyQyxvR0FBb0c7QUFDcEc7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUNILE1BQU0sVUFBVSxLQUFLLENBQ2pCLFNBQWtCLEVBQ2xCLE9BQW1DLEVBQ25DLFFBQStCLEVBQy9CLE1BQWlDLEVBQ2pDLE9BQThCO0lBRTlCLFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQVUsQ0FBQztJQUN4QyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDO0lBQy9CLElBQUksVUFBeUIsQ0FBQztJQUM5QixJQUFJLFVBQXlCLENBQUM7SUFDOUIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLFVBQVUsR0FBRyxRQUFRLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUMxRCxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFDWCxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFrQixDQUFDO1FBQ3JELEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN2QixJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNyQixNQUFNLElBQUksS0FBSyxDQUFDO3NDQUNNLENBQUMsQ0FBQzthQUMzQjtZQUNELElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQztzREFDc0IsQ0FBQyxDQUFDO2FBQzNDO1NBQ0o7UUFDRCxVQUFVLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQWtCLENBQUM7S0FDckc7U0FBTTtRQUNILFVBQVUsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFrQixDQUFDO1FBQ2pELFVBQVUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFrQixDQUFDO0tBQ25EO0lBQ0Qsc0JBQXNCO0lBQ3RCLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3RELGdDQUFnQztJQUNoQyxNQUFNLFdBQVcsR0FBVyxjQUFjLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCO0lBQzVFLGtDQUFrQztJQUNsQywyQkFBMkI7SUFDM0IsTUFBTSxjQUFjLEdBQWdCLElBQUksR0FBRyxFQUFFLENBQUM7SUFDOUMsS0FBSyxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxJQUFJLFVBQVUsRUFBRTtRQUMxQyxJQUFJLFFBQVEsS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQzVCLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDL0I7YUFBTTtZQUNILE1BQU0sV0FBVyxHQUFhLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzNGLEtBQUssTUFBTSxVQUFVLElBQUksV0FBVyxFQUFFO2dCQUNsQyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ2xDO1NBQ0o7S0FDSjtJQUNELE1BQU0sV0FBVyxHQUFXLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQ3ZFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxLQUFLLENBQVcsQ0FBQztJQUNoRSw0QkFBNEI7SUFDNUIsTUFBTSxLQUFLLEdBQThCLElBQUksR0FBRyxFQUFFLENBQUM7SUFDbkQsS0FBSyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxJQUFJLFVBQVUsRUFBRTtRQUN4QyxNQUFNLE9BQU8sR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyRixLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtZQUMxQixNQUFNLE9BQU8sR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDM0YsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsTUFBTSxHQUFHLEdBQVcsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2pCLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO29CQUNYLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzRCxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDOUQsQ0FBQyxDQUFDO2FBQ047U0FDSjtLQUNKO0lBQ0QsY0FBYztJQUNkLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQTJCLHNCQUFzQixDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM1RixxQkFBcUI7SUFDckIsTUFBTSxPQUFPLEdBQWlCLFVBQVUsQ0FBQyxTQUFTLEVBQzlDLFdBQVcsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN2RCxVQUFVO0lBQ1YsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMzQixRQUFRLENBQUMsUUFBMkIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNoRCxxQkFBcUI7SUFDckIsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQztBQUNELG9HQUFvRztBQUNwRyxTQUFTLFVBQVUsQ0FDZixTQUFrQixFQUNsQixXQUFtQixFQUNuQixXQUFtQixFQUNuQixRQUFvQixFQUNwQixNQUF3QixFQUN4QixLQUFpQztJQUVqQyx3QkFBd0I7SUFDeEIsTUFBTSxNQUFNLEdBQWlCLEVBQUUsQ0FBQztJQUNoQyxNQUFNLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNyQixNQUFNLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNyQixNQUFNLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNyQixxQkFBcUI7SUFDckIsMkJBQTJCO0lBQzNCLE1BQU0sQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBQzNCLGlEQUFpRDtJQUNqRCxNQUFNLFVBQVUsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDdEQsTUFBTSxPQUFPLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ25ELE1BQU0sT0FBTyxHQUFvQixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEcsYUFBYTtJQUNiLEtBQUssTUFBTSxVQUFVLElBQUksV0FBVyxFQUFFO1FBQ2xDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RixNQUFNLFlBQVksR0FBYSxFQUFFLENBQUM7UUFDbEMsTUFBTSxTQUFTLEdBQWEsRUFBRSxDQUFDO1FBQy9CLEtBQUssTUFBTSxVQUFVLElBQUksV0FBVyxFQUFFO1lBQ2xDLE1BQU0sR0FBRyxHQUFTLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDN0QsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNELHdDQUF3QztZQUN4QyxNQUFNLE1BQU0sR0FBeUIsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDOUUsaUJBQWlCO1lBQ2pCLGlEQUFpRDtZQUNqRCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzlDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsSUFBSSxJQUFZLENBQUM7WUFDakIsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtnQkFDbkQsNENBQTRDO2dCQUM1Qyx3Q0FBd0M7Z0JBQ3hDLElBQUksR0FBRyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDaEMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMzQjtpQkFBTTtnQkFDSCxxQkFBcUI7Z0JBQ3JCLDhEQUE4RDtnQkFDOUQsSUFBSSxXQUFXLEdBQVcsQ0FBQyxDQUFDO2dCQUM1QixDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsR0FBRyxXQUFXLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDakUsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUNsQztZQUNELCtCQUErQjtZQUMvQixNQUFNLFdBQVcsR0FBYSxFQUFFLENBQUM7WUFDakMsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7Z0JBQ3BCLE1BQU0sTUFBTSxHQUFXLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDOUQsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ25GLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDNUI7WUFDRCxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM3RDtRQUNELG1CQUFtQjtRQUNuQixNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVDLE1BQU0sUUFBUSxHQUFHLFVBQVUsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO1FBQ2xELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMxQyxnQkFBZ0I7UUFDaEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsbUNBQW1DO1FBQ25DLDhEQUE4RDtRQUM5RCxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBRSxTQUFTLENBQUUsQ0FBQyxDQUFDO0tBQ3BFO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQztBQUNELG9HQUFvRztBQUNwRyxTQUFTLGNBQWMsQ0FBQyxPQUFtQyxFQUFFLE1BQWM7SUFDdkUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDbkIseUJBQXlCO1FBQ3pCLE9BQU8sT0FBaUIsQ0FBQztLQUM1QjtJQUNELE1BQU0sSUFBSSxHQUFXLEVBQUUsQ0FBQztJQUN4QixNQUFNLE1BQU0sR0FBWSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsTUFBTSxNQUFNLEdBQVksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVDLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO1FBQzFCLElBQUksTUFBTSxFQUFFO1lBQ1IsSUFBSSxDQUFDLElBQUksQ0FBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBUyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFTLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBRSxDQUFDO1NBQ2hGO2FBQU0sSUFBSSxNQUFNLEVBQUU7WUFDZixJQUFJLENBQUMsSUFBSSxDQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFTLEVBQy9CLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQVMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUUsQ0FBQztTQUM1RTthQUFNO1lBQ0gsTUFBTSxJQUFJLEtBQUssQ0FBQyw2REFBNkQsR0FBRyxNQUFNLENBQUMsQ0FBQztTQUMzRjtLQUNKO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQUNELG9HQUFvRztBQUNwRyxTQUFTLFdBQVcsQ0FBQyxNQUFZLEVBQUUsTUFBWSxFQUFFLEtBQWlDO0lBQzlFLDBFQUEwRTtJQUMxRSxNQUFNLE1BQU0sR0FBUyxPQUFPLENBQUMsU0FBUyxDQUNsQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3pCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDNUIsQ0FBQyxDQUFDO0lBQ0gsbUNBQW1DO0lBQ25DLE1BQU0sS0FBSyxHQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRSxNQUFNLE9BQU8sR0FBa0IsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6RCxNQUFNLFlBQVksR0FBUyxVQUFVLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sWUFBWSxHQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdkQsTUFBTSxLQUFLLEdBQVcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLE1BQU0sTUFBTSxHQUFXLEVBQUUsQ0FBQztJQUMxQixLQUFLLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFO1FBQ3ZDLE1BQU0sQ0FBQyxHQUFTLFVBQVUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLEdBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUFFLFNBQVM7U0FBRTtRQUNuRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRTtZQUFFLFNBQVM7U0FBRTtRQUMzRSxNQUFNLEVBQUUsR0FBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sTUFBTSxHQUFTLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsTUFBTSxFQUFFLEdBQVcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sR0FBRyxHQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbEMsTUFBTSxLQUFLLEdBQVMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzNELElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFO1lBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7U0FDckI7S0FDSjtJQUNELElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQXFCLGlCQUFpQixDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0YsTUFBTSxPQUFPLEdBQWtCLFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhO0lBQ3hFLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBRSxDQUFDLENBQUMsYUFBYTtJQUNqRSxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFDRCxvR0FBb0c7QUFDcEcsU0FBUyxpQkFBaUIsQ0FBQyxNQUFZLEVBQUUsTUFBWSxFQUFFLE1BQWM7SUFDakUsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUFFLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FBRTtJQUM5RSxpQkFBaUI7SUFDakIsTUFBTSxTQUFTLEdBQXVCLEVBQUUsQ0FBQztJQUN6QyxLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtRQUN4QixTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDeEM7SUFDRCw0QkFBNEI7SUFDNUIsTUFBTSxTQUFTLEdBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsTUFBTSxTQUFTLEdBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQixTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLGNBQWM7SUFDZCxNQUFNLE9BQU8sR0FBdUIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNsRSwyRUFBMkU7SUFDM0UsTUFBTSxTQUFTLEdBQVcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyRCxNQUFNLE9BQU8sR0FBVyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25ELGlFQUFpRTtJQUNqRSxNQUFNLFFBQVEsR0FBVyxPQUFPLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ2xGLE1BQU0sWUFBWSxHQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRO0lBQy9DLElBQUksS0FBSyxHQUFXLENBQUMsQ0FBQztJQUN0QixLQUFLLElBQUksQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRztRQUM1QyxNQUFNLFFBQVEsR0FBUSxPQUFPLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRCxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEIsS0FBSyxHQUFHLFFBQVEsQ0FBQztZQUNqQixNQUFNO1NBQ1Q7UUFDRCxNQUFNLEdBQUcsR0FBVyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0IsS0FBSyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDNUQ7SUFDRCxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTTtJQUNqQyxLQUFLLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RCxrRUFBa0U7SUFDbEUsTUFBTSxVQUFVLEdBQVcsU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUMxRixNQUFNLFlBQVksR0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUTtJQUMvQyxJQUFJLEtBQUssR0FBVyxDQUFDLENBQUM7SUFDdEIsS0FBSyxJQUFJLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUc7UUFDNUMsTUFBTSxRQUFRLEdBQVEsT0FBTyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEQsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xCLEtBQUssR0FBRyxRQUFRLENBQUM7WUFDakIsTUFBTTtTQUNUO1FBQ0QsTUFBTSxHQUFHLEdBQVcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRCxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9CLEtBQUssSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzVEO0lBQ0QsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU07SUFDakMsS0FBSyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekQsNkRBQTZEO0lBQzdELE9BQU8sS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3pFLENBQUM7QUFDRCxvR0FBb0c7QUFDcEcsU0FBUyxZQUFZLENBQUMsS0FBYSxFQUFFLEdBQVk7SUFDN0MsTUFBTSxDQUFDLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELE1BQU0sQ0FBQyxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxNQUFNLENBQUMsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsTUFBTSxDQUFDLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RSxJQUFJLEdBQUcsRUFBRTtRQUNMLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNkO0lBQ0QsMEJBQTBCO0lBQzFCLE1BQU0sRUFBRSxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM5QyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLGVBQWU7SUFDZixNQUFNLEVBQUUsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDOUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLHVCQUF1QjtJQUN2QixNQUFNLEVBQUUsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDOUMsSUFBSSxHQUFHLEVBQUU7UUFDTCxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFFLEVBQUUsQ0FBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3RELG9EQUFvRDtRQUNwRCxFQUFFLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ2hDO1NBQU07UUFDSCxvREFBb0Q7UUFDcEQsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUMvQjtJQUNELDZCQUE2QjtJQUM3QixPQUFPLEVBQUUsQ0FBQztBQUNkLENBQUM7QUFDRCxvR0FBb0c7QUFDcEcsdUNBQXVDO0FBQ3ZDLFNBQVMsS0FBSyxDQUFDLEVBQVEsRUFBRSxFQUFRO0lBQzdCLE1BQU0sQ0FBQyxHQUFRO1FBQ1gsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDYixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNoQixDQUFDO0lBQ0YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBQ0Qsb0dBQW9HIn0=