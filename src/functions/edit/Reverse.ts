import { 
    // arrMakeFlat, 
    ENT_TYPE, Sim, 
    // idsBreak, isEmptyArr, string, string 
} from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';



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
export function Reverse(__model__: Sim, entities: string|string[]): void {
    // entities = arrMakeFlat(entities) as string[];
    // if (!isEmptyArr(entities)) {
    //     // // --- Error Check ---
    //     // let ents_arr: string[];
    //     // if (this.debug) {
    //     //     ents_arr = checkIDs(__model__, 'edit.Reverse', 'entities', entities,
    //     //         [ID.isID, ID.isIDL1],
    //     //         [ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON])  as string[];
    //     // } else {
    //     //     ents_arr = idsBreak(entities) as string[];
    //     // }
    //     // // --- Error Check ---
    //     __model__.modeldata.funcs_edit.reverse(ents_arr);
    // }
    throw new Error();
}
