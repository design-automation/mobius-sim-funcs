/**
 * The `intersect` module has functions for calculating intersections between different types of entities.
 * @module
 */
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { EEntType } from '@design-automation/mobius-sim/dist/geo-info/common';
import { idsBreak } from '@design-automation/mobius-sim/dist/geo-info/common_id_funcs';
import { getArrDepth } from '@design-automation/mobius-sim/dist/util/arrs';
import { vecCross } from '@design-automation/mobius-sim/dist/geom/vectors';
import * as THREE from 'three';
// ================================================================================================
/**
 * Calculates the xyz intersection between a ray and one or more polygons.
 * \n
 * The intersection between each polygon face triangle and the ray is caclulated.
 * This ignores the intersections between rays and edges (including polyline edges).
 * \n
 * @param __model__
 * @param ray A ray.
 * @param entities A polygon or list of polygons.
 * @return A list of xyz intersection coordinates.
 * @example coords = intersect.RayFace(ray, polygon1)
 * @example_info Returns a list of coordinates where the ray  intersects with the polygon.
 */
export function RayFace(__model__, ray, entities) {
    // --- Error Check ---
    const fn_name = 'intersect.RayFace';
    let ents_arr;
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'ray', ray, [chk.isRay]);
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.PGON, EEntType.COLL]);
    }
    else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList],
        //     [EEntType.FACE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    // create the threejs entity and calc intersections
    const ray_tjs = new THREE.Ray(new THREE.Vector3(...ray[0]), new THREE.Vector3(...ray[1]));
    return _intersectRay(__model__, ents_arr, ray_tjs);
}
function _intersectRay(__model__, ents_arr, ray_tjs) {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index] = ents_arr;
        const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
        const posis_tjs = [];
        for (const posi_i of posis_i) {
            const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
            const posi_tjs = new THREE.Vector3(...xyz);
            posis_tjs[posi_i] = posi_tjs;
        }
        const isect_xyzs = [];
        // triangles
        const pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, index);
        const tris_i = [];
        for (const pgon_i of pgons_i) {
            for (const tri_i of __model__.modeldata.geom.nav_tri.navPgonToTri(pgon_i)) {
                tris_i.push(tri_i);
            }
        }
        for (const tri_i of tris_i) {
            const tri_posis_i = __model__.modeldata.geom.nav_tri.navTriToPosi(tri_i);
            const tri_posis_tjs = tri_posis_i.map(tri_posi_i => posis_tjs[tri_posi_i]);
            const isect_tjs = new THREE.Vector3();
            const result = ray_tjs.intersectTriangle(tri_posis_tjs[0], tri_posis_tjs[1], tri_posis_tjs[2], false, isect_tjs);
            if (result !== undefined && result !== null) {
                isect_xyzs.push([isect_tjs.x, isect_tjs.y, isect_tjs.z]);
            }
        }
        // return the intersection xyzs
        return isect_xyzs;
    }
    else {
        const all_isect_xyzs = [];
        for (const ent_arr of ents_arr) {
            const isect_xyzs = _intersectRay(__model__, ent_arr, ray_tjs);
            for (const isect_xyz of isect_xyzs) {
                all_isect_xyzs.push(isect_xyz);
            }
        }
        return all_isect_xyzs;
    }
}
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
export function PlaneEdge(__model__, plane, entities) {
    // --- Error Check ---
    const fn_name = 'intersect.PlaneEdge';
    let ents_arr;
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'plane', plane, [chk.isPln]);
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
    }
    else {
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    // create the threejs entity and calc intersections
    const plane_normal = vecCross(plane[1], plane[2]);
    const plane_tjs = new THREE.Plane();
    plane_tjs.setFromNormalAndCoplanarPoint(new THREE.Vector3(...plane_normal), new THREE.Vector3(...plane[0]));
    return _intersectPlane(__model__, ents_arr, plane_tjs);
}
/**
 * Recursive intersect
 * @param __model__
 * @param ents_arr
 * @param plane_tjs
 */
function _intersectPlane(__model__, ents_arr, plane_tjs) {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, ent_i] = ents_arr;
        if (ent_type === EEntType.EDGE) {
            return _intersectPlaneEdge(__model__, ent_i, plane_tjs);
        }
        else if (ent_type < EEntType.EDGE) {
            const edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
            const edges_isect_xyzs = [];
            for (const edge_i of edges_i) {
                const edge_isect_xyzs = _intersectPlaneEdge(__model__, edge_i, plane_tjs);
                for (const edge_isect_xyz of edge_isect_xyzs) {
                    edges_isect_xyzs.push(edge_isect_xyz);
                }
            }
            return edges_isect_xyzs;
        }
        else {
            const wires_i = __model__.modeldata.geom.nav.navAnyToWire(ent_type, ent_i);
            const wires_isect_xyzs = [];
            for (const wire_i of wires_i) {
                const wire_isect_xyzs = _intersectPlaneWire(__model__, wire_i, plane_tjs);
                for (const wire_isect_xyz of wire_isect_xyzs) {
                    wires_isect_xyzs.push(wire_isect_xyz);
                }
            }
            return wires_isect_xyzs;
        }
    }
    else {
        const all_isect_xyzs = [];
        for (const ent_arr of ents_arr) {
            const isect_xyzs = _intersectPlane(__model__, ent_arr, plane_tjs);
            for (const isect_xyz of isect_xyzs) {
                all_isect_xyzs.push(isect_xyz);
            }
        }
        return all_isect_xyzs;
    }
}
/**
 * Calc intersection between a plane and a wire.
 * @param __model__
 * @param wire_i
 * @param plane_tjs
 */
function _intersectPlaneWire(__model__, wire_i, plane_tjs) {
    const isect_xyzs = [];
    const wire_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
    // create threejs posis for all posis
    const posis_tjs = [];
    for (const wire_posi_i of wire_posis_i) {
        const xyz = __model__.modeldata.attribs.posis.getPosiCoords(wire_posi_i);
        const posi_tjs = new THREE.Vector3(...xyz);
        posis_tjs.push(posi_tjs);
    }
    if (__model__.modeldata.geom.query.isWireClosed(wire_i)) {
        posis_tjs.push(posis_tjs[0]);
    }
    // for each pair of posis, create a threejs line and do the intersect
    for (let i = 0; i < posis_tjs.length - 1; i++) {
        const line_tjs = new THREE.Line3(posis_tjs[i], posis_tjs[i + 1]);
        const isect_tjs = new THREE.Vector3();
        const result = plane_tjs.intersectLine(line_tjs, isect_tjs);
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
function _intersectPlaneEdge(__model__, edge_i, plane_tjs) {
    const edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
    // create threejs posis for all posis
    const xyz0 = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
    const xyz1 = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
    const posi0_tjs = new THREE.Vector3(...xyz0);
    const posi1_tjs = new THREE.Vector3(...xyz1);
    // for each pair of posis, create a threejs line and do the intersect
    const line_tjs = new THREE.Line3(posi0_tjs, posi1_tjs);
    const isect_tjs = new THREE.Vector3();
    const result = plane_tjs.intersectLine(line_tjs, isect_tjs);
    if (result !== undefined && result !== null) {
        return [[isect_tjs.x, isect_tjs.y, isect_tjs.z]];
    }
    return [];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJzZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZXMvYmFzaWMvaW50ZXJzZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFaEQsT0FBTyxLQUFLLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQztBQUUxQyxPQUFPLEVBQWEsUUFBUSxFQUE2QixNQUFNLG9EQUFvRCxDQUFDO0FBRXBILE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSw2REFBNkQsQ0FBQztBQUN2RixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDM0UsT0FBTyxFQUFFLFFBQVEsRUFBQyxNQUFNLGlEQUFpRCxDQUFDO0FBRTFFLE9BQU8sS0FBSyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBRS9CLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLFVBQVUsT0FBTyxDQUFDLFNBQWtCLEVBQUUsR0FBUyxFQUFFLFFBQW1CO0lBQ3RFLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQztJQUNwQyxJQUFJLFFBQW1DLENBQUM7SUFDeEMsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNoRCxRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDeEQsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFDcEIsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBOEIsQ0FBQztLQUNwRTtTQUFN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