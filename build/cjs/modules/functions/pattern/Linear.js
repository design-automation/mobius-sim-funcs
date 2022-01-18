"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.Linear = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const chk = __importStar(require("../../../_check_types"));
const _enum_1 = require("./_enum");
// ================================================================================================
/**
 * Creates a set of positions by linear interpolation between the specified |coordinates|.
 * \n
 * The `num_positions` parameter specifies the number of positions to be generated between
 * each pair of coordinates.
 * \n
 * The `method` parameter specifies whether to close the loop of coordinates. If set to `close`,
 * then positions are also generated between the last and first coordinates in the list.
 * \n
 * For the `num_positions` parameters:
 * - `num_positions = 0`: No positions are generated.
 * - `num_positions = 1`: No new coordinates are calculated.
 * If `close` is true, then positions are generate at all coordinates in the input list.
 * If `close` is false, then positions are generate at all coordinates in the input list
 * except the last coordinate (which is ignored).
 * - `num_positions = 2`: No new coordinates are calculated. Positions are generate at all
 * coordinates in the input list. (The `close` parameter has no effect.)
 * - `num_positions = 3`: For each pair of coordinates, one additional coordinate
 * is calculated by linear interpolation.
 * - `num_positions = 4`: For each pair of coordinates, two additional coordinates
 * are calculated by linear interpolation.
 * - etc
 * \n
 * For example, lets consider a case where you specify three coordinates, set the method to `close`
 * and set `num_positions` to 4. In this case, there will be 3 pairs of coordinates, `[0, 1]`,
 * `[1, 2]` and `[2, 0]`. For each pair of coordinates, 2 new calculations are calculated.
 * This results in a total of 9 coordinates. So 9 positions will be generated.
 * \n
 * Returns the list of new position IDs.
 * \n
 * @param __model__
 * @param coords A list of |coordinates|.
 * @param close Enum, 'open' or 'close'.
 * @param The number of positions to generate.
 * @returns Entities, a list of new position IDs.
 * @example posis = pattern.Linear([[0,0,0], [10,0,0]], false, 3)
 * @example_info Generates 3 positions, located at [0,0,0], [5,0,0], and [10,0,0].
 * @example `posis = pattern.Linear([[0,0,0], [10,0,0], [10,10,0]], 'close', 4)`
 * @example_info Generates 9 positions. Two new coordinates are calculated between each pair of
 * input positions.
 */
function Linear(__model__, coords, close, num_positions) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Linear';
        chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
    }
    // --- Error Check ---
    if (num_positions === 0) {
        return [];
    }
    const is_closed = close === _enum_1._EClose.CLOSE;
    const num_pairs = is_closed ? coords.length : coords.length - 1;
    const new_xyzs = [];
    for (let i = 0; i < num_pairs; i++) {
        const xyz0 = coords[i];
        const xyz1 = coords[(i + 1) % coords.length];
        const sub_vec = (0, mobius_sim_1.vecDiv)((0, mobius_sim_1.vecFromTo)(xyz0, xyz1), num_positions - 1);
        let xyz_next = xyz0;
        for (let j = 0; j < num_positions - 1; j++) {
            new_xyzs.push(xyz_next);
            xyz_next = (0, mobius_sim_1.vecAdd)(xyz_next, sub_vec);
        }
    }
    if (!is_closed) {
        new_xyzs.push(coords[coords.length - 1]);
    }
    // make posis and return
    return (0, mobius_sim_1.idsMake)(__model__.modeldata.funcs_make.position(new_xyzs));
}
exports.Linear = Linear;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGluZWFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL3BhdHRlcm4vTGluZWFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFBdUc7QUFFdkcsMkRBQTZDO0FBQzdDLG1DQUFrQztBQUlsQyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Q0c7QUFDSCxTQUFnQixNQUFNLENBQUMsU0FBa0IsRUFBRSxNQUFjLEVBQUUsS0FBYyxFQUNqRSxhQUFxQjtJQUN6QixzQkFBc0I7SUFDdEIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLE1BQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDO1FBQ2pDLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN2RCxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDdkU7SUFDRCxzQkFBc0I7SUFDdEIsSUFBSSxhQUFhLEtBQUssQ0FBQyxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUN2QyxNQUFNLFNBQVMsR0FBWSxLQUFLLEtBQUssZUFBTyxDQUFDLEtBQUssQ0FBQztJQUNuRCxNQUFNLFNBQVMsR0FBVyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3hFLE1BQU0sUUFBUSxHQUFXLEVBQUUsQ0FBQztJQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2hDLE1BQU0sSUFBSSxHQUFTLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixNQUFNLElBQUksR0FBUyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25ELE1BQU0sT0FBTyxHQUFTLElBQUEsbUJBQU0sRUFBQyxJQUFBLHNCQUFTLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2RSxJQUFJLFFBQVEsR0FBUyxJQUFJLENBQUM7UUFDMUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QixRQUFRLEdBQUcsSUFBQSxtQkFBTSxFQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUN4QztLQUNKO0lBQ0QsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUFFO0lBQzdELHdCQUF3QjtJQUN4QixPQUFPLElBQUEsb0JBQU8sRUFBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQVUsQ0FBQztBQUMvRSxDQUFDO0FBMUJELHdCQTBCQyJ9