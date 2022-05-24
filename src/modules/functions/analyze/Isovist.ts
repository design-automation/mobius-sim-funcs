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
    TEntTypeIdx,
    TId,
    TPlane,
    TRay,
    Txyz,
    vecAdd,
    vecRot,
    vecSetLen,
} from '@design-automation/mobius-sim';
import * as Mathjs from 'mathjs';
import * as THREE from 'three';

import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';


// ================================================================================================
interface TIsovistResult {
    avg_dist?: number[];
    min_dist?: number[];
    max_dist?: number[];
    area?: number[];
    perimeter?: number[];
    area_ratio?: number[];
    perimeter_ratio?: number[];
    circularity?: number[];
    compactness?: number[];
    cluster?: number[];
}
/**
 * Calculates an approximation of the isovist for a set of origins, defined by XYZ coords.
 * \n
 * The isovist is calculated by shooting rays out from the origins in a radial pattern.
 * The 'radius' argument defines the maximum radius of the isovist.
 * (The radius is used to define the maximum distance for shooting the rays.)
 * The 'num_rays' argument defines the number of rays that will be shot,
 * in a radial pattern parallel to the XY plane, with equal angle between rays.
 * More rays will result in more accurate result, but will also be slower to execute.
 * \n
 * Returns a dictionary containing different isovist metrics.
 * \n
 * 1. 'avg\_dist': The average distance from origin to the perimeter.
 * 2. 'min\_dist': The minimum distance from the origin to the perimeter.
 * 3. 'max\_dist': The minimum distance from the origin to the perimeter.
 * 4. 'area': The area of the isovist.
 * 5. 'perimeter': The perimeter of the isovist.
 * 4. 'area\_ratio': The ratio of the area of the isovist to the maximum area.
 * 5. 'perimeter\_ratio': The ratio of the perimeter of the isovist to the maximum perimeter.
 * 6. 'circularity': The ratio of the square of the perimeter to area (Davis and Benedikt, 1979).
 * 7. 'compactness': The ratio of average distance to the maximum distance (Michael Batty, 2001).
 * 8. 'cluster': The ratio of the radius of an idealized circle with the actual area of the
 * isovist to the radius of an idealized circle with the actual perimeter of the circle (Michael Batty, 2001).
 * \n
 * \n
 * @param __model__
 * @param origins A list of Rays or a list of Planes, to be used as the origins for calculating the isovists.
 * @param entities The obstructions: faces, polygons, or collections.
 * @param radius The maximum radius of the isovist.
 * @param num_rays The number of rays to generate when calculating isovists.
 * @returns A dictionary containing metrics.
 */
export function Isovist(
    __model__: GIModel,
    origins: TRay[] | TPlane[],
    entities: TId | TId[] | TId[][],
    radius: number,
    num_rays: number
): TIsovistResult {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.Isovist";
    // let origin_ents_arrs: TEntTypeIdx[];
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
    } else {
        // origin_ents_arrs = idsBreak(origins) as TEntTypeIdx[];
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    // create tjs origins for xyz, ray, or plane
    const origins_tjs: THREE.Vector3[] = _isovistOriginsTjs(__model__, origins, 0.1); // TODO Should we lift coords by 0.1 ???
    // create tjs directions
    const dirs_xyzs: Txyz[] = [];
    const dirs_tjs: THREE.Vector3[] = [];
    const vec: Txyz = [1, 0, 0];
    for (let i = 0; i < num_rays; i++) {
        const dir_xyz = vecRot(vec, [0, 0, 1], (i * (Math.PI * 2)) / num_rays);
        dirs_xyzs.push(vecSetLen(dir_xyz, radius));
        const dir_tjs: THREE.Vector3 = new THREE.Vector3(dir_xyz[0], dir_xyz[1], dir_xyz[2]);
        dirs_tjs.push(dir_tjs);
    }
    // calc max perim and area
    const ang = (2 * Math.PI) / num_rays;
    const opp = radius * Math.sin(ang / 2);
    const max_perim = num_rays * 2 * opp;
    const max_area = num_rays * radius * Math.cos(ang / 2) * opp;
    // create mesh
    const mesh: [THREE.Mesh, number[]] = createSingleMeshBufTjs(__model__, ents_arrs);
    // create data structure
    const result: TIsovistResult = {};
    result.avg_dist = [];
    result.min_dist = [];
    result.max_dist = [];
    result.area = [];
    result.perimeter = [];
    result.circularity = [];
    result.area_ratio = [];
    result.perimeter_ratio = [];
    result.compactness = [];
    result.cluster = [];
    // shoot rays
    for (let i = 0; i < origins_tjs.length; i++) {
        const origin_tjs: THREE.Vector3 = origins_tjs[i];
        const result_dists: number[] = [];
        const result_isects: Txyz[] = [];
        for (let j = 0; j < dirs_tjs.length; j++) {
            const dir_tjs: THREE.Vector3 = dirs_tjs[j];
            const ray_tjs: THREE.Raycaster = new THREE.Raycaster(origin_tjs, dir_tjs, 0, radius);
            const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh[0], false);
            // get the result
            if (isects.length === 0) {
                result_dists.push(radius);
                result_isects.push(vecAdd([origin_tjs.x, origin_tjs.y, origin_tjs.z], dirs_xyzs[j]));
            } else {
                result_dists.push(isects[0]["distance"]);
                const isect_tjs: THREE.Vector3 = isects[0].point;
                result_isects.push([isect_tjs.x, isect_tjs.y, isect_tjs.z]);
            }
        }
        // calc the perimeter and area
        let perim = 0;
        let area = 0;
        for (let j = 0; j < num_rays; j++) {
            const j2 = j === num_rays - 1 ? 0 : j + 1;
            // calc perim
            const c = distance(result_isects[j], result_isects[j2]);
            perim += c;
            // calc area
            area += _isovistTriArea(result_dists[j], result_dists[j2], c);
        }
        const total_dist = Mathjs.sum(result_dists);
        const avg_dist = total_dist / result_dists.length;
        const min_dist = Mathjs.min(result_dists);
        const max_dist = Mathjs.max(result_dists);
        // save the data
        result.avg_dist.push(avg_dist);
        result.min_dist.push(min_dist);
        result.max_dist.push(max_dist);
        result.area.push(area);
        result.perimeter.push(perim);
        result.area_ratio.push(area / max_area);
        result.perimeter_ratio.push(perim / max_perim);
        result.circularity.push((perim * perim) / area);
        result.compactness.push(avg_dist / max_dist);
        result.cluster.push(Math.sqrt(area / Math.PI) / (perim / (2 * Math.PI)));
    }
    // cleanup
    mesh[0].geometry.dispose();
    (mesh[0].material as THREE.Material).dispose();
    // return the results
    return result;
}
function _isovistOriginsTjs(__model__: GIModel, origins: Txyz[] | TRay[] | TPlane[], offset: number): THREE.Vector3[] {
    const vectors_tjs: THREE.Vector3[] = [];
    const is_xyz: boolean = isXYZ(origins[0]);
    const is_ray: boolean = isRay(origins[0]);
    const is_pln: boolean = isPlane(origins[0]);
    for (const origin of origins) {
        let origin_xyz: Txyz = null;
        if (is_xyz) {
            origin_xyz = origin as Txyz;
        } else if (is_ray) {
            origin_xyz = origin[0] as Txyz;
        } else if (is_pln) {
            origin_xyz = origin[0] as Txyz;
        } else {
            throw new Error("analyze.Isovist: origins arg has invalid values");
        }
        const origin_tjs: THREE.Vector3 = new THREE.Vector3(origin_xyz[0], origin_xyz[1], origin_xyz[2] + offset);
        vectors_tjs.push(origin_tjs);
    }
    return vectors_tjs;
}
function _isovistTriArea(a: number, b: number, c: number): number {
    // calc area using Heron's formula
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}
