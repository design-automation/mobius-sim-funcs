"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delete = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const _enum_1 = require("./_enum");
// ================================================================================================
/**
 * Deletes geometric entities: positions, points, polylines, polygons, and collections.
 * \n
 * - When deleting positions, any topology that requires those positions will also be deleted.
 * (For example, any vertices linked to the deleted position will also be deleted,
 * which may in turn result in some edges being deleted, and so forth.)
 * - When deleting objects (points, polylines, and polygons), topology is also deleted.
 * - When deleting collections, the objects and other collections in the collection are also deleted.
 * \n
 * Topological entities inside objects  (wires, edges, vertices) cannot be deleted.
 * If a topological entity needs to be deleted, then the current approach is create a new object
 * with the desired topology, and then to delete the original object.
 * \n
 * @param __model__
 * @param entities Positions, points, polylines, polygons, collections.
 * @param method Enum, delete or keep unused positions.
 * @returns void
 * @example `edit.Delete(polygon1, 'delete_selected')`
 * @example_info Deletes `polygon1` from the model. The topology for
 * `polygon1` will be deleted. In addition, any positions being used by `polygon1` will be deleted
 * only if they are not being used by other objects.
 * @example `edit.Delete(polygon1, 'keep_selected')`
 * @example_info Deletes everything except `polygon1` from the model. The topology and positions for
 * `polygon1` will not be deleted.
 */
function Delete(__model__, entities, method) {
    if (entities === null) {
        if (method === _enum_1._EDeleteMethod.KEEP_SELECTED) {
            return;
        }
        if (method === _enum_1._EDeleteMethod.DELETE_SELECTED) {
            __model__.modeldata.funcs_edit.delete(null, false);
            return;
        }
    }
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    // --- Error Check ---
    const fn_name = 'edit.Delete';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.POSI, mobius_sim_1.EEntType.POINT, mobius_sim_1.EEntType.PLINE, mobius_sim_1.EEntType.PGON, mobius_sim_1.EEntType.COLL]);
    }
    else {
        ents_arr = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    switch (method) {
        case _enum_1._EDeleteMethod.DELETE_SELECTED:
            if ((0, mobius_sim_1.isEmptyArr)(entities)) {
                return;
            }
            __model__.modeldata.funcs_edit.delete(ents_arr, false); // do not invert
            return;
        case _enum_1._EDeleteMethod.KEEP_SELECTED:
            if ((0, mobius_sim_1.isEmptyArr)(entities)) {
                __model__.modeldata.funcs_edit.delete(null, false);
                return;
            }
            __model__.modeldata.funcs_edit.delete(ents_arr, true); // invert
            return;
        default:
            throw new Error(fn_name + ' : Method not recognised.');
    }
}
exports.Delete = Delete;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2VkaXQvRGVsZXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhEQUF1SDtBQUV2SCxvREFBbUQ7QUFDbkQsbUNBQXlDO0FBS3pDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBQ0gsU0FBZ0IsTUFBTSxDQUFDLFNBQWtCLEVBQUUsUUFBbUIsRUFBRSxNQUFzQjtJQUNsRixJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7UUFDbkIsSUFBSSxNQUFNLEtBQUssc0JBQWMsQ0FBQyxhQUFhLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFDeEQsSUFBSSxNQUFNLEtBQUssc0JBQWMsQ0FBQyxlQUFlLEVBQUU7WUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQUUsT0FBTztTQUFFO0tBQ2xIO0lBQ0QsUUFBUSxHQUFHLElBQUEsd0JBQVcsRUFBQyxRQUFRLENBQVUsQ0FBQztJQUMxQyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDO0lBQzlCLElBQUksUUFBdUIsQ0FBQztJQUM1QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsUUFBUSxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQzVELENBQUMsZUFBRSxDQUFDLElBQUksRUFBRSxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQ3BCLENBQUMscUJBQVEsQ0FBQyxJQUFJLEVBQUUscUJBQVEsQ0FBQyxLQUFLLEVBQUUscUJBQVEsQ0FBQyxLQUFLLEVBQUUscUJBQVEsQ0FBQyxJQUFJLEVBQUUscUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBa0IsQ0FBQztLQUNuRztTQUFNO1FBQ0gsUUFBUSxHQUFHLElBQUEscUJBQVEsRUFBQyxRQUFRLENBQWtCLENBQUM7S0FDbEQ7SUFDRCxzQkFBc0I7SUFDdEIsUUFBUSxNQUFNLEVBQUU7UUFDWixLQUFLLHNCQUFjLENBQUMsZUFBZTtZQUMvQixJQUFJLElBQUEsdUJBQVUsRUFBQyxRQUFRLENBQUMsRUFBRTtnQkFBRSxPQUFPO2FBQUU7WUFDckMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLGdCQUFnQjtZQUN4RSxPQUFPO1FBQ1gsS0FBSyxzQkFBYyxDQUFDLGFBQWE7WUFDN0IsSUFBSSxJQUFBLHVCQUFVLEVBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFBQyxPQUFPO2FBQUU7WUFDekYsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDaEUsT0FBTztRQUNYO1lBQ0ksTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcsMkJBQTJCLENBQUMsQ0FBQztLQUM5RDtBQUNMLENBQUM7QUE3QkQsd0JBNkJDIn0=