import { EEntType, GIModel, idsBreak, idsMake, isEmptyArr, TEntTypeIdx, TId } from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../../_check_ids';




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
 * @param __model__
 * @param pgon A polygon to make holes in.
 * @param entities List of positions, or nested lists of positions, or entities from which positions 
 * can be extracted.
 * @returns Entities, a list of wires resulting from the hole(s).
 */
export function Hole(__model__: GIModel, pgon: TId, entities: TId|TId[]|TId[][]): TId[] {
    if (isEmptyArr(entities)) { return []; }
    if (!Array.isArray(entities)) { entities = [entities]; }
    // --- Error Check ---
    const fn_name = 'edit.Hole';
    let ent_arr: TEntTypeIdx;
    let holes_ents_arr: TEntTypeIdx[]|TEntTypeIdx[][];
    if (__model__.debug) {
        ent_arr = checkIDs(__model__, fn_name, 'pgon', pgon, [ID.isID], [EEntType.PGON]) as TEntTypeIdx;
        holes_ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1, ID.isIDL2],
            [EEntType.POSI, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        ent_arr = idsBreak(pgon) as TEntTypeIdx;
        holes_ents_arr = idsBreak(entities) as TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_edit.hole(ent_arr, holes_ents_arr);
    // make and return the IDs of the hole wires
    return idsMake(new_ents_arr) as TId[];
}
