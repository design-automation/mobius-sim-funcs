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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkyDome = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const THREE = __importStar(require("three"));
const underscore_1 = __importDefault(require("underscore"));
const chk = __importStar(require("../../../_check_types"));
const _enum_1 = require("./_enum");
const _shared_1 = require("./_shared");
// ================================================================================================
/**
 * Generates a sun path, oriented according to the geolocation and north direction.
 * The sun path is generated as an aid to visualize the orientation of the sun relative to the model.
 * Note that the solar exposure calculations do not require the sub path to be visualized.
 * \n
 * The sun path takes into account the geolocation and the north direction of the model.
 * Geolocation is specified by a model attributes as follows:
 * @geolocation={'longitude':123,'latitude':12}.
 * North direction is specified by a model attribute as follows, using a vector:
 * @north==[1,2]
 * If no north direction is specified, then [0,1] is the default (i.e. north is in the direction of the y-axis);
 * \n
 * @param __model__
 * @param origins The origins of the rays
 * @param detail The level of detail for the analysis
 * @param radius The radius of the sun path
 * @param method Enum, the type of sky to generate.
 */
function SkyDome(__model__, origin, detail, radius, method) {
    // --- Error Check ---
    const fn_name = "analyze.SkyDome";
    let latitude = null;
    let north = [0, 1];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origin", origin, [chk.isXYZ, chk.isRay, chk.isPln]);
        chk.checkArgs(fn_name, "detail", detail, [chk.isInt]);
        if (detail < 0 || detail > 6) {
            throw new Error(fn_name + ': "detail" must be an integer between 0 and 6.');
        }
        chk.checkArgs(fn_name, "radius", radius, [chk.isNum]);
        if (method !== _enum_1._ESunPathMethod.SKY) {
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
    }
    else {
        const geolocation = __model__.modeldata.attribs.get.getModelAttribVal("geolocation");
        latitude = geolocation["latitude"];
        if (__model__.modeldata.attribs.query.hasModelAttrib("north")) {
            north = __model__.modeldata.attribs.get.getModelAttribVal("north");
        }
    }
    // --- Error Check ---
    // create the matrix one time
    const matrix = new THREE.Matrix4();
    const origin_depth = (0, mobius_sim_1.getArrDepth)(origin);
    if (origin_depth === 2 && origin.length === 2) {
        // origin is a ray
        matrix.makeTranslation(...origin[0]);
    }
    else if (origin_depth === 2 && origin.length === 3) {
        // origin is a plane
        // matrix = xfromSourceTargetMatrix(XYPLANE, origin as TPlane); // TODO xform not nceessary
        matrix.makeTranslation(...origin[0]);
    }
    else {
        // origin is Txyz
        matrix.makeTranslation(...origin);
    }
    // generate the positions on the sky dome
    switch (method) {
        case _enum_1._ESunPathMethod.DIRECT:
            const rays_dirs_tjs1 = (0, _shared_1._solarRaysDirectTjs)(latitude, north, detail);
            return _sunPathGenPosisNested(__model__, rays_dirs_tjs1, radius, matrix);
        case _enum_1._ESunPathMethod.INDIRECT:
            const rays_dirs_tjs2 = (0, _shared_1._solarRaysIndirectTjs)(latitude, north, detail);
            return _sunPathGenPosis(__model__, rays_dirs_tjs2, radius, matrix);
        case _enum_1._ESunPathMethod.SKY:
            const rays_dirs_tjs3 = (0, _shared_1._skyRayDirsTjs)(detail);
            return _sunPathGenPosis(__model__, rays_dirs_tjs3, radius, matrix);
        default:
            throw new Error("Sunpath method not recognised.");
    }
}
exports.SkyDome = SkyDome;
function _sunPathGenPosisNested(__model__, rays_dirs_tjs, radius, matrix) {
    const posis = [];
    for (const one_day_tjs of rays_dirs_tjs) {
        posis.push(_sunPathGenPosis(__model__, one_day_tjs, radius, matrix));
    }
    return posis;
}
function _sunPathGenPosis(__model__, rays_dirs_tjs, radius, matrix) {
    const posis_i = [];
    for (const direction_tjs of rays_dirs_tjs) {
        let xyz = (0, mobius_sim_1.vecMult)([direction_tjs.x, direction_tjs.y, direction_tjs.z], radius);
        xyz = (0, mobius_sim_1.multMatrix)(xyz, matrix);
        const posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    return (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, posis_i);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2t5RG9tZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hbmFseXplL1NreURvbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhEQVl1QztBQUN2Qyw2Q0FBK0I7QUFDL0IsNERBQWdDO0FBRWhDLDJEQUE2QztBQUM3QyxtQ0FBMEM7QUFDMUMsdUNBQXVGO0FBR3ZGLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxTQUFnQixPQUFPLENBQUMsU0FBa0IsRUFBRSxNQUE0QixFQUFFLE1BQWMsRUFBRSxNQUFjLEVBQUUsTUFBdUI7SUFDN0gsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDO0lBQ2xDLElBQUksUUFBUSxHQUFXLElBQUksQ0FBQztJQUM1QixJQUFJLEtBQUssR0FBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN4QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM1RSxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcsZ0RBQWdELENBQUMsQ0FBQztTQUMvRTtRQUNELEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUs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