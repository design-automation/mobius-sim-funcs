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
exports._normal = exports.Normal = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const chk = __importStar(require("../../../_check_types"));
// ================================================================================================
/**
 * Calculates the normal vector of an entity or list of entities. The vector is normalised, and scaled
 * by the specified scale factor.
 *
 * Given a single entity, a single normal will be returned. Given a list of entities, a list of normals will be returned.
 *
 * For polygons, faces, and face wires the normal is calculated by taking the average of all the normals of the face triangles.
 *
 * For polylines and polyline wires, the normal is calculated by triangulating the positions, and then
 * taking the average of all the normals of the triangles.
 *
 * For edges, the normal is calculated by takingthe avery of the normals of the two vertices.
 *
 * For vertices, the normal is calculated by creating a triangle out of the two adjacent edges,
 * and then calculating the normal of the triangle.
 * (If there is only one edge, or if the two adjacent edges are colinear, the the normal of the wire is returned.)
 *
 * For positions, the normal is calculated by taking the average of the normals of all the vertices linked to the position.
 *
 * If the normal cannot be calculated, [0, 0, 0] will be returned.
 *
 * @param __model__
 * @param entities Single or list of entities. (Can be any type of entities.)
 * @param scale The scale factor for the normal vector. (This is equivalent to the length of the normal vector.)
 * @returns The normal vector [x, y, z] or a list of normal vectors.
 * @example normal1 = calc.Normal (polygon1, 1)
 * @example_info If the input is non-planar, the output vector will be an average of all normals vector of the polygon triangles.
 */
function Normal(__model__, entities, scale) {
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Normal';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
        chk.checkArgs(fn_name, 'scale', scale, [chk.isNum]);
    }
    else {
        ents_arr = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    return _normal(__model__, ents_arr, scale);
}
exports.Normal = Normal;
function _normal(__model__, ents_arr, scale) {
    if ((0, mobius_sim_1.getArrDepth)(ents_arr) === 1) {
        const ent_type = ents_arr[0];
        const index = ents_arr[1];
        if (ent_type === mobius_sim_1.EEntType.PGON) {
            const norm_vec = __model__.modeldata.geom.query.getPgonNormal(index);
            return (0, mobius_sim_1.vecMult)(norm_vec, scale);
        }
        else if (ent_type === mobius_sim_1.EEntType.PLINE) {
            const norm_vec = __model__.modeldata.geom.query.getWireNormal(__model__.modeldata.geom.nav.navPlineToWire(index));
            return (0, mobius_sim_1.vecMult)(norm_vec, scale);
        }
        else if (ent_type === mobius_sim_1.EEntType.WIRE) {
            const norm_vec = __model__.modeldata.geom.query.getWireNormal(index);
            return (0, mobius_sim_1.vecMult)(norm_vec, scale);
        }
        else if (ent_type === mobius_sim_1.EEntType.EDGE) {
            const verts_i = __model__.modeldata.geom.nav.navEdgeToVert(index);
            const norm_vecs = verts_i.map(vert_i => _vertNormal(__model__, vert_i));
            const norm_vec = (0, mobius_sim_1.vecDiv)((0, mobius_sim_1.vecSum)(norm_vecs), norm_vecs.length);
            return (0, mobius_sim_1.vecMult)(norm_vec, scale);
        }
        else if (ent_type === mobius_sim_1.EEntType.VERT) {
            const norm_vec = _vertNormal(__model__, index);
            return (0, mobius_sim_1.vecMult)(norm_vec, scale);
        }
        else if (ent_type === mobius_sim_1.EEntType.POSI) {
            const verts_i = __model__.modeldata.geom.nav.navPosiToVert(index);
            if (verts_i.length > 0) {
                const norm_vecs = verts_i.map(vert_i => _vertNormal(__model__, vert_i));
                const norm_vec = (0, mobius_sim_1.vecDiv)((0, mobius_sim_1.vecSum)(norm_vecs), norm_vecs.length);
                return (0, mobius_sim_1.vecMult)(norm_vec, scale);
            }
            return [0, 0, 0];
        }
        else if (ent_type === mobius_sim_1.EEntType.POINT) {
            return [0, 0, 0];
        }
    }
    else {
        return ents_arr.map(ent_arr => _normal(__model__, ent_arr, scale));
    }
}
exports._normal = _normal;
function _vertNormal(__model__, index) {
    let norm_vec;
    const edges_i = __model__.modeldata.geom.nav.navVertToEdge(index);
    if (edges_i.length === 1) {
        const posis0_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.EDGE, edges_i[0]);
        const posis1_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.EDGE, edges_i[1]);
        const p_mid = __model__.modeldata.attribs.posis.getPosiCoords(posis0_i[1]); // same as posis1_i[0]
        const p_a = __model__.modeldata.attribs.posis.getPosiCoords(posis0_i[0]);
        const p_b = __model__.modeldata.attribs.posis.getPosiCoords(posis1_i[1]);
        norm_vec = (0, mobius_sim_1.vecCross)((0, mobius_sim_1.vecFromTo)(p_mid, p_a), (0, mobius_sim_1.vecFromTo)(p_mid, p_b), true);
        if ((0, mobius_sim_1.vecLen)(norm_vec) > 0) {
            return norm_vec;
        }
    }
    const wire_i = __model__.modeldata.geom.nav.navEdgeToWire(edges_i[0]);
    norm_vec = __model__.modeldata.geom.query.getWireNormal(wire_i);
    return norm_vec;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm9ybWFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2NhbGMvTm9ybWFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBZXVDO0FBRXZDLG9EQUFtRDtBQUNuRCwyREFBNkM7QUFJN0MsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyQkc7QUFDSCxTQUFnQixNQUFNLENBQUMsU0FBa0IsRUFBRSxRQUFtQixFQUFFLEtBQWE7SUFDekUsSUFBSSxJQUFBLHVCQUFVLEVBQUMsUUFBUSxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3hDLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUM7SUFDOUIsSUFBSSxRQUFtQyxDQUFDO0lBQ3hDLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixRQUFRLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDNUQsQ0FBQyxlQUFFLENBQUMsSUFBSSxFQUFFLGVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQStCLENBQUM7UUFDMUQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQ3ZEO1NBQU07UUFDSCxRQUFRLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFFBQVEsQ0FBOEIsQ0FBQztLQUM5RDtJQUNELHNCQUFzQjtJQUN0QixPQUFPLE9BQU8sQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFkRCx3QkFjQztBQUNELFNBQWdCLE9BQU8sQ0FBQyxTQUFrQixFQUFFLFFBQW1DLEVBQUUsS0FBYTtJQUMx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