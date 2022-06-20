/**
 * The `material` module has functions for defining materials.
 * The material definitions are saved as attributes at the model level.
 * For more informtion, see the threejs docs: https://threejs.org/
 * @module
 */
import { EAttribDataTypeStrs, ENT_TYPE, Sim } from '../../mobius_sim';
import * as THREE from 'three';

import { _Ecolors, _EMeshMaterialType, _ESide } from './_enum';


// ================================================================================================

export function _convertSelectESideToNum(select: _ESide): number {
    switch (select) {
        case _ESide.FRONT:
            return THREE.FrontSide;
        case _ESide.BACK:
            return THREE.BackSide;
        default:
            return THREE.DoubleSide;
    }
}
export function _convertSelectEcolorsToNum(select: _Ecolors): number {
    switch (select) {
        case _Ecolors.NO_VERT_COLORS:
            return 0;
        default:
            return 1;
    }
}
export function _clamp01(val: number): number {
    val = (val > 1) ? 1 : val;
    val = (val < 0) ? 0 : val;
    return val;
}
export function _clamp0100(val: number): number {
    val = (val > 100) ? 100 : val;
    val = (val < 0) ? 0 : val;
    return val;
}
export function _clampArr01(vals: number[]): void {
    for (let i = 0; i < vals.length; i++) {
        vals[i] = _clamp01(vals[i]);
    }
}
export function _setMaterialModelAttrib(__model__: Sim, name: string, settings_obj: object) {
    // if the material already exists, then existing settings will be added
    // but new settings will take precedence
    if (__model__.modeldata.attribs.query.hasModelAttrib(name)) {
        const exist_settings_obj: object = __model__.modeldata.attribs.get.getModelAttribVal(name) as object;
        // check that the existing material is a Basic one
        if (exist_settings_obj['type'] !== _EMeshMaterialType.BASIC) {
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
    } else {
        __model__.modeldata.attribs.add.addAttrib(ENT_TYPE.MOD, name, EAttribDataTypeStrs.DICT);
    }
    // const settings_str: string = JSON.stringify(settings_obj);
    __model__.modeldata.attribs.set.setModelAttribVal(name, settings_obj);
}
