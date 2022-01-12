import {
    EEntType,
    getArrDepth,
    GIModel,
    idsBreak,
    idsMake,
    isEmptyArr,
    TEntTypeIdx,
    TId,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../../_check_ids';
import { _EClose } from './_enum';





// ================================================================================================
/**
 * Adds one or more new polylines to the model.
 *
 * @param __model__
 * @param entities List or nested lists of positions, or entities from which positions can be extracted.
 * @param close Enum, 'open' or 'close'.
 * @returns Entities, new polyline, or a list of new polylines.
 * @example polyline1 = make.Polyline([position1,position2,position3], close)
 * @example_info Creates a closed polyline with vertices position1, position2, position3 in sequence.
 */
export function Polyline(__model__: GIModel, entities: TId|TId[]|TId[][], close: _EClose): TId|TId[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, 'make.Polyline', 'entities', entities,
        [ID.isID, ID.isIDL1, ID.isIDL2],
        [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
        EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_make.polyline(ents_arr, close) as  TEntTypeIdx[];
    const depth: number = getArrDepth(ents_arr);
    if (depth === 1 || (depth === 2 && ents_arr[0][0] === EEntType.POSI)) {
        const first_ent: TEntTypeIdx = new_ents_arr[0] as TEntTypeIdx;
        return idsMake(first_ent) as TId;
    } else {
        return idsMake(new_ents_arr) as TId|TId[];
    }
}
