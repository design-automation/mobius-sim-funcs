import * as Mathjs from 'mathjs';
import * as THREE from 'three';
import { arrMakeFlat, createSingleMeshBufTjs, distance, EEntType, idsBreak, isPlane, isRay, isXYZ, multMatrix, vecAdd, vecCross, vecFromTo, vecNorm, vecRot, vecSetLen, xformMatrix, } from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../../_check_ids';
import * as chk from '../../../_check_types';
/**
 * Calculates the visibility of a set of target positions from a set of origins.
 * \n
 * Typically, the origins are created as centroids of a set of windows. The targets are a set of positions
 * whose visibility is to be analysed.
 * \n
 * The visibility is calculated by shooting rays out from the origins towards the targets.
 * The 'radius' argument defines the maximum radius of the visibility.
 * (The radius is used to define the maximum distance for shooting the rays.)
 * \n
 * Returns a dictionary containing different visibility metrics.
 * \n
 * \n
 * @param __model__
 * @param origins A list of Rays or Planes, to be used as the origins for calculating the uobstructed views.
 * @param entities The obstructions: faces, polygons, or collections.
 * @param radius The maximum radius of the visibility analysis.
 * @param targets The traget positions.
 */
export function Visibility(__model__, origins, entities, radius, targets) {
    entities = arrMakeFlat(entities);
    targets = arrMakeFlat(targets);
    // --- Error Check ---
    const fn_name = "analyze.View";
    let ents_arrs1;
    let ents_arrs2;
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origins", origins, [chk.isRayL, chk.isPlnL]);
        ents_arrs1 = checkIDs(__model__, fn_name, "entities", entities, [ID.isIDL1], [EEntType.PGON, EEntType.COLL]);
        chk.checkArgs(fn_name, "radius", radius, [chk.isNum, chk.isNumL]);
        if (Array.isArray(radius)) {
            if (radius.length !== 2) {
                throw new Error('If "radius" is a list, it must have a length of two: [min_dist, max_dist].');
            }
            if (radius[0] >= radius[1]) {
                throw new Error('If "radius" is a list, the "min_dist" must be less than the "max_dist": [min_dist, max_dist].');
            }
        }
        ents_arrs2 = checkIDs(__model__, fn_name, "targets", targets, [ID.isIDL1], null);
    }
    else {
        ents_arrs1 = idsBreak(entities);
        ents_arrs2 = idsBreak(targets);
    }
    // --- Error Check ---
    // get planes for each sensor point
    const sensors_xyz = _getOriginXYZs(origins, 0.01); // Offset by 0.01
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
    // create mesh
    const [mesh_tjs, idx_to_face_i] = createSingleMeshBufTjs(__model__, ents_arrs1);
    // create data structure
    const result = {};
    result.avg_dist = [];
    result.min_dist = [];
    result.max_dist = [];
    result.count = [];
    result.count_ratio = [];
    result.distance_ratio = [];
    // create tjs objects (to be resued for each ray)
    const origin_tjs = new THREE.Vector3();
    const dir_tjs = new THREE.Vector3();
    const ray_tjs = new THREE.Raycaster(origin_tjs, dir_tjs, 0, radius);
    // shoot rays
    for (const sensor_xyz of sensors_xyz) {
        origin_tjs.x = sensor_xyz[0];
        origin_tjs.y = sensor_xyz[1];
        origin_tjs.z = sensor_xyz[2];
        const result_dists = [];
        let result_count = 0;
        const all_dists = [];
        for (const target_xyz of targets_xyz) {
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
            if (isects.length === 0) {
                result_dists.push(dist);
                result_count += 1;
            }
        }
        if (result_count > 0) {
            // calc the metrics
            const total_dist = Mathjs.sum(result_dists);
            const avg_dist = total_dist / result_dists.length;
            const min_dist = Mathjs.min(result_dists);
            const max_dist = Mathjs.max(result_dists);
            // save the data
            result.avg_dist.push(avg_dist);
            result.min_dist.push(min_dist);
            result.max_dist.push(max_dist);
            result.count.push(result_count);
            result.count_ratio.push(result_count / targets_xyz.length);
            result.distance_ratio.push(total_dist / Mathjs.sum(all_dists));
        }
        else {
            result.avg_dist.push(null);
            result.min_dist.push(null);
            result.max_dist.push(null);
            result.count.push(result_count);
            result.count_ratio.push(0);
            result.distance_ratio.push(0);
        }
    }
    // cleanup
    mesh_tjs.geometry.dispose();
    mesh_tjs.material.dispose();
    // return the results
    return result;
}
// ================================================================================================
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
// ================================================================================================
function _getDirs(num_rays, view_ang) {
    const dirs = [];
    const ang = view_ang / (num_rays - 1);
    const start_ang = ang * (num_rays - 1) * -0.5;
    for (let i = 0; i < num_rays; i++) {
        dirs.push(vecRot([0, 0, 1], [0, 1, 0], start_ang + (ang * i)));
    }
    return dirs;
}
// ================================================================================================
function _vecXForm(vecs, pln) {
    // transform vectors from the global CS to the local CS
    const pln2 = [[0, 0, 0], pln[1], pln[2]];
    const matrix = xformMatrix(pln2, false);
    return vecs.map(vec => multMatrix(vec, matrix));
}
// ================================================================================================
function _triArea(a, b, c) {
    // calc area using Heron's formula
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmlzaWJpbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hbmFseXplL1Zpc2liaWxpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxLQUFLLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDL0IsT0FBTyxFQUNILFdBQVcsRUFDWCxzQkFBc0IsRUFDdEIsUUFBUSxFQUNSLFFBQVEsRUFFUixRQUFRLEVBQ1IsT0FBTyxFQUNQLEtBQUssRUFDTCxLQUFLLEVBQ0wsVUFBVSxFQU1WLE1BQU0sRUFDTixRQUFRLEVBQ1IsU0FBUyxFQUNULE9BQU8sRUFDUCxNQUFNLEVBQ04sU0FBUyxFQUNULFdBQVcsR0FDZCxNQUFNLCtCQUErQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxLQUFLLEdBQUcsTUFBTSx1QkFBdUIsQ0FBQztBQWE3Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBQ0gsTUFBTSxVQUFVLFVBQVUsQ0FDdEIsU0FBa0IsRUFDbEIsT0FBbUMsRUFDbkMsUUFBK0IsRUFDL0IsTUFBYyxFQUNkLE9BQThCO0lBRTlCLFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQVUsQ0FBQztJQUN4QyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDO0lBQy9CLElBQUksVUFBeUIsQ0FBQztJQUM5QixJQUFJLFVBQXlCLENBQUM7SUFDOUIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcs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