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
exports.Physical = void 0;
const chk = __importStar(require("../../../_check_types"));
const _enum_1 = require("./_enum");
const _shared_1 = require("./_shared");
// ================================================================================================
/**
 * Creates a Physical material and saves it in the model attributes.
 * If a material with the same name already exits, these settings will be added to the existing material.
 * \n
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial)
 * \n
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * \n
 * @param name The name of the material.
 * @param emissive The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param roughness The roughness, between 0 (smooth) and 1 (rough).
 * @param metalness The metalness, between 0 (non-metalic) and 1 (metalic).
 * @param reflectivity The reflectivity, between 0 (non-reflective) and 1 (reflective).
 * @returns void
 */
function Physical(__model__, name, emissive, roughness, metalness, reflectivity) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.Physical';
        chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
        chk.checkArgs(fn_name, 'emissive', emissive, [chk.isColor]);
        chk.checkArgs(fn_name, 'roughness', roughness, [chk.isNum]);
        chk.checkArgs(fn_name, 'metalness', metalness, [chk.isNum]);
        chk.checkArgs(fn_name, 'reflectivity', reflectivity, [chk.isNum]);
    }
    // --- Error Check ---
    (0, _shared_1._clampArr01)(emissive);
    roughness = (0, _shared_1._clamp01)(roughness);
    metalness = (0, _shared_1._clamp01)(metalness);
    reflectivity = (0, _shared_1._clamp01)(reflectivity);
    const settings_obj = {
        type: _enum_1._EMeshMaterialType.PHYSICAL,
        emissive: emissive,
        roughness: roughness,
        metalness: metalness,
        reflectivity: reflectivity
    };
    (0, _shared_1._setMaterialModelAttrib)(__model__, name, settings_obj);
}
exports.Physical = Physical;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGh5c2ljYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvbWF0ZXJpYWwvUGh5c2ljYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSwyREFBNkM7QUFDN0MsbUNBQTZDO0FBQzdDLHVDQUEyRTtBQUczRSxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsU0FBZ0IsUUFBUSxDQUFDLFNBQWtCLEVBQUUsSUFBWSxFQUM3QyxRQUFnQixFQUNoQixTQUFpQixFQUNqQixTQUFpQixFQUNqQixZQUFvQjtJQUU1QixzQkFBc0I7SUFDdEIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLE1BQU0sT0FBTyxHQUFHLG1CQUFtQixDQUFDO1FBQ3BDLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNsRCxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDNUQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzVELEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM1RCxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDckU7SUFDRCxzQkFBc0I7SUFDdEIsSUFBQSxxQkFBVyxFQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RCLFNBQVMsR0FBRyxJQUFBLGtCQUFRLEVBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEMsU0FBUyxHQUFHLElBQUEsa0JBQVEsRUFBQyxTQUFTLENBQUMsQ0FBQztJQUNoQyxZQUFZLEdBQUcsSUFBQSxrQkFBUSxFQUFDLFlBQVksQ0FBQyxDQUFDO0lBRXRDLE1BQU0sWUFBWSxHQUFHO1FBQ2pCLElBQUksRUFBRSwwQkFBa0IsQ0FBQyxRQUFRO1FBQ2pDLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFlBQVksRUFBRSxZQUFZO0tBQzdCLENBQUM7SUFDRixJQUFBLGlDQUF1QixFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQTdCRCw0QkE2QkMifQ==