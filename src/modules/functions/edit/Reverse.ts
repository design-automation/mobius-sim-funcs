import { arrMakeFlat, EEntType, GIModel, idsBreak, isEmptyArr, TEntTypeIdx, TId } from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';



// ================================================================================================
/**
 * Reverses direction of wires, polylines or polygons.
 * \n
 * The order of vertices and edges in the wires will be reversed.
 * \n
 * For polygons this also means that they will face in the opposite direction. The back face and 
 * front face will be flipped. If the normal is calculated, it will face in the opposite direction.
 * \n
 * @param __model__
 * @param entities Wire,polyline, polygon.
 * @returns void
 * @example `edit.Reverse(polygon1)`
 * @example_info Flips polygon and reverses its normal.
 * @example `edit.Reverse(polyline1)`
 * @example_info Reverses the order of vertices and edges in the polyline.
 */
export function Reverse(__model__: GIModel, entities: TId|TId[]): void {
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
        __model__.modeldata.funcs_edit.reverse(ents_arr);
    }
}
