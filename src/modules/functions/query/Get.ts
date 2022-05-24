import {
    EEntType,
    getArrDepth,
    GIModel,
    idsBreak,
    idsMake,
    isEmptyArr,
    TEntTypeIdx,
    TId,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';
import { _EEntType } from './_enum';
import { _getEntTypeFromStr } from './_shared';


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
export function Get(__model__: GIModel, ent_type_enum: _EEntType, entities: TId|TId[]): TId[]|TId[][] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'query.Get';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isNull, ID.isID, ID.isIDL1, ID.isIDL2], null, false) as TEntTypeIdx|TEntTypeIdx[];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    // get the entity type // TODO deal with multiple ent types
    const ent_type: EEntType = _getEntTypeFromStr(ent_type_enum) as EEntType;
    // if ents_arr is null, then get all entities in the model of type ent_type
    if (ents_arr === null) {
        // return the result
        return idsMake(_getAll(__model__, ent_type)) as TId[];
    }
    if (isEmptyArr(ents_arr)) { return []; }
    // make sure that the ents_arr is at least depth 2
    const depth: number = getArrDepth(ents_arr);
    if (depth === 1) { ents_arr = [ents_arr] as TEntTypeIdx[]; }
    ents_arr = ents_arr as TEntTypeIdx[]|TEntTypeIdx[][];
    // get the entities
    const found_ents_arr: TEntTypeIdx[]|TEntTypeIdx[][] = _getFrom(__model__, ent_type, ents_arr);
    // return the result
    return idsMake(found_ents_arr) as TId[]|TId[][];
}
function _getAll(__model__: GIModel, ent_type: EEntType): TEntTypeIdx[] {
    const ssid: number = __model__.modeldata.active_ssid;
    const ents_i: number[] = __model__.modeldata.geom.snapshot.getEnts(ssid, ent_type);
    return ents_i.map(ent_i => [ent_type, ent_i]) as TEntTypeIdx[];
}
function _getFrom(__model__: GIModel, ent_type: EEntType, ents_arr: TEntTypeIdx[]|TEntTypeIdx[][]): TEntTypeIdx[]|TEntTypeIdx[][] {
    const ssid: number = __model__.modeldata.active_ssid;
    if (ents_arr.length === 0) { return []; }
    // do the query
    const depth: number = getArrDepth(ents_arr);
    if (depth === 2) {
        ents_arr = ents_arr as TEntTypeIdx[];
        // get the list of entities that are found
        const found_ents_i_set: Set<number> = new Set();
        for (const ent_arr of ents_arr) {
            if (__model__.modeldata.geom.snapshot.hasEnt(ssid, ent_arr[0], ent_arr[1])) {
                // snapshot
                const ents_i: number[] = __model__.modeldata.geom.nav.navAnyToAny(ent_arr[0], ent_type, ent_arr[1]);
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
        const found_ents_i: number[] = Array.from(found_ents_i_set);
        return found_ents_i.map( entity_i => [ent_type, entity_i]) as TEntTypeIdx[];
    } else { // depth === 3
        // TODO Why do we want this option?
        // TODO I cannot see any reason to return anything buy a flat list
        ents_arr = ents_arr as TEntTypeIdx[][];
        return ents_arr.map(ents_arr_item => _getFrom(__model__, ent_type, ents_arr_item)) as TEntTypeIdx[][];
    }
}
