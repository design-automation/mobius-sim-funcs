import {
    EEntType,
    getArrDepth,
    GIModel,
    idsBreak,
    isEmptyArr,
    TEntTypeIdx,
    TId,
    Txyz,
    vecSub,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';


// ================================================================================================
/**
 * Returns a vector along an edge, from the start position to the end position.
 * The vector is not normalized.
 * \n
 * Given a single edge, a single vector will be returned. Given a list of edges, a list of vectors will be returned.
 * \n
 * Given any entity that has edges (collection, polygons, polylines, faces, and wires),
 * a list of edges will be extracted, and a list of vectors will be returned.
 *
 * @param __model__
 * @param entities Single or list of edges, or any entity from which edges can be extracted.
 * @returns The vector [x, y, z] or a list of vectors.
 */
export function Vector(__model__: GIModel, entities: TId|TId[]): Txyz|Txyz[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Vector';
    let ents_arrs: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL1],
        [EEntType.PGON, EEntType.PLINE, EEntType.WIRE, EEntType.EDGE]) as TEntTypeIdx|TEntTypeIdx[];
    } else {
        ents_arrs = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    return _vector(__model__, ents_arrs);
}
function _vector(__model__: GIModel, ents_arrs: TEntTypeIdx|TEntTypeIdx[]): Txyz|Txyz[] {
    if (getArrDepth(ents_arrs) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arrs as TEntTypeIdx;
        if (ent_type === EEntType.EDGE) {
            const verts_i: number[] = __model__.modeldata.geom.nav.navAnyToVert(ent_type, index);
            const start: Txyz = __model__.modeldata.attribs.posis.getVertCoords(verts_i[0]);
            const end: Txyz = __model__.modeldata.attribs.posis.getVertCoords(verts_i[1]);
            // if (!start || !end) { console.log(">>>>", verts_i, start, end, __model__.modeldata.geom._geom_maps); }
            return vecSub(end, start);
        } else {
            const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
            const edges_arrs: TEntTypeIdx[] = edges_i.map(edge_i => [EEntType.EDGE, edge_i] as [EEntType, number]);
            return edges_arrs.map( edges_arr => _vector(__model__, edges_arr) ) as Txyz[];
        }
    } else {
        const vectors_arrs: Txyz[]|Txyz[][] =
            (ents_arrs as TEntTypeIdx[]).map( ents_arr => _vector(__model__, ents_arr) ) as Txyz[]|Txyz[][];
        const all_vectors: Txyz[] = [];
        for (const vectors_arr of vectors_arrs) {
            if (getArrDepth(vectors_arr) === 1) {
                all_vectors.push(vectors_arr as Txyz);
            } else {
                for (const vector_arr of vectors_arr) {
                    all_vectors.push(vector_arr as Txyz);
                }
            }
        }
        return all_vectors;
    }
}
