import { Sim, ENT_TYPE } from '../../mobius_sim';
// import TypedArrayUtils,
import * as THREE from 'three';

import { _getUniquePosis } from './_shared';


// ================================================================================================
/**
 * Finds the nearest positions within a certain maximum radius.
 * \n
 * The neighbors to each source position is calculated as follows:
 * 1. Calculate the distance to all target positions.
 * 2. Creat the neighbors set by filtering out target positions that are further than the maximum radius.
 * 3. If the number of neighbors is greater than 'max\_neighbors',
 * then select the 'max\_neighbors' closest target positions.
 * \n
 * Returns a dictionary containing the nearest positions.
 * \n
 * If 'num\_neighbors' is 1, the dictionary will contain two lists:
 * 1. 'posis': a list of positions, a subset of positions from the source.
 * 2. 'neighbors': a list of neighbouring positions, a subset of positions from target.
 * \n
 * If 'num\_neighbors' is greater than 1, the dictionary will contain two lists:
 * 1. 'posis': a list of positions, a subset of positions from the source.
 * 2. 'neighbors': a list of lists of neighbouring positions, a subset of positions from target.
 * \n
 * @param __model__
 * @param source A list of positions, or entities from which positions can be extracted.
 * @param target A list of positions, or entities from which positions can be extracted.
 * If null, the positions in source will be used.
 * @param radius The maximum distance for neighbors. If null, Infinity will be used.
 * @param max_neighbors The maximum number of neighbors to return.
 * If null, the number of positions in target is used.
 * @returns A dictionary containing the results.
 */
export function Nearest(
    __model__: Sim,
    source: string | string[],
    target: string | string[],
    radius: number,
    max_neighbors: number
): { posis: string[]; neighbors: string[] | string[][]; distances: number[] | number[][] } {
    if (target === null) {
        target = source;
    } // TODO optimise
    source = arrMakeFlat(source) as string[];
    target = arrMakeFlat(target) as string[];
    // -----
    const source_posis_i: number[] = _getUniquePosis(__model__, source_ents_arrs);
    const target_posis_i: number[] = _getUniquePosis(__model__, target_ents_arrs);
    const result: [number[], number[] | number[][], number[] | number[][]] = _nearest(
        __model__,
        source_posis_i,
        target_posis_i,
        radius,
        max_neighbors
    );
    // return dictionary with results
    return {
        posis: idsMakeFromIdxs(ENT_TYPE.POSI, result[0]) as string[],
        neighbors: idsMakeFromIdxs(ENT_TYPE.POSI, result[1]) as string[][] | string[],
        distances: result[2] as number[] | number[][],
    };
}
function _fuseDistSq(xyz1: number[], xyz2: number[]): number {
    return Math.pow(xyz1[0] - xyz2[0], 2) + Math.pow(xyz1[1] - xyz2[1], 2) + Math.pow(xyz1[2] - xyz2[2], 2);
}
function _nearest(
    __model__: Sim,
    source_posis_i: number[],
    target_posis_i: number[],
    dist: number,
    num_neighbors: number
): [number[], number[] | number[][], number[] | number[][]] {
    // create a list of all posis
    const set_target_posis_i: Set<number> = new Set(target_posis_i);
    const set_posis_i: Set<number> = new Set(target_posis_i);
    for (const posi_i of source_posis_i) {
        set_posis_i.add(posi_i);
    }
    const posis_i: number[] = Array.from(set_posis_i);
    // get dist and num_neighbours
    if (dist === null) {
        dist = Infinity;
    }
    if (num_neighbors === null) {
        num_neighbors = target_posis_i.length;
    }
    // find neighbor
    const map_posi_i_to_xyz: Map<number, Txyz> = new Map();
    const typed_positions = new Float32Array(posis_i.length * 4);
    const typed_buff = new THREE.BufferGeometry();
    typed_buff.setAttribute("position", new THREE.BufferAttribute(typed_positions, 4));
    for (let i = 0; i < posis_i.length; i++) {
        const posi_i: number = posis_i[i];
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        map_posi_i_to_xyz.set(posi_i, xyz);
        typed_positions[i * 4 + 0] = xyz[0];
        typed_positions[i * 4 + 1] = xyz[1];
        typed_positions[i * 4 + 2] = xyz[2];
        typed_positions[i * 4 + 3] = posi_i;
    }
    const kdtree = new TypedArrayUtils.Kdtree(typed_positions, _fuseDistSq, 4);
    // calculate the dist squared
    const num_posis: number = posis_i.length;
    const dist_sq: number = dist * dist;
    // deal with special case, num_neighbors === 1
    if (num_neighbors === 1) {
        const result1: [number[], number[], number[]] = [[], [], []];
        for (const posi_i of source_posis_i) {
            const nn = kdtree.nearest(map_posi_i_to_xyz.get(posi_i) as any, num_posis, dist_sq);
            let min_dist = Infinity;
            let nn_posi_i: number;
            for (const a_nn of nn) {
                const next_nn_posi_i: number = a_nn[0].obj[3];
                if (set_target_posis_i.has(next_nn_posi_i) && a_nn[1] < min_dist) {
                    min_dist = a_nn[1];
                    nn_posi_i = next_nn_posi_i;
                }
            }
            if (nn_posi_i !== undefined) {
                result1[0].push(posi_i);
                result1[1].push(nn_posi_i);
                result1[2].push(Math.sqrt(min_dist));
            }
        }
        return result1;
    }
    // create a neighbors list
    const result: [number[], number[][], number[][]] = [[], [], []];
    for (const posi_i of source_posis_i) {
        // TODO at the moment is gets all posis since no distinction is made between source and traget
        // TODO kdtree could be optimised
        const nn = kdtree.nearest(map_posi_i_to_xyz.get(posi_i) as any, num_posis, dist_sq);
        const posis_i_dists: [number, number][] = [];
        for (const a_nn of nn) {
            const nn_posi_i: number = a_nn[0].obj[3];
            if (set_target_posis_i.has(nn_posi_i)) {
                posis_i_dists.push([nn_posi_i, a_nn[1]]);
            }
        }
        posis_i_dists.sort((a, b) => a[1] - b[1]);
        const nn_posis_i: number[] = [];
        const nn_dists: number[] = [];
        for (const posi_i_dist of posis_i_dists) {
            nn_posis_i.push(posi_i_dist[0]);
            nn_dists.push(Math.sqrt(posi_i_dist[1]));
            if (nn_posis_i.length === num_neighbors) {
                break;
            }
        }
        if (nn_posis_i.length > 0) {
            result[0].push(posi_i);
            result[1].push(nn_posis_i);
            result[2].push(nn_dists);
        }
    }
    return result;
}
