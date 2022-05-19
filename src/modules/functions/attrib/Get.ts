import {
    EEntTypeStr,
    getArrDepth,
    GIModel,
    idsBreak,
    TAttribDataTypes,
    TEntTypeIdx,
    TId,
} from '@design-automation/mobius-sim';
import { cloneDeep } from 'lodash';
import uscore from 'underscore';

import { checkAttribName, checkAttribNameIdxKey, splitAttribNameIdxKey } from '../../../_check_attribs';
import { checkIDs, ID } from '../../../_check_ids';



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
export function Get(__model__: GIModel, entities: TId | TId[] | TId[][],
    attrib: string | [string, number | string]): TAttribDataTypes | TAttribDataTypes[] {
    // @ts-ignore
    if (entities !== null && getArrDepth(entities) === 2) { entities = uscore.flatten(entities); }
    // --- Error Check ---
    let ents_arr: TEntTypeIdx | TEntTypeIdx[] = null;
    let attrib_name: string;
    let attrib_idx_key: number | string;
    const fn_name = 'attrib.Get';
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null) as TEntTypeIdx | TEntTypeIdx[];
        }
        [attrib_name, attrib_idx_key] = checkAttribNameIdxKey(fn_name, attrib);
        checkAttribName(fn_name, attrib_name);
    } else {
        if (entities !== null && entities !== undefined) {
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            // [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
            ents_arr = idsBreak(entities) as TEntTypeIdx | TEntTypeIdx[];
        }
        [attrib_name, attrib_idx_key] = splitAttribNameIdxKey(fn_name, attrib);
    }
    // --- Error Check ---
    return _get(__model__, ents_arr, attrib_name, attrib_idx_key);
}
function _get(__model__: GIModel, ents_arr: TEntTypeIdx | TEntTypeIdx[],
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
        const [ent_type, ent_i]: TEntTypeIdx = ents_arr as TEntTypeIdx;
        // check if this is ID
        if (attrib_name === '_id') {
            if (has_idx_key) { throw new Error('The "_id" attribute does have an index.'); }
            return EEntTypeStr[ent_type] + ent_i as TAttribDataTypes;
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
        return (ents_arr as TEntTypeIdx[]).map(ent_arr =>
            _get(__model__, ent_arr, attrib_name, attrib_idx_key)) as TAttribDataTypes[];
    }
}
