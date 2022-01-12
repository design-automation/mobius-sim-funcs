/**
 * The `material` module has functions for defining materials.
 * The material definitions are saved as attributes at the model level.
 * For more informtion, see the threejs docs: https://threejs.org/
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';
import * as THREE from 'three';

import * as chk from '../../../_check_types';
import { _EMeshMaterialType } from './_enum';
import { _clamp01, _setMaterialModelAttrib } from './_shared';


// ================================================================================================
/**
 * Creates a glass material with an opacity setting. The material will default to a Phong material.
 * \n
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * \n
 * @param name The name of the material.
 * @param opacity The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).
 * @returns void
 */
export function Glass(__model__: GIModel, name: string, opacity: number): void {
    // --- Error Check ---
    const fn_name = 'material.Glass';
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
        chk.checkArgs(fn_name, 'opacity', opacity, [chk.isNum01]);
    }
    // --- Error Check ---
    opacity = _clamp01(opacity);
    const transparent: boolean = opacity < 1;
    const settings_obj = {
        type: _EMeshMaterialType.PHONG,
        opacity: opacity,
        transparent: transparent,
        shininess: 90,
        color: [1, 1, 1],
        emissive: [0, 0, 0],
        side: THREE.DoubleSide
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
