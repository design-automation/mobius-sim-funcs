import { arrMakeFlat, Sim, idsBreak, isEmptyArr, string, string, Txyz } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../../_check_types';




// ================================================================================================
/**
 * Moves entities. The direction and distance of movement is specified as a vector.
 * \n
 * If only one vector is given, then all entities are moved by the same vector.
 * If a list of vectors is given, then each entity will be moved by a different vector.
 * In this case, the number of vectors should be equal to the number of entities.
 * \n
 * If a position is shared between entites that are being moved by different vectors,
 * then the position will be moved by the average of the vectors.
 * \n
 * @param __model__
 * @param entities An entity or list of entities to move.
 * @param vectors A vector or a list of vectors.
 * @returns void
 * @example `modify.Move(pline1, [1,2,3])`
 * @example_info Moves pline1 by [1,2,3].
 * @example `modify.Move([pos1, pos2, pos3], [[0,0,1], [0,0,1], [0,1,0]] )`
 * @example_info Moves pos1 by [0,0,1], pos2 by [0,0,1], and pos3 by [0,1,0].
 * @example `modify.Move([pgon1, pgon2], [1,2,3] )`
 * @example_info Moves both pgon1 and pgon2 by [1,2,3].
 */
export function Move(__model__: Sim, entities: string|string[], vectors: Txyz|Txyz[]): void {
    entities = arrMakeFlat(entities) as string[];
    if (!isEmptyArr(entities)) {
        // // --- Error Check ---
        // const fn_name = 'modify.Move';
        // let ents_arr: string[];
        // if (this.debug) {
        //     ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null) as string[];
        //     chk.checkArgs(fn_name, 'vectors', vectors, [chk.isXYZ, chk.isXYZL]);
        // } else {
        //     ents_arr = idsBreak(entities) as string[];
        // }
        // // --- Error Check ---
        __model__.modeldata.funcs_modify.move(ents_arr, vectors);
    }
}
