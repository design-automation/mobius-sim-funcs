import { Sim, idsMake, string, Txyz, vecAdd, vecDiv, vecFromTo } from '../../mobius_sim';

import * as chk from '../../_check_types';
import { _EClose } from './_enum';



// ================================================================================================
/**
 * Creates a set of positions by linear interpolation between the specified |coordinates|. \n The
 * `num_positions` parameter specifies the number of positions to be generated between each pair of
 * coordinates. \n The `method` parameter specifies whether to close the loop of coordinates. If set
 * to `close`, then positions are also generated between the last and first coordinates in the list.
 * \n For the `num_positions` parameters:
 * - `num_positions = 0`: No positions are generated.
 * - `num_positions = 1`: No new coordinates are calculated. If `close` is true, then positions are
 *   generated at all coordinates in the input list. If `close` is false, then positions are
 *   generated at all coordinates in the input list except the last coordinate (which is ignored).
 * - `num_positions = 2`: No new coordinates are calculated. Positions are generated at all
 *   coordinates in the input list. (The `close` parameter has no effect.)
 * - `num_positions = 3`: For each pair of coordinates, one additional coordinate is calculated by
 *   linear interpolation.
 * - `num_positions = 4`: For each pair of coordinates, two additional coordinates are calculated by
 *   linear interpolation.
 * - etc 
 *  \n 
 *  For example, lets consider a case where you specify three coordinates, set the method to
 *   `close` and set `num_positions` to 4. In this case, there will be 3 pairs of coordinates, `[0,
 *   1]`, `[1, 2]` and `[2, 0]`. For each pair of coordinates, 2 new calculations are calculated.
 *   This results in a total of 9 coordinates. So 9 positions will be generated. \n Returns the list
 *   of new position IDs. \n
 * @param __model__
 * @param coords A list of |coordinates|.
 * @param close Enum, `'open'` or `'close'`.
 * @param num_positions The number of positions to generate.
 * @returns Entities, a list of new position IDs.
 * @example `posis = pattern.Linear([[0,0,0], [10,0,0]], false, 3)`
 * @example_info Generates 3 positions, located at [0,0,0], [5,0,0], and [10,0,0].
 * @example `posis = pattern.Linear([[0,0,0], [10,0,0], [10,10,0]], 'close', 4)`
 * @example_info Generates 9 positions. Two new coordinates are calculated between each pair of
 * input positions.
 */
export function Linear(__model__: Sim, coords: Txyz[], close: _EClose,
        num_positions: number): string[] {
    // --- Error Check ---
    if (this.debug) {
        const fn_name = 'pattern.Linear';
        chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
    }
    // --- Error Check ---
    if (num_positions === 0) { return []; }
    const is_closed: boolean = close === _EClose.CLOSE;
    const num_pairs: number = is_closed ? coords.length : coords.length - 1;
    const new_xyzs: Txyz[] = [];
    for (let i = 0; i < num_pairs; i++) {
        const xyz0: Txyz = coords[i];
        const xyz1: Txyz = coords[(i + 1) % coords.length];
        const sub_vec: Txyz = vecDiv(vecFromTo(xyz0, xyz1), num_positions - 1);
        let xyz_next: Txyz = xyz0;
        for (let j = 0; j < num_positions - 1; j++) {
            new_xyzs.push(xyz_next);
            xyz_next = vecAdd(xyz_next, sub_vec);
        }
    }
    if (!is_closed) { new_xyzs.push(coords[coords.length - 1]); }
    // make posis and return
    return idsMake(__model__.modeldata.funcs_make.position(new_xyzs)) as string[];
}
