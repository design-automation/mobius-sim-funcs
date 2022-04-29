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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sun = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const underscore_1 = __importDefault(require("underscore"));
const _check_ids_1 = require("../../../_check_ids");
const chk = __importStar(require("../../../_check_types"));
const _enum_1 = require("./_enum");
const _shared_1 = require("./_shared");
// ================================================================================================
/**
 * Calculate an approximation of the solar exposure factor, for a set sensors positioned at specfied locations.
 * The solar exposure factor for each sensor is a value between 0 and 1, where 0 means that it has no exposure
 * and 1 means that it has maximum exposure.
 * \n
 * The calculation takes into account the geolocation and the north direction of the model.
 * Geolocation is specified by a model attributes as follows:
 *  - @geolocation={'longitude':123,'latitude':12}.
 * North direction is specified by a model attribute as follows, using a vector:
 *  - @north==[1,2]
 * If no north direction is specified, then [0,1] is the default (i.e. north is in the direction of the y-axis);
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
 * 2. If the ray hits an obstruction, assign a wight of 0 to that ray.
 * 3. If a ray does not hit any obstructions, assign a weight between 0 and 1, depending on the incidence angle.
 * 4. Calculate the total solar expouse by adding up the weights for all rays.
 * 5. Divide by the maximum possible solar exposure for an unobstructed sensor.
 * \n
 * The solar exposure calculation takes into account the angle of incidence of the sun ray to the sensor direction.
 * Sun rays that are hitting the sensor straight on are assigned a weight of 1.
 * Sun rays that are hitting the sensor at an oblique angle are assigned a weight equal to the cosine of the angle.
 * \n
 * If 'direct_exposure' is selected, then the points on the sky dome will follow the path of the sun throughout the year.
 * If 'indirect_exposure' is selected, then the points on the sky dome will consist of points excluded by
 * the path of the sun throughout the year.
 * \n
 * The direct sky dome points cover a strip of sky where the sun travels.
 * The inderect sky dome points cover the segments of sky either side of the direct sun strip.
 * \n
 * The detail parameter spacifies the number of rays that get generated.
 * The higher the level of detail, the more accurate but also the slower the analysis will be.
 * The number of rays differs depending on the latitde.
 * \n
 * At latitude 0, the number of rays for 'direct' are as follows:
 * 0 = 44 rays,
 * 1 = 105 rays,
 * 2 = 510 rays,
 * 3 = 1287 rays.
 * \n
 * At latitude 0, the number of rays for 'indirect' are as follows:
 * 0 = 58 rays,
 * 1 = 204 rays,
 * 2 = 798 rays,
 * 3 = 3122 rays.
 * \n
 * The number of rays for 'sky' are as follows:
 * 0 = 89 rays,
 * 1 = 337 rays,
 * 2 = 1313 rays,
 * 3 = 5185 rays.
 * \n
 * Returns a dictionary containing solar exposure results.
 * \n
 * If one  of the 'direct' methods is selected, the dictionary will contain:
 * 1. 'direct': A list of numbers, the direct exposure factors.
 * \n
 * If one  of the 'indirect' methods is selected, the dictionary will contain:
 * 1. 'indirect': A list of numbers, the indirect exposure factors.
 * \n
 * \n
 * @param __model__
 * @param origins A list of coordinates, a list of Rays or a list of Planes, to be used as the origins for calculating exposure.
 * @param detail An integer between 1 and 3 inclusive, specifying the level of detail for the analysis.
 * @param entities The obstructions, faces, polygons, or collections of faces or polygons.
 * @param limits The max distance for raytracing.
 * @param method Enum; solar method.
 */
function Sun(__model__, origins, detail, entities, limits, method) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    // --- Error Check ---
    const fn_name = "analyze.Sun";
    let ents_arrs;
    let latitude = null;
    let north = [0, 1];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origins", origins, [chk.isXYZL, chk.isRayL, chk.isPlnL]);
        chk.checkArgs(fn_name, "detail", detail, [chk.isInt]);
        if (detail < 0 || detail > 3) {
            throw new Error(fn_name + ': "detail" must be an integer between 0 and 3 inclusive.');
        }
        ents_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, "entities", entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.PGON, mobius_sim_1.EEntType.COLL]);
        if (!__model__.modeldata.attribs.query.hasModelAttrib("geolocation")) {
            throw new Error('analyze.Solar: model attribute "geolocation" is missing, \
                e.g. @geolocation = {"latitude":12, "longitude":34}');
        }
        else {
            const geolocation = __model__.modeldata.attribs.get.getModelAttribVal("geolocation");
            if (underscore_1.default.isObject(geolocation) && underscore_1.default.has(geolocation, "latitude")) {
                latitude = geolocation["latitude"];
            }
            else {
                throw new Error('analyze.Solar: model attribute "geolocation" is missing the "latitude" key, \
                    e.g. @geolocation = {"latitude":12, "longitude":34}');
            }
        }
        if (__model__.modeldata.attribs.query.hasModelAttrib("north")) {
            north = __model__.modeldata.attribs.get.getModelAttribVal("north");
            if (!Array.isArray(north) || north.length !== 2) {
                throw new Error('analyze.Solar: model has a "north" attribute with the wrong type, \
                it should be a vector with two values, \
                e.g. @north =  [1,2]');
            }
        }
    }
    else {
        ents_arrs = (0, mobius_sim_1.idsBreak)(entities);
        const geolocation = __model__.modeldata.attribs.get.getModelAttribVal("geolocation");
        latitude = geolocation["latitude"];
        if (__model__.modeldata.attribs.query.hasModelAttrib("north")) {
            north = __model__.modeldata.attribs.get.getModelAttribVal("north");
        }
    }
    // TODO
    // TODO
    // --- Error Check ---
    // TODO North direction
    const sensor_oris_dirs_tjs = (0, _shared_1._rayOrisDirsTjs)(__model__, origins, 0.01);
    const [mesh_tjs, idx_to_face_i] = (0, mobius_sim_1.createSingleMeshBufTjs)(__model__, ents_arrs);
    limits = Array.isArray(limits) ? limits : [0, limits];
    // return the result
    const results = {};
    switch (method) {
        case _enum_1._ESolarMethod.DIRECT_WEIGHTED:
        case _enum_1._ESolarMethod.DIRECT_UNWEIGHTED:
            // get the direction vectors
            const ray_dirs_tjs1 = underscore_1.default.flatten(_solarDirsTjs(latitude, north, detail, method));
            // run the simulation
            const weighted1 = method === _enum_1._ESolarMethod.DIRECT_WEIGHTED;
            results["direct"] = (0, _shared_1._calcExposure)(sensor_oris_dirs_tjs, ray_dirs_tjs1, mesh_tjs, limits, weighted1);
            break;
        case _enum_1._ESolarMethod.INDIRECT_WEIGHTED:
        case _enum_1._ESolarMethod.INDIRECT_UNWEIGHTED:
            // get the direction vectors
            const ray_dirs_tjs2 = underscore_1.default.flatten(_solarDirsTjs(latitude, north, detail, method));
            // run the simulation
            const weighted2 = method === _enum_1._ESolarMethod.INDIRECT_WEIGHTED;
            results["indirect"] = (0, _shared_1._calcExposure)(sensor_oris_dirs_tjs, ray_dirs_tjs2, mesh_tjs, limits, weighted2);
            break;
        default:
            throw new Error("Solar method not recognised.");
    }
    // cleanup
    mesh_tjs.geometry.dispose();
    mesh_tjs.material.dispose();
    // return dict
    return results;
}
exports.Sun = Sun;
function _solarDirsTjs(latitude, north, detail, method) {
    switch (method) {
        case _enum_1._ESolarMethod.DIRECT_WEIGHTED:
        case _enum_1._ESolarMethod.DIRECT_UNWEIGHTED:
            return (0, _shared_1._solarRaysDirectTjs)(latitude, north, detail);
        case _enum_1._ESolarMethod.INDIRECT_WEIGHTED:
        case _enum_1._ESolarMethod.INDIRECT_UNWEIGHTED:
            return (0, _shared_1._solarRaysIndirectTjs)(latitude, north, detail);
        // case _ESolarMethod.ALL:
        //     throw new Error('Not implemented');
        default:
            throw new Error("Solar method not recognised.");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2FuYWx5emUvU3VuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBWXVDO0FBRXZDLDREQUFnQztBQUVoQyxvREFBbUQ7QUFDbkQsMkRBQTZDO0FBQzdDLG1DQUF3QztBQUN4Qyx1Q0FBdUc7QUFHdkcsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEVHO0FBQ0gsU0FBZ0IsR0FBRyxDQUNmLFNBQWtCLEVBQ2xCLE9BQW1DLEVBQ25DLE1BQWMsRUFDZCxRQUErQixFQUMvQixNQUFpQyxFQUNqQyxNQUFxQjtJQUVyQixRQUFRLEdBQUcsSUFBQSx3QkFBVyxFQUFDLFFBQVEsQ0FBVSxDQUFDO0lBQzFDLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUM7SUFDOUIsSUFBSSxTQUF3QixDQUFDO0lBQzdCLElBQUksUUFBUSxHQUFXLElBQUksQ0FBQztJQUM1QixJQUFJLEtBQUssR0FBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN4QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNqRixHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBSSxNQUFNLEdBQUcsQ0FBQyxJ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