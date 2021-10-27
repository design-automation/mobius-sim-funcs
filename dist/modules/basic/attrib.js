/**
 * The `attrib` module has functions for working with attributes in teh model.
 * Note that attributes can also be set and retrieved using the "@" symbol.
 * @module
 */
import { checkIDs, ID } from '../../_check_ids';
import { checkAttribValue, checkAttribName, checkAttribIdxKey, checkAttribNameIdxKey, splitAttribNameIdxKey } from '../../_check_attribs';
import uscore from 'underscore';
import { EEntType, EAttribPush, EEntTypeStr, EAttribDataTypeStrs } from '@design-automation/mobius-sim/dist/geo-info/common';
import { idsBreak } from '@design-automation/mobius-sim/dist/geo-info/common_id_funcs';
import { getArrDepth } from '@design-automation/mobius-sim/dist/util/arrs';
import * as lodash from 'lodash';
// ================================================================================================
export var _EEntType;
(function (_EEntType) {
    _EEntType["POSI"] = "ps";
    _EEntType["VERT"] = "_v";
    _EEntType["EDGE"] = "_e";
    _EEntType["WIRE"] = "_w";
    _EEntType["FACE"] = "_f";
    _EEntType["POINT"] = "pt";
    _EEntType["PLINE"] = "pl";
    _EEntType["PGON"] = "pg";
    _EEntType["COLL"] = "co";
})(_EEntType || (_EEntType = {}));
export var _EEntTypeAndMod;
(function (_EEntTypeAndMod) {
    _EEntTypeAndMod["POSI"] = "ps";
    _EEntTypeAndMod["VERT"] = "_v";
    _EEntTypeAndMod["EDGE"] = "_e";
    _EEntTypeAndMod["WIRE"] = "_w";
    _EEntTypeAndMod["FACE"] = "_f";
    _EEntTypeAndMod["POINT"] = "pt";
    _EEntTypeAndMod["PLINE"] = "pl";
    _EEntTypeAndMod["PGON"] = "pg";
    _EEntTypeAndMod["COLL"] = "co";
    _EEntTypeAndMod["MOD"] = "mo";
})(_EEntTypeAndMod || (_EEntTypeAndMod = {}));
export var _EAttribPushTarget;
(function (_EAttribPushTarget) {
    _EAttribPushTarget["POSI"] = "ps";
    _EAttribPushTarget["VERT"] = "_v";
    _EAttribPushTarget["EDGE"] = "_e";
    _EAttribPushTarget["WIRE"] = "_w";
    _EAttribPushTarget["FACE"] = "_f";
    _EAttribPushTarget["POINT"] = "pt";
    _EAttribPushTarget["PLINE"] = "pl";
    _EAttribPushTarget["PGON"] = "pg";
    _EAttribPushTarget["COLL"] = "co";
    _EAttribPushTarget["COLLP"] = "cop";
    _EAttribPushTarget["COLLC"] = "coc";
    _EAttribPushTarget["MOD"] = "mo";
})(_EAttribPushTarget || (_EAttribPushTarget = {}));
export var _EDataType;
(function (_EDataType) {
    _EDataType["NUMBER"] = "number";
    _EDataType["STRING"] = "string";
    _EDataType["BOOLEAN"] = "boolean";
    _EDataType["LIST"] = "list";
    _EDataType["DICT"] = "dict";
})(_EDataType || (_EDataType = {}));
function _getEntTypeFromStr(ent_type_str) {
    switch (ent_type_str) {
        case _EEntTypeAndMod.POSI:
            return EEntType.POSI;
        case _EEntTypeAndMod.VERT:
            return EEntType.VERT;
        case _EEntTypeAndMod.EDGE:
            return EEntType.EDGE;
        case _EEntTypeAndMod.WIRE:
            return EEntType.WIRE;
        case _EEntTypeAndMod.POINT:
            return EEntType.POINT;
        case _EEntTypeAndMod.PLINE:
            return EEntType.PLINE;
        case _EEntTypeAndMod.PGON:
            return EEntType.PGON;
        case _EEntTypeAndMod.COLL:
            return EEntType.COLL;
        case _EEntTypeAndMod.MOD:
            return EEntType.MOD;
        default:
            break;
    }
}
function _getAttribPushTarget(ent_type_str) {
    switch (ent_type_str) {
        case _EAttribPushTarget.POSI:
            return EEntType.POSI;
        case _EAttribPushTarget.VERT:
            return EEntType.VERT;
        case _EAttribPushTarget.EDGE:
            return EEntType.EDGE;
        case _EAttribPushTarget.WIRE:
            return EEntType.WIRE;
        case _EAttribPushTarget.POINT:
            return EEntType.POINT;
        case _EAttribPushTarget.PLINE:
            return EEntType.PLINE;
        case _EAttribPushTarget.PGON:
            return EEntType.PGON;
        case _EAttribPushTarget.COLL:
            return EEntType.COLL;
        case _EAttribPushTarget.COLLC:
            return 'coll_children';
        case _EAttribPushTarget.COLLP:
            return 'coll_parent';
        case _EAttribPushTarget.MOD:
            return EEntType.MOD;
        default:
            break;
    }
}
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
export function Set(__model__, entities, attrib, value, method) {
    // if entities is null, then we are setting model attributes
    // @ts-ignore
    if (entities !== null && getArrDepth(entities) === 2) {
        entities = uscore.flatten(entities);
    }
    // --- Error Check ---
    const fn_name = 'attrib.Set';
    let ents_arr = null;
    let attrib_name;
    let attrib_idx_key;
    if (__model__.debug) {
        // if (value === undefined) {
        //     throw new Error(fn_name + ': value is undefined');
        // }
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isNull, ID.isID, ID.isIDL1], null);
        [attrib_name, attrib_idx_key] = checkAttribNameIdxKey(fn_name, attrib);
        checkAttribName(fn_name, attrib_name);
    }
    else {
        if (entities !== null) {
            ents_arr = idsBreak(entities);
        }
        [attrib_name, attrib_idx_key] = splitAttribNameIdxKey(fn_name, attrib);
    }
    // --- Error Check ---
    _setAttrib(__model__, ents_arr, attrib_name, value, attrib_idx_key, method);
}
export var _ESet;
(function (_ESet) {
    _ESet["ONE_VALUE"] = "one_value";
    _ESet["MANY_VALUES"] = "many_values";
})(_ESet || (_ESet = {}));
function _setAttrib(__model__, ents_arr, attrib_name, attrib_values, idx_or_key, method) {
    // check the ents_arr
    if (ents_arr === null) {
        _setModelAttrib(__model__, attrib_name, attrib_values, idx_or_key);
        return;
    }
    else if (ents_arr.length === 0) {
        return;
    }
    else if (getArrDepth(ents_arr) === 1) {
        ents_arr = [ents_arr];
    }
    ents_arr = ents_arr;
    if (method === _ESet.MANY_VALUES) {
        // all ents get different attribute value
        _setEachEntDifferentAttribValue(__model__, ents_arr, attrib_name, attrib_values, idx_or_key);
    }
    else {
        // all ents get the same attribute value
        _setEachEntSameAttribValue(__model__, ents_arr, attrib_name, attrib_values, idx_or_key);
    }
    return;
}
function _setModelAttrib(__model__, attrib_name, attrib_value, idx_or_key) {
    if (typeof idx_or_key === 'number') {
        __model__.modeldata.attribs.set.setModelAttribListIdxVal(attrib_name, idx_or_key, attrib_value);
    }
    if (typeof idx_or_key === 'string') {
        __model__.modeldata.attribs.set.setModelAttribDictKeyVal(attrib_name, idx_or_key, attrib_value);
    }
    else {
        __model__.modeldata.attribs.set.setModelAttribVal(attrib_name, attrib_value);
    }
}
function _setEachEntDifferentAttribValue(__model__, ents_arr, attrib_name, attrib_values, idx_or_key) {
    if (ents_arr.length !== attrib_values.length) {
        throw new Error('If multiple entities are being set to multiple values, then the number of entities must match the number of values.');
    }
    const ent_type = ents_arr[0][0];
    const ents_i = _getEntsIndices(__model__, ents_arr);
    for (let i = 0; i < ents_arr.length; i++) {
        // --- Error Check ---
        if (__model__.debug) {
            const fn_name = 'entities@' + attrib_name;
            checkAttribValue(fn_name, attrib_values[i]);
            if (idx_or_key !== null) {
                checkAttribIdxKey(fn_name, idx_or_key);
            }
        }
        // --- Error Check ---
        // if this is a complex type, make a deep copy
        let val = attrib_values[i];
        if (val instanceof Object) {
            val = lodash.cloneDeep(val);
        }
        if (typeof idx_or_key === 'number') {
            __model__.modeldata.attribs.set.setEntsAttribListIdxVal(ent_type, ents_i[i], attrib_name, idx_or_key, val);
        }
        if (typeof idx_or_key === 'string') {
            __model__.modeldata.attribs.set.setEntsAttribDictKeyVal(ent_type, ents_i[i], attrib_name, idx_or_key, val);
        }
        else {
            __model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_type, ents_i[i], attrib_name, val);
        }
    }
}
function _setEachEntSameAttribValue(__model__, ents_arr, attrib_name, attrib_value, idx_or_key) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'entities@' + attrib_name;
        checkAttribValue(fn_name, attrib_value);
    }
    // --- Error Check ---
    // if this is a complex type, make a deep copy
    if (attrib_value instanceof Object) {
        attrib_value = lodash.cloneDeep(attrib_value);
    }
    const ent_type = ents_arr[0][0];
    const ents_i = _getEntsIndices(__model__, ents_arr);
    if (typeof idx_or_key === 'number') {
        __model__.modeldata.attribs.set.setEntsAttribListIdxVal(ent_type, ents_i, attrib_name, idx_or_key, attrib_value);
    }
    else if (typeof idx_or_key === 'string') {
        __model__.modeldata.attribs.set.setEntsAttribDictKeyVal(ent_type, ents_i, attrib_name, idx_or_key, attrib_value);
    }
    else {
        __model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_type, ents_i, attrib_name, attrib_value);
    }
}
function _getEntsIndices(__model__, ents_arr) {
    const ent_type = ents_arr[0][0];
    const ents_i = [];
    for (let i = 0; i < ents_arr.length; i++) {
        if (ents_arr[i][0] !== ent_type) {
            throw new Error('If an attribute is being set for multiple entities, then they must all be of the same type.');
        }
        ents_i.push(ents_arr[i][1]);
    }
    return ents_i;
}
// ================================================================================================
/**
 * Get attribute values for one or more entities.
 * \n
 * If entities is null, then model level attributes will be returned.
 * \n
 * @param __model__
 * @param entities Entities, the entities to get the attribute values for.
 * @param attrib The attribute. Can be `name`, `[name, index]`, or `[name, key]`.
 * @returns One attribute value, or a list of attribute values.
 */
export function Get(__model__, entities, attrib) {
    // @ts-ignore
    if (entities !== null && getArrDepth(entities) === 2) {
        entities = uscore.flatten(entities);
    }
    // --- Error Check ---
    let ents_arr = null;
    let attrib_name;
    let attrib_idx_key;
    const fn_name = 'attrib.Get';
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null);
        }
        [attrib_name, attrib_idx_key] = checkAttribNameIdxKey(fn_name, attrib);
        checkAttribName(fn_name, attrib_name);
    }
    else {
        if (entities !== null && entities !== undefined) {
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            // [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
            ents_arr = idsBreak(entities);
        }
        [attrib_name, attrib_idx_key] = splitAttribNameIdxKey(fn_name, attrib);
    }
    // --- Error Check ---
    return _get(__model__, ents_arr, attrib_name, attrib_idx_key);
}
function _get(__model__, ents_arr, attrib_name, attrib_idx_key) {
    const has_idx_key = attrib_idx_key !== null && attrib_idx_key !== undefined;
    if (ents_arr === null) {
        // get the attrib values from the model
        if (typeof attrib_idx_key === 'number') {
            return __model__.modeldata.attribs.get.getModelAttribListIdxVal(attrib_name, attrib_idx_key);
        }
        else if (typeof attrib_idx_key === 'string') {
            return __model__.modeldata.attribs.get.getModelAttribDictKeyVal(attrib_name, attrib_idx_key);
        }
        else {
            return __model__.modeldata.attribs.get.getModelAttribVal(attrib_name);
        }
    }
    else if (ents_arr.length === 0) {
        return [];
    }
    else if (getArrDepth(ents_arr) === 1) {
        const [ent_type, ent_i] = ents_arr;
        // check if this is ID
        if (attrib_name === '_id') {
            if (has_idx_key) {
                throw new Error('The "_id" attribute does have an index.');
            }
            return EEntTypeStr[ent_type] + ent_i;
        }
        // get the attrib values from the ents
        let val;
        if (typeof attrib_idx_key === 'number') {
            val = __model__.modeldata.attribs.get.getEntAttribListIdxVal(ent_type, ent_i, attrib_name, attrib_idx_key);
        }
        else if (typeof attrib_idx_key === 'string') {
            val = __model__.modeldata.attribs.get.getEntAttribDictKeyVal(ent_type, ent_i, attrib_name, attrib_idx_key);
        }
        else {
            val = __model__.modeldata.attribs.get.getEntAttribVal(ent_type, ent_i, attrib_name);
        }
        // if this is a complex type, make a deep copy
        if (val instanceof Object) {
            val = lodash.cloneDeep(val);
        }
        return val;
    }
    else {
        return ents_arr.map(ent_arr => _get(__model__, ent_arr, attrib_name, attrib_idx_key));
    }
}
// ================================================================================================
/**
 * Add one or more attributes to the model.
 * The attribute will appear as a new column in the attribute table.
 * (At least one entity must have a value for the column to be visible in the attribute table).
 * All attribute values will be set to null.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param data_type_sel Enum, the data type for this attribute
 * @param attribs A single attribute name, or a list of attribute names.
 */
export function Add(__model__, ent_type_sel, data_type_sel, attribs) {
    // --- Error Check ---
    const fn_name = 'attrib.Add';
    const arg_name = 'ent_type_sel';
    let ent_type;
    if (__model__.debug) {
        if (ent_type_sel === 'ps' && attribs === 'xyz') {
            throw new Error(fn_name + ': ' + arg_name + ' The xyz attribute already exists.');
        }
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        if (ent_type === undefined) {
            throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' +
                'ps, _v, _e, _w, _f, pt, pl, pg, co, mo.');
        }
        // create an array of attrib names
        if (!Array.isArray(attribs)) {
            attribs = [attribs];
        }
        attribs = attribs;
        for (const attrib of attribs) {
            checkAttribName(fn_name, attrib);
        }
    }
    else {
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        // create an array of attrib names
        if (!Array.isArray(attribs)) {
            attribs = [attribs];
        }
        attribs = attribs;
    }
    // --- Error Check ---
    // set the data type
    let data_type = null;
    switch (data_type_sel) {
        case _EDataType.NUMBER:
            data_type = EAttribDataTypeStrs.NUMBER;
            break;
        case _EDataType.STRING:
            data_type = EAttribDataTypeStrs.STRING;
            break;
        case _EDataType.BOOLEAN:
            data_type = EAttribDataTypeStrs.BOOLEAN;
            break;
        case _EDataType.LIST:
            data_type = EAttribDataTypeStrs.LIST;
            break;
        case _EDataType.DICT:
            data_type = EAttribDataTypeStrs.DICT;
            break;
        default:
            throw new Error('Data type not recognised.');
            break;
    }
    // create the attribute
    for (const attrib of attribs) {
        __model__.modeldata.attribs.add.addAttrib(ent_type, attrib, data_type);
    }
}
// ================================================================================================
/**
 * Delete one or more attributes from the model.
 * The column in the attribute table will be deleted.
 * All values will also be deleted.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param attribs A single attribute name, or a list of attribute names. In 'null' all attributes will be deleted.
 */
export function Delete(__model__, ent_type_sel, attribs) {
    // --- Error Check ---
    const fn_name = 'attrib.Delete';
    const arg_name = 'ent_type_sel';
    let ent_type;
    if (__model__.debug) {
        if (ent_type_sel === 'ps' && attribs === 'xyz') {
            throw new Error(fn_name + ': ' + arg_name + ' Deleting xyz attribute is not allowed.');
        }
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        if (ent_type === undefined) {
            throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' +
                'ps, _v, _e, _w, _f, pt, pl, pg, co, mo.');
        }
        // create an array of attrib names
        if (attribs === null) {
            attribs = __model__.modeldata.attribs.getAttribNamesUser(ent_type);
        }
        if (!Array.isArray(attribs)) {
            attribs = [attribs];
        }
        attribs = attribs;
        for (const attrib of attribs) {
            checkAttribName(fn_name, attrib);
        }
    }
    else {
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        // create an array of attrib names
        if (attribs === null) {
            attribs = __model__.modeldata.attribs.getAttribNamesUser(ent_type);
        }
        if (!Array.isArray(attribs)) {
            attribs = [attribs];
        }
        attribs = attribs;
    }
    // --- Error Check ---
    // delete the attributes
    for (const attrib of attribs) {
        __model__.modeldata.attribs.del.delEntAttrib(ent_type, attrib);
    }
}
// ================================================================================================
/**
 * Rename an attribute in the model.
 * The header for column in the attribute table will be renamed.
 * All values will remain the same.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param old_attrib The old attribute name.
 * @param new_attrib The old attribute name.
 */
export function Rename(__model__, ent_type_sel, old_attrib, new_attrib) {
    if (ent_type_sel === 'ps' && old_attrib === 'xyz') {
        return;
    }
    // --- Error Check ---
    const fn_name = 'attrib.Rename';
    const arg_name = 'ent_type_sel';
    const ent_type = _getEntTypeFromStr(ent_type_sel);
    if (__model__.debug) {
        checkAttribName(fn_name, old_attrib);
        checkAttribName(fn_name, new_attrib);
        // --- Error Check ---
        // convert the ent_type_str to an ent_type
        if (ent_type === undefined) {
            throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' +
                'ps, _v, _e, _w, _f, pt, pl, pg, co, mo.');
        }
    }
    // create the attribute
    __model__.modeldata.attribs.renameAttrib(ent_type, old_attrib, new_attrib);
}
// ================================================================================================
/**
 * Push attributes up or down the hierarchy. The original attribute is not changed.
 * \n
 * @param __model__
 * @param entities Entities, the entities to push the attribute values for.
 * @param attrib The attribute. Can be `name`, `[name, index_or_key]`,
 * `[source_name, source_index_or_key, target_name]` or `[source_name, source_index_or_key, target_name, target_index_or_key]`.
 * @param ent_type_sel Enum, the target entity type where the attribute values should be pushed to.
 * @param method_sel Enum, the method for aggregating attribute values in cases where aggregation is necessary.
 */
export function Push(__model__, entities, attrib, ent_type_sel, method_sel) {
    if (entities !== null) {
        const depth = getArrDepth(entities);
        if (depth === 0) {
            entities = [entities];
        }
        else if (depth === 2) {
            // @ts-ignore
            entities = uscore.flatten(entities);
        }
    }
    // --- Error Check ---
    const fn_name = 'attrib.Push';
    let ents_arr = null;
    let source_attrib_name;
    let source_attrib_idx_key;
    let target_attrib_name;
    let target_attrib_idx_key;
    let source_ent_type;
    const indices = [];
    let target;
    let source_attrib = null;
    let target_attrib = null;
    if (Array.isArray(attrib)) {
        // set source attrib
        source_attrib = [
            attrib[0],
            (attrib.length > 1 ? attrib[1] : null)
        ];
        // set target attrib
        target_attrib = [
            (attrib.length > 2 ? attrib[2] : attrib[0]),
            (attrib.length > 3 ? attrib[3] : null)
        ];
    }
    else {
        source_attrib = [attrib, null];
        target_attrib = [attrib, null];
    }
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null);
        }
        [source_attrib_name, source_attrib_idx_key] = checkAttribNameIdxKey(fn_name, source_attrib);
        [target_attrib_name, target_attrib_idx_key] = checkAttribNameIdxKey(fn_name, target_attrib);
        // --- Error Check ---
        // get the source ent_type and indices
        source_ent_type = ents_arr[0][0];
        for (const ent_arr of ents_arr) {
            if (ent_arr[0] !== source_ent_type) {
                throw new Error('The entities must all be of the same type.');
            }
            indices.push(ent_arr[1]);
        }
        // check the names
        checkAttribName(fn_name, source_attrib_name);
        checkAttribName(fn_name, target_attrib_name);
        // get the target ent_type
        target = _getAttribPushTarget(ent_type_sel);
        if (source_ent_type === target) {
            throw new Error('The new attribute is at the same level as the existing attribute.');
        }
    }
    else {
        if (entities !== null && entities !== undefined) {
            ents_arr = idsBreak(entities);
        }
        [source_attrib_name, source_attrib_idx_key] = splitAttribNameIdxKey(fn_name, source_attrib);
        [target_attrib_name, target_attrib_idx_key] = splitAttribNameIdxKey(fn_name, target_attrib);
        // get the source ent_type and indices
        source_ent_type = ents_arr[0][0];
        for (const ent_arr of ents_arr) {
            indices.push(ent_arr[1]);
        }
        // get the target ent_type
        target = _getAttribPushTarget(ent_type_sel);
    }
    // get the method
    const method = _convertPushMethod(method_sel);
    // do the push
    __model__.modeldata.attribs.push.pushAttribVals(source_ent_type, source_attrib_name, source_attrib_idx_key, indices, target, target_attrib_name, target_attrib_idx_key, method);
}
export var _EPushMethodSel;
(function (_EPushMethodSel) {
    _EPushMethodSel["FIRST"] = "first";
    _EPushMethodSel["LAST"] = "last";
    _EPushMethodSel["AVERAGE"] = "average";
    _EPushMethodSel["MEDIAN"] = "median";
    _EPushMethodSel["SUM"] = "sum";
    _EPushMethodSel["MIN"] = "min";
    _EPushMethodSel["MAX"] = "max";
})(_EPushMethodSel || (_EPushMethodSel = {}));
function _convertPushMethod(select) {
    switch (select) {
        case _EPushMethodSel.AVERAGE:
            return EAttribPush.AVERAGE;
        case _EPushMethodSel.MEDIAN:
            return EAttribPush.MEDIAN;
        case _EPushMethodSel.SUM:
            return EAttribPush.SUM;
        case _EPushMethodSel.MIN:
            return EAttribPush.MIN;
        case _EPushMethodSel.MAX:
            return EAttribPush.MAX;
        case _EPushMethodSel.FIRST:
            return EAttribPush.FIRST;
        case _EPushMethodSel.LAST:
            return EAttribPush.LAST;
        default:
            break;
    }
}
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0cmliLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZXMvYmFzaWMvYXR0cmliLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFFSCxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRWhELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQ3RDLGlCQUFpQixFQUFFLHFCQUFxQixFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFbEcsT0FBTyxNQUFNLE1BQU0sWUFBWSxDQUFDO0FBRWhDLE9BQU8sRUFBTyxRQUFRLEVBQ2xCLFdBQVcsRUFBb0IsV0FBVyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDaEksT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLDZEQUE2RCxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUMzRSxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxtR0FBbUc7QUFFbkcsTUFBTSxDQUFOLElBQVksU0FVWDtBQVZELFdBQVksU0FBUztJQUNqQix3QkFBYSxDQUFBO0lBQ2Isd0JBQWEsQ0FBQTtJQUNiLHdCQUFhLENBQUE7SUFDYix3QkFBYSxDQUFBO0lBQ2Isd0JBQWEsQ0FBQTtJQUNiLHlCQUFhLENBQUE7SUFDYix5QkFBYSxDQUFBO0lBQ2Isd0JBQWEsQ0FBQTtJQUNiLHdCQUFhLENBQUE7QUFDakIsQ0FBQyxFQVZXLFNBQVMsS0FBVCxTQUFTLFFBVXBCO0FBQ0QsTUFBTSxDQUFOLElBQVksZUFXWDtBQVhELFdBQVksZUFBZTtJQUN2Qiw4QkFBYSxDQUFBO0lBQ2IsOEJBQWEsQ0FBQTtJQUNiLDhCQUFhLENBQUE7SUFDYiw4QkFBYSxDQUFBO0lBQ2IsOEJBQWEsQ0FBQTtJQUNiLCtCQUFhLENBQUE7SUFDYiwrQkFBYSxDQUFBO0lB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