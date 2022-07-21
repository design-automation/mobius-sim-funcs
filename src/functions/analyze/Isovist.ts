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
    vecAdd,
    vecDot,
    vecMult,
    vecRot,
    vecSetLen,
} from '@design-automation/mobius-sim';
import * as Mathjs from 'mathjs';
import * as THREE from 'three';
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { _getSensorRays } from './_shared';
const EPS = 1e-6;
// =================================================================================================
interface TIsovistResult {
    avg_dist?: number[];
    min_dist?: number[];
    max_dist?: number[];
    area?: number[];
    perimeter?: number[];
    area_ratio?: number[];
    perimeter_ratio?: number[];
    circularity?: number[];
    compactness?: number[];
    cluster?: number[];
}
// =================================================================================================
/**
 * Calculates an approximation of the isovist for a set of origins, defined by XYZ coords.
 * \n
 * The isovist is calculated by shooting rays out from the origins in a radial pattern.
 * The 'radius' argument defines the maximum radius of the isovist.
 * (The radius is used to define the maximum distance for shooting the rays.)
 * The 'num_rays' argument defines the number of rays that will be shot,
 * in a radial pattern parallel to the XY plane, with equal angle between rays.
 * More rays will result in more accurate result, but will also be slower to execute.
 * \n
 * Returns a dictionary containing different isovist metrics.
 * \n
 * 1. 'avg\_dist': The average distance from origin to the perimeter.
 * 2. 'min\_dist': The minimum distance from the origin to the perimeter.
 * 3. 'max\_dist': The minimum distance from the origin to the perimeter.
 * 4. 'area': The area of the isovist.
 * 5. 'perimeter': The perimeter of the isovist.
 * 4. 'area\_ratio': The ratio of the area of the isovist to the maximum area.
 * 5. 'perimeter\_ratio': The ratio of the perimeter of the isovist to the maximum perimeter.
 * 6. 'circularity': The ratio of the square of the perimeter to area (Davis and Benedikt, 1979).
 * 7. 'compactness': The ratio of average distance to the maximum distance (Michael Batty, 2001).
 * 8. 'cluster': The ratio of the radius of an idealized circle with the actual area of the
 * isovist to the radius of an idealized circle with the actual perimeter of the circle (Michael 
 * Batty, 2001).
 * \n
 * \n
 * @param __model__
 * @param sensors A list of Rays or a list of Planes, to be used as the origins for calculating the 
 * isovists.
 * @param entities The obstructions: faces, polygons, or collections.
 * @param radius The maximum radius of the isovist.
 * @param num_rays The number of rays to generate when calculating isovists.
 * @returns A dictionary containing metrics.
 */
export function Isovist(
    __model__: GIModel,
    sensors: TRay[] | TPlane[] | TRay[][] | TPlane[][],
    entities: TId | TId[] | TId[][],
    radius: number|[number, number],
    num_rays: number
): TIsovistResult | [TIsovistResult,TIsovistResult] {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.Isovist";
    // let origin_ents_arrs: TEntTypeIdx[];
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "sensors", sensors, 
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
    } else {
        // origin_ents_arrs = idsBreak(origins) as TEntTypeIdx[];
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    radius = Array.isArray(radius) ? radius : [1, radius];
    // get rays for sensor points
    const [sensors0, sensors1, two_lists]: [TRay[], TRay[], boolean] = _getSensorRays(sensors, 0.01); // offset by 0.01
    // get the direction vectors for shooting rays
    const dir_vecs: Txyz[] = [];
    const vec: Txyz = [1, 0, 0];
    for (let i = 0; i < num_rays; i++) {
        const dir_xyz = vecRot(vec, [0, 0, 1], (i * (Math.PI * 2)) / num_rays);
        dir_vecs.push(vecSetLen(dir_xyz, radius[1]));
    }
    // calc max perim and area
    const ang = (2 * Math.PI) / num_rays;
    const opp = radius[1] * Math.sin(ang / 2);
    const max_perim = num_rays * 2 * opp;
    const max_area = num_rays * radius[1] * Math.cos(ang / 2) * opp;
    // create mesh
    const [mesh_tjs, _]: [THREE.Mesh, number[]] = createSingleMeshBufTjs(__model__, ents_arrs);
    // run simulation
    const results0: TIsovistResult = _calcIsovist(__model__, 
        sensors0, dir_vecs, radius, mesh_tjs, max_perim, max_area, false);
    const results1: TIsovistResult = _calcIsovist(__model__, 
        sensors1, dir_vecs, radius, mesh_tjs, max_perim, max_area, true);
    // cleanup
    mesh_tjs.geometry.dispose();
    (mesh_tjs.material as THREE.Material).dispose();
    // return the results
    if (two_lists) { return [results0, results1]; }
    return results0;
}
// =================================================================================================
function _calcIsovist(
    __model__: GIModel,
    sensor_rays: TRay[],
    dir_vecs: Txyz[],
    radius: [number, number],
    mesh_tjs: THREE.Mesh,
    max_perim: number,
    max_area: number,
    generate_lines: boolean
): TIsovistResult {
    // create data structure
    const result: TIsovistResult = {};
    result.avg_dist = [];
    result.min_dist = [];
    result.max_dist = [];
    result.area = [];
    result.perimeter = [];
    result.circularity = [];
    result.area_ratio = [];
    result.perimeter_ratio = [];
    result.compactness = [];
    result.cluster = [];
    // create tjs objects (to be resued for each ray)
    const sensor_tjs: THREE.Vector3 = new THREE.Vector3();
    const dir_tjs: THREE.Vector3 = new THREE.Vector3();
    const ray_tjs: THREE.Raycaster = new THREE.Raycaster(sensor_tjs, dir_tjs, radius[0], radius[1]);
    // shoot rays
    for (const [sensor_xyz, sensor_dir] of sensor_rays) {
        // set raycaster origin
        sensor_tjs.x = sensor_xyz[0]; sensor_tjs.y = sensor_xyz[1]; sensor_tjs.z = sensor_xyz[2]; 
        const result_dists: number[] = [];
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
        for (let j = 0; j < dir_vecs.length; j++) {
            const j2 = j === dir_vecs.length - 1 ? 0 : j + 1;
            // calc perim
            const c = distance(result_hits_xyz[j], result_hits_xyz[j2]);
            perim += c;
            // calc area
            area += _isovistTriArea(result_dists[j], result_dists[j2], c);
        }
        const total_dist = Mathjs.sum(result_dists);
        const avg_dist = total_dist / result_dists.length;
        const min_dist = Mathjs.min(result_dists);
        const max_dist = Mathjs.max(result_dists);
        // save the data
        result.avg_dist.push(avg_dist);
        result.min_dist.push(min_dist);
        result.max_dist.push(max_dist);
        result.area.push(area);
        result.perimeter.push(perim);
        result.area_ratio.push(area / max_area);
        result.perimeter_ratio.push(perim / max_perim);
        result.circularity.push((perim * perim) / area);
        result.compactness.push(avg_dist / max_dist);
        result.cluster.push(Math.sqrt(area / Math.PI) / (perim / (2 * Math.PI)));
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
// =================================================================================================
function _isovistTriArea(a: number, b: number, c: number): number {
    // calc area using Heron's formula
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}
// =================================================================================================
