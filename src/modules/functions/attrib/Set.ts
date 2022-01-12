import { getArrDepth, GIModel, idsBreak, TAttribDataTypes, TEntTypeIdx, TId } from '@design-automation/mobius-sim';
import { cloneDeep } from 'lodash';
import uscore from 'underscore';

import {
    checkAttribIdxKey,
    checkAttribName,
    checkAttribNameIdxKey,
    checkAttribValue,
    splitAttribNameIdxKey,
} from '../../../_check_attribs';
import { checkIDs, ID } from '../../../_check_ids';



// ================================================================================================
/**
 * Set an attribute value for one or more entities.
 * \n
 * If entities is null, then model level attributes will be set.
 * \n
 * @param __model__
 * @param entities Entities, the entities to set the attribute value for.
 * @param attrib The attribute. Can be `name`, `[name, index]`, or `[name, key]`.
 * @param value The attribute value, or list of values.
 * @param method Enum
 */
export function Set(
    __model__: GIModel,
    entities: TId | TId[] | TId[][],
    attrib: string | [string, number | string],
    value: TAttribDataTypes | TAttribDataTypes[],
    method: _ESet
): void {
    // if entities is null, then we are setting model attributes
    // @ts-ignore
    if (entities !== null && getArrDepth(entities) === 2) {
        entities = uscore.flatten(entities);
    }
    // --- Error Check ---
    const fn_name = "attrib.Set";
    let ents_arr: TEntTypeIdx | TEntTypeIdx[] = null;
    let attrib_name: string;
    let attrib_idx_key: number | string;
    if (__model__.debug) {
        // if (value === undefined) {
        //     throw new Error(fn_name + ': value is undefined');
        // }
        ents_arr = checkIDs(__model__, fn_name, "entities", entities, [ID.isNull, ID.isID, ID.isIDL1], null) as TEntTypeIdx | TEntTypeIdx[];
        [attrib_name, attrib_idx_key] = checkAttribNameIdxKey(fn_name, attrib);
        checkAttribName(fn_name, attrib_name);
    } else {
        if (entities !== null) {
            ents_arr = idsBreak(entities) as TEntTypeIdx | TEntTypeIdx[];
        }
        [attrib_name, attrib_idx_key] = splitAttribNameIdxKey(fn_name, attrib);
    }
    // --- Error Check ---
    _setAttrib(__model__, ents_arr, attrib_name, value, attrib_idx_key, method);
}
export enum _ESet {
    ONE_VALUE = "one_value",
    MANY_VALUES = "many_values",
}
function _setAttrib(
    __model__: GIModel,
    ents_arr: TEntTypeIdx | TEntTypeIdx[],
    attrib_name: string,
    attrib_values: TAttribDataTypes | TAttribDataTypes[],
    idx_or_key: number | string,
    method: _ESet
): void {
    // check the ents_arr
    if (ents_arr === null) {
        _setModelAttrib(__model__, attrib_name, attrib_values as TAttribDataTypes, idx_or_key);
        return;
    } else if (ents_arr.length === 0) {
        return;
    } else if (getArrDepth(ents_arr) === 1) {
        ents_arr = [ents_arr] as TEntTypeIdx[];
    }
    ents_arr = ents_arr as TEntTypeIdx[];
    if (method === _ESet.MANY_VALUES) {
        // all ents get different attribute value
        _setEachEntDifferentAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes[], idx_or_key);
    } else {
        // all ents get the same attribute value
        _setEachEntSameAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes, idx_or_key);
    }
    return;
}
function _setModelAttrib(__model__: GIModel, attrib_name: string, attrib_value: TAttribDataTypes, idx_or_key?: number | string): void {
    if (typeof idx_or_key === "number") {
        __model__.modeldata.attribs.set.setModelAttribListIdxVal(attrib_name, idx_or_key, attrib_value as number);
    }
    if (typeof idx_or_key === "string") {
        __model__.modeldata.attribs.set.setModelAttribDictKeyVal(attrib_name, idx_or_key, attrib_value as string);
    } else {
        __model__.modeldata.attribs.set.setModelAttribVal(attrib_name, attrib_value);
    }
}
function _setEachEntDifferentAttribValue(
    __model__: GIModel,
    ents_arr: TEntTypeIdx[],
    attrib_name: string,
    attrib_values: TAttribDataTypes[],
    idx_or_key?: number | string
): void {
    if (ents_arr.length !== attrib_values.length) {
        throw new Error("If multiple entities are being set to multiple values, then the number of entities must match the number of values.");
    }
    const ent_type: number = ents_arr[0][0];
    const ents_i: number[] = _getEntsIndices(__model__, ents_arr);
    for (let i = 0; i < ents_arr.length; i++) {
        // --- Error Check ---
        if (__model__.debug) {
            const fn_name = "entities@" + attrib_name;
            checkAttribValue(fn_name, attrib_values[i]);
            if (idx_or_key !== null) {
                checkAttribIdxKey(fn_name, idx_or_key);
            }
        }
        // --- Error Check ---
        // if this is a complex type, make a deep copy
        let val: TAttribDataTypes = attrib_values[i];
        if (val instanceof Object) {
            val = cloneDeep(val);
        }
        if (typeof idx_or_key === "number") {
            __model__.modeldata.attribs.set.setEntsAttribListIdxVal(ent_type, ents_i[i], attrib_name, idx_or_key, val);
        }
        if (typeof idx_or_key === "string") {
            __model__.modeldata.attribs.set.setEntsAttribDictKeyVal(ent_type, ents_i[i], attrib_name, idx_or_key, val);
        } else {
            __model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_type, ents_i[i], attrib_name, val);
        }
    }
}
function _setEachEntSameAttribValue(
    __model__: GIModel,
    ents_arr: TEntTypeIdx[],
    attrib_name: string,
    attrib_value: TAttribDataTypes,
    idx_or_key?: number | string
): void {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = "entities@" + attrib_name;
        checkAttribValue(fn_name, attrib_value);
    }
    // --- Error Check ---
    // if this is a complex type, make a deep copy
    if (attrib_value instanceof Object) {
        attrib_value = cloneDeep(attrib_value);
    }
    const ent_type: number = ents_arr[0][0];
    const ents_i: number[] = _getEntsIndices(__model__, ents_arr);
    if (typeof idx_or_key === "number") {
        __model__.modeldata.attribs.set.setEntsAttribListIdxVal(ent_type, ents_i, attrib_name, idx_or_key, attrib_value);
    } else if (typeof idx_or_key === "string") {
        __model__.modeldata.attribs.set.setEntsAttribDictKeyVal(ent_type, ents_i, attrib_name, idx_or_key, attrib_value);
    } else {
        __model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_type, ents_i, attrib_name, attrib_value);
    }
}
function _getEntsIndices(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[] {
    const ent_type: number = ents_arr[0][0];
    const ents_i: number[] = [];
    for (let i = 0; i < ents_arr.length; i++) {
        if (ents_arr[i][0] !== ent_type) {
            throw new Error("If an attribute is being set for multiple entities, then they must all be of the same type.");
        }
        ents_i.push(ents_arr[i][1]);
    }
    return ents_i;
}
