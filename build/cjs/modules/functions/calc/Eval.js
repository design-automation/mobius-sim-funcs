"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const chk = __importStar(require("../../../_check_types"));
// ================================================================================================
/**
 * Calculates the xyz coord along an edge, wire, or polyline given a t parameter.
 *
 * The 't' parameter varies between 0 and 1, where 0 indicates the start and 1 indicates the end.
 * For example, given a polyline,
 * evaluating at t=0 gives that xyz at the start,
 * evaluating at t=0.5 gives the xyz halfway along the polyline,
 * evaluating at t=1 gives the xyz at the end of the polyline.
 *
 * Given a single edge, wire, or polyline, a single xyz coord will be returned.
 *
 * Given a list of edges, wires, or polylines, a list of xyz coords will be returned.
 *
 * Given any entity that has wires (faces, polygons and collections),
 * a list of wires will be extracted, and a list of coords will be returned.
 *
 * @param __model__
 * @param entities Single or list of edges, wires, polylines, or faces, polygons, or collections.
 * @param t_param A value between 0 to 1.
 * @returns The coordinates [x, y, z], or a list of coordinates.
 * @example coord1 = calc.Eval (polyline1, 0.23)
 */
function Eval(__model__, entities, t_param) {
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Eval';
    let ents_arrs;
    if (__model__.debug) {
        ents_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.EDGE, mobius_sim_1.EEntType.WIRE, mobius_sim_1.EEntType.PLINE, mobius_sim_1.EEntType.PGON, mobius_sim_1.EEntType.COLL]);
        chk.checkArgs(fn_name, 'param', t_param, [chk.isNum01]);
    }
    else {
        ents_arrs = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    return _eval(__model__, ents_arrs, t_param);
}
exports.Eval = Eval;
function _eval(__model__, ents_arr, t_param) {
    if ((0, mobius_sim_1.getArrDepth)(ents_arr) === 1) {
        const [ent_type, index] = ents_arr;
        if (ent_type === mobius_sim_1.EEntType.EDGE || ent_type === mobius_sim_1.EEntType.WIRE || ent_type === mobius_sim_1.EEntType.PLINE) {
            const edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
            const num_edges = edges_i.length;
            // get all the edge lengths
            let total_dist = 0;
            const dists = [];
            const xyz_pairs = [];
            for (const edge_i of edges_i) {
                const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.EDGE, edge_i);
                const xyz_0 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
                const xyz_1 = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
                const dist = (0, mobius_sim_1.distance)(xyz_0, xyz_1);
                total_dist += dist;
                dists.push(total_dist);
                xyz_pairs.push([xyz_0, xyz_1]);
            }
            // map the t_param
            const t_param_mapped = t_param * total_dist;
            // loop through and find the point
            for (let i = 0; i < num_edges; i++) {
                if (t_param_mapped < dists[i]) {
                    const xyz_pair = xyz_pairs[i];
                    let dist_a = 0;
                    if (i > 0) {
                        dist_a = dists[i - 1];
                    }
                    const dist_b = dists[i];
                    const edge_length = dist_b - dist_a;
                    const to_t = t_param_mapped - dist_a;
                    const vec_len = to_t / edge_length;
                    return (0, mobius_sim_1.vecAdd)(xyz_pair[0], (0, mobius_sim_1.vecMult)((0, mobius_sim_1.vecSub)(xyz_pair[1], xyz_pair[0]), vec_len));
                }
            }
            // t param must be 1 (or greater)
            return xyz_pairs[num_edges - 1][1];
        }
        else {
            const wires_i = __model__.modeldata.geom.nav.navAnyToWire(ent_type, index);
            const wires_arrs = wires_i.map(wire_i => [mobius_sim_1.EEntType.WIRE, wire_i]);
            return wires_arrs.map(wires_arr => _eval(__model__, wires_arr, t_param));
        }
    }
    else {
        return ents_arr.map(ent_arr => _eval(__model__, ent_arr, t_param));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9jYWxjL0V2YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFhdUM7QUFFdkMsb0RBQW1EO0FBQ25ELDJEQUE2QztBQUk3QyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQUNILFNBQWdCLElBQUksQ0FBQyxTQUFrQixFQUFFLFFBQW1CLEVBQUUsT0FBZTtJQUN6RSxJQUFJLElBQUEsdUJBQVUsRUFBQyxRQUFRLENBQUMsRUFBRTtRQUFFLE9BQU8sRUFBRSxDQUFDO0tBQUU7SUFDeEMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQztJQUM1QixJQUFJLFNBQW9DLENBQUM7SUFDekMsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLFNBQVMsR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUN6RCxDQUFDLGVBQUUsQ0FBQyxJQUFJLEVBQUUsZUFBRSxDQUFDLE1BQU0sQ0FBRSxFQUNyQixDQUFDLHFCQUFRLENBQUMsSUFBSSxFQUFFLHFCQUFRLENBQUMsSUFBSSxFQUFFLHFCQUFRLENBQUMsS0FBSyxFQUFFLHFCQUFRLENBQUMsSUFBSSxFQUFFLHFCQUFRLENBQUMsSUFBSSxDQUFDLENBQThCLENBQUM7UUFDL0csR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQzNEO1NBQU07UUFDSCxTQUFTLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFFBQVEsQ0FBOEIsQ0FBQztLQUMvRDtJQUNELHNCQUFzQjtJQUN0QixPQUFPLEtBQUssQ0FBQyxTQUFTLEVBQUUsU0FB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