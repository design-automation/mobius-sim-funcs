import { 
    // arrMakeFlat, 
    ENT_TYPE, 
    Sim, 
    // idsBreak, string, string 
} from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';



// ================================================================================================
/**
 * Deletes a collection without deleting the entities in the collection.
 * \n
 * @param __model__
 * @param coll The collection or list of collections to be deleted.
 * @returns void
 */
export function Delete(__model__: Sim, coll: string|string[]): void {
    // coll = arrMakeFlat(coll) as string[];
    // // // --- Error Check ---
    // // const fn_name = 'collection.Delete';
    // // let colls_arrs;
    // // if (this.debug) {
    // //     colls_arrs = checkIDs(__model__, fn_name, 'coll', coll, [ID.isIDL1], [ENT_TYPE.COLL]) as string[];
    // // } else {
    // //     // colls_arrs = splitIDs(fn_name, 'coll', coll, [IDcheckObj.isIDList], [ENT_TYPE.COLL]) as string[];
    // //     colls_arrs = idsBreak(coll) as string[];
    // // }
    // // // --- Error Check ---
    // const colls_i: number[] = [];
    // for (const [ent_type, ent_i] of colls_arrs) {
    //     colls_i.push(ent_i);
    // }
    // __model__.modeldata.geom.snapshot.delColls(__model__.modeldata.active_ssid, colls_i);
    throw new Error();
}
