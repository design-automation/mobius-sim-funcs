import {
    EEntType,
    EFilterOperatorTypes,
    getArrDepth,
    GIModel,
    idsBreak,
    idsMake,
    isEmptyArr,
    TAttribDataTypes,
    TEntTypeIdx,
    TId,
} from '@design-automation/mobius-sim';

import { checkAttribNameIdxKey, checkAttribValue, splitAttribNameIdxKey } from '../../../_check_attribs';
import { checkIDs, ID } from '../../../_check_ids';
import { _EFilterOperator } from './_enum';


// ================================================================================================
/**
 * Filter a list of entities based on an attribute value. \n The result will always be a list of
 * entities, even if there is only one entity. In a case where you want only one entity, remember to
 * get the first item in the list. \n
 * @param __model__
 * @param entities List of entities to filter. The entities must all be of the same type.
 * @param attrib The attribute to use for filtering. Can be `name`, `[name, index]`, or `[name,
 * key]`.
 * @param operator_enum Enum, the operator to use for filtering.
 * @param value The attribute value to use for filtering. If the attribute value of a given entity
 * is equal to this, it will be included in the result.
 * @returns Entities, a list of entities that match the conditions specified in 'expr'.
 */
export function Filter(__model__: GIModel,
        entities: TId|TId[],
        attrib: string|[string, number|string],
        operator_enum: _EFilterOperator, value: TAttribDataTypes): TId[]|TId[][] {
    if (entities === null) { return []; }
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'query.Filter';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] = null;
    let attrib_name: string, attrib_idx_key: number|string;
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1, ID.isIDL2], null, false) as TEntTypeIdx|TEntTypeIdx[];
        }
        [attrib_name, attrib_idx_key] = checkAttribNameIdxKey(fn_name, attrib);
        checkAttribValue(fn_name, value);
    } else {
        if (entities !== null && entities !== undefined) {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        [attrib_name, attrib_idx_key] = splitAttribNameIdxKey(fn_name, attrib);
    }
    // --- Error Check ---
    // make sure that the ents_arr is at least depth 2
    const depth: number = getArrDepth(ents_arr);
    if (depth === 1) { ents_arr = [ents_arr] as TEntTypeIdx[]; }
    ents_arr = ents_arr as TEntTypeIdx[]|TEntTypeIdx[][];
    // get the oeprator
    const op_type: EFilterOperatorTypes = _filterOperator(operator_enum);
    // do the query
    const found_ents_arr: TEntTypeIdx[]|TEntTypeIdx[][] = _filter(__model__, ents_arr, attrib_name, attrib_idx_key, op_type, value);
    // return the result
    return idsMake(found_ents_arr) as TId[]|TId[][];
}
function _filterOperator(select: _EFilterOperator): EFilterOperatorTypes {
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
function _filter(__model__: GIModel, ents_arr: TEntTypeIdx[]|TEntTypeIdx[][],
        name: string, idx_or_key: number|string, op_type: EFilterOperatorTypes, value: TAttribDataTypes): TEntTypeIdx[]|TEntTypeIdx[][] {
    if (ents_arr.length === 0) { return []; }
    // do the filter
    const depth: number = getArrDepth(ents_arr);
    if (depth === 2) {
        ents_arr = ents_arr as TEntTypeIdx[];
        const ent_type: EEntType = ents_arr[0][0];
        // get the list of entities
        // const found_ents_i: number[] = [];
        // for (const ent_arr of ents_arr) {
        //     found_ents_i.push(...__model__.modeldata.geom.nav.navAnyToAny(ent_arr[0], ent_type, ent_arr[1]));
        // }
        const ents_i: number[] = [];
        for (const ent_arr of ents_arr) {
            if (ent_arr[0] !== ent_type) {
                throw new Error('Error filtering list of entities: The entities must all be of the same type.');
            }
            ents_i.push(ent_arr[1]);
        }
        // filter the entities
        const query_result: number[] =
            __model__.modeldata.attribs.query.filterByAttribs(ent_type, ents_i, name, idx_or_key, op_type, value);
        if (query_result.length === 0) { return []; }
        return query_result.map( entity_i => [ent_type, entity_i]) as TEntTypeIdx[];
    } else { // depth === 3
        // TODO Why do we want this option?
        // TODO I cannot see any reason to return anything buy a flat list
        ents_arr = ents_arr as TEntTypeIdx[][];
        return ents_arr.map(ents_arr_item => _filter(__model__, ents_arr_item, name, idx_or_key, op_type, value)) as TEntTypeIdx[][];
    }
}
