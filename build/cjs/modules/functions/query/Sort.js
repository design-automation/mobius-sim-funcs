"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sort = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_attribs_1 = require("../../../_check_attribs");
const _check_ids_1 = require("../../../_check_ids");
const _enum_1 = require("./_enum");
// ================================================================================================
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
function Sort(__model__, entities, attrib, method_enum) {
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    // --- Error Check ---
    const fn_name = 'query.Sort';
    let ents_arr;
    let attrib_name, attrib_idx_key;
    if (__model__.debug) {
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isIDL1], null);
        [attrib_name, attrib_idx_key] = (0, _check_attribs_1.checkAttribNameIdxKey)(fn_name, attrib);
    }
    else {
        ents_arr = (0, mobius_sim_1.idsBreak)(entities);
        [attrib_name, attrib_idx_key] = (0, _check_attribs_1.splitAttribNameIdxKey)(fn_name, attrib);
    }
    // --- Error Check ---
    const sort_method = (method_enum === _enum_1._ESortMethod.DESCENDING) ? mobius_sim_1.ESort.DESCENDING : mobius_sim_1.ESort.ASCENDING;
    const sorted_ents_arr = _sort(__model__, ents_arr, attrib_name, attrib_idx_key, sort_method);
    return (0, mobius_sim_1.idsMake)(sorted_ents_arr);
}
exports.Sort = Sort;
function _sort(__model__, ents_arr, attrib_name, idx_or_key, method) {
    // get the list of ents_i
    const ent_type = ents_arr[0][0];
    const ents_i = ents_arr.filter(ent_arr => ent_arr[0] === ent_type).map(ent_arr => ent_arr[1]);
    // check if we are sorting by '_id'
    if (attrib_name === '_id') {
        const ents_arr_copy = ents_arr.slice();
        ents_arr_copy.sort(_compareID);
        if (method === mobius_sim_1.ESort.DESCENDING) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9xdWVyeS9Tb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhEQVV1QztBQUV2Qyw0REFBdUY7QUFDdkYsb0RBQW1EO0FBQ25ELG1DQUF1QztBQUd2QyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsU0FBZ0IsSUFBSSxDQUFDLFNBQWtCLEVBQUUsUUFBZSxFQUFFLE1BQXNDLEVBQUUsV0FBeUI7SUFDdkgsSUFBSSxJQUFBLHVCQUFVLEVBQUMsUUFBUSxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3hDLFFBQVEsR0FBRyxJQUFBLHdCQUFXLEVBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FBQztJQUM3QixJQUFJLFFBQXVCLENBQUM7SUFDNUIsSUFBSSxXQUFtQixFQUFFLGNBQTZCLENBQUM7SUFDdkQsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLFFBQVEsR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsZUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBa0IsQ0FBQztRQUNsRyxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsR0FBRyxJQUFBLHNDQUFxQixFQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUMxRTtTQUFNO1FBQ0gsUUFBUSxHQUFHLElBQUEscUJBQVEsRUFBQyxRQUFRLENBQWtCLENBQUM7UUFDL0MsQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLEdBQUcsSUFBQSxzQ0FBcUIsRUFBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDMUU7SUFDRCxzQkFBc0I7SUFDdEIsTUFBTSxXQUFXLEdBQVUsQ0FBQyxXQUFXLEtBQUssb0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFLLENBQUMsU0FBUyxDQUFDO0lBQzFHLE1BQU0sZUFBZSxHQUFrQixLQUFLLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzVHLE9BQU8sSUFBQSxvQkFBTyxFQUFDLGVBQWUsQ0FBVSxDQUFDO0FBQzdDLENBQUM7QUFsQkQsb0JBa0JDO0FBQ0QsU0FBUyxLQUFLLENBQUMsU0FBa0IsRUFBRSxRQUF1QixFQUFFLFdBQW1CLEVBQUUsVUFBeUIsRUFBRSxNQUFhO0lBQ3JILHlCQUF5QjtJQUN6QixNQUFNLFFBQVEsR0FBYSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsTUFBTSxNQUFNLEdBQWEsUUFBUSxDQUFDLE1BQU0sQ0FBRSxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUUsQ0FBQyxHQUFHLENBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQztJQUM1RyxtQ0FBbUM7SUFDbkMsSUFBSSxXQUFXLEtBQUssS0FBSyxFQUFFO1FBQ3ZCLE1BQU0sYUFBYSxHQUFrQixRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdEQsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQixJQUFJLE1BQU0sS0FBSyxrQkFBSyxDQUFDLFVBQVUsRUFBRTtZQUFFLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUFFO1FBQzdELE9BQU8sYUFBYSxDQUFDO0tBQ3hCO0lBQ0Qsc0NBQXNDO0lBQ3RDLE1BQU0sV0FBVyxHQUFhLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pJLE9BQU8sV0FBVyxDQUFDLEdBQUcsQ0FBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFrQixDQUFDO0FBQy9FLENBQUM7QUFDRCxTQUFTLFVBQVUsQ0FBQyxHQUFnQixFQUFFLEdBQWdCO0lBQ2xELE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ2hDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ2hDLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtRQUFFLE9BQU8sU0FBUyxHQUFJLFNBQVMsQ0FBQztLQUFFO0lBQy9ELElBQUksTUFBTSxLQUFLLE1BQU0sRUFBRTtRQUFFLE9BQU8sTUFBTSxHQUFJLE1BQU0sQ0FBQztLQUFFO0lBQ25ELE9BQU8sQ0FBQyxDQUFDO0FBQ2IsQ0FBQyJ9