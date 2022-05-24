import {
    arrMakeFlat,
    EEntType,
    GIModel,
    idsBreak,
    idsMakeFromIdxs,
    isEmptyArr,
    TEntTypeIdx,
    TId,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';
import { _EEdgeMethod } from './_enum';


// ================================================================================================
/**
* Given an edge, returns other edges.
* - If "previous" is selected, it returns the previous edge in the wire or null if there is no previous edge.
* - If "next" is selected, it returns the next edge in the wire or null if there is no next edge.
* - If "both" is selected, it returns a list of two edges, [previous, next]. Either can be null.
* - If "touching" is selected, it returns a list of edges from other wires that share the same start and end positions (in any order).
* @param __model__
* @param entities An edge or list of edges.
* @param edge_query_enum Enum, select the types of edges to return.
* @returns Entities, an edge or list of edges
*/
export function Edge(__model__: GIModel, entities: TId | TId[], edge_query_enum: _EEdgeMethod): TId | TId[] {
    if (isEmptyArr(entities)) { return []; }
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    let ents_arr: TEntTypeIdx[] = null;
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = checkIDs(__model__, 'query.Edge', 'entities', entities, [ID.isIDL1], [EEntType.EDGE]) as TEntTypeIdx[];
        }
    } else {
        if (entities !== null && entities !== undefined) {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
    }
    // --- Error Check ---
    let edges_i: number | number[] | number[][] = ents_arr.map(ent => ent[1]);
    switch (edge_query_enum) {
        case _EEdgeMethod.PREV:
            edges_i = _getPrevEdge(__model__, edges_i);
            break;
        case _EEdgeMethod.NEXT:
            edges_i = _getNextEdge(__model__, edges_i);
            break;
        case _EEdgeMethod.PREV_NEXT:
            edges_i = _getPrevNextEdge(__model__, edges_i);
            break;
        case _EEdgeMethod.TOUCH:
            edges_i = _getTouchEdge(__model__, edges_i);
            break;
        default:
            break;
    }
    return idsMakeFromIdxs(EEntType.EDGE, edges_i) as TId[];
}
function _getPrevEdge(__model__: GIModel, edges_i: number | number[]): number | number[] {
    if (!Array.isArray(edges_i)) {
        const edge_i: number = edges_i as number;
        return __model__.modeldata.geom.query.getPrevEdge(edge_i) as number; // can be null
    } else {
        return edges_i.map(edge_i => _getPrevEdge(__model__, edge_i)) as number[];
    }
}
function _getNextEdge(__model__: GIModel, edges_i: number | number[]): number | number[] {
    if (!Array.isArray(edges_i)) {
        const edge_i: number = edges_i as number;
        return __model__.modeldata.geom.query.getNextEdge(edge_i) as number; // can be null
    } else {
        return edges_i.map(edge_i => _getNextEdge(__model__, edge_i)) as number[];
    }
}
function _getPrevNextEdge(__model__: GIModel, edges_i: number | number[]): number[] | number[][] {
    if (!Array.isArray(edges_i)) {
        const edge_i: number = edges_i as number;
        const prev_edge_i: number = __model__.modeldata.geom.query.getPrevEdge(edge_i) as number; // can be null
        const next_edge_i: number = __model__.modeldata.geom.query.getNextEdge(edge_i) as number; // can be null
        return [prev_edge_i, next_edge_i];
    } else {
        return edges_i.map(edge_i => _getPrevNextEdge(__model__, edge_i)) as number[][];
    }
}
function _getTouchEdge(__model__: GIModel, edges_i: number | number[]): number[] | number[][] {
    if (!Array.isArray(edges_i)) {
        const edge_i: number = edges_i as number;
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        if (posis_i.length < 2) { return [] }
        const edges0_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(EEntType.POSI, posis_i[0]);
        if (edges0_i.length < 2) { return [] }
        const edges1_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(EEntType.POSI, posis_i[1]);
        if (edges1_i.length < 2) { return [] }
        const touch_edges_i: number[] = [];
        for (const edge0_i of edges0_i) {
            if (edge0_i === edge_i) { continue; }
            for (const edge1_i of edges1_i) {
                if (edge0_i === edge1_i) {
                    touch_edges_i.push(edge0_i);
                }
            }
        }
        return touch_edges_i;
    } else {
        return edges_i.map(edge_i => _getTouchEdge(__model__, edge_i)) as number[][];
    }
}
