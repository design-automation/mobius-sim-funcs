import { GIModel, idsMake, isEmptyArr, TEntTypeIdx, TId, Txyz } from '@design-automation/mobius-sim';

import * as chk from '../../_check_types';




// ================================================================================================
/**
 * Adds one or more new positions to the model. Positions are unique entities and cannot be added to
 * collections.
 *
 * @param __model__
 * @param coords A list of three numbers, or a list of lists of three numbers.
 * @returns A new position, or nested list of new positions.
 * @example position1 = make.Position([1,2,3])
 * @example_info Creates a position with coordinates x=1, y=2, z=3.
 * @example positions = make.Position([[1,2,3],[3,4,5],[5,6,7]])
 * @example_info Creates three positions, with coordinates [1,2,3],[3,4,5] and [5,6,7].
 */
export function Position(__model__: GIModel, coords: Txyz|Txyz[]|Txyz[][]): TId|TId[]|TId[][] {
    if (isEmptyArr(coords)) { return []; }
    // --- Error Check ---
    if (__model__.debug) {
        chk.checkArgs('make.Position', 'coords', coords, [chk.isXYZ, chk.isXYZL, chk.isXYZLL]);
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] = __model__.modeldata.funcs_make.position(coords);
    return idsMake(new_ents_arr);
}
