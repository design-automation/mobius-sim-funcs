"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmF5dHJhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYW5hbHl6ZS9SYXl0cmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBZXVDO0FBQ3ZDLCtDQUFpQztBQUNqQyw2Q0FBK0I7QUFFL0Isb0RBQW1EO0FBQ25ELDJEQUE2QztBQUM3QyxtQ0FBMkM7QUFnQjNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnREc7QUFDSCxTQUFnQixRQUFRLENBQ3BCLFNBQWtCLEVBQ2xCLElBQThCLEVBQzlCLFFBQStCLEVBQy9CLElBQStCLEVBQy9CLE1BQXdCO0lBRXhCLFFBQVEsR0FBRyxJQUFBLHdCQUFXLEVBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLGtCQUFrQixDQUFDO0lBQ25DLElBQUksU0FBd0IsQ0FBQztJQUM3QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUMzRSxTQUFTLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLGVBQUUsQ0FBQyxJQUFJLEVBQUUsZUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMscUJBQVEsQ0FBQyxJQUFJLEVBQUUscUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBa0IsQ0FBQztRQUN0SSxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FB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