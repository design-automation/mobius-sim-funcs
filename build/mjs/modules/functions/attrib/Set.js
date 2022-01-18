import { getArrDepth, idsBreak } from '@design-automation/mobius-sim';
import { cloneDeep } from 'lodash';
import uscore from 'underscore';
import { checkAttribIdxKey, checkAttribName, checkAttribNameIdxKey, checkAttribValue, splitAttribNameIdxKey, } from '../../../_check_attribs';
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
export function Set(__model__, entities, attrib, value, method) {
    // if entities is null, then we are setting model attributes
    // @ts-ignore
    if (entities !== null && getArrDepth(entities) === 2) {
        entities = uscore.flatten(entities);
    }
    // --- Error Check ---
    const fn_name = "attrib.Set";
    let ents_arr = null;
    let attrib_name;
    let attrib_idx_key;
    if (__model__.debug) {
        // if (value === undefined) {
        //     throw new Error(fn_name + ': value is undefined');
        // }
        ents_arr = checkIDs(__model__, fn_name, "entities", entities, [ID.isNull, ID.isID, ID.isIDL1], null);
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
    if (typeof idx_or_key === "number") {
        __model__.modeldata.attribs.set.setModelAttribListIdxVal(attrib_name, idx_or_key, attrib_value);
    }
    if (typeof idx_or_key === "string") {
        __model__.modeldata.attribs.set.setModelAttribDictKeyVal(attrib_name, idx_or_key, attrib_value);
    }
    else {
        __model__.modeldata.attribs.set.setModelAttribVal(attrib_name, attrib_value);
    }
}
function _setEachEntDifferentAttribValue(__model__, ents_arr, attrib_name, attrib_values, idx_or_key) {
    if (ents_arr.length !== attrib_values.length) {
        throw new Error("If multiple entities are being set to multiple values, then the number of entities must match the number of values.");
    }
    const ent_type = ents_arr[0][0];
    const ents_i = _getEntsIndices(__model__, ents_arr);
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
        let val = attrib_values[i];
        if (val instanceof Object) {
            val = cloneDeep(val);
        }
        if (typeof idx_or_key === "number") {
            __model__.modeldata.attribs.set.setEntsAttribListIdxVal(ent_type, ents_i[i], attrib_name, idx_or_key, val);
        }
        if (typeof idx_or_key === "string") {
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
        const fn_name = "entities@" + attrib_name;
        checkAttribValue(fn_name, attrib_value);
    }
    // --- Error Check ---
    // if this is a complex type, make a deep copy
    if (attrib_value instanceof Object) {
        attrib_value = cloneDeep(attrib_value);
    }
    const ent_type = ents_arr[0][0];
    const ents_i = _getEntsIndices(__model__, ents_arr);
    if (typeof idx_or_key === "number") {
        __model__.modeldata.attribs.set.setEntsAttribListIdxVal(ent_type, ents_i, attrib_name, idx_or_key, attrib_value);
    }
    else if (typeof idx_or_key === "string") {
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
            throw new Error("If an attribute is being set for multiple entities, then they must all be of the same type.");
        }
        ents_i.push(ents_arr[i][1]);
    }
    return ents_i;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2F0dHJpYi9TZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBVyxRQUFRLEVBQXNDLE1BQU0sK0JBQStCLENBQUM7QUFDbkgsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNuQyxPQUFPLE1BQU0sTUFBTSxZQUFZLENBQUM7QUFFaEMsT0FBTyxFQUNILGlCQUFpQixFQUNqQixlQUFlLEVBQ2YscUJBQXFCLEVBQ3JCLGdCQUFnQixFQUNoQixxQkFBcUIsR0FDeEIsTUFBTSx5QkFBeUIsQ0FBQztBQUNqQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBSW5ELG1HQUFtRztBQUNuRzs7Ozs7Ozs7OztHQVVHO0FBQ0gsTUFBTSxVQUFVLEdBQUcsQ0FDZixTQUFrQixFQUNsQixRQUErQixFQUMvQixNQUEwQyxFQUMxQyxLQUE0QyxFQUM1QyxNQUFhO0lBRWIsNERBQTREO0lBQzVELGFBQWE7SUFDYixJQUFJLFFBQVEsS0FBSyxJQUFJLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNsRCxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUN2QztJQUNELHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxZQUFZLENBQUM7SUFDN0IsSUFBSSxRQUFRLEdBQWdDLElBQUksQ0FBQztJQUNqRCxJQUFJLFdBQW1CLENBQUM7SUFDeEIsSUFBSSxjQUErQixDQUFDO0lBQ3BDLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQiw2QkFBNkI7UUFDN0IseURBQXlEO1FBQ3pELElBQUk7UUFDSixRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxF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