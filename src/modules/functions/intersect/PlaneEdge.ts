import {
    EEntType,
    getArrDepth,
    GIModel,
    idsBreak,
    TEntTypeIdx,
    TId,
    TPlane,
    TRay,
    Txyz,
    vecCross,
} from '@design-automation/mobius-sim';
import * as THREE from 'three';

import { checkIDs, ID } from '../../../_check_ids';
import * as chk from '../../../_check_types';



// ================================================================================================
/**
 * Calculates the xyz intersection between a plane and a list of edges.
 * \n
 * This ignores the intersections between planes and polygon face triangles.
 * \n
 * @param __model__
 * @param plane A plane.
 * @param entities An edge or list of edges, or entities from which edges can be extracted.
 * @return A list of xyz intersection coordinates.
 * @example coords = intersect.PlaneEdge(plane, polyline1)
 * @example_info Returns a list of coordinates where the plane intersects with the edges of polyline1.
 */
export function PlaneEdge(__model__: GIModel, plane: TRay|TPlane, entities: TId|TId[]): Txyz[] {
    // --- Error Check ---
    const fn_name = 'intersect.PlaneEdge';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'plane', plane, [chk.isPln]);
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1],
            [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    // create the threejs entity and calc intersections
    const plane_normal: Txyz = vecCross(plane[1], plane[2]);
    const plane_tjs: THREE.Plane = new THREE.Plane();
    plane_tjs.setFromNormalAndCoplanarPoint( new THREE.Vector3(...plane_normal), new THREE.Vector3(...plane[0]) );
    return _intersectPlane(__model__, ents_arr, plane_tjs);

}
/**
 * Recursive intersect
 * @param __model__
 * @param ents_arr
 * @param plane_tjs
 */
function _intersectPlane(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], plane_tjs: THREE.Plane): Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, ent_i]: [EEntType, number] = ents_arr as TEntTypeIdx;
        if (ent_type === EEntType.EDGE) {
            return _intersectPlaneEdge(__model__, ent_i, plane_tjs);
        } else if (ent_type < EEntType.EDGE) {
            const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
            const edges_isect_xyzs: Txyz[] = [];
            for (const edge_i of edges_i) {
                const edge_isect_xyzs: Txyz[] = _intersectPlaneEdge(__model__, edge_i, plane_tjs);
                for (const edge_isect_xyz of edge_isect_xyzs) {
                    edges_isect_xyzs.push(edge_isect_xyz);
                }
            }
            return edges_isect_xyzs;
        } else {
            const wires_i: number[] = __model__.modeldata.geom.nav.navAnyToWire(ent_type, ent_i);
            const wires_isect_xyzs: Txyz[] = [];
            for (const wire_i of wires_i) {
                const wire_isect_xyzs: Txyz[] = _intersectPlaneWire(__model__, wire_i, plane_tjs);
                for (const wire_isect_xyz of wire_isect_xyzs) {
                    wires_isect_xyzs.push(wire_isect_xyz);
                }
            }
            return wires_isect_xyzs;
        }
    } else {
        const all_isect_xyzs: Txyz[] = [];
        for (const ent_arr of ents_arr) {
            const isect_xyzs: Txyz[] = _intersectPlane(__model__, ent_arr as TEntTypeIdx, plane_tjs);
            for (const isect_xyz of isect_xyzs) {
                all_isect_xyzs.push(isect_xyz);
            }
        }
        return all_isect_xyzs as Txyz[];
    }
}
/**
 * Calc intersection between a plane and a wire.
 * @param __model__
 * @param wire_i
 * @param plane_tjs
 */
function _intersectPlaneWire(__model__: GIModel, wire_i: number, plane_tjs: THREE.Plane): Txyz[] {
    const isect_xyzs: Txyz[] = [];
    const wire_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
    // create threejs posis for all posis
    const posis_tjs: THREE.Vector3[] = [];
    for (const wire_posi_i of wire_posis_i) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(wire_posi_i);
        const posi_tjs: THREE.Vector3 = new THREE.Vector3(...xyz);
        posis_tjs.push(posi_tjs);
    }
    if (__model__.modeldata.geom.query.isWireClosed(wire_i)) {
        posis_tjs.push(posis_tjs[0]);
    }
    // for each pair of posis, create a threejs line and do the intersect
    for (let i = 0; i < posis_tjs.length - 1; i++) {
        const line_tjs: THREE.Line3 = new THREE.Line3(posis_tjs[i], posis_tjs[i + 1]);
        const isect_tjs: THREE.Vector3 = new THREE.Vector3();
        const result: THREE.Vector3 = plane_tjs.intersectLine(line_tjs, isect_tjs);
        if (result !== undefined && result !== null) {
            isect_xyzs.push([isect_tjs.x, isect_tjs.y, isect_tjs.z]);
        }
    }
    return isect_xyzs;
}
/**
 * Calc intersection between a plane and a single edge.
 * @param __model__
 * @param edge_i
 * @param plane_tjs
 */
function _intersectPlaneEdge(__model__: GIModel, edge_i: number, plane_tjs: THREE.Plane): Txyz[] {
    const edge_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
    // create threejs posis for all posis
    const xyz0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
    const xyz1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
    const posi0_tjs: THREE.Vector3 = new THREE.Vector3(...xyz0);
    const posi1_tjs: THREE.Vector3 = new THREE.Vector3(...xyz1);
    // for each pair of posis, create a threejs line and do the intersect
    const line_tjs: THREE.Line3 = new THREE.Line3(posi0_tjs, posi1_tjs);
    const isect_tjs: THREE.Vector3 = new THREE.Vector3();
    const result: THREE.Vector3 = plane_tjs.intersectLine(line_tjs, isect_tjs);
    if (result !== undefined && result !== null) {
        return [[isect_tjs.x, isect_tjs.y, isect_tjs.z]];
    }
    return [];
}
