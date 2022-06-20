import {
    ENT_TYPEStr,
    getArrDepth,
    Sim,
    idsBreak,
    TAttribDataTypes,
    string,
    string,
} from '../../mobius_sim';
import { cloneDeep } from 'lodash';
import uscore from 'underscore';

import { checkAttribName, checkAttribNameIdxKey, splitAttribNameIdxKey } from '../../_check_attribs';
import { checkIDs, ID } from '../_common/_check_ids';



// ================================================================================================
/**
 * Get attribute values for one or more entities.
 * \n
 * If `entities` is null, then model level attributes will be returned.
 * \n
 * @param __model__
 * @param entities Entities, the entities to get the attribute values for.
 * @param attrib The attribute. Can be `name`, `[name, index]`, or `[name, key]`.
 * @returns One attribute value, or a list of attribute values.
 */
export function Get(__model__: Sim, entities: string | string[] | string[][],
    attrib: string | [string, number | string]): TAttribDataTypes | TAttribDataTypes[] {
    // @ts-ignore
    if (entities !== null && getArrDepth(entities) === 2) { entities = uscore.flatten(entities); }
    // --- Error Check ---
    let ents_arr: string | string[] = null;
    let attrib_name: string;
    let attrib_idx_key: number | string;
    const fn_name = 'attrib.Get';
    if (this.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null) as string | string[];
        }
        [attrib_name, attrib_idx_key] = checkAttribNameIdxKey(fn_name, attrib);
        checkAttribName(fn_name, attrib_name);
    } else {
        if (entities !== null && entities !== undefined) {
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            // [IDcheckObj.isID, IDcheckObj.isIDList], null) as string|string[];
            ents_arr = idsBreak(entities) as string | string[];
        }
        [attrib_name, attrib_idx_key] = splitAttribNameIdxKey(fn_name, attrib);
    }
    // --- Error Check ---
    return _get(__model__, ents_arr, attrib_name, attrib_idx_key);
}
function _get(__model__: Sim, ents_arr: string | string[],
    attrib_name: string, attrib_idx_key?: number | string): TAttribDataTypes | TAttribDataTypes[] {
    const has_idx_key: boolean = attrib_idx_key !== null && attrib_idx_key !== undefined;
    if (ents_arr === null) {
        // get the attrib values from the model
        if (typeof attrib_idx_key === 'number') {
            return __model__.modeldata.attribs.get.getModelAttribListIdxVal(attrib_name, attrib_idx_key);
        } else if (typeof attrib_idx_key === 'string') {
            return __model__.modeldata.attribs.get.getModelAttribDictKeyVal(attrib_name, attrib_idx_key);
        } else {
            return __model__.modeldata.attribs.get.getModelAttribVal(attrib_name);
        }
    } else if (ents_arr.length === 0) {
        return [];
    } else if (getArrDepth(ents_arr) === 1) {
        const [ent_type, ent_i]: string = ents_arr as string;
        // check if this is ID
        if (attrib_name === '_id') {
            if (has_idx_key) { throw new Error('The "_id" attribute does have an index.'); }
            return ENT_TYPEStr[ent_type] + ent_i as TAttribDataTypes;
        }
        // get the attrib values from the ents
        let val: TAttribDataTypes;
        if (typeof attrib_idx_key === 'number') {
            val = __model__.modeldata.attribs.get.getEntAttribListIdxVal(ent_type, ent_i, attrib_name, attrib_idx_key as number);
        } else if (typeof attrib_idx_key === 'string') {
            val = __model__.modeldata.attribs.get.getEntAttribDictKeyVal(ent_type, ent_i, attrib_name, attrib_idx_key as string);
        } else {
            val = __model__.modeldata.attribs.get.getEntAttribVal(ent_type, ent_i, attrib_name);
        }
        // if this is a complex type, make a deep copy
        if (val instanceof Object) { val = cloneDeep(val); }
        return val;
    } else {
        return (ents_arr as string[]).map(ent_arr =>
            _get(__model__, ent_arr, attrib_name, attrib_idx_key)) as TAttribDataTypes[];
    }
}