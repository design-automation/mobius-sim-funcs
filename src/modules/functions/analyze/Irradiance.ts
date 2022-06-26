import {
    arrMakeFlat,
    createSingleMeshBufTjs,
    EEntType,
    GIModel,
    idsBreak,
    TEntTypeIdx,
    TId,
    TPlane,
    TRay,
    Txyz,
} from '@design-automation/mobius-sim';
import * as THREE from 'three';
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { _ESkyMethod } from './_enum';
import { _calcExposure, _rayOrisDirsTjs } from './_shared';

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
/**
 * Calculate an approximation of irradiance...
 * \n
 * \n
 * @param __model__
 * @param sensors A list of coordinates, a list of Rays or a list of Planes, to be used as the origins for calculating exposure.
 * @param entities The obstructions, faces, polygons, or collections of faces or polygons.
 * @param radius The max distance for raytracing.
 * @param detail An integer between 1 and 4 inclusive, specifying the level of detail for the analysis.
 * @param method Enum, the sky method: `'weighted', 'unweighted'` or `'all'`.
 * @returns A dictionary containing solar exposure results.
 */
export function Irradiance(
    __model__: GIModel,
    sensors: Txyz[] | TRay[] | TPlane[],
    entities: TId | TId[] | TId[][],
    radius: number | [number, number],
    method: _ESkyMethod
): any {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.Irradiance";
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origins", sensors, [chk.isXYZL, chk.isRayL, chk.isPlnL]);
        ents_arrs = checkIDs(__model__, fn_name, "entities", entities, 
            [ID.isID, ID.isIDL1], 
            [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
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
    const sensor_oris_dirs_tjs: [THREE.Vector3, THREE.Vector3][] = _rayOrisDirsTjs(__model__, sensors, 0.01);
    const [mesh_tjs, idx_to_face_i]: [THREE.Mesh, number[]] = createSingleMeshBufTjs(__model__, ents_arrs);
    // get the sky data from attribute
    const sky_rad: string = __model__.modeldata.attribs.get.getModelAttribVal("sky") as string;
    const sky_rad_data: ISkyRadiance = JSON.parse(sky_rad) as ISkyRadiance;
    // run the simulation
    const weighted: boolean = method === _ESkyMethod.WEIGHTED;
    const results: number[] = _calcIrradiance(sensor_oris_dirs_tjs, sky_rad_data, mesh_tjs, radius, weighted);
    // cleanup
    mesh_tjs.geometry.dispose();
    (mesh_tjs.material as THREE.Material).dispose();
    // return the result
    return { exposure: results };
}
// =================================================================================================
export function _calcIrradiance(
    origins_normals_tjs: [THREE.Vector3, THREE.Vector3][],
    sky_rad_data: ISkyRadiance,
    mesh_tjs: THREE.Mesh,
    radius: [number, number],
    weighted: boolean
): number[] {
    const results = [];
    const patches: ISkyRadiancePatch[] = sky_rad_data.SkyDome.patches;
    const sky_vecs: [THREE.Vector3, number, number][] = patches.map( patch => [
        new THREE.Vector3(...patch.vector),
        patch.area,
        patch.radiance
    ]);
    for (const [origin_tjs, normal_tjs] of origins_normals_tjs) {
        let result = 0;
        for (const [sky_vec_tjs, sky_area, sky_rad] of sky_vecs) {
            const dot_normal_direction: number = normal_tjs.dot(sky_vec_tjs);
            if (dot_normal_direction > 0) {
                const ray_tjs: THREE.Raycaster = new THREE.Raycaster(origin_tjs, sky_vec_tjs, radius[0], radius[1]);
                const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh_tjs, false);
                if (isects.length === 0) {
                    if (weighted) {
                        // this applies the cosine weighting rule
                        result = result + (sky_rad * sky_area * dot_normal_direction);
                    } else {
                        // this applies no cosine weighting
                        result = result + (sky_rad * sky_area);
                    }
                }
            }
        }
        results.push(result);
    }
    return results;
}
// =================================================================================================