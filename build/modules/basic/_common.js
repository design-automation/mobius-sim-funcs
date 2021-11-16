/**
 * Shared utility functions
 * @module
 */
import { checkIDs, ID } from '../../_check_ids';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { EEntType, getArrDepth, vecDiv, vecSum, vecAvg, vecFromTo, vecLen, vecCross, vecNorm, vecAdd, vecSetLen, vecDot, isRay, isPlane, isXYZ } from '@design-automation/mobius-sim';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NvbW1vbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGVzL2Jhc2ljL19jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNoRCxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMvQixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBRWhDLE9BQU8sRUFBOEIsUUFBUSxFQUN6QyxXQUFXLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQ2hFLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3JHLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQztBQUNqQixTQUFTLFVBQVUsQ0FBQyxHQUFvQjtJQUNwQyxrQkFBa0I7SUFDbEIsTUFBTSxPQUFPLEdBQVcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLElBQUksT0FBTyxLQUFLLENBQUMsRUFBRTtRQUFFLE9BQVEsR0FBZ0IsQ0FBQyxHQUFHLENBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQVksQ0FBQztLQUFFO0lBQ2hHLGNBQWM7SUFDZCxHQUFHLEdBQUcsR0FBYSxDQUFDO0lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFVLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFDRCxNQUFNLFVBQVUsVUFBVSxDQUFDLEdBQWdCO0lBQ3ZDLGtCQUFr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