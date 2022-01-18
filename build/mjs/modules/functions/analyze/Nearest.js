import { arrMakeFlat, EEntType, idsBreak, idsMakeFromIdxs, TypedArrayUtils, } from '@design-automation/mobius-sim';
import * as THREE from 'three';
import { checkIDs, ID } from '../../../_check_ids';
import { _getUniquePosis } from './_shared';
// ================================================================================================
/**
 * Finds the nearest positions within a certain maximum radius.
 * \n
 * The neighbors to each source position is calculated as follows:
 * 1. Calculate the distance to all target positions.
 * 2. Creat the neighbors set by filtering out target positions that are further than the maximum radius.
 * 3. If the number of neighbors is greater than 'max_neighbors',
 * then select the 'max_neighbors' closest target positions.
 * \n
 * Returns a dictionary containing the nearest positions.
 * \n
 * If 'num_neighbors' is 1, the dictionary will contain two lists:
 * 1. 'posis': a list of positions, a subset of positions from the source.
 * 2. 'neighbors': a list of neighbouring positions, a subset of positions from target.
 * \n
 * If 'num_neighbors' is greater than 1, the dictionary will contain two lists:
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
export function Nearest(__model__, source, target, radius, max_neighbors) {
    if (target === null) {
        target = source;
    } // TODO optimise
    source = arrMakeFlat(source);
    target = arrMakeFlat(target);
    // --- Error Check ---
    const fn_name = "analyze.Nearest";
    let source_ents_arrs;
    let target_ents_arrs;
    if (__model__.debug) {
        source_ents_arrs = checkIDs(__model__, fn_name, "origins", source, [ID.isID, ID.isIDL1], null);
        target_ents_arrs = checkIDs(__model__, fn_name, "destinations", target, [ID.isID, ID.isIDL1], null);
    }
    else {
        // source_ents_arrs = splitIDs(fn_name, 'origins', source,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // target_ents_arrs = splitIDs(fn_name, 'destinations', target,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = idsBreak(source);
        target_ents_arrs = idsBreak(target);
    }
    // --- Error Check ---
    const source_posis_i = _getUniquePosis(__model__, source_ents_arrs);
    const target_posis_i = _getUniquePosis(__model__, target_ents_arrs);
    const result = _nearest(__model__, source_posis_i, target_posis_i, radius, max_neighbors);
    // return dictionary with results
    return {
        posis: idsMakeFromIdxs(EEntType.POSI, result[0]),
        neighbors: idsMakeFromIdxs(EEntType.POSI, result[1]),
        distances: result[2],
    };
}
function _fuseDistSq(xyz1, xyz2) {
    return Math.pow(xyz1[0] - xyz2[0], 2) + Math.pow(xyz1[1] - xyz2[1], 2) + Math.pow(xyz1[2] - xyz2[2], 2);
}
function _nearest(__model__, source_posis_i, target_posis_i, dist, num_neighbors) {
    // create a list of all posis
    const set_target_posis_i = new Set(target_posis_i);
    const set_posis_i = new Set(target_posis_i);
    for (const posi_i of source_posis_i) {
        set_posis_i.add(posi_i);
    }
    const posis_i = Array.from(set_posis_i);
    // get dist and num_neighbours
    if (dist === null) {
        dist = Infinity;
    }
    if (num_neighbors === null) {
        num_neighbors = target_posis_i.length;
    }
    // find neighbor
    const map_posi_i_to_xyz = new Map();
    const typed_positions = new Float32Array(posis_i.length * 4);
    const typed_buff = new THREE.BufferGeometry();
    typed_buff.setAttribute("position", new THREE.BufferAttribute(typed_positions, 4));
    for (let i = 0; i < posis_i.length; i++) {
        const posi_i = posis_i[i];
        const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        map_posi_i_to_xyz.set(posi_i, xyz);
        typed_positions[i * 4 + 0] = xyz[0];
        typed_positions[i * 4 + 1] = xyz[1];
        typed_positions[i * 4 + 2] = xyz[2];
        typed_positions[i * 4 + 3] = posi_i;
    }
    const kdtree = new TypedArrayUtils.Kdtree(typed_positions, _fuseDistSq, 4);
    // calculate the dist squared
    const num_posis = posis_i.length;
    const dist_sq = dist * dist;
    // deal with special case, num_neighbors === 1
    if (num_neighbors === 1) {
        const result1 = [[], [], []];
        for (const posi_i of source_posis_i) {
            const nn = kdtree.nearest(map_posi_i_to_xyz.get(posi_i), num_posis, dist_sq);
            let min_dist = Infinity;
            let nn_posi_i;
            for (const a_nn of nn) {
                const next_nn_posi_i = a_nn[0].obj[3];
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
    const result = [[], [], []];
    for (const posi_i of source_posis_i) {
        // TODO at the moment is gets all posis since no distinction is made between source and traget
        // TODO kdtree could be optimised
        const nn = kdtree.nearest(map_posi_i_to_xyz.get(posi_i), num_posis, dist_sq);
        const posis_i_dists = [];
        for (const a_nn of nn) {
            const nn_posi_i = a_nn[0].obj[3];
            if (set_target_posis_i.has(nn_posi_i)) {
                posis_i_dists.push([nn_posi_i, a_nn[1]]);
            }
        }
        posis_i_dists.sort((a, b) => a[1] - b[1]);
        const nn_posis_i = [];
        const nn_dists = [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmVhcmVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hbmFseXplL05lYXJlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFdBQVcsRUFDWCxRQUFRLEVBRVIsUUFBUSxFQUNSLGVBQWUsRUFJZixlQUFlLEdBQ2xCLE1BQU0sK0JBQStCLENBQUM7QUFDdkMsT0FBTyxLQUFLLEtBQUssTUFBTSxPQUFPLENBQUM7QUFFL0IsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRzVDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkJHO0FBQ0gsTUFBTSxVQUFVLE9BQU8sQ0FDbkIsU0FBa0IsRUFDbEIsTUFBbUIsRUFDbkIsTUFBbUIsRUFDbkIsTUFBYyxFQUNkLGFBQXFCO0lBRXJCLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtRQUNqQixNQUFNLEdBQUcsTUFBTSxDQUFDO0tBQ25CLENBQUMsZ0JBQWdCO0lBQ2xCLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFVLENBQUM7SUFDdEMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQVUsQ0FBQztJQUN0QyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsaUJBQWlCLENBQUM7SUFDbEMsSUFBSSxnQkFBK0IsQ0FBQztJQUNwQyxJQUFJLGdCQUErQixDQUFDO0lBQ3BDLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixnQkFBZ0IsR0FBRyxRQUFRLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFrQixDQUFDO1FB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