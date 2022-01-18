"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._neighbors = exports.Neighbor = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const _shared_1 = require("./_shared");
// ================================================================================================
/**
* Returns a list of neighboring entities. In order to qualify as a neighbor,
* entities must not be part of the set of input entities, but must be welded to one or more entities in the input.
* \n
* @param __model__
* @param ent_type_enum Enum, select the types of neighbors to return
* @param entities List of entities.
* @returns Entities, a list of welded neighbors
* @example query.neighbor('edges', [polyline1,polyline2,polyline3])
* @example_info Returns list of edges that are welded to polyline1, polyline2, or polyline3.
*/
function Neighbor(__model__, ent_type_enum, entities) {
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    // --- Error Check ---
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, 'query.Neighbor', 'entities', entities, [_check_ids_1.ID.isIDL1], null);
        }
    }
    else {
        if (entities !== null && entities !== undefined) {
            ents_arr = (0, mobius_sim_1.idsBreak)(entities);
        }
    }
    // --- Error Check ---
    const select_ent_type = (0, _shared_1._getEntTypeFromStr)(ent_type_enum);
    const found_ents_arr = _neighbors(__model__, select_ent_type, ents_arr);
    return (0, mobius_sim_1.idsMake)(found_ents_arr);
}
exports.Neighbor = Neighbor;
function _neighbors(__model__, select_ent_type, ents_arr) {
    // get an array of all vertices
    const verts_i = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, index] = ent_arr;
        const verts_ent_i = __model__.modeldata.geom.nav.navAnyToVert(ent_type, index);
        for (const vert_ent_i of verts_ent_i) {
            verts_i.push(vert_ent_i);
        }
    }
    // get the neighbor entities
    const all_nbor_ents_i = __model__.modeldata.geom.query.neighbor(select_ent_type, verts_i);
    return all_nbor_ents_i.map(nbor_ent_i => [select_ent_type, nbor_ent_i]);
}
exports._neighbors = _neighbors;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmVpZ2hib3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvcXVlcnkvTmVpZ2hib3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBU3VDO0FBRXZDLG9EQUFtRDtBQUVuRCx1Q0FBK0M7QUFHL0MsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7O0VBVUU7QUFDRixTQUFnQixRQUFRLENBQUMsU0FBa0IsRUFBRSxhQUF3QixFQUFFLFFBQW1CO0lBQ3RGLElBQUksSUFBQSx1QkFBVSxFQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUN4QyxRQUFRLEdBQUcsSUFBQSx3QkFBVyxFQUFDLFFBQVEsQ0FBVSxDQUFDO0lBQzFDLHNCQUFzQjtJQUN0QixJQUFJLFFBQVEsR0FBa0IsSUFBSSxDQUFDO0lBQ25DLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixJQUFJLFFBQVEsS0FBSyxJQUFJLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUM3QyxRQUFRLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsZUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBa0IsQ0FBQztTQUM5RztLQUNKO1NBQU07UUFDSCxJQUFJLFFBQVEsS0FBSyxJQUFJLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUM3QyxRQUFRLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFFBQVEsQ0FBa0IsQ0FBQztTQUNsRDtLQUNKO0lBQ0Qsc0JBQXNCO0lBQ3RCLE1BQU0sZUFBZSxHQUFhLElBQUEsNEJBQWtCLEVBQUMsYUFBYSxDQUFDLENBQUM7SUFDcEUsTUFBTSxjQUFjLEdBQWtCLFVBQVUsQ0FBQyxTQUFTLEVBQUUsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZGLE9BQU8sSUFBQSxvQkFBTyxFQUFDLGNBQWMsQ0FBVSxDQUFDO0FBQzVDLENBQUM7QUFsQkQsNEJBa0JDO0FBQ0QsU0FBZ0IsVUFBVSxDQUFDLFNBQWtCLEVBQUcsZUFBeUIsRUFBRSxRQUF1QjtJQUM5RiwrQkFBK0I7SUFDL0IsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO0lBQzdCLEtBQUssTUFBTSxPQUFPLElBQUksUUFBUSxFQUFFO1FBQzVCLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEdBQWdCLE9BQXNCLENBQUU7UUFDL0QsTUFBTSxXQUFXLEdBQWEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekYsS0FBSyxNQUFNLFVBQVUsSUFBSSxXQUFXLEVBQUU7WUFDbEMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM1QjtLQUNKO0lBQ0QsNEJBQTRCO0lBQzVCLE1BQU0sZUFBZSxHQUFhLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BHLE9BQU8sZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsZUFBZSxFQUFFLFVBQVUsQ0FBQyxDQUFrQixDQUFDO0FBQzdGLENBQUM7QUFiRCxnQ0FhQyJ9