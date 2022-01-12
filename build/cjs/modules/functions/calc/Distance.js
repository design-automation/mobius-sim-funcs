"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Distance = void 0;
/**
 * The `calc` module has functions for performing various types of calculations with entities in the model.
 * These functions neither make nor modify anything in the model.
 * These functions all return either numbers or lists of numbers.
 * @module
 */
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const _enum_1 = require("./_enum");
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
function Distance(__model__, entities1, entities2, method) {
    if ((0, mobius_sim_1.isEmptyArr)(entities1)) {
        return [];
    }
    if ((0, mobius_sim_1.isEmptyArr)(entities2)) {
        return [];
    }
    if (Array.isArray(entities1)) {
        entities1 = (0, mobius_sim_1.arrMakeFlat)(entities1);
    }
    entities2 = (0, mobius_sim_1.arrMakeFlat)(entities2);
    // --- Error Check ---
    const fn_name = 'calc.Distance';
    let ents_arr1;
    let ents_arr2;
    if (__model__.debug) {
        ents_arr1 = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities1', entities1, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
        ents_arr2 = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities2', entities2, [_check_ids_1.ID.isIDL1], null);
    }
    else {
        ents_arr1 = (0, mobius_sim_1.idsBreak)(entities1);
        ents_arr2 = (0, mobius_sim_1.idsBreak)(entities2);
    }
    // --- Error Check ---
    // get the from posis
    let from_posis_i;
    if ((0, mobius_sim_1.arrMaxDepth)(ents_arr1) === 1 && ents_arr1[0] === mobius_sim_1.EEntType.POSI) {
        from_posis_i = ents_arr1[1];
    }
    else {
        from_posis_i = [];
        for (const [ent_type, ent_i] of ents_arr1) {
            if (ent_type === mobius_sim_1.EEntType.POSI) {
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
        case _enum_1._EDistanceMethod.PS_PS_DISTANCE:
            to_ent_type = mobius_sim_1.EEntType.POSI;
            break;
        case _enum_1._EDistanceMethod.PS_W_DISTANCE:
        case _enum_1._EDistanceMethod.PS_E_DISTANCE:
            to_ent_type = mobius_sim_1.EEntType.EDGE;
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
        if (to_ent_type !== mobius_sim_1.EEntType.POSI) {
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
    if (to_ent_type === mobius_sim_1.EEntType.POSI) {
        set_to_posis_i = set_to_ents_i;
    }
    for (const posi_i of set_to_posis_i) {
        const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        map_posi_i_xyz.set(posi_i, xyz);
    }
    // calc the distance
    switch (method) {
        case _enum_1._EDistanceMethod.PS_PS_DISTANCE:
            return _distanceManyPosisToPosis(__model__, from_posis_i, to_ents_i, map_posi_i_xyz, method);
        case _enum_1._EDistanceMethod.PS_W_DISTANCE:
        case _enum_1._EDistanceMethod.PS_E_DISTANCE:
            return _distanceManyPosisToEdges(__model__, from_posis_i, to_ents_i, map_posi_i_xyz, method);
        default:
            break;
    }
}
exports.Distance = Distance;
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
        const edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.EDGE, edge_i);
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
    const vec_from = (0, mobius_sim_1.vecFromTo)(start, from);
    const vec_line = (0, mobius_sim_1.vecFromTo)(start, end);
    const len = (0, mobius_sim_1.vecLen)(vec_line);
    const vec_line_norm = (0, mobius_sim_1.vecDiv)(vec_line, len);
    const dot = (0, mobius_sim_1.vecDot)(vec_from, vec_line_norm);
    if (dot <= 0) {
        return _distancePointToPoint(from, start);
    }
    else if (dot >= len) {
        return _distancePointToPoint(from, end);
    }
    const close = (0, mobius_sim_1.vecAdd)(start, (0, mobius_sim_1.vecSetLen)(vec_line, dot));
    return _distancePointToPoint(from, close);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvY2FsYy9EaXN0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7R0FLRztBQUNILDhEQWdCdUM7QUFFdkMsb0RBQW1EO0FBQ25ELG1DQUEyQztBQUkzQyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7R0FVRztBQUNILFNBQWdCLFFBQVEsQ0FBQyxTQUFrQixFQUFFLFNBQW9CLEVBQUUsU0FBb0IsRUFBRSxNQUF3QjtJQUM3RyxJQUFJLElBQUEsdUJBQVUsRUFBQyxTQUFTLENBQUMsRUFBRTtRQUFFLE9BQU8sRUFBRSxDQUFDO0tBQUU7SUFDekMsSUFBSSxJQUFBLHVCQUFVLEVBQUMsU0FBUyxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3pDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUFFLFNBQVMsR0FBRyxJQUFBLHdCQUFXLEVBQUMsU0FBUyxDQUFDLENBQUM7S0FBRTtJQUNyRSxTQUFTLEdBQUcsSUFBQSx3QkFBVyxFQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25DLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUM7SUFDaEMsSUFBSSxTQUFvQyxDQUFDO0lBQ3pDLElBQUksU0FBb0MsQ0FBQztJQUN6QyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsU0FBUyxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxlQUFFLENBQUMsSUFBSSxFQUFFLGVBQUUsQ0FBQyxNQUFNLENBQUMsRUFDakYsSUFBSSxDQUErQixDQUFDO1FBQ3hDLFNBQVMsR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLENB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R0FBVyxJQUFBLG1CQUFNLEVBQUMsUUFBUSxDQUFDLENBQUM7SUFDckMsTUFBTSxhQUFhLEdBQUcsSUFBQSxtQkFBTSxFQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM1QyxNQUFNLEdBQUcsR0FBVyxJQUFBLG1CQUFNLEVBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3BELElBQUksR0FBRyxJQUFJLENBQUMsRUFBRTtRQUNWLE9BQVEscUJBQXFCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzlDO1NBQU0sSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFO1FBQ25CLE9BQVEscUJBQXFCLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQzVDO0lBQ0QsTUFBTSxLQUFLLEdBQVMsSUFBQSxtQkFBTSxFQUFDLEtBQUssRUFBRSxJQUFBLHNCQUFTLEVBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDNUQsT0FBTyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDOUMsQ0FBQyJ9