"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__checkModel__ = exports.__select__ = exports.__stringify__ = exports.__clone__ = exports.__merge__ = exports.__postprocess__ = exports.__preprocess__ = exports.__new__ = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
//  ===============================================================================================
//  Functions used by Mobius
//  ===============================================================================================
/**
 * Creates a new empty model.
 *
 * @returns New model empty.
 */
function __new__() {
    const model = new mobius_sim_1.GIModel();
    // model.modeldata.attribs.add.addAttrib(EEntType.POSI, EAttribNames.COORDS, EAttribDataTypeStrs.LIST);
    return model;
}
exports.__new__ = __new__;
//  ===============================================================================================
/**
 * A function to preprocess the model, before it enters the node.
 * In cases where there is more than one model connected to a node,
 * the preprocess function will be called before the merge function.
 *
 * @param model The model to preprocess.
 */
function __preprocess__(__model__) {
}
exports.__preprocess__ = __preprocess__;
//  ===============================================================================================
/**
 * A function to postprocess the model, after it enters the node.
 *
 * @param model The model to postprocess.
 */
function __postprocess__(__model__) {
    // TODO
    // Remove all undefined values for the arrays
}
exports.__postprocess__ = __postprocess__;
//  ===============================================================================================
/**
 * Merges the second model into the first model. The geometry, attribues, and groups are all merged.
 * If the models contain contain groups with the same names, then the groups will be merged.
 *
 * @param model1 The model to merge into.
 * @param model2 The model to merge from    .
 */
function __merge__(model1, model2) {
    // model1.merge(model2);
    throw new Error('Deprecated');
}
exports.__merge__ = __merge__;
//  ===============================================================================================
/**
 * Clone a model.
 *
 * @param model The model to clone.
 */
function __clone__(model) {
    // return model.clone();
    throw new Error('Deprecated');
}
exports.__clone__ = __clone__;
//  ===============================================================================================
/**
 * Returns a string representation of this model.
 * @param __model__
 */
function __stringify__(__model__) {
    // return JSON.stringify(__model__.getModelData());
    throw new Error('Not implemented');
}
exports.__stringify__ = __stringify__;
//  ===============================================================================================
/**
 * Select entities in the model.
 * @param __model__
 */
function __select__(__model__, ents_id, var_name) {
    const start = performance.now();
    __model__.modeldata.geom.selected[__model__.getActiveSnapshot()] = [];
    const activeSelected = __model__.modeldata.geom.selected[__model__.getActiveSnapshot()];
    ents_id = ((Array.isArray(ents_id)) ? ents_id : [ents_id]);
    const [ents_id_flat, ents_indices] = _flatten(ents_id);
    const ents_arr = (0, mobius_sim_1.idsBreak)(ents_id_flat);
    const attrib_name = '_' + var_name;
    for (let i = 0; i < ents_arr.length; i++) {
        const ent_arr = ents_arr[i];
        const ent_indices = ents_indices[i];
        const attrib_value = var_name + '[' + ent_indices.join('][') + ']';
        activeSelected.push(ent_arr);
        if (!__model__.modeldata.attribs.query.hasEntAttrib(ent_arr[0], attrib_name)) {
            __model__.modeldata.attribs.add.addAttrib(ent_arr[0], attrib_name, mobius_sim_1.EAttribDataTypeStrs.STRING);
        }
        __model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_arr[0], ent_arr[1], attrib_name, attrib_value);
    }
}
exports.__select__ = __select__;
function _flatten(arrs) {
    const arr_flat = [];
    const arr_indices = [];
    let count = 0;
    for (const item of arrs) {
        if (Array.isArray(item)) {
            const [arr_flat2, arr_indices2] = _flatten(item);
            for (let i = 0; i < arr_flat2.length; i++) {
                if (arr_flat.indexOf(arr_flat2[i]) !== -1) {
                    continue;
                }
                arr_flat.push(arr_flat2[i]);
                arr_indices2[i].unshift(count);
                arr_indices.push(arr_indices2[i]);
            }
        }
        else {
            arr_flat.push(item);
            arr_indices.push([count]);
        }
        count += 1;
    }
    return [arr_flat, arr_indices];
}
//  ===============================================================================================
/**
 * Checks the model for internal consistency.
 * @param __model__
 */
function __checkModel__(__model__) {
    return __model__.check();
}
exports.__checkModel__ = __checkModel__;
// Moved to attrib.ts
//  ===============================================================================================
/**
//  * Sets an attribute value in the model.
//  * @param __model__
//  */
// export function __setAttrib__(__model__: GIModel, entities: TId|TId[]|TId[][],
//                               attrib_name: string, attrib_values: TAttribDataTypes|TAttribDataTypes[], attrib_index?: number): void {
//     // @ts-ignore
//     if (entities !== null && getArrDepth(entities) === 2) { entities = __.flatten(entities); }
//     // --- Error Check ---
//     const fn_name = 'entities@' + attrib_name;
//     let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
//     if (entities !== null && entities !== undefined) {
//         ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
//     }
//     checkAttribName(fn_name , attrib_name);
//     // --- Error Check ---
//     _setAttrib(__model__, ents_arr, attrib_name, attrib_values, attrib_index);
// }
// function _setAttrib(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[],
//         attrib_name: string, attrib_values: TAttribDataTypes|TAttribDataTypes[], attrib_index?: number): void {
//     // check the ents_arr
//     if (ents_arr === null) {
//         _setModelAttrib(__model__, attrib_name, attrib_values as TAttribDataTypes, attrib_index);
//         return;
//     } else if (ents_arr.length === 0) {
//         return;
//     } else if (getArrDepth(ents_arr) === 1) {
//         ents_arr = [ents_arr] as TEntTypeIdx[];
//     }
//     ents_arr = ents_arr as TEntTypeIdx[];
//     // check attrib_values
//     // are we setting a list of ents to a list of values?
//     const attrib_values_depth: number = getArrDepth(attrib_values);
//     if (attrib_values_depth === 2) {
//         // attrib values is a list of lists
//         // we assume that we are trying to set a different value for each ent
//         // so we expect the list lengths to be equal
//         _setEachEntDifferentAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes[], attrib_index);
//         return;
//     } else if (attrib_values_depth === 1) {
//         // check if ents_arr.length equals attrib_values.length
//         // then check if the first ent already has an attrib with the specified name
//         // if both are true, then we assume we are trying to set each ent to each value
//         const attrib_values_arr: number[]|string[] = attrib_values as number[]|string[];
//         if (ents_arr.length === attrib_values_arr.length) {
//             const first_ent_type: number = ents_arr[0][0];
//             if (__model__.modeldata.attribs.query.hasAttrib(first_ent_type, attrib_name)) {
//                 _setEachEntDifferentAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes[], attrib_index);
//                 return;
//             }
//         }
//     }
//     // all ents get the same attribute value
//     _setEachEntSameAttribValue(__model__, ents_arr, attrib_name, attrib_values as TAttribDataTypes, attrib_index);
//     return;
// }
// function _setModelAttrib(__model__: GIModel, attrib_name: string, attrib_value: TAttribDataTypes, idx_or_key?: number): void {
//     if (typeof idx_or_key === 'number') {
//         __model__.modeldata.attribs.set.setModelAttribListIdxVal(attrib_name, idx_or_key, attrib_value);
//     } if (typeof idx_or_key === 'string') {
//         __model__.modeldata.attribs.set.setModelAttribDictKeyVal(attrib_name, idx_or_key, attrib_value);
//     } else {
//         __model__.modeldata.attribs.set.setModelAttribVal(attrib_name, attrib_value);
//     }
// }
// function _setEachEntDifferentAttribValue(__model__: GIModel, ents_arr: TEntTypeIdx[],
//         attrib_name: string, attrib_values: TAttribDataTypes[], attrib_index?: number): void {
//     if (ents_arr.length !== attrib_values.length) {
//         throw new Error(
//             'If multiple attributes are being set to multiple values, then the number of entities must match the number of values.');
//     }
//     const ent_type: number = ents_arr[0][0];
//     const ents_i: number[] = _getEntsIndices(__model__, ents_arr);
//     for (let i = 0; i < ents_arr.length; i++) {
//         // --- Error Check ---
//         const fn_name = 'entities@' + attrib_name;
//         checkAttribValue(fn_name , attrib_values[i], attrib_index);
//         // --- Error Check ---
//         if (attrib_index !== null && attrib_index !== undefined) {
//             __model__.modeldata.attribs.set.setAttribListIdxVal(ent_type, ents_i[i], attrib_name, attrib_index, attrib_values[i] as number|string);
//         } else {
//             __model__.modeldata.attribs.set.setAttribVal(ent_type, ents_i[i], attrib_name, attrib_values[i]);
//         }
//     }
// }
// function _setEachEntSameAttribValue(__model__: GIModel, ents_arr: TEntTypeIdx[],
//         attrib_name: string, attrib_value: TAttribDataTypes, attrib_index?: number): void {
//     // --- Error Check ---
//     const fn_name = 'entities@' + attrib_name;
//     checkAttribValue(fn_name , attrib_value, attrib_index);
//     // --- Error Check ---
//     const ent_type: number = ents_arr[0][0];
//     const ents_i: number[] = _getEntsIndices(__model__, ents_arr);
//     if (attrib_index !== null && attrib_index !== undefined) {
//         __model__.modeldata.attribs.set.setAttribListIdxVal(ent_type, ents_i, attrib_name, attrib_index, attrib_value as number|string);
//     } else {
//         __model__.modeldata.attribs.set.setAttribVal(ent_type, ents_i, attrib_name, attrib_value);
//     }
// }
// function _getEntsIndices(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[] {
//     const ent_type: number = ents_arr[0][0];
//     const ents_i: number[] = [];
//     for (let i = 0; i < ents_arr.length; i++) {
//         if (ents_arr[i][0] !== ent_type) {
//             throw new Error('If an attribute is being set for multiple entities, then they must all be of the same type.');
//         }
//         ents_i.push(ents_arr[i][1]);
//     }
//     return ents_i;
// }
// //  ===============================================================================================
// /**
//  * Gets an attribute value from the model.
//  * @param __model__
//  */
// export function __getAttrib__(__model__: GIModel, entities: TId|TId[]|TId[][],
//         attrib_name: string, idx_or_key?: number|string): TAttribDataTypes|TAttribDataTypes[] {
//     // @ts-ignore
//     if (entities !== null && getArrDepth(entities) === 2) { entities = __.flatten(entities); }
//     // --- Error Check ---
//     const fn_name = 'Inline.__getAttrib__';
//     let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
//     if (entities !== null && entities !== undefined) {
//         ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx|TEntTypeIdx[];
//     }
//     checkCommTypes(fn_name, 'attrib_name', attrib_name, [TypeCheckObj.isString]);
//     if (idx_or_key !== null && idx_or_key !== undefined) {
//         checkCommTypes(fn_name, 'attrib_index', idx_or_key, [TypeCheckObj.isNumber, TypeCheckObj.isString]);
//     }
//     // --- Error Check ---
//     return _getAttrib(__model__, ents_arr, attrib_name, idx_or_key);
// }
// function _getAttrib(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[],
//         attrib_name: string, idx_or_key?: number|string): TAttribDataTypes|TAttribDataTypes[] {
//     const has_idx_or_key: boolean = idx_or_key !== null && idx_or_key !== undefined;
//     if (ents_arr === null) {
//         if (has_idx_or_key && typeof idx_or_key === 'number') {
//             return __model__.modeldata.attribs.get.getModelAttribListIdxVal(attrib_name, idx_or_key);
//         } else if (has_idx_or_key && typeof idx_or_key === 'string') {
//             return __model__.modeldata.attribs.get.getModelAttribDictKeyVal(attrib_name, idx_or_key);
//         } else {
//             return __model__.modeldata.attribs.get.getModelAttribVal(attrib_name);
//         }
//     } else if (ents_arr.length === 0) {
//         return;
//     } else if (getArrDepth(ents_arr) === 1) {
//         const [ent_type, ent_i]: TEntTypeIdx = ents_arr as TEntTypeIdx;
//         if (attrib_name === 'id') {
//             if (has_idx_or_key) { throw new Error('The "id" attribute does have an index or key.'); }
//             return EEntTypeStr[ent_type] + ent_i as TAttribDataTypes;
//         } else if (has_idx_or_key && typeof idx_or_key === 'number') {
//             return __model__.modeldata.attribs.get.getAttribListIdxVal(ent_type, attrib_name, ent_i, idx_or_key);
//         } else if (has_idx_or_key && typeof idx_or_key === 'string') {
//             return __model__.modeldata.attribs.get.getAttribDictKeyVal(ent_type, attrib_name, ent_i, idx_or_key);
//         } else {
//             return __model__.modeldata.attribs.get.getAttribVal(ent_type, attrib_name, ent_i);
//         }
//     } else {
//         return (ents_arr as TEntTypeIdx[]).map( ent_arr =>
//             _getAttrib(__model__, ent_arr, attrib_name, idx_or_key) ) as TAttribDataTypes[];
//     }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX21vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZXMvX21vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhEQUFvRztBQUVwRyxtR0FBbUc7QUFDbkcsNEJBQTRCO0FBQzVCLG1HQUFtRztBQUNuRzs7OztHQUlHO0FBQ0gsU0FBZ0IsT0FBTztJQUNuQixNQUFNLEtBQUssR0FBWSxJQUFJLG9CQUFPLEVBQUUsQ0FBQztJQUNyQyx1R0FBdUc7SUFDdkcsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQztBQUpELDBCQUlDO0FBQ0QsbUdBQW1HO0FBQ25HOzs7Ozs7R0FNRztBQUNILFNBQWdCLGNBQWMsQ0FBQyxTQUFrQjtBQUVqRCxDQUFDO0FBRkQsd0NBRUM7QUFDRCxtR0FBbUc7QUFDbkc7Ozs7R0FJRztBQUNILFNBQWdCLGVBQWUsQ0FBQyxTQUFrQjtJQUM5QyxPQUFPO0lBQ1AsNkNBQTZDO0FBQ2pELENBQUM7QUFIRCwwQ0FHQztBQUNELG1HQUFtRztBQUNuRzs7Ozs7O0dBTUc7QUFDSCxTQUFnQixTQUFTLENBQUMsTUFBZSxFQUFFLE1BQWU7SUFDdEQsd0JBQXdCO0lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUhELDhCQUdDO0FBQ0QsbUdBQW1HO0FBQ25HOzs7O0dBSUc7QUFDSCxTQUFnQixTQUFTLENBQUMsS0FBYztJQUNwQyx3QkFBd0I7SUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBSEQsOEJBR0M7QUFDRCxtR0FBbUc7QUFDbkc7OztHQUdHO0FBQ0gsU0FBZ0IsYUFBYSxDQUFDLFNBQWtCO0lBQzVDLG1EQUFtRDtJQUNuRCxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUhELHNDQUdDO0FBQ0QsbUdBQW1HO0FBQ25HOzs7R0FHRztBQUNILFNBQWdCLFVBQVUsQ0FBQyxTQUFrQixFQUFFLE9BQW1DLEVBQUUsUUFBZ0I7SUFDaEcsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUN0RSxNQUFNLGNBQWMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztJQUN4RixPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFhLENBQUM7SUFDdkUsTUFBTSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkQsTUFBTSxRQUFRLEdBQWtCLElBQUEscUJBQVEsRUFBQyxZQUFZLENBQWtCLENBQUM7SUFDeEUsTUFBTSxXQUFXLEdBQVcsR0FBRyxHQUFHLFFBQVEsQ0FBQztJQUMzQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0QyxNQUFNLE9BQU8sR0FBZ0IsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sV0FBVyxHQUFhLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxNQUFNLFlBQVksR0FBVyxRQUFRLEdBQUcsR0FBRyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQzNFLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxFQUFFO1lBQzFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxnQ0FBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNsRztRQUNELFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztLQUM3RztBQUNMLENBQUM7QUFsQkQsZ0NBa0JDO0FBQ0QsU0FBUyxRQUFRLENBQUMsSUFBZ0M7SUFDOUMsTUFBTSxRQUFRLEdBQWEsRUFBRSxDQUFDO0lBQzlCLE1BQU0sV0FBVyxHQUFlLEVBQUUsQ0FBQztJQUNuQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksRUFBRTtRQUNyQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDckIsTUFBTSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3ZDLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtvQkFBRSxTQUFTO2lCQUFFO2dCQUN4RCxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMvQixXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3JDO1NBQ0o7YUFBTTtZQUNILFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEIsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDN0I7UUFDRCxLQUFLLElBQUksQ0FBQyxDQUFDO0tBQ2Q7SUFDRCxPQUFPLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFDRCxtR0FBbUc7QUFDbkc7OztHQUdHO0FBQ0gsU0FBZ0IsY0FBYyxDQUFDLFNBQWtCO0lBQzdDLE9BQU8sU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzdCLENBQUM7QUFGRCx3Q0FFQztBQUVELHFCQUFxQjtBQUNyQixtR0FBbUc7QUFDbkc7OztNQUdNO0FBQ04saUZBQWlGO0FBQ2pGLHdJQUF3STtBQUN4SSxvQkFBb0I7QUFDcEIsaUdBQWlHO0FBQ2pHLDZCQUE2QjtBQUM3QixpREFBaUQ7QUFDakQsc0RBQXNEO0FBQ3RELHlEQUF5RDtBQUN6RCxvSkFBb0o7QUFDcEosUUFBUTtBQUNSLDhDQUE4QztBQUM5Qyw2QkFBNkI7QUFDN0IsaUZBQWlGO0FBQ2pGLElBQUk7QUFDSiwrRUFBK0U7QUFDL0Usa0hBQWtIO0FBQ2xILDRCQUE0QjtBQUM1QiwrQkFBK0I7QUFDL0Isb0dBQW9HO0FBQ3BHLGtCQUFrQjtBQUNsQiwwQ0FBMEM7QUFDMUMsa0JBQWtCO0FBQ2xCLGdEQUFnRDtBQUNoRCxrREFBa0Q7QUFDbEQsUUFBUTtBQUNSLDRDQUE0QztBQUM1Qyw2QkFBNkI7QUFDN0IsNERBQTREO0FBQzVELHNFQUFzRTtBQUN0RSx1Q0FBdUM7QUFDdkMsOENBQThDO0FBQzlDLGdGQUFnRjtBQUNoRix1REFBdUQ7QUFDdkQsZ0lBQWdJO0FBQ2hJLGtCQUFrQjtBQUNsQiw4Q0FBOEM7QUFDOUMsa0VBQWtFO0FBQ2xFLHVGQUF1RjtBQUN2RiwwRkFBMEY7QUFDMUYsMkZBQTJGO0FBQzNGLDhEQUE4RDtBQUM5RCw2REFBNkQ7QUFDN0QsOEZBQThGO0FBQzlGLHdJQUF3STtBQUN4SSwwQkFBMEI7QUFDMUIsZ0JBQWdCO0FBQ2hCLFlBQVk7QUFDWixRQUFRO0FBQ1IsK0NBQStDO0FBQy9DLHFIQUFxSDtBQUNySCxjQUFjO0FBQ2QsSUFBSTtBQUNKLGlJQUFpSTtBQUNqSSw0Q0FBNEM7QUFDNUMsMkdBQTJHO0FBQzNHLDhDQUE4QztBQUM5QywyR0FBMkc7QUFDM0csZUFBZTtBQUNmLHdGQUF3RjtBQUN4RixRQUFRO0FBQ1IsSUFBSTtBQUNKLHdGQUF3RjtBQUN4RixpR0FBaUc7QUFDakcsc0RBQXNEO0FBQ3RELDJCQUEyQjtBQUMzQix3SUFBd0k7QUFDeEksUUFBUTtBQUNSLCtDQUErQztBQUMvQyxxRUFBcUU7QUFDckUsa0RBQWtEO0FBQ2xELGlDQUFpQztBQUNqQyxxREFBcUQ7QUFDckQsc0VBQXNFO0FBQ3RFLGlDQUFpQztBQUNqQyxxRUFBcUU7QUFDckUsc0pBQXNKO0FBQ3RKLG1CQUFtQjtBQUNuQixnSEFBZ0g7QUFDaEgsWUFBWTtBQUNaLFFBQVE7QUFDUixJQUFJO0FBQ0osbUZBQW1GO0FBQ25GLDhGQUE4RjtBQUM5Riw2QkFBNkI7QUFDN0IsaURBQWlEO0FBQ2pELDhEQUE4RDtBQUM5RCw2QkFBNkI7QUFDN0IsK0NBQStDO0FBQy9DLHFFQUFxRTtBQUNyRSxpRUFBaUU7QUFDakUsMklBQTJJO0FBQzNJLGVBQWU7QUFDZixxR0FBcUc7QUFDckcsUUFBUTtBQUNSLElBQUk7QUFDSixvRkFBb0Y7QUFDcEYsK0NBQStDO0FBQy9DLG1DQUFtQztBQUNuQyxrREFBa0Q7QUFDbEQsNkNBQTZDO0FBQzdDLDhIQUE4SDtBQUM5SCxZQUFZO0FBQ1osdUNBQXVDO0FBQ3ZDLFFBQVE7QUFDUixxQkFBcUI7QUFDckIsSUFBSTtBQUNKLHNHQUFzRztBQUN0RyxNQUFNO0FBQ04sNkNBQTZDO0FBQzdDLHNCQUFzQjtBQUN0QixNQUFNO0FBQ04saUZBQWlGO0FBQ2pGLGtHQUFrRztBQUNsRyxvQkFBb0I7QUFDcEIsaUdBQWlHO0FBQ2pHLDZCQUE2QjtBQUM3Qiw4Q0FBOEM7QUFDOUMsc0RBQXNEO0FBQ3RELHlEQUF5RDtBQUN6RCxvSkFBb0o7QUFDcEosUUFBUTtBQUNSLG9GQUFvRjtBQUNwRiw2REFBNkQ7QUFDN0QsK0dBQStHO0FBQy9HLFFBQVE7QUFDUiw2QkFBNkI7QUFDN0IsdUVBQXVFO0FBQ3ZFLElBQUk7QUFDSiwrRUFBK0U7QUFDL0Usa0dBQWtHO0FBQ2xHLHVGQUF1RjtBQUN2RiwrQkFBK0I7QUFDL0Isa0VBQWtFO0FBQ2xFLHdHQUF3RztBQUN4Ryx5RUFBeUU7QUFDekUsd0dBQXdHO0FBQ3hHLG1CQUFtQjtBQUNuQixxRkFBcUY7QUFDckYsWUFBWTtBQUNaLDBDQUEwQztBQUMxQyxrQkFBa0I7QUFDbEIsZ0RBQWdEO0FBQ2hELDBFQUEwRTtBQUMxRSxzQ0FBc0M7QUFDdEMsd0dBQXdHO0FBQ3hHLHdFQUF3RTtBQUN4RSx5RUFBeUU7QUFDekUsb0hBQW9IO0FBQ3BILHlFQUF5RTtBQUN6RSxvSEFBb0g7QUFDcEgsbUJBQW1CO0FBQ25CLGlHQUFpRztBQUNqRyxZQUFZO0FBQ1osZUFBZTtBQUNmLDZEQUE2RDtBQUM3RCwrRkFBK0Y7QUFDL0YsUUFBUTtBQUNSLElBQUkifQ==