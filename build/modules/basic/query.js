/**
 * The `query` module has functions for querying entities in the the model.
 * Most of these functions all return a list of IDs of entities in the model.
 * @module
 */
import { checkIDs, ID } from '../../_check_ids';
import { checkAttribNameIdxKey, checkAttribValue, splitAttribNameIdxKey } from '../../_check_attribs';
import { EEntType, ESort, EFilterOperatorTypes, idsMake, idsBreak, idsMakeFromIdxs, isEmptyArr, getArrDepth, arrMakeFlat } from '@design-automation/mobius-sim';
// ================================================================================================
export var _EEntType;
(function (_EEntType) {
    _EEntType["POSI"] = "ps";
    _EEntType["VERT"] = "_v";
    _EEntType["EDGE"] = "_e";
    _EEntType["WIRE"] = "_w";
    _EEntType["POINT"] = "pt";
    _EEntType["PLINE"] = "pl";
    _EEntType["PGON"] = "pg";
    _EEntType["COLL"] = "co";
})(_EEntType || (_EEntType = {}));
export var _EEntTypeAndMod;
(function (_EEntTypeAndMod) {
    _EEntTypeAndMod["POSI"] = "ps";
    _EEntTypeAndMod["VERT"] = "_v";
    _EEntTypeAndMod["EDGE"] = "_e";
    _EEntTypeAndMod["WIRE"] = "_w";
    _EEntTypeAndMod["POINT"] = "pt";
    _EEntTypeAndMod["PLINE"] = "pl";
    _EEntTypeAndMod["PGON"] = "pg";
    _EEntTypeAndMod["COLL"] = "co";
    _EEntTypeAndMod["MOD"] = "mo";
})(_EEntTypeAndMod || (_EEntTypeAndMod = {}));
function _getEntTypeFromStr(ent_type_str) {
    switch (ent_type_str) {
        case _EEntTypeAndMod.POSI:
            return EEntType.POSI;
        case _EEntTypeAndMod.VERT:
            return EEntType.VERT;
        case _EEntTypeAndMod.EDGE:
            return EEntType.EDGE;
        case _EEntTypeAndMod.WIRE:
            return EEntType.WIRE;
        case _EEntTypeAndMod.POINT:
            return EEntType.POINT;
        case _EEntTypeAndMod.PLINE:
            return EEntType.PLINE;
        case _EEntTypeAndMod.PGON:
            return EEntType.PGON;
        case _EEntTypeAndMod.COLL:
            return EEntType.COLL;
        case _EEntTypeAndMod.MOD:
            return EEntType.MOD;
        default:
            break;
    }
}
// ================================================================================================
export var _EDataType;
(function (_EDataType) {
    _EDataType["NUMBER"] = "number";
    _EDataType["STRING"] = "string";
    _EDataType["BOOLEAN"] = "boolean";
    _EDataType["LIST"] = "list";
    _EDataType["DICT"] = "dict";
})(_EDataType || (_EDataType = {}));
// ================================================================================================
/**
 * Get entities from a list of entities.
 * For example, you can get the position entities from a list of polygon entities.
 * \n
 * The result will always be a list of entities, even if there is only one entity.
 * In a case where you want only one entity, remember to get the first item in the list.
 * \n
 * The resulting list of entities will not contain duplicate entities.
 * \n
 * @param __model__
 * @param ent_type_enum Enum, the type of entity to get.
 * @param entities Optional, list of entities to get entities from, or null to get all entities in the model.
 * @returns Entities, a list of entities.
 * @example positions = query.Get('positions', [polyline1, polyline2])
 * @example_info Returns a list of positions that are part of polyline1 and polyline2.
 */
export function Get(__model__, ent_type_enum, entities) {
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'query.Get';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isNull, ID.isID, ID.isIDL1, ID.isIDL2], null, false);
    }
    else {
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    // get the entity type // TODO deal with multiple ent types
    const ent_type = _getEntTypeFromStr(ent_type_enum);
    // if ents_arr is null, then get all entities in the model of type ent_type
    if (ents_arr === null) {
        // return the result
        return idsMake(_getAll(__model__, ent_type));
    }
    if (isEmptyArr(ents_arr)) {
        return [];
    }
    // make sure that the ents_arr is at least depth 2
    const depth = getArrDepth(ents_arr);
    if (depth === 1) {
        ents_arr = [ents_arr];
    }
    ents_arr = ents_arr;
    // get the entities
    const found_ents_arr = _getFrom(__model__, ent_type, ents_arr);
    // return the result
    return idsMake(found_ents_arr);
}
function _getAll(__model__, ent_type) {
    const ssid = __model__.modeldata.active_ssid;
    const ents_i = __model__.modeldata.geom.snapshot.getEnts(ssid, ent_type);
    return ents_i.map(ent_i => [ent_type, ent_i]);
}
function _getFrom(__model__, ent_type, ents_arr) {
    const ssid = __model__.modeldata.active_ssid;
    if (ents_arr.length === 0) {
        return [];
    }
    // do the query
    const depth = getArrDepth(ents_arr);
    if (depth === 2) {
        ents_arr = ents_arr;
        // get the list of entities that are found
        const found_ents_i_set = new Set();
        for (const ent_arr of ents_arr) {
            if (__model__.modeldata.geom.snapshot.hasEnt(ssid, ent_arr[0], ent_arr[1])) {
                // snapshot
                const ents_i = __model__.modeldata.geom.nav.navAnyToAny(ent_arr[0], ent_type, ent_arr[1]);
                if (ents_i) {
                    for (const ent_i of ents_i) {
                        if (ent_i !== undefined) {
                            found_ents_i_set.add(ent_i);
                        }
                    }
                }
            }
        }
        // return the found ents
        const found_ents_i = Array.from(found_ents_i_set);
        return found_ents_i.map(entity_i => [ent_type, entity_i]);
    }
    else { // depth === 3
        // TODO Why do we want this option?
        // TODO I cannot see any reason to return anything buy a flat list
        ents_arr = ents_arr;
        return ents_arr.map(ents_arr_item => _getFrom(__model__, ent_type, ents_arr_item));
    }
}
// ================================================================================================
/**
 * Filter a list of entities based on an attribute value.
 * \n
 * The result will always be a list of entities, even if there is only one entity.
 * In a case where you want only one entity, remember to get the first item in the list.
 * \n
 * @param __model__
 * @param entities List of entities to filter. The entities must all be of the same type
 * @param attrib The attribute to use for filtering. Can be `name`, `[name, index]`, or `[name, key]`.
 * @param operator_enum Enum, the operator to use for filtering
 * @param value The attribute value to use for filtering.
 * @returns Entities, a list of entities that match the conditions specified in 'expr'.
 */
export function Filter(__model__, entities, attrib, operator_enum, value) {
    if (entities === null) {
        return [];
    }
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'query.Filter';
    let ents_arr = null;
    let attrib_name, attrib_idx_key;
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1, ID.isIDL2], null, false);
        }
        [attrib_name, attrib_idx_key] = checkAttribNameIdxKey(fn_name, attrib);
        checkAttribValue(fn_name, value);
    }
    else {
        if (entities !== null && entities !== undefined) {
            ents_arr = idsBreak(entities);
        }
        [attrib_name, attrib_idx_key] = splitAttribNameIdxKey(fn_name, attrib);
    }
    // --- Error Check ---
    // make sure that the ents_arr is at least depth 2
    const depth = getArrDepth(ents_arr);
    if (depth === 1) {
        ents_arr = [ents_arr];
    }
    ents_arr = ents_arr;
    // get the oeprator
    const op_type = _filterOperator(operator_enum);
    // do the query
    const found_ents_arr = _filter(__model__, ents_arr, attrib_name, attrib_idx_key, op_type, value);
    // return the result
    return idsMake(found_ents_arr);
}
export var _EFilterOperator;
(function (_EFilterOperator) {
    _EFilterOperator["IS_EQUAL"] = "==";
    _EFilterOperator["IS_NOT_EQUAL"] = "!=";
    _EFilterOperator["IS_GREATER_OR_EQUAL"] = ">=";
    _EFilterOperator["IS_LESS_OR_EQUAL"] = "<=";
    _EFilterOperator["IS_GREATER"] = ">";
    _EFilterOperator["IS_LESS"] = "<";
    _EFilterOperator["EQUAL"] = "=";
})(_EFilterOperator || (_EFilterOperator = {}));
function _filterOperator(select) {
    switch (select) {
        case _EFilterOperator.IS_EQUAL:
            return EFilterOperatorTypes.IS_EQUAL;
        case _EFilterOperator.IS_NOT_EQUAL:
            return EFilterOperatorTypes.IS_NOT_EQUAL;
        case _EFilterOperator.IS_GREATER_OR_EQUAL:
            return EFilterOperatorTypes.IS_GREATER_OR_EQUAL;
        case _EFilterOperator.IS_LESS_OR_EQUAL:
            return EFilterOperatorTypes.IS_LESS_OR_EQUAL;
        case _EFilterOperator.IS_GREATER:
            return EFilterOperatorTypes.IS_GREATER;
        case _EFilterOperator.IS_LESS:
            return EFilterOperatorTypes.IS_LESS;
        default:
            throw new Error('Query operator type not recognised.');
    }
}
function _filter(__model__, ents_arr, name, idx_or_key, op_type, value) {
    if (ents_arr.length === 0) {
        return [];
    }
    // do the filter
    const depth = getArrDepth(ents_arr);
    if (depth === 2) {
        ents_arr = ents_arr;
        const ent_type = ents_arr[0][0];
        // get the list of entities
        // const found_ents_i: number[] = [];
        // for (const ent_arr of ents_arr) {
        //     found_ents_i.push(...__model__.modeldata.geom.nav.navAnyToAny(ent_arr[0], ent_type, ent_arr[1]));
        // }
        const ents_i = [];
        for (const ent_arr of ents_arr) {
            if (ent_arr[0] !== ent_type) {
                throw new Error('Error filtering list of entities: The entities must all be of the same type.');
            }
            ents_i.push(ent_arr[1]);
        }
        // filter the entities
        const query_result = __model__.modeldata.attribs.query.filterByAttribs(ent_type, ents_i, name, idx_or_key, op_type, value);
        if (query_result.length === 0) {
            return [];
        }
        return query_result.map(entity_i => [ent_type, entity_i]);
    }
    else { // depth === 3
        // TODO Why do we want this option?
        // TODO I cannot see any reason to return anything buy a flat list
        ents_arr = ents_arr;
        return ents_arr.map(ents_arr_item => _filter(__model__, ents_arr_item, name, idx_or_key, op_type, value));
    }
}
// ================================================================================================
/**
 * Returns a list of entities that are not part of the specified entities.
 * For example, you can get the position entities that are not part of a list of polygon entities.
 * \n
 * This function does the opposite of query.Get().
 * While query.Get() gets entities that are part of of the list of entities,
 * this function gets the entities that are not part of the list of entities.
 * \n
 * @param __model__
 * @param ent_type_enum Enum, specifies what type of entities will be returned.
 * @param entities List of entities to be excluded.
 * @returns Entities, a list of entities that match the type specified in 'ent_type_enum', and that are not in entities.
 * @example positions = query.Invert('positions', [polyline1, polyline2])
 * @example_info Returns a list of positions that are not part of polyline1 and polyline2.
 */
export function Invert(__model__, ent_type_enum, entities) {
    if (isEmptyArr(entities)) {
        return [];
    }
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = checkIDs(__model__, 'query.Invert', 'entities', entities, [ID.isIDL1], null, false);
        }
    }
    else {
        if (entities !== null && entities !== undefined) {
            ents_arr = idsBreak(entities);
        }
    }
    // --- Error Check ---
    const select_ent_types = _getEntTypeFromStr(ent_type_enum);
    const found_ents_arr = _invert(__model__, select_ent_types, ents_arr);
    return idsMake(found_ents_arr);
}
function _invert(__model__, select_ent_type, ents_arr) {
    const ssid = __model__.modeldata.active_ssid;
    // get the ents to exclude
    const excl_ents_i = ents_arr
        .filter(ent_arr => ent_arr[0] === select_ent_type).map(ent_arr => ent_arr[1]);
    // get the list of entities
    const found_entities_i = [];
    const ents_i = __model__.modeldata.geom.snapshot.getEnts(ssid, select_ent_type);
    for (const ent_i of ents_i) {
        if (excl_ents_i.indexOf(ent_i) === -1) {
            found_entities_i.push(ent_i);
        }
    }
    return found_entities_i.map(entity_i => [select_ent_type, entity_i]);
}
// ================================================================================================
export var _ESortMethod;
(function (_ESortMethod) {
    _ESortMethod["DESCENDING"] = "descending";
    _ESortMethod["ASCENDING"] = "ascending";
})(_ESortMethod || (_ESortMethod = {}));
/**
 * Sorts entities based on an attribute.
 * \n
 * If the attribute is a list, and index can also be specified as follows: #@name1[index].
 * \n
 * @param __model__
 * @param entities List of two or more entities to be sorted, all of the same entity type.
 * @param attrib Attribute name to use for sorting. Can be `name`, `[name, index]`, or `[name, key]`.
 * @param method_enum Enum, sort descending or ascending.
 * @returns Entities, a list of sorted entities.
 * @example sorted_list = query.Sort( [pos1, pos2, pos3], #@xyz[2], descending)
 * @example_info Returns a list of three positions, sorted according to the descending z value.
 */
export function Sort(__model__, entities, attrib, method_enum) {
    if (isEmptyArr(entities)) {
        return [];
    }
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = 'query.Sort';
    let ents_arr;
    let attrib_name, attrib_idx_key;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isIDL1], null);
        [attrib_name, attrib_idx_key] = checkAttribNameIdxKey(fn_name, attrib);
    }
    else {
        ents_arr = idsBreak(entities);
        [attrib_name, attrib_idx_key] = splitAttribNameIdxKey(fn_name, attrib);
    }
    // --- Error Check ---
    const sort_method = (method_enum === _ESortMethod.DESCENDING) ? ESort.DESCENDING : ESort.ASCENDING;
    const sorted_ents_arr = _sort(__model__, ents_arr, attrib_name, attrib_idx_key, sort_method);
    return idsMake(sorted_ents_arr);
}
function _sort(__model__, ents_arr, attrib_name, idx_or_key, method) {
    // get the list of ents_i
    const ent_type = ents_arr[0][0];
    const ents_i = ents_arr.filter(ent_arr => ent_arr[0] === ent_type).map(ent_arr => ent_arr[1]);
    // check if we are sorting by '_id'
    if (attrib_name === '_id') {
        const ents_arr_copy = ents_arr.slice();
        ents_arr_copy.sort(_compareID);
        if (method === ESort.DESCENDING) {
            ents_arr_copy.reverse();
        }
        return ents_arr_copy;
    }
    // do the sort on the list of entities
    const sort_result = __model__.modeldata.attribs.query.sortByAttribs(ent_type, ents_i, attrib_name, idx_or_key, method);
    return sort_result.map(entity_i => [ent_type, entity_i]);
}
function _compareID(id1, id2) {
    const [ent_type1, index1] = id1;
    const [ent_type2, index2] = id2;
    if (ent_type1 !== ent_type2) {
        return ent_type1 - ent_type2;
    }
    if (index1 !== index2) {
        return index1 - index2;
    }
    return 0;
}
// ================================================================================================
/**
* Returns a list of perimeter entities. In order to qualify as a perimeter entity,
* entities must be part of the set of input entities and must have naked edges.
* \n
* @param __model__
* @param ent_type Enum, select the type of perimeter entities to return
* @param entities List of entities.
* @returns Entities, a list of perimeter entities.
* @example query.Perimeter('edges', [polygon1,polygon2,polygon])
* @example_info Returns list of edges that are at the perimeter of polygon1, polygon2, or polygon3.
*/
export function Perimeter(__model__, ent_type, entities) {
    if (isEmptyArr(entities)) {
        return [];
    }
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = checkIDs(__model__, 'query.Perimeter', 'entities', entities, [ID.isIDL1], null);
        }
    }
    else {
        if (entities !== null && entities !== undefined) {
            ents_arr = idsBreak(entities);
        }
    }
    // --- Error Check ---
    const select_ent_type = _getEntTypeFromStr(ent_type);
    const found_ents_arr = _perimeter(__model__, select_ent_type, ents_arr);
    return idsMake(found_ents_arr);
}
export function _perimeter(__model__, select_ent_type, ents_arr) {
    // get an array of all edges
    const edges_i = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, index] = ent_arr;
        const edges_ent_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
        for (const edge_ent_i of edges_ent_i) {
            edges_i.push(edge_ent_i);
        }
    }
    // get the perimeter entities
    const all_perim_ents_i = __model__.modeldata.geom.query.perimeter(select_ent_type, edges_i);
    return all_perim_ents_i.map(perim_ent_i => [select_ent_type, perim_ent_i]);
}
// ================================================================================================
/**
* Returns a list of neighboring entities. In order to qualify as a neighbor,
* entities must not be part of the set of input entities, but must be welded to one or more entities in the input.
* \n
* @param __model__
* @param ent_type_enum Enum, select the types of neighbors to return
* @param entities List of entities.
* @returns Entities, a list of welded neighbors
* @example query.neighbor('edges', [polyline1,polyline2,polyline3])
* @example_info Returns list of edges that are welded to polyline1, polyline2, or polyline3.
*/
export function Neighbor(__model__, ent_type_enum, entities) {
    if (isEmptyArr(entities)) {
        return [];
    }
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = checkIDs(__model__, 'query.Neighbor', 'entities', entities, [ID.isIDL1], null);
        }
    }
    else {
        if (entities !== null && entities !== undefined) {
            ents_arr = idsBreak(entities);
        }
    }
    // --- Error Check ---
    const select_ent_type = _getEntTypeFromStr(ent_type_enum);
    const found_ents_arr = _neighbors(__model__, select_ent_type, ents_arr);
    return idsMake(found_ents_arr);
}
export function _neighbors(__model__, select_ent_type, ents_arr) {
    // get an array of all vertices
    const verts_i = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, index] = ent_arr;
        const verts_ent_i = __model__.modeldata.geom.nav.navAnyToVert(ent_type, index);
        for (const vert_ent_i of verts_ent_i) {
            verts_i.push(vert_ent_i);
        }
    }
    // get the neighbor entities
    const all_nbor_ents_i = __model__.modeldata.geom.query.neighbor(select_ent_type, verts_i);
    return all_nbor_ents_i.map(nbor_ent_i => [select_ent_type, nbor_ent_i]);
}
// ================================================================================================
export var _EEdgeMethod;
(function (_EEdgeMethod) {
    _EEdgeMethod["PREV"] = "previous";
    _EEdgeMethod["NEXT"] = "next";
    _EEdgeMethod["PREV_NEXT"] = "both";
    _EEdgeMethod["TOUCH"] = "touching";
})(_EEdgeMethod || (_EEdgeMethod = {}));
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
export function Edge(__model__, entities, edge_query_enum) {
    if (isEmptyArr(entities)) {
        return [];
    }
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = checkIDs(__model__, 'query.Edge', 'entities', entities, [ID.isIDL1], [EEntType.EDGE]);
        }
    }
    else {
        if (entities !== null && entities !== undefined) {
            ents_arr = idsBreak(entities);
        }
    }
    // --- Error Check ---
    let edges_i = ents_arr.map(ent => ent[1]);
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
    return idsMakeFromIdxs(EEntType.EDGE, edges_i);
}
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
        const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        if (posis_i.length < 2) {
            return [];
        }
        const edges0_i = __model__.modeldata.geom.nav.navAnyToEdge(EEntType.POSI, posis_i[0]);
        if (edges0_i.length < 2) {
            return [];
        }
        const edges1_i = __model__.modeldata.geom.nav.navAnyToEdge(EEntType.POSI, posis_i[1]);
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
// ================================================================================================
/**
 * Checks the type of an entity.
 * \n
 * - For is\_used\_posi, returns true if the entity is a posi, and it is used by at least one vertex.
 * - For is\_unused\_posi, it returns the opposite of is\_used\_posi.
 * - For is\_object, returns true if the entity is a point, a polyline, or a polygon.
 * - For is\_topology, returns true if the entity is a vertex, an edge, a wire, or a face.
 * - For is\_point\_topology, is\_polyline\_topology, and is\_polygon\_topology, returns true.
 * if the entity is a topological entity, and it is part of an object of the specified type.
 * - For is\_open, returns true if the entity is a wire or polyline and is open. For is\_closed, it returns the opposite of is\_open.
 * - For is\_hole, returns true if the entity is a wire, and it defines a hole in a face.
 * - For has\_holes, returns true if the entity is a face or polygon, and it has holes.
 * - For has\_no\_holes, it returns the opposite of has\_holes.
 *
 * @param __model__
 * @param entities An entity, or a list of entities.
 * @param type_query_enum Enum, select the conditions to test agains.
 * @returns Boolean or list of boolean in input sequence.
 * @example query.Type([polyline1, polyline2, polygon1], is\_polyline )
 * @example_info Returns a list [true, true, false] if polyline1 and polyline2 are polylines but polygon1 is not a polyline.
 */
export function Type(__model__, entities, type_query_enum) {
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'query.Type';
    let ents_arr = null;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null, false);
    }
    else {
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    return _type(__model__, ents_arr, type_query_enum);
}
export var _ETypeQueryEnum;
(function (_ETypeQueryEnum) {
    _ETypeQueryEnum["EXISTS"] = "exists";
    _ETypeQueryEnum["IS_POSI"] = "is_position";
    _ETypeQueryEnum["IS_USED_POSI"] = "is_used_posi";
    _ETypeQueryEnum["IS_UNUSED_POSI"] = "is_unused_posi";
    _ETypeQueryEnum["IS_VERT"] = "is_vertex";
    _ETypeQueryEnum["IS_EDGE"] = "is_edge";
    _ETypeQueryEnum["IS_WIRE"] = "is_wire";
    _ETypeQueryEnum["IS_POINT"] = "is_point";
    _ETypeQueryEnum["IS_PLINE"] = "is_polyline";
    _ETypeQueryEnum["IS_PGON"] = "is_polygon";
    _ETypeQueryEnum["IS_COLL"] = "is_collection";
    _ETypeQueryEnum["IS_OBJ"] = "is_object";
    _ETypeQueryEnum["IS_TOPO"] = "is_topology";
    _ETypeQueryEnum["IS_POINT_TOPO"] = "is_point_topology";
    _ETypeQueryEnum["IS_PLINE_TOPO"] = "is_polyline_topology";
    _ETypeQueryEnum["IS_PGON_TOPO"] = "is_polygon_topology";
    _ETypeQueryEnum["IS_OPEN"] = "is_open";
    _ETypeQueryEnum["IS_CLOSED"] = "is_closed";
    _ETypeQueryEnum["IS_HOLE"] = "is_hole";
    _ETypeQueryEnum["HAS_HOLES"] = "has_holes";
    _ETypeQueryEnum["HAS_NO_HOLES"] = "has_no_holes";
})(_ETypeQueryEnum || (_ETypeQueryEnum = {}));
function _exists(__model__, ent_arr) {
    const ssid = __model__.modeldata.active_ssid;
    const [ent_type, ent_i] = ent_arr;
    return __model__.modeldata.geom.snapshot.hasEnt(ssid, ent_type, ent_i);
}
function _isUsedPosi(__model__, ent_arr) {
    const ssid = __model__.modeldata.active_ssid;
    const [ent_type, ent_i] = ent_arr;
    if (ent_type !== EEntType.POSI) {
        return false;
    }
    return !this.modeldata.snapshot.isPosiUnused(ssid, ent_i);
    // const verts_i: number[] = __model__.modeldata.geom.nav.navPosiToVert(index);
    // if (verts_i === undefined) {
    //     return false;
    // }
    // return verts_i.length > 0;
}
function _isObj(__model__, ent_arr) {
    const [ent_type, _] = ent_arr;
    if (ent_type === EEntType.POINT || ent_type === EEntType.PLINE || ent_type === EEntType.PGON) {
        return true;
    }
    return false;
}
function _isTopo(__model__, ent_arr) {
    const [ent_type, _] = ent_arr;
    if (ent_type === EEntType.VERT || ent_type === EEntType.EDGE || ent_type === EEntType.WIRE) {
        return true;
    }
    return false;
}
function _isPointTopo(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type === EEntType.VERT) {
        const points_i = __model__.modeldata.geom.nav.navAnyToPoint(ent_type, ent_i);
        if (points_i !== undefined && points_i.length) {
            return true;
        }
    }
    return false;
}
function _isPlineTopo(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type === EEntType.VERT || ent_type === EEntType.EDGE || ent_type === EEntType.WIRE) {
        const plines_i = __model__.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
        if (plines_i !== undefined && plines_i.length) {
            return true;
        }
    }
    return false;
}
function _isPgonTopo(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type === EEntType.VERT || ent_type === EEntType.EDGE || ent_type === EEntType.WIRE) {
        const pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
        if (pgons_i !== undefined && pgons_i.length) {
            return true;
        }
    }
    return false;
}
function _isClosed2(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type === EEntType.PGON) {
        return true;
    }
    else if (ent_type !== EEntType.WIRE && ent_type !== EEntType.PLINE) {
        return false;
    }
    let wire_i = ent_i;
    if (ent_type === EEntType.PLINE) {
        wire_i = __model__.modeldata.geom.nav.navPlineToWire(ent_i);
    }
    return __model__.modeldata.geom.query.isWireClosed(wire_i);
}
function _isHole(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type !== EEntType.WIRE) {
        return false;
    }
    const pgon_i = __model__.modeldata.geom.nav.navWireToPgon(ent_i);
    if (pgon_i === undefined) {
        return false;
    }
    const wires_i = __model__.modeldata.geom.nav.navPgonToWire(pgon_i);
    return wires_i.indexOf(ent_i) > 0;
}
function _hasNoHoles(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type !== EEntType.PGON) {
        return false;
    }
    const wires_i = __model__.modeldata.geom.nav.navPgonToWire(ent_i);
    return wires_i.length === 1;
}
function _type(__model__, ents_arr, query_ent_type) {
    if (getArrDepth(ents_arr) === 1) {
        const ent_arr = ents_arr;
        const [ent_type, _] = ent_arr;
        switch (query_ent_type) {
            case _ETypeQueryEnum.EXISTS:
                return _exists(__model__, ent_arr);
            case _ETypeQueryEnum.IS_POSI:
                return ent_type === EEntType.POSI;
            case _ETypeQueryEnum.IS_USED_POSI:
                return _isUsedPosi(__model__, ent_arr);
            case _ETypeQueryEnum.IS_UNUSED_POSI:
                return !_isUsedPosi(__model__, ent_arr);
            case _ETypeQueryEnum.IS_VERT:
                return ent_type === EEntType.VERT;
            case _ETypeQueryEnum.IS_EDGE:
                return ent_type === EEntType.EDGE;
            case _ETypeQueryEnum.IS_WIRE:
                return ent_type === EEntType.WIRE;
            case _ETypeQueryEnum.IS_POINT:
                return ent_type === EEntType.POINT;
            case _ETypeQueryEnum.IS_PLINE:
                return ent_type === EEntType.PLINE;
            case _ETypeQueryEnum.IS_PGON:
                return ent_type === EEntType.PGON;
            case _ETypeQueryEnum.IS_COLL:
                return ent_type === EEntType.COLL;
            case _ETypeQueryEnum.IS_OBJ:
                return _isObj(__model__, ent_arr);
            case _ETypeQueryEnum.IS_TOPO:
                return _isTopo(__model__, ent_arr);
            case _ETypeQueryEnum.IS_POINT_TOPO:
                return _isPointTopo(__model__, ent_arr);
            case _ETypeQueryEnum.IS_PLINE_TOPO:
                return _isPlineTopo(__model__, ent_arr);
            case _ETypeQueryEnum.IS_PGON_TOPO:
                return _isPgonTopo(__model__, ent_arr);
            case _ETypeQueryEnum.IS_OPEN:
                return !_isClosed2(__model__, ent_arr);
            case _ETypeQueryEnum.IS_CLOSED:
                return _isClosed2(__model__, ent_arr);
            case _ETypeQueryEnum.IS_HOLE:
                return _isHole(__model__, ent_arr);
            case _ETypeQueryEnum.HAS_HOLES:
                return !_hasNoHoles(__model__, ent_arr);
            case _ETypeQueryEnum.HAS_NO_HOLES:
                return _hasNoHoles(__model__, ent_arr);
            default:
                break;
        }
    }
    else {
        return ents_arr.map(ent_arr => _type(__model__, ent_arr, query_ent_type));
    }
}
// TODO IS_PLANAR
// TODO IS_QUAD
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlcy9iYXNpYy9xdWVyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsZ0JBQWdCLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUV0RyxPQUFPLEVBQWdCLFFBQVEsRUFBRSxLQUFLLEVBQWUsb0JBQW9CLEVBQ3JFLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDcEgsbUdBQW1HO0FBQ25HLE1BQU0sQ0FBTixJQUFZLFNBU1g7QUFURCxXQUFZLFNBQVM7SUFDakIsd0JBQWEsQ0FBQTtJQUNiLHdCQUFhLENBQUE7SUFDYix3QkFBYSxDQUFBO0lBQ2Isd0JBQWEsQ0FBQTtJQUNiLHlCQUFhLENBQUE7SUFDYix5QkFBYSxDQUFBO0lBQ2Isd0JBQWEsQ0FBQTtJQUNiLHdCQUFhLENBQUE7QUFDakIsQ0FBQyxFQVRXLFNBQVMsS0FBVCxTQUFTLFFBU3BCO0FBQ0QsTUFBTSxDQUFOLElBQVksZUFVWDtBQVZELFdBQVksZUFBZTtJQUN2Qiw4QkFBYSxDQUFBO0lBQ2IsOEJBQWEsQ0FBQTtJQUNiLDhCQUFhLENBQUE7SUFDYiw4QkFBYSxDQUFBO0lBQ2IsK0JBQWEsQ0FBQTtJQUNiLCtCQUFhLENBQUE7SUFDYiw4QkFBYSxDQUFBO0lBQ2IsOEJBQWEsQ0FBQTtJQUNiLDZCQUFhLENBQUE7QUFDakIsQ0FBQyxFQVZXLGVBQWUsS0FBZixlQUFlLFFBVTFCO0FBQ0QsU0FBUyxrQkFBa0IsQ0FBQyxZQUF1QztJQUMvRCxRQUFRLFlBQVksRUFBRTtRQUNsQixLQUFLLGVBQWUsQ0FBQyxJQUFJO1lB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RSxLQUFLLENBQUMsR0FBZ0IsT0FBTyxDQUFDO0lBQy9DLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7UUFDNUIsTUFBTSxRQUFRLEdBQWEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkYsSUFBSSxRQUFRLEtBQUssU0FBUyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQztTQUFFO0tBQ2xFO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQztBQUNELFNBQVMsWUFBWSxDQUFDLFNBQWtCLEVBQUUsT0FBb0I7SUFDMUQsTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsR0FBZ0IsT0FBTyxDQUFDO0lBQy9DLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7UUFDeEYsTUFBTSxRQUFRLEdBQWEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkYsSUFBSSxRQUFRLEtBQUssU0FBUyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQztTQUFFO0tBQ2xFO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQztBQUNELFNBQVMsV0FBVyxDQUFDLFNBQWtCLEVBQUUsT0FBb0I7SUFDekQsTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsR0FBZ0IsT0FBTyxDQUFDO0lBQy9DLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7UUFDeEYsTUFBTSxPQUFPLEdBQWEsU0FBUyxDQUFDLFNB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