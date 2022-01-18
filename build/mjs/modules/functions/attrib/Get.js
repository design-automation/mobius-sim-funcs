import { EEntTypeStr, getArrDepth, idsBreak, } from '@design-automation/mobius-sim';
import { cloneDeep } from 'lodash';
import uscore from 'underscore';
import { checkAttribName, checkAttribNameIdxKey, splitAttribNameIdxKey } from '../../../_check_attribs';
import { checkIDs, ID } from '../../../_check_ids';
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
            val = cloneDeep(val);
        }
        return val;
    }
    else {
        return ents_arr.map(ent_arr => _get(__model__, ent_arr, attrib_name, attrib_idx_key));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2F0dHJpYi9HZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFdBQVcsRUFDWCxXQUFXLEVBRVgsUUFBUSxHQUlYLE1BQU0sK0JBQStCLENBQUM7QUFDdkMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNuQyxPQUFPLE1BQU0sTUFBTSxZQUFZLENBQUM7QUFFaEMsT0FBTyxFQUFFLGVBQWUsRUFBRSxxQkFBcUIsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3hHLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFJbkQsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sVUFBVSxHQUFHLENBQUMsU0FBa0IsRUFBRSxRQUErQixFQUNuRSxNQUEwQztJQUMxQyxhQUFhO0lBQ2IsSUFBSSxRQUFRLEtBQUssSUFBSSxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUFFO0lBQzlGLHNCQUFzQjtJQUN0QixJQUFJLFFBQVEsR0FBZ0MsSUFBSSxDQUFDO0lBQ2pELElBQUksV0FBbUIsQ0FBQztJQUN4QixJQUFJLGNBQStCLENBQUM7SUFDcEMsTUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDO0lBQzdCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixJQUFJLFFBQVEsS0FBSyxJQUFJLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUM3QyxRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFB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