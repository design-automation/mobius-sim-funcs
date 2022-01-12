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




// ================================================================================================
/**
 * Adds one or more new polygons to the model.
 *
 * @param __model__
 * @param entities List or nested lists of positions, or entities from which positions can be extracted.
 * @returns Entities, new polygon, or a list of new polygons.
 * @example polygon1 = make.Polygon([pos1,pos2,pos3])
 * @example_info Creates a polygon with vertices pos1, pos2, pos3 in sequence.
 * @example polygons = make.Polygon([[pos1,pos2,pos3], [pos3,pos4,pos5]])
 * @example_info Creates two polygons, the first with vertices at [pos1,pos2,pos3], and the second with vertices at [pos3,pos4,pos5].
 */
export function Polygon(__model__: GIModel, entities: TId|TId[]|TId[][]): TId|TId[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, 'make.Polygon', 'entities', entities,
        [ID.isID, ID.isIDL1, ID.isIDL2],
        [EEntType.POSI, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_make.polygon(ents_arr) as TEntTypeIdx[];
    const depth: number = getArrDepth(ents_arr);
    if (depth === 1 || (depth === 2 && ents_arr[0][0] === EEntType.POSI)) {
        const first_ent: TEntTypeIdx = new_ents_arr[0] as TEntTypeIdx;
        return idsMake(first_ent) as TId;
    } else {
        return idsMake(new_ents_arr) as TId|TId[];
    }
}
