import { arrMakeFlat, arrMaxDepth, EEntType, idsBreak, isEmptyArr, vecAdd, vecDiv, vecDot, vecFromTo, vecLen, vecSetLen, } from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../../_check_ids';
import { _EDistanceMethod } from './_enum';
// ================================================================================================
/**
 * Calculates the minimum distance from one position to other entities in the model.
 *
 * @param __model__
 * @param entities1 Position to calculate distance from.
 * @param entities2 List of entities to calculate distance to.
 * @param method Enum; distance method.
 * @returns Distance, or list of distances (if position2 is a list).
 * @example distance1 = calc.Distance (position1, position2, p_to_p_distance)
 * @example_info position1 = [0,0,0], position2 = [[0,0,10],[0,0,20]], Expected value of distance is 10.
 */
export function Distance(__model__, entities1, entities2, method) {
    if (isEmptyArr(entities1)) {
        return [];
    }
    if (isEmptyArr(entities2)) {
        return [];
    }
    if (Array.isArray(entities1)) {
        entities1 = arrMakeFlat(entities1);
    }
    entities2 = arrMakeFlat(entities2);
    // --- Error Check ---
    const fn_name = 'calc.Distance';
    let ents_arr1;
    let ents_arr2;
    if (__model__.debug) {
        ents_arr1 = checkIDs(__model__, fn_name, 'entities1', entities1, [ID.isID, ID.isIDL1], null);
        ents_arr2 = checkIDs(__model__, fn_name, 'entities2', entities2, [ID.isIDL1], null);
    }
    else {
        ents_arr1 = idsBreak(entities1);
        ents_arr2 = idsBreak(entities2);
    }
    // --- Error Check ---
    // get the from posis
    let from_posis_i;
    if (arrMaxDepth(ents_arr1) === 1 && ents_arr1[0] === EEntType.POSI) {
        from_posis_i = ents_arr1[1];
    }
    else {
        from_posis_i = [];
        for (const [ent_type, ent_i] of ents_arr1) {
            if (ent_type === EEntType.POSI) {
                from_posis_i.push(ent_i);
            }
            else {
                const ent_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
                for (const ent_posi_i of ent_posis_i) {
                    from_posis_i.push(ent_posi_i);
                }
            }
        }
    }
    // get the to ent_type
    let to_ent_type;
    switch (method) {
        case _EDistanceMethod.PS_PS_DISTANCE:
            to_ent_type = EEntType.POSI;
            break;
        case _EDistanceMethod.PS_W_DISTANCE:
        case _EDistanceMethod.PS_E_DISTANCE:
            to_ent_type = EEntType.EDGE;
            break;
        default:
            break;
    }
    // get the ents and posis sets
    const set_to_ents_i = new Set();
    let set_to_posis_i = new Set();
    for (const [ent_type, ent_i] of ents_arr2) {
        // ents
        if (ent_type === to_ent_type) {
            set_to_ents_i.add(ent_i);
        }
        else {
            const sub_ents_i = __model__.modeldata.geom.nav.navAnyToAny(ent_type, to_ent_type, ent_i);
            for (const sub_ent_i of sub_ents_i) {
                set_to_ents_i.add(sub_ent_i);
            }
        }
        // posis
        if (to_ent_type !== EEntType.POSI) {
            const sub_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
            for (const sub_posi_i of sub_posis_i) {
                set_to_posis_i.add(sub_posi_i);
            }
        }
    }
    // create an array of to_ents
    const to_ents_i = Array.from(set_to_ents_i);
    // cerate a posis xyz map
    const map_posi_i_xyz = new Map();
    if (to_ent_type === EEntType.POSI) {
        set_to_posis_i = set_to_ents_i;
    }
    for (const posi_i of set_to_posis_i) {
        const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        map_posi_i_xyz.set(posi_i, xyz);
    }
    // calc the distance
    switch (method) {
        case _EDistanceMethod.PS_PS_DISTANCE:
            return _distanceManyPosisToPosis(__model__, from_posis_i, to_ents_i, map_posi_i_xyz, method);
        case _EDistanceMethod.PS_W_DISTANCE:
        case _EDistanceMethod.PS_E_DISTANCE:
            return _distanceManyPosisToEdges(__model__, from_posis_i, to_ents_i, map_posi_i_xyz, method);
        default:
            break;
    }
}
function _distanceManyPosisToPosis(__model__, from_posi_i, to_ents_i, map_posi_i_xyz, method) {
    if (!Array.isArray(from_posi_i)) {
        from_posi_i = from_posi_i;
        return _distancePstoPs(__model__, from_posi_i, to_ents_i, map_posi_i_xyz);
    }
    else {
        from_posi_i = from_posi_i;
        // TODO This can be optimised
        // From posis may have duplicates, only calc once
        return from_posi_i.map(one_from => _distanceManyPosisToPosis(__model__, one_from, to_ents_i, map_posi_i_xyz, method));
    }
}
// function _distanceManyPosisToWires(__model__: GIModel, from_posi_i: number|number[], to_ents_i: number[],
//         method: _EDistanceMethod): number|number[] {
//     if (!Array.isArray(from_posi_i)) {
//         from_posi_i = from_posi_i as number;
//         return _distancePstoW(__model__, from_posi_i, to_ents_i) as number;
//     } else  {
//         from_posi_i = from_posi_i as number[];
//         // TODO This can be optimised
//         // There is some vector stuff that gets repeated for each posi to line dist calc
//         return from_posi_i.map( one_from => _distanceManyPosisToWires(__model__, one_from, to_ents_i, method) ) as number[];
//     }
// }
function _distanceManyPosisToEdges(__model__, from_posi_i, to_ents_i, map_posi_i_xyz, method) {
    if (!Array.isArray(from_posi_i)) {
        from_posi_i = from_posi_i;
        return _distancePstoE(__model__, from_posi_i, to_ents_i, map_posi_i_xyz);
    }
    else {
        from_posi_i = from_posi_i;
        // TODO This can be optimised
        // From posis may have duplicates, only calc once
        // Adjacent edges could be calculated once only
        return from_posi_i.map(one_from => _distanceManyPosisToEdges(__model__, one_from, to_ents_i, map_posi_i_xyz, method));
    }
}
function _distancePstoPs(__model__, from_posi_i, to_posis_i, map_posi_i_xyz) {
    const from_xyz = __model__.modeldata.attribs.posis.getPosiCoords(from_posi_i);
    let min_dist = Infinity;
    // loop, measure dist
    for (const to_posi_i of to_posis_i) {
        // get xyz
        const to_xyz = map_posi_i_xyz.get(to_posi_i);
        // calc dist
        const dist = _distancePointToPoint(from_xyz, to_xyz);
        if (dist < min_dist) {
            min_dist = dist;
        }
    }
    return min_dist;
}
// function _distancePstoW(__model__: GIModel, from_posi_i: number, to_wires_i: number[]): number {
//     const from_xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(from_posi_i);
//     let min_dist = Infinity;
//     const map_posi_xyz: Map<number, Txyz> = new Map();
//     for (const wire_i of to_wires_i) {
//         // get the posis
//         const to_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
//         // if closed, add first posi to end
//         if (__model__.modeldata.geom.query.isWireClosed(wire_i)) { to_posis_i.push(to_posis_i[0]); }
//         // add the first xyz to the list, this will be prev
//         let prev_xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(to_posis_i[0]);
//         map_posi_xyz.set(to_posis_i[0], prev_xyz);
//         // loop, measure dist
//         for (let i = 1; i < to_posis_i.length; i++) {
//             // get xyz
//             const curr_posi_i: number = to_posis_i[i];
//             let curr_xyz: Txyz = map_posi_xyz.get(curr_posi_i);
//             if (curr_xyz === undefined) {
//                 curr_xyz = __model__.modeldata.attribs.posis.getPosiCoords(curr_posi_i);
//                 map_posi_xyz.set(curr_posi_i, curr_xyz);
//             }
//             // calc dist
//             const dist: number = _distancePointToLine(from_xyz, prev_xyz, curr_xyz);
//             if (dist < min_dist) { min_dist = dist; }
//             // next
//             prev_xyz = curr_xyz;
//         }
//     }
//     return min_dist;
// }
function _distancePstoE(__model__, from_posi_i, to_edges_i, map_posi_i_xyz) {
    const from_xyz = __model__.modeldata.attribs.posis.getPosiCoords(from_posi_i);
    let min_dist = Infinity;
    for (const edge_i of to_edges_i) {
        // get the posis
        const edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        const xyz_start = map_posi_i_xyz.get(edge_posis_i[0]);
        const xyz_end = map_posi_i_xyz.get(edge_posis_i[1]);
        // calc dist
        const dist = _distancePointToLine(from_xyz, xyz_start, xyz_end);
        if (dist < min_dist) {
            min_dist = dist;
        }
    }
    return min_dist;
}
function _distancePointToPoint(from, to) {
    const a = from[0] - to[0];
    const b = from[1] - to[1];
    const c = from[2] - to[2];
    return Math.sqrt(a * a + b * b + c * c);
}
function _distancePointToLine(from, start, end) {
    const vec_from = vecFromTo(start, from);
    const vec_line = vecFromTo(start, end);
    const len = vecLen(vec_line);
    const vec_line_norm = vecDiv(vec_line, len);
    const dot = vecDot(vec_from, vec_line_norm);
    if (dot <= 0) {
        return _distancePointToPoint(from, start);
    }
    else if (dot >= len) {
        return _distancePointToPoint(from, end);
    }
    const close = vecAdd(start, vecSetLen(vec_line, dot));
    return _distancePointToPoint(from, close);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvY2FsYy9EaXN0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsV0FBVyxFQUNYLFdBQVcsRUFDWCxRQUFRLEVBRVIsUUFBUSxFQUNSLFVBQVUsRUFJVixNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixTQUFTLEVBQ1QsTUFBTSxFQUNOLFNBQVMsR0FDWixNQUFNLCtCQUErQixDQUFDO0FBRXZDLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBSTNDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7OztHQVVHO0FBQ0gsTUFBTSxVQUFVLFFBQVEsQ0FBQyxTQUFrQixFQUFFLFNBQW9CLEVBQUUsU0FBb0IsRUFBRSxNQUF3QjtJQUM3RyxJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUFFLE9BQU8sRUFBRSxDQUFDO0tBQUU7SUFDekMsSUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3pDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUFFLFNBQVMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FBRTtJQUNyRSxTQUFTLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25DLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUM7SUFDaEMsSUFBSSxTQUFvQyxDQUFDO0lBQ3pDLElBQUksU0FBb0MsQ0FBQztJQUN6QyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFdBQVcs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