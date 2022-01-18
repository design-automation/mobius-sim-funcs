import { arrMakeFlat, ESort, idsBreak, idsMake, isEmptyArr, } from '@design-automation/mobius-sim';
import { checkAttribNameIdxKey, splitAttribNameIdxKey } from '../../../_check_attribs';
import { checkIDs, ID } from '../../../_check_ids';
import { _ESortMethod } from './_enum';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9xdWVyeS9Tb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxXQUFXLEVBRVgsS0FBSyxFQUVMLFFBQVEsRUFDUixPQUFPLEVBQ1AsVUFBVSxHQUdiLE1BQU0sK0JBQStCLENBQUM7QUFFdkMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLHFCQUFxQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdkYsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBR3ZDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLFVBQVUsSUFBSSxDQUFDLFNBQWtCLEVBQUUsUUFBZSxFQUFFLE1BQXNDLEVBQUUsV0FBeUI7SUFDdkgsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3hDLFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FBQztJQUM3QixJQUFJLFFBQXVCLENBQUM7SUFDNUIsSUFBSSxXQUFtQixFQUFFLGNBQTZCLENBQUM7SUFDdkQsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLFFBQVEsR0FBRyxRQUFRLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBa0IsQ0FBQztRQUNsRyxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDMUU7U0FBTTtRQUNILFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFrQixDQUFDO1FBQy9DLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxHQUFHLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUMxRTtJQUNELHNCQUFzQjtJQUN0QixNQUFNLFdBQVcsR0FBVSxDQUFDLFdBQVcsS0FBSyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7SUFDMUcsTUFBTSxlQUFlLEdBQWtCLEtBQUssQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDNUcsT0FBTyxPQUFPLENBQUMsZUFBZSxDQUFVLENBQUM7QUFDN0MsQ0FBQztBQUNELFNBQVMsS0FBSyxDQUFDLFNBQWtCLEVBQUUsUUFBdUIsRUFBRSxXQUFtQixFQUFFLFVBQXlCLEVBQUUsTUFBYTtJQUNySCx5QkFBeUI7SUFDekIsTUFBTSxRQUFRLEdBQWEsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLE1BQU0sTUFBTSxHQUFhLFFBQVEsQ0FBQyxNQUFNLENBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFFLENBQUMsR0FBRyxDQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7SUFDNUcsbUNBQW1DO0lBQ25DLElBQUksV0FBVyxLQUFLLEtBQUssRUFBRTtRQUN2QixNQUFNLGFBQWEsR0FBa0IsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3RELGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0IsSUFBSSxNQUFNLEtBQUssS0FBSyxDQUFDLFVBQVUsRUFBRTtZQUFFLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUFFO1FBQzdELE9BQU8sYUFBYSxDQUFDO0tBQ3hCO0lBQ0Qsc0NBQXNDO0lBQ3RDLE1BQU0sV0FBVyxHQUFhLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pJLE9BQU8sV0FBVyxDQUFDLEdBQUcsQ0FBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFrQixDQUFDO0FBQy9FLENBQUM7QUFDRCxTQUFTLFVBQVUsQ0FBQyxHQUFnQixFQUFFLEdBQWdCO0lBQ2xELE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ2hDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ2hDLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtRQUFFLE9BQU8sU0FBUyxHQUFJLFNBQVMsQ0FBQztLQUFFO0lBQy9ELElBQUksTUFBTSxLQUFLLE1BQU0sRUFBRTtRQUFFLE9BQU8sTUFBTSxHQUFJLE1BQU0sQ0FBQztLQUFFO0lBQ25ELE9BQU8sQ0FBQyxDQUFDO0FBQ2IsQ0FBQyJ9