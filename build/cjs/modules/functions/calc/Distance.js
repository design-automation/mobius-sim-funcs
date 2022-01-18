"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Distance = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvY2FsYy9EaXN0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4REFnQnVDO0FBRXZDLG9EQUFtRDtBQUNuRCxtQ0FBMkM7QUFJM0MsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7O0dBVUc7QUFDSCxTQUFnQixRQUFRLENBQUMsU0FBa0IsRUFBRSxTQUFvQixFQUFFLFNBQW9CLEVBQUUsTUFBd0I7SUFDN0csSUFBSSxJQUFBLHVCQUFVLEVBQUMsU0FBUyxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3pDLElBQUksSUFBQSx1QkFBVSxFQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUN6QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFBRSxTQUFTLEdBQUcsSUFBQSx3QkFBVyxFQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQUU7SUFDckUsU0FBUyxHQUFHLElBQUEsd0JBQVcsRUFBQyxTQUFTLENBQUMsQ0FBQztJQUNuQyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDO0lBQ2hDLElBQUksU0FBb0MsQ0FBQztJQUN6QyxJQUFJLFNBQW9DLENBQUM7SUFDekMsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLFNBQVMsR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLENBQUMsZUFBRSxDQUFDLElBQUksRUFBRSxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQ2pGLElBQUksQ0FBK0IsQ0FBQztRQUN4QyxTQUFTLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxDQUFDLGVBQUUsQ0FBQyxNQUFNLENBQUMsRUFDeEUsSUFBSSxDQUFrQixDQUFDO0tBQzlCO1NBQU07UUFDSCxTQUFTLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsQ0FBK0IsQ0FBQztRQUM5RCxTQUFTLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsQ0FBa0IsQ0FBQztLQUNwRDtJQUNELHNCQUFzQjtJQUN0QixxQkFBcUI7SUFDckIsSUFBSSxZQUE2QixDQUFDO0lBQ2xDLElBQUksSUFBQSx3QkFBVyxFQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUsscUJBQVEsQ0FBQyxJQUFJLEVBQUU7UUFDaEUsWUFBWSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvQjtTQUFNO1FBQ0gsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUNsQixLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLElBQUksU0FBMEIsRUFBRTtZQUN4RCxJQUFJLFFBQVEsS0FBSyxxQkFBUSxDQUFDLElBQUksRUFBRTtnQkFDNUIsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUM1QjtpQkFBTTtnQkFDSCxNQUFNLFdBQVcsR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDekYsS0FBSyxNQUFNLFVBQVUsSUFBSSxXQUFXLEVBQUU7b0JBQ2xDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQ2pDO2FBQ0o7U0FDSjtLQUNKO0lBQ0Qsc0JBQXNCO0lBQ3RCLElBQUksV0FBbUIsQ0FBQztJQUN4QixRQUFRLE1BQU0sRUFBRTtRQUNaLEtBQUssd0JBQWdCLENBQUMsY0FBYztZQUNoQyxXQUFXLEdBQUcscUJBQVEsQ0FBQyxJQUFJLENBQUM7WUFDNUIsTUFBTTtRQUNWLEtBQUssd0JBQWdCLENBQUMsYUFBYSxDQUFDO1FBQ3BDLEtBQUssd0JBQWdCLENBQUMsYUFBYTtZQUMvQixXQUFXLEdBQUcscUJBQVEsQ0FBQyxJQUFJLENBQUM7WUFDNUIsTUFBTTtRQUNWO1lBQ0ksTUFBTTtLQUNiO0lBQ0QsOEJBQThCO0lBQzlCLE1BQU0sYUFBYSxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQzdDLElBQUksY0FBYyxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQzVDLEtBQUssTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxTQUEwQixFQUFFO1FBQ3hELE9BQU87UUFDUCxJQUFJLFFBQVEsS0FBSyxXQUFXLEVBQUU7WUFDMUIsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM1QjthQUFNO1lBQ0gsTUFBTSxVQUFVLEdBQWEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3BHLEtBQUssTUFBTSxTQUFTLElBQUksVUFBVSxFQUFFO2dCQUNoQyxhQUFhLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ2hDO1NBQ0o7UUFDRCxRQUFRO1FBQ1IsSUFBSSxXQUFXLEtBQUsscUJBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDL0IsTUFBTSxXQUFXLEdBQWEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDekYsS0FBSyxNQUFNLFVBQVUsSUFBSSxXQUFXLEVBQUU7Z0JBQ2xDLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDbEM7U0FDSjtLQUNKO0lBQ0QsNkJBQTZCO0lBQzdCLE1BQU0sU0FBUyxHQUFhLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdEQseUJBQXlCO0lBQ3pCLE1BQU0sY0FBYyxHQUFzQixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ3BELElBQUksV0FBVyxLQUFLLHFCQUFRLENBQUMsSUFBSSxFQUFFO1FBQUUsY0FBYyxHQUFHLGFBQWEsQ0FBQztLQUFFO0lBQ3RFLEtBQUssTUFBTSxNQUFNLElBQUksY0FBYyxFQUFFO1FBQ2pDLE1BQU0sR0FBRyxHQUFTLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUUsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDbkM7SUFDRCxvQkFBb0I7SUFDcEIsUUFBUSxNQUFNLEVBQUU7UUFDWixLQUFLLHdCQUFnQixDQUFDLGNBQWM7WUFDaEMsT0FBTyx5QkFBeUIsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDakcsS0FBSyx3QkFBZ0IsQ0FBQyxhQUFhLENBQUM7UUFDcEMsS0FBSyx3QkFBZ0IsQ0FBQyxhQUFhO1lBQy9CLE9BQU8seUJBQXlCLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pHO1lBQ0ksTUFBTTtLQUNiO0FBQ0wsQ0FBQztBQXpGRCw0QkF5RkM7QUFDRCxTQUFTLHlCQUF5QixDQUFDLFNBQWtCLEVBQUUsV0FBNEIsRUFBRSxTQUFtQixFQUNwRyxjQUFpQyxFQUFFLE1BQXdCO0lBQzNELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQzdCLFdBQVcsR0FBRyxXQUFxQixDQUFDO1FBQ3BDLE9BQU8sZUFBZSxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBVyxDQUFDO0tBQ3ZGO1NBQU87UUFDSixXQUFXLEdBQUcsV0FBdUIsQ0FBQztRQUN0Qyw2QkFBNkI7UUFDN0IsaURBQWlEO1FBQ2pELE9BQU8sV0FBVyxDQUFDLEdBQUcsQ0FBRSxRQUFRLENBQUMsRUFBRSxDQUFDLHlCQUF5QixDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUN4RixjQUFjLEVBQUUsTUFBTSxDQUFDLENBQWMsQ0FBQztLQUM3QztBQUNMLENBQUM7QUFDRCw0R0FBNEc7QUFDNUcsdURBQXVEO0FBQ3ZELHlDQUF5QztBQUN6QywrQ0FBK0M7QUFDL0MsOEVBQThFO0FBQzlFLGdCQUFnQjtBQUNoQixpREFBaUQ7QUFDakQsd0NBQXdDO0FBQ3hDLDJGQUEyRjtBQUMzRiwrSEFBK0g7QUFDL0gsUUFBUTtBQUNSLElBQUk7QUFDSixTQUFTLHlCQUF5QixDQUFDLFNBQWtCLEVBQUUsV0FBNEIsRUFBRSxTQUFtQixFQUNoRyxjQUFpQyxFQUFFLE1BQXdCO0lBQy9ELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQzdCLFdBQVcsR0FBRyxXQUFxQixDQUFDO1FBQ3BDLE9BQU8sY0FBYyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBVyxDQUFDO0tBQ3RGO1NBQU87UUFDSixXQUFXLEdBQUcsV0FBdUIsQ0FBQztRQUN0Qyw2QkFBNkI7UUFDN0IsaURBQWlEO1FBQ2pELCtDQUErQztRQUMvQyxPQUFPLFdBQVcsQ0FBQyxHQUFHLENBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFDeEYsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFjLENBQUM7S0FDN0M7QUFDTCxDQUFDO0FBQ0QsU0FBUyxlQUFlLENBQUMsU0FBa0IsRUFBRSxXQUFtQixFQUFFLFVBQW9CLEVBQzlFLGNBQWlDO0lBQ3JDLE1BQU0sUUFBUSxHQUFTLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDcEYsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQ3hCLHFCQUFxQjtJQUNyQixLQUFLLE1BQU0sU0FBUyxJQUFJLFVBQVUsRUFBRTtRQUNoQyxVQUFVO1FBQ1YsTUFBTSxNQUFNLEdBQVMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuRCxZQUFZO1FBQ1osTUFBTSxJQUFJLEdBQVcscUJBQXFCLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdELElBQUksSUFBSSxHQUFHLFFBQVEsRUFBRTtZQUFFLFFBQVEsR0FBRyxJQUFJLENBQUM7U0FBRTtLQUM1QztJQUNELE9BQU8sUUFBUSxDQUFDO0FBQ3BCLENBQUM7QUFDRCxtR0FBbUc7QUFDbkcsMkZBQTJGO0FBQzNGLCtCQUErQjtBQUMvQix5REFBeUQ7QUFDekQseUNBQXlDO0FBQ3pDLDJCQUEyQjtBQUMzQix5R0FBeUc7QUFDekcsOENBQThDO0FBQzlDLHVHQUF1RztBQUN2Ryw4REFBOEQ7QUFDOUQsK0ZBQStGO0FBQy9GLHFEQUFxRDtBQUNyRCxnQ0FBZ0M7QUFDaEMsd0RBQXdEO0FBQ3hELHlCQUF5QjtBQUN6Qix5REFBeUQ7QUFDekQsa0VBQWtFO0FBQ2xFLDRDQUE0QztBQUM1QywyRkFBMkY7QUFDM0YsMkRBQTJEO0FBQzNELGdCQUFnQjtBQUNoQiwyQkFBMkI7QUFDM0IsdUZBQXVGO0FBQ3ZGLHdEQUF3RDtBQUN4RCxzQkFBc0I7QUFDdEIsbUNBQW1DO0FBQ25DLFlBQVk7QUFDWixRQUFRO0FBQ1IsdUJBQXVCO0FBQ3ZCLElBQUk7QUFDSixTQUFTLGNBQWMsQ0FBQyxTQUFrQixFQUFFLFdBQW1CLEVBQUUsVUFBb0IsRUFDN0UsY0FBaUM7SUFDckMsTUFBTSxRQUFRLEdBQVMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNwRixJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDeEIsS0FBSyxNQUFNLE1BQU0sSUFBSSxVQUFVLEVBQUU7UUFDN0IsZ0JBQWdCO1FBQ2hCLE1BQU0sWUFBWSxHQUFhLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMscUJBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEcsTUFBTSxTQUFTLEdBQVMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RCxNQUFNLE9BQU8sR0FBUyxjQUFjLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFELFlBQVk7UUFDWixNQUFNLElBQUksR0FBVyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3hFLElBQUksSUFBSSxHQUFHLFFBQVEsRUFBRTtZQUFFLFFBQVEsR0FBRyxJQUFJLENBQUM7U0FBRTtLQUM1QztJQUNELE9BQU8sUUFBUSxDQUFDO0FBQ3BCLENBQUM7QUFDRCxTQUFTLHFCQUFxQixDQUFDLElBQVUsRUFBRSxFQUFRO0lBQy9DLE1BQU0sQ0FBQyxHQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsTUFBTSxDQUFDLEdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxNQUFNLENBQUMsR0FBVyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFDRCxTQUFTLG9CQUFvQixDQUFDLElBQVUsRUFBRSxLQUFXLEVBQUUsR0FBUztJQUM1RCxNQUFNLFFBQVEsR0FBUyxJQUFBLHNCQUFTLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlDLE1BQU0sUUFBUSxHQUFTLElBQUEsc0JBQVMsRUFBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDN0MsTUFBTSxHQUFHLEdBQVcsSUFBQSxtQkFBTSxFQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sYUFBYSxHQUFHLElBQUEsbUJBQU0sRUFBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDNUMsTUFBTSxHQUFHLEdBQVcsSUFBQSxtQkFBTSxFQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNwRCxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7UUFDVixPQUFRLHFCQUFxQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztLQUM5QztTQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRTtRQUNuQixPQUFRLHFCQUFxQixDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztLQUM1QztJQUNELE1BQU0sS0FBSyxHQUFTLElBQUEsbUJBQU0sRUFBQyxLQUFLLEVBQUUsSUFBQSxzQkFBUyxFQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVELE9BQU8scUJBQXFCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzlDLENBQUMifQ==