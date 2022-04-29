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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3NoYXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9tYXRlcmlhbC9fc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7O0dBS0c7QUFDSCw4REFBdUY7QUFDdkYsNkNBQStCO0FBRS9CLG1DQUErRDtBQUcvRCxtR0FBbUc7QUFFbkcsU0FBZ0Isd0JBQXdCLENBQUMsTUFBYztJQUNuRCxRQUFRLE1BQU0sRUFBRTtRQUNaLEtBQUssY0FBTSxDQUFDLEtBQUs7WUFDYixPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDM0IsS0FBSyxjQUFNLENBQUMsSUFBSTtZQUNaLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUMxQjtZQUNJLE9BQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQztLQUMvQjtBQUNMLENBQUM7QUFURCw0REFTQztBQUNELFNBQWdCLDBCQUEwQixDQUFDLE1BQWdCO0lBQ3ZELFFBQVEsTUFBTSxFQUFFO1FBQ1osS0FBSyxnQkFBUSxDQUFDLGNBQWM7WUFDeEIsT0FBTyxDQUFDLENBQUM7UUFDYjtZQUNJLE9BQU8sQ0FBQyxDQUFDO0tBQ2hCO0FBQ0wsQ0FBQztBQVBELGdFQU9DO0FBQ0QsU0FBZ0IsUUFBUSxDQUFDLEdBQVc7SUFDaEMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUMxQixHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQzFCLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUpELDRCQUlDO0FBQ0QsU0FBZ0IsVUFBVSxDQUFDLEdBQVc7SUFDbEMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUM5QixHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQzFCLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUpELGdDQUlDO0FBQ0QsU0FBZ0IsV0FBVyxDQUFDLElBQWM7SUFDdEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbEMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvQjtBQUNMLENBQUM7QUFKRCxrQ0FJQztBQUNELFNBQWdCLHVCQUF1QixDQUFDLFNBQWtCLEVBQUUsSUFBWSxFQUFFLFlBQW9CO0lBQzFGLHVFQUF1RTtJQUN2RSx3Q0FBd0M7SUFDeEMsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3hELE1BQU0sa0JBQWtCLEdBQVcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBVyxDQUFDO1FBQ3JHLGtEQUFrRDtRQUNsRCxJQUFJLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxLQUFLLDBCQUFrQixDQUFDLEtBQUssRUFBRTtZQUN6RCxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDckQsTUFBTSxJQUFJLEtBQUssQ0FBQyw0RUFBNEUsQ0FBQyxDQUFDO2FBQ2pHO1NBQ0o7UUFDRCxtRUFBbUU7UUFDbkUsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUU7WUFDL0MsSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUNqQyxZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDL0M7U0FDSjtLQUNKO1NBQU07UUFDSCxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHFCQUFRLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxnQ0FBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMzRjtJQUNELDZEQUE2RDtJQUM3RCxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzFFLENBQUM7QUF0QkQsMERBc0JDIn0=