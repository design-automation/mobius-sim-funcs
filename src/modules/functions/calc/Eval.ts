import {
    distance,
    EEntType,
    getArrDepth,
    GIModel,
    idsBreak,
    isEmptyArr,
    TEntTypeIdx,
    TId,
    Txyz,
    vecAdd,
    vecMult,
    vecSub,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';



// ================================================================================================
/**
 * Calculates the xyz coord along an edge, wire, or polyline given a t parameter.
 * \n
 * The 't' parameter varies between 0 and 1, where 0 indicates the start and 1 indicates the end.
 * For example, given a polyline,
 * - evaluating at t=0 gives that xyz at the start,
 * - evaluating at t=0.5 gives the xyz halfway along the polyline,
 * - evaluating at t=1 gives the xyz at the end of the polyline.
 * \n
 * Given a single edge, wire, or polyline, a single xyz coord will be returned.
 * \n
 * Given a list of edges, wires, or polylines, a list of xyz coords will be returned.
 * \n
 * Given any entity that has wires (faces, polygons and collections),
 * a list of wires will be extracted, and a list of coords will be returned.
 *
 * @param __model__
 * @param entities Single or list of edges, wires, polylines, or faces, polygons, or collections.
 * @param t_param A value between 0 to 1.
 * @returns The coordinates [x, y, z], or a list of coordinates.
 * @example `coord1 = calc.Eval(polyline1, 0.25)` will return the coordinate of the point a quarter
 * into polyline1.
 */
export function Eval(__model__: GIModel, entities: TId|TId[], t_param: number): Txyz|Txyz[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Eval';
    let ents_arrs: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1 ],
            [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
        chk.checkArgs(fn_name, 'param', t_param, [chk.isNum01]);
    } else {
        ents_arrs = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    return _eval(__model__, ents_arrs, t_param);
}
function _eval(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], t_param: number): Txyz|Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arr as TEntTypeIdx;
        if (ent_type === EEntType.EDGE || ent_type === EEntType.WIRE || ent_type === EEntType.PLINE) {
            const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
            const num_edges: number = edges_i.length;
            // get all the edge lengths
            let total_dist = 0;
            const dists: number[] = [];
            const xyz_pairs: Txyz[][] = [];
            for (const edge_i of edges_i) {
                const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
                const xyz_0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
                const xyz_1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
                const dist: number = distance(xyz_0, xyz_1);
                total_dist += dist;
                dists.push(total_dist);
                xyz_pairs.push([xyz_0, xyz_1]);
            }
            // map the t_param
            const t_param_mapped: number = t_param * total_dist;
            // loop through and find the point
            for (let i = 0; i < num_edges; i++) {
                if (t_param_mapped < dists[i]) {
                    const xyz_pair: Txyz[] = xyz_pairs[i];
                    let dist_a = 0;
                    if (i > 0) { dist_a = dists[i - 1]; }
                    const dist_b = dists[i];
                    const edge_length = dist_b - dist_a;
                    const to_t = t_param_mapped - dist_a;
                    const vec_len = to_t / edge_length;
                    return vecAdd( xyz_pair[0], vecMult(vecSub(xyz_pair[1], xyz_pair[0]), vec_len) );
                }
            }
            // t param must be 1 (or greater)
            return xyz_pairs[num_edges - 1][1];
        } else {
            const wires_i: number[] = __model__.modeldata.geom.nav.navAnyToWire(ent_type, index);
            const wires_arrs: TEntTypeIdx[] = wires_i.map(wire_i => [EEntType.WIRE, wire_i] as [EEntType, number]);
            return wires_arrs.map( wires_arr => _eval(__model__, wires_arr, t_param) ) as Txyz[];
        }
    } else {
        return (ents_arr as TEntTypeIdx[]).map( ent_arr => _eval(__model__, ent_arr, t_param) ) as Txyz[];
    }
}
