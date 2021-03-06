import { arrMakeFlat, EEntType, GIModel, idsBreak, isEmptyArr, TEntTypeIdx, TId } from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';




// ================================================================================================
/**
 * Shifts the order of the edges in a closed wire.
 * \n
 * In a closed wire (either a closed polyline or polygon), the edges form a closed ring. Any edge 
 * (or vertex) could be the first edge of the ring. In some cases, it is useful to have an edge in 
 * a particular position in a ring. This function allows the edges to be shifted either forwards or 
 * backwards around the ring. The order of the edges in the ring will remain unchanged.
 * \n
 * - An offset of zero has no effect.
 * - An offset of 1 will shift the edges so that the second edge becomes the first edge.
 * - An offset of 2 will shift the edges so that the third edge becomes the first edge.
 * - An offset of -1 will shift the edges so that the last edge becomes the first edge.
 * \n
 * @param __model__
 * @param entities Wire, face, polyline, polygon.
 * @param offset The offset, a positive or negative integer.
 * @returns void
 * @example `edit.Shift(polygon1, 1)`
 * @example_info Shifts the edges in the polygon wire, so that every edge moves back by one position
 * in the ring. The first edge will become the last edge.
 * @example `edit.Shift(polyline1, -1)`
 * @example_info Shifts the edges in the closed polyline wire, so that every edge moves up by one position
 * in the ring. The last edge will become the first edge.
 */
export function Shift(__model__: GIModel, entities: TId|TId[], offset: number): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        let ents_arr: TEntTypeIdx[];
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, 'edit.Reverse', 'entities', entities,
            [ID.isID, ID.isIDL1],
            [EEntType.WIRE, EEntType.PLINE, EEntType.PGON])  as TEntTypeIdx[];
        } else {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        // --- Error Check ---
        __model__.modeldata.funcs_edit.shift(ents_arr, offset);
    }
}
