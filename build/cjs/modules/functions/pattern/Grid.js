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
exports.Grid = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const chk = __importStar(require("../../../_check_types"));
const _enum_1 = require("./_enum");
// ================================================================================================
/**
 * Creates positions in a grid pattern.
 * \n
 * The `origin` parameter specifies the centre of the grid for which positions will be
 * generated. The origin can be specified as either a |coordinate| or a |plane|. If a coordinate
 * is given, then a plane will be automatically generated, aligned with the global XY plane.
 * \n
 * The positions will be generated for a grid on the origin XY plane. So if the origin plane is
 * rotated, then the grid will also be rotated.
 * \n
 * The `size` parameter specifies the size of the grid.
 * - If only one number is given, then width and length are assumed to be equal.
 * - If a list of two numbers is given, then they will be interpreted as `[width, length]`.
 * \n
 * The width dimension will be in the X-direction of the origin plane, and the length will be in
 * the Y direction of the origin plane.
 * \n
 * The `num_positions` parameter specifies the number of columns and rows of positions in the grid.
 * - If only one number is given, then the grid is assumed to have equal number columns and rows.
 * - If a list of two numbers is given, then they will be interpreted as `[columns, rows]`.
 * \n
 * The `columns` will be parallel to the Y-direction of the origin plane,
 * and the `rows` will be parallel to the X-direction of the origin plane.
 * \n
 * For example, consider the following function call:
 * `posis = pattern.Grid(XY, [10, 20], [3, 5], 'flat')`
 * This will generate the following grid:
 * \n
 * ![An example of pattern.Grid](assets/typedoc-json/docMDimgs/pattern_grid.png)
 * \n
 * The positions can either be returned as a flat list or as nested lists.
 * For the nested lists, three options are available:
 * - `columns`: Each nested list represents a column of positions.
 * - `rows`: Each nested list represents a row of positions.
 * - `quads`: Each nested list represents four positions, forming a quadrilateral. Neighbouring
 * quadrilaterals share positions.
 * \n
 * Below are the varying results when calling the function with the method set to
 * `flat`, `columns`, `rows` and `quads`:
 * \n
 * `posis = pattern.Grid(XY, [10,20], [2,3], 'flat')`
 * ```
 * posis = ["ps0", "ps1", "ps2", "ps3", "ps4", "ps5"]
 * ```
 * \n
 * `posis = pattern.Grid(XY, [10,20], [2,3], 'columns')`
 * ```
 * posis = [
 *     ["ps0", "ps2", "ps4"],
 *     ["ps1", "ps3", "ps5"]
 * ]
 * ```
 * \n
 * `posis = pattern.Grid(XY, [10,20], [2,3], 'rows')`
 * ```
 * posis = [
 *     ["ps0", "ps1"],
 *     ["ps2", "ps3"],
 *     ["ps4", "ps5"]
 * ]
 * ```
 * \n
 * `posis = pattern.Grid(XY, [10,20], [2,3], 'quads')`
 * ```
 * posis = [
 *     ["ps0", "ps1", "ps3", "ps2"],
 *     ["ps2", "ps3", "ps5", "ps4"]
 * ]
 * ```
 * \n
 * When the method is set to `columns` or `rows`, polylines can be generated as follows:
 * ```
 * posis = pattern.Grid(XY, [10,20], [2,3], 'rows')
 * plines = make.Polyline(posis, 'open')
 * ```
 * When the method is set to quads, polygons can be generated as follows:
 * ```
 * posis = pattern.Grid(XY, [10,20], [2,3], 'quads')
 * pgons = make.Polygon(posis)
 * ```
 * \n
 * @param __model__
 * @param origin A |coordinate| or a |plane|.
 * If a coordinate is given, then the plane is assumed to be aligned with the global XY plane.
 * @param size The width and length of grid.
 * If a single number is given, then the width and length are assumed to be equal.
 * If a list of two numbers is given, then they will be interpreted as `[width, length]`.
 * @param num_positions Number of columns and rows of positions in the grid.
 * If a single number is given, then the number of columns and rows are assumed to be equal.
 * If a list of two numbers is given, then they will be interpreted as `[columns, rows]`.
 * @param method Enum, define the way the coords will be return as lists.
 * @returns Entities, a list of positions, or a list of lists of positions
 * (depending on the 'method' setting).
 * @example posis = pattern.Grid([0,0,0], 10, 3, 'flat')
 * @example_info Creates a list of 9 positions on a 3x3 square grid with a size of 10.
 * @example `posis = pattern.Grid([0,0,0], [10,20], [3,4], 'flat')`
 * @example_info Creates a list of 12 positions on a 3x4 grid. The grid as a width of 10
 * and a length of 20. The positions are returned as a flat list.
*/
function Grid(__model__, origin, size, num_positions, method) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Grid';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'size', size, [chk.isNum, chk.isXY]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt, chk.isXYInt]);
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
    const xy_size = (Array.isArray(size) ? size : [size, size]);
    const xy_num_positions = (Array.isArray(num_positions) ?
        num_positions : [num_positions, num_positions]);
    const x_offset = xy_size[0] / (xy_num_positions[0] - 1);
    const y_offset = xy_size[1] / (xy_num_positions[1] - 1);
    for (let i = 0; i < xy_num_positions[1]; i++) {
        const y = (i * y_offset) - (xy_size[1] / 2);
        for (let j = 0; j < xy_num_positions[0]; j++) {
            const x = (j * x_offset) - (xy_size[0] / 2);
            let xyz = [x, y, 0];
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
    }
    // structure the grid of posis, and return
    const posis_i2 = [];
    if (method === _enum_1._EGridMethod.FLAT) {
        return (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, posis_i);
    }
    else if (method === _enum_1._EGridMethod.ROWS) {
        for (let i = 0; i < xy_num_positions[1]; i++) {
            const row = [];
            for (let j = 0; j < xy_num_positions[0]; j++) {
                const index = (i * xy_num_positions[0]) + j;
                row.push(posis_i[index]);
            }
            posis_i2.push(row);
        }
    }
    else if (method === _enum_1._EGridMethod.COLUMNS) {
        for (let i = 0; i < xy_num_positions[0]; i++) {
            const col = [];
            for (let j = 0; j < xy_num_positions[1]; j++) {
                const index = (j * xy_num_positions[0]) + i;
                col.push(posis_i[index]);
            }
            posis_i2.push(col);
        }
    }
    else if (method === _enum_1._EGridMethod.QUADS) {
        for (let i = 0; i < xy_num_positions[1] - 1; i++) {
            for (let j = 0; j < xy_num_positions[0] - 1; j++) {
                const index = (i * xy_num_positions[0]) + j;
                const square = [
                    posis_i[index],
                    posis_i[index + 1],
                    posis_i[index + xy_num_positions[0] + 1],
                    posis_i[index + xy_num_positions[0]]
                ];
                posis_i2.push(square);
            }
        }
    }
    return (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, posis_i2);
}
exports.Grid = Grid;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9wYXR0ZXJuL0dyaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFZdUM7QUFHdkMsMkRBQTZDO0FBQzdDLG1DQUF1QztBQUl2QyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBa0dFO0FBQ0YsU0FBZ0IsSUFBSSxDQUFDLFNBQWtCLEVBQUUsTUFBbUIsRUFBRSxJQUE2QixFQUNuRixhQUFzQyxFQUFFLE1BQW9CO0lBQ2hFLHNCQUFzQjtJQUN0QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDO1FBQy9CLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzVELEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQ3BGO0lBQ0Qsc0JBQXNCO0lBQ3RCLDZCQUE2QjtJQUM3QixJQUFJLE1BQXFCLENBQUM7SUFDMUIsTUFBTSxlQUFlLEdBQUcsSUFBQSx3QkFBVyxFQUFDLE1BQU0sQ0FB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