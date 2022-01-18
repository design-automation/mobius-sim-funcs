"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Edge = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const _enum_1 = require("./_enum");
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
function Edge(__model__, entities, edge_query_enum) {
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    // --- Error Check ---
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, 'query.Edge', 'entities', entities, [_check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.EDGE]);
        }
    }
    else {
        if (entities !== null && entities !== undefined) {
            ents_arr = (0, mobius_sim_1.idsBreak)(entities);
        }
    }
    // --- Error Check ---
    let edges_i = ents_arr.map(ent => ent[1]);
    switch (edge_query_enum) {
        case _enum_1._EEdgeMethod.PREV:
            edges_i = _getPrevEdge(__model__, edges_i);
            break;
        case _enum_1._EEdgeMethod.NEXT:
            edges_i = _getNextEdge(__model__, edges_i);
            break;
        case _enum_1._EEdgeMethod.PREV_NEXT:
            edges_i = _getPrevNextEdge(__model__, edges_i);
            break;
        case _enum_1._EEdgeMethod.TOUCH:
            edges_i = _getTouchEdge(__model__, edges_i);
            break;
        default:
            break;
    }
    return (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.EDGE, edges_i);
}
exports.Edge = Edge;
function _getPrevEdge(__model__, edges_i) {
    if (!Array.isArray(edges_i)) {
        const edge_i = edges_i;
        return __model__.modeldata.geom.query.getPrevEdge(edge_i); // can be null
    }
    else {
        return edges_i.map(edge_i => _getPrevEdge(__model__, edge_i));
    }
}
function _getNextEdge(__model__, edges_i) {
    if (!Array.isArray(edges_i)) {
        const edge_i = edges_i;
        return __model__.modeldata.geom.query.getNextEdge(edge_i); // can be null
    }
    else {
        return edges_i.map(edge_i => _getNextEdge(__model__, edge_i));
    }
}
function _getPrevNextEdge(__model__, edges_i) {
    if (!Array.isArray(edges_i)) {
        const edge_i = edges_i;
        const prev_edge_i = __model__.modeldata.geom.query.getPrevEdge(edge_i); // can be null
        const next_edge_i = __model__.modeldata.geom.query.getNextEdge(edge_i); // can be null
        return [prev_edge_i, next_edge_i];
    }
    else {
        return edges_i.map(edge_i => _getPrevNextEdge(__model__, edge_i));
    }
}
function _getTouchEdge(__model__, edges_i) {
    if (!Array.isArray(edges_i)) {
        const edge_i = edges_i;
        const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.EDGE, edge_i);
        if (posis_i.length < 2) {
            return [];
        }
        const edges0_i = __model__.modeldata.geom.nav.navAnyToEdge(mobius_sim_1.EEntType.POSI, posis_i[0]);
        if (edges0_i.length < 2) {
            return [];
        }
        const edges1_i = __model__.modeldata.geom.nav.navAnyToEdge(mobius_sim_1.EEntType.POSI, posis_i[1]);
        if (edges1_i.length < 2) {
            return [];
        }
        const touch_edges_i = [];
        for (const edge0_i of edges0_i) {
            if (edge0_i === edge_i) {
                continue;
            }
            for (const edge1_i of edges1_i) {
                if (edge0_i === edge1_i) {
                    touch_edges_i.push(edge0_i);
                }
            }
        }
        return touch_edges_i;
    }
    else {
        return edges_i.map(edge_i => _getTouchEdge(__model__, edge_i));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRWRnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9xdWVyeS9FZGdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhEQVN1QztBQUV2QyxvREFBbUQ7QUFDbkQsbUNBQXVDO0FBR3ZDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7OztFQVVFO0FBQ0YsU0FBZ0IsSUFBSSxDQUFDLFNBQWtCLEVBQUUsUUFBcUIsRUFBRSxlQUE2QjtJQUN6RixJQUFJLElBQUEsdUJBQVUsRUFBQyxRQUFRLENBQUMsRUFBRTtRQUFFLE9BQU8sRUFBRSxDQUFDO0tBQUU7SUFDeEMsUUFBUSxHQUFHLElBQUEsd0JBQVcsRUFBQyxRQUFRLENBQVUsQ0FBQztJQUMxQyxzQkFBc0I7SUFDdEIsSUFBSSxRQUFRLEdBQWtCLElBQUksQ0FBQztJQUNuQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsSUFBSSxRQUFRLEtBQUssSUFBSSxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDN0MsUUFBUSxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxxQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFrQixDQUFDO1NBQ3JIO0tBQ0o7U0FBTTtRQUNILElBQUksUUFBUSxLQUFLLElBQUksSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQzdDLFFBQVEsR0FBRyxJQUFBLHFCQUFRLEVBQUMsUUFBUSxDQUFrQixDQUFDO1NBQ2xEO0tBQ0o7SUFDRCxzQkFBc0I7SUFDdEIsSUFBSSxPQUFPLEdBQW1DLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRSxRQUFRLGVBQWUsRUFBRTtRQUNyQixLQUFLLG9C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