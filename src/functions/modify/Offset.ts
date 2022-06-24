import { arrMakeFlat, ENT_TYPE, Sim, idsBreak, isEmptyArr, string, string } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../../_check_types';




// ================================================================================================
/**
 * Performs a simple geometrical offset on the wires, such that the wires are parallel to their
 * original positions, modying the input entities. Works on 3D geometry. 
 * \n
 * See `poly2d.OffsetChamfer, poly2d.OffsetMitre` and `poly2d.OffsetRound` for other offset
 * functions that do not modify the input entities (but are limited to 2D).
 * 
 * @param __model__ 
 * @param entities Edges, wires, faces, polylines, polygons, collections.
 * @param dist The distance to offset by, can be either positive or negative.
 * @returns void
 * @example <a href="/editor?file=/assets/examples/Functions_modify.Offset_3DExamples.mob&node=1" target="_blank"> 3D Example </a>
 * @example_info A model showing offset used on 3D geometry. 
 * @example <a href="/editor?file=/assets/examples/Functions_modify.Offset_Self-intersecting_Example.mob&node=1" target="_blank"> Wrong Example </a>
 * @example_info A model showing self-intersecting geometries created by offset and how to fix it.
 * @example `modify.Offset(polygon1, 10)`
 * @example_info Offsets the wires inside polygon1 by 10 units. Holes will also be offset.
 */
export function Offset(__model__: Sim, entities: string|string[], dist: number): void {
    entities = arrMakeFlat(entities) as string[];
    if (!isEmptyArr(entities)) {
        // // --- Error Check ---
        // const fn_name = 'modify.Offset';
        // let ents_arr: string[];
        // if (this.debug) {
        //     ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
        //         [ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
        //     chk.checkArgs(fn_name, 'dist', dist, [chk.isNum]);
        // } else {
        //     ents_arr = idsBreak(entities) as string[];
        // }
        // // --- Error Check ---
        __model__.modeldata.funcs_modify.offset(ents_arr, dist);
    }
}
