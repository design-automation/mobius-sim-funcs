"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._EFilterOperator = exports.Filter = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_attribs_1 = require("../../../_check_attribs");
const _check_ids_1 = require("../../../_check_ids");
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
function Filter(__model__, entities, attrib, operator_enum, value) {
    if (entities === null) {
        return [];
    }
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'query.Filter';
    let ents_arr = null;
    let attrib_name, attrib_idx_key;
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1, _check_ids_1.ID.isIDL2], null, false);
        }
        [attrib_name, attrib_idx_key] = (0, _check_attribs_1.checkAttribNameIdxKey)(fn_name, attrib);
        (0, _check_attribs_1.checkAttribValue)(fn_name, value);
    }
    else {
        if (entities !== null && entities !== undefined) {
            ents_arr = (0, mobius_sim_1.idsBreak)(entities);
        }
        [attrib_name, attrib_idx_key] = (0, _check_attribs_1.splitAttribNameIdxKey)(fn_name, attrib);
    }
    // --- Error Check ---
    // make sure that the ents_arr is at least depth 2
    const depth = (0, mobius_sim_1.getArrDepth)(ents_arr);
    if (depth === 1) {
        ents_arr = [ents_arr];
    }
    ents_arr = ents_arr;
    // get the oeprator
    const op_type = _filterOperator(operator_enum);
    // do the query
    const found_ents_arr = _filter(__model__, ents_arr, attrib_name, attrib_idx_key, op_type, value);
    // return the result
    return (0, mobius_sim_1.idsMake)(found_ents_arr);
}
exports.Filter = Filter;
var _EFilterOperator;
(function (_EFilterOperator) {
    _EFilterOperator["IS_EQUAL"] = "==";
    _EFilterOperator["IS_NOT_EQUAL"] = "!=";
    _EFilterOperator["IS_GREATER_OR_EQUAL"] = ">=";
    _EFilterOperator["IS_LESS_OR_EQUAL"] = "<=";
    _EFilterOperator["IS_GREATER"] = ">";
    _EFilterOperator["IS_LESS"] = "<";
    _EFilterOperator["EQUAL"] = "=";
})(_EFilterOperator = exports._EFilterOperator || (exports._EFilterOperator = {}));
function _filterOperator(select) {
    switch (select) {
        case _EFilterOperator.IS_EQUAL:
            return mobius_sim_1.EFilterOperatorTypes.IS_EQUAL;
        case _EFilterOperator.IS_NOT_EQUAL:
            return mobius_sim_1.EFilterOperatorTypes.IS_NOT_EQUAL;
        case _EFilterOperator.IS_GREATER_OR_EQUAL:
            return mobius_sim_1.EFilterOperatorTypes.IS_GREATER_OR_EQUAL;
        case _EFilterOperator.IS_LESS_OR_EQUAL:
            return mobius_sim_1.EFilterOperatorTypes.IS_LESS_OR_EQUAL;
        case _EFilterOperator.IS_GREATER:
            return mobius_sim_1.EFilterOperatorTypes.IS_GREATER;
        case _EFilterOperator.IS_LESS:
            return mobius_sim_1.EFilterOperatorTypes.IS_LESS;
        default:
            throw new Error('Query operator type not recognised.');
    }
}
function _filter(__model__, ents_arr, name, idx_or_key, op_type, value) {
    if (ents_arr.length === 0) {
        return [];
    }
    // do the filter
    const depth = (0, mobius_sim_1.getArrDepth)(ents_arr);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL3F1ZXJ5L0ZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4REFXdUM7QUFFdkMsNERBQXlHO0FBQ3pHLG9EQUFtRDtBQUduRCxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsU0FBZ0IsTUFBTSxDQUFDLFNBQWtCLEVBQ2pDLFFBQW1CLEVBQ25CLE1BQXNDLEVBQ3RDLGFBQStCLEVBQUUsS0FBdUI7SUFDNUQsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUNyQyxJQUFJLElBQUEsdUJBQVUsRUFBQyxRQUFRLENBQUMsRUFBRTtRQUFFLE9BQU8sRUFBRSxDQUFDO0tBQUU7SUFDeEMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQztJQUMvQixJQUFJLFFBQVEsR0FBOEMsSUFBSSxDQUFDO0lBQy9ELElBQUksV0FBbUIsRUFBRSxjQUE2QixDQUFDO0lBQ3ZELElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixJQUFJLFFBQVEsS0FBSyxJQUFJLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUM3QyxRQUFRLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDeEQsQ0FBQyxlQUFFLENBQUMsSUFBSSxFQUFFLGVBQUUsQ0FBQyxNQUFNLEVBQUUsZUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQThCLENBQUM7U0FDbEY7UUFDRCxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsR0FBRyxJQUFBLHNDQUFxQixFQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2RSxJQUFBLGlDQUFnQixFQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNwQztTQUFNO1FBQ0gsSUFBSSxRQUFRLEtBQUssSUFBSSxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDN0MsUUFBUSxHQUFHLElBQUEscUJBQVEsRUFBQyxRQUFRLENBQWtCLENBQUM7U0FDbEQ7UUFDRCxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsR0FBRyxJQUFBLHNDQUFxQixFQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUMxRTtJQUNELHNCQUFzQjtJQUN0QixrREFBa0Q7SUFDbEQsTUFBTSxLQUFLLEdBQVcsSUFBQSx3QkFBVyxFQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtRQUFFLFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBa0IsQ0FBQztLQUFFO0lBQzVELFFBQVEsR0FBRyxRQUF5QyxDQUFDO0lBQ3JELG1CQUFtQjtJQUNuQixNQUFNLE9BQU8sR0FBeUIsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3JFLGVBQWU7SUFDZixNQUFNLGNBQWMsR0FBa0MsT0FBTyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDaEksb0JBQW9CO0lBQ3BCLE9BQU8sSUFBQSxvQkFBTyxFQUFDLGNBQWMsQ0FBa0IsQ0FBQztBQUNwRCxDQUFDO0FBbENELHdCQWtDQztBQUNELElBQVksZ0JBUVg7QUFSRCxXQUFZLGdCQUFnQjtJQUN4QixtQ0FBNEIsQ0FBQTtJQUM1Qix1Q0FBNEIsQ0FBQTtJQUM1Qiw4Q0FBNEIsQ0FBQTtJQUM1QiwyQ0FBNEIsQ0FBQTtJQUM1QixvQ0FBMkIsQ0FBQTtJQUMzQixpQ0FBMkIsQ0FBQTtJQUMzQiwrQkFBMkIsQ0FBQTtBQUMvQixDQUFDLEVBUlcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFRM0I7QUFDRCxTQUFTLGVBQWUsQ0FBQyxNQUF3QjtJQUM3QyxRQUFRLE1BQU0sRUFBRTtRQUNaLEtBQUssZ0JBQWdCLENBQUMsUUFBUTtZQUMxQixPQUFPLGlDQUFvQixDQUFDLFFBQVEsQ0FBQztRQUN6QyxLQUFLLGdCQUFnQixDQUFDLFlBQVk7WUFDOUIsT0FBTyxpQ0FBb0IsQ0FBQyxZQUFZLENBQUM7UUFDN0MsS0FBSyxnQkFBZ0IsQ0FBQyxtQkFBbUI7WUFDckMsT0FBTyxpQ0FBb0IsQ0FBQyxtQkFBbUIsQ0FBQztRQUNwRCxLQUFLLGdCQUFnQixDQUFDLGdCQUFnQjtZQUNsQyxPQUFPLGlDQUFvQixDQUFDLGdCQUFnQixDQUFDO1FBQ2pELEtBQUssZ0JBQWdCLENBQUMsVUFBVTtZQUM1QixPQUFPLGlDQUFvQixDQUFDLFVBQVUsQ0FBQztRQUMzQyxLQUFLLGdCQUFnQixDQUFDLE9BQU87WUFDekIsT0FBTyxpQ0FBb0IsQ0FBQyxPQUFPLENBQUM7UUFDeEM7WUFDSSxNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7S0FDOUQ7QUFDTCxDQUFDO0FBQ0QsU0FBUyxPQUFPLENBQUMsU0FBa0IsRUFBRSxRQUF1QyxFQUNwRSxJQUFZLEVBQUUsVUFBeUIsRUFBRSxPQUE2QixFQUFFLEtBQXVCO0lBQ25HLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3pDLGdCQUFnQjtJQUNoQixNQUFNLEtBQUssR0FBVyxJQUFBLHdCQUFXLEVBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO1FBQ2IsUUFBUSxHQUFHLFFBQXlCLENBQUM7UUFDckMsTUFBTSxRQUFRLEdBQWEsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFDLDJCQUEyQjtRQUMzQixxQ0FBcUM7UUFDckMsb0NBQW9DO1FBQ3BDLHdHQUF3RztRQUN4RyxJQUFJO1FBQ0osTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBQzVCLEtBQUssTUFBTSxPQUFPLElBQUksUUFBUSxFQUFFO1lBQzVCLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTtnQkFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4RUFBOEUsQ0FBQyxDQUFDO2FBQ25HO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMzQjtRQUNELHNCQUFzQjtRQUN0QixNQUFNLFlBQVksR0FDZCxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUcsSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUFFLE9BQU8sRUFBRSxDQUFDO1NBQUU7UUFDN0MsT0FBTyxZQUFZLENBQUMsR0FBRyxDQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQWtCLENBQUM7S0FDL0U7U0FBTSxFQUFFLGNBQWM7UUFDbkIsbUNBQW1DO1FBQ25DLGtFQUFrRTtRQUNsRSxRQUFRLEdBQUcsUUFBMkIsQ0FBQztRQUN2QyxPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBb0IsQ0FBQztLQUNoSTtBQUNMLENBQUMifQ==