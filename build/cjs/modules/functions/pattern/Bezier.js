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
exports.Bezier = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const THREE = __importStar(require("three"));
const chk = __importStar(require("../../../_check_types"));
// ================================================================================================
/**
 * Creates positions in an Bezier curve pattern, defined by a list of coordinates.
 * \n
 * The Bezier is created as either a qadratic or cubic Bezier. It is always an open curve.
 * \n
 * The positions are created along the curve at equal parameter values.
 * This means that the euclidean distance between the positions will not necessarily be equal.
 * \n
 * For the quadratic Bezier, three coordinates are required.
 * For the cubic Bezier, four coordinates are required.
 * \n
 * The `coords` parameter gives the list of |coordinates|
 * (three coords for quadratics, four coords for cubics).
 * The first and last coordinates in the list are the start and end positions of the curve.
 * The middle coordinates act as the control points for controlling the shape of the curve.
 * \n
 * The `num_positions` parameter specifies the total number of positions to be generated.
 * \n
 * For more information, see the wikipedia article:
 * <a href="https://en.wikipedia.org/wiki/B%C3%A9zier_curve">B%C3%A9zier_curve</a>.
 * \n
 * @param __model__
 * @param origin A |coordinate| or a |plane| (three coords for quadratics, four coords for cubics).
 * If a coordinate is given, then the plane is assumed to be aligned with the global XY plane. .
 * @param num_positions Number of positions to be distributed along the Bezier.
 * @returns Entities, a list of positions.
 * @example `posis = pattern.Bezier([[0,0,0], [10,0,50], [20,0,0]], 20)`
 * @example_info Creates a list of 20 positions distributed along a Bezier curve.
 */
function Bezier(__model__, coords, num_positions) {
    // --- Error Check ---
    const fn_name = 'pattern.Bezier';
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
    }
    // --- Error Check ---
    // create the curve
    const coords_tjs = coords.map(coord => new THREE.Vector3(coord[0], coord[1], coord[2]));
    let points_tjs = [];
    let curve_tjs = null;
    if (coords.length === 4) {
        curve_tjs =
            new THREE.CubicBezierCurve3(coords_tjs[0], coords_tjs[1], coords_tjs[2], coords_tjs[3]);
        points_tjs = curve_tjs.getPoints(num_positions - 1);
    }
    else if (coords.length === 3) {
        curve_tjs = new THREE.QuadraticBezierCurve3(coords_tjs[0], coords_tjs[1], coords_tjs[2]);
        points_tjs = curve_tjs.getPoints(num_positions - 1);
    }
    else {
        throw new Error(fn_name +
            ': "coords" should be a list of either three or four XYZ coords.');
    }
    // create positions
    const posis_i = [];
    for (let i = 0; i < num_positions; i++) {
        const posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, points_tjs[i].toArray());
        posis_i.push(posi_i);
    }
    // return the list of posis
    return (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, posis_i);
}
exports.Bezier = Bezier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmV6aWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL3BhdHRlcm4vQmV6aWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBQThGO0FBQzlGLDZDQUErQjtBQUUvQiwyREFBNkM7QUFJN0MsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEJHO0FBQ0gsU0FBZ0IsTUFBTSxDQUFDLFNBQWtCLEVBQUUsTUFBYyxFQUFFLGFBQXFCO0lBQzVFLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQztJQUNqQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUN2RTtJQUNELHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsTUFBTSxVQUFVLEdBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekUsSUFBSSxVQUFVLEdBQW9CLEVBQUUsQ0FBQztJQUNyQyxJQUFJLFNBQVMsR0FBd0QsSUFBSSxDQUFDO0lBQzFFLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDckIsU0FBUztZQUNMLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVGLFVBQVUsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQztLQUN2RDtTQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDNUIsU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekYsVUFBVSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ3ZEO1NBQU07UUFDSCxNQUFNLElBQUksS0FBSyxDQUFFLE9BQU87WUFDcEIsaUVBQWlFLENBQUMsQ0FBQztLQUMxRTtJQUNELG1CQUFtQjtJQUNuQixNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7SUFDN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNwQyxNQUFNLE1BQU0sR0FBVyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDOUQsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBVSxDQUFDLENBQUM7UUFDekYsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN4QjtJQUNELDJCQUEyQjtJQUMzQixPQUFPLElBQUEsNEJBQWUsRUFBQyxxQkFBUSxDQUFDLElBQUksRUFBRSxPQUFPLENBQVUsQ0FBQztBQUM1RCxDQUFDO0FBakNELHdCQWlDQyJ9