import {
    ENT_TYPE,
    getArrDepth,
    Sim,
    idsBreak,
    isEmptyArr,
    string,
    string,
    Txyz,
    vecCross,
    vecDiv,
    vecFromTo,
    vecLen,
    vecMult,
    vecSum,
} from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../../_check_types';



// ================================================================================================
/**
 * Calculates the normal vector of an entity or list of entities. The vector is normalised, and
 * scaled by the specified scale factor.
 * \n
 * Given a single entity, a single normal will be returned. Given a list of entities, a list of
 * normals will be returned.
 * \n
 * For polygons, faces, and face wires the normal is calculated by taking the average of all the
 * normals of the face triangles.
 * \n
 * For polylines and polyline wires, the normal is calculated by triangulating the positions, and
 * then taking the average of all the normals of the triangles.
 * \n
 * For edges, the normal is calculated by taking the average of the normals of the two vertices.
 * \n
 * For vertices, the normal is calculated by creating a triangle out of the two adjacent edges, and
 * then calculating the normal of the triangle. (If there is only one edge, or if the two adjacent
 * edges are colinear, the the normal of the wire is returned.)
 * \n
 * For positions, the normal is calculated by taking the average of the normals of all the vertices
 * linked to the position.
 * \n
 * If the normal cannot be calculated, `[0, 0, 0]` will be returned.
 *
 * @param __model__
 * @param entities Single or list of entities. (Can be any type of entities.)
 * @param scale The scale factor for the normal vector. (This is equivalent to the length of the
 * normal vector.)
 * @returns The normal vector [x, y, z] or a list of normal vectors.
 * @example `normal1 = calc.Normal(polygon1, 1)`
 * @example_info If the input is non-planar, the output vector will be an average of all normals
 * vector of the polygon triangles.
 */
export function Normal(__model__: Sim, entities: string|string[], scale: number): Txyz|Txyz[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Normal';
    let ents_arr: string|string[];
    if (this.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL1], null) as  string|string[];
        chk.checkArgs(fn_name, 'scale', scale, [chk.isNum]);
    } else {
        ents_arr = idsBreak(entities) as string|string[];
    }
    // --- Error Check ---
    return _normal(__model__, ents_arr, scale);
}
export function _normal(__model__: Sim, ents_arr: string|string[], scale: number): Txyz|Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_type: ENT_TYPE = (ents_arr as string)[0];
        const index: number = (ents_arr as string)[1];
        if (ent_type === ENT_TYPE.PGON) {
            const norm_vec: Txyz = __model__.modeldata.geom.query.getPgonNormal(index);
            return vecMult(norm_vec, scale);
        } else if (ent_type === ENT_TYPE.PLINE) {
            const norm_vec: Txyz = __model__.modeldata.geom.query.getWireNormal(__model__.modeldata.geom.nav.navPlineToWire(index));
            return vecMult(norm_vec, scale);
        } else if (ent_type === ENT_TYPE.WIRE) {
            const norm_vec: Txyz = __model__.modeldata.geom.query.getWireNormal(index);
            return vecMult(norm_vec, scale);
        } else if (ent_type === ENT_TYPE.EDGE) {
            const verts_i: number[] = __model__.modeldata.geom.nav.navEdgeToVert(index);
            const norm_vecs: Txyz[] = verts_i.map( vert_i => _vertNormal(__model__, vert_i) );
            const norm_vec: Txyz = vecDiv( vecSum(norm_vecs), norm_vecs.length);
            return vecMult(norm_vec, scale);
        } else if (ent_type === ENT_TYPE.VERT) {
            const norm_vec: Txyz = _vertNormal(__model__, index);
            return vecMult(norm_vec, scale);
        } else if (ent_type === ENT_TYPE.POSI) {
            const verts_i: number[] = __model__.modeldata.geom.nav.navPosiToVert(index);
            if (verts_i.length > 0) {
                const norm_vecs: Txyz[] = verts_i.map( vert_i => _vertNormal(__model__, vert_i) );
                const norm_vec: Txyz = vecDiv( vecSum(norm_vecs), norm_vecs.length);
                return vecMult(norm_vec, scale);
            }
            return [0, 0, 0];
        }  else if (ent_type === ENT_TYPE.POINT) {
            return [0, 0, 0];
        }
    } else {
        return (ents_arr as string[]).map(ent_arr => _normal(__model__, ent_arr, scale)) as Txyz[];
    }
}
function _vertNormal(__model__: Sim, index: number) {
    let norm_vec: Txyz;
    const edges_i: number[] = __model__.modeldata.geom.nav.navVertToEdge(index);
    if (edges_i.length === 1) {
        const posis0_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ENT_TYPE.EDGE, edges_i[0]);
        const posis1_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ENT_TYPE.EDGE, edges_i[1]);
        const p_mid: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis0_i[1]); // same as posis1_i[0]
        const p_a: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis0_i[0]);
        const p_b: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis1_i[1]);
        norm_vec = vecCross( vecFromTo(p_mid, p_a), vecFromTo(p_mid, p_b), true);
        if (vecLen(norm_vec) > 0) { return norm_vec; }
    }
    const wire_i: number = __model__.modeldata.geom.nav.navEdgeToWire(edges_i[0]);
    norm_vec = __model__.modeldata.geom.query.getWireNormal(wire_i);
    return norm_vec;
}
