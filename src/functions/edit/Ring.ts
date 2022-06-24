import { 
    // arrMakeFlat, 
    ENT_TYPE, Sim, 
    // idsBreak, isEmptyArr, string, string 
} from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import { _ERingMethod } from './_enum';



// ================================================================================================
/**
 * Opens or closes a polyline.
 * \n
 * A polyline can be open or closed. A polyline consists of a sequence of vertices and edges.
 * Edges connect pairs of vertices.
 * - An open polyline has no edge connecting the first and last vertices. Closing a polyline
 * adds this edge.
 * - A closed polyline has an edge connecting the first and last vertices. Opening a polyline
 * deletes this edge.
 * \n
 * @param __model__
 * @param entities Polyline(s).
 * @param method Enum, the method to use: ``open`` or ``close``.
 * @returns void
 * @example `edit.Ring([polyline1,polyline2,...], method='close')`
 * @example_info If open, polylines are changed to closed; if already closed, nothing happens.
 */
export function Ring(__model__: Sim, entities: string|string[], method: _ERingMethod): void {
    // console.log('start')
    // entities = arrMakeFlat(entities) as string[];
    // console.log('after arrMakeFlat')
    // if (!isEmptyArr(entities)) {
    //     // // --- Error Check ---
    //     // const fn_name = 'edit.Ring';
    //     // let ents_arr: string[];
    //     // if (this.debug) {
    //     //     ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
    //     //     [ID.isID, ID.isIDL1], [ENT_TYPE.PLINE]) as string[];
    //     // } else {
    //     //     ents_arr = idsBreak(entities) as string[];
    //     // }
    //     // // --- Error Check ---
    //     __model__.modeldata.funcs_edit.ring(ents_arr, method);
    // }
    throw new Error();
}
