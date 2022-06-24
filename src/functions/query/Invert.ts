import {
    arrMakeFlat,
    ENT_TYPE,
    Sim,
    idsBreak,
    idsMake,
    isEmptyArr,
    string,
    string,
} from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import { _ENT_TYPE } from './_enum';
import { _getEntTypeFromStr } from './_shared';


// ================================================================================================
/**
 * Returns a list of entities that are not part of the specified entities.
 * For example, you can get the position entities that are not part of a list of polygon entities.
 * \n
 * This function does the opposite of `query.Get()`.
 * While `query.Get()` gets entities that are part of the list of entities,
 * this function gets the entities that are not part of the list of entities.
 * \n
 * @param __model__
 * @param ent_type_enum Enum, specifies what type of entities will be returned: `'ps', '_v', '_e',
 * '_w', 'pt', 'pl', 'pg'`, or `'co'`.
 * @param entities List of entities to be excluded.
 * @returns Entities, a list of entities that match the type specified in '`ent_type_enum`', and that are not in `entities`.
 * @example `positions = query.Invert('positions', [polyline1, polyline2])`
 * @example_info Returns a list of positions that are not part of polyline1 and polyline2.
 */
export function Invert(__model__: Sim, ent_type_enum: _ENT_TYPE, entities: string|string[]): string[] {
    if (isEmptyArr(entities)) { return []; }
    entities = arrMakeFlat(entities) as string[];
    // // --- Error Check ---
    // let ents_arr: string[] = null;
    // if (this.debug) {
    //     if (entities !== null && entities !== undefined) {
    //         ents_arr = checkIDs(__model__, 'query.Invert', 'entities', entities, [ID.isIDL1], null, false) as string[];
    //     }
    // } else {
    //     if (entities !== null && entities !== undefined) {
    //         ents_arr = idsBreak(entities) as string[];
    //     }
    // }
    // // --- Error Check ---
    const select_ent_types: ENT_TYPE = _getEntTypeFromStr(ent_type_enum);
    const found_ents_arr: string[] = _invert(__model__, select_ent_types, ents_arr);
    return idsMake(found_ents_arr) as string[];
}
function _invert(__model__: Sim, select_ent_type: ENT_TYPE, ents_arr: string[]): string[] {
    const ssid: number = __model__.modeldata.active_ssid;
    // get the ents to exclude
    const excl_ents_i: number[] = (ents_arr as string[])
        .filter(ent_arr => ent_arr[0] === select_ent_type).map(ent_arr => ent_arr[1]);
    // get the list of entities
    const found_entities_i: number[] = [];
    const ents_i: number[] = __model__.modeldata.geom.snapshot.getEnts(ssid, select_ent_type);
    for (const ent_i of ents_i) {
        if (excl_ents_i.indexOf(ent_i) === -1) { found_entities_i.push(ent_i); }
    }
    return found_entities_i.map( entity_i => [select_ent_type, entity_i]) as string[];
}
