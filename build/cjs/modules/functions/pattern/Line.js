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
exports.Line = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const chk = __importStar(require("../../../_check_types"));
// ================================================================================================
/**
 * Creates a set of positions in a straight line pattern.
 * \n
 * The `origin` parameter specifies the centre of the straight line along which positions will be
 * generated. The origin can be specified as either a |coordinate| or a |plane|. If a coordinate
 * is given, then a plane will be automatically generated, aligned with the global XY plane.
 * \n
 * The positions will be generated along an straight line aligned with the X axis of the origin
 * plane.
 * \n
 * Returns the list of new positions.
 * \n
 * @param __model__
 * @param origin A |coordinate| or a |plane|.
 * If a coordinate is given, then the plane is assumed to be aligned with the global XY plane.
 * @param length The length of the line along which positions will be generated.
 * @returns Entities, a list of new positions.
 */
function Line(__model__, origin, length, num_positions) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Line';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'length', length, [chk.isNum]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
    }
    // --- Error Check ---
    // create the matrix one time
    let matrix;
    const origin_is_plane = (0, mobius_sim_1.getArrDepth)(origin) === 2;
    if (origin_is_plane) {
        matrix = (0, mobius_sim_1.xfromSourceTargetMatrix)(mobius_sim_1.XYPLANE, origin);
    }
    // create the positions
    const posis_i = [];
    const coords = [];
    const step = length / (num_positions - 1);
    for (let i = 0; i < num_positions; i++) {
        coords.push([-(length / 2) + i * step, 0, 0]);
    }
    for (const coord of coords) {
        let xyz = coord;
        if (origin_is_plane) {
            xyz = (0, mobius_sim_1.multMatrix)(xyz, matrix);
        }
        else { // we have a plane
            xyz = (0, mobius_sim_1.vecAdd)(xyz, origin);
        }
        const posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    // return
    return (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, posis_i);
}
exports.Line = Line;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9wYXR0ZXJuL0xpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFZdUM7QUFHdkMsMkRBQTZDO0FBSTdDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxTQUFnQixJQUFJLENBQUMsU0FBa0IsRUFBRSxNQUFtQixFQUFFLE1BQWMsRUFBRSxhQUFxQjtJQUMvRixzQkFBc0I7SUFDdEIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLE1BQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQztRQUMvQixHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNqRSxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQ3ZFO0lBQ0Qsc0JBQXNCO0lBQ3RCLDZCQUE2QjtJQUM3QixJQUFJLE1BQXFCLENBQUM7SUFDMUIsTUFBTSxlQUFlLEdBQUcsSUFBQSx3QkFBVyxFQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRCxJQUFJLGVBQWUsRUFBRTtRQUNqQixNQUFNLEdBQUcsSUFBQSxvQ0FBdUIsRUFBQyxvQkFBTyxFQUFFLE1BQWdCLENBQUMsQ0FBQztLQUMvRDtJQUNELHVCQUF1QjtJQUN2QixNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7SUFDN0IsTUFBTSxNQUFNLEdBQVcsRUFBRSxDQUFDO0lBQzFCLE1BQU0sSUFBSSxHQUFXLE1BQU0sR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNsRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakQ7SUFDRCxLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtRQUN4QixJQUFJLEdBQUcsR0FBUyxLQUFLLENBQUM7UUFDdEIsSUFBSSxlQUFlLEVBQUU7WUFDakIsR0FBRyxHQUFHLElBQUEsdUJBQVUsRUFBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDakM7YUFBTSxFQUFFLGtCQUFrQjtZQUN2QixHQUFHLEdBQUcsSUFBQSxtQkFBTSxFQUFDLEdBQUcsRUFBRSxNQUFjLENBQUMsQ0FBQztTQUNyQztRQUNELE1BQU0sTUFBTSxHQUFXLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM5RCxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM3RCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3hCO0lBQ0QsU0FBUztJQUNULE9BQU8sSUFBQSw0QkFBZSxFQUFDLHFCQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBVSxDQUFDO0FBQzVELENBQUM7QUFuQ0Qsb0JBbUNDIn0=