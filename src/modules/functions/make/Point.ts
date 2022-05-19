import { EEntType, GIModel, idsBreak, idsMake, isEmptyArr, TEntTypeIdx, TId } from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../../_check_ids';




// ================================================================================================
/**
 * Adds one or more new points to the model. Points are objects that can be added to collections.
 *
 * @param __model__
 * @param entities Position, or list of positions, or entities from which positions can be extracted.
 * @returns Entities, new point or a list of new points.
 * @example point1 = make.Point(position1)
 * @example_info Creates a point at position1.
 */
export function Point(__model__: GIModel, entities: TId|TId[]|TId[][]): TId|TId[]|TId[][] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, 'make.Point', 'entities', entities,
        [ID.isID, ID.isIDL1, ID.isIDL2],
        [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
        EEntType.POINT, EEntType.PLINE, EEntType.PGON])  as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] =  __model__.modeldata.funcs_make.point(ents_arr);
    return idsMake(new_ents_arr) as TId|TId[]|TId[][];
}
