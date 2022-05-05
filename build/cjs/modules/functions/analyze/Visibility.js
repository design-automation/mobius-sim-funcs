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
exports.Visibility = void 0;
const Mathjs = __importStar(require("mathjs"));
const THREE = __importStar(require("three"));
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const chk = __importStar(require("../../../_check_types"));
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
function Visibility(__model__, origins, entities, radius, targets) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    targets = (0, mobius_sim_1.arrMakeFlat)(targets);
    // --- Error Check ---
    const fn_name = "analyze.View";
    let ents_arrs1;
    let ents_arrs2;
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origins", origins, [chk.isRayL, chk.isPlnL]);
        ents_arrs1 = (0, _check_ids_1.checkIDs)(__model__, fn_name, "entities", entities, [_check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.PGON, mobius_sim_1.EEntType.COLL]);
        chk.checkArgs(fn_name, "radius", radius, [chk.isNum, chk.isNumL]);
        if (Array.isArray(radius)) {
            if (radius.length !== 2) {
                throw new Error('If "radius" is a list, it must have a length of two: [min_dist, max_dist].');
            }
            if (radius[0] >= radius[1]) {
                throw new Error('If "radius" is a list, the "min_dist" must be less than the "max_dist": [min_dist, max_dist].');
            }
        }
        ents_arrs2 = (0, _check_ids_1.checkIDs)(__model__, fn_name, "targets", targets, [_check_ids_1.ID.isIDL1], null);
    }
    else {
        ents_arrs1 = (0, mobius_sim_1.idsBreak)(entities);
        ents_arrs2 = (0, mobius_sim_1.idsBreak)(targets);
    }
    // --- Error Check ---
    // get planes for each sensor point
    const sensors_xyz = _getOriginXYZs(origins, 0.01); // Offset by 0.01
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
    // create mesh
    const [mesh_tjs, idx_to_face_i] = (0, mobius_sim_1.createSingleMeshBufTjs)(__model__, ents_arrs1);
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
exports.Visibility = Visibility;
// ================================================================================================
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
// ================================================================================================
function _getDirs(num_rays, view_ang) {
    const dirs = [];
    const ang = view_ang / (num_rays - 1);
    const start_ang = ang * (num_rays - 1) * -0.5;
    for (let i = 0; i < num_rays; i++) {
        dirs.push((0, mobius_sim_1.vecRot)([0, 0, 1], [0, 1, 0], start_ang + (ang * i)));
    }
    return dirs;
}
// ================================================================================================
function _vecXForm(vecs, pln) {
    // transform vectors from the global CS to the local CS
    const pln2 = [[0, 0, 0], pln[1], pln[2]];
    const matrix = (0, mobius_sim_1.xformMatrix)(pln2, false);
    return vecs.map(vec => (0, mobius_sim_1.multMatrix)(vec, matrix));
}
// ================================================================================================
function _triArea(a, b, c) {
    // calc area using Heron's formula
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmlzaWJpbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hbmFseXplL1Zpc2liaWxpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQ0FBaUM7QUFDakMsNkNBQStCO0FBQy9CLDhEQXVCdUM7QUFDdkMsb0RBQW1EO0FBQ25ELDJEQUE2QztBQWE3Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBQ0gsU0FBZ0IsVUFBVSxDQUN0QixTQUFrQixFQUNsQixPQUFtQyxFQUNuQyxRQUErQixFQUMvQixNQUFjLEVBQ2QsT0FBOEI7SUFFOUIsUUFBUSxHQUFHLElBQUEsd0JBQVcsRUFBQyxRQUFRLENBQVUsQ0FBQztJQUMxQyxPQUFPLEdBQUcsSUFBQSx3QkFBVyxFQUFDLE9BQU8sQ0FBVSxDQUFDO0lBQ3hDLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxjQUFjLENBQUM7SUFDL0IsSUFBSSxVQUF5QixDQUFDO0lBQzlCLElBQUksVUFBeUIsQ0FBQztJQUM5QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDckUsVUFBVSxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxxQkFBUSxDQUFDLElBQUksRUFBRSxxQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFrQixDQUFDO1FBQzlILEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FB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