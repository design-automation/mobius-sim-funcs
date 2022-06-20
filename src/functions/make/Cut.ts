import { Sim, ENT_TYPE } from 'src/mobius_sim';
import { vecCross } from '../_common/calcVectors';
import { TPlane, Txyz } from '../_common/consts';
import { arrMakeFlat, isEmptyArr } from '../_common/_arrs';
import { distance } from '../_common/calcDistance';
import { _ECutMethod } from './_enum';
import THREE from 'three';
const EPS = 1e-6;
// ================================================================================================
/**
 * Cuts polygons and polylines using a plane.
 * \n
 * - If the 'keep\_above' method is selected, then only the part of the cut entities above the plane are kept.
 * - If the 'keep\_below' method is selected, then only the part of the cut entities below the plane are kept.
 * - If the 'keep\_both' method is selected, then both the parts of the cut entities are kept.
 * \n
 * Currently does not support cutting polygons with holes. 
 * \n
 * If 'keep\_both' is selected, returns a list of two lists.
 * `[[entities above the plane], [entities below the plane]]`.
 *
 * @param __model__
 * @param entities Polylines or polygons, or entities from which polyline or polygons can be extracted.
 * @param plane The plane to cut with.
 * @param method Enum, the method for cutting: `'keep_above', 'keep_below'` or `'keep_both'`.
 * @returns Entities, a list of three lists of entities resulting from the cut.

 */
export function Cut(__model__: Sim, entities: string|string[], plane: TPlane, 
        method: _ECutMethod): string[]|[string[], string[]] {
    // entities = arrMakeFlat(entities) as TId[];
    // if (isEmptyArr(entities)) {
    //     if (method === _ECutMethod.KEEP_BOTH) { return [[], []]; }
    //     return [];
    // }
    // // --- Error Check ---
    // const fn_name = 'make.Cut';
    // let ents_arr: TEntTypeIdx[];
    // if (__model__.debug) {
    //     ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
    //         [ID.isID, ID.isIDL1], null) as TEntTypeIdx[];
    //     chk.checkArgs(fn_name, 'plane', plane, [chk.isPln]);
    // } else {
    //     ents_arr = idsBreak(entities) as TEntTypeIdx[];
    // }
    // // --- Error Check ---
    // const [above, below]: [TEntTypeIdx[], TEntTypeIdx[]] = __model__.modeldata.funcs_make.cut(ents_arr, plane, method);
    // // return the result
    // switch (method) {
    //     case _ECutMethod.KEEP_ABOVE:
    //         return idsMake(above) as TId[];
    //     case _ECutMethod.KEEP_BELOW:
    //         return idsMake(below) as TId[];
    //     default:
    //         return [idsMake(above), idsMake(below)] as [TId[], TId[]];
    // }    
    // =============================================================================================
    entities = arrMakeFlat(entities) as string[];
    if (isEmptyArr(entities)) {
        if (method === _ECutMethod.KEEP_BOTH) { return [[], []]; }
        return [];
    }
    const [above, below]: [string[], string[]] = _cut(__model__, entities, plane, method);
    // return the result
    switch (method) {
        case _ECutMethod.KEEP_ABOVE:
            return above as string[];
        case _ECutMethod.KEEP_BELOW:
            return below as string[];
        default:
            return [above, below] as [string[], string[]];
    }
}
// =================================================================================================
/**
 *
 * @param ents
 * @param plane
 * @param method
 */
function _cut(__model__: Sim, ents: string[], plane: TPlane, 
        method: _ECutMethod): [string[], string[]] {
    // create the threejs entity and calc intersections
    const plane_normal: Txyz = vecCross(plane[1], plane[2]);
    const plane_tjs: THREE.Plane = new THREE.Plane();
    plane_tjs.setFromNormalAndCoplanarPoint( 
        new THREE.Vector3(...plane_normal), new THREE.Vector3(...plane[0]) );
    // get polylines and polygons
    const set_plines: Set<string> = new Set();
    const set_pgons: Set<string> = new Set();
    const edges: string[] = []; // all edges
    for (const ent of ents) {
        const ent_type: ENT_TYPE = __model__.entType(ent);
        if (ent_type === ENT_TYPE.PLINE) {
            set_plines.add(ent);
        } else if (ent_type === ENT_TYPE.PGON) {
            set_pgons.add(ent);
        } else {
            __model__.getEnts(ENT_TYPE.PLINE, ent).forEach( pline => set_plines.add(pline) );
            __model__.getEnts(ENT_TYPE.PGON, ent).forEach( pgon => set_pgons.add(pgon) );
        }
        __model__.getEnts(ENT_TYPE.EDGE, ent).forEach( edge => edges.push(edge) );
    }
    // create lists to store ents above and below the cut plane
    const above: string[] = [];
    const below: string[] = [];
    // cut each edge and store the results
    const [edge_to_isect_posis, cut_posi_to_copies, posi_to_tjs]: 
        [Map<string, Map<string, string>>, Map<string, string>,Map<string, [THREE.Vector3, number]>] 
        = _cutEdges(__model__, edges, plane_tjs, method);
    // create array to store new posis
    const posi_to_copies: Map<string, string> = new Map();
    // slice polylines
    for (const exist_pline of Array.from(set_plines)) {
        const sliced: [string[], string[]] = _cutCreateEnts(__model__, ENT_TYPE.PLINE, exist_pline, 
            edge_to_isect_posis,
            posi_to_copies, 
            cut_posi_to_copies, 
            posi_to_tjs, 
            method // _ECutMethod
        );
        for (const new_pline of sliced[0]) { above.push( new_pline ); }
        for (const new_pline of sliced[1]) { below.push( new_pline ); }
    }
    // slice polygons
    for (const exist_pgon of Array.from(set_pgons)) {
        // TODO slice polygons with holes
        const exist_wire: string = __model__.getEnts(ENT_TYPE.WIRE, exist_pgon)[0];
        const sliced: [string[], string[]] = _cutCreateEnts(__model__, ENT_TYPE.PGON, exist_wire, 
            edge_to_isect_posis,
            posi_to_copies, 
            cut_posi_to_copies, 
            posi_to_tjs, 
            method // _ECutMethod
        ); 
        for (const new_pgon of sliced[0]) { above.push( new_pgon ); }
        for (const new_pgon of sliced[1]) { below.push( new_pgon ); }
    }
    // return
    return [above, below];
}
// =================================================================================================
// cut each edge in the input geometry (can be edges from different objects) store the intersection
// posi in a sparse array the array is nested, the two indexes [i1][i2] is the two posi ends of the
// edge, the value is the isect posi also returns some other data if method is "both", then we need
// copies of the isect posis, so these are also generated finally, the tjs points that are created
// are also returned, they are used later for checking "starts_above"
function _cutEdges(__model__: Sim, edges: string[], plane_tjs: THREE.Plane, method: _ECutMethod):
    [
        Map<string, Map<string, string>>, // map_posis[2][3] is the edge from posi 2 to posi 3 (and 3 to 2)
        Map<string, string>, // cut_posi -> copy_cut_posi
        Map<string, [THREE.Vector3, number]> // posi -> [tjs_vec, dist]
    ] {
    // create sparse arrays for storing data
    const edge_to_isect_posis: Map<string, Map<string, string>> = new Map(); 
    const cut_posi_to_copies: Map<string, string> = new Map(); 
    const posi_to_tjs: Map<string, [THREE.Vector3, number]> = new Map(); 
    // loop through each edge
    for (const edge of edges) {
        // console.log("=============== Edge = ", edge_i);
        const edge_posis: string[] = __model__.getEnts(ENT_TYPE.POSI, edge);
        if (edge_posis.length !== 2) { continue; }
        const sorted_edge_posis: string[] = Array.from(edge_posis);
        sorted_edge_posis.sort();
        // get the edge isect point
        if (!edge_to_isect_posis.has(sorted_edge_posis[0])) { 
            edge_to_isect_posis.set(sorted_edge_posis[0], new Map());
        }
        const posi: string = edge_to_isect_posis.get(sorted_edge_posis[0]).get(sorted_edge_posis[1]);
        if (posi === undefined) {
            // cut the intersection, create a new posi or null
            const new_posi: string = _cutCreatePosi(__model__, edge, edge_posis, plane_tjs, posi_to_tjs);
            // store the posi or null in the sparse array
            edge_to_isect_posis.get(sorted_edge_posis[0]).set(sorted_edge_posis[1], new_posi);
            if (new_posi !== null) {
                // if keep both sides, make a copy of the posi
                if (method === _ECutMethod.KEEP_BOTH) {
                    const copy_posi: string = __model__.copyEnts([new_posi])[0];
                    cut_posi_to_copies.set(new_posi, copy_posi);
                }
            }
        }
    }
    return [edge_to_isect_posis, cut_posi_to_copies, posi_to_tjs];
}
// =================================================================================================
// create the new posi
// return either null, if edge is not cut, or the new posi
function _cutCreatePosi(__model__: Sim, edge: string, edge_posis: string[], plane_tjs: THREE.Plane,
        posi_to_tjs: Map<string, [THREE.Vector3, number]>
    ): string {
    // get the tjs posis and distances for the start and end posis of this edge
    // start posi
    const [posi0_tjs, d0]: [THREE.Vector3, number] =
        _cutGetTjsDistToPlane(__model__, edge_posis[0], plane_tjs, posi_to_tjs);
    // end posi
    const [posi1_tjs, d1]: [THREE.Vector3, number] =
        _cutGetTjsDistToPlane(__model__, edge_posis[1], plane_tjs, posi_to_tjs);
    // console.log("Cutting edge: edge_i, d0, d1", edge_i, d0, d1)
    // if both posis are on the same side of the plane, then no intersection, so return null
    if ((d0 > 0) && (d1 > 0)) {
        // console.log('Cutting edge: edge vertices are above the plane, so no isect')
        return null;
    }
    if ((d0 < 0) && (d1 < 0)) {
        // console.log('Cutting edge: edge vertices are both below the plane, so no isect')
        return null;
    }
    // check if this is a zero length edge
    // console.log("length of edge = ", posi0_tjs.distanceTo(posi1_tjs))
    if (posi0_tjs.distanceTo(posi1_tjs) === 0) {
        // console.log('Cutting edge: edge is zero length, so no isect')
        return null;
    }
    // if either position is very close to the plane, check of V intersection
    // a V intersection is where the plane touches a vertex where two edges meet in a V shape
    // and where both edges are on the same side of the plane
    if ((Math.abs(d0) === 0) && _cutStartVertexIsV(__model__, edge, plane_tjs, d1, posi_to_tjs)) {
        // console.log('Cutting edge: first vertex is V, so no isect');
        return null;
    }
    if ((Math.abs(d1) === 0) && _cutEndVertexIsV(__model__, edge, plane_tjs, d0, posi_to_tjs)) {
        // console.log('Cutting edge: second vertex is V, so no isect');
        return null;
    }
    // check if cutting exactly through the end vertext
    // in that case, the intersection is the end vertex
    // this is true even is teh edge is coplanar
    if (d1 === 0) {
        // console.log('Cutting edge: second vertex is on plane, so return second posi')
        return __model__.addPosi([posi1_tjs.x, posi1_tjs.y, posi1_tjs.z]);
    }
    // check if cutting exactly through the start vertext
    // in that case we ignore it since we assume the cut has already been created by the end vertext of the previous edge
    // this also include the case where the edge is coplanar
    if (d0 === 0) {
        // console.log('Cutting edge: first vertex is on plane, so no isect')
        return null;
    }
    // calculate intersection
    const line_tjs: THREE.Line3 = new THREE.Line3(posi0_tjs, posi1_tjs);
    const isect_tjs: THREE.Vector3 = new THREE.Vector3();
    // https://threejs.org/docs/#api/en/math/Plane
    // Returns the intersection point of the passed line and the plane.
    // Returns undefined if the line does not intersect.
    // Returns the line's starting point if the line is coplanar with the plane.
    const result: THREE.Vector3 = plane_tjs.intersectLine(line_tjs, isect_tjs);
    if (result === undefined || result === null) {
        // console.log('Cutting edge: no isect was found with edge...');
        return null;
    }
    // create the new posi at the point of intersection
    // console.log("Cutting edge: New isect_tjs", isect_tjs)
    return __model__.addPosi([isect_tjs.x, isect_tjs.y, isect_tjs.z]);
}
// =================================================================================================
// check V at start vertex
function _cutStartVertexIsV(__model__: Sim, edge: string, plane_tjs: THREE.Plane, d1: number, 
        posi_to_tjs: Map<string, [THREE.Vector3, number]>
    ): boolean {
    // ---
    // isect is at start of line
    const prev_edge: string = __model__.getPrevEdge(edge);
    // if there is no prev edge, then this is open pline, so it is single edge V
    if (prev_edge === null) { return true; }
    // check other edge
    const prev_edge_posis: string[] = __model__.getEnts(ENT_TYPE.POSI, prev_edge);
    const [_, prev_d]: [THREE.Vector3, number] =
        _cutGetTjsDistToPlane(__model__, prev_edge_posis[0], plane_tjs, posi_to_tjs);
    // are both points on same side of plane? must be V
    if ((prev_d > 0) && (d1 > 0)) {
        return true;
    }
    if ((prev_d < 0) && (d1 < 0)) {
        return true;
    }
    // this is not a V, so return false
    return false;
}
// =================================================================================================
// check V at end vertex
function _cutEndVertexIsV(__model__: Sim, edge: string, plane_tjs: THREE.Plane, d0: number, 
        posi_to_tjs: Map<string, [THREE.Vector3, number]>
    ): boolean {
    // ---
    // isect is at end of line
    const next_edge: string = __model__.getNextEdge(edge);
    // if there is no next edge, then this is open pline, so it is single edge V
    if (next_edge === null) { return true; }
    // check other edge
    const next_edge_posis: string[] = __model__.getEnts(ENT_TYPE.POSI, next_edge);
    const [_, next_d]: [THREE.Vector3, number] =
        _cutGetTjsDistToPlane(__model__, next_edge_posis[1], plane_tjs, posi_to_tjs);
    // are both points on same side of plane? must be V
    if ((d0 > 0) && (next_d > 0)) {
        return true;
    }
    if ((d0 < 0) && (next_d < 0)) {
        return true;
    }
    // this is not a V, so return false
    return false;
}
// =================================================================================================
// given an exist posis and a tjs plane
// create a tjs posi and
// calc the distance to the tjs plane
// creates a map from exist posi to tjs posi
// and creates a map from exist posi to dist
function _cutGetTjsDistToPlane(__model__: Sim, posi: string, plane_tjs: THREE.Plane,
        posi_to_tjs: Map<string, [THREE.Vector3, number]>
    ): [THREE.Vector3, number] {
    // check if we have already calculated this one
    if (posi_to_tjs.has(posi)) {
        return posi_to_tjs.get(posi);
    }
    // create tjs posi
    const xyz: Txyz = __model__.getPosiCoords(posi);
    const posi_tjs: THREE.Vector3 = new THREE.Vector3(...xyz);
    // calc distance to tjs plane
    const dist: number = plane_tjs.distanceToPoint(posi_tjs);
    // save the data
    posi_to_tjs.set(posi, [posi_tjs, dist]);
    // return the new tjs posi and the distance to the plane
    return [posi_tjs, dist];
}
// =================================================================================================
// given an exist posi, returns a new posi
// if necessary, a new posi will be created
// populates the map from exist posi to new posi (sparse array)
function _cutGetPosi(__model__: Sim, posi: string, 
        posi_to_copies: Map<string, string>
    ): string {
    if (posi_to_copies.has(posi)) { 
        return posi_to_copies.get(posi);
    }
    const new_posi: string = __model__.copyEnts([posi])[0];
    posi_to_copies.set(posi, new_posi);
    return new_posi;
}
// =================================================================================================
// given a list of exist posis, returns a list of new posi
// if necessary, new posi will be created
function _cutGetPosis(__model__: Sim, posis: string[], 
        posi_to_copies: Map<string, string>
    ): string[] {
    return posis.map(posi => _cutGetPosi(__model__, posi, posi_to_copies));
}
// =================================================================================================
// makes a copy of an existing ent
// all posis in the exist ent will be replaced by new posis
function _cutCopyEnt(__model__: Sim, ent: string, exist_posis: string[], 
        posi_to_copies: Map<string, string>
    ): string {
    const new_posis: string[] = _cutGetPosis(__model__, exist_posis, posi_to_copies);
    const new_ent: string = __model__.copyEnts([ent])[0];

    // --------------------
    // TODO can we copy all ents above/below in one go without doing replace
    //  __model__.replacePosis(new_ent, new_posis);
    // --------------------



    return new_ent;
}
// =================================================================================================
// creates new ents
// the ent is either a pline or a wire
// if the ent is not cut by the plane, the ent will be copies (with new posis)
// if the ent is cut, a new ent will be created
function _cutCreateEnts(__model__: Sim, ent_type: ENT_TYPE, ent: string,
        edge_to_isect_posis: Map<string, Map<string, string>>, // posi0 -> posi1 -> posi_isect
        posi_to_copies: Map<string, string>, // exist_posi -> new_posi
        cut_posi_to_copies: Map<string, string>, // cut_posi -> new_cut_posi
        posi_to_tjs: Map<string, [THREE.Vector3, number]>, // posi -> [tjs_vec, dist]
        method: _ECutMethod
    ): [string[], string[]] {
    // get wire and posis
    const seq_posis: string[] = __model__.getEnts(ENT_TYPE.POSI, ent);
    const seq_posis_ex: string[] = seq_posis.slice();
    const is_closed: boolean = ent_type == ENT_TYPE.PGON ||  __model__.isPlineClosed(ent);
    if (is_closed) {
        seq_posis_ex.push(seq_posis_ex[0]);
    }
    const num_posis: number = seq_posis_ex.length;
    // create lists to store posis
    const slice_posis: string[][][] = [[], []];
    // analyze the first point
    const dist: number = posi_to_tjs.get(seq_posis_ex[0])[1];
    const start_above = dist > 0; // is the first point above the plane?
    const first = start_above ? 0 : 1; // the first list to start adding posis
    const second = 1 - first; // the second list to add posis, after you cross the plane
    let index = first;
    // for each pair of posis, get the posi_i intersection or null
    slice_posis[index].push([]);
    let num_cuts = 0;
    for (let i = 0; i < num_posis - 1; i++) {
        const edge_posis: [string, string] = [seq_posis_ex[i], seq_posis_ex[i + 1]];
        // find isect or null
        edge_posis.sort();
        const isect_posi: string = edge_to_isect_posis.get(edge_posis[0]).get(edge_posis[1]);
        slice_posis[index][slice_posis[index].length - 1].push(seq_posis_ex[i]);
        if (isect_posi !== null) {
            num_cuts += 1;
            // add posi before cut
            if (method === _ECutMethod.KEEP_BOTH && index === 0) {
                const isect_posi2: string = cut_posi_to_copies.get(isect_posi);
                slice_posis[index][slice_posis[index].length - 1].push(isect_posi2);
                posi_to_copies.set(isect_posi2, isect_posi2);
            } else {
                slice_posis[index][slice_posis[index].length - 1].push(isect_posi);
                posi_to_copies.set(isect_posi, isect_posi);
            }
            // switch
            index = 1 - index;
            slice_posis[index].push([]);
            // add posi after cut
            if (method === _ECutMethod.KEEP_BOTH && index === 0) {
                const isect_posi2: string = cut_posi_to_copies.get(isect_posi);
                slice_posis[index][slice_posis[index].length - 1].push(isect_posi2);
                posi_to_copies.set(isect_posi2, isect_posi2);
            } else {
                slice_posis[index][slice_posis[index].length - 1].push(isect_posi);
                posi_to_copies.set(isect_posi, isect_posi);
            }
        }
    }
    if (ent_type === ENT_TYPE.PGON && num_cuts % 2 !== 0) {
        throw new Error('Internal error cutting polygon: number of cuts in uneven');
    }
    // deal with cases where the entity was not cut
    // make a copy of the ent, with new posis
    if (slice_posis[second].length === 0) {
        const ent_copy: string = _cutCopyEnt(__model__, ent, seq_posis, posi_to_copies);
        if (start_above && (method === _ECutMethod.KEEP_BOTH || method === _ECutMethod.KEEP_ABOVE)) {
            return [[ent_copy], []];
        } else if (!start_above && (method === _ECutMethod.KEEP_BOTH || method === _ECutMethod.KEEP_BELOW)) {
            return [[], [ent_copy]];
        }
        return [[], []];
    }
    // update the lists, to deal with the end cases
    if (ent_type === ENT_TYPE.PGON) {
        // add the last list of posis to the the first list of posis
        for (const slice_posi of slice_posis[index][slice_posis[index].length - 1]) {
            slice_posis[index][0].push(slice_posi);
        }
        slice_posis[index] = slice_posis[index].slice(0, -1);
    } else {
        // add the last posi to the last list
        slice_posis[index][slice_posis[index].length - 1].push(seq_posis_ex[num_posis - 1]);
    }
    // make the cut entities
    const above: string[] = [];
    const below: string[] = [];
    switch (method) {
        case _ECutMethod.KEEP_BOTH:
        case _ECutMethod.KEEP_ABOVE:
            for (const posis_i of slice_posis[0]) {
                const new_ent: string = _cutCreateEnt(__model__, ent_type, posis_i, posi_to_copies);
                if (new_ent !== null) {
                    above.push(new_ent);
                }
            }
            break;
        default:
            break;
    }
    switch (method) {
        case _ECutMethod.KEEP_BOTH:
        case _ECutMethod.KEEP_BELOW:
            for (const posis_i of slice_posis[1]) {
                const new_ent: string = _cutCreateEnt(__model__, ent_type, posis_i, posi_to_copies);
                if (new_ent !== null) {
                    below.push(new_ent);
                }
            }
            break;
        default:
            break;
    }
    return [above, below];
}
// =================================================================================================
// filter very short edges
function _cutFilterShortEdges(__model__: Sim, posis: string[]): string[] {
    const new_posis: string[] = [posis[0]];
    let xyz0: Txyz = __model__.getPosiCoords(posis[0]);
    for (let i = 1; i < posis.length; i++) {
        const xyz1: Txyz = __model__.getPosiCoords(posis[i]);
        if (distance(xyz0, xyz1) > EPS) {
            new_posis.push(posis[i]);
        }
        xyz0 = xyz1;
    }
    return new_posis;
}
// =================================================================================================
// creates new ents
function _cutCreateEnt(__model__: Sim, ent_type: ENT_TYPE, posis: string[], 
        posi_to_copies: Map<string, string>
    ): string {
    // filter short edges
    const filt_posis_i: string[] = _cutFilterShortEdges(__model__, posis);
    if (ent_type === ENT_TYPE.PLINE) {
        // create polyline
        if (filt_posis_i.length < 2) { return null; }
        const copy_posis: string[] = _cutGetPosis(__model__, filt_posis_i, posi_to_copies);
        return __model__.addPline(copy_posis);
    } else {
        // create polygon
        if (filt_posis_i.length < 3) { return null; }
        const copy_posis: string[] = _cutGetPosis(__model__, filt_posis_i, posi_to_copies);
        return __model__.addPgon(copy_posis);
        // TODO holes
    }
}
// =================================================================================================