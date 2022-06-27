import * as Mathjs from 'mathjs';
import * as THREE from 'three';
import {
    arrMakeFlat,
    createSingleMeshBufTjs,
    distance,
    EEntType,
    GIModel,
    idsBreak,
    TEntTypeIdx,
    TId,
    TPlane,
    TRay,
    Txyz,
    vecDot,
    vecFromTo,
    vecNorm,
} from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { _getSensorRays } from './_shared';
// import { Plane } from '../visualize/Plane';

// ================================================================================================
interface TVisibilityResult {
    avg_dist?: number[];
    min_dist?: number[];
    max_dist?: number[];
    count?: number[];
    count_ratio?: number[];
    distance_ratio?: number[];
}
/**
 * Calculates the visibility of a set of target positions from a set of origins.
 * \n
 * Typically, the origins are created as centroids of a set of windows. The targets are a set of 
 * positions whose visibility is to be analysed.
 * \n
 * The visibility is calculated by shooting rays out from the origins towards the targets.
 * The 'radius' argument defines the maximum radius of the visibility.
 * (The radius is used to define the maximum distance for shooting the rays.)
 * \n
 * Returns a dictionary containing different visibility metrics.
 * \n
 * \n
 * @param __model__
 * @param sensors A list of Rays or Planes, to be used as the origins for calculating the 
 * unobstructed views.
 * @param entities The obstructions: faces, polygons, or collections.
 * @param radius The maximum radius of the visibility analysis.
 * @param targets The target positions.
 * @returns A dictionary containing different visibility metrics.
 */
export function Visibility(
    __model__: GIModel,
    sensors: TRay[] | TPlane[] | TRay[][] | TPlane[][],
    entities: TId | TId[] | TId[][],
    radius: number|[number,number],
    targets: TId | TId[] | TId[][],
): TVisibilityResult | [TVisibilityResult, TVisibilityResult] {
    entities = arrMakeFlat(entities) as TId[];
    targets = arrMakeFlat(targets) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.View";
    let ents_arrs1: TEntTypeIdx[];
    let ents_arrs2: TEntTypeIdx[];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origins", sensors, 
            [chk.isRayL, chk.isPlnL, chk.isRayLL, chk.isPlnLL]);
        ents_arrs1 = checkIDs(__model__, fn_name, "entities", entities, 
            [ID.isIDL1], 
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
        ents_arrs2 = checkIDs(__model__, fn_name, "targets", targets, 
            [ID.isIDL1], 
            null) as TEntTypeIdx[];
    } else {
        ents_arrs1 = idsBreak(entities) as TEntTypeIdx[];
        ents_arrs2 = idsBreak(targets) as TEntTypeIdx[];
    }
    // --- Error Check ---
    radius = Array.isArray(radius) ? radius : [1, radius];
    // get planes for each sensor point
    const sensor_rays: TRay[][] = _getSensorRays(sensors, 0.01); // offset by 0.01
    // get the target positions
    const target_posis_i: Set<number> = new Set();
    for (const [ent_type, ent_idx] of ents_arrs2) {
        if (ent_type === EEntType.POSI) {
            target_posis_i.add(ent_idx);
        } else {
            const ent_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_idx);
            for (const ent_posi_i of ent_posis_i) {
                target_posis_i.add(ent_posi_i);
            }
        }
    }
    const targets_xyz: Txyz[] = __model__.modeldata.attribs.get.getEntAttribVal(
        EEntType.POSI, Array.from(target_posis_i), 'xyz') as Txyz[];
    // create mesh
    const [mesh_tjs, _]: [THREE.Mesh, number[]] = createSingleMeshBufTjs(__model__, ents_arrs1);
    // run simulation
    const results0: TVisibilityResult = _calcVisibility(__model__, 
        sensor_rays[0], targets_xyz, mesh_tjs, radius, false);
    const results1: TVisibilityResult = _calcVisibility(__model__, 
        sensor_rays[1], targets_xyz, mesh_tjs, radius, true);
    // cleanup
    mesh_tjs.geometry.dispose();
    (mesh_tjs.material as THREE.Material).dispose();
    // return the results
    if (results0 && results1) { return [results0, results1]; }
    if (results0) { return results0; }
    if (results1) { return results1; }
    return null;
}
// ================================================================================================
function _calcVisibility(
    __model__: GIModel,
    sensor_rays: TRay[],
    targets_xyz: Txyz[],
    mesh_tjs: THREE.Mesh,
    radius: [number, number],
    generate_lines: boolean
): TVisibilityResult {
    if (sensor_rays.length === 0) { return null; }
    // create data structure
    const result: TVisibilityResult = {};
    result.avg_dist = [];
    result.min_dist = [];
    result.max_dist = [];
    result.count = [];
    result.count_ratio = [];
    result.distance_ratio = [];
    // create tjs objects (to be resued for each ray)
    const origin_tjs: THREE.Vector3 = new THREE.Vector3();
    const dir_tjs: THREE.Vector3 = new THREE.Vector3();
    const ray_tjs: THREE.Raycaster = new THREE.Raycaster(origin_tjs, dir_tjs, radius[0], radius[1]);
    // shoot rays
    for (const [sensor_xyz, sensor_dir] of sensor_rays) {
        origin_tjs.x = sensor_xyz[0]; origin_tjs.y = sensor_xyz[1]; origin_tjs.z = sensor_xyz[2]; 
        const result_dists: number[] = [];
        let result_count = 0;
        const all_dists: number[] = [];
        const hit_targets_xyz: Txyz[] = [];
        for (const target_xyz of targets_xyz) {
            const dir: Txyz = vecNorm(vecFromTo(sensor_xyz, target_xyz));
            // check if target is behind sensor
            if (vecDot(dir, sensor_dir) <= 0) { continue; } 
            // shoot Raycaster
            dir_tjs.x = dir[0]; dir_tjs.y = dir[1]; dir_tjs.z = dir[2];
            // Ray(__model__, [sensor_xyz, dir], 1);
            const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh_tjs, false);
            // get the result
            // if not intersection, the the target is visible
            const dist = distance(sensor_xyz, target_xyz);
            all_dists.push(dist);
            if (isects.length === 0) {
                result_dists.push(dist);
                result_count += 1;
                hit_targets_xyz.push(target_xyz);
            }
        }
        if (result_count > 0) {
            // calc the metrics
            const total_dist = Mathjs.sum(result_dists);
            const avg_dist = total_dist / result_dists.length;
            const min_dist = Mathjs.min(result_dists);
            const max_dist = Mathjs.max(result_dists);
            // save the data
            result.avg_dist.push(avg_dist);
            result.min_dist.push(min_dist);
            result.max_dist.push(max_dist);
            result.count.push(result_count);
            result.count_ratio.push(result_count / targets_xyz.length);
            result.distance_ratio.push(total_dist / Mathjs.sum( all_dists ));
        } else {
            result.avg_dist.push(null);
            result.min_dist.push(null);
            result.max_dist.push(null);
            result.count.push(result_count);
            result.count_ratio.push(0);
            result.distance_ratio.push(0);
        }
        // generate calculation lines
        if (generate_lines) {
            const posi0_i: number = __model__.modeldata.geom.add.addPosi();
            __model__.modeldata.attribs.set.setEntAttribVal(
                    EEntType.POSI, posi0_i, 'xyz', sensor_xyz);
            for (const hit_target_xyz of hit_targets_xyz) {
                const posi1_i: number = __model__.modeldata.geom.add.addPosi();
                __model__.modeldata.attribs.set.setEntAttribVal(
                        EEntType.POSI, posi1_i, 'xyz', hit_target_xyz);
                __model__.modeldata.geom.add.addPline([posi0_i, posi1_i], false);
            }
        }
    }
    // return the results
    return result;
}
// ================================================================================================
