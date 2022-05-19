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
exports.Box = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const chk = __importStar(require("../../../_check_types"));
const _enum_1 = require("./_enum");
// ================================================================================================
/**
 * Creates positions in a box pattern. Positions are only generated on the outer surface of the box.
 * No positions are generated in the interior of the box.
 * \n
 * The `origin` parameter specifies the centre of the box for which positions will be
 * generated. The origin can be specified as either a |coordinate| or a |plane|. If a coordinate
 * is given, then a plane will be automatically generated, aligned with the global XY plane.
 * \n
 * The positions will be generated for a box aligned with the origin XY plane.
 * So if the origin plane is rotated, then the box will also be rotated.
 * \n
 * The `size` parameter specifies the size of the box.
 * - If only one number is given, then the width, length, and height are assumed to be equal.
 * - If a list of two numbers is given, then they will be interpreted as `[width, length]`,
 * and the height will be the same as the length.
 * - If a list of three numbers is given, then they will be interpreted as `[width, length, height]`.
 * \n
 * The width dimension will be in the X-direction of the origin plane,
 * the length in the Y direction, and the height in the Z-direction.
 * \n
 * The `num_positions` parameter specifies the number of columns, rows, and layers of positions
 * in the box.
 * - If only one number is given, then the box is assumed to have equal number columns, rows,
 * and layers.
 * - If a list of two numbers is given, then they will be interpreted as `[columns, rows]`,
 * and the number of layers will be the same as the rows.
 * - If a list of three numbers is given, then they will be interpreted as `[columns, rows, layers]`.
 * \n
 * The `columns` will be parallel to the Y-direction of the origin plane,
 * and the `rows` will be parallel to the X-direction of the origin plane.
 * The layers are stacked up in the Z-direction of the origin plane.
 * \n
 * For example, consider the following function call:
 * `posis = pattern.Box(XY, [10,20,30], [2,3,2], 'flat')`
 * This will generate the following box:
 * \n
 * ![An example of pattern.Box](assets/typedoc-json/docMDimgs/pattern_box.png)
 * \n
 * Below are the varying results when calling the function with the method set to
 * `flat`, `columns`, `rows` `layers` and `quads`:
 * \n
 * `posis = pattern.Box(XY, [10,20,30], [2,3,2], 'flat')`
 * ```
 * posis = ["ps0", "ps1", "ps2", "ps3", "ps4", "ps5", "ps6", "ps7", "ps8", "ps9", "ps10", "ps11"]
 * ```
 * \n
 * `posis = pattern.Grid(XY, [10,20,30], [2,3,2], 'columns')`
 * ```
 * posis = [
 *     ["ps0", "ps1", "ps6", "ps7"],
 *     ["ps2", "ps3", "ps8", "ps9"],
 *     ["ps4", "ps5", "ps10", "ps11"]
 * ]
 * ```
 * \n
 * `posis = pattern.Grid(XY, [10,20,30], [2,3,2], 'rows')`
 * ```
 * posis = [
 *     ["ps0", "ps2", "ps4", "ps6", "ps8", "ps10"],
 *     ["ps1", "ps3", "ps5", "ps7", "ps9", "ps11"]
 * ]
 * ```
 * \n
 * `posis = pattern.Grid(XY, [10,20,30], [2,3,2], 'layers')`
 * ```
 * posis = [
 *     ["ps0", "ps1", "ps2", "ps3", "ps4", "ps5"],
 *     ["ps6", "ps7", "ps8", "ps9", "ps10", "ps11"]
 * ]
 * ```
 * \n
* `posis = pattern.Grid(XY, [10,20,30], [2,3,2], 'quads')`
 * ```
 * posis = [
 *     ["ps0", "ps2", "ps3", "ps1"],
 *     ["ps2", "ps4", "ps5", "ps3"],
 *     ["ps0", "ps1", "ps7", "ps6"],
 *     ["ps1", "ps3", "ps9", "ps7"],
 *     ["ps3", "ps5", "ps11", "ps9"],
 *     ["ps5", "ps4", "ps10", "ps11"],
 *     ["ps4", "ps2", "ps8", "ps10"],
 *     ["ps2", "ps0", "ps6", "ps8"],
 *     ["ps6", "ps7", "ps9", "ps8"],
 *     ["ps8", "ps9", "ps11", "ps10"]
 * ]
 * ```
 * \n
 * When the method is set to `columns` or `rows`, polylines can be generated as follows:
 * ```
 * posis = pattern.Box(XY, [10,20,30], [2,3,2], 'rows')
 * plines = make.Polyline(posis, 'open')
 * ```
 * When the method is set to quads, polygons on the box surface can be generated as follows:
 * ```
 * posis = pattern.Grid(XY, [10,20,30], [2,3,2], 'quads')
 * pgons = make.Polygon(posis)
 * ```
 * \n
 * @param __model__
 * @param origin A |coordinate| or a |plane|.
 * If a coordinate is given, then the plane is assumed to be aligned with the global XY plane.
 * @param size The width, length, and height of the box.
 * If a single number is given, then the width, length, and height are assumed to be equal.
 * If a list of two numbers is given, then they will be interpreted as `[width, length]`,
 * and the height is assumed to be equal to the length.
 * If a list of three numbers is given, then they will be interpreted as `[width, length, height]`.
 * @param num_positions Number of columns, rows, and layers of positions in the box.
 * If a single number is given, then the number of columns, rows, and layers are assumed to be equal.
 * If a list of two numbers is given, then they will be interpreted as `[columns, rows]`,
 * and the number of layers is assumed to be equal to the number of rows.
 * If a list of three numbers is given, then they will be interpreted as `[columns, rows, layers]`.
 * @param method Enum, define the way the coords will be return as lists.
 * @returns Entities, a list of positions, or a list of lists of positions
 * (depending on the 'method' setting).
 * @example `posis = pattern.Box(XY, [10,20,30], [3,4,5], 'quads')`
 * @example_info Returns positions in a box pattern. The size of the box is 10 wide (in X direction)
 * 20 long (Y direction), and 30 high (Z direction). The box has 3 columns, 4 rows, and 5 layers.
 * This results in a total of 12 (i.e. 3 x 4) positions in the top and bottom layers, and 10
 * positions in the middle two layers. The positions are returned as nested lists, where each
 * sub-list contains positions for one quadrilateral.
 */
function Box(__model__, origin, size, num_positions, method) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Box';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'size', size, [chk.isNum, chk.isXY, chk.isXYZ]);
    }
    // --- Error Check ---
    // create the matrix one time
    let matrix;
    const origin_is_plane = (0, mobius_sim_1.getArrDepth)(origin) === 2;
    if (origin_is_plane) {
        matrix = (0, mobius_sim_1.xfromSourceTargetMatrix)(mobius_sim_1.XYPLANE, origin);
    }
    // create params
    const xyz_size = (0, mobius_sim_1.arrFill)(size, 3);
    const xyz_num_positions = (0, mobius_sim_1.arrFill)(num_positions, 3);
    // create the positions
    const layer_top_posis_i = [];
    const layer_bot_posis_i = [];
    const posis_i = [];
    const x_offset = xyz_size[0] / (xyz_num_positions[0] - 1);
    const y_offset = xyz_size[1] / (xyz_num_positions[1] - 1);
    const z_offset = xyz_size[2] / (xyz_num_positions[2] - 1);
    for (let k = 0; k < xyz_num_positions[2]; k++) {
        const layer_perim_x0_posis_i = [];
        const layer_perim_y0_posis_i = [];
        const layer_perim_x1_posis_i = [];
        const layer_perim_y1_posis_i = [];
        const z = (k * z_offset) - (xyz_size[2] / 2);
        for (let i = 0; i < xyz_num_positions[1]; i++) {
            const y = (i * y_offset) - (xyz_size[1] / 2);
            for (let j = 0; j < xyz_num_positions[0]; j++) {
                const x = (j * x_offset) - (xyz_size[0] / 2);
                let create_perim_layer = false;
                // perimeter layers
                if (i === 0 || i === xyz_num_positions[1] - 1) {
                    create_perim_layer = true;
                }
                if (j === 0 || j === xyz_num_positions[0] - 1) {
                    create_perim_layer = true;
                }
                // top layer
                let create_top_layer = false;
                if (k === xyz_num_positions[2] - 1) {
                    create_top_layer = true;
                }
                // bot layer
                let create_bot_layer = false;
                if (k === 0) {
                    create_bot_layer = true;
                }
                // create posis
                if (create_perim_layer || create_top_layer || create_bot_layer) {
                    let xyz = [x, y, z];
                    if (origin_is_plane) {
                        xyz = (0, mobius_sim_1.multMatrix)(xyz, matrix);
                    }
                    else { // we have a plane
                        xyz = (0, mobius_sim_1.vecAdd)(xyz, origin);
                    }
                    const posi_i = __model__.modeldata.geom.add.addPosi();
                    __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
                    if (create_perim_layer) {
                        if (i === 0) {
                            layer_perim_x0_posis_i.push(posi_i);
                        }
                        else if (i === xyz_num_positions[1] - 1) {
                            layer_perim_x1_posis_i.push(posi_i);
                        }
                        else if (j === xyz_num_positions[0] - 1) {
                            layer_perim_y0_posis_i.push(posi_i);
                        }
                        else if (j === 0) {
                            layer_perim_y1_posis_i.push(posi_i);
                        }
                    }
                    if (create_top_layer) {
                        layer_top_posis_i.push(posi_i);
                    }
                    if (create_bot_layer) {
                        layer_bot_posis_i.push(posi_i);
                    }
                }
            }
        }
        posis_i.push([
            layer_perim_x0_posis_i, layer_perim_y0_posis_i,
            layer_perim_x1_posis_i, layer_perim_y1_posis_i
        ]);
    }
    // structure the grid of posis, and return
    if (method === _enum_1._EBoxMethod.FLAT) {
        const layers_posis_i = [];
        for (let k = 1; k < posis_i.length - 2; k++) {
            layers_posis_i.push((0, mobius_sim_1.arrMakeFlat)([
                posis_i[k][0],
                posis_i[k][1],
                posis_i[k][2].reverse(),
                posis_i[k][3].reverse(),
            ]));
        }
        const all_posis = (0, mobius_sim_1.arrMakeFlat)([layer_bot_posis_i, layers_posis_i, layer_top_posis_i]);
        return (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, all_posis);
    }
    else if (method === _enum_1._EBoxMethod.ROWS) {
        // rows that are parallel to x axis
        const posis_i2 = [];
        for (let i = 0; i < xyz_num_positions[1]; i++) {
            const row = [];
            // bottom
            for (let j = 0; j < xyz_num_positions[0]; j++) {
                const index = (i * xyz_num_positions[0]) + j;
                row.push(layer_bot_posis_i[index]);
            }
            // mid
            if (posis_i.length > 2) {
                for (let k = 1; k < posis_i.length - 1; k++) {
                    if (i === 0) {
                        row.push(...posis_i[k][0]);
                    }
                    else if (i === xyz_num_positions[1] - 1) {
                        row.push(...posis_i[k][2]);
                    }
                    else {
                        row.push(posis_i[k][3][i - 1]);
                        row.push(posis_i[k][1][i - 1]);
                    }
                }
            }
            // top
            for (let j = 0; j < xyz_num_positions[0]; j++) {
                const index = (i * xyz_num_positions[0]) + j;
                row.push(layer_top_posis_i[index]);
            }
            posis_i2.push(row);
        }
        return (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, posis_i2);
    }
    else if (method === _enum_1._EBoxMethod.COLUMNS) {
        // columns that are parallel to the y axis
        // i is moving along x axis
        const posis_i2 = [];
        for (let i = 0; i < xyz_num_positions[0]; i++) {
            const col = [];
            // bot
            for (let j = 0; j < xyz_num_positions[1]; j++) {
                const index = (j * xyz_num_positions[0]) + i;
                col.push(layer_bot_posis_i[index]);
            }
            // mid
            if (posis_i.length > 2) {
                for (let k = 1; k < posis_i.length - 1; k++) {
                    if (i === 0) {
                        col.push(posis_i[k][0][0]);
                        col.push(...posis_i[k][3]);
                        col.push(posis_i[k][2][0]);
                    }
                    else if (i === xyz_num_positions[1] - 1) {
                        col.push(posis_i[k][0][xyz_num_positions[0] - 1]);
                        col.push(...posis_i[k][1]);
                        col.push(posis_i[k][0][xyz_num_positions[0] - 1]);
                    }
                    else {
                        col.push(posis_i[k][0][i]);
                        col.push(posis_i[k][2][i]);
                    }
                }
            }
            // top
            for (let j = 0; j < xyz_num_positions[1]; j++) {
                const index = (j * xyz_num_positions[0]) + i;
                col.push(layer_top_posis_i[index]);
            }
            posis_i2.push(col);
        }
        return (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, posis_i2);
    }
    else if (method === _enum_1._EBoxMethod.LAYERS) {
        // layers that are parallel to the xy plane
        // i is moving along z axis
        // bottom
        const posis_i2 = [layer_bot_posis_i];
        // mid
        for (let i = 1; i < xyz_num_positions[2] - 1; i++) {
            if (posis_i.length > 2) {
                const layer = posis_i[i][0].slice();
                for (let j = 0; j < xyz_num_positions[1] - 2; j++) {
                    layer.push(posis_i[i][3][j]);
                    layer.push(posis_i[i][1][j]);
                }
                layer.push(...posis_i[i][2]);
                posis_i2.push(layer);
            }
        }
        // top
        posis_i2.push(layer_top_posis_i);
        return (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, posis_i2);
    }
    else if (method === _enum_1._EBoxMethod.QUADS) {
        const posis_i2 = [];
        // bottom
        for (let i = 0; i < xyz_num_positions[1] - 1; i++) {
            for (let j = 0; j < xyz_num_positions[0] - 1; j++) {
                const index = (i * xyz_num_positions[0]) + j;
                const quad = [
                    layer_bot_posis_i[index],
                    layer_bot_posis_i[index + xyz_num_positions[0]],
                    layer_bot_posis_i[index + xyz_num_positions[0] + 1],
                    layer_bot_posis_i[index + 1]
                ];
                posis_i2.push(quad);
            }
        }
        // mid
        const layers_posis_i = [];
        for (let k = 0; k < posis_i.length; k++) {
            layers_posis_i.push((0, mobius_sim_1.arrMakeFlat)([
                posis_i[k][0],
                posis_i[k][1],
                posis_i[k][2].reverse(),
                posis_i[k][3].reverse(),
            ]));
        }
        for (let k = 0; k < layers_posis_i.length - 1; k++) {
            const layer_posis_i = layers_posis_i[k];
            const next_layer_posis_i = layers_posis_i[k + 1];
            for (let i = 0; i < layer_posis_i.length; i++) {
                const index = i;
                const next_index = i === layer_posis_i.length - 1 ? 0 : i + 1;
                const quad = [
                    layer_posis_i[index],
                    layer_posis_i[next_index],
                    next_layer_posis_i[next_index],
                    next_layer_posis_i[index]
                ];
                posis_i2.push(quad);
            }
        }
        // top
        for (let i = 0; i < xyz_num_positions[1] - 1; i++) {
            for (let j = 0; j < xyz_num_positions[0] - 1; j++) {
                const index = (i * xyz_num_positions[0]) + j;
                const quad = [
                    layer_top_posis_i[index],
                    layer_top_posis_i[index + 1],
                    layer_top_posis_i[index + xyz_num_positions[0] + 1],
                    layer_top_posis_i[index + xyz_num_positions[0]]
                ];
                posis_i2.push(quad);
            }
        }
        return (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, posis_i2);
    }
    return [];
}
exports.Box = Box;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL3BhdHRlcm4vQm94LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFjdUM7QUFHdkMsMkRBQTZDO0FBQzdDLG1DQUFzQztBQUl0QyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdIRztBQUNILFNBQWdCLEdBQUcsQ0FBQyxTQUFrQixFQUFFLE1BQXFCLEVBQ3pELElBQTBELEVBQzFELGFBQW1FLEVBQ25FLE1BQW1CO0lBQ25CLHNCQUFzQjtJQUN0QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDO1FBQzlCLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDMUU7SUFDRCxzQkFBc0I7SUFDdEIsNkJBQTZCO0lBQzdCLElBQUksTUFBcUIsQ0FBQztJQUMxQixNQUFNLGVBQWUsR0FBRyxJQUFBLHdCQUFXLEVBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xELElBQUksZUFBZSxFQUFFO1FBQ2pCLE1BQU0sR0FBRyxJQUFBLG9DQUF1QixFQUFDLG9C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