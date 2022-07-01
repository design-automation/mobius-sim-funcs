import {
    arrMakeFlat,
    createSingleMeshBufTjs,
    EAttribDataTypeStrs,
    EEntType,
    GIModel,
    idsBreak,
    TColor,
    TEntTypeIdx,
    TId,
    TPlane,
    TRay,
    Txyz,
    vecAdd,
    vecDot,
    vecMult,
} from '@design-automation/mobius-sim';
import * as THREE from 'three';
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { _ESkyMethod } from './_enum';
import { _generateLines, _getSensorRays } from './_shared';
const EPS = 1e-6;
// =================================================================================================
interface TIrradianceResult {
    irradiance: number[];
}
interface ISkyRadiance {
    SkyDome: {
        units: string,
        metric: string,
        subdivisionType: string,
        subdivisionAngle: number,
        includeDirect: boolean,
        patchCount: number,
        patches: ISkyRadiancePatch[]
    }
}
interface ISkyRadiancePatch {
    azi: number,
    alt: number,
    area: number,
    vector: Txyz, 
    radiance: number
}
// =================================================================================================
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
export function Irradiance(
    __model__: GIModel,
    sensors: TRay[] | TPlane[] | TRay[][] | TPlane[][],
    entities: TId | TId[] | TId[][],
    radius: number | [number, number],
    method: _ESkyMethod
): TIrradianceResult | [TIrradianceResult, TIrradianceResult] {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.Irradiance";
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "sensors", sensors, 
            [chk.isRayL, chk.isPlnL, chk.isRayLL, chk.isPlnLL]);
        ents_arrs = checkIDs(__model__, fn_name, "entities", entities, 
            [ID.isID, ID.isIDL1], 
            [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        chk.checkArgs(fn_name, "radius", radius, [chk.isNum, chk.isNumL]);
        if (Array.isArray(radius)) {
            if (radius.length !== 2) {
                throw new Error('If "radius" is a list, it must have a length of two: \
                [min_dist, max_dist].');
            }
            if (radius[0] >= radius[1]) {
                throw new Error('If "radius" is a list, the "min_dist" must be less than \
                the "max_dist": [min_dist, max_dist].');
            }
        }
        // check that we have sky radiance data
        if (!__model__.modeldata.attribs.query.hasModelAttrib("sky")) {
            throw new Error(
                'analyze.Irradiance: For calculating irradiance, the model must have data, \
                describing the sky radiance. See the documentation of the analyze.Irradiance \
                function.'
            );
        }
    } else {
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    radius = Array.isArray(radius) ? radius : [1, radius];
    // get rays for sensor points
    const [sensors0, sensors1, two_lists]: [TRay[], TRay[], boolean] = _getSensorRays(sensors, 0.01); // offset by 0.01
    // create mesh
    const [mesh_tjs, _]: [THREE.Mesh, number[]] = createSingleMeshBufTjs(__model__, ents_arrs);
    // get the sky data from attribute
    const sky_rad: any = __model__.modeldata.attribs.get.getModelAttribVal("sky") as string;
    const sky_rad_data: ISkyRadiance = typeof sky_rad === 'string' ?
        JSON.parse(sky_rad) as ISkyRadiance : sky_rad as ISkyRadiance;
    // weighted or unweighted
    const weighted: boolean = method === _ESkyMethod.WEIGHTED;
    // run simulation
    const results0: TIrradianceResult = _calcIrradiance(__model__, 
        sensors0, radius, sky_rad_data, mesh_tjs, weighted, false);
    const results1: TIrradianceResult = _calcIrradiance(__model__, 
        sensors1, radius, sky_rad_data, mesh_tjs, weighted, true);
    // cleanup
    mesh_tjs.geometry.dispose();
    (mesh_tjs.material as THREE.Material).dispose();
    // return the results
    if (two_lists) { return [results0, results1]; }
    return results0;
}
// =================================================================================================
export function _calcIrradiance(
    __model__: GIModel,
    sensor_rays: TRay[],
    radius: [number, number],
    sky_rad_data: ISkyRadiance,
    mesh_tjs: THREE.Mesh,
    weighted: boolean,
    generate_lines: boolean
): TIrradianceResult {
    const results = [];
    const patches: ISkyRadiancePatch[] = sky_rad_data.SkyDome.patches;
    // create tjs objects (to be resued for each ray)
    const sensor_tjs: THREE.Vector3 = new THREE.Vector3();
    const dir_tjs: THREE.Vector3 = new THREE.Vector3();
    const ray_tjs: THREE.Raycaster = new THREE.Raycaster(sensor_tjs, dir_tjs, radius[0], radius[1]);
    // shoot rays
    for (const [sensor_xyz, sensor_dir] of sensor_rays) {
        // set raycaster origin
        sensor_tjs.x = sensor_xyz[0]; sensor_tjs.y = sensor_xyz[1]; sensor_tjs.z = sensor_xyz[2];
        let sensor_result = 0;
        const result_rays: [Txyz, number][] = [];
        for (const patch of patches) {
            const ray_dir: Txyz = patch.vector;
            // check if target is behind sensor
            const dot_ray_sensor: number = vecDot(ray_dir, sensor_dir);
            if (dot_ray_sensor <= -EPS) { continue; } 
            // set raycaster direction
            dir_tjs.x = ray_dir[0]; dir_tjs.y = ray_dir[1]; dir_tjs.z = ray_dir[2];
            // shoot raycaster
            const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh_tjs, false);
            // get results
            if (isects.length === 0) {
                if (weighted) {
                    // this applies the cosine weighting rule
                    sensor_result = sensor_result + (patch.radiance * patch.area * dot_ray_sensor);
                } else {
                    // this applies no cosine weighting
                    sensor_result = sensor_result + (patch.radiance * patch.area);
                }
                const ray_end = vecAdd(sensor_xyz, vecMult(ray_dir, 2));
                result_rays.push([ray_end, 0]);
            } else {
                const ray_end = vecAdd(sensor_xyz, vecMult(ray_dir, isects[0].distance));
                result_rays.push([ray_end, 1]);
            }
        }
        results.push(sensor_result);
        // generate calculation lines
        if (generate_lines) { _generateLines(__model__, sensor_xyz, result_rays); }
    }
    return { irradiance: results };
}
// =================================================================================================