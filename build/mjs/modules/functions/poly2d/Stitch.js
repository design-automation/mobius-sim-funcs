import { arrMakeFlat, distanceManhattan, EEntType, idsBreak, idsMake, isEmptyArr, } from '@design-automation/mobius-sim';
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
export function Stitch(__model__, entities, tolerance) {
    entities = arrMakeFlat(entities);
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'poly2d.Stitch';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isIDL1, ID.isIDL2], [EEntType.PLINE, EEntType.PGON]);
    }
    else {
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    // copy the list of entities
    const new_ents_arr = __model__.modeldata.funcs_common.copyGeom(ents_arr, true);
    __model__.modeldata.funcs_common.clonePosisInEnts(new_ents_arr, true);
    // create maps for data
    const map_edge_i_to_posi_i = new Map();
    const map_edge_i_to_bbox = new Map();
    const map_posi_i_to_xyz = new Map();
    const map_edge_i_to_tol = new Map();
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
    const edges_i = [];
    // do stitch
    for (const [ent_type, ent_i] of new_ents_arr) {
        const ent_wires_i = __model__.modeldata.geom.nav.navAnyToWire(ent_type, ent_i);
        for (const ent_wire_i of ent_wires_i) {
            const wire_edges_i = __model__.modeldata.geom.nav.navAnyToEdge(EEntType.WIRE, ent_wire_i);
            const is_closed = __model__.modeldata.geom.query.isWireClosed(ent_wire_i);
            for (let i = 0; i < wire_edges_i.length; i++) {
                const wire_edge_i = wire_edges_i[i];
                edges_i.push(wire_edge_i);
                let edge_tol = [0, 0];
                if (!is_closed) {
                    if (wire_edges_i.length === 1) {
                        edge_tol = [-tolerance, tolerance];
                    }
                    else if (i === 0) { // first edge
                        edge_tol = [-tolerance, 0];
                    }
                    else if (i === wire_edges_i.length - 1) { // last edge
                        edge_tol = [0, tolerance];
                    }
                    map_edge_i_to_tol.set(wire_edge_i, edge_tol);
                }
                _stitchGetEdgeData(__model__, wire_edge_i, edge_tol, map_edge_i_to_posi_i, map_edge_i_to_bbox, map_posi_i_to_xyz, map_edge_i_to_tol);
            }
        }
    }
    // get the edges and the data for each edge
    const map_edge_i_to_isects = new Map();
    const map_edge_i_to_edge_i = new Map();
    for (const a_edge_i of edges_i) {
        const a_posis_i = map_edge_i_to_posi_i.get(a_edge_i);
        const a_xyz0 = map_posi_i_to_xyz.get(a_posis_i[0]);
        const a_xyz1 = map_posi_i_to_xyz.get(a_posis_i[1]);
        const a_xys = [[a_xyz0[0], a_xyz0[1]], [a_xyz1[0], a_xyz1[1]]];
        const a_bbox = map_edge_i_to_bbox.get(a_edge_i);
        const a_norm_tol = map_edge_i_to_tol.get(a_edge_i);
        for (const b_edge_i of edges_i) {
            // if this is same edge, continue
            if (a_edge_i === b_edge_i) {
                continue;
            }
            // if we have already done this pair of edges, continue
            if (map_edge_i_to_edge_i.has(a_edge_i)) {
                if (map_edge_i_to_edge_i.get(a_edge_i).has(b_edge_i)) {
                    continue;
                }
            }
            const b_posis_i = map_edge_i_to_posi_i.get(b_edge_i);
            const b_xyz0 = map_posi_i_to_xyz.get(b_posis_i[0]);
            const b_xyz1 = map_posi_i_to_xyz.get(b_posis_i[1]);
            const b_xys = [[b_xyz0[0], b_xyz0[1]], [b_xyz1[0], b_xyz1[1]]];
            const b_bbox = map_edge_i_to_bbox.get(b_edge_i);
            const b_norm_tol = map_edge_i_to_tol.get(b_edge_i);
            if (_stitchOverlap(a_bbox, b_bbox)) {
                // isect is [t, u, new_xy] or null
                //
                // TODO decide what to do about t_type and u_type... currently they are not used
                //
                const isect = _stitchIntersect(a_xys, b_xys, a_norm_tol, b_norm_tol);
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
                    let new_posi_i = null;
                    // check if we are at the start or end of 'a' edge
                    const a_reuse_sta_posi = Math.abs(t) < 1e-6;
                    const a_reuse_end_posi = Math.abs(t - 1) < 1e-6;
                    if (a_reuse_sta_posi) {
                        new_posi_i = a_posis_i[0];
                    }
                    else if (a_reuse_end_posi) {
                        new_posi_i = a_posis_i[1];
                    }
                    // check if we are at the start or end of 'b' edge
                    const b_reuse_sta_posi = Math.abs(u) < 1e-6;
                    const b_reuse_end_posi = Math.abs(u - 1) < 1e-6;
                    if (b_reuse_sta_posi) {
                        new_posi_i = b_posis_i[0];
                    }
                    else if (b_reuse_end_posi) {
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
    const all_new_edges_i = [];
    for (const edge_i of map_edge_i_to_isects.keys()) {
        // isect [t, posi_i]
        const isects = map_edge_i_to_isects.get(edge_i);
        isects.sort((a, b) => a[0] - b[0]);
        const new_sta = isects[0][0] < 0;
        const new_end = isects[isects.length - 1][0] > 1;
        let isects_mid = isects;
        if (new_sta) {
            isects_mid = isects_mid.slice(1);
        }
        if (new_end) {
            isects_mid = isects_mid.slice(0, isects_mid.length - 1);
        }
        if (new_sta) {
            const posi_i = isects[0][1];
            const pline_i = __model__.modeldata.geom.nav.navAnyToPline(EEntType.EDGE, edge_i)[0];
            const new_sta_edge_i = __model__.modeldata.geom.edit_pline.appendVertToOpenPline(pline_i, posi_i, false);
            all_new_edges_i.push(new_sta_edge_i);
        }
        if (new_end) {
            const posi_i = isects[isects.length - 1][1];
            const pline_i = __model__.modeldata.geom.nav.navAnyToPline(EEntType.EDGE, edge_i)[0];
            const new_end_edge_i = __model__.modeldata.geom.edit_pline.appendVertToOpenPline(pline_i, posi_i, true);
            all_new_edges_i.push(new_end_edge_i);
        }
        if (isects_mid.length > 0) {
            const posis_i = isects_mid.map(isect => isect[1]);
            const new_edges_i = __model__.modeldata.geom.edit_topo.insertVertsIntoWire(edge_i, posis_i);
            for (const new_edge_i of new_edges_i) {
                all_new_edges_i.push(new_edge_i);
            }
        }
    }
    // check if any new edges are zero length
    const del_posis_i = [];
    for (const edge_i of all_new_edges_i) {
        const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        const xyzs = posis_i.map(posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
        const dist = distanceManhattan(xyzs[0], xyzs[1]);
        if (dist < 1e-6) {
            // we are going to del this posi
            const del_posi_i = posis_i[0];
            // get the vert of this edge
            const verts_i = __model__.modeldata.geom.nav.navEdgeToVert(edge_i);
            const del_vert_i = verts_i[0];
            // we need to make sure we dont disconnect any edges in the process
            // so we get all the verts connected to this edge
            // for each other edge, we will replace the posi for the vert that would have been deleted
            // the posi will be posis_i[1]
            const replc_verts_i = __model__.modeldata.geom.nav.navPosiToVert(del_posi_i);
            for (const replc_vert_i of replc_verts_i) {
                if (replc_vert_i === del_vert_i) {
                    continue;
                }
                __model__.modeldata.geom.edit_topo.replaceVertPosi(replc_vert_i, posis_i[1], false); // false = do nothing if edge becomes invalid
            }
            del_posis_i.push(posis_i[0]);
        }
    }
    // delete the posis from the active snapshot
    __model__.modeldata.geom.snapshot.delPosis(__model__.modeldata.active_ssid, del_posis_i);
    // return
    return idsMake(new_ents_arr);
}
function _stitchGetEdgeData(__model__, edge_i, tol, map_edge_i_to_posi_i, map_edge_i_to_bbox, map_posi_i_to_xyz, map_edge_i_to_tol) {
    // get the two posis
    const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
    // save the two posis_i
    map_edge_i_to_posi_i.set(edge_i, [posis_i[0], posis_i[1]]);
    // save the xy value of the two posis
    if (!map_posi_i_to_xyz.has(posis_i[0])) {
        const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
        if (xyz[2] !== 0) {
            __model__.modeldata.attribs.posis.setPosiCoords(posis_i[0], [xyz[0], xyz[1], 0]);
        }
        map_posi_i_to_xyz.set(posis_i[0], xyz);
    }
    if (!map_posi_i_to_xyz.has(posis_i[1])) {
        const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
        if (xyz[2] !== 0) {
            __model__.modeldata.attribs.posis.setPosiCoords(posis_i[1], [xyz[0], xyz[1], 0]);
        }
        map_posi_i_to_xyz.set(posis_i[1], xyz);
    }
    // calc the normalised tolerance
    const xyz0 = map_posi_i_to_xyz.get(posis_i[0]);
    const xyz1 = map_posi_i_to_xyz.get(posis_i[1]);
    const xys = [[xyz0[0], xyz0[1]], [xyz1[0], xyz1[1]]];
    const norm_tol = _stitchNormaliseTolerance(xys, tol);
    // save the bbox
    let tol_bb = 0;
    if (-tol[0] > tol[1]) {
        tol_bb = -tol[0];
    }
    else {
        tol_bb = tol[1];
    }
    // this tolerance is a llittle to generous, but it is ok, in some cases no intersection will be found
    const x_min = (xys[0][0] < xys[1][0] ? xys[0][0] : xys[1][0]) - tol_bb;
    const y_min = (xys[0][1] < xys[1][1] ? xys[0][1] : xys[1][1]) - tol_bb;
    const x_max = (xys[0][0] > xys[1][0] ? xys[0][0] : xys[1][0]) + tol_bb;
    const y_max = (xys[0][1] > xys[1][1] ? xys[0][1] : xys[1][1]) + tol_bb;
    map_edge_i_to_bbox.set(edge_i, [[x_min, y_min], [x_max, y_max]]);
    // console.log("TOL",tol_bb, [[x_min, y_min], [x_max, y_max]] )
    // save the tolerance
    map_edge_i_to_tol.set(edge_i, norm_tol);
}
function _stitchOverlap(bbox1, bbox2) {
    if (bbox2[1][0] < bbox1[0][0]) {
        return false;
    }
    if (bbox2[0][0] > bbox1[1][0]) {
        return false;
    }
    if (bbox2[1][1] < bbox1[0][1]) {
        return false;
    }
    if (bbox2[0][1] > bbox1[1][1]) {
        return false;
    }
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
function _stitchNormaliseTolerance(l1, tol) {
    if (tol[0] || tol[1]) {
        const new_tol = [0, 0];
        const x1 = l1[0][0];
        const y1 = l1[0][1];
        const x2 = l1[1][0];
        const y2 = l1[1][1];
        const xdist = (x1 - x2), ydist = (y1 - y2);
        const dist = Math.sqrt(xdist * xdist + ydist * ydist);
        // if tol is not zero, then calc a new tol
        if (tol[0]) {
            new_tol[0] = tol[0] / dist;
        }
        if (tol[1]) {
            new_tol[1] = tol[1] / dist;
        }
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
function _stitchIntersect(a_line, b_line, a_tol, b_tol) {
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
    if (denominator === 0) {
        return null;
    }
    // calc intersection
    const t = (((x1 - x3) * (y3 - y4)) - ((y1 - y3) * (x3 - x4))) / denominator;
    const u = -(((x1 - x2) * (y1 - y3)) - ((y1 - y2) * (x1 - x3))) / denominator;
    if ((t >= a_tol[0] && t <= 1 + a_tol[1]) && (u >= b_tol[0] && u <= 1 + b_tol[1])) {
        const new_xy = [x1 + (t * x2) - (t * x1), y1 + (t * y2) - (t * y1)];
        let t_type = 0; // crosses at mid
        let u_type = 0; // crosses at mid
        // check if we are at the start or end of 'a' edge
        if (t < -a_tol[0]) {
            t_type = -1; // crosses close to start
        }
        else if (t > 1 - a_tol[1]) {
            t_type = 1; // crosses close to end
        }
        // check if we are at the start or end of 'b' edge
        if (u < -b_tol[0]) {
            u_type = -1; // crosses close to start
        }
        else if (u > 1 - b_tol[1]) {
            u_type = 1; // crosses close to end
        }
        return [[t, t_type], [u, u_type], new_xy];
    }
    return null; // no intersection
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RpdGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL3BvbHkyZC9TdGl0Y2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFdBQVcsRUFDWCxpQkFBaUIsRUFDakIsUUFBUSxFQUVSLFFBQVEsRUFDUixPQUFPLEVBQ1AsVUFBVSxHQUtiLE1BQU0sK0JBQStCLENBQUM7QUFFdkMsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUduRCxnQkFBZ0I7QUFDaEIsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBTSxVQUFVLE1BQU0sQ0FBQyxTQUFrQixFQUFFLFFBQXFCLEVBQUUsU0FBaUI7SUFDL0UsUUFBUSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQVUsQ0FBQztJQUMxQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUN0QixPQUFPLEVBQUUsQ0FBQztLQUNiO0lBQ0Qsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQztJQUNoQyxJQUFJLFFBQXVCLENBQUM7SUFDNUIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLFFBQVEsR0FBRyxRQUFRLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUN4RCxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQWtCLENBQUM7S0FDakY7U0FBTTtRQUNILFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFrQixDQUFDO0tBQ2xEO0lBQ0Qsc0JBQXNCO0lBQ3RCLDRCQUE0QjtJQUM1QixNQUFNLFlBQVksR0FBa0IsU0FBUyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQWtCLENBQUM7SUFDL0csU0FBUyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RFLHVCQUF1QjtJQUN2QixNQUFNLG9CQUFvQixHQUFrQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ3RFLE1BQU0sa0JBQWtCLEdBQTRCLElBQUksR0FBRyxFQUFFLENBQUM7SUFDOUQsTUFBTSxpQkFBaUIsR0FBc0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN2RCxNQUFNLGlCQUFpQixHQUFrQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ25FLGdCQUFnQjtJQUNoQix1Q0FBdUM7SUFDdkMsZ0NBQWdDO0lBQ2hDLCtHQUErRztJQUMvRyxpREFBaUQ7SUFDakQsd0dBQXdHO0lBQ3hHLDBDQUEwQztJQUMxQyxnQ0FBZ0M7SUFDaEMsNkdBQTZHO0lBQzdHLFFBQVE7SUFDUixJQUFJO0lBQ0osa0NBQWtDO0lBQ2xDLE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztJQUM3QixZQUFZO0lBQ1osS0FBSyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxJQUFJLFlBQVksRUFBRTtRQUMxQyxNQUFNLFdBQVcsR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6RixLQUFLLE1BQU0sVUFBVSxJQUFJLFdBQVcsRUFBRTtZQUNsQyxNQUFNLFlBQVksR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDcEcsTUFBTSxTQUFTLEdBQVksU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNuRixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUMsTUFBTSxXQUFXLEdBQVcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUMxQixJQUFJLFFBQVEsR0FBcUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ1osSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTt3QkFDM0IsUUFBUSxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7cUJBQ3RDO3lCQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLGFBQWE7d0JBQy9CLFFBQVEsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUM5Qjt5QkFBTSxJQUFJLENBQUMsS0FBSyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxFQUFFLFlBQVk7d0JBQ3BELFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztxQkFDN0I7b0JBQ0QsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDaEQ7Z0JBQ0Qsa0JBQWtCLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQy9DLG9CQUFvQixFQUFFLGtCQUFrQixFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLENBQUM7YUFDdkY7U0FDSjtLQUNKO0lBQ0QsMkNBQTJDO0lBQzNDLE1BQU0sb0JBQW9CLEdBQW9DLElBQUksR0FBRyxFQUFFLENBQUM7SUFDeEUsTUFBTSxvQkFBb0IsR0FBNkIsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNqRSxLQUFLLE1BQU0sUUFBUSxJQUFJLE9BQU8sRUFBRTtRQUM1QixNQUFNLFNBQVMsR0FBcUIsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sTUFBTSxHQUFTLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RCxNQUFNLE1BQU0sR0FBUyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQsTUFBTSxLQUFLLEdBQWUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNFLE1BQU0sTUFBTSxHQUFlLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1RCxNQUFNLFVBQVUsR0FBcUIsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JFLEtBQUssTUFBTSxRQUFRLElBQUksT0FBTyxFQUFFO1lBQzVCLGlDQUFpQztZQUNqQyxJQUFJLFFBQVEsS0FBSyxRQUFRLEVBQUU7Z0JBQUUsU0FBUzthQUFFO1lBQ3hDLHVEQUF1RDtZQUN2RCxJQUFJLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDcEMsSUFBSSxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUFFLFNBQVM7aUJBQUU7YUFDdEU7WUFDRCxNQUFNLFNBQVMsR0FBcUIsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0sTUFBTSxHQUFTLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RCxNQUFNLE1BQU0sR0FBUyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekQsTUFBTSxLQUFLLEdBQWUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNFLE1BQU0sTUFBTSxHQUFlLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM1RCxNQUFNLFVBQVUsR0FBcUIsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JFLElBQUksY0FBYyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDaEMsa0NBQWtDO2dCQUNsQyxFQUFFO2dCQUNGLGdGQUFnRjtnQkFDaEYsRUFBRTtnQkFDRixNQUFNLEtBQUssR0FBOEMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ2hILHlCQUF5QjtnQkFDekIsOEJBQThCO2dCQUM5Qiw4QkFBOEI7Z0JBQzlCLHdDQUF3QztnQkFDeEMsd0NBQXdDO2dCQUN4Qyw4QkFBOEI7Z0JBQzlCLDJDQUEyQztnQkFDM0MsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO29CQUNoQixNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLCtCQUErQjtvQkFDN0QsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQywrQkFBK0I7b0JBQzdELE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEIsNkJBQTZCO29CQUM3QixJQUFJLFVBQVUsR0FBVyxJQUFJLENBQUM7b0JBQzlCLGtEQUFrRDtvQkFDbEQsTUFBTSxnQkFBZ0IsR0FBWSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDckQsTUFBTSxnQkFBZ0IsR0FBWSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQ3pELElBQUksZ0JBQWdCLEVBQUU7d0JBQ2xCLFVBQVUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzdCO3lCQUFNLElBQUksZ0JBQWdCLEVBQUU7d0JBQ3pCLFVBQVUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzdCO29CQUNELGtEQUFrRDtvQkFDbEQsTUFBTSxnQkFBZ0IsR0FBWSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDckQsTUFBTSxnQkFBZ0IsR0FBWSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQ3pELElBQUksZ0JBQWdCLEVBQUU7d0JBQ2xCLFVBQVUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzdCO3lCQUFNLElBQUksZ0JBQWdCLEVBQUU7d0JBQ3pCLFVBQVUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzdCO29CQUNELDJDQUEyQztvQkFDM0MsSUFBSSxVQUFVLEtBQUssSUFBSSxFQUFFO3dCQUNyQixVQUFVLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUNwRCxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDMUY7b0JBQ0Qsb0NBQW9DO29CQUNwQyxJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTt3QkFDeEMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTs0QkFDckMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQzt5QkFDMUM7d0JBQ0Qsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO3FCQUM1RDtvQkFDRCxJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTt3QkFDeEMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTs0QkFDckMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQzt5QkFDMUM7d0JBQ0Qsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO3FCQUM1RDtvQkFDRCxzRUFBc0U7b0JBQ3RFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7d0JBQ3JDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO3FCQUNqRDtvQkFDRCxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUNwRDthQUNKO1NBQ0o7S0FDSjtJQUNELHdDQUF3QztJQUN4QyxNQUFNLGVBQWUsR0FBYSxFQUFFLENBQUM7SUFDckMsS0FBSyxNQUFNLE1BQU0sSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUM5QyxvQkFBb0I7UUFDcEIsTUFBTSxNQUFNLEdBQXVCLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sT0FBTyxHQUFZLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUMsTUFBTSxPQUFPLEdBQVksTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFELElBQUksVUFBVSxHQUF1QixNQUFNLENBQUM7UUFDNUMsSUFBSSxPQUFPLEVBQUU7WUFBRSxVQUFVLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUFFO1FBQ2xELElBQUksT0FBTyxFQUFFO1lBQUUsVUFBVSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FBRTtRQUN6RSxJQUFJLE9BQU8sRUFBRTtZQUNULE1BQU0sTUFBTSxHQUFXLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLE9BQU8sR0FBVyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0YsTUFBTSxjQUFjLEdBQVcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDakgsZUFBZSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUN4QztRQUNELElBQUksT0FBTyxFQUFFO1lBQ1QsTUFBTSxNQUFNLEdBQVcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsTUFBTSxPQUFPLEdBQVcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdGLE1BQU0sY0FBYyxHQUFXLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hILGVBQWUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDeEM7UUFDRCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZCLE1BQU0sT0FBTyxHQUFhLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RCxNQUFNLFdBQVcsR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3RHLEtBQUssTUFBTSxVQUFVLElBQUksV0FBVyxFQUFFO2dCQUNsQyxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ3BDO1NBQ0o7S0FDSjtJQUNELHlDQUF5QztJQUN6QyxNQUFNLFdBQVcsR0FBYSxFQUFFLENBQUM7SUFDakMsS0FBSyxNQUFNLE1BQU0sSUFBSSxlQUFlLEVBQUU7UUFDbEMsTUFBTSxPQUFPLEdBQWEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNGLE1BQU0sSUFBSSxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDcEcsTUFBTSxJQUFJLEdBQVcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pELElBQUksSUFBSSxHQUFHLElBQUksRUFBRTtZQUNiLGdDQUFnQztZQUNoQyxNQUFNLFVBQVUsR0FBVyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEMsNEJBQTRCO1lBQzVCLE1BQU0sT0FBTyxHQUFhLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0UsTUFBTSxVQUFVLEdBQVcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLG1FQUFtRTtZQUNuRSxpREFBaUQ7WUFDakQsMEZBQTBGO1lBQzFGLDhCQUE4QjtZQUM5QixNQUFNLGFBQWEsR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3ZGLEtBQUssTUFBTSxZQUFZLElBQUksYUFBYSxFQUFFO2dCQUN0QyxJQUFJLFlBQVksS0FBSyxVQUFVLEVBQUU7b0JBQUUsU0FBUztpQkFBRTtnQkFDOUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsNkNBQTZDO2FBQ3JJO1lBQ0QsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQztLQUNKO0lBQ0QsNENBQTRDO0lBQzVDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDekYsU0FBUztJQUNULE9BQU8sT0FBTyxDQUFDLFlBQVksQ0FBVSxDQUFDO0FBQzFDLENBQUM7QUFDRCxTQUFTLGtCQUFrQixDQUFDLFNBQWtCLEVBQUUsTUFBYyxFQUFFLEdBQXFCLEVBQ2pGLG9CQUFtRCxFQUNuRCxrQkFBMkMsRUFDM0MsaUJBQW9DLEVBQ3BDLGlCQUFnRDtJQUNoRCxvQkFBb0I7SUFDcEIsTUFBTSxPQUFPLEdBQWEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNGLHVCQUF1QjtJQUN2QixvQkFBb0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0QscUNBQXFDO0lBQ3JDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDcEMsTUFBTSxHQUFHLEdBQVMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDZCxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwRjtRQUNELGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDMUM7SUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3BDLE1BQU0sR0FBRyxHQUFTLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2QsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEY7UUFDRCxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQzFDO0lBQ0QsZ0NBQWdDO0lBQ2hDLE1BQU0sSUFBSSxHQUFTLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRCxNQUFNLElBQUksR0FBUyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckQsTUFBTSxHQUFHLEdBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLE1BQU0sUUFBUSxHQUFxQix5QkFBeUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdkUsZ0JBQWdCO0lBQ2hCLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2xCLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNwQjtTQUFNO1FBQ0gsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuQjtJQUNELHFHQUFxRztJQUNyRyxNQUFNLEtBQUssR0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQy9FLE1BQU0sS0FBSyxHQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDL0UsTUFBTSxLQUFLLEdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUMvRSxNQUFNLEtBQUssR0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQy9FLGtCQUFr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