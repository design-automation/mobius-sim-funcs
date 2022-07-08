import { arrMakeFlat, createSingleMeshBufTjs, EEntType, idsBreak, vecAdd, vecDot, vecMult, } from '@design-automation/mobius-sim';
import * as THREE from 'three';
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { _ESkyMethod } from './_enum';
import { _generateLines, _getSensorRays } from './_shared';
const EPS = 1e-6;
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
export function Irradiance(__model__, sensors, entities, radius, method) {
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = "analyze.Irradiance";
    let ents_arrs;
    if (__model__.debug) {
        chk.checkArgs(fn_name, "sensors", sensors, [chk.isRayL, chk.isPlnL, chk.isRayLL, chk.isPlnLL]);
        ents_arrs = checkIDs(__model__, fn_name, "entities", entities, [ID.isID, ID.isIDL1], [EEntType.PGON, EEntType.COLL]);
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
            throw new Error('analyze.Irradiance: For calculating irradiance, the model must have data, \
                describing the sky radiance. See the documentation of the analyze.Irradiance \
                function.');
        }
    }
    else {
        ents_arrs = idsBreak(entities);
    }
    // --- Error Check ---
    radius = Array.isArray(radius) ? radius : [1, radius];
    // get rays for sensor points
    const [sensors0, sensors1, two_lists] = _getSensorRays(sensors, 0.01); // offset by 0.01
    // create mesh
    const [mesh_tjs, _] = createSingleMeshBufTjs(__model__, ents_arrs);
    // get the sky data from attribute
    const sky_rad = __model__.modeldata.attribs.get.getModelAttribVal("sky");
    const sky_rad_data = typeof sky_rad === 'string' ?
        JSON.parse(sky_rad) : sky_rad;
    // weighted or unweighted
    const weighted = method === _ESkyMethod.WEIGHTED;
    // run simulation
    const results0 = _calcIrradiance(__model__, sensors0, radius, sky_rad_data, mesh_tjs, weighted, false);
    const results1 = _calcIrradiance(__model__, sensors1, radius, sky_rad_data, mesh_tjs, weighted, true);
    // cleanup
    mesh_tjs.geometry.dispose();
    mesh_tjs.material.dispose();
    // return the results
    if (two_lists) {
        return [results0, results1];
    }
    return results0;
}
// =================================================================================================
export function _calcIrradiance(__model__, sensor_rays, radius, sky_rad_data, mesh_tjs, weighted, generate_lines) {
    const results = [];
    const patches = sky_rad_data.SkyDome.patches;
    // create tjs objects (to be resued for each ray)
    const sensor_tjs = new THREE.Vector3();
    const dir_tjs = new THREE.Vector3();
    const ray_tjs = new THREE.Raycaster(sensor_tjs, dir_tjs, radius[0], radius[1]);
    // shoot rays
    for (const [sensor_xyz, sensor_dir] of sensor_rays) {
        // set raycaster origin
        sensor_tjs.x = sensor_xyz[0];
        sensor_tjs.y = sensor_xyz[1];
        sensor_tjs.z = sensor_xyz[2];
        let sensor_result = 0;
        const result_rays = [];
        for (const patch of patches) {
            const ray_dir = patch.vector;
            // check if target is behind sensor
            const dot_ray_sensor = vecDot(ray_dir, sensor_dir);
            if (dot_ray_sensor <= -EPS) {
                continue;
            }
            // set raycaster direction
            dir_tjs.x = ray_dir[0];
            dir_tjs.y = ray_dir[1];
            dir_tjs.z = ray_dir[2];
            // shoot raycaster
            const isects = ray_tjs.intersectObject(mesh_tjs, false);
            // get results
            if (isects.length === 0) {
                if (weighted) {
                    // this applies the cosine weighting rule
                    sensor_result = sensor_result + (patch.radiance * patch.area * dot_ray_sensor);
                }
                else {
                    // this applies no cosine weighting
                    sensor_result = sensor_result + (patch.radiance * patch.area);
                }
                const ray_end = vecAdd(sensor_xyz, vecMult(ray_dir, 2));
                result_rays.push([ray_end, 0]);
            }
            else {
                const ray_end = vecAdd(sensor_xyz, vecMult(ray_dir, isects[0].distance));
                result_rays.push([ray_end, 1]);
            }
        }
        results.push(sensor_result);
        // generate calculation lines
        if (generate_lines) {
            _generateLines(__model__, sensor_xyz, result_rays);
        }
    }
    return { irradiance: results };
}
// =================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXJyYWRpYW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hbmFseXplL0lycmFkaWFuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFdBQVcsRUFDWCxzQkFBc0IsRUFFdEIsUUFBUSxFQUVSLFFBQVEsRUFPUixNQUFNLEVBQ04sTUFBTSxFQUNOLE9BQU8sR0FDVixNQUFNLCtCQUErQixDQUFDO0FBQ3ZDLE9BQU8sS0FBSyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQy9CLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDaEQsT0FBTyxLQUFLLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQzNELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQztBQXVCakIsb0dBQW9HO0FBQ3BHOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBTSxVQUFVLFVBQVUsQ0FDdEIsU0FBa0IsRUFDbEIsT0FBa0QsRUFDbEQsUUFBK0IsRUFDL0IsTUFBaUMsRUFDakMsTUFBbUI7SUFFbkIsUUFBUSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQVUsQ0FBQztJQUMxQyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsb0JBQW9CLENBQUM7SUFDckMsSUFBSSxTQUF3QixDQUFDO0lBQzdCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUNyQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMs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