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
exports.Isovist = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const Mathjs = __importStar(require("mathjs"));
const THREE = __importStar(require("three"));
const _check_ids_1 = require("../../../_check_ids");
const chk = __importStar(require("../../../_check_types"));
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
 * 1. 'avg_dist': The average distance from origin to the perimeter.
 * 2. 'min_dist': The minimum distance from the origin to the perimeter.
 * 3. 'max_dist': The minimum distance from the origin to the perimeter.
 * 4. 'area': The area of the isovist.
 * 5. 'perimeter': The perimeter of the isovist.
 * 4. 'area_ratio': The ratio of the area of the isovist to the maximum area.
 * 5. 'perimeter_ratio': The ratio of the perimeter of the isovist to the maximum perimeter.
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
 */
function Isovist(__model__, origins, entities, radius, num_rays) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    // --- Error Check ---
    const fn_name = "analyze.Isovist";
    // let origin_ents_arrs: TEntTypeIdx[];
    let ents_arrs;
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origins", origins, [chk.isRayL, chk.isPlnL]);
        ents_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, "entities", entities, [_check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.PGON, mobius_sim_1.EEntType.COLL]);
        chk.checkArgs(fn_name, "radius", radius, [chk.isNum, chk.isNumL]);
        if (Array.isArray(radius)) {
            if (radius.length !== 2) {
                throw new Error('If "radius" is a list, it must have a length of two: [min_dist, max_dist].');
            }
            if (radius[0] >= radius[1]) {
                throw new Error('If "radius" is a list, the "min_dist" must be less than the "max_dist": [min_dist, max_dist].');
            }
        }
    }
    else {
        // origin_ents_arrs = idsBreak(origins) as TEntTypeIdx[];
        ents_arrs = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    // create tjs origins for xyz, ray, or plane
    const origins_tjs = _isovistOriginsTjs(__model__, origins, 0.1); // TODO Should we lift coords by 0.1 ???
    // create tjs directions
    const dirs_xyzs = [];
    const dirs_tjs = [];
    const vec = [1, 0, 0];
    for (let i = 0; i < num_rays; i++) {
        const dir_xyz = (0, mobius_sim_1.vecRot)(vec, [0, 0, 1], (i * (Math.PI * 2)) / num_rays);
        dirs_xyzs.push((0, mobius_sim_1.vecSetLen)(dir_xyz, radius));
        const dir_tjs = new THREE.Vector3(dir_xyz[0], dir_xyz[1], dir_xyz[2]);
        dirs_tjs.push(dir_tjs);
    }
    // calc max perim and area
    const ang = (2 * Math.PI) / num_rays;
    const opp = radius * Math.sin(ang / 2);
    const max_perim = num_rays * 2 * opp;
    const max_area = num_rays * radius * Math.cos(ang / 2) * opp;
    // create mesh
    const mesh = (0, mobius_sim_1.createSingleMeshBufTjs)(__model__, ents_arrs);
    // create data structure
    const result = {};
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
        const origin_tjs = origins_tjs[i];
        const result_dists = [];
        const result_isects = [];
        for (let j = 0; j < dirs_tjs.length; j++) {
            const dir_tjs = dirs_tjs[j];
            const ray_tjs = new THREE.Raycaster(origin_tjs, dir_tjs, 0, radius);
            const isects = ray_tjs.intersectObject(mesh[0], false);
            // get the result
            if (isects.length === 0) {
                result_dists.push(radius);
                result_isects.push((0, mobius_sim_1.vecAdd)([origin_tjs.x, origin_tjs.y, origin_tjs.z], dirs_xyzs[j]));
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
        for (let j = 0; j < num_rays; j++) {
            const j2 = j === num_rays - 1 ? 0 : j + 1;
            // calc perim
            const c = (0, mobius_sim_1.distance)(result_isects[j], result_isects[j2]);
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
    mesh[0].material.dispose();
    // return the results
    return result;
}
exports.Isovist = Isovist;
function _isovistOriginsTjs(__model__, origins, offset) {
    const vectors_tjs = [];
    const is_xyz = (0, mobius_sim_1.isXYZ)(origins[0]);
    const is_ray = (0, mobius_sim_1.isRay)(origins[0]);
    const is_pln = (0, mobius_sim_1.isPlane)(origins[0]);
    for (const origin of origins) {
        let origin_xyz = null;
        if (is_xyz) {
            origin_xyz = origin;
        }
        else if (is_ray) {
            origin_xyz = origin[0];
        }
        else if (is_pln) {
            origin_xyz = origin[0];
        }
        else {
            throw new Error("analyze.Isovist: origins arg has invalid values");
        }
        const origin_tjs = new THREE.Vector3(origin_xyz[0], origin_xyz[1], origin_xyz[2] + offset);
        vectors_tjs.push(origin_tjs);
    }
    return vectors_tjs;
}
function _isovistTriArea(a, b, c) {
    // calc area using Heron's formula
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXNvdmlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hbmFseXplL0lzb3Zpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFrQnVDO0FBQ3ZDLCtDQUFpQztBQUNqQyw2Q0FBK0I7QUFFL0Isb0RBQW1EO0FBQ25ELDJEQUE2QztBQWdCN0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThCRztBQUNILFNBQWdCLE9BQU8sQ0FDbkIsU0FBa0IsRUFDbEIsT0FBMEIsRUFDMUIsUUFBK0IsRUFDL0IsTUFBYyxFQUNkLFFBQWdCO0lBRWhCLFFBQVEsR0FBRyxJQUFBLHdCQUFXLEVBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDO0lBQ2xDLHVDQUF1QztJQUN2QyxJQUFJLFNBQXdCLENBQUM7SUFDN0IsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLFNBQVMsR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsZUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMscUJBQVEsQ0FBQyxJQUFJLEVBQUUscUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBa0IsQ0FBQztRQUM3SCxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNsRSxJQUFJ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