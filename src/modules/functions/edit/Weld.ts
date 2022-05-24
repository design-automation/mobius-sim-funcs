import { arrMakeFlat, EEntType, GIModel, idsBreak, idsMake, TEntTypeIdx, TId } from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';
import { _EWeldMethod } from './_enum';




// ================================================================================================
/**
 * Make or break welds between vertices.
 * If two vertices are welded, then they share the same position.
 * \n
 * - When making a weld between vertices (`make_weld`), a new position is created. The new position is calculated 
 * as the average of all the existing positions of the vertices. The vertices will then be linked
 * to the new position. This means that if the position is later moved, then all vertices will be 
 * affected. The new position is returned. The positions that become shared are returned.
 * - When breaking a weld between vetices (`break_weld`), existing positions are duplicated. Each vertex is then
 * linked to one of these duplicate positions. If these positions are later moved, then only one
 * vertex will be affected.  The new positions that get generated are returned.
 * \n
 * @param __model__
 * @param entities Entities, a list of vertices, or entities from which vertices can be extracted.
 * @param method Enum; the method to use, either `make_weld` or `break_weld`.
 * @returns Entities, a list of new positions depending on type of weld.
 */
export function Weld(__model__: GIModel, entities: TId|TId[], method: _EWeldMethod): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'edit.Weld';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
            [EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
            EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_edit.weld(ents_arr, method);
    // make and return the IDs of the new posis
    return idsMake(new_ents_arr) as TId[];
}
