import { arrMakeFlat, EEntType, GIModel, idsBreak, TEntTypeIdx, TId } from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';



// ================================================================================================
/**
 * Deletes a collection without deleting the entities in the collection.
 * \n
 * @param __model__
 * @param coll The collection or list of collections to be deleted.
 * @returns void
 */
export function Delete(__model__: GIModel, coll: TId|TId[]): void {
    coll = arrMakeFlat(coll) as TId[];
    // --- Error Check ---
    const fn_name = 'collection.Delete';
    let colls_arrs;
    if (__model__.debug) {
        colls_arrs = checkIDs(__model__, fn_name, 'coll', coll, [ID.isIDL1], [EEntType.COLL]) as TEntTypeIdx[];
    } else {
        // colls_arrs = splitIDs(fn_name, 'coll', coll, [IDcheckObj.isIDList], [EEntType.COLL]) as TEntTypeIdx[];
        colls_arrs = idsBreak(coll) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const colls_i: number[] = [];
    for (const [ent_type, ent_i] of colls_arrs) {
        colls_i.push(ent_i);
    }
    __model__.modeldata.geom.snapshot.delColls(__model__.modeldata.active_ssid, colls_i);
}
