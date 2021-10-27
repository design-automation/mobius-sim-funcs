/**
 * Shared utility functions
 * @module
 */
import { checkIDs, ID } from '../../_check_ids';
import { EEntType } from '@design-automation/mobius-sim/dist/geo-info/common';
import { getArrDepth } from '@design-automation/mobius-sim/dist/util/arrs';
import { vecDiv, vecSum, vecAvg, vecFromTo, vecLen, vecCross, vecNorm, vecAdd, vecSetLen, vecDot } from '@design-automation/mobius-sim/dist/geom/vectors';
import { isRay, isPlane, isXYZ } from '@design-automation/mobius-sim/dist/geo-info/common_func';
import * as THREE from 'three';
import { Vector3 } from 'three';
const EPS = 1e-8;
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
export function plnFromRay(ray) {
    // overloaded case
    const ray_dep = getArrDepth(ray);
    if (ray_dep === 3) {
        return ray.map(ray_one => plnFromRay(ray_one));
    }
    // normal case
    ray = ray;
    const z_vec = vecNorm(ray[1]);
    let vec = [0, 0, 1];
    if (vecDot(vec, z_vec) === 1) {
        vec = [1, 0, 0];
    }
    const x_axis = vecCross(vec, z_vec);
    const y_axis = vecCross(x_axis, z_vec);
    return [ray[0].slice(), x_axis, y_axis];
}
// ================================================================================================
export function getOrigin(__model__, data, fn_name) {
    if (isXYZ(data)) {
        return data;
    }
    if (isRay(data)) {
        return data[0];
    }
    if (isPlane(data)) {
        return data[0];
    }
    const ents = data;
    const origin = getCentoridFromEnts(__model__, ents, fn_name);
    return origin;
}
// ================================================================================================
export function getRay(__model__, data, fn_name) {
    if (isXYZ(data)) {
        return [data, [0, 0, 1]];
    }
    if (isRay(data)) {
        return data;
    }
    if (isPlane(data)) {
        return rayFromPln(data);
    }
    const ents = data;
    const origin = getCentoridFromEnts(__model__, ents, fn_name);
    return [origin, [0, 0, 1]];
}
// ================================================================================================
export function getPlane(__model__, data, fn_name) {
    if (isXYZ(data)) {
        return [data, [1, 0, 0], [0, 1, 0]];
    }
    if (isRay(data)) {
        return plnFromRay(data);
    }
    if (isPlane(data)) {
        return data;
    }
    const ents = data;
    const origin = getCentoridFromEnts(__model__, ents, fn_name);
    return [origin, [1, 0, 0], [0, 1, 0]];
}
// ================================================================================================
export function getCentoridFromEnts(__model__, ents, fn_name) {
    // this must be an ID or an array of IDs, so lets get the centroid
    // TODO this error message is confusing
    const ents_arr = checkIDs(__model__, fn_name, 'ents', ents, [ID.isID, ID.isIDL1], [EEntType.POSI, EEntType.VERT, EEntType.POINT, EEntType.EDGE, EEntType.WIRE,
        EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
    const centroid = getCentroid(__model__, ents_arr);
    if (Array.isArray(centroid[0])) {
        return vecAvg(centroid);
    }
    return centroid;
}
// ================================================================================================
export function getCentroid(__model__, ents_arr) {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index] = ents_arr;
        const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
        return _centroidPosis(__model__, posis_i);
    }
    else {
        // divide the input into posis and non posis
        ents_arr = ents_arr;
        const posis_i = [];
        const np_ents_arr = [];
        for (const ent_arr of ents_arr) {
            if (ent_arr[0] === EEntType.POSI) {
                posis_i.push(ent_arr[1]);
            }
            else {
                np_ents_arr.push(ent_arr);
            }
        }
        // if we only have posis, just return one centorid
        // in all other cases return a list of centroids
        const np_cents = np_ents_arr.map(ent_arr => getCentroid(__model__, ent_arr));
        if (posis_i.length > 0) {
            const cen_posis = _centroidPosis(__model__, posis_i);
            if (np_cents.length === 0) {
                return cen_posis;
            }
            else {
                np_cents.push(cen_posis);
            }
        }
        return np_cents;
    }
}
function _centroidPosis(__model__, posis_i) {
    const unique_posis_i = Array.from(new Set(posis_i));
    const unique_xyzs = unique_posis_i.map(posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
    return vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
}
// ================================================================================================
export function getCenterOfMass(__model__, ents_arr) {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, ent_i] = ents_arr;
        const pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
        if (pgons_i.length === 0) {
            return null;
        }
        return _centerOfMass(__model__, pgons_i);
    }
    else {
        const cents = [];
        ents_arr = ents_arr;
        for (const [ent_type, ent_i] of ents_arr) {
            const pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
            if (pgons_i.length === 0) {
                cents.push(null);
            }
            cents.push(_centerOfMass(__model__, pgons_i));
        }
        return cents;
    }
}
function _centerOfMass(__model__, pgons_i) {
    const face_midpoints = [];
    const face_areas = [];
    let total_area = 0;
    for (const face_i of pgons_i) {
        const [midpoint_xyz, area] = _centerOfMassOfPgon(__model__, face_i);
        face_midpoints.push(midpoint_xyz);
        face_areas.push(area);
        total_area += area;
    }
    const cent = [0, 0, 0];
    for (let i = 0; i < face_midpoints.length; i++) {
        const weight = face_areas[i] / total_area;
        cent[0] = cent[0] + face_midpoints[i][0] * weight;
        cent[1] = cent[1] + face_midpoints[i][1] * weight;
        cent[2] = cent[2] + face_midpoints[i][2] * weight;
    }
    return cent;
}
function _centerOfMassOfPgon(__model__, pgon_i) {
    const tri_midpoints = [];
    const tri_areas = [];
    let total_area = 0;
    const map_posi_to_v3 = new Map();
    let midpoint = new Vector3();
    for (const tri_i of __model__.modeldata.geom.nav_tri.navPgonToTri(pgon_i)) {
        const posis_i = __model__.modeldata.geom.nav_tri.navTriToPosi(tri_i);
        const posis_v3 = [];
        for (const posi_i of posis_i) {
            let posi_v3 = map_posi_to_v3.get(posi_i);
            if (posi_v3 === undefined) {
                const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
                posi_v3 = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);
            }
            posis_v3.push(posi_v3);
        }
        const tri_tjs = new THREE.Triangle(posis_v3[0], posis_v3[1], posis_v3[2]);
        tri_tjs.getMidpoint(midpoint);
        const midpoint_xyz = [midpoint.x, midpoint.y, midpoint.z];
        const area = tri_tjs.getArea();
        tri_midpoints.push(midpoint_xyz);
        tri_areas.push(area);
        total_area += area;
    }
    const cent = [0, 0, 0];
    for (let i = 0; i < tri_midpoints.length; i++) {
        const weight = tri_areas[i] / total_area;
        cent[0] = cent[0] + tri_midpoints[i][0] * weight;
        cent[1] = cent[1] + tri_midpoints[i][1] * weight;
        cent[2] = cent[2] + tri_midpoints[i][2] * weight;
    }
    return [cent, total_area];
}
// ================================================================================================
// used by sweep
// TODO update offset code to use this as well
/* Function to get a set of planes along the length of a wire.
 * The planes are orientated perpendicular to the wire.
 *
 */
export function getPlanesSeq(xyzs, normal, close) {
    normal = vecNorm(normal);
    // if closed, add a posi to the end
    if (close) {
        xyzs.splice(0, 0, xyzs[xyzs.length - 1]);
        xyzs.push(xyzs[1]);
    }
    // get the perp vectors
    let perp_vec = null;
    let has_bad_edges = false;
    const perp_vecs = []; // normalise dvectors
    for (let i = 0; i < xyzs.length - 1; i++) {
        const xyz0 = xyzs[i];
        const xyz1 = xyzs[i + 1];
        const edge_vec = vecFromTo(xyz0, xyz1);
        if (vecLen(edge_vec) > 0) {
            perp_vec = vecCross(vecNorm(edge_vec), normal);
        }
        else {
            perp_vec = null;
            has_bad_edges = true;
        }
        perp_vecs.push(perp_vec);
    }
    // fix any bad pairs, by setting the perp vec to its next neighbour
    if (has_bad_edges) {
        if (perp_vecs[perp_vecs.length - 1] === null) {
            throw new Error('Error: could not process wire.');
        }
        for (let i = perp_vecs.length - 1; i >= 0; i--) {
            if (perp_vecs[i] === null) {
                perp_vecs[i] = perp_vec;
            }
            else {
                perp_vec = perp_vecs[i];
            }
        }
    }
    // array for planes
    const planes = [];
    // if not closed, we need to deal with the first and last planes
    if (!close) {
        // first plane
        const first_xyz = xyzs[0];
        const x_axis = perp_vecs[0];
        const first2_perp_vec = perp_vecs[1];
        let y_axis = normal;
        if (vecDot(x_axis, first2_perp_vec) < EPS) { // TODOD < what is a good value for this?
            y_axis = vecCross(x_axis, first2_perp_vec);
        }
        const first_plane = [first_xyz, x_axis, y_axis];
        planes.push(first_plane);
    }
    // loop through all the edges and create a plane at the end of the edge
    for (let i = 0; i < perp_vecs.length - 1; i++) {
        // get the xyz
        const xyz = xyzs[i + 1];
        // get the two perpendicular vectors
        const this_perp_vec = perp_vecs[i];
        const next_perp_vec = perp_vecs[i + 1];
        // calc the local norm
        let y_axis = normal;
        if (vecDot(this_perp_vec, next_perp_vec) < EPS) { // TODOD < what is a good value for this?
            y_axis = vecCross(this_perp_vec, next_perp_vec);
        }
        // calc the offset vector
        let x_axis = vecNorm(vecAdd(this_perp_vec, next_perp_vec));
        const dot = vecDot(this_perp_vec, x_axis);
        const vec_len = 1 / dot;
        x_axis = vecSetLen(x_axis, vec_len);
        // create the plane
        const plane = [xyz, x_axis, y_axis];
        planes.push(plane);
    }
    // if not closed, we need to deal with the first and last planes
    if (!close) {
        // last plane
        const last_xyz = xyzs[xyzs.length - 1];
        const x_axis = perp_vecs[perp_vecs.length - 1];
        const last2_perp_vec = perp_vecs[perp_vecs.length - 2];
        let y_axis = normal;
        if (vecDot(last2_perp_vec, x_axis) < EPS) { // TODOD < what is a good value for this?
            y_axis = vecCross(last2_perp_vec, x_axis);
        }
        const last_plane = [last_xyz, x_axis, y_axis];
        planes.push(last_plane);
    }
    // return the planes
    return planes;
}
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NvbW1vbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGVzL2Jhc2ljL19jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUdoRCxPQUFPLEVBQXFCLFFBQVEsRUFBcUIsTUFBTSxvREFBb0QsQ0FBQztBQUNwSCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDM0UsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQzFKLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBQ2hHLE9BQU8sS0FBSyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQy9CLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFNBQVMsVUFBVSxDQUFDLEdBQW9CO0lBQ3BDLGtCQUFrQjtJQUNsQixNQUFNLE9BQU8sR0FBVyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekMsSUFBSSxPQUFPLEtBQUssQ0FBQyxFQUFFO1FBQUUsT0FBUSxHQUFnQixDQUFDLEdBQUcsQ0FBRSxPQUFPLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBWSxDQUFDO0tBQUU7SUFDaEcsY0FBYztJQUNkLEdBQUcsR0FBRyxHQUFhLENBQUM7SUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQVUsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMs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