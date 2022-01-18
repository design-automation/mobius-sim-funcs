"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hole = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
// ================================================================================================
/**
 * Makes one or more holes in a polygon.
 * \n
 * The holes are specified by lists of positions.
 * The positions must be on the polygon, i.e. they must be co-planar with the polygon and
 * they must be within the boundary of the polygon. (Even positions touching the edge of the polygon
 * can result in no hole being generated.)
 * \n
 * Multiple holes can be created.
 * - If the positions is a single list, then a single hole will be generated.
 * - If the positions is a list of lists, then multiple holes will be generated.
 * \n
 * @param __model__
 * @param pgon A polygon to make holes in.
 * @param entities List of positions, or nested lists of positions, or entities from which positions
 * can be extracted.
 * @returns Entities, a list of wires resulting from the hole(s).
 */
function Hole(__model__, pgon, entities) {
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    if (!Array.isArray(entities)) {
        entities = [entities];
    }
    // --- Error Check ---
    const fn_name = 'edit.Hole';
    let ent_arr;
    let holes_ents_arr;
    if (__model__.debug) {
        ent_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'pgon', pgon, [_check_ids_1.ID.isID], [mobius_sim_1.EEntType.PGON]);
        holes_ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1, _check_ids_1.ID.isIDL2], [mobius_sim_1.EEntType.POSI, mobius_sim_1.EEntType.WIRE, mobius_sim_1.EEntType.PLINE, mobius_sim_1.EEntType.PGON]);
    }
    else {
        ent_arr = (0, mobius_sim_1.idsBreak)(pgon);
        holes_ents_arr = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    const new_ents_arr = __model__.modeldata.funcs_edit.hole(ent_arr, holes_ents_arr);
    // make and return the IDs of the hole wires
    return (0, mobius_sim_1.idsMake)(new_ents_arr);
}
exports.Hole = Hole;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9lZGl0L0hvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBQW1IO0FBRW5ILG9EQUFtRDtBQUtuRCxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBQ0gsU0FBZ0IsSUFBSSxDQUFDLFNBQWtCLEVBQUUsSUFBUyxFQUFFLFFBQTJCO0lBQzNFLElBQUksSUFBQSx1QkFBVSxFQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUFFLFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQUU7SUFDeEQsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQztJQUM1QixJQUFJLE9BQW9CLENBQUM7SUFDekIsSUFBSSxjQUE2QyxDQUFDO0lBQ2xELElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixPQUFPLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLGVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFRLENBQUMsSUFBSSxDQUFDLENBQWdCLENBQUM7UUFDaEcsY0FBYyxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQzlELENBQUMsZUFBRSxDQUFDLElBQUksRUFBRSxlQUFFLENBQUMsTUFBTSxFQUFFLGVBQUUsQ0FBQyxNQUFNLENBQUMsRUFDL0IsQ0FBQyxxQkFBUSxDQUFDLElBQUksRUFBRSxxQkFBUSxDQUFDLElBQUksRUFBRSxxQkFBUSxDQUFDLEtBQUssRUFBRSxxQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFrQyxDQUFDO0tBQ3ZHO1NBQU07UUFDSCxPQUFPLEdBQUcsSUFBQSxxQkFBUSxFQUFDLElBQUksQ0FBZ0IsQ0FBQztRQUN4QyxjQUFjLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFFBQVEsQ0FBa0MsQ0FBQztLQUN4RTtJQUNELHNCQUFzQjtJQUN0QixNQUFNLFlBQVksR0FBa0IsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNqRyw0Q0FBNEM7SUFDNUMsT0FBTyxJQUFBLG9CQUFPLEVBQUMsWUFBWSxDQUFVLENBQUM7QUFDMUMsQ0FBQztBQXBCRCxvQkFvQkMifQ==