import { arrMakeFlat, EEntType, GIModel, idsBreak, idsMake, TEntTypeIdx, TId } from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';




// ================================================================================================
/**
 * Joins existing polyline or polygons to create new polyline or polygons.
 * \n
 * In order to be joined, the polylines or polygons must be fused (i.e. share the same positions)
 * \n
 * The existing polygons are not affected.
 * \n
 * Note: Joining polylines currently not implemented.
 *
 * @param __model__
 * @param entities Polylines or polygons, or entities from which polylines or polygons can be extracted.
 * @returns Entities, a list of new polylines or polygons resulting from the join.
 */
export function Join(__model__: GIModel, entities: TId[]): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (entities.length === 0) { return []; }
    // --- Error Check ---
    const fn_name = 'make.Join';
    let ents: TEntTypeIdx[];
    if (__model__.debug) {
        ents = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isIDL1], [EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
    } else {
        ents = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const new_ents: TEntTypeIdx[] = __model__.modeldata.funcs_make.join(ents);
    return idsMake(new_ents) as TId[];
}
