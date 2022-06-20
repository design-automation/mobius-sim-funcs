import { TPlane, Txyz, vecFromTo, vecLen, vecCross, vecNorm, vecAdd, vecSetLen, vecDot } from "../../../mobius_sim";
const EPS = 1e-8;
// ================================================================================================
// used by sweep
// TODO update offset code to use this as well
/* Function to get a set of planes along the length of a wire.
 * The planes are orientated perpendicular to the wire.
 *
 */
export function getPlanesSeq(xyzs: Txyz[], normal: Txyz, close: boolean): TPlane[] {
    normal = vecNorm(normal);
    // if closed, add a posi to the end
    if (close) {
        xyzs.splice(0, 0, xyzs[xyzs.length - 1]);
        xyzs.push(xyzs[1]);
    }
    // get the perp vectors
    let perp_vec: Txyz = null;
    let has_bad_edges = false;
    const perp_vecs: Txyz[] = []; // normalise dvectors
    for (let i = 0; i < xyzs.length - 1; i++) {
        const xyz0: Txyz = xyzs[i];
        const xyz1: Txyz = xyzs[i + 1];
        const edge_vec: Txyz = vecFromTo(xyz0, xyz1);
        if (vecLen(edge_vec) > 0) {
            perp_vec = vecCross(vecNorm(edge_vec), normal);
        } else {
            perp_vec = null;
            has_bad_edges = true;
        }
        perp_vecs.push(perp_vec);
    }
    // fix any bad pairs, by setting the perp vec to its next neighbour
    if (has_bad_edges) {
        if (perp_vecs[perp_vecs.length - 1] === null) {
            throw new Error("Error: could not process wire.");
        }
        for (let i = perp_vecs.length - 1; i >= 0; i--) {
            if (perp_vecs[i] === null) {
                perp_vecs[i] = perp_vec;
            } else {
                perp_vec = perp_vecs[i];
            }
        }
    }
    // array for planes
    const planes: TPlane[] = [];
    // if not closed, we need to deal with the first and last planes
    if (!close) {
        // first plane
        const first_xyz: Txyz = xyzs[0];
        const x_axis: Txyz = perp_vecs[0];
        const first2_perp_vec: Txyz = perp_vecs[1];
        let y_axis: Txyz = normal;
        if (vecDot(x_axis, first2_perp_vec) < EPS) {
            // TODOD < what is a good value for this?
            y_axis = vecCross(x_axis, first2_perp_vec);
        }
        const first_plane: TPlane = [first_xyz, x_axis, y_axis];
        planes.push(first_plane);
    }
    // loop through all the edges and create a plane at the end of the edge
    for (let i = 0; i < perp_vecs.length - 1; i++) {
        // get the xyz
        const xyz: Txyz = xyzs[i + 1];
        // get the two perpendicular vectors
        const this_perp_vec: Txyz = perp_vecs[i];
        const next_perp_vec: Txyz = perp_vecs[i + 1];
        // calc the local norm
        let y_axis: Txyz = normal;
        if (vecDot(this_perp_vec, next_perp_vec) < EPS) {
            // TODOD < what is a good value for this?
            y_axis = vecCross(this_perp_vec, next_perp_vec);
        }
        // calc the offset vector
        let x_axis: Txyz = vecNorm(vecAdd(this_perp_vec, next_perp_vec));
        const dot: number = vecDot(this_perp_vec, x_axis);
        const vec_len = 1 / dot;
        x_axis = vecSetLen(x_axis, vec_len);
        // create the plane
        const plane: TPlane = [xyz, x_axis, y_axis];
        planes.push(plane);
    }
    // if not closed, we need to deal with the first and last planes
    if (!close) {
        // last plane
        const last_xyz: Txyz = xyzs[xyzs.length - 1];
        const x_axis: Txyz = perp_vecs[perp_vecs.length - 1];
        const last2_perp_vec: Txyz = perp_vecs[perp_vecs.length - 2];
        let y_axis: Txyz = normal;
        if (vecDot(last2_perp_vec, x_axis) < EPS) {
            // TODOD < what is a good value for this?
            y_axis = vecCross(last2_perp_vec, x_axis);
        }
        const last_plane: TPlane = [last_xyz, x_axis, y_axis];
        planes.push(last_plane);
    }
    // return the planes
    return planes;
}
// ================================================================================================
