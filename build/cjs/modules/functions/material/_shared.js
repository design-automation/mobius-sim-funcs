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
exports._setMaterialModelAttrib = exports._clampArr01 = exports._clamp0100 = exports._clamp01 = exports._convertSelectEcolorsToNum = exports._convertSelectESideToNum = void 0;
/**
 * The `material` module has functions for defining materials.
 * The material definitions are saved as attributes at the model level.
 * For more informtion, see the threejs docs: https://threejs.org/
 * @module
 */
const mobius_sim_1 = require("@design-automation/mobius-sim");
const THREE = __importStar(require("three"));
const _enum_1 = require("./_enum");
// ================================================================================================
function _convertSelectESideToNum(select) {
    switch (select) {
        case _enum_1._ESide.FRONT:
            return THREE.FrontSide;
        case _enum_1._ESide.BACK:
            return THREE.BackSide;
        default:
            return THREE.DoubleSide;
    }
}
exports._convertSelectESideToNum = _convertSelectESideToNum;
function _convertSelectEcolorsToNum(select) {
    switch (select) {
        case _enum_1._Ecolors.NO_VERT_COLORS:
            return 0;
        default:
            return 1;
    }
}
exports._convertSelectEcolorsToNum = _convertSelectEcolorsToNum;
function _clamp01(val) {
    val = (val > 1) ? 1 : val;
    val = (val < 0) ? 0 : val;
    return val;
}
exports._clamp01 = _clamp01;
function _clamp0100(val) {
    val = (val > 100) ? 100 : val;
    val = (val < 0) ? 0 : val;
    return val;
}
exports._clamp0100 = _clamp0100;
function _clampArr01(vals) {
    for (let i = 0; i < vals.length; i++) {
        vals[i] = _clamp01(vals[i]);
    }
}
exports._clampArr01 = _clampArr01;
function _setMaterialModelAttrib(__model__, name, settings_obj) {
    // if the material already exists, then existing settings will be added
    // but new settings will take precedence
    if (__model__.modeldata.attribs.query.hasModelAttrib(name)) {
        const exist_settings_obj = __model__.modeldata.attribs.get.getModelAttribVal(name);
        // check that the existing material is a Basic one
        if (exist_settings_obj['type'] !== _enum_1._EMeshMaterialType.BASIC) {
            if (settings_obj['type'] !== exist_settings_obj['type']) {
                throw new Error('Error creating material: non-basic material with this name already exists.');
            }
        }
        // copy the settings from the existing material to the new material
        for (const key of Object.keys(exist_settings_obj)) {
            if (settings_obj[key] === undefined) {
                settings_obj[key] = exist_settings_obj[key];
            }
        }
    }
    else {
        __model__.modeldata.attribs.add.addAttrib(mobius_sim_1.EEntType.MOD, name, mobius_sim_1.EAttribDataTypeStrs.DICT);
    }
    // const settings_str: string = JSON.stringify(settings_obj);
    __model__.modeldata.attribs.set.setModelAttribVal(name, settings_obj);
}
exports._setMaterialModelAttrib = _setMaterialModelAttrib;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3NoYXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9tYXRlcmlhbC9fc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7R0FLRztBQUNILDhEQUF1RjtBQUN2Riw2Q0FBK0I7QUFFL0IsbUNBQStEO0FBRy9ELG1HQUFtRztBQUVuRyxTQUFnQix3QkFBd0IsQ0FBQyxNQUFjO0lBQ25ELFFBQVEsTUFBTSxFQUFFO1FBQ1osS0FBSyxjQUFNLENBQUMsS0FBSztZQUNiLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUMzQixLQUFLLGNBQU0sQ0FBQyxJQUFJO1lBQ1osT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQzFCO1lBQ0ksT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDO0tBQy9CO0FBQ0wsQ0FBQztBQVRELDREQVNDO0FBQ0QsU0FBZ0IsMEJBQTBCLENBQUMsTUFBZ0I7SUFDdkQsUUFBUSxNQUFNLEVBQUU7UUFDWixLQUFLLGdCQUFRLENBQUMsY0FBYztZQUN4QixPQUFPLENBQUMsQ0FBQztRQUNiO1lBQ0ksT0FBTyxDQUFDLENBQUM7S0FDaEI7QUFDTCxDQUFDO0FBUEQsZ0VBT0M7QUFDRCxTQUFnQixRQUFRLENBQUMsR0FBVztJQUNoQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQzFCLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDMUIsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBSkQsNEJBSUM7QUFDRCxTQUFnQixVQUFVLENBQUMsR0FBVztJQUNsQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQzlCLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDMUIsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBSkQsZ0NBSUM7QUFDRCxTQUFnQixXQUFXLENBQUMsSUFBYztJQUN0QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9CO0FBQ0wsQ0FBQztBQUpELGtDQUlDO0FBQ0QsU0FBZ0IsdUJBQXVCLENBQUMsU0FBa0IsRUFBRSxJQUFZLEVBQUUsWUFBb0I7SUFDMUYsdUVBQXVFO0lBQ3ZFLHdDQUF3QztJQUN4QyxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDeEQsTUFBTSxrQkFBa0IsR0FBVyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFXLENBQUM7UUFDckcsa0RBQWtEO1FBQ2xELElBQUksa0JBQWtCLENBQUMsTUFBTSxDQUFDLEtBQUssMEJBQWtCLENBQUMsS0FBSyxFQUFFO1lBQ3pELElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNyRCxNQUFNLElBQUksS0FBSyxDQUFDLDRFQUE0RSxDQUFDLENBQUM7YUFDakc7U0FDSjtRQUNELG1FQUFtRTtRQUNuRSxLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRTtZQUMvQyxJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQ2pDLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUMvQztTQUNKO0tBQ0o7U0FBTTtRQUNILFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMscUJBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLGdDQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzNGO0lBQ0QsNkRBQTZEO0lBQzdELFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDMUUsQ0FBQztBQXRCRCwwREFzQkMifQ==