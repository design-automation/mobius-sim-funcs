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
exports.MeshMat = void 0;
const chk = __importStar(require("../../../_check_types"));
const _enum_1 = require("./_enum");
const _shared_1 = require("./_shared");
// ================================================================================================
/**
 * Creates a basic mesh material and saves it in the model attributes.
 * \n
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial)
 * \n
 * The color of the material can either ignore or apply the vertex rgb colors.
 * If 'apply' id selected, then the actual color will be a combination of the material color
 * and the vertex colors, as specified by the a vertex attribute called 'rgb'.
 * In such a case, if material color is set to white, then it will
 * have no effect, and the color will be defined by the vertex [r,g,b] values.
 * \n
 * Additional material properties can be set by calling the functions for the more advanced materials.
 * These include LambertMaterial, PhongMaterial, StandardMaterial, and Physical Material.
 * Each of these more advanced materials allows you to specify certain additional settings.
 * \n
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'.
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * \n
 * @param name The name of the material.
 * @param color The diffuse color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param opacity The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).
 * @param select_side Enum, select front, back, or both.
 * @param select_vert_colors Enum, select whether to use vertex colors if they exist.
 * @returns void
 */
function MeshMat(__model__, name, color, opacity, select_side, select_vert_colors) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.MeshMat';
        chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
        chk.checkArgs(fn_name, 'color', color, [chk.isColor]);
        chk.checkArgs(fn_name, 'opacity', opacity, [chk.isNum01]);
    }
    // --- Error Check ---
    const side = (0, _shared_1._convertSelectESideToNum)(select_side);
    const vert_colors = (0, _shared_1._convertSelectEcolorsToNum)(select_vert_colors);
    opacity = (0, _shared_1._clamp01)(opacity);
    const transparent = opacity < 1;
    (0, _shared_1._clampArr01)(color);
    const settings_obj = {
        type: _enum_1._EMeshMaterialType.BASIC,
        side: side,
        vertexColors: vert_colors,
        opacity: opacity,
        transparent: transparent,
        color: color
    };
    (0, _shared_1._setMaterialModelAttrib)(__model__, name, settings_obj);
}
exports.MeshMat = MeshMat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzaE1hdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9tYXRlcmlhbC9NZXNoTWF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsMkRBQTZDO0FBQzdDLG1DQUErRDtBQUMvRCx1Q0FNbUI7QUFHbkIsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFDSCxTQUFnQixPQUFPLENBQUMsU0FBa0IsRUFBRSxJQUFZLEVBQzVDLEtBQWEsRUFDYixPQUFlLEVBQ2YsV0FBbUIsRUFDbkIsa0JBQTRCO0lBRXBDLHNCQUFzQjtJQUN0QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsTUFBTSxPQUFPLEdBQUcsa0JBQWtCLENBQUM7UUFDbkMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2xELEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN0RCxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDN0Q7SUFDRCxzQkFBc0I7SUFDdEIsTUFBTSxJQUFJLEdBQVcsSUFBQSxrQ0FBd0IsRUFBQyxXQUFXLENBQUMsQ0FBQztJQUMzRCxNQUFNLFdBQVcsR0FBVyxJQUFBLG9DQUEwQixFQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDM0UsT0FBTyxHQUFHLElBQUEsa0JBQVEsRUFBQyxPQUFPLENBQUMsQ0FBQztJQUM1QixNQUFNLFdBQVcsR0FBWSxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLElBQUEscUJBQVcsRUFBQyxLQUFLLENBQUMsQ0FBQztJQUVuQixNQUFNLFlBQVksR0FBRztRQUNqQixJQUFJLEVBQUUsMEJBQWtCLENBQUMsS0FBSztRQUM5QixJQUFJLEVBQUUsSUFBSTtRQUNWLFlBQVksRUFBRSxXQUFXO1FBQ3pCLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLFdBQVcsRUFBRSxXQUFXO1FBQ3hCLEtBQUssRUFBRSxLQUFLO0tBQ2YsQ0FBQztJQUNGLElBQUEsaUNBQXVCLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBN0JELDBCQTZCQyJ9