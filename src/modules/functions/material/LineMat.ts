import { GIModel, TColor } from '@design-automation/mobius-sim';

import * as chk from '../../_check_types';
import { _ELineMaterialType } from './_enum';
import { _clampArr01, 
    // _convertSelectEcolorsToNum, 
    _setMaterialModelAttrib } from './_shared';


// ================================================================================================
/**
 * Creates a line material and saves it in the model attributes.
 * \n
 * [See the threejs docs on LineBasicMaterials](https://threejs.org/docs/#api/en/materials/LineBasicMaterial)
 * [See the threejs docs LineDashedMaterials](https://threejs.org/docs/#api/en/materials/LineDashedMaterial)
 * \n
 * The color of the material can either ignore or apply the vertex rgb colors.
 * - If 'color' is set to `null`, it will apply the vertex rgb colors. 
 * - If 'color' is set to `[r, g, b]`, it will apply the given color. 
 * \n
 * In order to assign a material to polylines in the model, a polyline attribute called 'material'
 * will be created. The value for each polyline must either be null, or must be a material name.
 * \n
 * For dashed lines, the 'dash\_gap\_scale' parameter can be set.
 * - If 'dash\_gap\_scale' is null, it will result in a continuous line.
 * - If 'dash\_gap\_scale' is a single number: dash = gap = dash\_gap\_scale, scale = 1.
 * - If 'dash\_gap\_scale' is a list of two numbers: dash = dash\_gap\_scale[0], gap = dash\_gap\_scale[1], scale = 1.
 * - If 'dash\_gap\_scale' is a list of three numbers: dash = dash\_gap\_scale[0], gap = dash\_gap\_scale[1], scale = dash\_gap\_scale[2].
 * \n
 * Due to limitations of the OpenGL Core Profile with the WebGL renderer on most platforms,
 * line widths cannot be rendered. As a result, lines width will always be set to 1.
 * \n
 * @param name The name of the material.
 * @param color Null to apply vertex colors, or the diffuse color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param dash_gap_scale Size of the dash and gap, and a scale factor. (The gap and scale are optional.)
 * @returns void
 */
// --- old vert cols 
// @param select_vert_colors Enum, select whether to use vertex colors if they exist: `'none'` or `'apply_rgb'`.
// * If 'apply' is selected, then the actual color will be a combination of the material color
// * and the vertex colors, as specified by the vertex attribute called 'rgb'.
// * In such a case, if material color is set to white, then it will
// * have no effect, and the color will be defined by the vertex [r,g,b] values.

export function LineMat(__model__: GIModel, name: string,
            color: TColor | null,
            dash_gap_scale: number|number[],
        ): void {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.LineMat';
        chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
        chk.checkArgs(fn_name, 'color', color, [chk.isColor, chk.isNull]);
        chk.checkArgs(fn_name, 'dash_gap_scale', dash_gap_scale, [chk.isNull, chk.isNum, chk.isNumL]);
    }
    // --- Error Check ---
    // const vert_colors: number = _convertSelectEcolorsToNum(select_vert_colors);
    // if (select_vert_colors === _Ecolors.VERT_COLORS) {
    var vert_colors = 0;
    if (color == null) {
        color = [1, 1, 1];
        vert_colors = 1;
    } else {
        vert_colors = 0;
    }

    let settings_obj: object;
    if (dash_gap_scale === null) {
        settings_obj = {
            // type: _ELineMaterialType.BASIC,
            // color: _getTjsColor(color),
            // vertexColors: vert_colors
            type: _ELineMaterialType.DASHED,
            color: color,
            vertexColors: vert_colors,
            dashSize: 0,
            gapSize: 0,
            scale: 1
        };
    } else {
        dash_gap_scale = Array.isArray(dash_gap_scale) ? dash_gap_scale : [dash_gap_scale];
        const dash = dash_gap_scale[0] === undefined ? 0 : dash_gap_scale[0];
        const gap = dash_gap_scale[1] === undefined ? dash : dash_gap_scale[1];
        const scale = dash_gap_scale[2] === undefined ? 1 : dash_gap_scale[2];
        settings_obj = {
            type: _ELineMaterialType.DASHED,
            color: color,
            vertexColors: vert_colors,
            dashSize: dash,
            gapSize: gap,
            scale: scale
        };
    }
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
