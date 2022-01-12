/**
 * The `make` module has functions for making new entities in the model.
 * All these functions return the IDs of the entities that are created.
 * @module
 */
import {
    arrMakeFlat,
    GIModel,
    idsBreak,
    idsMake,
    isEmptyArr,
    TEntTypeIdx,
    TId,
    TPlane,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../../_check_ids';
import * as chk from '../../../_check_types';
import { _ECutMethod } from './_enum';



// ================================================================================================
/**
 * Cuts polygons and polylines using a plane.
 *
 * If the 'keep_above' method is selected, then only the part of the cut entities above the plane are kept.
 * If the 'keep_below' method is selected, then only the part of the cut entities below the plane are kept.
 * If the 'keep_both' method is selected, then both the parts of the cut entities are kept.
 *
 * Currently does not support cutting polygons with holes. TODO
 *
 * If 'keep_both' is selected, returns a list of two lists.
 * [[entities above the plane], [entities below the plane]].
 *
 * @param __model__
 * @param entities Polylines or polygons, or entities from which polyline or polygons can be extracted.
 * @param plane The plane to cut with.
 * @param method Enum, select the method for cutting.
 * @returns Entities, a list of three lists of entities resulting from the cut.

 */
export function Cut(__model__: GIModel, entities: TId|TId[], plane: TPlane, method: _ECutMethod): TId[]|[TId[], TId[]] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) {
        if (method === _ECutMethod.KEEP_BOTH) { return [[], []]; }
        return [];
    }
    // --- Error Check ---
    const fn_name = 'make.Cut';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1], null) as TEntTypeIdx[];
        chk.checkArgs(fn_name, 'plane', plane, [chk.isPln]);
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const [above, below]: [TEntTypeIdx[], TEntTypeIdx[]] = __model__.modeldata.funcs_make.cut(ents_arr, plane, method);
    // return the result
    switch (method) {
        case _ECutMethod.KEEP_ABOVE:
            return idsMake(above) as TId[];
        case _ECutMethod.KEEP_BELOW:
            return idsMake(below) as TId[];
        default:
            return [idsMake(above), idsMake(below)] as [TId[], TId[]];
    }
}
