"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
// ================================================================================================
/**
 * Returns a vector along an edge, from the start position to the end position.
 * The vector is not normalized.
 *
 * Given a single edge, a single vector will be returned. Given a list of edges, a list of vectors will be returned.
 *
 * Given any entity that has edges (collection, polygons, polylines, faces, and wires),
 * a list of edges will be extracted, and a list of vectors will be returned.
 *
 * @param __model__
 * @param entities Single or list of edges, or any entity from which edges can be extracted.
 * @returns The vector [x, y, z] or a list of vectors.
 */
function Vector(__model__, entities) {
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Vector';
    let ents_arrs;
    if (__model__.debug) {
        ents_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.PGON, mobius_sim_1.EEntType.PLINE, mobius_sim_1.EEntType.WIRE, mobius_sim_1.EEntType.EDGE]);
    }
    else {
        ents_arrs = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    return _vector(__model__, ents_arrs);
}
exports.Vector = Vector;
function _vector(__model__, ents_arrs) {
    if ((0, mobius_sim_1.getArrDepth)(ents_arrs) === 1) {
        const [ent_type, index] = ents_arrs;
        if (ent_type === mobius_sim_1.EEntType.EDGE) {
            const verts_i = __model__.modeldata.geom.nav.navAnyToVert(ent_type, index);
            const start = __model__.modeldata.attribs.posis.getVertCoords(verts_i[0]);
            const end = __model__.modeldata.attribs.posis.getVertCoords(verts_i[1]);
            // if (!start || !end) { console.log(">>>>", verts_i, start, end, __model__.modeldata.geom._geom_maps); }
            return (0, mobius_sim_1.vecSub)(end, start);
        }
        else {
            const edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, index);
            const edges_arrs = edges_i.map(edge_i => [mobius_sim_1.EEntType.EDGE, edge_i]);
            return edges_arrs.map(edges_arr => _vector(__model__, edges_arr));
        }
    }
    else {
        const vectors_arrs = ents_arrs.map(ents_arr => _vector(__model__, ents_arr));
        const all_vectors = [];
        for (const vectors_arr of vectors_arrs) {
            if ((0, mobius_sim_1.getArrDepth)(vectors_arr) === 1) {
                all_vectors.push(vectors_arr);
            }
            else {
                for (const vector_arr of vectors_arr) {
                    all_vectors.push(vector_arr);
                }
            }
        }
        return all_vectors;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2NhbGMvVmVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhEQVV1QztBQUV2QyxvREFBbUQ7QUFHbkQsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILFNBQWdCLE1BQU0sQ0FBQyxTQUFrQixFQUFFLFFBQW1CO0lBQzFELElBQUksSUFBQSx1QkFBVSxFQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUN4QyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDO0lBQzlCLElBQUksU0FBb0MsQ0FBQztJQUN6QyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsU0FBUyxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQzdELENBQUMsZUFBRSxDQUFDLElBQUksRUFBRSxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQ3BCLENBQUMscUJBQVEsQ0FBQyxJQUFJLEVBQUUscUJBQVEsQ0FBQyxLQUFLLEVBQUUscUJBQVEsQ0FBQyxJQUFJLEVBQUUscUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBOEIsQ0FBQztLQUMvRjtTQUFNO1FBQ0gsU0FBUyxHQUFHLElBQUEscUJBQVEsRUFBQyxRQUFRLENBQThCLENBQUM7S0FDL0Q7SUFDRCxzQkFBc0I7SUFDdEIsT0FBTyxPQUFPLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFkRCx3QkFjQztBQUNELFNBQVMsT0FBTyxDQUFDLFNBQWtCLEVBQUUsU0FBb0M7SUFDckUsSUFBSSxJQUFBLHdCQUFXLEVBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQzlCLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEdBQXVCLFNBQXdCLENBQUM7UUFDdkUsSUFBSSxRQUFRLEtBQUsscUJBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDNUIsTUFBTSxPQUFPLEdBQWEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDckYsTUFBTSxLQUFLLEdBQVMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRixNQUFNLEdBQUcsR0FBUyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlFLHlHQUF5RztZQUN6RyxPQUFPLElBQUEsbUJBQU0sRUFBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDN0I7YUFBTTtZQUNILE1BQU0sT0FBTyxHQUFhLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JGLE1BQU0sVUFBVSxHQUFrQixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxxQkFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQXVCLENBQUMsQ0FBQztZQUN2RyxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFZLENBQUM7U0FDakY7S0FDSjtTQUFNO1FBQ0gsTUFBTSxZQUFZLEdBQ2IsU0FBMkIsQ0FBQyxHQUFHLENBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFxQixDQUFDO1FBQ3BHLE1BQU0sV0FBVyxHQUFXLEVBQUUsQ0FBQztRQUMvQixLQUFLLE1BQU0sV0FBVyxJQUFJLFlBQVksRUFBRTtZQUNwQyxJQUFJLElBQUEsd0JBQVcsRUFBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2hDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBbUIsQ0FBQyxDQUFDO2FBQ3pDO2lCQUFNO2dCQUNILEtBQUssTUFBTSxVQUFVLElBQUksV0FBVyxFQUFFO29CQUNsQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQWtCLENBQUMsQ0FBQztpQkFDeEM7YUFDSjtTQUNKO1FBQ0QsT0FBTyxXQUFXLENBQUM7S0FDdEI7QUFDTCxDQUFDIn0=