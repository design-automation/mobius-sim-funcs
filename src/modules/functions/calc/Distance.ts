import {
    arrMakeFlat,
    arrMaxDepth,
    EEntType,
    GIModel,
    idsBreak,
    isEmptyArr,
    TEntTypeIdx,
    TId,
    Txyz,
    vecAdd,
    vecDiv,
    vecDot,
    vecFromTo,
    vecLen,
    vecSetLen,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';
import { _EDistanceMethod } from './_enum';



// ================================================================================================
/**
 * Calculates the minimum distance from one position to other entities in the model.
 *
 * @param __model__
 * @param entities1 Position to calculate distance from.
 * @param entities2 List of entities to calculate distance to.
 * @param method Enum, distance method: `'ps_to_ps_distance', 'ps_to_e_distance'` or `'ps_to_w_distance'`.
 * @returns Distance, or list of distances (if position2 is a list).
 * @example `distance1 = calc.Distance(position1, position2, p_to_p_distance)`
 * @example_info `position1 = [0,0,0]`, `position2 = [[0,0,10],[0,0,20]]`, Expected value of distance is `10`.
 */
export function Distance(__model__: GIModel, entities1: TId|TId[], entities2: TId|TId[], method: _EDistanceMethod): number|number[] {
    if (isEmptyArr(entities1)) { return []; }
    if (isEmptyArr(entities2)) { return []; }
    if (Array.isArray(entities1)) { entities1 = arrMakeFlat(entities1); }
    entities2 = arrMakeFlat(entities2);
    // --- Error Check ---
    const fn_name = 'calc.Distance';
    let ents_arr1: TEntTypeIdx|TEntTypeIdx[];
    let ents_arr2: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr1 = checkIDs(__model__, fn_name, 'entities1', entities1, [ID.isID, ID.isIDL1],
            null)  as TEntTypeIdx|TEntTypeIdx[];
        ents_arr2 = checkIDs(__model__, fn_name, 'entities2', entities2, [ID.isIDL1],
            null) as TEntTypeIdx[];
    } else {
        ents_arr1 = idsBreak(entities1)  as TEntTypeIdx|TEntTypeIdx[];
        ents_arr2 = idsBreak(entities2) as TEntTypeIdx[];
    }
    // --- Error Check ---
    // get the from posis
    let from_posis_i: number|number[];
    if (arrMaxDepth(ents_arr1) === 1 && ents_arr1[0] === EEntType.POSI) {
        from_posis_i = ents_arr1[1];
    } else {
        from_posis_i = [];
        for (const [ent_type, ent_i] of ents_arr1 as TEntTypeIdx[]) {
            if (ent_type === EEntType.POSI) {
                from_posis_i.push(ent_i);
            } else {
                const ent_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
                for (const ent_posi_i of ent_posis_i) {
                    from_posis_i.push(ent_posi_i);
                }
            }
        }
    }
    // get the to ent_type
    let to_ent_type: number;
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
    const set_to_ents_i: Set<number> = new Set();
    let set_to_posis_i: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arr2 as TEntTypeIdx[]) {
        // ents
        if (ent_type === to_ent_type) {
            set_to_ents_i.add(ent_i);
        } else {
            const sub_ents_i: number[] = __model__.modeldata.geom.nav.navAnyToAny(ent_type, to_ent_type, ent_i);
            for (const sub_ent_i of sub_ents_i) {
                set_to_ents_i.add(sub_ent_i);
            }
        }
        // posis
        if (to_ent_type !== EEntType.POSI) {
            const sub_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
            for (const sub_posi_i of sub_posis_i) {
                set_to_posis_i.add(sub_posi_i);
            }
        }
    }
    // create an array of to_ents
    const to_ents_i: number[] = Array.from(set_to_ents_i);
    // cerate a posis xyz map
    const map_posi_i_xyz: Map<number, Txyz> = new Map();
    if (to_ent_type === EEntType.POSI) { set_to_posis_i = set_to_ents_i; }
    for (const posi_i of set_to_posis_i) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
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
function _distanceManyPosisToPosis(__model__: GIModel, from_posi_i: number|number[], to_ents_i: number[],
    map_posi_i_xyz: Map<number, Txyz>, method: _EDistanceMethod): number|number[] {
    if (!Array.isArray(from_posi_i)) {
        from_posi_i = from_posi_i as number;
        return _distancePstoPs(__model__, from_posi_i, to_ents_i, map_posi_i_xyz) as number;
    } else  {
        from_posi_i = from_posi_i as number[];
        // TODO This can be optimised
        // From posis may have duplicates, only calc once
        return from_posi_i.map( one_from => _distanceManyPosisToPosis(__model__, one_from, to_ents_i,
            map_posi_i_xyz, method) ) as number[];
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
function _distanceManyPosisToEdges(__model__: GIModel, from_posi_i: number|number[], to_ents_i: number[],
        map_posi_i_xyz: Map<number, Txyz>, method: _EDistanceMethod): number|number[] {
    if (!Array.isArray(from_posi_i)) {
        from_posi_i = from_posi_i as number;
        return _distancePstoE(__model__, from_posi_i, to_ents_i, map_posi_i_xyz) as number;
    } else  {
        from_posi_i = from_posi_i as number[];
        // TODO This can be optimised
        // From posis may have duplicates, only calc once
        // Adjacent edges could be calculated once only
        return from_posi_i.map( one_from => _distanceManyPosisToEdges(__model__, one_from, to_ents_i,
            map_posi_i_xyz, method) ) as number[];
    }
}
function _distancePstoPs(__model__: GIModel, from_posi_i: number, to_posis_i: number[],
        map_posi_i_xyz: Map<number, Txyz>): number {
    const from_xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(from_posi_i);
    let min_dist = Infinity;
    // loop, measure dist
    for (const to_posi_i of to_posis_i) {
        // get xyz
        const to_xyz: Txyz = map_posi_i_xyz.get(to_posi_i);
        // calc dist
        const dist: number = _distancePointToPoint(from_xyz, to_xyz);
        if (dist < min_dist) { min_dist = dist; }
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
function _distancePstoE(__model__: GIModel, from_posi_i: number, to_edges_i: number[],
        map_posi_i_xyz: Map<number, Txyz>): number {
    const from_xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(from_posi_i);
    let min_dist = Infinity;
    for (const edge_i of to_edges_i) {
        // get the posis
        const edge_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        const xyz_start: Txyz = map_posi_i_xyz.get(edge_posis_i[0]);
        const xyz_end: Txyz = map_posi_i_xyz.get(edge_posis_i[1]);
        // calc dist
        const dist: number = _distancePointToLine(from_xyz, xyz_start, xyz_end);
        if (dist < min_dist) { min_dist = dist; }
    }
    return min_dist;
}
function _distancePointToPoint(from: Txyz, to: Txyz) {
    const a: number = from[0] - to[0];
    const b: number = from[1] - to[1];
    const c: number = from[2] - to[2];
    return Math.sqrt(a * a + b * b + c * c);
}
function _distancePointToLine(from: Txyz, start: Txyz, end: Txyz) {
    const vec_from: Txyz = vecFromTo(start, from);
    const vec_line: Txyz = vecFromTo(start, end);
    const len: number = vecLen(vec_line);
    const vec_line_norm = vecDiv(vec_line, len);
    const dot: number = vecDot(vec_from, vec_line_norm);
    if (dot <= 0) {
        return  _distancePointToPoint(from, start);
    } else if (dot >= len) {
        return  _distancePointToPoint(from, end);
    }
    const close: Txyz = vecAdd(start, vecSetLen(vec_line, dot));
    return _distancePointToPoint(from, close);
}
