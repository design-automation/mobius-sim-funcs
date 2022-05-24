import {
    arrMakeFlat,
    EEntType,
    GIModel,
    idsBreak,
    idsMake,
    isEmptyArr,
    TEntTypeIdx,
    TId,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { _EDivisorMethod } from './_enum';



// ================================================================================================
/**
 * Divides edges into a set of shorter edges.
 * \n
 * - If the `by_number` method is selected, then each edge is divided into
 * a fixed number of equal length shorter edges.
 * - If the `by_length` method is selected, then each edge is divided into
 * shorter edges of the specified length. 
 * The length of the last segment will be the remainder.
 * - If the `by_min_length` method is selected,
 * then the edge is divided into the number of shorter edges
 * with lengths equal to or greater than the minimum length specified.
 * - If the `by_max_length` method is selected,
 * then the edge is divided into the number of shorter edges
 * with lengths equal to or less than the maximum length specified.
 * \n
 * @param __model__
 * @param entities Edges, or entities from which edges can be extracted.
 * @param divisor Segment length or number of segments.
 * @param method Enum, select the method for dividing edges.
 * @returns Entities, a list of new edges resulting from the divide operation.
 * @example `segments1 = make.Divide(edge1, 5, by_number)`
 * @example_info Creates a list of 5 equal length edges from edge1.
 * @example `segments2 = make.Divide(edge1, 5, by_length)`
 * @example_info If edge1 has length 13, creates two new edges of length 5 and one new edge of length 3.
 */
export function Divide(__model__: GIModel, entities: TId|TId[], divisor: number, method: _EDivisorMethod): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'edit.Divide';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL1], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        chk.checkArgs(fn_name, 'divisor', divisor, [chk.isNum]);
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_edit.divide(ents_arr, divisor, method);
    // return the ids
    return idsMake(new_ents_arr) as TId[];
}
