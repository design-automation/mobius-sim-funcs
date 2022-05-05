import * as Mathjs from 'mathjs';
import * as THREE from 'three';
import { arrMakeFlat, createSingleMeshBufTjs, distance, EEntType, idsBreak, isPlane, isRay, multMatrix, vecAdd, vecCross, vecMult, vecRot, vecSetLen, xformMatrix, } from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../../_check_ids';
import * as chk from '../../../_check_types';
/**
 * Calculates an approximation of the unobstructed view for a set of origins.
 * \n
 * Typically, the origins are created as centroids of a set of windows.
 * \n
 * The unobstructed view is calculated by shooting rays out from the origins in a fan pattern.
 * The 'radius' argument defines the maximum radius of the unobstructed view.
 * (The radius is used to define the maximum distance for shooting the rays.)
 * The 'num_rays' argument defines the number of rays that will be shot,
 * in a fab pattern parallel to the XY plane, with equal angle between rays.
 * More rays will result in more accurate result, but will also be slower to execute.
 * \n
 * Returns a dictionary containing different unobstructed view metrics.
 * \n
 * \n
 * @param __model__
 * @param origins A list of Rays or Planes, to be used as the origins for calculating the uobstructed views.
 * @param entities The obstructions: faces, polygons, or collections.
 * @param radius The maximum radius of the uobstructed views.
 * @param num_rays The number of rays to generate when calculating uobstructed views.
 * @param view_ang The angle of the unobstructed view, in radians.
 */
export function View(__model__, origins, entities, radius, num_rays, view_ang) {
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = "analyze.View";
    let ents_arrs;
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origins", origins, [chk.isRayL, chk.isPlnL]);
        ents_arrs = checkIDs(__model__, fn_name, "entities", entities, [ID.isIDL1], [EEntType.PGON, EEntType.COLL]);
        chk.checkArgs(fn_name, "radius", radius, [chk.isNum, chk.isNumL]);
        if (Array.isArray(radius)) {
            if (radius.length !== 2) {
                throw new Error('If "radius" is a list, it must have a length of two: [min_dist, max_dist].');
            }
            if (radius[0] >= radius[1]) {
                throw new Error('If "radius" is a list, the "min_dist" must be less than the "max_dist": [min_dist, max_dist].');
            }
        }
        chk.checkArgs(fn_name, "num_rays", num_rays, [chk.isNum]);
        chk.checkArgs(fn_name, "view_ang", view_ang, [chk.isNum]);
    }
    else {
        ents_arrs = idsBreak(entities);
    }
    // --- Error Check ---
    // get planes for each sensor point
    const sensors = _getPlanes(origins, 0.01); // Offset by 0.01
    // Plane(__model__, sensors, 0.4);
    // get the ray direction vectors
    const dirs = _getDirs(num_rays, view_ang);
    // Ray(__model__, dirs.map( dir => [[0,0,0], dir]) as TRay[], 1);
    // calc max perim and area
    const tri_dist = distance([radius, 0, 0], vecRot([radius, 0, 0], [0, 0, 1], view_ang / (num_rays - 1)));
    const max_perim = tri_dist * (num_rays - 1);
    const max_area = _triArea(radius, radius, tri_dist) * (num_rays - 1);
    // create mesh
    const [mesh_tjs, idx_to_face_i] = createSingleMeshBufTjs(__model__, ents_arrs);
    // create data structure
    const result = {};
    result.avg_dist = [];
    result.min_dist = [];
    result.max_dist = [];
    result.area_ratio = [];
    result.perimeter_ratio = [];
    result.distance_ratio = [];
    // create tjs objects (to be resued for each ray)
    const origin_tjs = new THREE.Vector3();
    const dir_tjs = new THREE.Vector3();
    const ray_tjs = new THREE.Raycaster(origin_tjs, dir_tjs, 0, radius);
    // shoot rays
    for (const sensor of sensors) {
        origin_tjs.x = sensor[0][0];
        origin_tjs.y = sensor[0][1];
        origin_tjs.z = sensor[0][2];
        const result_dists = [];
        const result_isects = [];
        const dirs2 = _vecXForm(dirs, sensor);
        for (const dir2 of dirs2) {
            // Ray(__model__, [sensor[0], dir2], 1);
            dir_tjs.x = dir2[0];
            dir_tjs.y = dir2[1];
            dir_tjs.z = dir2[2];
            const isects = ray_tjs.intersectObject(mesh_tjs, false);
            // get the result
            if (isects.length === 0) {
                result_dists.push(radius);
                result_isects.push(vecAdd(sensor[0], vecMult(dir2, radius)));
            }
            else {
                result_dists.push(isects[0]["distance"]);
                const isect_tjs = isects[0].point;
                result_isects.push([isect_tjs.x, isect_tjs.y, isect_tjs.z]);
            }
        }
        // calc the perimeter and area
        let perim = 0;
        let area = 0;
        for (let i = 0; i < num_rays - 1; i++) {
            // calc perim
            const c = distance(result_isects[i], result_isects[i + 1]);
            perim += c;
            // calc area
            area += _triArea(result_dists[i], result_dists[i + 1], c);
        }
        const total_dist = Mathjs.sum(result_dists);
        const avg_dist = total_dist / result_dists.length;
        const min_dist = Mathjs.min(result_dists);
        const max_dist = Mathjs.max(result_dists);
        // save the data
        result.avg_dist.push(avg_dist);
        result.min_dist.push(min_dist);
        result.max_dist.push(max_dist);
        result.area_ratio.push(area / max_area);
        result.perimeter_ratio.push(perim / max_perim);
        result.distance_ratio.push(total_dist / (radius * num_rays));
    }
    // cleanup
    mesh_tjs.geometry.dispose();
    mesh_tjs.material.dispose();
    // return the results
    return result;
}
// ================================================================================================
function _getPlanes(origins, offset) {
    const planes = [];
    const is_ray = isRay(origins[0]);
    const is_pln = isPlane(origins[0]);
    for (const origin of origins) {
        if (is_ray) {
            // use the ray to create a plane where the y axis is [0, 0, 1]
            const pln = [
                origin[0],
                vecCross(origin[1], [0, 0, 1], true),
                [0, 0, 1]
            ];
            pln[0] = vecAdd(pln[0], vecSetLen(vecCross(pln[1], pln[2]), offset));
            planes.push(pln);
        }
        else if (is_pln) {
            // use the plane to create a new plane where the y axis is [0, 0, 1]
            const dir = vecCross(origin[1], origin[2], true);
            const pln = [
                origin[0],
                vecCross([0, 0, 1], dir, true),
                [0, 0, 1]
            ];
            pln[0] = vecAdd(pln[0], vecSetLen(vecCross(pln[1], pln[2]), offset));
            planes.push(pln);
        }
        else {
            throw new Error("analyze.View: origins arg contains an invalid value: " + origin);
        }
    }
    return planes;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hbmFseXplL1ZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxLQUFLLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDL0IsT0FBTyxFQUNILFdBQVcsRUFDWCxzQkFBc0IsRUFDdEIsUUFBUSxFQUNSLFFBQVEsRUFFUixRQUFRLEVBQ1IsT0FBTyxFQUNQLEtBQUssRUFDTCxVQUFVLEVBTVYsTUFBTSxFQUNOLFFBQVEsRUFDUixPQUFPLEVBQ1AsTUFBTSxFQUNOLFNBQVMsRUFDVCxXQUFXLEdBQ2QsTUFBTSwrQkFBK0IsQ0FBQztBQUN2QyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxHQUFHLE1BQU0sdUJBQXVCLENBQUM7QUFlN0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQUNILE1BQU0sVUFBVSxJQUFJLENBQ2hCLFNBQWtCLEVBQ2xCLE9BQTBCLEVBQzFCLFFBQStCLEVBQy9CLE1BQWMsRUFDZCxRQUFnQixFQUNoQixRQUFnQjtJQUVoQixRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBVSxDQUFDO0lBQzFDLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxjQUFjLENBQUM7SUFDL0IsSUFBSSxTQUF3QixDQUFDO0lBQzdCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNyRSxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFrQixDQUFDO1FBQzdILEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN2QixJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLDRFQUE0RSxDQUFDLENBQUM7YUFDakc7WUFDRCxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0ZBQStGLENBQUMsQ0FBQzthQUNwSDtTQUNKO1FBQ0QsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzFELEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUM3RDtTQUFNO1FBQ0gsU0FBUyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQWtCLENBQUM7S0FDbkQ7SUFDRCxzQkFBc0I7SUFDdEIsbUNBQW1DO0lBQ25DLE1BQU0sT0FBTyxHQUFhLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBaUI7SUFDdEUsa0NBQWtDO0lBQ2xDLGdDQUFnQztJQUNoQyxNQUFNLElBQUksR0FBVyxRQUFRLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xELGlFQUFpRTtJQUNqRSwwQkFBMEI7SUFDMUIsTUFBTSxRQUFRLEdBQVcsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlHLE1BQU0sU0FBUyxHQUFHLFFBQVEsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM1QyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNyRSxjQUFjO0lBQ2QsTUFBTSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsR0FBMkIsc0JBQXNCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZHLHdCQUF3QjtJQUN4QixNQUFNLE1BQU0sR0FBZ0IsRUFBRSxDQUFDO0lBQy9CLE1BQU0sQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLE1BQU0sQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO0lBQzVCLE1BQU0sQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBQzNCLGlEQUFpRDtJQUNqRCxNQUFNLFVBQVUsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDdEQsTUFBTSxPQUFPLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ25ELE1BQU0sT0FBTyxHQUFvQixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckYsYUFBYTtJQUNiLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO1FBQzFCLFVBQVUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RixNQUFNLFlBQVksR0FBYSxFQUFFLENBQUM7UUFDbEMsTUFBTSxhQUFhLEdBQVcsRUFBRSxDQUFDO1FBQ2pDLE1BQU0sS0FBSyxHQUFXLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUMsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7WUFDdEIsd0NBQXdDO1lBQ3hDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RCxNQUFNLE1BQU0sR0FBeUIsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDOUUsaUJBQWlCO1lBQ2pCLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3JCLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzFCLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNoRTtpQkFBTTtnQkFDSCxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxNQUFNLFNBQVMsR0FBa0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDakQsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMvRDtTQUNKO1FBQ0QsOEJBQThCO1FBQzlCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLGFBQWE7WUFDYixNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRCxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQ1gsWUFBWTtZQUNaLElBQUksSUFBSSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDN0Q7UUFDRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVDLE1BQU0sUUFBUSxHQUFHLFVBQVUsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO1FBQ2xELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMxQyxnQkFBZ0I7UUFDaEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztLQUNoRTtJQUNELFVBQVU7SUFDVixRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzNCLFFBQVEsQ0FBQyxRQUEyQixDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2hELHFCQUFxQjtJQUNyQixPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBQ0QsbUdBQW1HO0FBQ25HLFNBQVMsVUFBVSxDQUFDLE9BQTBCLEVBQUUsTUFBYztJQUMxRCxNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7SUFDNUIsTUFBTSxNQUFNLEdBQVksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLE1BQU0sTUFBTSxHQUFZLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QyxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtRQUMxQixJQUFJLE1BQU0sRUFBRTtZQUNSLDhEQUE4RDtZQUM5RCxNQUFNLEdBQUcsR0FBVztnQkFDaEIsTUFBTSxDQUFDLENBQUMsQ0FBUztnQkFDakIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQVMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDO2dCQUMxQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ1osQ0FBQztZQUNGLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckUsTUFBTSxDQUFDLElBQUksQ0FBRSxHQUFHLENBQUUsQ0FBQztTQUN0QjthQUFNLElBQUksTUFBTSxFQUFFO1lBQ2Ysb0VBQW9FO1lBQ3BFLE1BQU0sR0FBRyxHQUFTLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFTLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0sR0FBRyxHQUFXO2dCQUNoQixNQUFNLENBQUMsQ0FBQyxDQUFTO2dCQUNqQixRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7Z0JBQzVCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDWixDQUFDO1lBQ0YsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNyRSxNQUFNLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFDO1NBQ3RCO2FBQU07WUFDSCxNQUFNLElBQUksS0FBSyxDQUFDLHVEQUF1RCxHQUFHLE1BQU0sQ0FBQyxDQUFDO1NBQ3JGO0tBQ0o7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBQ0QsbUdBQW1HO0FBQ25HLFNBQVMsUUFBUSxDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7SUFDaEQsTUFBTSxJQUFJLEdBQVcsRUFBRSxDQUFDO0lBQ3hCLE1BQU0sR0FBRyxHQUFXLFFBQVEsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM5QyxNQUFNLFNBQVMsR0FBVyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDdEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMvQixJQUFJLENBQUMsSUFBSSxDQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7S0FDaEU7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO0FBQ0QsbUdBQW1HO0FBQ25HLFNBQVMsU0FBUyxDQUFDLElBQVksRUFBRSxHQUFXO0lBQ3hDLHVEQUF1RDtJQUN2RCxNQUFNLElBQUksR0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4QyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDckQsQ0FBQztBQUNELG1HQUFtRztBQUNuRyxTQUFTLFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7SUFDN0Msa0NBQWtDO0lBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RELENBQUM7QUFDRCxtR0FBbUcifQ==