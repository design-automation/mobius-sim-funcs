"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Join = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
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
function Join(__model__, entities) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    if (entities.length === 0) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'make.Join';
    let ents;
    if (__model__.debug) {
        ents = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.WIRE, mobius_sim_1.EEntType.PLINE, mobius_sim_1.EEntType.PGON]);
    }
    else {
        ents = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    const new_ents = __model__.modeldata.funcs_make.join(ents);
    return (0, mobius_sim_1.idsMake)(new_ents);
}
exports.Join = Join;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSm9pbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9tYWtlL0pvaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBQW9IO0FBRXBILG9EQUFtRDtBQUtuRCxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsU0FBZ0IsSUFBSSxDQUFDLFNBQWtCLEVBQUUsUUFBZTtJQUNwRCxRQUFRLEdBQUcsSUFBQSx3QkFBVyxFQUFDLFFBQVEsQ0FBVSxDQUFDO0lBQzFDLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3pDLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUM7SUFDNUIsSUFBSSxJQUFtQixDQUFDO0lBQ3hCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixJQUFJLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDcEQsQ0FBQyxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxxQkFBUSxDQUFDLElBQUksRUFBRSxxQkFBUSxDQUFDLEtBQUssRUFBRSxxQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFrQixDQUFDO0tBQ3JGO1NBQU07UUFDSCxJQUFJLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFFBQVEsQ0FBa0IsQ0FBQztLQUM5QztJQUNELHNCQUFzQjtJQUN0QixNQUFNLFFBQVEsR0FBa0IsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFFLE9BQU8sSUFBQSxvQkFBTyxFQUFDLFFBQVEsQ0FBVSxDQUFDO0FBQ3RDLENBQUM7QUFmRCxvQkFlQyJ9