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
exports.Sky = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const THREE = __importStar(require("three"));
const _check_ids_1 = require("../../../_check_ids");
const chk = __importStar(require("../../../_check_types"));
const _enum_1 = require("./_enum");
const _shared_1 = require("./_shared");
/**
 * Calculate an approximation of the sky exposure factor, for a set sensors positioned at specified locations.
 * The sky exposure factor for each sensor is a value between 0 and 1, where 0 means that it has no exposure
 * and 1 means that it has maximum exposure.
 * \n
 * Each sensor has a location and direction, specified using either rays or planes.
 * The direction of the sensor specifies what is infront and what is behind the sensor.
 * For each sensor, only exposure infront of the sensor is calculated.
 * \n
 * The exposure is calculated by shooting rays in reverse.
 * from the sensor origin to a set of points on the sky dome.
 * If the rays hits an obstruction, then the sky dome is obstructed..
 * If the ray hits no obstructions, then the sky dome is not obstructed.
 * \n
 * The exposure factor at each sensor point is calculated as follows:
 * 1. Shoot rays to all sky dome points.
 * 2. If the ray hits an obstruction, assign a weight of 0 to that ray.
 * 3. If a ray does not hit any obstructions, assign a weight between 0 and 1, depending on the incidence angle.
 * 4. Calculate the total solar expouse by adding up the weights for all rays.
 * 5. Divide by the maximum possible exposure for an unobstructed sensor with a direction pointing straight up.
 * \n
 * If 'weighted' is selected, then
 * the exposure calculation takes into account the angle of incidence of the ray to the sensor direction.
 * Rays parallel to the sensor direction are assigned a weight of 1.
 * Rays at an oblique angle are assigned a weight equal to the cosine of the angle
 * betweeen the sensor direction and the ray.
 * \n
 * If 'unweighted' is selected, then all rays are assigned a weight of 1, irresepctive of angle.
 * \n
 * The detail parameter spacifies the number of rays that get generated.
 * The higher the level of detail, the more accurate but also the slower the analysis will be.
 * \n
 * The number of rays are as follows:
 * 0 = 89 rays,
 * 1 = 337 rays,
 * 2 = 1313 rays,
 * 3 = 5185 rays.
 * \n
 * Returns a dictionary containing exposure results.
 * \n
 * 1. 'exposure': A list of numbers, the exposure factors.
 * \n
 * \n
 * @param __model__
 * @param origins A list of coordinates, a list of Rays or a list of Planes, to be used as the origins for calculating exposure.
 * @param detail An integer between 1 and 3 inclusive, specifying the level of detail for the analysis.
 * @param entities The obstructions, faces, polygons, or collections of faces or polygons.
 * @param limits The max distance for raytracing.
 * @param method Enum; sky method.
 */
function Sky(__model__, origins, detail, entities, limits, method) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    // --- Error Check ---
    const fn_name = "analyze.Sky";
    let ents_arrs;
    // let latitude: number = null;
    // let north: Txy = [0, 1];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origins", origins, [chk.isXYZL, chk.isRayL, chk.isPlnL]);
        chk.checkArgs(fn_name, "detail", detail, [chk.isInt]);
        if (detail < 0 || detail > 3) {
            throw new Error(fn_name + ': "detail" must be an integer between 0 and 3 inclusive.');
        }
        ents_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, "entities", entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.PGON, mobius_sim_1.EEntType.COLL]);
    }
    else {
        ents_arrs = (0, mobius_sim_1.idsBreak)(entities);
        // const geolocation = __model__.modeldata.attribs.get.getModelAttribVal('geolocation');
        // latitude = geolocation['latitude'];
        // if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
        //     north = __model__.modeldata.attribs.get.getModelAttribVal('north') as Txy;
        // }
    }
    // TODO
    // TODO
    // --- Error Check ---
    const sensor_oris_dirs_tjs = (0, _shared_1._rayOrisDirsTjs)(__model__, origins, 0.01);
    const [mesh_tjs, idx_to_face_i] = (0, mobius_sim_1.createSingleMeshBufTjs)(__model__, ents_arrs);
    limits = Array.isArray(limits) ? limits : [0, limits];
    // get the direction vectors
    const ray_dirs_tjs = _skyRayDirsTjs(detail);
    // run the simulation
    const weighted = method === _enum_1._ESkyMethod.WEIGHTED;
    const results = (0, _shared_1._calcExposure)(sensor_oris_dirs_tjs, ray_dirs_tjs, mesh_tjs, limits, weighted);
    // cleanup
    mesh_tjs.geometry.dispose();
    mesh_tjs.material.dispose();
    // return the result
    return { exposure: results };
}
exports.Sky = Sky;
function _skyRayDirsTjs(detail) {
    const hedron_tjs = new THREE.IcosahedronGeometry(1, detail + 2);
    // calc vectors
    const vecs = [];
    // THREE JS UPDATE --> EDITED
    // for (const vec of hedron_tjs.vertices) {
    //     // vec.applyAxisAngle(YAXIS, Math.PI / 2);
    //     if (vec.z > -1e-6) {
    //         vecs.push(vec);
    //     }
    // }
    let vec = [];
    for (const coord of hedron_tjs.getAttribute("position").array) {
        vec.push(coord);
        if (vec.length === 3) {
            if (vec[2] > -1e-6) {
                vecs.push(new THREE.Vector3(...vec));
            }
            vec = [];
        }
    }
    return vecs;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2t5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2FuYWx5emUvU2t5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBV3VDO0FBQ3ZDLDZDQUErQjtBQUUvQixvREFBbUQ7QUFDbkQsMkRBQTZDO0FBQzdDLG1DQUFzQztBQUN0Qyx1Q0FBMkQ7QUFJM0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpREc7QUFDSCxTQUFnQixHQUFHLENBQ2YsU0FBa0IsRUFDbEIsT0FBbUMsRUFDbkMsTUFBYyxFQUNkLFFBQStCLEVBQy9CLE1BQWlDLEVBQ2pDLE1BQW1CO0lBRW5CLFFBQVEsR0FBRyxJQUFBLHdCQUFXLEVBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQztJQUM5QixJQUFJLFNBQXdCLENBQUM7SUFDN0IsK0JBQStCO0lBQy9CLDJCQUEyQjtJQUMzQixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNqRixHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcsMERBQTBELENBQUMsQ0FBQztTQUN6RjtRQUNELFNBQVMsR0FBRyxJ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