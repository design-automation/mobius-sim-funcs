import { arrMakeFlat, EEntType, GIModel, idsBreak, isEmptyArr, TEntTypeIdx, TId } from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';
import { _EDeleteMethod } from './_enum';




// ================================================================================================
/**
 * Deletes geometric entities: positions, points, polylines, polygons, and collections.
 * \n
 * - When deleting positions, any topology that requires those positions will also be deleted.
 * (For example, any vertices linked to the deleted position will also be deleted,
 * which may in turn result in some edges being deleted, and so forth.)
 * - When deleting objects (points, polylines, and polygons), topology is also deleted.
 * - When deleting collections, the objects and other collections in the collection are also deleted.
 * \n
 * Topological entities inside objects (wires, edges, vertices) cannot be deleted.
 * If a topological entity needs to be deleted, then the current approach is create a new object 
 * with the desired topology, and then to delete the original object.
 * \n
 * @param __model__
 * @param entities Positions, points, polylines, polygons, collections.
 * @param method Enum, delete or keep unused positions: `'delete_selected'` or `'keep_selected'`.
 * @returns void
 * @example `edit.Delete(polygon1, 'delete_selected')`
 * @example_info Deletes `polygon1` from the model. The topology for
 * `polygon1` will be deleted. In addition, any positions being used by `polygon1` will be deleted
 * only if they are not being used by other objects.
 * @example `edit.Delete(polygon1, 'keep_selected')`
 * @example_info Deletes everything except `polygon1` from the model. The topology and positions for
 * `polygon1` will not be deleted. 
 */
export function Delete(__model__: GIModel, entities: TId|TId[], method: _EDeleteMethod): void {
    if (entities === null) {
        if (method === _EDeleteMethod.KEEP_SELECTED) { return; }
        if (method === _EDeleteMethod.DELETE_SELECTED) { __model__.modeldata.funcs_edit.delete(null, false);  return; }
    }
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'edit.Delete';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL1],
        [EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    switch (method) {
        case _EDeleteMethod.DELETE_SELECTED:
            if (isEmptyArr(entities)) { return; }
            __model__.modeldata.funcs_edit.delete(ents_arr, false); // do not invert
            return;
        case _EDeleteMethod.KEEP_SELECTED:
            if (isEmptyArr(entities)) { __model__.modeldata.funcs_edit.delete(null, false); return; }
            __model__.modeldata.funcs_edit.delete(ents_arr, true); // invert
            return;
        default:
            throw new Error(fn_name + ' : Method not recognised.');
    }
}
