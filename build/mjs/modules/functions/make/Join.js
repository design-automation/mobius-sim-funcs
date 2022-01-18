import { arrMakeFlat, EEntType, idsBreak, idsMake } from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../../_check_ids';
// ================================================================================================
/**
 * Joins existing polyline or polygons to create new polyline or polygons.
 *
 * In order to be joined, the polylines or polygons must be fused (i.e. share the same positions)
 *
 * The existing polygons are not affected.
 *
 * Note: Joining polylines currently not implemented.
 *
 * @param __model__
 * @param entities Polylines or polygons, or entities from which polylines or polygons can be extracted.
 * @returns Entities, a list of new polylines or polygons resulting from the join.
 */
export function Join(__model__, entities) {
    entities = arrMakeFlat(entities);
    if (entities.length === 0) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'make.Join';
    let ents;
    if (__model__.debug) {
        ents = checkIDs(__model__, fn_name, 'entities', entities, [ID.isIDL1], [EEntType.WIRE, EEntType.PLINE, EEntType.PGON]);
    }
    else {
        ents = idsBreak(entities);
    }
    // --- Error Check ---
    const new_ents = __model__.modeldata.funcs_make.join(ents);
    return idsMake(new_ents);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSm9pbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9tYWtlL0pvaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQVcsUUFBUSxFQUFFLE9BQU8sRUFBb0IsTUFBTSwrQkFBK0IsQ0FBQztBQUVwSCxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBS25ELG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLFVBQVUsSUFBSSxDQUFDLFNBQWtCLEVBQUUsUUFBZTtJQUNwRCxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBVSxDQUFDO0lBQzFDLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3pDLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUM7SUFDNUIsSUFBSSxJQUFtQixDQUFDO0lBQ3hCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixJQUFJLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDcEQsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFrQixDQUFDO0tBQ3JGO1NBQU07UUFDSCxJQUFJLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBa0IsQ0FBQztLQUM5QztJQUNELHNCQUFzQjtJQUN0QixNQUFNLFFBQVEsR0FBa0IsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFFLE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBVSxDQUFDO0FBQ3RDLENBQUMifQ==