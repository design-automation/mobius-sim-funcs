import { GIModel, TId, TPlane, TRay, Txyz } from '@design-automation/mobius-sim';
import * as THREE from 'three';
import { _ESkyMethod } from './_enum';
interface TIrradianceResult {
    irradiance: number[];
}
interface ISkyRadiance {
    SkyDome: {
        units: string;
        metric: string;
        subdivisionType: string;
        subdivisionAngle: number;
        includeDirect: boolean;
        patchCount: number;
        patches: ISkyRadiancePatch[];
    };
}
interface ISkyRadiancePatch {
    azi: number;
    alt: number;
    area: number;
    vector: Txyz;
    radiance: number;
}
/**
 * Calculate an approximation of irradiance...
 * \n
 * \n
 * @param __model__
 * @param sensors A list Rays or a list of Planes, to be used as the origins for calculating
 * irradiance.
 * @param entities The obstructions, polygons or collections.
 * @param radius The max distance for raytracing.
 * @param method Enum, the sky method: `'weighted', 'unweighted'` or `'all'`.
 * @returns A dictionary containing irradiance results.
 */
export declare function Irradiance(__model__: GIModel, sensors: TRay[] | TPlane[] | TRay[][] | TPlane[][], entities: TId | TId[] | TId[][], radius: number | [number, number], method: _ESkyMethod): TIrradianceResult | [TIrradianceResult, TIrradianceResult];
export declare function _calcIrradiance(__model__: GIModel, sensor_rays: TRay[], radius: [number, number], sky_rad_data: ISkyRadiance, mesh_tjs: THREE.Mesh, weighted: boolean, generate_lines: boolean): TIrradianceResult;
export {};
