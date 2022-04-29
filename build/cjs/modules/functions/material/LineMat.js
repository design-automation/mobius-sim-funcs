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
exports.LineMat = void 0;
const chk = __importStar(require("../../../_check_types"));
const _enum_1 = require("./_enum");
const _shared_1 = require("./_shared");
// ================================================================================================
/**
 * Creates a line material and saves it in the model attributes.
 * \n
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/LineBasicMaterial)
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/LineDashedMaterial)
 * \n
 * The color of the material can either ignore or apply the vertex rgb colors.
 * If 'apply' id selected, then the actual color will be a combination of the material color
 * and the vertex colors, as specified by the a vertex attribute called 'rgb'.
 * In such a case, if material color is set to white, then it will
 * have no effect, and the color will be defined by the vertex [r,g,b] values.
 * \n
 * In order to assign a material to polylines in the model, a polyline attribute called 'material'.
 * will be created. The value for each polyline must either be null, or must be a material name.
 * \n
 * For dashed lines, the 'dash_gap_scale' parameter can be set.
 * - If 'dash_gap_scale' is null will result in a continouse line.
 * - If 'dash_gap_scale' is a single number: dash = gap = dash_gap_scale, scale = 1.
 * - If 'dash_gap_scale' is a list of two numbers: dash = dash_gap_scale[0], gap = dash_gap_scale[1], scale = 1.
 * - If 'dash_gap_scale' is a list of three numbers: dash = dash_gap_scale[0], gap = dash_gap_scale[1], scale = dash_gap_scale[2].
 * \n
 * Due to limitations of the OpenGL Core Profile with the WebGL renderer on most platforms,
 * line widths cannot be rendered. As a result, lines width will always be set to 1.
 * \n
 * @param name The name of the material.
 * @param color The diffuse color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param dash_gap_scale Size of the dash and gap, and a scale factor. (The gap and scale are optional.)
 * @param select_vert_colors Enum, select whether to use vertex colors if they exist.
 * @returns void
 */
function LineMat(__model__, name, color, dash_gap_scale, select_vert_colors) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.LineMat';
        chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
        chk.checkArgs(fn_name, 'color', color, [chk.isColor]);
        chk.checkArgs(fn_name, 'dash_gap_scale', dash_gap_scale, [chk.isNull, chk.isNum, chk.isNumL]);
    }
    // --- Error Check ---
    const vert_colors = (0, _shared_1._convertSelectEcolorsToNum)(select_vert_colors);
    (0, _shared_1._clampArr01)(color);
    let settings_obj;
    if (dash_gap_scale === null) {
        settings_obj = {
            // type: _ELineMaterialType.BASIC,
            // color: _getTjsColor(color),
            // vertexColors: vert_colors
            type: _enum_1._ELineMaterialType.DASHED,
            color: color,
            vertexColors: vert_colors,
            dashSize: 0,
            gapSize: 0,
            scale: 1
        };
    }
    else {
        dash_gap_scale = Array.isArray(dash_gap_scale) ? dash_gap_scale : [dash_gap_scale];
        const dash = dash_gap_scale[0] === undefined ? 0 : dash_gap_scale[0];
        const gap = dash_gap_scale[1] === undefined ? dash : dash_gap_scale[1];
        const scale = dash_gap_scale[2] === undefined ? 1 : dash_gap_scale[2];
        settings_obj = {
            type: _enum_1._ELineMaterialType.DASHED,
            color: color,
            vertexColors: vert_colors,
            dashSize: dash,
            gapSize: gap,
            scale: scale
        };
    }
    (0, _shared_1._setMaterialModelAttrib)(__model__, name, settings_obj);
}
exports.LineMat = LineMat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGluZU1hdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9tYXRlcmlhbC9MaW5lTWF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsMkRBQTZDO0FBQzdDLG1DQUF1RDtBQUN2RCx1Q0FBNkY7QUFHN0YsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZCRztBQUNILFNBQWdCLE9BQU8sQ0FBQyxTQUFrQixFQUFFLElBQVksRUFDNUMsS0FBYSxFQUNiLGNBQStCLEVBQy9CLGtCQUE0QjtJQUVwQyxzQkFBc0I7SUFDdEIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLE1BQU0sT0FBTyxHQUFHLGtCQUFrQixDQUFDO1FBQ25DLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNsRCxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ2pHO0lBQ0Qsc0JBQXNCO0lBQ3RCLE1BQU0sV0FBVyxHQUFXLElBQUEsb0NBQTBCLEVBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUMzRSxJQUFBLHFCQUFXLEVBQUMsS0FBSyxDQUFDLENBQUM7SUFFbkIsSUFBSSxZQUFvQixDQUFDO0lBQ3pCLElBQUksY0FBYyxLQUFLLElBQUksRUFBRTtRQUN6QixZQUFZLEdBQUc7WUFDWCxrQ0FBa0M7WUFDbEMsOEJBQThCO1lBQzlCLDRCQUE0QjtZQUM1QixJQUFJLEVBQUUsMEJBQWtCLENBQUMsTUFBTTtZQUMvQixLQUFLLEVBQUUsS0FBSztZQUNaLFlBQVksRUFBRSxXQUFXO1lBQ3pCLFFBQVEsRUFBRSxDQUFDO1lBQ1gsT0FBTyxFQUFFLENBQUM7WUFDVixLQUFLLEVBQUUsQ0FBQztTQUNYLENBQUM7S0FDTDtTQUFNO1FBQ0gsY0FBYyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuRixNQUFNLElBQUksR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRSxNQUFNLEdBQUcsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RSxNQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxZQUFZLEdBQUc7WUFDWCxJQUFJLEVBQUUsMEJBQWtCLENBQUMsTUFBTTtZQUMvQixLQUFLLEVBQUUsS0FBSztZQUNaLFlBQVksRUFBRSxXQUFXO1lBQ3pCLFFBQVEsRUFBRSxJQUFJO1lBQ2QsT0FBTyxFQUFFLEdBQUc7WUFDWixLQUFLLEVBQUUsS0FBSztTQUNmLENBQUM7S0FDTDtJQUNELElBQUEsaUNBQXVCLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBNUNELDBCQTRDQyJ9