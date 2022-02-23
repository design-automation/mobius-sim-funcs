"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Get = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const _shared_1 = require("./_shared");
// ================================================================================================
/**
 * Get entities from a list of entities.
 * For example, you can get the position entities from a list of polygon entities.
 * \n
 * The result will always be a list of entities, even if there is only one entity.
 * In a case where you want only one entity, remember to get the first item in the list.
 * \n
 * The resulting list of entities will not contain duplicate entities.
 * \n
 * @param __model__
 * @param ent_type_enum Enum, the type of entity to get.
 * @param entities Optional, list of entities to get entities from, or null to get all entities in the model.
 * @returns Entities, a list of entities.
 * @example positions = query.Get('positions', [polyline1, polyline2])
 * @example_info Returns a list of positions that are part of polyline1 and polyline2.
 */
function Get(__model__, ent_type_enum, entities) {
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'query.Get';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isNull, _check_ids_1.ID.isID, _check_ids_1.ID.isIDL1, _check_ids_1.ID.isIDL2], null, false);
    }
    else {
        ents_arr = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    // get the entity type // TODO deal with multiple ent types
    const ent_type = (0, _shared_1._getEntTypeFromStr)(ent_type_enum);
    // if ents_arr is null, then get all entities in the model of type ent_type
    if (ents_arr === null) {
        // return the result
        return (0, mobius_sim_1.idsMake)(_getAll(__model__, ent_type));
    }
    if ((0, mobius_sim_1.isEmptyArr)(ents_arr)) {
        return [];
    }
    // make sure that the ents_arr is at least depth 2
    const depth = (0, mobius_sim_1.getArrDepth)(ents_arr);
    if (depth === 1) {
        ents_arr = [ents_arr];
    }
    ents_arr = ents_arr;
    // get the entities
    const found_ents_arr = _getFrom(__model__, ent_type, ents_arr);
    // return the result
    return (0, mobius_sim_1.idsMake)(found_ents_arr);
}
exports.Get = Get;
function _getAll(__model__, ent_type) {
    const ssid = __model__.modeldata.active_ssid;
    const ents_i = __model__.modeldata.geom.snapshot.getEnts(ssid, ent_type);
    return ents_i.map(ent_i => [ent_type, ent_i]);
}
function _getFrom(__model__, ent_type, ents_arr) {
    const ssid = __model__.modeldata.active_ssid;
    if (ents_arr.length === 0) {
        return [];
    }
    // do the query
    const depth = (0, mobius_sim_1.getArrDepth)(ents_arr);
    if (depth === 2) {
        ents_arr = ents_arr;
        // get the list of entities that are found
        const found_ents_i_set = new Set();
        for (const ent_arr of ents_arr) {
            if (__model__.modeldata.geom.snapshot.hasEnt(ssid, ent_arr[0], ent_arr[1])) {
                // snapshot
                const ents_i = __model__.modeldata.geom.nav.navAnyToAny(ent_arr[0], ent_type, ent_arr[1]);
                if (ents_i) {
                    for (const ent_i of ents_i) {
                        if (ent_i !== undefined) {
                            found_ents_i_set.add(ent_i);
                        }
                    }
                }
            }
        }
        // return the found ents
        const found_ents_i = Array.from(found_ents_i_set);
        return found_ents_i.map(entity_i => [ent_type, entity_i]);
    }
    else { // depth === 3
        // TODO Why do we want this option?
        // TODO I cannot see any reason to return anything buy a flat list
        ents_arr = ents_arr;
        return ents_arr.map(ents_arr_item => _getFrom(__model__, ent_type, ents_arr_item));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL3F1ZXJ5L0dldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4REFTdUM7QUFFdkMsb0RBQW1EO0FBRW5ELHVDQUErQztBQUcvQyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsU0FBZ0IsR0FBRyxDQUFDLFNBQWtCLEVBQUUsYUFBd0IsRUFBRSxRQUFtQjtJQUNqRixJQUFJLElBQUEsdUJBQVUsRUFBQyxRQUFRLENBQUMsRUFBRTtRQUFFLE9BQU8sRUFBRSxDQUFDO0tBQUU7SUFDeEMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQztJQUM1QixJQUFJLFFBQW1ELENBQUM7SUFDeEQsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLFFBQVEsR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUN4RCxDQUFDLGVBQUUsQ0FBQyxNQUFNLEVBQUUsZUFBRSxDQUFDLElBQUksRUFBRSxlQUFFLENBQUMsTUFBTSxFQUFFLGVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUE4QixDQUFDO0tBQzdGO1NBQU07UUFDSCxRQUFRLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFFBQVEsQ0FBa0IsQ0FBQztLQUNsRDtJQUNELHNCQUFzQjtJQUN0QiwyREFBMkQ7SUFDM0QsTUFBTSxRQUFRLEdBQWEsSUFBQSw0QkFBa0IsRUFBQyxhQUFhLENBQWEsQ0FBQztJQUN6RSwyRUFBMkU7SUFDM0UsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO1FBQ25CLG9CQUFvQjtRQUNwQixPQUFPLElBQUEsb0JBQU8sRUFBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFVLENBQUM7S0FDekQ7SUFDRCxJQUFJLElBQUEs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