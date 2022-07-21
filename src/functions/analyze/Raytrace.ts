import { Sim, ENT_TYPE } from '../../mobius_sim';
// import createSingleMeshBufTjs
import * as Mathjs from 'mathjs';
import * as THREE from 'three';

import { _ERaytraceMethod } from './_enum';


// =================================================================================================
interface TRaytraceResult {
    hit_count?: number;
    miss_count?: number;
    total_dist?: number;
    min_dist?: number;
    avg_dist?: number;
    max_dist?: number;
    dist_ratio?: number;
    distances?: number[];
    hit_pgons?: string[];
    intersections?: Txyz[];
    all_intersections?: Txyz[][];
}
/**
 * Shoot a set of rays into a set of obstructions, consisting of polygon faces.
 * One can imagine particles being shot from the ray origin in the ray direction, hitting the
 * obstructions.
 * \n
 * Each ray will either hit an obstruction, or will hit no obstructions.
 * The length of the ray vector is ignored, only the ray origin and direction is taken into account.
 * Each particle shot out from a ray will travel a certain distance.
 * The minimum and maximum distance that the particle will travel is defined by the 'dist' argument.
 * \n
 * If a ray particle hits an obstruction, then the 'distance' for that ray is the distance from the * ray origin to the point of intersection.
 * If the ray particle does not hit an obstruction, then the 'distance' for that ray is equal to
 * the max for the 'dist' argument.
 * \n
 * Returns a dictionary containing the following data.
 * \n
 * If 'stats' is selected, the dictionary will contain the following numbers:
 * 1. 'hit\_count': the total number of rays that hit an obstruction.
 * 2. 'miss\_count': the total number of rays that did not hit any obstruction.
 * 3. 'total\_dist': the total of all the ray distances.
 * 4. 'min\_dist': the minimum distance for all the rays.
 * 5. 'max\_dist': the maximum distance for all the rays.
 * 6. 'avg\_dist': the average dist for all the rays.
 * 7. 'dist\_ratio': the ratio of 'total\_dist' to the maximum distance if not rays hit any
 * obstructions.
 * \n
 * If 'distances' is selected, the dictionary will contain the following list:
 * 1. 'distances': A list of numbers, the distance travelled for each ray.
 * \n
 * If 'hit\_pgons' is selected, the dictionary will contain the following list:
 * 1. 'hit\_pgons': A list of polygon IDs, the polygons hit for each ray, or 'null' if no polygon
 * was hit.
 * \n
 * If 'intersections' is selected, the dictionary will contain the following list:
 * 1. 'intersections': A list of XYZ coords, the point of intersection where the ray hit a polygon,
 * or 'null' if no polygon was hit.
 * \n
 * If 'all' is selected, the dictionary will contain all of the above.
 * \n
 * If the input is a list of rays, the output will be a single dictionary.
 * If the list is empty (i.e. contains no rays), then 'null' is returned.
 * If the input is a list of lists of rays, then the output will be a list of dictionaries.
 * \n
 * @param __model__
 * @param rays A ray, a list of rays, or a list of lists of rays.
 * @param entities The obstructions, faces, polygons, or collections of faces or polygons.
 * @param dist The ray limits, one or two numbers. Either max, or [min, max].
 * @param method Enum, values to return: `'stats', 'distances', 'hit_pgons', 'intersections'` or `'all'`.
 * @returns A dictionary, a list of dictionaries, or null.
 */
export function Raytrace(
    __model__: Sim,
    rays: TRay | TRay[] | TRay[][],
    entities: string | string[] | string[][],
    dist: number | [number, number],
    method: _ERaytraceMethod
): TRaytraceResult | TRaytraceResult[] {
    entities = arrMakeFlat(entities) as string[];
    // // --- Error Check ---
    // const fn_name = "analyze.Raytrace";
    // let ents_arrs: string[];
    // if (this.debug) {
    //     chk.checkArgs(fn_name, "rays", rays, [chk.isRay, chk.isRayL, chk.isRayLL]);
    //     ents_arrs = checkIDs(__model__, fn_name, "entities", entities, [ID.isID, ID.isIDL1], [ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
    //     chk.checkArgs(fn_name, "dist", dist, [chk.isNum, chk.isNumL]);
    //     if (Array.isArray(dist)) {
    //         if (dist.length !== 2) {
    //             throw new Error('If "dist" is a list, it must have a length of two: [min_dist, max_dist].');
    //         }
    //         if (dist[0] >= dist[1]) {
    //             throw new Error('If "dist" is a list, the "min_dist" must be less than the "max_dist": [min_dist, max_dist].');
    //         }
    //     }
    // } else {
    //     ents_arrs = idsBreak(entities) as string[];
    // }
    // // --- Error Check ---
    const mesh: [THREE.Mesh, number[]] = createSingleMeshBufTjs(__model__, ents_arrs);
    dist = Array.isArray(dist) ? dist : [0, dist];
    const result = _raytraceAll(__model__, rays, mesh, dist, method);
    // cleanup
    mesh[0].geometry.dispose();
    (mesh[0].material as THREE.Material).dispose();
    // return the results
    return result;
}
// =================================================================================================
// Tjs raytrace function
function _raytraceAll(
    __model__: Sim,
    rays: TRay | TRay[] | TRay[][],
    mesh: [THREE.Mesh, number[]],
    limits: [number, number],
    method: _ERaytraceMethod
): TRaytraceResult | TRaytraceResult[] {
    const depth: number = getArrDepth(rays);
    if (depth < 2) {
        // an empty list
        return null;
    } else if (depth === 2) {
        // just one ray
        return _raytraceAll(__model__, [rays] as TRay[], mesh, limits, method);
    } else if (depth === 3) {
        // a list of rays
        const [origins_tjs, dirs_tjs]: [THREE.Vector3[], THREE.Vector3[]] = _raytraceOriginsDirsTjs(__model__, rays as TRay[]);
        return _raytrace(origins_tjs, dirs_tjs, mesh, limits, method) as TRaytraceResult;
    } else if (depth === 4) {
        // a nested list of rays
        return (rays as TRay[][]).map((a_rays) => _raytraceAll(__model__, a_rays, mesh, limits, method)) as TRaytraceResult[];
    }
}
// =================================================================================================
//
function _raytraceOriginsDirsTjs(__model__: Sim, rays: TRay[]): [THREE.Vector3[], THREE.Vector3[]] {
    const origins_tjs: THREE.Vector3[] = [];
    const dirs_tjs: THREE.Vector3[] = [];
    for (const ray of rays) {
        origins_tjs.push(new THREE.Vector3(ray[0][0], ray[0][1], ray[0][2]));
        const dir = vecNorm(ray[1]);
        dirs_tjs.push(new THREE.Vector3(dir[0], dir[1], dir[2]));
    }
    return [origins_tjs, dirs_tjs];
}
// =================================================================================================
//
function _raytrace(
    origins_tjs: THREE.Vector3[],
    dirs_tjs: THREE.Vector3[],
    mesh: [THREE.Mesh, number[]],
    limits: [number, number],
    method: _ERaytraceMethod
): TRaytraceResult {
    const result: TRaytraceResult = {};
    let hit_count = 0;
    let miss_count = 0;
    const result_dists: number[] = [];
    const result_ents: string[] = [];
    const result_isects: Txyz[] = [];
    const result_isects_all: Txyz[][] = [];
    for (let i = 0; i < origins_tjs.length; i++) {
        // get the origin and direction
        const origin_tjs = origins_tjs[i];
        const dir_tjs = dirs_tjs[i];
        // shoot
        const ray_tjs: THREE.Raycaster = new THREE.Raycaster(origin_tjs, dir_tjs, limits[0], limits[1]);
        const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh[0], false);
        // get the result
        if (isects.length === 0) {
            result_dists.push(limits[1]);
            miss_count += 1;
            if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.HIT_PGONS) {
                result_ents.push(null);
            }
            if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.INTERSECTIONS) {
                const origin: Txyz = origin_tjs.toArray() as Txyz;
                const dir: Txyz = dir_tjs.toArray() as Txyz;
                result_isects.push( vecAdd(origin, vecSetLen(dir, limits[1])) as Txyz);
            }
            if (method === _ERaytraceMethod.ALL_INTERSECTIONS) {
                result_isects_all.push([]);
            }
        } else {
            result_dists.push(isects[0]["distance"]);
            hit_count += 1;
            if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.HIT_PGONS) {
                const face_i = mesh[1][isects[0].faceIndex];
                result_ents.push(idMake(ENT_TYPE.PGON, face_i) as string);
            }
            if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.INTERSECTIONS) {
                result_isects.push([isects[0].point.x, isects[0].point.y, isects[0].point.z]);
            }
            if (method === _ERaytraceMethod.ALL_INTERSECTIONS) {
                const xyzs: Txyz[] = [];
                for (const isect of isects) {
                    xyzs.push([isect.point.x, isect.point.y, isect.point.z]);
                }
                result_isects_all.push(xyzs);
            }
        }
    }
    if (method === _ERaytraceMethod.ALL_INTERSECTIONS) {
        result.all_intersections = result_isects_all;
    }
    if ((method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.STATS) && result_dists.length > 0) {
        result.hit_count = hit_count;
        result.miss_count = miss_count;
        result.total_dist = Mathjs.sum(result_dists);
        result.min_dist = Mathjs.min(result_dists);
        result.avg_dist = result.total_dist / result_dists.length;
        result.max_dist = Mathjs.max(result_dists);
        result.dist_ratio = result.total_dist / (result_dists.length * limits[1]);
    }
    if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.DISTANCES) {
        result.distances = result_dists;
    }
    if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.HIT_PGONS) {
        result.hit_pgons = result_ents;
    }
    if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.INTERSECTIONS) {
        result.intersections = result_isects;
    }
    return result;
}
// =================================================================================================
