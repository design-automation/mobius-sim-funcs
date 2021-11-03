/**
 * The `collections` module has functions for creating and modifying collections.
 * @module
 */
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { EEntType, EFilterOperatorTypes, EAttribNames } from '@design-automation/mobius-sim/dist/geo-info/common';
import { idsBreak, idMake, idsMakeFromIdxs } from '@design-automation/mobius-sim/dist/geo-info/common_id_funcs';
import { isEmptyArr } from '@design-automation/mobius-sim/dist/util/arrs';
// import { __merge__} from '../_model';
// import { _model } from '..';
import { arrMakeFlat } from '@design-automation/mobius-sim/dist/util/arrs';
// ================================================================================================
/**
 * Create a new collection.
 *
 * If the `entities` argument is null or an empty list, then an empty collection will be created.
 *
 * If the `name` argument is null, then no name attribute will be created for the collection.
 *
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
export function Create(__model__, entities, name) {
    entities = (entities === null) ? [] : arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = 'collection.Create';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1, ID.isIDL2], [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
        chk.checkArgs(fn_name, 'name', name, [chk.isStr, chk.isNull]);
    }
    else {
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    const coll_i = _create(__model__, ents_arr);
    // set the name
    if (name !== null) {
        __model__.modeldata.attribs.set.setEntsAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_NAME, name);
    }
    // return the collection id
    return idMake(EEntType.COLL, coll_i);
}
function _create(__model__, ents_arr) {
    const ssid = __model__.modeldata.active_ssid;
    const points_i = [];
    const plines_i = [];
    const pgons_i = [];
    const child_colls_i = [];
    for (const ent_arr of ents_arr) {
        if (ent_arr[0] === EEntType.POINT) {
            points_i.push(ent_arr[1]);
        }
        if (ent_arr[0] === EEntType.PLINE) {
            plines_i.push(ent_arr[1]);
        }
        if (ent_arr[0] === EEntType.PGON) {
            pgons_i.push(ent_arr[1]);
        }
        if (ent_arr[0] === EEntType.COLL) {
            child_colls_i.push(ent_arr[1]);
        }
    }
    // create the collection, setting tha parent to -1
    const coll_i = __model__.modeldata.geom.add.addColl();
    __model__.modeldata.geom.snapshot.addCollPoints(ssid, coll_i, points_i);
    __model__.modeldata.geom.snapshot.addCollPlines(ssid, coll_i, plines_i);
    __model__.modeldata.geom.snapshot.addCollPgons(ssid, coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.addCollChildren(ssid, coll_i, child_colls_i);
    // return the new collection
    return coll_i;
}
// ================================================================================================
/**
 * Get one or more collections from the model, given a name or list of names.
 * Collections with an attribute called 'name' and with a value that matches teh given vale will be returned.
 * \n
 * The value for name can include wildcards: '?' matches any single character and '*' matches any sequence of characters.
 * For example, 'coll?' will match 'coll1' and 'colla'. 'coll*' matches any name that starts with 'coll'.
 * \n
 * If a single collection is found, the collection will be returned as a single item (not a list).
 * This is a convenience so that there is no need to get the first item out of the returned list.
 * \n
 * If no collections are found, then an empty list is returned.
 * \n
 * @param __model__
 * @param names A name or list of names. May include wildcards, '?' and '*'.
 * @returns The collection, or a list of collections.
 */
export function Get(__model__, names) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'collection.Get';
        chk.checkArgs(fn_name, 'names', names, [chk.isStr, chk.isStrL]);
    }
    // --- Error Check ---
    const colls_i = _get(__model__, names);
    if (colls_i.length === 0) {
        return []; // return an empty list
    }
    else if (colls_i.length === 1) {
        return idMake(EEntType.COLL, colls_i[0]);
    }
    return idsMakeFromIdxs(EEntType.COLL, colls_i);
    // return idsMake(colls_i.map(coll_i => [EEntType.COLL, coll_i]) as TEntTypeIdx[]) as TId[];
}
function _get(__model__, names) {
    if (!Array.isArray(names)) {
        // wildcards
        if (names.indexOf('*') !== -1 || names.indexOf('?') !== -1) {
            const reg_exp = new RegExp(names.replace('?', '\\w').replace('*', '\\w*'));
            const all_colls_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, EEntType.COLL);
            const all_names = all_colls_i.map(coll_i => __model__.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_NAME));
            const unique_names = Array.from(new Set(all_names));
            const match_names = [];
            for (const name1 of unique_names) {
                if (reg_exp.test(name1)) {
                    match_names.push(name1);
                }
            }
            return _get(__model__, match_names);
        }
        const colls_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, EEntType.COLL);
        const query_result = __model__.modeldata.attribs.query.filterByAttribs(EEntType.COLL, colls_i, EAttribNames.COLL_NAME, null, EFilterOperatorTypes.IS_EQUAL, names);
        return query_result;
    }
    else {
        const all_colls_i = [];
        for (const name1 of names) {
            for (const coll_i of _get(__model__, name1)) {
                all_colls_i.push(coll_i);
            }
        }
        return all_colls_i;
    }
}
// ================================================================================================
/**
 * Addes entities to a collection.
 * \n
 * @param __model__
 * @param coll The collection to be updated.
 * @param entities Points, polylines, polygons, and collections to add.
 * @returns void
 */
export function Add(__model__, coll, entities) {
    entities = arrMakeFlat(entities);
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'collection.Add';
        let coll_arr;
        let ents_arr;
        if (__model__.debug) {
            coll_arr = checkIDs(__model__, fn_name, 'coll', coll, [ID.isID], [EEntType.COLL]);
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
        }
        else {
            // coll_arr = splitIDs(fn_name, 'coll', coll, [IDcheckObj.isID], [EEntType.COLL]) as TEntTypeIdx;
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            //     [IDcheckObj.isID, IDcheckObj.isIDList],
            //     [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
            coll_arr = idsBreak(coll);
            ents_arr = idsBreak(entities);
        }
        // --- Error Check ---
        _collectionAdd(__model__, coll_arr[1], ents_arr);
    }
}
function _collectionAdd(__model__, coll_i, ents_arr) {
    const ssid = __model__.modeldata.active_ssid;
    const points_i = [];
    const plines_i = [];
    const pgons_i = [];
    const colls_i = [];
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case EEntType.POINT:
                points_i.push(ent_i);
                break;
            case EEntType.PLINE:
                plines_i.push(ent_i);
                break;
            case EEntType.PGON:
                pgons_i.push(ent_i);
                break;
            case EEntType.COLL:
                colls_i.push(ent_i);
                break;
            default:
                throw new Error('Error adding entities to a collection. \
                A collection can only contain points, polylines, polygons, and other collections.');
        }
    }
    __model__.modeldata.geom.snapshot.addCollPoints(ssid, coll_i, points_i);
    __model__.modeldata.geom.snapshot.addCollPlines(ssid, coll_i, plines_i);
    __model__.modeldata.geom.snapshot.addCollPgons(ssid, coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.addCollChildren(ssid, coll_i, colls_i);
}
// ================================================================================================
/**
 * Removes entities from a collection.
 * \n
 * @param __model__
 * @param coll The collection to be updated.
 * @param entities Points, polylines, polygons, and collections to add. Or null to empty the collection.
 * @returns void
 */
export function Remove(__model__, coll, entities) {
    // --- Error Check ---
    const fn_name = 'collection.Remove';
    let ents_arr = null;
    let coll_arr;
    if (__model__.debug) {
        if (entities !== null) {
            entities = arrMakeFlat(entities);
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
        }
        coll_arr = checkIDs(__model__, fn_name, 'coll', coll, [ID.isID], [EEntType.COLL]);
    }
    else {
        if (entities !== null) {
            entities = arrMakeFlat(entities);
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            //     [IDcheckObj.isID, IDcheckObj.isIDList],
            //     [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
            ents_arr = idsBreak(entities);
        }
        // coll_arr = splitIDs(fn_name, 'coll', coll, [IDcheckObj.isID], [EEntType.COLL]) as TEntTypeIdx;
        coll_arr = idsBreak(coll);
    }
    // --- Error Check ---
    if (ents_arr === null) {
        _collectionEmpty(__model__, coll_arr[1]);
    }
    else {
        _collectionRemove(__model__, coll_arr[1], ents_arr);
    }
}
function _collectionRemove(__model__, coll_i, ents_arr) {
    const ssid = __model__.modeldata.active_ssid;
    const points_i = [];
    const plines_i = [];
    const pgons_i = [];
    const colls_i = [];
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case EEntType.POINT:
                points_i.push(ent_i);
                break;
            case EEntType.PLINE:
                plines_i.push(ent_i);
                break;
            case EEntType.PGON:
                pgons_i.push(ent_i);
                break;
            case EEntType.COLL:
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
function _collectionEmpty(__model__, coll_i) {
    const ssid = this.modeldata.active_ssid;
    const points_i = __model__.modeldata.geom.nav.navCollToPoint(coll_i);
    const plines_i = __model__.modeldata.geom.nav.navCollToPline(coll_i);
    const pgons_i = __model__.modeldata.geom.nav.navCollToPgon(coll_i);
    const colls_i = __model__.modeldata.geom.nav.navCollToCollChildren(coll_i);
    __model__.modeldata.geom.snapshot.remCollPoints(ssid, coll_i, points_i);
    __model__.modeldata.geom.snapshot.remCollPlines(ssid, coll_i, plines_i);
    __model__.modeldata.geom.snapshot.remCollPgons(ssid, coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.remCollChildren(ssid, coll_i, colls_i);
}
// ================================================================================================
/**
 * Deletes a collection without deleting the entities in the collection.
 * \n
 * @param __model__
 * @param coll The collection or list of collections to be deleted.
 * @returns void
 */
export function Delete(__model__, coll) {
    coll = arrMakeFlat(coll);
    // --- Error Check ---
    const fn_name = 'collection.Delete';
    let colls_arrs;
    if (__model__.debug) {
        colls_arrs = checkIDs(__model__, fn_name, 'coll', coll, [ID.isIDL1], [EEntType.COLL]);
    }
    else {
        // colls_arrs = splitIDs(fn_name, 'coll', coll, [IDcheckObj.isIDList], [EEntType.COLL]) as TEntTypeIdx[];
        colls_arrs = idsBreak(coll);
    }
    // --- Error Check ---
    const colls_i = [];
    for (const [ent_type, ent_i] of colls_arrs) {
        colls_i.push(ent_i);
    }
    __model__.modeldata.geom.snapshot.delColls(__model__.modeldata.active_ssid, colls_i);
}
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGVzL2Jhc2ljL2NvbGxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUVoRCxPQUFPLEtBQUssR0FBRyxNQUFNLG9CQUFvQixDQUFDO0FBRzFDLE9BQU8sRUFBTyxRQUFRLEVBQWUsb0JBQW9CLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDcEksT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkRBQTZELENBQUM7QUFDaEgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQzFFLHdDQUF3QztBQUN4QywrQkFBK0I7QUFDL0IsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBRTNFLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNILE1BQU0sVUFBVSxNQUFNLENBQUMsU0FBa0IsRUFBRSxRQUEyQixFQUFFLElBQVk7SUFDaEYsUUFBUSxHQUFHLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1RCxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsbUJBQW1CLENBQUM7SUFDcEMsSUFBSSxRQUF1QixDQUFDO0lBQzVCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDeEQsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUMv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