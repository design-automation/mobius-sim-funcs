import { GIModel, TColor } from '@design-automation/mobius-sim';

import * as chk from '../../_check_types';
import { _EMeshMaterialType } from './_enum';
import { _clamp01, _clampArr01, _setMaterialModelAttrib } from './_shared';



// ================================================================================================
/**
 * Creates a Standard material and saves it in the model attributes.
 * If a material with the same name already exits, these settings will be added to the existing material.
 * \n
 * [See the threejs docs on Standard materials](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)
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
export function Standard(__model__: GIModel, name: string,
            emissive: TColor,
            roughness: number,
            metalness: number
        ): void {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.Standard';
        chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
        chk.checkArgs(fn_name, 'emissive', emissive, [chk.isColor]);
        chk.checkArgs(fn_name, 'roughness', roughness, [chk.isNum]);
        chk.checkArgs(fn_name, 'metalness', metalness, [chk.isNum]);
    }
    // --- Error Check ---
    _clampArr01(emissive);
    roughness = _clamp01(roughness);
    metalness = _clamp01(metalness);

    const settings_obj = {
        type: _EMeshMaterialType.STANDARD,
        emissive: emissive,
        roughness: roughness,
        metalness: metalness
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
