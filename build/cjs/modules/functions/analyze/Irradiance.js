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
exports._calcIrradiance = exports.Irradiance = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const THREE = __importStar(require("three"));
const _check_ids_1 = require("../../_check_ids");
const chk = __importStar(require("../../_check_types"));
const _enum_1 = require("./_enum");
const _shared_1 = require("./_shared");
const EPS = 1e-6;
// =================================================================================================
/**
 * Calculate an approximation of irradiance...
 * \n
 * \n
 * @param __model__
 * @param sensors A list Rays or a list of Planes, to be used as the origins for calculating
 * irradiance.
 * @param entities The obstructions, polygons or collections.
 * @param radius The max distance for raytracing.
 * @param method Enum, the sky method: `'weighted', 'unweighted'` or `'all'`.
 * @returns A dictionary containing irradiance results.
 */
function Irradiance(__model__, sensors, entities, radius, method) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    // --- Error Check ---
    const fn_name = "analyze.Irradiance";
    let ents_arrs;
    if (__model__.debug) {
        chk.checkArgs(fn_name, "sensors", sensors, [chk.isRayL, chk.isPlnL, chk.isRayLL, chk.isPlnLL]);
        ents_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, "entities", entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.PGON, mobius_sim_1.EEntType.COLL]);
        chk.checkArgs(fn_name, "radius", radius, [chk.isNum, chk.isNumL]);
        if (Array.isArray(radius)) {
            if (radius.length !== 2) {
                throw new Error('If "radius" is a list, it must have a length of two: \
                [min_dist, max_dist].');
            }
            if (radius[0] >= radius[1]) {
                throw new Error('If "radius" is a list, the "min_dist" must be less than \
                the "max_dist": [min_dist, max_dist].');
            }
        }
        // check that we have sky radiance data
        if (!__model__.modeldata.attribs.query.hasModelAttrib("sky")) {
            throw new Error('analyze.Irradiance: For calculating irradiance, the model must have data, \
                describing the sky radiance. See the documentation of the analyze.Irradiance \
                function.');
        }
    }
    else {
        ents_arrs = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    radius = Array.isArray(radius) ? radius : [1, radius];
    // get rays for sensor points
    const [sensors0, sensors1, two_lists] = (0, _shared_1._getSensorRays)(sensors, 0.01); // offset by 0.01
    // create mesh
    const [mesh_tjs, _] = (0, mobius_sim_1.createSingleMeshBufTjs)(__model__, ents_arrs);
    // get the sky data from attribute
    const sky_rad = __model__.modeldata.attribs.get.getModelAttribVal("sky");
    const sky_rad_data = typeof sky_rad === 'string' ?
        JSON.parse(sky_rad) : sky_rad;
    // weighted or unweighted
    const weighted = method === _enum_1._ESkyMethod.WEIGHTED;
    // run simulation
    const results0 = _calcIrradiance(__model__, sensors0, radius, sky_rad_data, mesh_tjs, weighted, false);
    const results1 = _calcIrradiance(__model__, sensors1, radius, sky_rad_data, mesh_tjs, weighted, true);
    // cleanup
    mesh_tjs.geometry.dispose();
    mesh_tjs.material.dispose();
    // return the results
    if (two_lists) {
        return [results0, results1];
    }
    return results0;
}
exports.Irradiance = Irradiance;
// =================================================================================================
function _calcIrradiance(__model__, sensor_rays, radius, sky_rad_data, mesh_tjs, weighted, generate_lines) {
    const results = [];
    const patches = sky_rad_data.SkyDome.patches;
    // create tjs objects (to be resued for each ray)
    const sensor_tjs = new THREE.Vector3();
    const dir_tjs = new THREE.Vector3();
    const ray_tjs = new THREE.Raycaster(sensor_tjs, dir_tjs, radius[0], radius[1]);
    // shoot rays
    for (const [sensor_xyz, sensor_dir] of sensor_rays) {
        // set raycaster origin
        sensor_tjs.x = sensor_xyz[0];
        sensor_tjs.y = sensor_xyz[1];
        sensor_tjs.z = sensor_xyz[2];
        let sensor_result = 0;
        const result_rays = [];
        for (const patch of patches) {
            const ray_dir = patch.vector;
            // check if target is behind sensor
            const dot_ray_sensor = (0, mobius_sim_1.vecDot)(ray_dir, sensor_dir);
            if (dot_ray_sensor <= -EPS) {
                continue;
            }
            // set raycaster direction
            dir_tjs.x = ray_dir[0];
            dir_tjs.y = ray_dir[1];
            dir_tjs.z = ray_dir[2];
            // shoot raycaster
            const isects = ray_tjs.intersectObject(mesh_tjs, false);
            // get results
            if (isects.length === 0) {
                if (weighted) {
                    // this applies the cosine weighting rule
                    sensor_result = sensor_result + (patch.radiance * patch.area * dot_ray_sensor);
                }
                else {
                    // this applies no cosine weighting
                    sensor_result = sensor_result + (patch.radiance * patch.area);
                }
                const ray_end = (0, mobius_sim_1.vecAdd)(sensor_xyz, (0, mobius_sim_1.vecMult)(ray_dir, 2));
                result_rays.push([ray_end, 0]);
            }
            else {
                const ray_end = (0, mobius_sim_1.vecAdd)(sensor_xyz, (0, mobius_sim_1.vecMult)(ray_dir, isects[0].distance));
                result_rays.push([ray_end, 1]);
            }
        }
        results.push(sensor_result);
        // generate calculation lines
        if (generate_lines) {
            (0, _shared_1._generateLines)(__model__, sensor_xyz, result_rays);
        }
    }
    return { irradiance: results };
}
exports._calcIrradiance = _calcIrradiance;
// =================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXJyYWRpYW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hbmFseXplL0lycmFkaWFuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFnQnVDO0FBQ3ZDLDZDQUErQjtBQUMvQixpREFBZ0Q7QUFDaEQsd0RBQTBDO0FBQzFDLG1DQUFzQztBQUN0Qyx1Q0FBMkQ7QUFDM0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBdUJqQixvR0FBb0c7QUFDcEc7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxTQUFnQixVQUFVLENBQ3RCLFNBQWtCLEVBQ2xCLE9BQWtELEVBQ2xELFFBQStCLEVBQy9CLE1BQWlDLEVBQ2pDLE1BQW1CO0lBRW5CLFFBQVEsR0FBRyxJQUFBLHdCQUFXLEVBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLG9CQUFvQixDQUFDO0lBQ3JDLElBQUksU0FBd0IsQ0FBQztJQUM3QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFDckMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN4RCxTQUFTLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDekQsQ0FBQyxlQUFFLENBQUMsSUFBSSxFQUFFLGVBQUUsQ0FBQyxNQUFNLENBQUMsRUFDcEIsQ0FBQyxxQkFBUSxDQUFDLElBQUksRUFBRSxxQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFrQixDQUFDO1FBQ3JELEdBQUcsQ0FBQyxTQUFTLENBQUMs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