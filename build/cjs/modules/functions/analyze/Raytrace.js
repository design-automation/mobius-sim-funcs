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
exports.Raytrace = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const Mathjs = __importStar(require("mathjs"));
const THREE = __importStar(require("three"));
const _check_ids_1 = require("../../../_check_ids");
const chk = __importStar(require("../../../_check_types"));
const _enum_1 = require("./_enum");
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
 * 1. 'hit_count': the total number of rays that hit an obstruction.
 * 2. 'miss_count': the total number of rays that did not hit any obstruction.
 * 3. 'total_dist': the total of all the ray distances.
 * 4. 'min_dist': the minimum distance for all the rays.
 * 5. 'max_dist': the maximum distance for all the rays.
 * 6. 'avg_dist': the average dist for all the rays.
 * 7. 'dist_ratio': the ratio of 'total_dist' to the maximum distance if not rays hit any
 * obstructions.
 * \n
 * If 'distances' is selected, the dictionary will contain the following list:
 * 1. 'distances': A list of numbers, the distance travelled for each ray.
 * \n
 * If 'hit_pgons' is selected, the dictionary will contain the following list:
 * 1. 'hit_pgons': A list of polygon IDs, the polygons hit for each ray, or 'null' if no polygon
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
 * @param method Enum; values to return.
 */
function Raytrace(__model__, rays, entities, dist, method) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    // --- Error Check ---
    const fn_name = "analyze.Raytrace";
    let ents_arrs;
    if (__model__.debug) {
        chk.checkArgs(fn_name, "rays", rays, [chk.isRay, chk.isRayL, chk.isRayLL]);
        ents_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, "entities", entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.PGON, mobius_sim_1.EEntType.COLL]);
        chk.checkArgs(fn_name, "dist", dist, [chk.isNum, chk.isNumL]);
        if (Array.isArray(dist)) {
            if (dist.length !== 2) {
                throw new Error('If "dist" is a list, it must have a length of two: [min_dist, max_dist].');
            }
            if (dist[0] >= dist[1]) {
                throw new Error('If "dist" is a list, the "min_dist" must be less than the "max_dist": [min_dist, max_dist].');
            }
        }
    }
    else {
        ents_arrs = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    const mesh = (0, mobius_sim_1.createSingleMeshBufTjs)(__model__, ents_arrs);
    dist = Array.isArray(dist) ? dist : [0, dist];
    const result = _raytraceAll(__model__, rays, mesh, dist, method);
    // cleanup
    mesh[0].geometry.dispose();
    mesh[0].material.dispose();
    // return the results
    return result;
}
exports.Raytrace = Raytrace;
// Tjs raytrace function
function _raytraceAll(__model__, rays, mesh, limits, method) {
    const depth = (0, mobius_sim_1.getArrDepth)(rays);
    if (depth < 2) {
        // an empty list
        return null;
    }
    else if (depth === 2) {
        // just one ray
        return _raytraceAll(__model__, [rays], mesh, limits, method);
    }
    else if (depth === 3) {
        // a list of rays
        const [origins_tjs, dirs_tjs] = _raytraceOriginsDirsTjs(__model__, rays);
        return _raytrace(origins_tjs, dirs_tjs, mesh, limits, method);
    }
    else if (depth === 4) {
        // a nested list of rays
        return rays.map((a_rays) => _raytraceAll(__model__, a_rays, mesh, limits, method));
    }
}
//
function _raytraceOriginsDirsTjs(__model__, rays) {
    const origins_tjs = [];
    const dirs_tjs = [];
    for (const ray of rays) {
        origins_tjs.push(new THREE.Vector3(ray[0][0], ray[0][1], ray[0][2]));
        const dir = (0, mobius_sim_1.vecNorm)(ray[1]);
        dirs_tjs.push(new THREE.Vector3(dir[0], dir[1], dir[2]));
    }
    return [origins_tjs, dirs_tjs];
}
//
function _raytrace(origins_tjs, dirs_tjs, mesh, limits, method) {
    const result = {};
    let hit_count = 0;
    let miss_count = 0;
    const result_dists = [];
    const result_ents = [];
    const result_isects = [];
    for (let i = 0; i < origins_tjs.length; i++) {
        // get the origin and direction
        const origin_tjs = origins_tjs[i];
        const dir_tjs = dirs_tjs[i];
        // shoot
        const ray_tjs = new THREE.Raycaster(origin_tjs, dir_tjs, limits[0], limits[1]);
        const isects = ray_tjs.intersectObject(mesh[0], false);
        // get the result
        if (isects.length === 0) {
            result_dists.push(limits[1]);
            miss_count += 1;
            if (method === _enum_1._ERaytraceMethod.ALL || method === _enum_1._ERaytraceMethod.HIT_PGONS) {
                result_ents.push(null);
            }
            if (method === _enum_1._ERaytraceMethod.ALL || method === _enum_1._ERaytraceMethod.INTERSECTIONS) {
                const origin = origin_tjs.toArray();
                const dir = dir_tjs.toArray();
                result_isects.push((0, mobius_sim_1.vecAdd)(origin, (0, mobius_sim_1.vecSetLen)(dir, limits[1])));
            }
        }
        else {
            result_dists.push(isects[0]["distance"]);
            hit_count += 1;
            if (method === _enum_1._ERaytraceMethod.ALL || method === _enum_1._ERaytraceMethod.HIT_PGONS) {
                const face_i = mesh[1][isects[0].faceIndex];
                result_ents.push((0, mobius_sim_1.idMake)(mobius_sim_1.EEntType.PGON, face_i));
            }
            if (method === _enum_1._ERaytraceMethod.ALL || method === _enum_1._ERaytraceMethod.INTERSECTIONS) {
                const isect_tjs = isects[0].point;
                result_isects.push([isect_tjs.x, isect_tjs.y, isect_tjs.z]);
            }
        }
    }
    if ((method === _enum_1._ERaytraceMethod.ALL || method === _enum_1._ERaytraceMethod.STATS) && result_dists.length > 0) {
        result.hit_count = hit_count;
        result.miss_count = miss_count;
        result.total_dist = Mathjs.sum(result_dists);
        result.min_dist = Mathjs.min(result_dists);
        result.avg_dist = result.total_dist / result_dists.length;
        result.max_dist = Mathjs.max(result_dists);
        result.dist_ratio = result.total_dist / (result_dists.length * limits[1]);
    }
    if (method === _enum_1._ERaytraceMethod.ALL || method === _enum_1._ERaytraceMethod.DISTANCES) {
        result.distances = result_dists;
    }
    if (method === _enum_1._ERaytraceMethod.ALL || method === _enum_1._ERaytraceMethod.HIT_PGONS) {
        result.hit_pgons = result_ents;
    }
    if (method === _enum_1._ERaytraceMethod.ALL || method === _enum_1._ERaytraceMethod.INTERSECTIONS) {
        result.intersections = result_isects;
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmF5dHJhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYW5hbHl6ZS9SYXl0cmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhEQWV1QztBQUN2QywrQ0FBaUM7QUFDakMsNkNBQStCO0FBRS9CLG9EQUFtRDtBQUNuRCwyREFBNkM7QUFDN0MsbUNBQTJDO0FBZ0IzQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZ0RHO0FBQ0gsU0FBZ0IsUUFBUSxDQUNwQixTQUFrQixFQUNsQixJQUE4QixFQUM5QixRQUErQixFQUMvQixJQUErQixFQUMvQixNQUF3QjtJQUV4QixRQUFRLEdBQUcsSUFBQSx3QkFBVyxFQUFDLFFBQVEsQ0FBVSxDQUFDO0lBQzFDLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQztJQUNuQyxJQUFJLFNBQXdCLENBQUM7SUFDN0IsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDM0UsU0FBUyxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxlQUFFLENBQUMsSUFBSSxFQUFFLGVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLHFCQUFRLENBQUMsSUFBSSxFQUFFLHFCQUFRLENBQUMsSUFBSSxDQUFDLENBQWtCLENBQUM7UUFDdEksR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFD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