import { GIModel, TColor } from '@design-automation/mobius-sim';

import * as chk from '../../_check_types';
import { _EMeshMaterialType, _ESide } from './_enum';
import {
    _clamp01,
    _clampArr01,
    // _convertSelectEcolorsToNum,
    _convertSelectESideToNum,
    _setMaterialModelAttrib,
} from './_shared';


// ================================================================================================
/**
 * Creates a basic mesh material and saves it in the model attributes.
 * \n
 * [See the threejs docs on basic mesh materials](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial)
 * \n
 * The color of the material can either ignore or apply the vertex rgb colors.
 * - If 'color' is set to `null`, it will apply the vertex rgb colors. 
 * - If 'color' is set to `[r, g, b]`, it will apply the given color. 
 * \n
 * Additional material properties can be set by calling the functions for the more advanced materials.
 * These include LambertMaterial, PhongMaterial, StandardMaterial, and Physical Material.
 * Each of these more advanced materials allows you to specify certain additional settings.
 * \n
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * \n
 * @param name The name of the material.
 * @param color The diffuse color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param opacity The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).
 * @param select_side Enum, select where to apply colors: `'front', 'back'`, or `'both'`.
 * @param select_vert_colors Enum, select whether to use vertex colors if they exist: `'none'` or `'apply_rgb'`.
 * @returns void
 */
export function MeshMat(__model__: GIModel, name: string,
            color: TColor,
            opacity: number,
            select_side: _ESide,
            // select_vert_colors: _Ecolors
        ): void {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.MeshMat';
        chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
        chk.checkArgs(fn_name, 'color', color, [chk.isColor, chk.isNull]);
        chk.checkArgs(fn_name, 'opacity', opacity, [chk.isNum01]);
    }
    // --- Error Check ---
    const side: number = _convertSelectESideToNum(select_side);
    // const vert_colors: number = _convertSelectEcolorsToNum(select_vert_colors);
    var vert_colors = 0;
    if (color == null) {
        color = [1, 1, 1];
        vert_colors = 1;
    } else {
        vert_colors = 0;
    }
    opacity = _clamp01(opacity);
    const transparent: boolean = opacity < 1;
    _clampArr01(color);

    const settings_obj = {
        type: _EMeshMaterialType.BASIC,
        side: side,
        // vertexColors: vert_colors,
        opacity: opacity,
        transparent: transparent,
        color: color
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
