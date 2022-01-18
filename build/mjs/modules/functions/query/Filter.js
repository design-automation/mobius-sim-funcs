import { EFilterOperatorTypes, getArrDepth, idsBreak, idsMake, isEmptyArr, } from '@design-automation/mobius-sim';
import { checkAttribNameIdxKey, checkAttribValue, splitAttribNameIdxKey } from '../../../_check_attribs';
import { checkIDs, ID } from '../../../_check_ids';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL3F1ZXJ5L0ZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUgsb0JBQW9CLEVBQ3BCLFdBQVcsRUFFWCxRQUFRLEVBQ1IsT0FBTyxFQUNQLFVBQVUsR0FJYixNQUFNLCtCQUErQixDQUFDO0FBRXZDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3pHLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFHbkQsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILE1BQU0sVUFBVSxNQUFNLENBQUMsU0FBa0IsRUFDakMsUUFBbUIsRUFDbkIsTUFBc0MsRUFDdEMsYUFBK0IsRUFBRSxLQUF1QjtJQUM1RCxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3JDLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUN4QyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDO0lBQy9CLElBQUksUUFBUSxHQUE4QyxJQUFJLENBQUM7SUFDL0QsSUFBSSxXQUFtQixFQUFFLGNBQTZCLENBQUM7SUFDdkQsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLElBQUksUUFBUSxLQUFLLElBQUksSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQzdDLFFBQVEsR0FBRyxRQUFRLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUN4RCxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBOEIsQ0FBQztTQUNsRjtRQUNELENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxHQUFHLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2RSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDcEM7U0FBTTtRQUNILElBQUksUUFBUSxLQUFLLElBQUksSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQzdDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFrQixDQUFDO1NBQ2xEO1FBQ0QsQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLEdBQUcscUJBQXFCLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQzFFO0lBQ0Qsc0JBQXNCO0lBQ3RCLGtEQUFrRDtJQUNsRCxNQUFNLEtBQUssR0FBVyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO1FBQUUsUUFBUSxHQUFHLENBQUMsUUFBUSxDQUFrQixDQUFDO0tBQUU7SUFDNUQsUUFBUSxHQUFHLFFBQXlDLENBQUM7SUFDckQsbUJBQW1CO0lBQ25CLE1BQU0sT0FBTyxHQUF5QixlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDckUsZUFBZTtJQUNmLE1BQU0sY0FBYyxHQUFrQyxPQUFPLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoSSxvQkFBb0I7SUFDcEIsT0FBTyxPQUFPLENBQUMsY0FBYyxDQUFrQixDQUFDO0FBQ3BELENBQUM7QUFDRCxNQUFNLENBQU4sSUFBWSxnQkFRWDtBQVJELFdBQVksZ0JBQWdCO0lBQ3hCLG1DQUE0QixDQUFBO0lBQzVCLHVDQUE0QixDQUFBO0lBQzVCLDhDQUE0QixDQUFBO0lBQzVCLDJDQUE0QixDQUFBO0lBQzVCLG9DQUEyQixDQUFBO0lBQzNCLGlDQUEyQixDQUFBO0lBQzNCLCtCQUEyQixDQUFBO0FBQy9CLENBQUMsRUFSVyxnQkFBZ0IsS0FBaEIsZ0JBQWdCLFFBUTNCO0FBQ0QsU0FBUyxlQUFlLENBQUMsTUFBd0I7SUFDN0MsUUFBUSxNQUFNLEVBQUU7UUFDWixLQUFLLGdCQUFnQixDQUFDLFFBQVE7WUFDMUIsT0FBTyxvQkFBb0IsQ0FBQyxRQUFRLENBQUM7UUFDekMsS0FBSyxnQkFBZ0IsQ0FBQyxZQUFZO1lBQzlCLE9BQU8sb0JBQW9CLENBQUMsWUFBWSxDQUFDO1FBQzdDLEtBQUssZ0JBQWdCLENBQUMsbUJBQW1CO1lBQ3JDLE9BQU8sb0JBQW9CLENBQUMsbUJBQW1CLENBQUM7UUFDcEQsS0FBSyxnQkFBZ0IsQ0FBQyxnQkFBZ0I7WUFDbEMsT0FBTyxvQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBQztRQUNqRCxLQUFLLGdCQUFnQixDQUFDLFVBQVU7WUFDNUIsT0FBTyxvQkFBb0IsQ0FBQyxVQUFVLENBQUM7UUFDM0MsS0FBSyxnQkFBZ0IsQ0FBQyxPQUFPO1lBQ3pCLE9BQU8sb0JBQW9CLENBQUMsT0FBTyxDQUFDO1FBQ3hDO1lBQ0ksTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0tBQzlEO0FBQ0wsQ0FBQztBQUNELFNBQVMsT0FBTyxDQUFDLFNBQWtCLEVBQUUsUUFBdUMsRUFDcEUsSUFBWSxFQUFFLFVBQXlCLEVBQUUsT0FBNkIsRUFBRSxLQUF1QjtJQUNuRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUN6QyxnQkFBZ0I7SUFDaEIsTUFBTSxLQUFLLEdBQVcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtRQUNiLFFBQVEsR0FBRyxRQUF5QixDQUFDO1FBQ3JDLE1BQU0sUUFBUSxHQUFhLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQywyQkFBMkI7UUFDM0IscUNBQXFDO1FBQ3JDLG9DQUFvQztRQUNwQyx3R0FBd0c7UUFDeEcsSUFBSTtRQUNKLE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUM1QixLQUFLLE1BQU0sT0FBTyxJQUFJLFFBQVEsRUFBRTtZQUM1QixJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUU7Z0JBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsOEVBQThFLENBQUMsQ0FBQzthQUNuRztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDM0I7UUFDRCxzQkFBc0I7UUFDdEIsTUFBTSxZQUFZLEdBQ2QsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFHLElBQUksWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFBRSxPQUFPLEVBQUUsQ0FBQztTQUFFO1FBQzdDLE9BQU8sWUFBWSxDQUFDLEdBQUcsQ0FBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFrQixDQUFDO0tBQy9FO1NBQU0sRUFBRSxjQUFjO1FBQ25CLG1DQUFtQztRQUNuQyxrRUFBa0U7UUFDbEUsUUFBUSxHQUFHLFFBQTJCLENBQUM7UUFDdkMsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQW9CLENBQUM7S0FDaEk7QUFDTCxDQUFDIn0=