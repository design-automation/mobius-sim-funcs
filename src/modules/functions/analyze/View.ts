import * as Mathjs from 'mathjs';
import * as THREE from 'three';
import {
    arrMakeFlat,
    createSingleMeshBufTjs,
    distance,
    EEntType,
    GIModel,
    idsBreak,
    multMatrix,
    TEntTypeIdx,
    TId,
    TPlane,
    TRay,
    Txyz,
    vecAdd,
    vecCross,
    vecMult,
    vecRot,
    vecSetLen,
    xformMatrix,
} from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { _getSensorRays } from './_shared';

// ================================================================================================
interface TViewResult {
    avg_dist?: number[];
    min_dist?: number[];
    max_dist?: number[];
    area?: number[];
    perimeter?: number[];
    area_ratio?: number[];
    perimeter_ratio?: number[];
    distance_ratio?: number[];
}
// =================================================================================================
/**
 * Calculates an approximation of the unobstructed view for a set of origins.
 * \n
 * Typically, the origins are created as centroids of a set of windows.
 * \n
 * The unobstructed view is calculated by shooting rays out from the origins in a fan pattern.
 * \n
 * The 'radius' argument defines the maximum radius of the unobstructed view.
 * (The radius is used to define the maximum distance for shooting the rays.)
 * \n
 * The 'num\_rays' argument defines the number of rays that will be shot,
 * in a fan pattern parallel to the XY plane, with equal angle between rays.
 * More rays will result in more accurate result, but will also be slower to execute.
 * \n
 * Returns a dictionary containing different unobstructed view metrics.
 * \n
 * \n
 * @param __model__
 * @param sensors A list of Rays or Planes, to be used as the origins for calculating the unobstructed views.
 * @param entities The obstructions: faces, polygons, or collections.
 * @param radius The maximum radius of the uobstructed views.
 * @param num_rays The number of rays to generate when calculating uobstructed views.
 * @param view_ang The angle of the unobstructed view, in radians.
 * @returns A dictionary containing different unobstructed view metrics.
 */
export function View(
    __model__: GIModel,
    sensors: TRay[] | TPlane[] | TRay[][] | TPlane[][],
    entities: TId | TId[] | TId[][],
    radius: number|[number, number],
    num_rays: number,
    view_ang: number
): TViewResult | [TViewResult, TViewResult] {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.View";
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origins", sensors, 
            [chk.isRayL, chk.isPlnL, chk.isRayLL, chk.isPlnLL]);
        ents_arrs = checkIDs(__model__, fn_name, "entities", entities, 
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
        chk.checkArgs(fn_name, "num_rays", num_rays, [chk.isNum]);
        chk.checkArgs(fn_name, "view_ang", view_ang, [chk.isNum]);
    } else {
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    radius = Array.isArray(radius) ? radius : [1, radius];
    // get rays for sensor points
    const [sensors0, sensors1, two_lists]: [TRay[], TRay[], boolean] = _getSensorRays(sensors, 0.01); // offset by 0.01
    // get the ray direction vectors
    const dir_vecs: Txyz[] = _getDirs(num_rays, view_ang);
    // calc max perim and area
    const tri_dist: number = distance(
        [radius[1], 0, 0], 
        vecRot([radius[1], 0, 0], [0,0,1], view_ang / (num_rays - 1))
    );
    const max_perim = tri_dist * (num_rays - 1);
    const max_area = _triArea(radius[1], radius[1], tri_dist) * (num_rays - 1);
    // create mesh
    const [mesh_tjs, _]: [THREE.Mesh, number[]] = createSingleMeshBufTjs(__model__, ents_arrs);
    // run simulation
    const results0: TViewResult = _calcViews(__model__, 
        sensors0, dir_vecs, radius, mesh_tjs, max_perim, max_area, false);
    const results1: TViewResult = _calcViews(__model__, 
        sensors1, dir_vecs, radius, mesh_tjs, max_perim, max_area, true);
    // cleanup
    mesh_tjs.geometry.dispose();
    (mesh_tjs.material as THREE.Material).dispose();
    // return the results
    if (two_lists) { return [results0, results1]; }
    return results0;
}
// ================================================================================================
function _calcViews(
    __model__: GIModel,
    sensor_rays: TRay[],
    dir_vecs: Txyz[],
    radius: [number, number],
    mesh_tjs: THREE.Mesh,
    max_perim: number,
    max_area: number,
    generate_lines: boolean
): TViewResult {
    // create data structure
    const result: TViewResult = {};
    result.avg_dist = [];
    result.min_dist = [];
    result.max_dist = [];
    result.area_ratio = [];
    result.perimeter_ratio = [];
    result.distance_ratio = [];
    // create tjs objects (to be resued for each ray)
    const sensor_tjs: THREE.Vector3 = new THREE.Vector3();
    const dir_tjs: THREE.Vector3 = new THREE.Vector3();
    const ray_tjs: THREE.Raycaster = new THREE.Raycaster(sensor_tjs, dir_tjs, radius[0], radius[1]);
    // shoot rays
    for (const [sensor_xyz, sensor_dir] of sensor_rays) {
        const sensor_pln: TPlane = _getPlane([sensor_xyz, sensor_dir]);
        // set raycaster origin
        sensor_tjs.x = sensor_xyz[0]; sensor_tjs.y = sensor_xyz[1]; sensor_tjs.z = sensor_xyz[2]; 
        const result_dists: number[] = [];
        const result_hits_xyz: Txyz[] = [];
        const dir_vecs_xformed: Txyz[] = _vecXForm(dir_vecs, sensor_pln);
        for (const ray_dir of dir_vecs_xformed) {
            // set raycaster direction
            dir_tjs.x = ray_dir[0]; dir_tjs.y = ray_dir[1]; dir_tjs.z = ray_dir[2];
            // shoot raycaster
            const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh_tjs, false);
            // get the result
            if (isects.length === 0) {
                result_dists.push(radius[1]);
                result_hits_xyz.push(vecAdd(sensor_xyz, vecMult(ray_dir, radius[1])));
            } else {
                result_dists.push(isects[0]["distance"]);
                result_hits_xyz.push([isects[0].point.x, isects[0].point.y, isects[0].point.z]);
            }
        }
        // calc the perimeter and area
        let perim = 0;
        let area = 0;
        for (let i = 0; i < dir_vecs.length - 1; i++) {
            // calc perim
            const c = distance(result_hits_xyz[i], result_hits_xyz[i + 1]);
            perim += c;
            // calc area
            area += _triArea(result_dists[i], result_dists[i + 1], c);
        }
        const total_dist = Mathjs.sum(result_dists);
        const avg_dist = total_dist / result_dists.length;
        const min_dist = Mathjs.min(result_dists);
        const max_dist = Mathjs.max(result_dists);
        // save the data
        result.avg_dist.push(avg_dist);
        result.min_dist.push(min_dist);
        result.max_dist.push(max_dist);
        result.area_ratio.push(area / max_area);
        result.perimeter_ratio.push(perim / max_perim);
        result.distance_ratio.push(total_dist / (radius[1] * dir_vecs.length));
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
    // return the results
    return result;
}
// ================================================================================================
function _getPlane(sensor_ray: TRay): TPlane {
    return [
        sensor_ray[0] as Txyz,
        vecCross([0,0,1], sensor_ray[1] as Txyz, true),
        [0, 0, 1]
    ];
}
// ================================================================================================
function _getDirs(num_rays: number, view_ang: number): Txyz[] {
    const dirs: Txyz[] = [];
    const ang: number = view_ang / (num_rays - 1);
    const start_ang: number = ang * (num_rays - 1) * -0.5;
    for (let i = 0; i < num_rays; i++) {
        dirs.push( vecRot([0,0,1], [0,1,0], start_ang + (ang * i)) );
    }
    return dirs;
}
// ================================================================================================
function _vecXForm(vecs: Txyz[], pln: TPlane): Txyz[] {
    // transform vectors from the global CS to the local CS
    const pln2: TPlane = [[0,0,0], pln[1], pln[2]];
    const matrix = xformMatrix(pln2, false);
    return vecs.map( vec => multMatrix(vec, matrix));
}
// ================================================================================================
function _triArea(a: number, b: number, c: number): number {
    // calc area using Heron's formula
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}
// ================================================================================================
