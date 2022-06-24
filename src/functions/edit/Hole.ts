import { ENT_TYPE, Sim, idsBreak, idsMake, isEmptyArr, string, string } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';




// ================================================================================================
/**
 * Makes one or more holes in a polygon. 
 * \n
 * The holes are specified by lists of positions. 
 * The positions must be on the polygon, i.e. they must be co-planar with the polygon and
 * they must be within the boundary of the polygon. (Even positions touching the edge of the polygon
 * can result in no hole being generated.)
 * \n
 * Multiple holes can be created.
 * - If the positions is a single list, then a single hole will be generated.
 * - If the positions is a list of lists, then multiple holes will be generated.
 * \n
 * 
 * @param __model__
 * @param pgon A polygon to make holes in. This polygon is modified by the function. 
 * @param entities List of positions, or nested lists of positions, or entities from which positions 
 * can be extracted to create the holes.
 * @returns Entities, a list of wires resulting from the hole(s).
 * @example <a href="/editor?file=/assets/examples/Functions_edit.Hole_examples.mob&node=1" target="_blank"> Correct Example </a>
 * @example_info A model showing proper usage of edit.Hole, such that a hole is created in the orignal polygons.
 * @example <a href="/editor?file=/assets/examples/Functions_edit.Hole_examples.mob&node=2" target="_blank"> Wrong Example </a>
 * @example_info A model showing potential improper usage of edit.Hole, where the hole entities are outside of the original. 
 */
export function Hole(__model__: Sim, pgon: string, entities: string|string[]|string[][]): string[] {
    if (isEmptyArr(entities)) { return []; }
    if (!Array.isArray(entities)) { entities = [entities]; }
    // // --- Error Check ---
    // const fn_name = 'edit.Hole';
    // let ent_arr: string;
    // let holes_ents_arr: string[]|string[][];
    // if (this.debug) {
    //     ent_arr = checkIDs(__model__, fn_name, 'pgon', pgon, [ID.isID], [ENT_TYPE.PGON]) as string;
    //     holes_ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
    //         [ID.isID, ID.isIDL1, ID.isIDL2],
    //         [ENT_TYPE.POSI, ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON]) as string[]|string[][];
    // } else {
    //     ent_arr = idsBreak(pgon) as string;
    //     holes_ents_arr = idsBreak(entities) as string[]|string[][];
    // }
    // // --- Error Check ---
    const new_ents_arr: string[] = __model__.modeldata.funcs_edit.hole(ent_arr, holes_ents_arr);
    // make and return the IDs of the hole wires
    return idsMake(new_ents_arr) as string[];
}
