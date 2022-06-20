import {
    EAttribNames,
    ENT_TYPE,
    EFilterOperatorTypes,
    Sim,
    idMake,
    idsMakeFromIdxs,
    string,
} from '../../mobius_sim';

import * as chk from '../../_check_types';



// ================================================================================================
/**
 * Get one or more collections from the model, given a name or list of names. Collections with an
 * attribute called 'name' and with a value that matches the given value will be returned.
 * \n
 * The value for name can include wildcards: '?' matches any single character and '\*' matches any
 * sequence of characters. For example, 'coll?' will match 'coll1' and 'colla'. 'coll\*' matches any
 * name that starts with 'coll'.
 * \n
 * If a single collection is found, the collection will be returned as a single item (not a list).
 * This is a convenience so that there is no need to get the first item out of the returned list.
 * \n
 * If no collections are found, then an empty list is returned.
 * \n
 * @param __model__
 * @param names A name or list of names. May include wildcards, '?' and '\*'.
 * @returns The collection, or a list of collections.
 */
export function Get(__model__: Sim, names: string|string[]): string|string[] {
    // --- Error Check ---
    if (this.debug) {
        const fn_name = 'collection.Get';
        chk.checkArgs(fn_name, 'names', names, [chk.isStr, chk.isStrL]);
    }
    // --- Error Check ---
    const colls_i: number[] = _get(__model__, names);
    if (colls_i.length === 0) {
        return []; // return an empty list
    } else if (colls_i.length === 1) {
        return idMake(ENT_TYPE.COLL, colls_i[0]) as string;
    }
    return idsMakeFromIdxs(ENT_TYPE.COLL, colls_i) as string[];
    // return idsMake(colls_i.map(coll_i => [ENT_TYPE.COLL, coll_i]) as string[]) as string[];
}
function _get(__model__: Sim, names: string|string[]): number[] {
    if (!Array.isArray(names)) {
        // wildcards
        if (names.indexOf('*') !== -1 || names.indexOf('?') !== -1) {
            const reg_exp = new RegExp(names.replace('?', '\\w').replace('*', '\\w*'));
            const all_colls_i: number[] = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, ENT_TYPE.COLL);
            const all_names: string[] = all_colls_i.map( coll_i =>
                __model__.modeldata.attribs.get.getEntAttribVal(ENT_TYPE.COLL, coll_i, EAttribNames.COLL_NAME) as string
            );
            const unique_names: string[] = Array.from(new Set(all_names));
            const match_names: string[] = [];
            for (const name1 of unique_names) {
                if (reg_exp.test(name1)) { match_names.push(name1); }
            }
            return _get(__model__, match_names);
        }
        const colls_i: number[] = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, ENT_TYPE.COLL);
        const query_result: number[] = __model__.modeldata.attribs.query.filterByAttribs(
            ENT_TYPE.COLL, colls_i, EAttribNames.COLL_NAME, null, EFilterOperatorTypes.IS_EQUAL, names);
        return query_result;
    } else {
        const all_colls_i: number[] = [];
        for (const name1 of names) {
            for (const coll_i of _get(__model__, name1)) {
                all_colls_i.push(coll_i);
            }
        }
        return all_colls_i;
    }
}
