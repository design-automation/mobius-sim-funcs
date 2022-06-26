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
import { tregenzaSky } from './_tregenza_sky';

/**
 * Calculate an approximation of the sky exposure factor, for a set sensors positioned at specified locations.
 * The sky exposure factor for each sensor is a value between 0 and 1, where 0 means that it has no exposure
 * and 1 means that it has maximum exposure.
 * \n
 * Each sensor has a location and direction, specified using either rays or planes.
 * The direction of the sensor specifies what is infront and what is behind the sensor.
 * For each sensor, only exposure infront of the sensor is calculated.
 * \n
 * The exposure is calculated by shooting rays in reverse.
 * from the sensor origin to a set of points on the sky dome.
 * If the rays hits an obstruction, then the sky dome is obstructed..
 * If the ray hits no obstructions, then the sky dome is not obstructed.
 * \n
 * The exposure factor at each sensor point is calculated as follows:
 * 1. Shoot rays to all sky dome points.
 * 2. If the ray hits an obstruction, assign a weight of 0 to that ray.
 * 3. If a ray does not hit any obstructions, assign a weight between 0 and 1, depending on the incidence angle.
 * 4. Calculate the total solar expouse by adding up the weights for all rays.
 * 5. Divide by the maximum possible exposure for an unobstructed sensor with a direction pointing straight up.
 * \n
 * If 'weighted' is selected, then
 * the exposure calculation takes into account the angle of incidence of the ray to the sensor direction.
 * Rays parallel to the sensor direction are assigned a weight of 1.
 * Rays at an oblique angle are assigned a weight equal to the cosine of the angle
 * betweeen the sensor direction and the ray.
 * \n
 * If 'unweighted' is selected, then all rays are assigned a weight of 1, irresepctive of angle.
 * \n
 * The detail parameter spacifies the number of rays that get generated.
 * The higher the level of detail, the more accurate but also the slower the analysis will be.
 * \n
 * The number of rays are as follows:
 * 0 = 145 rays,
 * 1 = 580 rays,
 * 2 = 1303 rays,
 * 3 = 2302 rays.
 * 4 = 5220 rays.
 * \n
 * Returns a dictionary containing exposure results.
 * \n
 * 1. 'exposure': A list of numbers, the exposure factors.
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
export function Sky(
    __model__: GIModel,
    sensors: Txyz[] | TRay[] | TPlane[],
    entities: TId | TId[] | TId[][],
    radius: number | [number, number],
    detail: number,
    method: _ESkyMethod
): any {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.Sky";
    let ents_arrs: TEntTypeIdx[];
    // let latitude: number = null;
    // let north: Txy = [0, 1];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origins", sensors, [chk.isXYZL, chk.isRayL, chk.isPlnL]);
        chk.checkArgs(fn_name, "detail", detail, [chk.isInt]);
        if (detail < 0 || detail > 3) {
            throw new Error(fn_name + ': "detail" must be an integer between 0 and 3 inclusive.');
        }
        ents_arrs = checkIDs(__model__, fn_name, "entities", entities, [ID.isID, ID.isIDL1], [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
    } else {
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
        // const geolocation = __model__.modeldata.attribs.get.getModelAttribVal('geolocation');
        // latitude = geolocation['latitude'];
        // if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
        //     north = __model__.modeldata.attribs.get.getModelAttribVal('north') as Txy;
        // }
    }
    // TODO
    // TODO
    // --- Error Check ---

    const sensor_oris_dirs_tjs: [THREE.Vector3, THREE.Vector3][] = _rayOrisDirsTjs(__model__, sensors, 0.01);
    const [mesh_tjs, idx_to_face_i]: [THREE.Mesh, number[]] = createSingleMeshBufTjs(__model__, ents_arrs);
    radius = Array.isArray(radius) ? radius : [1, radius];
    // get the direction vectors
    const ray_dirs_tjs: THREE.Vector3[] = tregenzaSky(detail).map( vec => new THREE.Vector3(... vec) );
    // run the simulation
    const weighted: boolean = method === _ESkyMethod.WEIGHTED;
    const results: number[] = _calcExposure(sensor_oris_dirs_tjs, ray_dirs_tjs, mesh_tjs, radius, weighted);
    // cleanup
    mesh_tjs.geometry.dispose();
    (mesh_tjs.material as THREE.Material).dispose();
    // return the result
    return { exposure: results };
}
