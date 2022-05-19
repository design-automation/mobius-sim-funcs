import {
    arrMakeFlat,
    EAttribNames,
    EEntType,
    GIModel,
    idMake,
    idsBreak,
    TEntTypeIdx,
    TId,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../../_check_ids';
import * as chk from '../../../_check_types';



// ================================================================================================
/**
 * Create a new collection.
 * \n
 * If the `entities` argument is null or an empty list, then an empty collection will be created.
 * \n
 * If the `name` argument is null, then no name attribute will be created for the collection.
 * \n
 * If the list of entities contains other collections, these other collections will then become
 * children of the new collection.
 *
 * @param __model__
 * @param entities List or nested lists of points, polylines, polygons, and other colletions, or null.
 * @param name The name to give to this collection, resulting in an attribute called `name`. If `null`, no attribute will be created.
 * @returns Entities, new collection, or a list of new collections.
 * @example collection1 = collection.Create([point1,polyine1,polygon1], 'my_coll')
 * @example_info Creates a collection containing point1, polyline1, polygon1, with an attribute `name = 'my_coll'`.
 */
export function Create(__model__: GIModel, entities: TId|TId[]|TId[][], name: string): TId|TId[] {
    entities = (entities === null) ? [] : arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = 'collection.Create';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1, ID.isIDL2],
            [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        chk.checkArgs(fn_name, 'name', name, [chk.isStr, chk.isNull]);
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const coll_i: number = _create(__model__, ents_arr);
    // set the name
    if (name !== null) {
        __model__.modeldata.attribs.set.setEntsAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_NAME, name);
    }
    // return the collection id
    return idMake(EEntType.COLL, coll_i) as TId;
}
function _create(__model__: GIModel, ents_arr: TEntTypeIdx[]): number {
    const ssid: number = __model__.modeldata.active_ssid;
    const points_i: number[] = [];
    const plines_i: number[] = [];
    const pgons_i: number[] = [];
    const child_colls_i: number[] = [];
    for (const ent_arr of ents_arr) {
        if (ent_arr[0] === EEntType.POINT) { points_i.push(ent_arr[1]); }
        if (ent_arr[0] === EEntType.PLINE) { plines_i.push(ent_arr[1]); }
        if (ent_arr[0] === EEntType.PGON) { pgons_i.push(ent_arr[1]); }
        if (ent_arr[0] === EEntType.COLL) { child_colls_i.push(ent_arr[1]); }
    }
    // create the collection, setting tha parent to -1
    const coll_i: number = __model__.modeldata.geom.add.addColl();
    __model__.modeldata.geom.snapshot.addCollPoints(ssid, coll_i, points_i);
    __model__.modeldata.geom.snapshot.addCollPlines(ssid, coll_i, plines_i);
    __model__.modeldata.geom.snapshot.addCollPgons(ssid, coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.addCollChildren(ssid, coll_i, child_colls_i);
    // return the new collection
    return coll_i;
}
