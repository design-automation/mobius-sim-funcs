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
    vecSetLen,
} from '@design-automation/mobius-sim';
import * as THREE from 'three';
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { Ray } from '../visualize/Ray';
import { _calcExposure, _rayOrisDirsTjs } from './_shared';
const EPS = 1e-6;
/**
 * Calculate an approximation of the ventilation frequency for a set sensors positioned at specified 
 * locations. 
 * \n
 * @param __model__
 * @param sensors A list of coordinates, a list of Rays or a list of Planes, to be used as the sensors for calculating exposure.
 * @param entities The obstructions, faces, polygons, or collections of faces or polygons.
 * @param radius The max distance for raytracing.
 * @param num_rays An integer specifying the number of rays to generate in each wind direction.
 * @param layers The layers of rays, specified as [start, stop, step] relative to the sensors.
 * @returns A dictionary containing solar exposure results.
 */
export function Ventilation(
    __model__: GIModel,
    sensors: Txyz[] | TRay[] | TPlane[],
    entities: TId | TId[] | TId[][],
    radius: number | [number, number],
    num_rays: number,
    layers: number | [number, number] | [number, number, number],
): any {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.Ventilation";
    let ents_arrs: TEntTypeIdx[];
    // let latitude: number = null;
    // let north: Txy = [0, 1];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "sensors", sensors, [chk.isXYZL, chk.isRayL, chk.isPlnL]);
        chk.checkArgs(fn_name, "detail", num_rays, [chk.isInt]);
        chk.checkArgs(fn_name, "layers", num_rays, [chk.isInt, chk.isIntL]);

        ents_arrs = checkIDs(__model__, fn_name, "entities", entities, [ID.isID, ID.isIDL1], [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
    } else {
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    // set layers: start, end, step_size
    if (!Array.isArray(layers)) { 
        layers = [0, layers, 1]; 
    } else if (layers.length < 3) {
        layers = [layers[0], layers[1], 1]; 
    }
    // get sensors and create mesh
    const sensor_oris_dirs_tjs: [THREE.Vector3, THREE.Vector3][] = _rayOrisDirsTjs(__model__, sensors, 0.01);
    const [mesh_tjs, idx_to_face_i]: [THREE.Mesh, number[]] = createSingleMeshBufTjs(__model__, ents_arrs);
    radius = Array.isArray(radius) ? radius : [1, radius];
    // get the direction vectors
    const wind_rose: number[] = __model__.modeldata.attribs.get.getModelAttribVal("wind") as number[];
    // get the direction vectorsnum_vecs
    const vecs_tjs: THREE.Vector3[][] = _ventilationVecs(num_rays + 1, wind_rose);
    // run the simulation
    const results: number[] = _calcVentilation(
        __model__,
        sensor_oris_dirs_tjs, 
        vecs_tjs, 
        mesh_tjs, 
        layers as [number, number, number], 
        radius, wind_rose);
    // cleanup
    mesh_tjs.geometry.dispose();
    (mesh_tjs.material as THREE.Material).dispose();
    // return the result
    return { ventilation: results };
}
function _ventilationVecs(num_vecs: number, wind_rose: number[]): THREE.Vector3[][] {
    // num_vecs is the number of vecs for each wind angle
    const num_winds: number = wind_rose.length;
    const wind_ang: number = (Math.PI * 2) / num_winds;
    const ang_inc: number = wind_ang / num_vecs;
    const ang_start: number = ang_inc / 2;
    const vecs: THREE.Vector3[][] = [];
    for (let wind_i = 0; wind_i < num_winds; wind_i++) {
        const vecs_wind_dir: THREE.Vector3[] = [];
        for (let vec_i = 0; vec_i < num_vecs; vec_i++) {
            const ang: number = (wind_ang * wind_i) + ang_start + (ang_inc * vec_i);
            vecs_wind_dir.push( new THREE.Vector3( Math.sin(ang), Math.cos(ang), 0) );
        }
        vecs.push( vecs_wind_dir );
    }
    // returns a nest list, with vectors groups according to the wind direction
    // e.g. if there are 16 wind directions, then there will be 16 groups of vectors
    return vecs;
}

function _calcVentilation(
    __model__: GIModel,
    sensors_normals_tjs: [THREE.Vector3, THREE.Vector3][],
    vecs_tjs: THREE.Vector3[][],
    mesh_tjs: THREE.Mesh,
    layers: [number, number, number],
    limits: [number, number],
    wind_rose: number[]
): number[] {
    const results = [];
    const num_layers: number = Math.round((layers[1] - layers[0]) / layers[2]);
    for (const [sensor_tjs, normal_tjs] of sensors_normals_tjs) {
        const base_z: number = sensor_tjs.z;
        let sensor_result = 0;
        for (let wind_dir = 0; wind_dir < wind_rose.length; wind_dir++) {
            let wind_dir_result = 0;
            const wind_vecs_tjs: THREE.Vector3[] = vecs_tjs[wind_dir];
            const wind_freq: number = wind_rose[wind_dir] / (wind_vecs_tjs.length * num_layers);
            for (const vec_tjs of wind_vecs_tjs) {
                // console.log(">>>wind dir", vec_tjs)
                for (let z = layers[0]; z < layers[1]; z += layers[2]) {
                    // console.log(">>>z", z)
                    sensor_tjs.setZ(base_z + z);
                    // const dot_normal_direction: number = normal_tjs.dot(vec_tjs);
                    // console.log(">>>dot_normal_direction", dot_normal_direction)
                    // if (dot_normal_direction > -EPS) {
                        const ray_tjs: THREE.Raycaster = new THREE.Raycaster(sensor_tjs, vec_tjs, limits[0], limits[1]);
                        const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh_tjs, false);
                        // debug
                        // Ray(__model__, [
                        //     [sensor_tjs.x, sensor_tjs.y, sensor_tjs.z], 
                        //     vecSetLen([vec_tjs.x, vec_tjs.y, vec_tjs.z], 0.3)
                        // ], 0.01);
                        // console.log(">>isects>", isects)
                        if (isects.length !== 0) {
                            const dist_ratio: number = isects[0].distance / limits[1];
                            wind_dir_result += (wind_freq * dist_ratio);
                            // console.log(">>>>yes intersect>", isects[0].distance, dist_ratio, wind_freq * dist_ratio)
                            // console.log(">> yes intersect >");
                        } else {
                            wind_dir_result += wind_freq; // dist_ratio is 1
                            // console.log(">> no intersect >")
                        }
                    // }
                }
            }
            sensor_result += wind_dir_result;
            // console.log(">>> wind_dir_result>",wind_dir, 100*  wind_dir_result / (wind_vecs_tjs.length * num_layers))
        }
        results.push(sensor_result);
        // console.log(">>> sensor_resultresult>", sensor_result)
    }
    return results;
}