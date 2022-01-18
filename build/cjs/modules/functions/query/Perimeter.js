"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._perimeter = exports.Perimeter = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const _shared_1 = require("./_shared");
// ================================================================================================
/**
* Returns a list of perimeter entities. In order to qualify as a perimeter entity,
* entities must be part of the set of input entities and must have naked edges.
* \n
* @param __model__
* @param ent_type Enum, select the type of perimeter entities to return
* @param entities List of entities.
* @returns Entities, a list of perimeter entities.
* @example query.Perimeter('edges', [polygon1,polygon2,polygon])
* @example_info Returns list of edges that are at the perimeter of polygon1, polygon2, or polygon3.
*/
function Perimeter(__model__, ent_type, entities) {
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    // --- Error Check ---
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, 'query.Perimeter', 'entities', entities, [_check_ids_1.ID.isIDL1], null);
        }
    }
    else {
        if (entities !== null && entities !== undefined) {
            ents_arr = (0, mobius_sim_1.idsBreak)(entities);
        }
    }
    // --- Error Check ---
    const select_ent_type = (0, _shared_1._getEntTypeFromStr)(ent_type);
    const found_ents_arr = _perimeter(__model__, select_ent_type, ents_arr);
    return (0, mobius_sim_1.idsMake)(found_ents_arr);
}
exports.Perimeter = Perimeter;
function _perimeter(__model__, select_ent_type, ents_arr) {
    // get an array of all edges
    const edges_i = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, index] = ent_arr;
        const edges_ent_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
        for (const edge_ent_i of edges_ent_i) {
            edges_i.push(edge_ent_i);
        }
    }
    // get the perimeter entities
    const all_perim_ents_i = __model__.modeldata.geom.query.perimeter(select_ent_type, edges_i);
    return all_perim_ents_i.map(perim_ent_i => [select_ent_type, perim_ent_i]);
}
exports._perimeter = _perimeter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGVyaW1ldGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL3F1ZXJ5L1BlcmltZXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4REFTdUM7QUFFdkMsb0RBQW1EO0FBRW5ELHVDQUErQztBQUcvQyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7RUFVRTtBQUNGLFNBQWdCLFNBQVMsQ0FBQyxTQUFrQixFQUFFLFFBQW1CLEVBQUUsUUFBbUI7SUFDbEYsSUFBSSxJQUFBLHVCQUFVLEVBQUMsUUFBUSxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3hDLFFBQVEsR0FBRyxJQUFBLHdCQUFXLEVBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsc0JBQXNCO0lBQ3RCLElBQUksUUFBUSxHQUFrQixJQUFJLENBQUM7SUFDbkMsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLElBQUksUUFBUSxLQUFLLElBQUksSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQzdDLFFBQVEsR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLGlCQUFpQixFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFrQixDQUFDO1NBQy9HO0tBQ0o7U0FBTTtRQUNILElBQUksUUFBUSxLQUFLLElBQUksSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQzdDLFFBQVEsR0FBRyxJQUFBLHFCQUFRLEVBQUMsUUFBUSxDQUFrQixDQUFDO1NBQ2xEO0tBQ0o7SUFDRCxzQkFBc0I7SUFDdEIsTUFBTSxlQUFlLEdBQWEsSUFBQSw0QkFBa0IsRUFBQyxRQUFRLENBQUMsQ0FBQztJQUMvRCxNQUFNLGNBQWMsR0FBa0IsVUFBVSxDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdkYsT0FBTyxJQUFBLG9CQUFPLEVBQUMsY0FBYyxDQUFVLENBQUM7QUFDNUMsQ0FBQztBQWxCRCw4QkFrQkM7QUFDRCxTQUFnQixVQUFVLENBQUMsU0FBa0IsRUFBRyxlQUF5QixFQUFFLFFBQXVCO0lBQzlGLDRCQUE0QjtJQUM1QixNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7SUFDN0IsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUU7UUFDNUIsTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsR0FBZ0IsT0FBc0IsQ0FBRTtRQUMvRCxNQUFNLFdBQVcsR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6RixLQUFLLE1BQU0sVUFBVSxJQUFJLFdBQVcsRUFBRTtZQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzVCO0tBQ0o7SUFDRCw2QkFBNkI7SUFDN0IsTUFBTSxnQkFBZ0IsR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0RyxPQUFPLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsZUFBZSxFQUFFLFdBQVcsQ0FBQyxDQUFrQixDQUFDO0FBQ2hHLENBQUM7QUFiRCxnQ0FhQyJ9