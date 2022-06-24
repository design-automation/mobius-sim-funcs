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
* Returns a list of perimeter entities. In order to qualify as a perimeter entity,
* entities must be part of the set of input entities and must have naked edges.
* \n
* @param __model__
* @param ent_type Enum, select the type of perimeter entities to return: `'ps', '_v', '_e', '_w',
* 'pt', 'pl', 'pg',` or `'co'`.
* @param entities List of entities.
* @returns Entities, a list of perimeter entities.
* @example `query.Perimeter('edges', [polygon1,polygon2,polygon])`
* @example_info Returns list of edges that are at the perimeter of polygon1, polygon2, or polygon3.
*/
export function Perimeter(__model__: Sim, ent_type: _ENT_TYPE, entities: string|string[]): string[] {
    if (isEmptyArr(entities)) { return []; }
    entities = arrMakeFlat(entities) as string[];
    // // --- Error Check ---
    // let ents_arr: string[] = null;
    // if (this.debug) {
    //     if (entities !== null && entities !== undefined) {
    //         ents_arr = checkIDs(__model__, 'query.Perimeter', 'entities', entities, [ID.isIDL1], null) as string[];
    //     }
    // } else {
    //     if (entities !== null && entities !== undefined) {
    //         ents_arr = idsBreak(entities) as string[];
    //     }
    // }
    // // --- Error Check ---
    const select_ent_type: ENT_TYPE = _getEntTypeFromStr(ent_type);
    const found_ents_arr: string[] = _perimeter(__model__, select_ent_type, ents_arr);
    return idsMake(found_ents_arr) as string[];
}
export function _perimeter(__model__: Sim,  select_ent_type: ENT_TYPE, ents_arr: string[]): string[] {
    // get an array of all edges
    const edges_i: number[] = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, index]: string = ent_arr as string ;
        const edges_ent_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
        for (const edge_ent_i of edges_ent_i) {
            edges_i.push(edge_ent_i);
        }
    }
    // get the perimeter entities
    const all_perim_ents_i: number[] = __model__.modeldata.geom.query.perimeter(select_ent_type, edges_i);
    return all_perim_ents_i.map(perim_ent_i => [select_ent_type, perim_ent_i]) as string[];
}
