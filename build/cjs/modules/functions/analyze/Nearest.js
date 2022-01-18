"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nearest = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const THREE = __importStar(require("three"));
const _check_ids_1 = require("../../../_check_ids");
const _shared_1 = require("./_shared");
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
function Nearest(__model__, source, target, radius, max_neighbors) {
    if (target === null) {
        target = source;
    } // TODO optimise
    source = (0, mobius_sim_1.arrMakeFlat)(source);
    target = (0, mobius_sim_1.arrMakeFlat)(target);
    // --- Error Check ---
    const fn_name = "analyze.Nearest";
    let source_ents_arrs;
    let target_ents_arrs;
    if (__model__.debug) {
        source_ents_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, "origins", source, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
        target_ents_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, "destinations", target, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
    }
    else {
        // source_ents_arrs = splitIDs(fn_name, 'origins', source,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // target_ents_arrs = splitIDs(fn_name, 'destinations', target,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = (0, mobius_sim_1.idsBreak)(source);
        target_ents_arrs = (0, mobius_sim_1.idsBreak)(target);
    }
    // --- Error Check ---
    const source_posis_i = (0, _shared_1._getUniquePosis)(__model__, source_ents_arrs);
    const target_posis_i = (0, _shared_1._getUniquePosis)(__model__, target_ents_arrs);
    const result = _nearest(__model__, source_posis_i, target_posis_i, radius, max_neighbors);
    // return dictionary with results
    return {
        posis: (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, result[0]),
        neighbors: (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, result[1]),
        distances: result[2],
    };
}
exports.Nearest = Nearest;
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
    const kdtree = new mobius_sim_1.TypedArrayUtils.Kdtree(typed_positions, _fuseDistSq, 4);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmVhcmVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hbmFseXplL05lYXJlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhEQVV1QztBQUN2Qyw2Q0FBK0I7QUFFL0Isb0RBQW1EO0FBQ25ELHVDQUE0QztBQUc1QyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJCRztBQUNILFNBQWdCLE9BQU8sQ0FDbkIsU0FBa0IsRUFDbEIsTUFBbUIsRUFDbkIsTUFBbUIsRUFDbkIsTUFBYyxFQUNkLGFBQXFCO0lBRXJCLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtRQUNqQixNQUFNLEdBQUcsTUFBTSxDQUFDO0tBQ25CLENBQUMsZ0JBQWdCO0lBQ2xCLE1BQU0sR0FBRyxJQUFBLHdCQUFXLEVBQUMsTUFBTSxDQUFVLENBQUM7SUFDdEMsTUFBTSxHQUFHLElBQUEsd0JBQVcsRUFBQyxNQUFNLENBQVUsQ0FBQztJQUN0QyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsaUJBQWlCLENBQUM7SUFDbEMsSUFBSSxnQkFBK0IsQ0FBQztJQUNwQyxJQUFJLGdCQUErQixDQUFDO0lBQ3BDLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixnQkFBZ0IsR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQUMsZUFBRSxDQUFDLElBQUksRUFBRSxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFrQixDQUFDO1FBQ2hILGdCQUFnQixHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxlQUFFLENBQUMsSUFBSSxFQUFFLGVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJ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