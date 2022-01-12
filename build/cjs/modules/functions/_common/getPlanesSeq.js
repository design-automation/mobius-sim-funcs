"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlanesSeq = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const EPS = 1e-8;
// ================================================================================================
// used by sweep
// TODO update offset code to use this as well
/* Function to get a set of planes along the length of a wire.
 * The planes are orientated perpendicular to the wire.
 *
 */
function getPlanesSeq(xyzs, normal, close) {
    normal = (0, mobius_sim_1.vecNorm)(normal);
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
        const edge_vec = (0, mobius_sim_1.vecFromTo)(xyz0, xyz1);
        if ((0, mobius_sim_1.vecLen)(edge_vec) > 0) {
            perp_vec = (0, mobius_sim_1.vecCross)((0, mobius_sim_1.vecNorm)(edge_vec), normal);
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
            throw new Error("Error: could not process wire.");
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
        if ((0, mobius_sim_1.vecDot)(x_axis, first2_perp_vec) < EPS) {
            // TODOD < what is a good value for this?
            y_axis = (0, mobius_sim_1.vecCross)(x_axis, first2_perp_vec);
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
        if ((0, mobius_sim_1.vecDot)(this_perp_vec, next_perp_vec) < EPS) {
            // TODOD < what is a good value for this?
            y_axis = (0, mobius_sim_1.vecCross)(this_perp_vec, next_perp_vec);
        }
        // calc the offset vector
        let x_axis = (0, mobius_sim_1.vecNorm)((0, mobius_sim_1.vecAdd)(this_perp_vec, next_perp_vec));
        const dot = (0, mobius_sim_1.vecDot)(this_perp_vec, x_axis);
        const vec_len = 1 / dot;
        x_axis = (0, mobius_sim_1.vecSetLen)(x_axis, vec_len);
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
        if ((0, mobius_sim_1.vecDot)(last2_perp_vec, x_axis) < EPS) {
            // TODOD < what is a good value for this?
            y_axis = (0, mobius_sim_1.vecCross)(last2_perp_vec, x_axis);
        }
        const last_plane = [last_xyz, x_axis, y_axis];
        planes.push(last_plane);
    }
    // return the planes
    return planes;
}
exports.getPlanesSeq = getPlanesSeq;
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UGxhbmVzU2VxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL19jb21tb24vZ2V0UGxhbmVzU2VxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhEQUE4SDtBQUM5SCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDakIsbUdBQW1HO0FBQ25HLGdCQUFnQjtBQUNoQiw4Q0FBOEM7QUFDOUM7OztHQUdHO0FBQ0gsU0FBZ0IsWUFBWSxDQUFDLElBQVksRUFBRSxNQUFZLEVBQUUsS0FBYztJQUNuRSxNQUFNLEdBQUcsSUFBQSxvQkFBTyxFQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pCLG1DQUFtQztJQUNuQyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdEI7SUFDRCx1QkFBdUI7SUFDdkIsSUFBSSxRQUFRLEdBQVMsSUFBSSxDQUFDO0lBQzFCLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQztJQUMxQixNQUFNLFNBQVMsR0FBVyxFQUFFLENBQUMsQ0FBQyxxQkFBcUI7SUFDbkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3RDLE1BQU0sSUFBSSxHQUFTLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixNQUFNLElBQUksR0FBUyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9CLE1BQU0sUUFBUSxHQUFTLElBQUEsc0JBQVMsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFD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