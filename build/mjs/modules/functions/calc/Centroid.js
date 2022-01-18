import { idsBreak, isEmptyArr } from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../../_check_ids';
import { getCenterOfMass, getCentroid } from '../_common';
import { _ECentroidMethod } from './_enum';
// ================================================================================================
/**
 * Calculates the centroid of an entity.
 *
 * If 'ps_average' is selected, the centroid is the average of the positions that make up that entity.
 *
 * If 'center_of_mass' is selected, the centroid is the centre of mass of the faces that make up that entity.
 * Note that only faces are deemed to have mass.
 *
 * Given a list of entities, a list of centroids will be returned.
 *
 * Given a list of positions, a single centroid that is the average of all those positions will be returned.
 *
 * @param __model__
 * @param entities Single or list of entities. (Can be any type of entities.)
 * @param method Enum, the method for calculating the centroid.
 * @returns A centroid [x, y, z] or a list of centroids.
 * @example centroid1 = calc.Centroid (polygon1)
 */
export function Centroid(__model__, entities, method) {
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Centroid';
    let ents_arrs;
    if (__model__.debug) {
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null);
    }
    else {
        ents_arrs = idsBreak(entities);
    }
    // --- Error Check ---
    switch (method) {
        case _ECentroidMethod.PS_AVERAGE:
            return getCentroid(__model__, ents_arrs);
        case _ECentroidMethod.CENTER_OF_MASS:
            return getCenterOfMass(__model__, ents_arrs);
        default:
            break;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2VudHJvaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvY2FsYy9DZW50cm9pZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQVcsUUFBUSxFQUFFLFVBQVUsRUFBMEIsTUFBTSwrQkFBK0IsQ0FBQztBQUV0RyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQzFELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUkzQyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBQ0gsTUFBTSxVQUFVLFFBQVEsQ0FBQyxTQUFrQixFQUFFLFFBQW1CLEVBQUUsTUFBd0I7SUFDdEYsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3hDLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUM7SUFDaEMsSUFBSSxTQUFvQyxDQUFDO0lBQ3pDLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDN0QsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQThCLENBQUM7S0FDNUQ7U0FBTTtRQUNILFNBQVMsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUE4QixDQUFDO0tBQy9EO0lBQ0Qsc0JBQXNCO0lBQ3RCLFFBQVEsTUFBTSxFQUFFO1FBQ1osS0FBSyxnQkFBZ0IsQ0FBQyxVQUFVO1lBQzVCLE9BQU8sV0FBVyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3QyxLQUFLLGdCQUFnQixDQUFDLGNBQWM7WUFDaEMsT0FBTyxlQUFlLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2pEO1lBQ0ksTUFBTTtLQUNiO0FBQ0wsQ0FBQyJ9