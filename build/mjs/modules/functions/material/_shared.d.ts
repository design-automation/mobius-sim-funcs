/**
 * The `material` module has functions for defining materials.
 * The material definitions are saved as attributes at the model level.
 * For more informtion, see the threejs docs: https://threejs.org/
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';
import { _Ecolors, _ESide } from './_enum';
export declare function _convertSelectESideToNum(select: _ESide): number;
export declare function _convertSelectEcolorsToNum(select: _Ecolors): number;
export declare function _clamp01(val: number): number;
export declare function _clamp0100(val: number): number;
export declare function _clampArr01(vals: number[]): void;
export declare function _setMaterialModelAttrib(__model__: GIModel, name: string, settings_obj: object): void;
