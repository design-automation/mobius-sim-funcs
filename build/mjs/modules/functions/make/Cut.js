import { arrMakeFlat, idsBreak, idsMake, isEmptyArr, } from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../../_check_ids';
import * as chk from '../../../_check_types';
import { _ECutMethod } from './_enum';
// ================================================================================================
/**
 * Cuts polygons and polylines using a plane.
 *
 * If the 'keep_above' method is selected, then only the part of the cut entities above the plane are kept.
 * If the 'keep_below' method is selected, then only the part of the cut entities below the plane are kept.
 * If the 'keep_both' method is selected, then both the parts of the cut entities are kept.
 *
 * Currently does not support cutting polygons with holes. TODO
 *
 * If 'keep_both' is selected, returns a list of two lists.
 * [[entities above the plane], [entities below the plane]].
 *
 * @param __model__
 * @param entities Polylines or polygons, or entities from which polyline or polygons can be extracted.
 * @param plane The plane to cut with.
 * @param method Enum, select the method for cutting.
 * @returns Entities, a list of three lists of entities resulting from the cut.

 */
export function Cut(__model__, entities, plane, method) {
    entities = arrMakeFlat(entities);
    if (isEmptyArr(entities)) {
        if (method === _ECutMethod.KEEP_BOTH) {
            return [[], []];
        }
        return [];
    }
    // --- Error Check ---
    const fn_name = 'make.Cut';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null);
        chk.checkArgs(fn_name, 'plane', plane, [chk.isPln]);
    }
    else {
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    const [above, below] = __model__.modeldata.funcs_make.cut(ents_arr, plane, method);
    // return the result
    switch (method) {
        case _ECutMethod.KEEP_ABOVE:
            return idsMake(above);
        case _ECutMethod.KEEP_BELOW:
            return idsMake(below);
        default:
            return [idsMake(above), idsMake(below)];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL21ha2UvQ3V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxXQUFXLEVBRVgsUUFBUSxFQUNSLE9BQU8sRUFDUCxVQUFVLEdBSWIsTUFBTSwrQkFBK0IsQ0FBQztBQUV2QyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxHQUFHLE1BQU0sdUJBQXVCLENBQUM7QUFDN0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUt0QyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUNILE1BQU0sVUFBVSxHQUFHLENBQUMsU0FBa0IsRUFBRSxRQUFtQixFQUFFLEtBQWEsRUFBRSxNQUFtQjtJQUMzRixRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBVSxDQUFDO0lBQzFDLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ3RCLElBQUksTUFBTSxLQUFLLFdBQVcsQ0FBQyxTQUFTLEVBQUU7WUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQUU7UUFDMUQsT0FBTyxFQUFFLENBQUM7S0FDYjtJQUNELHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUM7SUFDM0IsSUFBSSxRQUF1QixDQUFDO0lBQzVCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDeEQsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQWtCLENBQUM7UUFDakQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQ3ZEO1NBQU07UUFDSCxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBa0IsQ0FBQztLQUNsRDtJQUNELHNCQUFzQjtJQUN0QixNQUFNLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFtQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuSCxvQkFBb0I7SUFDcEIsUUFBUSxNQUFNLEVBQUU7UUFDWixLQUFLLFdBQVcsQ0FBQyxVQUFVO1lBQ3ZCLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBVSxDQUFDO1FBQ25DLEtBQUssV0FBVyxDQUFDLFVBQVU7WUFDdkIsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFVLENBQUM7UUFDbkM7WUFDSSxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBbUIsQ0FBQztLQUNqRTtBQUNMLENBQUMifQ==