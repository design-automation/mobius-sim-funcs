import { Sim } from '../../mobius_sim';
import { TColor } from '../_common/consts';

import { _EMeshMaterialType } from './_enum';
import { _clampArr01, _setMaterialModelAttrib } from './_shared';


// ================================================================================================
/**
 * Creates a Lambert material and saves it in the model attributes.
 * If a material with the same name already exits, these settings will be added to the existing material.
 * \n
 * [See the threejs docs on Lambert materials](https://threejs.org/docs/#api/en/materials/MeshLambertMaterial)
 * \n
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * \n
 * @param name The name of the material.
 * @param emissive The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @returns void
 */
export function Lambert(__model__: Sim, name: string, emissive: TColor): void {
    // // --- Error Check ---
    // if (this.debug) {
    //     const fn_name = 'material.Lambert';
    //     chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
    //     chk.checkArgs(fn_name, 'emissive', emissive, [chk.isColor]);
    // }
    // // --- Error Check ---
    _clampArr01(emissive);
    const settings_obj = {
        type: _EMeshMaterialType.LAMBERT,
        emissive: emissive
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
