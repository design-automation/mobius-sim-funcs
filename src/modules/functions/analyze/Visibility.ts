import * as Mathjs from 'mathjs';
import * as THREE from 'three';
import {
    arrMakeFlat,
    createSingleMeshBufTjs,
    distance,
    EEntType,
    GIModel,
    idsBreak,
    isPlane,
    isRay,
    isXYZ,
    multMatrix,
    TEntTypeIdx,
    TId,
    TPlane,
    TRay,
    Txyz,
    vecAdd,
    vecCross,
    vecFromTo,
    vecNorm,
    vecRot,
    vecSetLen,
    xformMatrix,
} from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../../_check_ids';
import * as chk from '../../../_check_types';
import { Ray } from '../visualize/Ray';
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
 * Typically, the origins are created as centroids of a set of windows. The targets are a set of positions
 * whose visibility is to be analysed.
 * \n
 * The visibility is calculated by shooting rays out from the origins towards the targets.
 * The 'radius' argument defines the maximum radius of the visibility.
 * (The radius is used to define the maximum distance for shooting the rays.)
 * \n
 * Returns a dictionary containing different visibility metrics.
 * \n
 * \n
 * @param __model__
 * @param origins A list of Rays or Planes, to be used as the origins for calculating the uobstructed views.
 * @param entities The obstructions: faces, polygons, or collections.
 * @param radius The maximum radius of the visibility analysis.
 * @param targets The target positions.
 * @returns A dictionary containing different visibility metrics.
 */
export function Visibility(
    __model__: GIModel,
    origins: Txyz[] | TRay[] | TPlane[],
    entities: TId | TId[] | TId[][],
    radius: number,
    targets: TId | TId[] | TId[][],
): TVisibilityResult {
    entities = arrMakeFlat(entities) as TId[];
    targets = arrMakeFlat(targets) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.View";
    let ents_arrs1: TEntTypeIdx[];
    let ents_arrs2: TEntTypeIdx[];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origins", origins, [chk.isRayL, chk.isPlnL]);
        ents_arrs1 = checkIDs(__model__, fn_name, "entities", entities, [ID.isIDL1], [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        chk.checkArgs(fn_name, "radius", radius, [chk.isNum, chk.isNumL]);
        if (Array.isArray(radius)) {
            if (radius.length !== 2) {
                throw new Error('If "radius" is a list, it must have a length of two: [min_dist, max_dist].');
            }
            if (radius[0] >= radius[1]) {
                throw new Error('If "radius" is a list, the "min_dist" must be less than the "max_dist": [min_dist, max_dist].');
            }
        }
        ents_arrs2 = checkIDs(__model__, fn_name, "targets", targets, [ID.isIDL1], null) as TEntTypeIdx[];
    } else {
        ents_arrs1 = idsBreak(entities) as TEntTypeIdx[];
        ents_arrs2 = idsBreak(targets) as TEntTypeIdx[];
    }
    // --- Error Check ---
    // get planes for each sensor point
    const sensors_xyz: Txyz[] = _getOriginXYZs(origins, 0.01); // Offset by 0.01
    // Plane(__model__, sensors, 0.4);
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
    const targets_xyz: Txyz[] = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.POSI, Array.from(target_posis_i), 'xyz') as Txyz[];
    // create mesh
    const [mesh_tjs, idx_to_face_i]: [THREE.Mesh, number[]] = createSingleMeshBufTjs(__model__, ents_arrs1);
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
    const ray_tjs: THREE.Raycaster = new THREE.Raycaster(origin_tjs, dir_tjs, 0, radius);
    // shoot rays
    for (const sensor_xyz of sensors_xyz) {
        origin_tjs.x = sensor_xyz[0]; origin_tjs.y = sensor_xyz[1]; origin_tjs.z = sensor_xyz[2]; 
        const result_dists: number[] = [];
        let result_count = 0;
        const all_dists: number[] = [];
        for (const target_xyz of targets_xyz) {
            const dir: Txyz = vecNorm(vecFromTo(sensor_xyz, target_xyz));
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
    }
    // cleanup
    mesh_tjs.geometry.dispose();
    (mesh_tjs.material as THREE.Material).dispose();
    // return the results
    return result;
}
// ================================================================================================
function _getOriginXYZs(origins: Txyz[] | TRay[] | TPlane[], offset: number): Txyz[] {
    if (isXYZ(origins[0])) {
        // no offset in this case
        return origins as Txyz[];
    }
    const xyzs: Txyz[] = [];
    const is_ray: boolean = isRay(origins[0]);
    const is_pln: boolean = isPlane(origins[0]);
    for (const origin of origins) {
        if (is_ray) {
            xyzs.push( vecAdd(origin[0] as Txyz, vecSetLen(origin[1] as Txyz, offset)) );
        } else if (is_pln) {
            xyzs.push( vecAdd(origin[0] as Txyz, 
                vecSetLen(vecCross(origin[1] as Txyz, origin[2] as Txyz), offset)) );
        } else {
            throw new Error("analyze.Visibiltiy: origins arg contains an invalid value: " + origin);
        }
    }
    return xyzs;
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
