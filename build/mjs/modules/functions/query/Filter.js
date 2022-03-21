import { EFilterOperatorTypes, getArrDepth, idsBreak, idsMake, isEmptyArr, } from '@design-automation/mobius-sim';
import { checkAttribNameIdxKey, checkAttribValue, splitAttribNameIdxKey } from '../../../_check_attribs';
import { checkIDs, ID } from '../../../_check_ids';
import { _EFilterOperator } from './_enum';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL3F1ZXJ5L0ZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUgsb0JBQW9CLEVBQ3BCLFdBQVcsRUFFWCxRQUFRLEVBQ1IsT0FBTyxFQUNQLFVBQVUsR0FJYixNQUFNLCtCQUErQixDQUFDO0FBRXZDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3pHLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRzNDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLFVBQVUsTUFBTSxDQUFDLFNBQWtCLEVBQ2pDLFFBQW1CLEVBQ25CLE1BQXNDLEVBQ3RDLGFBQStCLEVBQUUsS0FBdUI7SUFDNUQsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUNyQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUFFLE9BQU8sRUFBRSxDQUFDO0tBQUU7SUFDeEMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQztJQUMvQixJQUFJLFFBQVEsR0FBOEMsSUFBSSxDQUFDO0lBQy9ELElBQUksV0FBbUIsRUFBRSxjQUE2QixDQUFDO0lBQ3ZELElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixJQUFJLFFBQVEsS0FBSyxJQUFJLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUM3QyxRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDeEQsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFF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