import {
    arrMakeFlat,
    EAttribDataTypeStrs,
    EAttribNames,
    ENT_TYPE,
    Sim,
    idsBreak,
    isEmptyArr,
    string,
    string,
} from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import { _EEdgeMethod } from './_enum';


// ================================================================================================

/**
 * Controls how edges are visualized by setting the visibility of the edge.
 * \n
 * The method can either be 'visible' or 'hidden'.
 * - 'visible' means that an edge line will be visible.
 * - 'hidden' means that no edge lines will be visible.
 * \n
 * @param entities A list of edges, or other entities from which edges can be extracted.
 * @param method Enum, `'visible'` or `'hidden'`.
 * @returns void
 */
export function Edge(__model__: Sim, entities: string|string[], method: _EEdgeMethod): void {
    entities = arrMakeFlat(entities) as string[];
    if (isEmptyArr(entities)) { return; }
    // --- Error Check ---
    const fn_name = 'visualize.Edge';
    let ents_arr: string[] = null;
    if (this.debug) {
        if (entities !== null) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isIDL1], null) as string[];
        }
    } else {
        // if (entities !== null) {
        //     ents_arr = splitIDs(fn_name, 'entities', entities,
        //         [IDcheckObj.isIDList], null) as string[];
        // }
        ents_arr = idsBreak(entities) as string[];
    }
    // --- Error Check ---
    if (!__model__.modeldata.attribs.query.hasEntAttrib(ENT_TYPE.EDGE, EAttribNames.VISIBILITY)) {
        if (method === _EEdgeMethod.VISIBLE) {
            return;
        } else {
            __model__.modeldata.attribs.add.addAttrib(ENT_TYPE.EDGE, EAttribNames.VISIBILITY, EAttribDataTypeStrs.STRING);
        }
    }
    // Get the unique edges
    let edges_i: number[] = [];
    if (ents_arr !== null) {
        const set_edges_i: Set<number> = new Set();
        for (const [ent_type, ent_i] of ents_arr) {
            if (ent_type === ENT_TYPE.EDGE) {
                set_edges_i.add(ent_i);
            } else {
                const ent_edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
                for (const ent_edge_i of ent_edges_i) {
                    set_edges_i.add(ent_edge_i);
                }
            }
        }
        edges_i = Array.from(set_edges_i);
    } else {
        edges_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, ENT_TYPE.EDGE);
    }
    // Set edge visibility
    const setting: string = method === _EEdgeMethod.VISIBLE ? null : 'hidden';
    __model__.modeldata.attribs.set.setEntsAttribVal(ENT_TYPE.EDGE, edges_i, EAttribNames.VISIBILITY, setting);
}
