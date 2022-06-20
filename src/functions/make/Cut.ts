import {Sim, ENT_TYPE} from '../../mobius_sim';
import { TPlane } from '../_common/consts';
import { arrMakeFlat, isEmptyArr } from '../_common/_arrs';
import { _ECutMethod } from './_enum';

// ================================================================================================
/**
 * Cuts polygons and polylines using a plane.
 * \n
 * - If the 'keep\_above' method is selected, then only the part of the cut entities above the plane are kept.
 * - If the 'keep\_below' method is selected, then only the part of the cut entities below the plane are kept.
 * - If the 'keep\_both' method is selected, then both the parts of the cut entities are kept.
 * \n
 * Currently does not support cutting polygons with holes. 
 * \n
 * If 'keep\_both' is selected, returns a list of two lists.
 * `[[entities above the plane], [entities below the plane]]`.
 *
 * @param __model__
 * @param entities Polylines or polygons, or entities from which polyline or polygons can be extracted.
 * @param plane The plane to cut with.
 * @param method Enum, the method for cutting: `'keep_above', 'keep_below'` or `'keep_both'`.
 * @returns Entities, a list of three lists of entities resulting from the cut.

 */
export function Cut(__model__: Sim, entities: string|string[], plane: TPlane, method: _ECutMethod): string[]|[string[], string[]] {
    entities = arrMakeFlat(entities) as string[];
    if (isEmptyArr(entities)) {
        if (method === _ECutMethod.KEEP_BOTH) { return [[], []]; }
        return [];
    }
    // --------
    const [above, below]: [string[], string[]] = __model__.modeldata.funcs_make.cut(ents_arr, plane, method);
    // return the result
    switch (method) {
        case _ECutMethod.KEEP_ABOVE:
            return above as string[];
        case _ECutMethod.KEEP_BELOW:
            return below as string[];
        default:
            return [above, below] as [string[], string[]];
    }
}
