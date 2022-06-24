import {
    arrMakeFlat,
    ENT_TYPE,
    Sim,
    idsBreak,
    idsMake,
    isEmptyArr,
    string,
    string,
} from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import { _ENT_TYPE } from './_enum';
import { _getEntTypeFromStr } from './_shared';


// ================================================================================================
/**
* Returns a list of neighboring entities. In order to qualify as a neighbor,
* entities must not be part of the set of input entities, but must be welded to one or more entities in the input.
* \n
* @param __model__
* @param ent_type_enum Enum, select the types of neighbors to return: `'ps', '_v', '_e', '_w', 'pt', 'pl',
* 'pg',` or `'co'`.
* @param entities List of entities.
* @returns Entities, a list of welded neighbors
* @example `query.neighbor('edges', [polyline1,polyline2,polyline3])`
* @example_info Returns list of edges that are welded to polyline1, polyline2, or polyline3.
*/
export function Neighbor(__model__: Sim, ent_type_enum: _ENT_TYPE, entities: string|string[]): string[] {
    if (isEmptyArr(entities)) { return []; }
    entities = arrMakeFlat(entities) as string[];
    // // --- Error Check ---
    // let ents_arr: string[] = null;
    // if (this.debug) {
    //     if (entities !== null && entities !== undefined) {
    //         ents_arr = checkIDs(__model__, 'query.Neighbor', 'entities', entities, [ID.isIDL1], null) as string[];
    //     }
    // } else {
    //     if (entities !== null && entities !== undefined) {
    //         ents_arr = idsBreak(entities) as string[];
    //     }
    // }
    // // --- Error Check ---
    const select_ent_type: ENT_TYPE = _getEntTypeFromStr(ent_type_enum);
    const found_ents_arr: string[] = _neighbors(__model__, select_ent_type, ents_arr);
    return idsMake(found_ents_arr) as string[];
}
export function _neighbors(__model__: Sim,  select_ent_type: ENT_TYPE, ents_arr: string[]): string[] {
    // get an array of all vertices
    const verts_i: number[] = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, index]: string = ent_arr as string ;
        const verts_ent_i: number[] = __model__.modeldata.geom.nav.navAnyToVert(ent_type, index);
        for (const vert_ent_i of verts_ent_i) {
            verts_i.push(vert_ent_i);
        }
    }
    // get the neighbor entities
    const all_nbor_ents_i: number[] = __model__.modeldata.geom.query.neighbor(select_ent_type, verts_i);
    return all_nbor_ents_i.map(nbor_ent_i => [select_ent_type, nbor_ent_i]) as string[];
}
