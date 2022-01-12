/**
 * The `query` module has functions for querying entities in the the model.
 * Most of these functions all return a list of IDs of entities in the model.
 * @module
 */
import {
    arrMakeFlat,
    EEntType,
    GIModel,
    idsBreak,
    idsMake,
    isEmptyArr,
    TEntTypeIdx,
    TId,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../../_check_ids';
import { _EEntType } from './_enum';
import { _getEntTypeFromStr } from './_shared';


// ================================================================================================
/**
 * Returns a list of entities that are not part of the specified entities.
 * For example, you can get the position entities that are not part of a list of polygon entities.
 * \n
 * This function does the opposite of query.Get().
 * While query.Get() gets entities that are part of of the list of entities,
 * this function gets the entities that are not part of the list of entities.
 * \n
 * @param __model__
 * @param ent_type_enum Enum, specifies what type of entities will be returned.
 * @param entities List of entities to be excluded.
 * @returns Entities, a list of entities that match the type specified in 'ent_type_enum', and that are not in entities.
 * @example positions = query.Invert('positions', [polyline1, polyline2])
 * @example_info Returns a list of positions that are not part of polyline1 and polyline2.
 */
export function Invert(__model__: GIModel, ent_type_enum: _EEntType, entities: TId|TId[]): TId[] {
    if (isEmptyArr(entities)) { return []; }
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    let ents_arr: TEntTypeIdx[] = null;
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = checkIDs(__model__, 'query.Invert', 'entities', entities, [ID.isIDL1], null, false) as TEntTypeIdx[];
        }
    } else {
        if (entities !== null && entities !== undefined) {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
    }
    // --- Error Check ---
    const select_ent_types: EEntType = _getEntTypeFromStr(ent_type_enum);
    const found_ents_arr: TEntTypeIdx[] = _invert(__model__, select_ent_types, ents_arr);
    return idsMake(found_ents_arr) as TId[];
}
function _invert(__model__: GIModel, select_ent_type: EEntType, ents_arr: TEntTypeIdx[]): TEntTypeIdx[] {
    const ssid: number = __model__.modeldata.active_ssid;
    // get the ents to exclude
    const excl_ents_i: number[] = (ents_arr as TEntTypeIdx[])
        .filter(ent_arr => ent_arr[0] === select_ent_type).map(ent_arr => ent_arr[1]);
    // get the list of entities
    const found_entities_i: number[] = [];
    const ents_i: number[] = __model__.modeldata.geom.snapshot.getEnts(ssid, select_ent_type);
    for (const ent_i of ents_i) {
        if (excl_ents_i.indexOf(ent_i) === -1) { found_entities_i.push(ent_i); }
    }
    return found_entities_i.map( entity_i => [select_ent_type, entity_i]) as TEntTypeIdx[];
}
