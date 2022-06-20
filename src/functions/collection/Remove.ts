import { arrMakeFlat, ENT_TYPE, Sim, idsBreak, string, string } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';



// ================================================================================================
/**
 * Removes entities from a collection.
 * \n
 * @param __model__
 * @param coll The collection to be updated.
 * @param entities Points, polylines, polygons, and collections to add. Or null to empty the collection.
 * @returns void
 */
export function Remove(__model__: Sim, coll: string, entities: string|string[]): void {
    // --- Error Check ---
    const fn_name = 'collection.Remove';
    let ents_arr: string[] = null;
    let coll_arr;
    if (this.debug) {
        if (entities !== null) {
            entities = arrMakeFlat(entities) as string[];
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1],
                [ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
        }
        coll_arr = checkIDs(__model__, fn_name, 'coll', coll, [ID.isID], [ENT_TYPE.COLL]) as string;
    } else {
        if (entities !== null) {
            entities = arrMakeFlat(entities) as string[];
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            //     [IDcheckObj.isID, IDcheckObj.isIDList],
            //     [ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
            ents_arr = idsBreak(entities) as string[];
        }
        // coll_arr = splitIDs(fn_name, 'coll', coll, [IDcheckObj.isID], [ENT_TYPE.COLL]) as string;
        coll_arr = idsBreak(coll) as string;
    }
    // --- Error Check ---
    if (ents_arr === null) {
        _collectionEmpty(__model__, coll_arr[1]);
    } else {
        _collectionRemove(__model__, coll_arr[1], ents_arr);
    }
}
function _collectionRemove(__model__: Sim, coll_i: number, ents_arr: string[]): void {
    const ssid: number = __model__.modeldata.active_ssid;
    const points_i: number[] = [];
    const plines_i: number[] = [];
    const pgons_i: number[] = [];
    const colls_i: number[] = [];
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case ENT_TYPE.POINT:
                points_i.push(ent_i);
                break;
            case ENT_TYPE.PLINE:
                plines_i.push(ent_i);
                break;
            case ENT_TYPE.PGON:
                pgons_i.push(ent_i);
                break;
            case ENT_TYPE.COLL:
                colls_i.push(ent_i);
                break;
            default:
                throw new Error('Error removing entities from a collection. \
                A collection can only contain points, polylines, polygons, and other collections.');
        }
    }
    __model__.modeldata.geom.snapshot.remCollPoints(ssid, coll_i, points_i);
    __model__.modeldata.geom.snapshot.remCollPlines(ssid, coll_i, plines_i);
    __model__.modeldata.geom.snapshot.remCollPgons(ssid, coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.remCollChildren(ssid, coll_i, colls_i);
}
function _collectionEmpty(__model__: Sim, coll_i: number): void {
    const ssid: number = this.modeldata.active_ssid;
    const points_i: number[] = __model__.modeldata.geom.nav.navCollToPoint(coll_i);
    const plines_i: number[] = __model__.modeldata.geom.nav.navCollToPline(coll_i);
    const pgons_i: number[] = __model__.modeldata.geom.nav.navCollToPgon(coll_i);
    const colls_i: number[] = __model__.modeldata.geom.nav.navCollToCollChildren(coll_i);
    __model__.modeldata.geom.snapshot.remCollPoints(ssid, coll_i, points_i);
    __model__.modeldata.geom.snapshot.remCollPlines(ssid, coll_i, plines_i);
    __model__.modeldata.geom.snapshot.remCollPgons(ssid, coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.remCollChildren(ssid, coll_i, colls_i);
}
