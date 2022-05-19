import { EEntType, getArrDepth, GIModel, idsBreak, TEntTypeIdx, TId, TRay, Txyz } from '@design-automation/mobius-sim';
import * as THREE from 'three';

import { checkIDs, ID } from '../../../_check_ids';
import * as chk from '../../../_check_types';


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
 * @example `coords = intersect.RayFace(ray, polygon1)`
 * @example_info Returns a list of coordinates where the ray intersects with the polygon.
 */
export function RayFace(__model__: GIModel, ray: TRay, entities: TId|TId[]): Txyz[] {
    // --- Error Check ---
    const fn_name = 'intersect.RayFace';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'ray', ray, [chk.isRay]);
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1],
            [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList],
        //     [EEntType.FACE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    // create the threejs entity and calc intersections
    const ray_tjs: THREE.Ray = new THREE.Ray(new THREE.Vector3(...ray[0]), new THREE.Vector3(...ray[1]));
    return _intersectRay(__model__, ents_arr, ray_tjs);
}
function _intersectRay(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], ray_tjs: THREE.Ray): Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arr as TEntTypeIdx;
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
        const posis_tjs: THREE.Vector3[] = [];
        for (const posi_i of posis_i) {
            const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
            const posi_tjs: THREE.Vector3 = new THREE.Vector3(...xyz);
            posis_tjs[posi_i] = posi_tjs;
        }
        const isect_xyzs: Txyz[] = [];
        // triangles
        const pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, index);
        const tris_i: number[] = [];
        for (const pgon_i of pgons_i) {
            for (const tri_i of __model__.modeldata.geom.nav_tri.navPgonToTri(pgon_i)) {
                tris_i.push(tri_i);
            }
        }
        for (const tri_i of tris_i) {
            const tri_posis_i: number[] = __model__.modeldata.geom.nav_tri.navTriToPosi(tri_i);
            const tri_posis_tjs: THREE.Vector3[] = tri_posis_i.map(tri_posi_i => posis_tjs[tri_posi_i]);
            const isect_tjs: THREE.Vector3 = new THREE.Vector3();
            const result: THREE.Vector3 = ray_tjs.intersectTriangle(tri_posis_tjs[0], tri_posis_tjs[1], tri_posis_tjs[2], false, isect_tjs);
            if (result !== undefined && result !== null) {
                isect_xyzs.push([isect_tjs.x, isect_tjs.y, isect_tjs.z]);
            }
        }
        // return the intersection xyzs
        return isect_xyzs;
    } else {
        const all_isect_xyzs: Txyz[] = [];
        for (const ent_arr of ents_arr) {
            const isect_xyzs: Txyz[] = _intersectRay(__model__, ent_arr as TEntTypeIdx, ray_tjs);
            for (const isect_xyz  of isect_xyzs) {
                all_isect_xyzs.push(isect_xyz);
            }
        }
        return all_isect_xyzs as Txyz[];
    }
}
