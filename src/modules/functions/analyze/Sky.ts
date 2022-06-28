import {
    arrMakeFlat,
    createSingleMeshBufTjs,
    EEntType,
    getArrDepth,
    GIModel,
    idsBreak,
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
import { _calcMaxExposure, _getSensorRays } from './_shared';
import { tregenzaSky } from './_tregenza_sky';
const EPS = 1e-6;
// =================================================================================================
interface TSkyResult {
    exposure: number[];
}
// =================================================================================================
/**
 * Calculate an approximation of the sky exposure factor, for a set sensors positioned at specified 
 * locations.
 * The sky exposure factor for each sensor is a value between 0 and 1, where 0 means that it has no 
 * exposure
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
 * 3. If a ray does not hit any obstructions, assign a weight between 0 and 1, depending on the 
 * incidence angle.
 * 4. Calculate the total solar expouse by adding up the weights for all rays.
 * 5. Divide by the maximum possible exposure for an unobstructed sensor with a direction pointing 
 * straight up.
 * \n
 * If 'weighted' is selected, then
 * the exposure calculation takes into account the angle of incidence of the ray to the sensor 
 * direction.
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
 * @param sensors A list of coordinates, a list of Rays or a list of Planes, to be used as the 
 * origins for calculating exposure.
 * @param entities The obstructions, faces, polygons, or collections of faces or polygons.
 * @param radius The max distance for raytracing.
 * @param detail An integer between 1 and 4 inclusive, specifying the level of detail for the 
 * analysis.
 * @param method Enum, the sky method: `'weighted', 'unweighted'` or `'all'`.
 * @returns A dictionary containing solar exposure results.
 */
export function Sky(
    __model__: GIModel,
    sensors: TRay[] | TPlane[] | TRay[][] | TPlane[][],
    entities: TId | TId[] | TId[][],
    radius: number | [number, number],
    detail: number,
    method: _ESkyMethod
): TSkyResult | [TSkyResult, TSkyResult] {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.Sky";
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "sensors", sensors, 
            [chk.isRayL, chk.isPlnL, chk.isRayLL, chk.isPlnLL]);
        chk.checkArgs(fn_name, "detail", detail, [chk.isInt]);
        if (detail < 0 || detail > 3) {
            throw new Error(fn_name + ': "detail" must be an integer between 0 and 3 inclusive.');
        }
        ents_arrs = checkIDs(__model__, fn_name, "entities", entities, 
            [ID.isID, ID.isIDL1], 
            [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
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
    } else {
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    radius = Array.isArray(radius) ? radius : [1, radius];
    // get rays for sensor points
    const [sensors0, sensors1, two_lists]: [TRay[], TRay[], boolean] = _getSensorRays(sensors, 0.01); // offset by 0.01
    // create mesh
    const [mesh_tjs, _]: [THREE.Mesh, number[]] = createSingleMeshBufTjs(__model__, ents_arrs);
    // get the direction vectors
    const dir_vecs: Txyz[] = tregenzaSky(detail);
    // run the simulation
    const weighted: boolean = method === _ESkyMethod.WEIGHTED;
    // run simulation
    const results0: TSkyResult = _calcSky(__model__, 
        sensors0, dir_vecs, radius, mesh_tjs, weighted, false);
    const results1: TSkyResult = _calcSky(__model__, 
        sensors1, dir_vecs, radius, mesh_tjs, weighted, true);
    // cleanup
    mesh_tjs.geometry.dispose();
    (mesh_tjs.material as THREE.Material).dispose();
    // return the results
    if (two_lists) { return [results0, results1]; }
    return results0;
}
// =================================================================================================
export function _calcSky(
    __model__: GIModel,
    sensor_rays: TRay[],
    dir_vecs: Txyz[],
    radius: [number, number],
    mesh_tjs: THREE.Mesh,
    weighted: boolean,
    generate_lines: boolean
): TSkyResult {
    // create data structure
    const results = [];
    const result_max: number = _calcMaxExposure(dir_vecs, weighted);
    // create tjs objects (to be resued for each ray)
    const sensor_tjs: THREE.Vector3 = new THREE.Vector3();
    const dir_tjs: THREE.Vector3 = new THREE.Vector3();
    const ray_tjs: THREE.Raycaster = new THREE.Raycaster(sensor_tjs, dir_tjs, radius[0], radius[1]);
    // shoot rays
    for (const [sensor_xyz, sensor_dir] of sensor_rays) {
        // set raycaster origin
        sensor_tjs.x = sensor_xyz[0]; sensor_tjs.y = sensor_xyz[1]; sensor_tjs.z = sensor_xyz[2];
        let result = 0;
        const result_hits_xyz: Txyz[] = [];
        for (const ray_dir of dir_vecs) {
            // check if target is behind sensor
            const dot_ray_sensor: number = vecDot(ray_dir, sensor_dir);
            if (dot_ray_sensor < -EPS) { continue; } 
            // set raycaster direction
            dir_tjs.x = ray_dir[0]; dir_tjs.y = ray_dir[1]; dir_tjs.z = ray_dir[2];
            // shoot raycaster
            const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh_tjs, false);
            // get the result
            if (isects.length === 0) {
                if (weighted) {
                    // this applies the cosine weighting rule
                    result = result + dot_ray_sensor;
                    result_hits_xyz.push(vecAdd(sensor_xyz, vecMult(ray_dir, radius[1])));
                } else {
                    // this applies no cosine weighting
                    result = result + 1;
                    result_hits_xyz.push([isects[0].point.x, isects[0].point.y, isects[0].point.z]);
                }
            }
        }
        results.push(result / result_max);
        // generate calculation lines
        if (generate_lines) {
            const posi0_i: number = __model__.modeldata.geom.add.addPosi();
            __model__.modeldata.attribs.set.setEntAttribVal(
                    EEntType.POSI, posi0_i, 'xyz', sensor_xyz);
            for (const xyz of result_hits_xyz) {
                const posi1_i: number = __model__.modeldata.geom.add.addPosi();
                __model__.modeldata.attribs.set.setEntAttribVal(
                        EEntType.POSI, posi1_i, 'xyz', xyz);
                __model__.modeldata.geom.add.addPline([posi0_i, posi1_i], false);
            }
        }
    }
    return { exposure: results };
}
// =================================================================================================