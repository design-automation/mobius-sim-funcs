import { arrMakeFlat, ENT_TYPE, Sim, idsBreak, idsMake, string, string } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import { _EWeldMethod } from './_enum';




// ================================================================================================
/**
 * Make or break welds between vertices.
 * If two vertices are welded, then they share the same position.
 * \n
 * - When making a weld between vertices (`make_weld`), a new position is created and the old
 *   positions are removed. The new position is calculated as the average of all the existing
 *   positions of the vertices. The vertices will then be linked to the new position. This means
 *   that if the position is later moved, then all vertices will be affected. The new position is
 *   returned. The positions that become shared are returned.
 * - When breaking a weld between vetices (`break_weld`), existing positions are duplicated. Each
 *   vertex is then linked to one of these duplicate positions. If these positions are later moved,
 *   then only one vertex will be affected.  The new positions that get generated are returned.
 * \n
 * @param __model__
 * @param entities Entities, a list of vertices, or entities from which vertices can be extracted.
 * @param method Enum, the method to use: `'make_weld'` or `'break_weld'`.
 * @returns Entities, a list of new positions depending on type of weld.
 * @example <a href="/editor?file=/assets/examples/Functions_edit.Weld_example.mob&node=1" target="_blank">
 * Example model </a>
 * @example_info A simple model with polylines, showing how to weld and break vertices. 
 */
export function Weld(__model__: Sim, entities: string|string[], method: _EWeldMethod): string[] {
    entities = arrMakeFlat(entities) as string[];
    // --- Error Check ---
    const fn_name = 'edit.Weld';
    let ents_arr: string[];
    if (this.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
            [ENT_TYPE.VERT, ENT_TYPE.EDGE, ENT_TYPE.WIRE,
            ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
    } else {
        ents_arr = idsBreak(entities) as string[];
    }
    // --- Error Check ---
    const new_ents_arr: string[] = __model__.modeldata.funcs_edit.weld(ents_arr, method);
    // make and return the IDs of the new posis
    return idsMake(new_ents_arr) as string[];
}
