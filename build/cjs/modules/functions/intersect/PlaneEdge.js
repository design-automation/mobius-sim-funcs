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
exports.PlaneEdge = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const THREE = __importStar(require("three"));
const _check_ids_1 = require("../../../_check_ids");
const chk = __importStar(require("../../../_check_types"));
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
function PlaneEdge(__model__, plane, entities) {
    // --- Error Check ---
    const fn_name = 'intersect.PlaneEdge';
    let ents_arr;
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'plane', plane, [chk.isPln]);
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.EDGE, mobius_sim_1.EEntType.WIRE, mobius_sim_1.EEntType.PLINE, mobius_sim_1.EEntType.PGON, mobius_sim_1.EEntType.COLL]);
    }
    else {
        ents_arr = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    // create the threejs entity and calc intersections
    const plane_normal = (0, mobius_sim_1.vecCross)(plane[1], plane[2]);
    const plane_tjs = new THREE.Plane();
    plane_tjs.setFromNormalAndCoplanarPoint(new THREE.Vector3(...plane_normal), new THREE.Vector3(...plane[0]));
    return _intersectPlane(__model__, ents_arr, plane_tjs);
}
exports.PlaneEdge = PlaneEdge;
/**
 * Recursive intersect
 * @param __model__
 * @param ents_arr
 * @param plane_tjs
 */
function _intersectPlane(__model__, ents_arr, plane_tjs) {
    if ((0, mobius_sim_1.getArrDepth)(ents_arr) === 1) {
        const [ent_type, ent_i] = ents_arr;
        if (ent_type === mobius_sim_1.EEntType.EDGE) {
            return _intersectPlaneEdge(__model__, ent_i, plane_tjs);
        }
        else if (ent_type < mobius_sim_1.EEntType.EDGE) {
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
    const wire_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.WIRE, wire_i);
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
    const edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.EDGE, edge_i);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxhbmVFZGdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2ludGVyc2VjdC9QbGFuZUVkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFXdUM7QUFDdkMsNkNBQStCO0FBRS9CLG9EQUFtRDtBQUNuRCwyREFBNkM7QUFJN0MsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsU0FBZ0IsU0FBUyxDQUFDLFNBQWtCLEVBQUUsS0FBa0IsRUFBRSxRQUFtQjtJQUNqRixzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcscUJBQXFCLENBQUM7SUFDdEMsSUFBSSxRQUFtQyxDQUFDO0lBQ3hDLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEQsUUFBUSxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQ3hELENBQUMsZUFBRSxDQUFDLElBQUksRUFBRSxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQ3BCLENBQUMscUJBQVEsQ0FBQyxJQUFJLEVBQUUscUJBQVEsQ0FBQyxJQUFJLEVBQUUscUJBQVEsQ0FBQyxLQUFLLEVBQUUscUJBQVEsQ0FBQyxJQUFJLEVBQUUscUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBOEIsQ0FBQztLQUNsSDtTQUFNO1FBQ0gsUUFBUSxHQUFHLElBQUEscUJBQVEsRUFBQyxRQUFRLENBQThCLENBQUM7S0FDOUQ7SUFDRCxzQkFBc0I7SUFDdEIsbURBQW1EO0lBQ25ELE1BQU0sWUFBWSxHQUFTLElBQUEscUJBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsTUFBTSxTQUFTLEdBQWdCLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pELFNBQVMsQ0FBQyw2QkFBNkIsQ0FBRSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxZQUFZLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDO0lBQzlHLE9BQU8sZUFBZSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFFM0QsQ0FBQztBQW5CRCw4QkFtQkM7QUFDRDs7Ozs7R0FLRztBQUNILFNBQVMsZUFBZSxDQUFDLFNBQWtCLEVBQUUsUUFBbUMsRUFBRSxTQUFzQjtJQUNwRyxJQUFJLElBQUEsd0JBQVcsRUFBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDN0IsTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsR0FBdUIsUUFBdUIsQ0FBQztRQUN0RSxJQUFJLFFBQVEsS0FBSyxxQkFBUSxDQUFDLElBQUksRUFBRTtZQUM1QixPQUFPLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDM0Q7YUFBTSxJQUFJLFFBQVEsR0FBRyxxQkFBUSxDQUFDLElBQUksRUFBRTtZQUNqQyxNQUFNLE9BQU8sR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNyRixNQUFNLGdCQUFnQixHQUFXLEVBQUUsQ0FBQztZQUNwQyxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtnQkFDMUIsTUFBTSxlQUFlLEdBQVcsbUJBQW1CLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDbEYsS0FBSyxNQUFNLGNBQWMsSUFBSSxlQUFlLEVBQUU7b0JBQzFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztpQkFDekM7YUFDSjtZQUNELE9BQU8sZ0JBQWdCLENBQUM7U0FDM0I7YUFBTTtZQUNILE1BQU0sT0FBTyxHQUFhLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JGLE1BQU0sZ0JBQWdCLEdBQVcsRUFBRSxDQUFDO1lBQ3BDLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO2dCQUMxQixNQUFNLGVBQWUsR0FBVyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUNsRixLQUFLLE1BQU0sY0FBYyxJQUFJLGVBQWUsRUFBRTtvQkFDMUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUN6QzthQUNKO1lBQ0QsT0FBTyxnQkFBZ0IsQ0FBQztTQUMzQjtLQUNKO1NBQU07UUFDSCxNQUFNLGNBQWMsR0FBVyxFQUFFLENBQUM7UUFDbEMsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUU7WUFDNUIsTUFBTSxVQUFVLEdBQVcsZUFBZSxDQUFDLFNBQVMsRUFBRSxPQUFzQixFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3pGLEtBQUssTUFBTSxTQUFTLElBQUksVUFBVSxFQUFFO2dCQUNoQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ2xDO1NBQ0o7UUFDRCxPQUFPLGNBQXdCLENBQUM7S0FDbkM7QUFDTCxDQUFDO0FBQ0Q7Ozs7O0dBS0c7QUFDSCxTQUFTLG1CQUFtQixDQUFDLFNBQWtCLEVBQUUsTUFBYyxFQUFFLFNBQXNCO0lBQ25GLE1BQU0sVUFBVSxHQUFXLEVBQUUsQ0FBQztJQUM5QixNQUFNLFlBQVksR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLHFCQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hHLHFDQUFxQztJQUNyQyxNQUFNLFNBQVMsR0FBb0IsRUFBRSxDQUFDO0lBQ3RDLEtBQUssTUFBTSxXQUFXLElBQUksWUFBWSxFQUFFO1FBQ3BDLE1BQU0sR0FBRyxHQUFTLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDL0UsTUFBTSxRQUFRLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzFELFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDNUI7SUFDRCxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDckQsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQztJQUNELHFFQUFxRTtJQUNyRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDM0MsTUFBTSxRQUFRLEdBQWdCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sU0FBUyxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyRCxNQUFNLE1BQU0sR0FBa0IsU0FBUyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDM0UsSUFBSSxNQUFNLEtBQUssU0FBUyxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7WUFDekMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1RDtLQUNKO0lBQ0QsT0FBTyxVQUFVLENBQUM7QUFDdEIsQ0FBQztBQUNEOzs7OztHQUtHO0FBQ0gsU0FBUyxtQkFBbUIsQ0FBQyxTQUFrQixFQUFFLE1BQWMsRUFBRSxTQUFzQjtJQUNuRixNQUFNLFlBQVksR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLHFCQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hHLHFDQUFxQztJQUNyQyxNQUFNLElBQUksR0FBUyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BGLE1BQU0sSUFBSSxHQUFTLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEYsTUFBTSxTQUFTLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzVELE1BQU0sU0FBUyxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM1RCxxRUFBcUU7SUFDckUsTUFBTSxRQUFRLEdBQWdCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDcEUsTUFBTSxTQUFTLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3JELE1BQU0sTUFBTSxHQUFrQixTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzRSxJQUFJLE1BQU0sS0FBSyxTQUFTLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtRQUN6QyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEQ7SUFDRCxPQUFPLEVBQUUsQ0FBQztBQUNkLENBQUMifQ==