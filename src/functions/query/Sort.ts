import {
    arrMakeFlat,
    ENT_TYPE,
    ESort,
    Sim,
    idsBreak,
    idsMake,
    isEmptyArr,
    string,
    string,
} from '../../mobius_sim';

import { checkAttribNameIdxKey, splitAttribNameIdxKey } from '../../_check_attribs';
import { checkIDs, ID } from '../_common/_check_ids';
import { _ESortMethod } from './_enum';


// ================================================================================================
/**
 * Sorts entities based on an attribute.
 * \n
 * If the attribute is a list, index can also be specified as follows: `#@name1[index]`.
 * \n
 * @param __model__
 * @param entities List of two or more entities to be sorted, all of the same entity type.
 * @param attrib Attribute name to use for sorting. Can be `name`, `[name, index]`, or `[name, key]`.
 * @param method_enum Enum, sort: `'descending'` or `'ascending'`.
 * @returns Entities, a list of sorted entities.
 * @example `sorted_list = query.Sort( [pos1, pos2, pos3], #@xyz[2], descending)`
 * @example_info Returns a list of three positions, sorted according to the descending z value.
 */
export function Sort(__model__: Sim, entities: string[], attrib: string|[string, number|string], method_enum: _ESortMethod): string[] {
    if (isEmptyArr(entities)) { return []; }
    entities = arrMakeFlat(entities) as string[];
    // --- Error Check ---
    const fn_name = 'query.Sort';
    let ents_arr: string[];
    let attrib_name: string, attrib_idx_key: number|string;
    if (this.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isIDL1], null) as string[];
        [attrib_name, attrib_idx_key] = checkAttribNameIdxKey(fn_name, attrib);
    } else {
        ents_arr = idsBreak(entities) as string[];
        [attrib_name, attrib_idx_key] = splitAttribNameIdxKey(fn_name, attrib);
    }
    // --- Error Check ---
    const sort_method: ESort = (method_enum === _ESortMethod.DESCENDING) ? ESort.DESCENDING : ESort.ASCENDING;
    const sorted_ents_arr: string[] = _sort(__model__, ents_arr, attrib_name, attrib_idx_key, sort_method);
    return idsMake(sorted_ents_arr) as string[];
}
function _sort(__model__: Sim, ents_arr: string[], attrib_name: string, idx_or_key: number|string, method: ESort): string[] {
    // get the list of ents_i
    const ent_type: ENT_TYPE = ents_arr[0][0];
    const ents_i: number[] = ents_arr.filter( ent_arr => ent_arr[0] === ent_type ).map( ent_arr => ent_arr[1] );
    // check if we are sorting by '_id'
    if (attrib_name === '_id') {
        const ents_arr_copy: string[] = ents_arr.slice();
        ents_arr_copy.sort(_compareID);
        if (method === ESort.DESCENDING) { ents_arr_copy.reverse(); }
        return ents_arr_copy;
    }
    // do the sort on the list of entities
    const sort_result: number[] = __model__.modeldata.attribs.query.sortByAttribs(ent_type, ents_i, attrib_name, idx_or_key, method);
    return sort_result.map( entity_i => [ent_type, entity_i]) as string[];
}
function _compareID(id1: string, id2: string): number {
    const [ent_type1, index1] = id1;
    const [ent_type2, index2] = id2;
    if (ent_type1 !== ent_type2) { return ent_type1 -  ent_type2; }
    if (index1 !== index2) { return index1 -  index2; }
    return 0;
}
