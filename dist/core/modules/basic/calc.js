/**
 * The `calc` module has functions for performing various types of calculations with entities in the model.
 * These functions neither make nor modify anything in the model.
 * These functions all return either numbers or lists of numbers.
 * @module
 */
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { EEntType } from '@design-automation/mobius-sim/dist/geo-info/common';
import { idsBreak } from '@design-automation/mobius-sim/dist/geo-info/common_id_funcs';
import { distance } from '@design-automation/mobius-sim/dist/geom/distance';
import { vecSum, vecDiv, vecAdd, vecSub, vecCross, vecMult, vecFromTo, vecLen, vecDot, vecNorm, vecSetLen } from '@design-automation/mobius-sim/dist/geom/vectors';
import { triangulate } from '@design-automation/mobius-sim/dist/triangulate/triangulate';
import { area } from '@design-automation/mobius-sim/dist/geom/triangle';
import uscore from 'underscore';
import { getCentroid, getCenterOfMass } from './_common';
import { isEmptyArr, arrMakeFlat, arrMaxDepth, getArrDepth } from '@design-automation/mobius-sim/dist/util/arrs';
function rayFromPln(pln) {
    // overloaded case
    const pln_dep = getArrDepth(pln);
    if (pln_dep === 3) {
        return pln.map(pln_one => rayFromPln(pln_one));
    }
    // normal case
    pln = pln;
    return [pln[0].slice(), vecCross(pln[1], pln[2])];
}
// ================================================================================================
export var _EDistanceMethod;
(function (_EDistanceMethod) {
    _EDistanceMethod["PS_PS_DISTANCE"] = "ps_to_ps_distance";
    _EDistanceMethod["PS_E_DISTANCE"] = "ps_to_e_distance";
    _EDistanceMethod["PS_W_DISTANCE"] = "ps_to_w_distance";
})(_EDistanceMethod || (_EDistanceMethod = {}));
/**
 * Calculates the minimum distance from one position to other entities in the model.
 *
 * @param __model__
 * @param entities1 Position to calculate distance from.
 * @param entities2 List of entities to calculate distance to.
 * @param method Enum; distance method.
 * @returns Distance, or list of distances (if position2 is a list).
 * @example distance1 = calc.Distance (position1, position2, p_to_p_distance)
 * @example_info position1 = [0,0,0], position2 = [[0,0,10],[0,0,20]], Expected value of distance is 10.
 */
export function Distance(__model__, entities1, entities2, method) {
    if (isEmptyArr(entities1)) {
        return [];
    }
    if (isEmptyArr(entities2)) {
        return [];
    }
    if (Array.isArray(entities1)) {
        entities1 = arrMakeFlat(entities1);
    }
    entities2 = arrMakeFlat(entities2);
    // --- Error Check ---
    const fn_name = 'calc.Distance';
    let ents_arr1;
    let ents_arr2;
    if (__model__.debug) {
        ents_arr1 = checkIDs(__model__, fn_name, 'entities1', entities1, [ID.isID, ID.isIDL1], null);
        ents_arr2 = checkIDs(__model__, fn_name, 'entities2', entities2, [ID.isIDL1], null);
    }
    else {
        ents_arr1 = idsBreak(entities1);
        ents_arr2 = idsBreak(entities2);
    }
    // --- Error Check ---
    // get the from posis
    let from_posis_i;
    if (arrMaxDepth(ents_arr1) === 1 && ents_arr1[0] === EEntType.POSI) {
        from_posis_i = ents_arr1[1];
    }
    else {
        from_posis_i = [];
        for (const [ent_type, ent_i] of ents_arr1) {
            if (ent_type === EEntType.POSI) {
                from_posis_i.push(ent_i);
            }
            else {
                const ent_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
                for (const ent_posi_i of ent_posis_i) {
                    from_posis_i.push(ent_posi_i);
                }
            }
        }
    }
    // get the to ent_type
    let to_ent_type;
    switch (method) {
        case _EDistanceMethod.PS_PS_DISTANCE:
            to_ent_type = EEntType.POSI;
            break;
        case _EDistanceMethod.PS_W_DISTANCE:
        case _EDistanceMethod.PS_E_DISTANCE:
            to_ent_type = EEntType.EDGE;
            break;
        default:
            break;
    }
    // get the ents and posis sets
    const set_to_ents_i = new Set();
    let set_to_posis_i = new Set();
    for (const [ent_type, ent_i] of ents_arr2) {
        // ents
        if (ent_type === to_ent_type) {
            set_to_ents_i.add(ent_i);
        }
        else {
            const sub_ents_i = __model__.modeldata.geom.nav.navAnyToAny(ent_type, to_ent_type, ent_i);
            for (const sub_ent_i of sub_ents_i) {
                set_to_ents_i.add(sub_ent_i);
            }
        }
        // posis
        if (to_ent_type !== EEntType.POSI) {
            const sub_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
            for (const sub_posi_i of sub_posis_i) {
                set_to_posis_i.add(sub_posi_i);
            }
        }
    }
    // create an array of to_ents
    const to_ents_i = Array.from(set_to_ents_i);
    // cerate a posis xyz map
    const map_posi_i_xyz = new Map();
    if (to_ent_type === EEntType.POSI) {
        set_to_posis_i = set_to_ents_i;
    }
    for (const posi_i of set_to_posis_i) {
        const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        map_posi_i_xyz.set(posi_i, xyz);
    }
    // calc the distance
    switch (method) {
        case _EDistanceMethod.PS_PS_DISTANCE:
            return _distanceManyPosisToPosis(__model__, from_posis_i, to_ents_i, map_posi_i_xyz, method);
        case _EDistanceMethod.PS_W_DISTANCE:
        case _EDistanceMethod.PS_E_DISTANCE:
            return _distanceManyPosisToEdges(__model__, from_posis_i, to_ents_i, map_posi_i_xyz, method);
        default:
            break;
    }
}
function _distanceManyPosisToPosis(__model__, from_posi_i, to_ents_i, map_posi_i_xyz, method) {
    if (!Array.isArray(from_posi_i)) {
        from_posi_i = from_posi_i;
        return _distancePstoPs(__model__, from_posi_i, to_ents_i, map_posi_i_xyz);
    }
    else {
        from_posi_i = from_posi_i;
        // TODO This can be optimised
        // From posis may have duplicates, only calc once
        return from_posi_i.map(one_from => _distanceManyPosisToPosis(__model__, one_from, to_ents_i, map_posi_i_xyz, method));
    }
}
// function _distanceManyPosisToWires(__model__: GIModel, from_posi_i: number|number[], to_ents_i: number[],
//         method: _EDistanceMethod): number|number[] {
//     if (!Array.isArray(from_posi_i)) {
//         from_posi_i = from_posi_i as number;
//         return _distancePstoW(__model__, from_posi_i, to_ents_i) as number;
//     } else  {
//         from_posi_i = from_posi_i as number[];
//         // TODO This can be optimised
//         // There is some vector stuff that gets repeated for each posi to line dist calc
//         return from_posi_i.map( one_from => _distanceManyPosisToWires(__model__, one_from, to_ents_i, method) ) as number[];
//     }
// }
function _distanceManyPosisToEdges(__model__, from_posi_i, to_ents_i, map_posi_i_xyz, method) {
    if (!Array.isArray(from_posi_i)) {
        from_posi_i = from_posi_i;
        return _distancePstoE(__model__, from_posi_i, to_ents_i, map_posi_i_xyz);
    }
    else {
        from_posi_i = from_posi_i;
        // TODO This can be optimised
        // From posis may have duplicates, only calc once
        // Adjacent edges could be calculated once only
        return from_posi_i.map(one_from => _distanceManyPosisToEdges(__model__, one_from, to_ents_i, map_posi_i_xyz, method));
    }
}
function _distancePstoPs(__model__, from_posi_i, to_posis_i, map_posi_i_xyz) {
    const from_xyz = __model__.modeldata.attribs.posis.getPosiCoords(from_posi_i);
    let min_dist = Infinity;
    // loop, measure dist
    for (const to_posi_i of to_posis_i) {
        // get xyz
        const to_xyz = map_posi_i_xyz.get(to_posi_i);
        // calc dist
        const dist = _distancePointToPoint(from_xyz, to_xyz);
        if (dist < min_dist) {
            min_dist = dist;
        }
    }
    return min_dist;
}
// function _distancePstoW(__model__: GIModel, from_posi_i: number, to_wires_i: number[]): number {
//     const from_xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(from_posi_i);
//     let min_dist = Infinity;
//     const map_posi_xyz: Map<number, Txyz> = new Map();
//     for (const wire_i of to_wires_i) {
//         // get the posis
//         const to_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
//         // if closed, add first posi to end
//         if (__model__.modeldata.geom.query.isWireClosed(wire_i)) { to_posis_i.push(to_posis_i[0]); }
//         // add the first xyz to the list, this will be prev
//         let prev_xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(to_posis_i[0]);
//         map_posi_xyz.set(to_posis_i[0], prev_xyz);
//         // loop, measure dist
//         for (let i = 1; i < to_posis_i.length; i++) {
//             // get xyz
//             const curr_posi_i: number = to_posis_i[i];
//             let curr_xyz: Txyz = map_posi_xyz.get(curr_posi_i);
//             if (curr_xyz === undefined) {
//                 curr_xyz = __model__.modeldata.attribs.posis.getPosiCoords(curr_posi_i);
//                 map_posi_xyz.set(curr_posi_i, curr_xyz);
//             }
//             // calc dist
//             const dist: number = _distancePointToLine(from_xyz, prev_xyz, curr_xyz);
//             if (dist < min_dist) { min_dist = dist; }
//             // next
//             prev_xyz = curr_xyz;
//         }
//     }
//     return min_dist;
// }
function _distancePstoE(__model__, from_posi_i, to_edges_i, map_posi_i_xyz) {
    const from_xyz = __model__.modeldata.attribs.posis.getPosiCoords(from_posi_i);
    let min_dist = Infinity;
    for (const edge_i of to_edges_i) {
        // get the posis
        const edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        const xyz_start = map_posi_i_xyz.get(edge_posis_i[0]);
        const xyz_end = map_posi_i_xyz.get(edge_posis_i[1]);
        // calc dist
        const dist = _distancePointToLine(from_xyz, xyz_start, xyz_end);
        if (dist < min_dist) {
            min_dist = dist;
        }
    }
    return min_dist;
}
function _distancePointToPoint(from, to) {
    const a = from[0] - to[0];
    const b = from[1] - to[1];
    const c = from[2] - to[2];
    return Math.sqrt(a * a + b * b + c * c);
}
function _distancePointToLine(from, start, end) {
    const vec_from = vecFromTo(start, from);
    const vec_line = vecFromTo(start, end);
    const len = vecLen(vec_line);
    const vec_line_norm = vecDiv(vec_line, len);
    const dot = vecDot(vec_from, vec_line_norm);
    if (dot <= 0) {
        return _distancePointToPoint(from, start);
    }
    else if (dot >= len) {
        return _distancePointToPoint(from, end);
    }
    const close = vecAdd(start, vecSetLen(vec_line, dot));
    return _distancePointToPoint(from, close);
}
// ================================================================================================
/**
 * Calculates the length of an entity.
 *
 * The entity can be an edge, a wire, a polyline, or anything from which wires can be extracted.
 * This includes polylines, polygons, faces, and collections.
 *
 * Given a list of edges, wires, or polylines, a list of lengths are returned.
 *
 * Given any types of entities from which wires can be extracted, a list of lengths are returned.
 * For example, given a single polygon, a list of lengths are returned (since a polygon may have multiple wires).
 *
 * @param __model__
 * @param entities Single or list of edges or wires or other entities from which wires can be extracted.
 * @returns Lengths, a number or list of numbers.
 * @example length1 = calc.Length(line1)
 */
export function Length(__model__, entities) {
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Length';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
    }
    else {
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    return _length(__model__, ents_arr);
}
function _length(__model__, ents_arrs) {
    if (getArrDepth(ents_arrs) === 1) {
        const [ent_type, index] = ents_arrs;
        if (ent_type === EEntType.EDGE) {
            return _edgeLength(__model__, index);
        }
        else if (ent_type === EEntType.WIRE) {
            return _wireLength(__model__, index);
        }
        else if (ent_type === EEntType.PLINE) {
            const wire_i = __model__.modeldata.geom.nav.navPlineToWire(index);
            return _wireLength(__model__, wire_i);
        }
        else {
            const wires_i = __model__.modeldata.geom.nav.navAnyToWire(ent_type, index);
            return wires_i.map(wire_i => _wireLength(__model__, wire_i));
        }
    }
    else {
        const lengths = ents_arrs.map(ents_arr => _length(__model__, ents_arr));
        return uscore.flatten(lengths);
    }
}
function _edgeLength(__model__, edge_i) {
    const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
    const xyz_0 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
    const xyz_1 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
    return distance(xyz_0, xyz_1);
}
function _wireLength(__model__, wire_i) {
    const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
    let dist = 0;
    for (let i = 0; i < posis_i.length - 1; i++) {
        const xyz_0 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[i]);
        const xyz_1 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[i + 1]);
        dist += distance(xyz_0, xyz_1);
    }
    if (__model__.modeldata.geom.query.isWireClosed(wire_i)) {
        const xyz_0 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[posis_i.length - 1]);
        const xyz_1 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
        dist += distance(xyz_0, xyz_1);
    }
    return dist;
}
// ================================================================================================
/**
 * Calculates the area of en entity.
 *
 * The entity can be a polygon, a face, a closed polyline, a closed wire, or a collection.
 *
 * Given a list of entities, a list of areas are returned.
 *
 * @param __model__
 * @param entities Single or list of polygons, closed polylines, closed wires, collections.
 * @returns Area.
 * @example area1 = calc.Area (surface1)
 */
export function Area(__model__, entities) {
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Area';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.PGON, EEntType.PLINE, EEntType.WIRE, EEntType.COLL]);
    }
    else {
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    return _area(__model__, ents_arr);
}
function _area(__model__, ents_arrs) {
    if (getArrDepth(ents_arrs) === 1) {
        const [ent_type, ent_i] = ents_arrs;
        if (ent_type === EEntType.PGON) {
            // faces, these are already triangulated
            const tris_i = __model__.modeldata.geom.nav_tri.navPgonToTri(ent_i);
            let total_area = 0;
            for (const tri_i of tris_i) {
                const corners_i = __model__.modeldata.geom.nav_tri.navTriToPosi(tri_i);
                if (corners_i.length !== 3) {
                    continue;
                } // two or more verts have same posi, so area is 0
                const corners_xyzs = corners_i.map(corner_i => __model__.modeldata.attribs.posis.getPosiCoords(corner_i));
                const tri_area = area(corners_xyzs[0], corners_xyzs[1], corners_xyzs[2]);
                total_area += tri_area;
            }
            return total_area;
        }
        else if (ent_type === EEntType.PLINE || ent_type === EEntType.WIRE) {
            // wires, these need to be triangulated
            let wire_i = ent_i;
            if (ent_type === EEntType.PLINE) {
                wire_i = __model__.modeldata.geom.nav.navPlineToWire(ent_i);
            }
            if (!__model__.modeldata.geom.query.isWireClosed(wire_i)) {
                throw new Error('To calculate area, wire must be closed');
            }
            const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, ent_i);
            const xyzs = posis_i.map(posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
            const tris = triangulate(xyzs);
            let total_area = 0;
            for (const tri of tris) {
                const corners_xyzs = tri.map(corner_i => xyzs[corner_i]);
                const tri_area = area(corners_xyzs[0], corners_xyzs[1], corners_xyzs[2]);
                total_area += tri_area;
            }
            return total_area;
        }
        else {
            return 0;
        }
    }
    else {
        const areas = ents_arrs.map(ents_arr => _area(__model__, ents_arr));
        return uscore.flatten(areas);
    }
}
// ================================================================================================
/**
 * Returns a vector along an edge, from the start position to the end position.
 * The vector is not normalized.
 *
 * Given a single edge, a single vector will be returned. Given a list of edges, a list of vectors will be returned.
 *
 * Given any entity that has edges (collection, polygons, polylines, faces, and wires),
 * a list of edges will be extracted, and a list of vectors will be returned.
 *
 * @param __model__
 * @param entities Single or list of edges, or any entity from which edges can be extracted.
 * @returns The vector [x, y, z] or a list of vectors.
 */
export function Vector(__model__, entities) {
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Vector';
    let ents_arrs;
    if (__model__.debug) {
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.PGON, EEntType.PLINE, EEntType.WIRE, EEntType.EDGE]);
    }
    else {
        ents_arrs = idsBreak(entities);
    }
    // --- Error Check ---
    return _vector(__model__, ents_arrs);
}
function _vector(__model__, ents_arrs) {
    if (getArrDepth(ents_arrs) === 1) {
        const [ent_type, index] = ents_arrs;
        if (ent_type === EEntType.EDGE) {
            const verts_i = __model__.modeldata.geom.nav.navAnyToVert(ent_type, index);
            const start = __model__.modeldata.attribs.posis.getVertCoords(verts_i[0]);
            const end = __model__.modeldata.attribs.posis.getVertCoords(verts_i[1]);
            // if (!start || !end) { console.log(">>>>", verts_i, start, end, __model__.modeldata.geom._geom_maps); }
            return vecSub(end, start);
        }
        else {
            const edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
            const edges_arrs = edges_i.map(edge_i => [EEntType.EDGE, edge_i]);
            return edges_arrs.map(edges_arr => _vector(__model__, edges_arr));
        }
    }
    else {
        const vectors_arrs = ents_arrs.map(ents_arr => _vector(__model__, ents_arr));
        const all_vectors = [];
        for (const vectors_arr of vectors_arrs) {
            if (getArrDepth(vectors_arr) === 1) {
                all_vectors.push(vectors_arr);
            }
            else {
                for (const vector_arr of vectors_arr) {
                    all_vectors.push(vector_arr);
                }
            }
        }
        return all_vectors;
    }
}
// ================================================================================================
export var _ECentroidMethod;
(function (_ECentroidMethod) {
    _ECentroidMethod["PS_AVERAGE"] = "ps_average";
    _ECentroidMethod["CENTER_OF_MASS"] = "center_of_mass";
})(_ECentroidMethod || (_ECentroidMethod = {}));
/**
 * Calculates the centroid of an entity.
 *
 * If 'ps_average' is selected, the centroid is the average of the positions that make up that entity.
 *
 * If 'center_of_mass' is selected, the centroid is the centre of mass of the faces that make up that entity.
 * Note that only faces are deemed to have mass.
 *
 * Given a list of entities, a list of centroids will be returned.
 *
 * Given a list of positions, a single centroid that is the average of all those positions will be returned.
 *
 * @param __model__
 * @param entities Single or list of entities. (Can be any type of entities.)
 * @param method Enum, the method for calculating the centroid.
 * @returns A centroid [x, y, z] or a list of centroids.
 * @example centroid1 = calc.Centroid (polygon1)
 */
export function Centroid(__model__, entities, method) {
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Centroid';
    let ents_arrs;
    if (__model__.debug) {
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null);
    }
    else {
        ents_arrs = idsBreak(entities);
    }
    // --- Error Check ---
    switch (method) {
        case _ECentroidMethod.PS_AVERAGE:
            return getCentroid(__model__, ents_arrs);
        case _ECentroidMethod.CENTER_OF_MASS:
            return getCenterOfMass(__model__, ents_arrs);
        default:
            break;
    }
}
// ================================================================================================
/**
 * Calculates the normal vector of an entity or list of entities. The vector is normalised, and scaled
 * by the specified scale factor.
 *
 * Given a single entity, a single normal will be returned. Given a list of entities, a list of normals will be returned.
 *
 * For polygons, faces, and face wires the normal is calculated by taking the average of all the normals of the face triangles.
 *
 * For polylines and polyline wires, the normal is calculated by triangulating the positions, and then
 * taking the average of all the normals of the triangles.
 *
 * For edges, the normal is calculated by takingthe avery of the normals of the two vertices.
 *
 * For vertices, the normal is calculated by creating a triangle out of the two adjacent edges,
 * and then calculating the normal of the triangle.
 * (If there is only one edge, or if the two adjacent edges are colinear, the the normal of the wire is returned.)
 *
 * For positions, the normal is calculated by taking the average of the normals of all the vertices linked to the position.
 *
 * If the normal cannot be calculated, [0, 0, 0] will be returned.
 *
 * @param __model__
 * @param entities Single or list of entities. (Can be any type of entities.)
 * @param scale The scale factor for the normal vector. (This is equivalent to the length of the normal vector.)
 * @returns The normal vector [x, y, z] or a list of normal vectors.
 * @example normal1 = calc.Normal (polygon1, 1)
 * @example_info If the input is non-planar, the output vector will be an average of all normals vector of the polygon triangles.
 */
export function Normal(__model__, entities, scale) {
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Normal';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null);
        chk.checkArgs(fn_name, 'scale', scale, [chk.isNum]);
    }
    else {
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    return _normal(__model__, ents_arr, scale);
}
export function _normal(__model__, ents_arr, scale) {
    if (getArrDepth(ents_arr) === 1) {
        const ent_type = ents_arr[0];
        const index = ents_arr[1];
        if (ent_type === EEntType.PGON) {
            const norm_vec = __model__.modeldata.geom.query.getPgonNormal(index);
            return vecMult(norm_vec, scale);
        }
        else if (ent_type === EEntType.PLINE) {
            const norm_vec = __model__.modeldata.geom.query.getWireNormal(__model__.modeldata.geom.nav.navPlineToWire(index));
            return vecMult(norm_vec, scale);
        }
        else if (ent_type === EEntType.WIRE) {
            const norm_vec = __model__.modeldata.geom.query.getWireNormal(index);
            return vecMult(norm_vec, scale);
        }
        else if (ent_type === EEntType.EDGE) {
            const verts_i = __model__.modeldata.geom.nav.navEdgeToVert(index);
            const norm_vecs = verts_i.map(vert_i => _vertNormal(__model__, vert_i));
            const norm_vec = vecDiv(vecSum(norm_vecs), norm_vecs.length);
            return vecMult(norm_vec, scale);
        }
        else if (ent_type === EEntType.VERT) {
            const norm_vec = _vertNormal(__model__, index);
            return vecMult(norm_vec, scale);
        }
        else if (ent_type === EEntType.POSI) {
            const verts_i = __model__.modeldata.geom.nav.navPosiToVert(index);
            if (verts_i.length > 0) {
                const norm_vecs = verts_i.map(vert_i => _vertNormal(__model__, vert_i));
                const norm_vec = vecDiv(vecSum(norm_vecs), norm_vecs.length);
                return vecMult(norm_vec, scale);
            }
            return [0, 0, 0];
        }
        else if (ent_type === EEntType.POINT) {
            return [0, 0, 0];
        }
    }
    else {
        return ents_arr.map(ent_arr => _normal(__model__, ent_arr, scale));
    }
}
function _vertNormal(__model__, index) {
    let norm_vec;
    const edges_i = __model__.modeldata.geom.nav.navVertToEdge(index);
    if (edges_i.length === 1) {
        const posis0_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edges_i[0]);
        const posis1_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edges_i[1]);
        const p_mid = __model__.modeldata.attribs.posis.getPosiCoords(posis0_i[1]); // same as posis1_i[0]
        const p_a = __model__.modeldata.attribs.posis.getPosiCoords(posis0_i[0]);
        const p_b = __model__.modeldata.attribs.posis.getPosiCoords(posis1_i[1]);
        norm_vec = vecCross(vecFromTo(p_mid, p_a), vecFromTo(p_mid, p_b), true);
        if (vecLen(norm_vec) > 0) {
            return norm_vec;
        }
    }
    const wire_i = __model__.modeldata.geom.nav.navEdgeToWire(edges_i[0]);
    norm_vec = __model__.modeldata.geom.query.getWireNormal(wire_i);
    return norm_vec;
}
// ================================================================================================
/**
 * Calculates the xyz coord along an edge, wire, or polyline given a t parameter.
 *
 * The 't' parameter varies between 0 and 1, where 0 indicates the start and 1 indicates the end.
 * For example, given a polyline,
 * evaluating at t=0 gives that xyz at the start,
 * evaluating at t=0.5 gives the xyz halfway along the polyline,
 * evaluating at t=1 gives the xyz at the end of the polyline.
 *
 * Given a single edge, wire, or polyline, a single xyz coord will be returned.
 *
 * Given a list of edges, wires, or polylines, a list of xyz coords will be returned.
 *
 * Given any entity that has wires (faces, polygons and collections),
 * a list of wires will be extracted, and a list of coords will be returned.
 *
 * @param __model__
 * @param entities Single or list of edges, wires, polylines, or faces, polygons, or collections.
 * @param t_param A value between 0 to 1.
 * @returns The coordinates [x, y, z], or a list of coordinates.
 * @example coord1 = calc.Eval (polyline1, 0.23)
 */
export function Eval(__model__, entities, t_param) {
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Eval';
    let ents_arrs;
    if (__model__.debug) {
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
        chk.checkArgs(fn_name, 'param', t_param, [chk.isNum01]);
    }
    else {
        ents_arrs = idsBreak(entities);
    }
    // --- Error Check ---
    return _eval(__model__, ents_arrs, t_param);
}
function _eval(__model__, ents_arr, t_param) {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index] = ents_arr;
        if (ent_type === EEntType.EDGE || ent_type === EEntType.WIRE || ent_type === EEntType.PLINE) {
            const edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
            const num_edges = edges_i.length;
            // get all the edge lengths
            let total_dist = 0;
            const dists = [];
            const xyz_pairs = [];
            for (const edge_i of edges_i) {
                const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
                const xyz_0 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
                const xyz_1 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
                const dist = distance(xyz_0, xyz_1);
                total_dist += dist;
                dists.push(total_dist);
                xyz_pairs.push([xyz_0, xyz_1]);
            }
            // map the t_param
            const t_param_mapped = t_param * total_dist;
            // loop through and find the point
            for (let i = 0; i < num_edges; i++) {
                if (t_param_mapped < dists[i]) {
                    const xyz_pair = xyz_pairs[i];
                    let dist_a = 0;
                    if (i > 0) {
                        dist_a = dists[i - 1];
                    }
                    const dist_b = dists[i];
                    const edge_length = dist_b - dist_a;
                    const to_t = t_param_mapped - dist_a;
                    const vec_len = to_t / edge_length;
                    return vecAdd(xyz_pair[0], vecMult(vecSub(xyz_pair[1], xyz_pair[0]), vec_len));
                }
            }
            // t param must be 1 (or greater)
            return xyz_pairs[num_edges - 1][1];
        }
        else {
            const wires_i = __model__.modeldata.geom.nav.navAnyToWire(ent_type, index);
            const wires_arrs = wires_i.map(wire_i => [EEntType.WIRE, wire_i]);
            return wires_arrs.map(wires_arr => _eval(__model__, wires_arr, t_param));
        }
    }
    else {
        return ents_arr.map(ent_arr => _eval(__model__, ent_arr, t_param));
    }
}
// ================================================================================================
/**
 * Returns a ray for an edge or a polygons.
 *
 * For edges, it returns a ray along the edge, from the start vertex to the end vertex
 *
 * For a polygon, it returns the ray that is the z-axis of the plane.
 *
 * For an edge, the ray vector is not normalised. For a polygon, the ray vector is normalised.
 *
 * @param __model__
 * @param entities An edge, a wirea polygon, or a list.
 * @returns The ray.
 */
export function Ray(__model__, entities) {
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Ray';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1, ID.isIDL2], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]);
    }
    else {
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    return _getRay(__model__, ents_arr);
}
function _getRayFromEdge(__model__, ent_arr) {
    const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]);
    const xyzs = posis_i.map(posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
    return [xyzs[0], vecSub(xyzs[1], xyzs[0])];
}
function _getRayFromPgon(__model__, ent_arr) {
    const plane = _getPlane(__model__, ent_arr);
    return rayFromPln(plane);
}
function _getRayFromEdges(__model__, ent_arr) {
    const edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_arr[0], ent_arr[1]);
    return edges_i.map(edge_i => _getRayFromEdge(__model__, [EEntType.EDGE, edge_i]));
}
function _getRay(__model__, ents_arr) {
    if (getArrDepth(ents_arr) === 1) {
        const ent_arr = ents_arr;
        if (ent_arr[0] === EEntType.EDGE) {
            return _getRayFromEdge(__model__, ent_arr);
        }
        else if (ent_arr[0] === EEntType.PLINE || ent_arr[0] === EEntType.WIRE) {
            return _getRayFromEdges(__model__, ent_arr);
        }
        else if (ent_arr[0] === EEntType.PGON) {
            return _getRayFromPgon(__model__, ent_arr);
        }
    }
    else {
        return ents_arr.map(ent_arr => _getRay(__model__, ent_arr));
    }
}
// ================================================================================================
/**
 * Returns a plane from a polygon, a face, a polyline, or a wire.
 * For polylines or wires, there must be at least three non-colinear vertices.
 *
 * The winding order is counter-clockwise.
 * This means that if the vertices are ordered counter-clockwise relative to your point of view,
 * then the z axis of the plane will be pointing towards you.
 *
 * @param entities Any entities
 * @returns The plane.
 */
export function Plane(__model__, entities) {
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Plane';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1, ID.isIDL2], null); // takes in any
    }
    else {
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    return _getPlane(__model__, ents_arr);
}
function _getPlane(__model__, ents_arr) {
    if (getArrDepth(ents_arr) === 1) {
        const ent_arr = ents_arr;
        const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]);
        const unique_posis_i = Array.from(new Set(posis_i));
        if (unique_posis_i.length < 3) {
            throw new Error('Too few points to calculate plane.');
        }
        const unique_xyzs = unique_posis_i.map(posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
        const origin = vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
        // const normal: Txyz = newellNorm(unique_xyzs);
        const normal = _normal(__model__, ent_arr, 1);
        const x_vec = vecNorm(vecFromTo(unique_xyzs[0], unique_xyzs[1]));
        const y_vec = vecCross(normal, x_vec); // must be z-axis, x-axis
        return [origin, x_vec, y_vec];
    }
    else {
        return ents_arr.map(ent_arr => _getPlane(__model__, ent_arr));
    }
}
// ================================================================================================
/**
 * Returns the bounding box of the entities.
 * The bounding box is an imaginary box that completley contains all the geometry.
 * The box is always aligned with the global x, y, and z axes.
 * The bounding box consists of a list of lists, as follows [[x, y, z], [x, y, z], [x, y, z], [x, y, z]].
 *
 * - The first [x, y, z] is the coordinates of the centre of the bounding box.
 * - The second [x, y, z] is the corner of the bounding box with the lowest x, y, z values.
 * - The third [x, y, z] is the corner of the bounding box with the highest x, y, z values.
 * - The fourth [x, y, z] is the dimensions of the bounding box.
 *
 * @param __model__
 * @param entities The etities for which to calculate the bounding box.
 * @returns The bounding box consisting of a list of four lists.
 */
export function BBox(__model__, entities) {
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = 'calc.BBox';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isIDL1], null); // all
    }
    else {
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    return _getBoundingBox(__model__, ents_arr);
}
function _getBoundingBox(__model__, ents_arr) {
    const posis_set_i = new Set();
    for (const ent_arr of ents_arr) {
        const ent_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]);
        for (const ent_posi_i of ent_posis_i) {
            posis_set_i.add(ent_posi_i);
        }
    }
    const unique_posis_i = Array.from(posis_set_i);
    const unique_xyzs = unique_posis_i.map(posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
    const corner_min = [Infinity, Infinity, Infinity];
    const corner_max = [-Infinity, -Infinity, -Infinity];
    for (const unique_xyz of unique_xyzs) {
        if (unique_xyz[0] < corner_min[0]) {
            corner_min[0] = unique_xyz[0];
        }
        if (unique_xyz[1] < corner_min[1]) {
            corner_min[1] = unique_xyz[1];
        }
        if (unique_xyz[2] < corner_min[2]) {
            corner_min[2] = unique_xyz[2];
        }
        if (unique_xyz[0] > corner_max[0]) {
            corner_max[0] = unique_xyz[0];
        }
        if (unique_xyz[1] > corner_max[1]) {
            corner_max[1] = unique_xyz[1];
        }
        if (unique_xyz[2] > corner_max[2]) {
            corner_max[2] = unique_xyz[2];
        }
    }
    return [
        [(corner_min[0] + corner_max[0]) / 2, (corner_min[1] + corner_max[1]) / 2, (corner_min[2] + corner_max[2]) / 2],
        corner_min,
        corner_max,
        [corner_max[0] - corner_min[0], corner_max[1] - corner_min[1], corner_max[2] - corner_min[2]]
    ];
}
// ================================================================================================
// /**
//  * Calculates the distance between a ray or plane and a list of positions.
//  *
//  * @param __model__
//  * @param ray_or_plane Ray or a plane.
//  * @param entities A position or list of positions.
//  * @param method Enum; all_distances or min_distance.
//  * @returns Distance, or list of distances.
//  * @example distance1 = virtual.Distance(ray, positions, all_distances)
//  * @example_info Returns a list of distances between the ray and each position.
//  */
// export function Distance(__model__: GIModel, ray_or_plane: TRay|TPlane, entities: TId|TId[], method: _EDistanceMethod): number|number[] {
//     // --- Error Check ---
//     const fn_name = 'virtual.Distance';
//     checkCommTypes(fn_name, 'ray_or_plane', ray_or_plane, [TypeCheckObj.isRay, TypeCheckObj.isPlane]);
//     const ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [IDcheckObj.isID, IDcheckObj.isIDList],
//         [EEntType.POSI]) as TEntTypeIdx|TEntTypeIdx[];
//     // --- Error Check ---
//     const one_posi: boolean = getArrDepth(ents_arr) === 1;
//     // get the to posis_i
//     let posis_i: number|number[] = null;
//     if (one_posi) {
//         posis_i = ents_arr[1] as number;
//     } else {
//         posis_i = (ents_arr as TEntTypeIdx[]).map( ent_arr => ent_arr[1] ) as number[];
//     }
//     // get a list of distances
//     let dists: number|number[] = null;
//     if (ray_or_plane.length === 2) { // ray
//         const ray_tjs: THREE.Ray = new THREE.Ray(new THREE.Vector3(...ray_or_plane[0]), new THREE.Vector3(...ray_or_plane[1]));
//         dists = _distanceRaytoP(__model__, ray_tjs, posis_i);
//     } else if (ray_or_plane.length === 3) { // plane
//         const plane_normal: Txyz = vecCross(ray_or_plane[1], ray_or_plane[2]);
//         const plane_tjs: THREE.Plane = new THREE.Plane();
//         plane_tjs.setFromNormalAndCoplanarPoint( new THREE.Vector3(...plane_normal), new THREE.Vector3(...ray_or_plane[0]) );
//         dists = _distancePlanetoP(__model__, plane_tjs, posis_i);
//     }
//     // return either the min or the whole list
//     if (method === _EDistanceMethod.MIN_DISTANCE && !one_posi) {
//         return Math.min(...dists as number[]);
//     }
//     return dists;
// }
// function _distanceRaytoP(__model__: GIModel, ray_tjs: THREE.Ray, posis_i: number|number[]): number|number[] {
//     if (!Array.isArray(posis_i)) {
//         const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i);
//         return ray_tjs.distanceToPoint( new THREE.Vector3(...xyz) ) as number;
//     } else {
//         return posis_i.map( posi_i => _distanceRaytoP(__model__, ray_tjs, posi_i) ) as number[];
//     }
// }
// function _distancePlanetoP(__model__: GIModel, plane_tjs: THREE.Plane, posis_i: number|number[]): number|number[] {
//     if (!Array.isArray(posis_i)) {
//         const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i);
//         return plane_tjs.distanceToPoint( new THREE.Vector3(...xyz) ) as number;
//     } else {
//         return posis_i.map( posi_i => _distancePlanetoP(__model__, plane_tjs, posi_i) ) as number[];
//     }
// }
// export enum _EDistanceMethod {
//     ALL_DISTANCES = 'all_distances',
//     MIN_DISTANCE = 'min_distance'
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL21vZHVsZXMvYmFzaWMvY2FsYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFaEQsT0FBTyxLQUFLLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQztBQUcxQyxPQUFPLEVBQWEsUUFBUSxFQUF5QyxNQUFNLG9EQUFvRCxDQUFDO0FBQ2hJLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSw2REFBNkQsQ0FBQztBQUN2RixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDNUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUNuSyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDekYsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ3hFLE9BQU8sTUFBTSxNQUFNLFlBQVksQ0FBQztBQUNoQyxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFFakgsU0FBUyxVQUFVLENBQUMsR0FBb0I7SUFDcEMsa0JBQWtCO0lBQ2xCLE1BQU0sT0FBTyxHQUFXLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QyxJQUFJLE9BQU8sS0FBSyxDQUFDLEVBQUU7UUFBRSxPQUFRLEdBQWdCLENBQUMsR0FBRyxDQUFFLE9BQU8sQ0FB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UUFBUSxDQUFDLENBQUM7SUFDeEQsTUFBTSxVQUFVLEdBQVMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNELEtBQUssTUFBTSxVQUFVLElBQUksV0FBVyxFQUFFO1FBQ2xDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FBRTtRQUNyRSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQUU7UUFDckUsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUFFO1FBQ3JFLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FBRTtRQUNyRSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQUU7UUFDckUsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUFFO0tBQ3hFO0lBQ0QsT0FBTztRQUNILENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0csVUFBVTtRQUNWLFVBQVU7UUFDVixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hHLENBQUM7QUFDTixDQUFDO0FBQ0QsbUdBQW1HO0FBQ25HLE1BQU07QUFDTiw2RUFBNkU7QUFDN0UsS0FBSztBQUNMLHNCQUFzQjtBQUN0Qix5Q0FBeUM7QUFDekMsc0RBQXNEO0FBQ3RELHdEQUF3RDtBQUN4RCw4Q0FBOEM7QUFDOUMsMEVBQTBFO0FBQzFFLGtGQUFrRjtBQUNsRixNQUFNO0FBQ04sNElBQTRJO0FBQzVJLDZCQUE2QjtBQUM3QiwwQ0FBMEM7QUFDMUMseUdBQXlHO0FBQ3pHLGtIQUFrSDtBQUNsSCx5REFBeUQ7QUFDekQsNkJBQTZCO0FBQzdCLDZEQUE2RDtBQUM3RCw0QkFBNEI7QUFDNUIsMkNBQTJDO0FBQzNDLHNCQUFzQjtBQUN0QiwyQ0FBMkM7QUFDM0MsZUFBZTtBQUNmLDBGQUEwRjtBQUMxRixRQUFRO0FBQ1IsaUNBQWlDO0FBQ2pDLHlDQUF5QztBQUN6Qyw4Q0FBOEM7QUFDOUMsa0lBQWtJO0FBQ2xJLGdFQUFnRTtBQUNoRSx1REFBdUQ7QUFDdkQsaUZBQWlGO0FBQ2pGLDREQUE0RDtBQUM1RCxnSUFBZ0k7QUFDaEksb0VBQW9FO0FBQ3BFLFFBQVE7QUFDUixpREFBaUQ7QUFDakQsbUVBQW1FO0FBQ25FLGlEQUFpRDtBQUNqRCxRQUFRO0FBQ1Isb0JBQW9CO0FBQ3BCLElBQUk7QUFDSixnSEFBZ0g7QUFDaEgscUNBQXFDO0FBQ3JDLHNGQUFzRjtBQUN0RixpRkFBaUY7QUFDakYsZUFBZTtBQUNmLG1HQUFtRztBQUNuRyxRQUFRO0FBQ1IsSUFBSTtBQUNKLHNIQUFzSDtBQUN0SCxxQ0FBcUM7QUFDckMsc0ZBQXNGO0FBQ3RGLG1GQUFtRjtBQUNuRixlQUFlO0FBQ2YsdUdBQXVHO0FBQ3ZHLFFBQVE7QUFDUixJQUFJO0FBQ0osaUNBQWlDO0FBQ2pDLHVDQUF1QztBQUN2QyxvQ0FBb0M7QUFDcEMsSUFBSSJ9