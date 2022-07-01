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
    vecAdd,
    vecDot,
    vecLen,
    vecMult,
    vecRot,
    vecSetLen,
} from '@design-automation/mobius-sim';
import * as THREE from 'three';
import lodash from 'lodash';
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { _addLine, _addPosi, _addTri, _generateLines, _getSensorRays } from './_shared';
const EPS = 1e-6;
// =================================================================================================
interface TVentilationResult {
    ventilation: number[];
}
// =================================================================================================
/**
 * Calculate an approximation of the ventilation frequency for a set sensors positioned at specified 
 * locations. 
 * \n
 * @param __model__
 * @param sensors A list of Rays or a list of Planes, to be used as the 
 * sensors for calculating ventilation.
 * @param entities The obstructions, polygons, or collections of polygons.
 * @param radius The max distance for raytracing.
 * @param num_rays An integer specifying the number of rays to generate in each wind direction.
 * @param layers Three numbers specifying layers of rays, as [start, stop, step] relative to the 
 * sensors.
 * @returns A dictionary containing ventilation results.
 */
export function Ventilation(
    __model__: GIModel,
    sensors: TRay[] | TPlane[] | TRay[][] | TPlane[][],
    entities: TId | TId[] | TId[][],
    radius: number | [number, number],
    num_rays: number,
    layers: number | [number, number] | [number, number, number],
): TVentilationResult | [TVentilationResult, TVentilationResult] {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.Ventilation";
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "sensors", sensors, 
            [chk.isXYZL, chk.isRayL, chk.isPlnL, chk.isXYZLL, chk.isRayLL, chk.isPlnLL]);
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
        chk.checkArgs(fn_name, "num_rays", num_rays, [chk.isInt]);
        chk.checkArgs(fn_name, "layers", layers, [chk.isInt, chk.isIntL]);
    } else {
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    radius = Array.isArray(radius) ? radius : [1, radius];
    layers = Array.isArray(layers) ? layers : [0, layers, 1]; // start, end, step_size
    if (layers.length === 2) { layers = [layers[0], layers[1], 1]; }
    // get rays for sensor points
    const [sensors0, sensors1, two_lists]: [TRay[], TRay[], boolean] = _getSensorRays(sensors, 0.01); // offset by 0.01
    // create mesh
    const [mesh_tjs, _]: [THREE.Mesh, number[]] = createSingleMeshBufTjs(__model__, ents_arrs);
    // get the wind rose
    const wind_rose: number[] = __model__.modeldata.attribs.get.getModelAttribVal("wind") as number[];
    // get the direction vectors for shooting rays
    const dir_vecs: Txyz[][] = _ventilationVecs(num_rays + 1, wind_rose);
    // run simulation
    const results0: TVentilationResult = _calcVentilation(__model__, 
        sensors0, dir_vecs, radius, mesh_tjs, layers, wind_rose, false);
    const results1: TVentilationResult = _calcVentilation(__model__, 
        sensors1, dir_vecs, radius, mesh_tjs, layers, wind_rose, true);
    // cleanup
    mesh_tjs.geometry.dispose();
    (mesh_tjs.material as THREE.Material).dispose();
    // return the results
    if (two_lists) { return [results0, results1]; }
    return results0;
}
// =================================================================================================
function _calcVentilation(
    __model__: GIModel,
    sensor_rays: TRay[],
    dir_vecs: Txyz[][],
    radius: [number, number],
    mesh_tjs: THREE.Mesh,
    layers: number[],
    wind_rose: number[],
    generate_lines: boolean
): TVentilationResult {
    const results = [];
    const num_layers: number = Math.round((layers[1] - layers[0]) / layers[2]);
    // create tjs objects (to be resued for each ray)
    const sensor_tjs: THREE.Vector3 = new THREE.Vector3();
    const dir_tjs: THREE.Vector3 = new THREE.Vector3();
    const ray_tjs: THREE.Raycaster = new THREE.Raycaster(sensor_tjs, dir_tjs, radius[0], radius[1]);
    // shoot rays
    for (const [sensor_xyz, sensor_dir] of sensor_rays) {
        const result_rays: [Txyz, number][][] = [];
        const ray_starts: Txyz[] = [];
        let sensor_result = 0;
        // loop through vertical layers
        for (let z = layers[0]; z < layers[1]; z += layers[2]) {
            const layer_rays: [Txyz, number][] = [];
            // save start
            const ray_start: Txyz = [sensor_xyz[0], sensor_xyz[1], sensor_xyz[2] + z];
            ray_starts.push( ray_start );
            sensor_tjs.x = ray_start[0]; sensor_tjs.y = ray_start[1]; sensor_tjs.z = ray_start[2];
            // loop through wind directions
            for (let i = 0; i < wind_rose.length; i++) {
                const wind_freq: number = wind_rose[i] / (dir_vecs[i].length * num_layers);
                // loop thrugh dirs
                for (const ray_dir of dir_vecs[i]) {
                    // check if target is behind sensor
                    const dot_ray_sensor: number = vecDot(ray_dir, sensor_dir);
                    if (dot_ray_sensor < -EPS) { continue; } 
                    // set raycaster direction
                    dir_tjs.x = ray_dir[0]; dir_tjs.y = ray_dir[1]; dir_tjs.z = ray_dir[2];
                    // shoot raycaster
                    const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh_tjs, false);
                    // get results
                    if (isects.length === 0) {
                        sensor_result += wind_freq; // dist_ratio is 1
                        const ray_end: Txyz = vecAdd(ray_start, vecMult(ray_dir, 2));
                        layer_rays.push([ray_end, 0]);
                    } else {
                        const dist_ratio: number = isects[0].distance / radius[1];
                        sensor_result += (wind_freq * dist_ratio);
                        const ray_end: Txyz = [isects[0].point.x, isects[0].point.y, isects[0].point.z];
                        layer_rays.push([ray_end, 1]);
                    }
                }
            }
            result_rays.push(layer_rays);
        }
        results.push(sensor_result);
        // generate calculation lines for each sensor
        if (generate_lines) {
            for (let i = 0; i < result_rays.length; i++) {
                _generateLines(__model__, ray_starts[i], result_rays[i]);
            }
            // vert line
            const z_min = sensor_xyz[2] < ray_starts[0][2] ? sensor_xyz : ray_starts[0];
            const last = ray_starts[ray_starts.length - 1];
            const z_max = sensor_xyz[2] > last[2] ? sensor_xyz : last;
            z_max[2] = z_max[2] + 0.2;
            const posi0_i: number = _addPosi(__model__, z_min);
            const posi1_i: number = _addPosi(__model__, z_max);
            _addLine(__model__, posi0_i, posi1_i);
            // wind rose
            const ang_inc: number = (2 * Math.PI)/wind_rose.length;
            for (let i = 0; i < wind_rose.length; i++) {
                const ang2: number = (Math.PI / 2) - (ang_inc / 2) - (ang_inc * i);
                const ang3: number = ang2 + ang_inc;
                const vec2 = vecSetLen([Math.cos(ang2), Math.sin(ang2), 0], wind_rose[i] * 20);
                const vec3 = vecSetLen([Math.cos(ang3), Math.sin(ang3), 0], wind_rose[i] * 20);
                const posi2_i: number = _addPosi(__model__, vecAdd(z_max, vec2));
                const posi3_i: number = _addPosi(__model__, vecAdd(z_max, vec3));
                _addTri(__model__, posi1_i, posi2_i, posi3_i);
            }
        }
    }
    return { ventilation: results };
}
// =================================================================================================
function _ventilationVecs(num_vecs: number, wind_rose: number[]): Txyz[][] {
    // num_vecs is the number of vecs for each wind angle
    const num_winds: number = wind_rose.length;
    const wind_ang: number = (Math.PI * 2) / num_winds;
    const ang_inc: number = wind_ang / num_vecs;
    const ang_start: number = -(wind_ang / 2) + (ang_inc / 2);
    const dir_vecs: Txyz[][] = [];
    for (let wind_i = 0; wind_i < num_winds; wind_i++) {
        const vecs_wind_dir: Txyz[] = [];
        for (let vec_i = 0; vec_i < num_vecs; vec_i++) {
            const ang: number = ang_start + (wind_ang * wind_i) + (ang_inc * vec_i);
            vecs_wind_dir.push( [Math.sin(ang), Math.cos(ang), 0] );
        }
        dir_vecs.push( vecs_wind_dir );
    }
    // returns a nest list, with vectors groups according to the wind direction
    // e.g. if there are 16 wind directions, then there will be 16 groups of vectors
    return dir_vecs;
}
// =================================================================================================
