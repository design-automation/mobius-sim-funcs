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
    multMatrix,
    TEntTypeIdx,
    TId,
    TPlane,
    TRay,
    Txyz,
    vecAdd,
    vecCross,
    vecMult,
    vecRot,
    vecSetLen,
    xformMatrix,
} from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
// import { Ray } from '../visualize/Ray';
// import { Plane } from '../visualize/Plane';

// ================================================================================================
interface TViewResult {
    avg_dist?: number[];
    min_dist?: number[];
    max_dist?: number[];
    area?: number[];
    perimeter?: number[];
    area_ratio?: number[];
    perimeter_ratio?: number[];
    distance_ratio?: number[];
}
/**
 * Calculates an approximation of the unobstructed view for a set of origins.
 * \n
 * Typically, the origins are created as centroids of a set of windows.
 * \n
 * The unobstructed view is calculated by shooting rays out from the origins in a fan pattern.
 * \n
 * The 'radius' argument defines the maximum radius of the unobstructed view.
 * (The radius is used to define the maximum distance for shooting the rays.)
 * \n
 * The 'num\_rays' argument defines the number of rays that will be shot,
 * in a fan pattern parallel to the XY plane, with equal angle between rays.
 * More rays will result in more accurate result, but will also be slower to execute.
 * \n
 * Returns a dictionary containing different unobstructed view metrics.
 * \n
 * \n
 * @param __model__
 * @param origins A list of Rays or Planes, to be used as the origins for calculating the unobstructed views.
 * @param entities The obstructions: faces, polygons, or collections.
 * @param radius The maximum radius of the uobstructed views.
 * @param num_rays The number of rays to generate when calculating uobstructed views.
 * @param view_ang The angle of the unobstructed view, in radians.
 * @returns A dictionary containing different unobstructed view metrics.
 */
export function View(
    __model__: GIModel,
    origins: TRay[] | TPlane[],
    entities: TId | TId[] | TId[][],
    radius: number,
    num_rays: number,
    view_ang: number
): TViewResult {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.View";
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origins", origins, [chk.isRayL, chk.isPlnL]);
        ents_arrs = checkIDs(__model__, fn_name, "entities", entities, [ID.isIDL1], [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
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
    } else {
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    // get planes for each sensor point
    const sensors: TPlane[] = _getPlanes(origins, 0.01); // Offset by 0.01
    // Plane(__model__, sensors, 0.4);
    // get the ray direction vectors
    const dirs: Txyz[] = _getDirs(num_rays, view_ang);
    // Ray(__model__, dirs.map( dir => [[0,0,0], dir]) as TRay[], 1);
    // calc max perim and area
    const tri_dist: number = distance([radius, 0, 0], vecRot([radius, 0, 0], [0,0,1], view_ang / (num_rays - 1)));
    const max_perim = tri_dist * (num_rays - 1);
    const max_area = _triArea(radius, radius, tri_dist) * (num_rays - 1);
    // create mesh
    const [mesh_tjs, idx_to_face_i]: [THREE.Mesh, number[]] = createSingleMeshBufTjs(__model__, ents_arrs);
    // create data structure
    const result: TViewResult = {};
    result.avg_dist = [];
    result.min_dist = [];
    result.max_dist = [];
    result.area_ratio = [];
    result.perimeter_ratio = [];
    result.distance_ratio = [];
    // create tjs objects (to be resued for each ray)
    const origin_tjs: THREE.Vector3 = new THREE.Vector3();
    const dir_tjs: THREE.Vector3 = new THREE.Vector3();
    const ray_tjs: THREE.Raycaster = new THREE.Raycaster(origin_tjs, dir_tjs, 0, radius);
    // shoot rays
    for (const sensor of sensors) {
        origin_tjs.x = sensor[0][0]; origin_tjs.y = sensor[0][1]; origin_tjs.z = sensor[0][2]; 
        const result_dists: number[] = [];
        const result_isects: Txyz[] = [];
        const dirs2: Txyz[] = _vecXForm(dirs, sensor);
        for (const dir2 of dirs2) {
            // Ray(__model__, [sensor[0], dir2], 1);
            dir_tjs.x = dir2[0]; dir_tjs.y = dir2[1]; dir_tjs.z = dir2[2];
            const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh_tjs, false);
            // get the result
            if (isects.length === 0) {
                result_dists.push(radius);
                result_isects.push(vecAdd(sensor[0], vecMult(dir2, radius)));
            } else {
                result_dists.push(isects[0]["distance"]);
                const isect_tjs: THREE.Vector3 = isects[0].point;
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
    (mesh_tjs.material as THREE.Material).dispose();
    // return the results
    return result;
}
// ================================================================================================
function _getPlanes(origins: TRay[] | TPlane[], offset: number): TPlane[] {
    const planes: TPlane[] = [];
    const is_ray: boolean = isRay(origins[0]);
    const is_pln: boolean = isPlane(origins[0]);
    for (const origin of origins) {
        if (is_ray) {
            // use the ray to create a plane where the y axis is [0, 0, 1]
            const pln: TPlane = [
                origin[0] as Txyz,
                vecCross(origin[1] as Txyz, [0,0,1], true),
                [0, 0, 1]
            ];
            pln[0] = vecAdd(pln[0], vecSetLen(vecCross(pln[1], pln[2]), offset));
            planes.push( pln );
        } else if (is_pln) {
            // use the plane to create a new plane where the y axis is [0, 0, 1]
            const dir: Txyz = vecCross(origin[1] as Txyz, origin[2] as Txyz, true);
            const pln: TPlane = [
                origin[0] as Txyz,
                vecCross([0,0,1], dir, true),
                [0, 0, 1]
            ];
            pln[0] = vecAdd(pln[0], vecSetLen(vecCross(pln[1], pln[2]), offset));
            planes.push( pln );
        } else {
            throw new Error("analyze.View: origins arg contains an invalid value: " + origin);
        }
    }
    return planes;
}
// ================================================================================================
function _getDirs(num_rays: number, view_ang: number): Txyz[] {
    const dirs: Txyz[] = [];
    const ang: number = view_ang / (num_rays - 1);
    const start_ang: number = ang * (num_rays - 1) * -0.5;
    for (let i = 0; i < num_rays; i++) {
        dirs.push( vecRot([0,0,1], [0,1,0], start_ang + (ang * i)) );
    }
    return dirs;
}
// ================================================================================================
function _vecXForm(vecs: Txyz[], pln: TPlane): Txyz[] {
    // transform vectors from the global CS to the local CS
    const pln2: TPlane = [[0,0,0], pln[1], pln[2]];
    const matrix = xformMatrix(pln2, false);
    return vecs.map( vec => multMatrix(vec, matrix));
}
// ================================================================================================
function _triArea(a: number, b: number, c: number): number {
    // calc area using Heron's formula
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}
// ================================================================================================
