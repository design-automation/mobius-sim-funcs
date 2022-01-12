import {
    arrMakeFlat,
    distanceManhattan,
    EEntType,
    GIModel,
    idsBreak,
    idsMake,
    isEmptyArr,
    TEntTypeIdx,
    TId,
    Txy,
    Txyz,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../../_check_ids';


// Clipper types
// ================================================================================================
/**
 * Adds vertices to polyline and polygons at all locations where egdes intersect one another.
 * The vertices are welded.
 * This can be useful for creating networks that can be used for shortest path calculations.
 * \n
 * The input polyline and polygons are copied.
 * \n
 * @param __model__
 * @param entities A list polylines or polygons, or entities from which polylines or polygons can be extracted.
 * @param tolerance The tolerance for extending open plines if they are almost intersecting. 
 * @returns Copies of the input polyline and polygons, stiched.
 */
export function Stitch(__model__: GIModel, entities: TId | TId[], tolerance: number): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'poly2d.Stitch';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isIDL1, ID.isIDL2], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    // copy the list of entities
    const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_common.copyGeom(ents_arr, true) as TEntTypeIdx[];
    __model__.modeldata.funcs_common.clonePosisInEnts(new_ents_arr, true);
    // create maps for data
    const map_edge_i_to_posi_i: Map<number, [number, number]> = new Map();
    const map_edge_i_to_bbox: Map<number, [Txy, Txy]> = new Map();
    const map_posi_i_to_xyz: Map<number, Txyz> = new Map();
    const map_edge_i_to_tol: Map<number, [number, number]> = new Map();
    // get the edges
    // const ents_arr2: TEntTypeIdx[] = [];
    // const edges_i: number[] = [];
    // for (const pline_i of __model__.modeldata.geom.add.copyPlines(Array.from(set_plines_i), true) as number[]) {
    //     ents_arr2.push([EEntType.PLINE, pline_i]);
    //     const ent_edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(EEntType.PLINE, pline_i);
    //     for (const edge_i of ent_edges_i) {
    //         edges_i.push(edge_i);
    //         _knifeGetEdgeData(__model__, edge_i, map_edge_i_to_posi_i, map_edge_i_to_bbox, map_posi_i_to_xyz);
    //     }
    // }
    // set tolerance for intersections
    const edges_i: number[] = [];
    // do stitch
    for (const [ent_type, ent_i] of new_ents_arr) {
        const ent_wires_i: number[] = __model__.modeldata.geom.nav.navAnyToWire(ent_type, ent_i);
        for (const ent_wire_i of ent_wires_i) {
            const wire_edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(EEntType.WIRE, ent_wire_i);
            const is_closed: boolean = __model__.modeldata.geom.query.isWireClosed(ent_wire_i);
            for (let i = 0; i < wire_edges_i.length; i++) {
                const wire_edge_i: number = wire_edges_i[i];
                edges_i.push(wire_edge_i);
                let edge_tol: [number, number] = [0, 0];
                if (!is_closed) {
                    if (wire_edges_i.length === 1) {
                        edge_tol = [-tolerance, tolerance];
                    } else if (i === 0) { // first edge
                        edge_tol = [-tolerance, 0];
                    } else if (i === wire_edges_i.length - 1) { // last edge
                        edge_tol = [0, tolerance];
                    }
                    map_edge_i_to_tol.set(wire_edge_i, edge_tol);
                }
                _stitchGetEdgeData(__model__, wire_edge_i, edge_tol,
                    map_edge_i_to_posi_i, map_edge_i_to_bbox, map_posi_i_to_xyz, map_edge_i_to_tol);
            }
        }
    }
    // get the edges and the data for each edge
    const map_edge_i_to_isects: Map<number, [number, number][]> = new Map();
    const map_edge_i_to_edge_i: Map<number, Set<number>> = new Map();
    for (const a_edge_i of edges_i) {
        const a_posis_i: [number, number] = map_edge_i_to_posi_i.get(a_edge_i);
        const a_xyz0: Txyz = map_posi_i_to_xyz.get(a_posis_i[0]);
        const a_xyz1: Txyz = map_posi_i_to_xyz.get(a_posis_i[1]);
        const a_xys: [Txy, Txy] = [[a_xyz0[0], a_xyz0[1]], [a_xyz1[0], a_xyz1[1]]];
        const a_bbox: [Txy, Txy] = map_edge_i_to_bbox.get(a_edge_i);
        const a_norm_tol: [number, number] = map_edge_i_to_tol.get(a_edge_i);
        for (const b_edge_i of edges_i) {
            // if this is same edge, continue
            if (a_edge_i === b_edge_i) { continue; }
            // if we have already done this pair of edges, continue
            if (map_edge_i_to_edge_i.has(a_edge_i)) {
                if (map_edge_i_to_edge_i.get(a_edge_i).has(b_edge_i)) { continue; }
            }
            const b_posis_i: [number, number] = map_edge_i_to_posi_i.get(b_edge_i);
            const b_xyz0: Txyz = map_posi_i_to_xyz.get(b_posis_i[0]);
            const b_xyz1: Txyz = map_posi_i_to_xyz.get(b_posis_i[1]);
            const b_xys: [Txy, Txy] = [[b_xyz0[0], b_xyz0[1]], [b_xyz1[0], b_xyz1[1]]];
            const b_bbox: [Txy, Txy] = map_edge_i_to_bbox.get(b_edge_i);
            const b_norm_tol: [number, number] = map_edge_i_to_tol.get(b_edge_i);
            if (_stitchOverlap(a_bbox, b_bbox)) {
                // isect is [t, u, new_xy] or null
                //
                // TODO decide what to do about t_type and u_type... currently they are not used
                //
                const isect: [[number, number], [number, number], Txy] = _stitchIntersect(a_xys, b_xys, a_norm_tol, b_norm_tol);
                // console.log("=======")
                // console.log("a_xys", a_xys)
                // console.log("b_xys", b_xys)
                // console.log("a_norm_tol", a_norm_tol)
                // console.log("b_norm_tol", b_norm_tol)
                // console.log("isect", isect)
                // , b_xys, a_norm_tol, b_norm_tol, isect);
                if (isect !== null) {
                    const [t, t_type] = isect[0]; // -1 = start, 0 = mid, 1 = end
                    const [u, u_type] = isect[1]; // -1 = start, 0 = mid, 1 = end
                    const new_xy = isect[2];
                    // get or create the new posi
                    let new_posi_i: number = null;
                    // check if we are at the start or end of 'a' edge
                    const a_reuse_sta_posi: boolean = Math.abs(t) < 1e-6;
                    const a_reuse_end_posi: boolean = Math.abs(t - 1) < 1e-6;
                    if (a_reuse_sta_posi) {
                        new_posi_i = a_posis_i[0];
                    } else if (a_reuse_end_posi) {
                        new_posi_i = a_posis_i[1];
                    }
                    // check if we are at the start or end of 'b' edge
                    const b_reuse_sta_posi: boolean = Math.abs(u) < 1e-6;
                    const b_reuse_end_posi: boolean = Math.abs(u - 1) < 1e-6;
                    if (b_reuse_sta_posi) {
                        new_posi_i = b_posis_i[0];
                    } else if (b_reuse_end_posi) {
                        new_posi_i = b_posis_i[1];
                    }
                    // make a new position if we have an isect,
                    if (new_posi_i === null) {
                        new_posi_i = __model__.modeldata.geom.add.addPosi();
                        __model__.modeldata.attribs.posis.setPosiCoords(new_posi_i, [new_xy[0], new_xy[1], 0]);
                    }
                    // store the isects if there are any
                    if (!a_reuse_sta_posi && !a_reuse_end_posi) {
                        if (!map_edge_i_to_isects.has(a_edge_i)) {
                            map_edge_i_to_isects.set(a_edge_i, []);
                        }
                        map_edge_i_to_isects.get(a_edge_i).push([t, new_posi_i]);
                    }
                    if (!b_reuse_sta_posi && !b_reuse_end_posi) {
                        if (!map_edge_i_to_isects.has(b_edge_i)) {
                            map_edge_i_to_isects.set(b_edge_i, []);
                        }
                        map_edge_i_to_isects.get(b_edge_i).push([u, new_posi_i]);
                    }
                    // now remember that we did this pair already, so we don't do it again
                    if (!map_edge_i_to_edge_i.has(b_edge_i)) {
                        map_edge_i_to_edge_i.set(b_edge_i, new Set());
                    }
                    map_edge_i_to_edge_i.get(b_edge_i).add(a_edge_i);
                }
            }
        }
    }
    // const all_new_edges_i: number[] = [];
    const all_new_edges_i: number[] = [];
    for (const edge_i of map_edge_i_to_isects.keys()) {
        // isect [t, posi_i]
        const isects: [number, number][] = map_edge_i_to_isects.get(edge_i);
        isects.sort((a, b) => a[0] - b[0]);
        const new_sta: boolean = isects[0][0] < 0;
        const new_end: boolean = isects[isects.length - 1][0] > 1;
        let isects_mid: [number, number][] = isects;
        if (new_sta) { isects_mid = isects_mid.slice(1); }
        if (new_end) { isects_mid = isects_mid.slice(0, isects_mid.length - 1); }
        if (new_sta) {
            const posi_i: number = isects[0][1];
            const pline_i: number = __model__.modeldata.geom.nav.navAnyToPline(EEntType.EDGE, edge_i)[0];
            const new_sta_edge_i: number = __model__.modeldata.geom.edit_pline.appendVertToOpenPline(pline_i, posi_i, false);
            all_new_edges_i.push(new_sta_edge_i);
        }
        if (new_end) {
            const posi_i: number = isects[isects.length - 1][1];
            const pline_i: number = __model__.modeldata.geom.nav.navAnyToPline(EEntType.EDGE, edge_i)[0];
            const new_end_edge_i: number = __model__.modeldata.geom.edit_pline.appendVertToOpenPline(pline_i, posi_i, true);
            all_new_edges_i.push(new_end_edge_i);
        }
        if (isects_mid.length > 0) {
            const posis_i: number[] = isects_mid.map(isect => isect[1]);
            const new_edges_i: number[] = __model__.modeldata.geom.edit_topo.insertVertsIntoWire(edge_i, posis_i);
            for (const new_edge_i of new_edges_i) {
                all_new_edges_i.push(new_edge_i);
            }
        }
    }
    // check if any new edges are zero length
    const del_posis_i: number[] = [];
    for (const edge_i of all_new_edges_i) {
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        const xyzs: Txyz[] = posis_i.map(posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
        const dist: number = distanceManhattan(xyzs[0], xyzs[1]);
        if (dist < 1e-6) {
            // we are going to del this posi
            const del_posi_i: number = posis_i[0];
            // get the vert of this edge
            const verts_i: number[] = __model__.modeldata.geom.nav.navEdgeToVert(edge_i);
            const del_vert_i: number = verts_i[0];
            // we need to make sure we dont disconnect any edges in the process
            // so we get all the verts connected to this edge
            // for each other edge, we will replace the posi for the vert that would have been deleted
            // the posi will be posis_i[1]
            const replc_verts_i: number[] = __model__.modeldata.geom.nav.navPosiToVert(del_posi_i);
            for (const replc_vert_i of replc_verts_i) {
                if (replc_vert_i === del_vert_i) { continue; }
                __model__.modeldata.geom.edit_topo.replaceVertPosi(replc_vert_i, posis_i[1], false); // false = do nothing if edge becomes invalid
            }
            del_posis_i.push(posis_i[0]);
        }
    }
    // delete the posis from the active snapshot
    __model__.modeldata.geom.snapshot.delPosis(__model__.modeldata.active_ssid, del_posis_i);
    // return
    return idsMake(new_ents_arr) as TId[];
}
function _stitchGetEdgeData(__model__: GIModel, edge_i: number, tol: [number, number],
    map_edge_i_to_posi_i: Map<number, [number, number]>,
    map_edge_i_to_bbox: Map<number, [Txy, Txy]>,
    map_posi_i_to_xyz: Map<number, Txyz>,
    map_edge_i_to_tol: Map<number, [number, number]>): void {
    // get the two posis
    const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
    // save the two posis_i
    map_edge_i_to_posi_i.set(edge_i, [posis_i[0], posis_i[1]]);
    // save the xy value of the two posis
    if (!map_posi_i_to_xyz.has(posis_i[0])) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
        if (xyz[2] !== 0) {
            __model__.modeldata.attribs.posis.setPosiCoords(posis_i[0], [xyz[0], xyz[1], 0]);
        }
        map_posi_i_to_xyz.set(posis_i[0], xyz);
    }
    if (!map_posi_i_to_xyz.has(posis_i[1])) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
        if (xyz[2] !== 0) {
            __model__.modeldata.attribs.posis.setPosiCoords(posis_i[1], [xyz[0], xyz[1], 0]);
        }
        map_posi_i_to_xyz.set(posis_i[1], xyz);
    }
    // calc the normalised tolerance
    const xyz0: Txyz = map_posi_i_to_xyz.get(posis_i[0]);
    const xyz1: Txyz = map_posi_i_to_xyz.get(posis_i[1]);
    const xys: [Txy, Txy] = [[xyz0[0], xyz0[1]], [xyz1[0], xyz1[1]]];
    const norm_tol: [number, number] = _stitchNormaliseTolerance(xys, tol);
    // save the bbox
    let tol_bb = 0;
    if (-tol[0] > tol[1]) {
        tol_bb = -tol[0];
    } else {
        tol_bb = tol[1];
    }
    // this tolerance is a llittle to generous, but it is ok, in some cases no intersection will be found
    const x_min: number = (xys[0][0] < xys[1][0] ? xys[0][0] : xys[1][0]) - tol_bb;
    const y_min: number = (xys[0][1] < xys[1][1] ? xys[0][1] : xys[1][1]) - tol_bb;
    const x_max: number = (xys[0][0] > xys[1][0] ? xys[0][0] : xys[1][0]) + tol_bb;
    const y_max: number = (xys[0][1] > xys[1][1] ? xys[0][1] : xys[1][1]) + tol_bb;
    map_edge_i_to_bbox.set(edge_i, [[x_min, y_min], [x_max, y_max]]);
    // console.log("TOL",tol_bb, [[x_min, y_min], [x_max, y_max]] )
    // save the tolerance
    map_edge_i_to_tol.set(edge_i, norm_tol);
}
function _stitchOverlap(bbox1: [Txy, Txy], bbox2: [Txy, Txy]): boolean {
    if (bbox2[1][0] < bbox1[0][0]) { return false; }
    if (bbox2[0][0] > bbox1[1][0]) { return false; }
    if (bbox2[1][1] < bbox1[0][1]) { return false; }
    if (bbox2[0][1] > bbox1[1][1]) { return false; }
    return true;
}
// function _knifeIntersect(l1: [Txy, Txy], l2: [Txy, Txy]): [number, number, Txy] {
//     // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
//     const x1 = l1[0][0];
//     const y1 = l1[0][1];
//     const x2 = l1[1][0];
//     const y2 = l1[1][1];
//     const x3 = l2[0][0];
//     const y3 = l2[0][1];
//     const x4 = l2[1][0];
//     const y4 = l2[1][1];
//     const denominator  = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));
//     if (denominator === 0) { return null; }
//     const t = (((x1 - x3) * (y3 - y4)) - ((y1 - y3) * (x3 - x4))) / denominator;
//     const u = -(((x1 - x2) * (y1 - y3)) - ((y1 - y2) * (x1 - x3))) / denominator;
//     if ((t >= 0 && t <= 1) && (u >= 0 && u <= 1)) {
//         const new_xy: Txy = [x1 + (t * x2) - (t * x1), y1 + (t * y2) - (t * y1)];
//         return [t, u, new_xy];
//     }
//     return null;
// }
function _stitchNormaliseTolerance(l1: [Txy, Txy], tol: [number, number]): [number, number] {
    if (tol[0] || tol[1]) {
        const new_tol: [number, number] = [0, 0];
        const x1 = l1[0][0];
        const y1 = l1[0][1];
        const x2 = l1[1][0];
        const y2 = l1[1][1];
        const xdist = (x1 - x2), ydist = (y1 - y2);
        const dist = Math.sqrt(xdist * xdist + ydist * ydist);
        // if tol is not zero, then calc a new tol
        if (tol[0]) { new_tol[0] = tol[0] / dist; }
        if (tol[1]) { new_tol[1] = tol[1] / dist; }
        return new_tol;
    }
    return [0, 0];
}
/**
 * Returns [[t, type], [u, type], [x, y]]
 * Return value 'type' is as follows:
 * -1 indicates that the edge is crossed close to the start position of the edge.
 * 0 indicates that the edge is crossed somewhere in the middle.
 * 1 indicates that the edge is crossed close to the end position of the edge.
 * @param a_line [[x,y], [x,y]]
 * @param b_line [[x,y], [x,y]]
 * @param a_tol [norm_start_offset, norm_end_offset]
 * @param b_tol [norm_start_offset, norm_end_offset]
 * @returns [[t, type], [u, type], [x, y]]
 */
function _stitchIntersect(a_line: [Txy, Txy], b_line: [Txy, Txy], a_tol: [number, number],
    b_tol: [number, number]): [[number, number], [number, number], Txy] {
    // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    // line 1, t
    const x1 = a_line[0][0];
    const y1 = a_line[0][1];
    const x2 = a_line[1][0];
    const y2 = a_line[1][1];
    // line 2, u
    const x3 = b_line[0][0];
    const y3 = b_line[0][1];
    const x4 = b_line[1][0];
    const y4 = b_line[1][1];
    const denominator = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));
    if (denominator === 0) { return null; }
    // calc intersection
    const t = (((x1 - x3) * (y3 - y4)) - ((y1 - y3) * (x3 - x4))) / denominator;
    const u = -(((x1 - x2) * (y1 - y3)) - ((y1 - y2) * (x1 - x3))) / denominator;
    if ((t >= a_tol[0] && t <= 1 + a_tol[1]) && (u >= b_tol[0] && u <= 1 + b_tol[1])) {
        const new_xy: Txy = [x1 + (t * x2) - (t * x1), y1 + (t * y2) - (t * y1)];
        let t_type = 0; // crosses at mid
        let u_type = 0; // crosses at mid
        // check if we are at the start or end of 'a' edge
        if (t < -a_tol[0]) {
            t_type = -1; // crosses close to start
        } else if (t > 1 - a_tol[1]) {
            t_type = 1; // crosses close to end
        }
        // check if we are at the start or end of 'b' edge
        if (u < -b_tol[0]) {
            u_type = -1; // crosses close to start
        } else if (u > 1 - b_tol[1]) {
            u_type = 1; // crosses close to end
        }
        return [[t, t_type], [u, u_type], new_xy];
    }
    return null; // no intersection
}

