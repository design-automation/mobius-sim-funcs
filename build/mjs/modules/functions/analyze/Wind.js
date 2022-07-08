import { arrMakeFlat, createSingleMeshBufTjs, EEntType, idsBreak, vecAdd, vecDot, vecMult, vecSetLen, } from '@design-automation/mobius-sim';
import * as THREE from 'three';
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { _addLine, _addPosi, _addTri, _generateLines, _getSensorRays } from './_shared';
const EPS = 1e-6;
// =================================================================================================
/**
 * Calculate an approximation of the wind frequency for a set sensors positioned at specified
 * locations.
 * \n
 * @param __model__
 * @param sensors A list of Rays or a list of Planes, to be used as the
 * sensors for calculating wind.
 * @param entities The obstructions, polygons, or collections of polygons.
 * @param radius The max distance for raytracing.
 * @param num_rays An integer specifying the number of rays to generate in each wind direction.
 * @param layers Three numbers specifying layers of rays, as [start, stop, step] relative to the
 * sensors.
 * @returns A dictionary containing wind results.
 */
export function Wind(__model__, sensors, entities, radius, num_rays, layers) {
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = "analyze.Wind";
    let ents_arrs;
    if (__model__.debug) {
        chk.checkArgs(fn_name, "sensors", sensors, [chk.isXYZL, chk.isRayL, chk.isPlnL, chk.isXYZLL, chk.isRayLL, chk.isPlnLL]);
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
        chk.checkArgs(fn_name, "num_rays", num_rays, [chk.isInt]);
        chk.checkArgs(fn_name, "layers", layers, [chk.isInt, chk.isIntL]);
    }
    else {
        ents_arrs = idsBreak(entities);
    }
    // --- Error Check ---
    radius = Array.isArray(radius) ? radius : [1, radius];
    layers = Array.isArray(layers) ? layers : [0, layers, 1]; // start, end, step_size
    if (layers.length === 2) {
        layers = [layers[0], layers[1], 1];
    }
    // get rays for sensor points
    const [sensors0, sensors1, two_lists] = _getSensorRays(sensors, 0.01); // offset by 0.01
    // create mesh
    const [mesh_tjs, _] = createSingleMeshBufTjs(__model__, ents_arrs);
    // get the wind rose
    const wind_rose = __model__.modeldata.attribs.get.getModelAttribVal("wind");
    // get the direction vectors for shooting rays
    const dir_vecs = _windVecs(num_rays + 1, wind_rose);
    // run simulation
    const results0 = _calcWind(__model__, sensors0, dir_vecs, radius, mesh_tjs, layers, wind_rose, false);
    const results1 = _calcWind(__model__, sensors1, dir_vecs, radius, mesh_tjs, layers, wind_rose, true);
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
function _calcWind(__model__, sensor_rays, dir_vecs, radius, mesh_tjs, layers, wind_rose, generate_lines) {
    const results = [];
    const num_layers = Math.round((layers[1] - layers[0]) / layers[2]);
    // create tjs objects (to be resued for each ray)
    const sensor_tjs = new THREE.Vector3();
    const dir_tjs = new THREE.Vector3();
    const ray_tjs = new THREE.Raycaster(sensor_tjs, dir_tjs, radius[0], radius[1]);
    // shoot rays
    for (const [sensor_xyz, sensor_dir] of sensor_rays) {
        const vis_rays = [];
        const ray_starts = [];
        let sensor_result = 0;
        // loop through vertical layers
        for (let z = layers[0]; z < layers[1]; z += layers[2]) {
            const vis_layer_rays = [];
            // save start
            const ray_start = [sensor_xyz[0], sensor_xyz[1], sensor_xyz[2] + z];
            ray_starts.push(ray_start);
            sensor_tjs.x = ray_start[0];
            sensor_tjs.y = ray_start[1];
            sensor_tjs.z = ray_start[2];
            // loop through wind directions
            for (let i = 0; i < wind_rose.length; i++) {
                const wind_freq = wind_rose[i] / (dir_vecs[i].length * num_layers);
                // loop thrugh dirs
                for (const ray_dir of dir_vecs[i]) {
                    // check if target is behind sensor
                    const dot_ray_sensor = vecDot(ray_dir, sensor_dir);
                    if (dot_ray_sensor < -EPS) {
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
                        sensor_result += wind_freq; // dist_ratio is 1
                        const ray_end = vecAdd(ray_start, vecMult(ray_dir, 2));
                        vis_layer_rays.push([ray_end, 0]);
                    }
                    else {
                        const dist_ratio = isects[0].distance / radius[1];
                        sensor_result += (wind_freq * dist_ratio);
                        const ray_end = [isects[0].point.x, isects[0].point.y, isects[0].point.z];
                        vis_layer_rays.push([ray_end, 1]);
                    }
                }
            }
            vis_rays.push(vis_layer_rays);
        }
        results.push(sensor_result);
        // generate calculation lines for each sensor
        if (generate_lines) {
            for (let i = 0; i < vis_rays.length; i++) {
                _generateLines(__model__, ray_starts[i], vis_rays[i]);
            }
            // vert line
            const z_min = sensor_xyz[2] < ray_starts[0][2] ? sensor_xyz : ray_starts[0];
            const last = ray_starts[ray_starts.length - 1];
            const z_max = sensor_xyz[2] > last[2] ? sensor_xyz : last;
            z_max[2] = z_max[2] + 0.2;
            const posi0_i = _addPosi(__model__, z_min);
            const posi1_i = _addPosi(__model__, z_max);
            _addLine(__model__, posi0_i, posi1_i);
            // wind rose
            const ang_inc = (2 * Math.PI) / wind_rose.length;
            for (let i = 0; i < wind_rose.length; i++) {
                const ang2 = (Math.PI / 2) - (ang_inc / 2) - (ang_inc * i);
                const ang3 = ang2 + ang_inc;
                const vec2 = vecSetLen([Math.cos(ang2), Math.sin(ang2), 0], wind_rose[i] * 20);
                const vec3 = vecSetLen([Math.cos(ang3), Math.sin(ang3), 0], wind_rose[i] * 20);
                const posi2_i = _addPosi(__model__, vecAdd(z_max, vec2));
                const posi3_i = _addPosi(__model__, vecAdd(z_max, vec3));
                _addTri(__model__, posi1_i, posi2_i, posi3_i);
            }
        }
    }
    return { wind: results };
}
// =================================================================================================
function _windVecs(num_vecs, wind_rose) {
    // num_vecs is the number of vecs for each wind angle
    const num_winds = wind_rose.length;
    const wind_ang = (Math.PI * 2) / num_winds;
    const ang_inc = wind_ang / num_vecs;
    const ang_start = -(wind_ang / 2) + (ang_inc / 2);
    const dir_vecs = [];
    for (let wind_i = 0; wind_i < num_winds; wind_i++) {
        const vecs_wind_dir = [];
        for (let vec_i = 0; vec_i < num_vecs; vec_i++) {
            const ang = ang_start + (wind_ang * wind_i) + (ang_inc * vec_i);
            vecs_wind_dir.push([Math.sin(ang), Math.cos(ang), 0]);
        }
        dir_vecs.push(vecs_wind_dir);
    }
    // returns a nest list, with vectors groups according to the wind direction
    // e.g. if there are 16 wind directions, then there will be 16 groups of vectors
    return dir_vecs;
}
// =================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2luZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hbmFseXplL1dpbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFdBQVcsRUFDWCxzQkFBc0IsRUFDdEIsUUFBUSxFQUVSLFFBQVEsRUFNUixNQUFNLEVBQ04sTUFBTSxFQUVOLE9BQU8sRUFFUCxTQUFTLEdBQ1osTUFBTSwrQkFBK0IsQ0FBQztBQUN2QyxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUUvQixPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2hELE9BQU8sS0FBSyxHQUFHLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDeEYsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBS2pCLG9HQUFvRztBQUNwRzs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsTUFBTSxVQUFVLElBQUksQ0FDaEIsU0FBa0IsRUFDbEIsT0FBa0QsRUFDbEQsUUFBK0IsRUFDL0IsTUFBaUMsRUFDakMsUUFBZ0IsRUFDaEIsTUFBNEQ7SUFFNUQsUUFBUSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQVUsQ0FBQztJQUMxQyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDO0lBQy9CLElBQUksU0FBd0IsQ0FBQztJQUM3QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFDckMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLEdB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