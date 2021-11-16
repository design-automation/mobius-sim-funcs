/**
 * The `pattern` module has functions for creating patters of positions.
 * These functions all return lists of position IDs.
 * The list may be nested, depending on which function is selected.
 * @module
 */
import * as chk from '../../_check_types';
import * as THREE from 'three';
import { XYPLANE, EEntType, idsMake, idsMakeFromIdxs, getArrDepth, vecAdd, vecDiv, vecFromTo, xfromSourceTargetMatrix, multMatrix, arrFill, arrMakeFlat } from '@design-automation/mobius-sim';
import * as VERB from '@design-automation/mobius-sim/libs/verb/verb';
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
export function Line(__model__, origin, length, num_positions) {
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
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin);
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
            xyz = multMatrix(xyz, matrix);
        }
        else { // we have a plane
            xyz = vecAdd(xyz, origin);
        }
        const posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    // return
    return idsMakeFromIdxs(EEntType.POSI, posis_i);
}
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
export function Linear(__model__, coords, close, num_positions) {
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
    const is_closed = close === _EClose.CLOSE;
    const num_pairs = is_closed ? coords.length : coords.length - 1;
    const new_xyzs = [];
    for (let i = 0; i < num_pairs; i++) {
        const xyz0 = coords[i];
        const xyz1 = coords[(i + 1) % coords.length];
        const sub_vec = vecDiv(vecFromTo(xyz0, xyz1), num_positions - 1);
        let xyz_next = xyz0;
        for (let j = 0; j < num_positions - 1; j++) {
            new_xyzs.push(xyz_next);
            xyz_next = vecAdd(xyz_next, sub_vec);
        }
    }
    if (!is_closed) {
        new_xyzs.push(coords[coords.length - 1]);
    }
    // make posis and return
    return idsMake(__model__.modeldata.funcs_make.position(new_xyzs));
}
// ================================================================================================
/**
 * Creates four positions in a rectangle pattern.
 * \n
 * The `origin` parameter specifies the centre of the rectangle for which positions will be
 * generated. The origin can be specified as either a |coordinate| or a |plane|. If a coordinate
 * is given, then a plane will be automatically generated, aligned with the global XY plane.
 * \n
 * The positions will be generated for a rectangle on the origin XY plane. So if the origin plane is
 * rotated, then the rectangle will also be rotated.
 * \n
 * The `size` parameter specifies the size of the rectangle. If only one number is given,
 * then width and length are assumed to be equal. If a list of two numbers is given,
 * then they will be interpreted as `[width, length]`.The width dimension will be in the
 * X-direction of the origin plane, and the length will be in the Y direction of the origin plane.
 * \n
 * Returns a list of new positions.
 * \n
 * @param __model__
 * @param origin A |coordinate| or a |plane|.
 * If a coordinate is given, then the plane is assumed to be aligned with the global XY plane.
 * @param size Size of rectangle. If number, assume square of that length;
 * if list of two numbers, x and y lengths respectively.
 * @returns Entities, a list of four positions.
 * @example posis = pattern.Rectangle([0,0,0], 10)
 * @example_info Creates a list of 4 coords, being the vertices of a 10 by 10 square.
 * @example `posis = pattern.Rectangle(XY, [10,20])`
 * @example_info Creates a list of 4 positions in a rectangle pattern. The rectangle has a width of
 * 10 (in the X direction) and a length of 20 (in the Y direction).
 */
export function Rectangle(__model__, origin, size) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Rectangle';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'size', size, [chk.isNum, chk.isXY]);
    }
    // --- Error Check ---
    // create the matrix one time
    let matrix;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin);
    }
    // create the positions
    const posis_i = [];
    const xy_size = (Array.isArray(size) ? size : [size, size]);
    const coords = [
        [-(xy_size[0] / 2), -(xy_size[1] / 2), 0],
        [(xy_size[0] / 2), -(xy_size[1] / 2), 0],
        [(xy_size[0] / 2), (xy_size[1] / 2), 0],
        [-(xy_size[0] / 2), (xy_size[1] / 2), 0]
    ];
    for (const coord of coords) {
        let xyz = coord;
        if (origin_is_plane) {
            xyz = multMatrix(xyz, matrix);
        }
        else { // we have a plane
            xyz = vecAdd(xyz, origin);
        }
        const posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    // return
    return idsMakeFromIdxs(EEntType.POSI, posis_i);
}
// ================================================================================================
export var _EGridMethod;
(function (_EGridMethod) {
    _EGridMethod["FLAT"] = "flat";
    _EGridMethod["COLUMNS"] = "columns";
    _EGridMethod["ROWS"] = "rows";
    _EGridMethod["QUADS"] = "quads";
})(_EGridMethod || (_EGridMethod = {}));
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
export function Grid(__model__, origin, size, num_positions, method) {
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
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin);
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
                xyz = multMatrix(xyz, matrix);
            }
            else { // we have a plane
                xyz = vecAdd(xyz, origin);
            }
            const posi_i = __model__.modeldata.geom.add.addPosi();
            __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
            posis_i.push(posi_i);
        }
    }
    // structure the grid of posis, and return
    const posis_i2 = [];
    if (method === _EGridMethod.FLAT) {
        return idsMakeFromIdxs(EEntType.POSI, posis_i);
    }
    else if (method === _EGridMethod.ROWS) {
        for (let i = 0; i < xy_num_positions[1]; i++) {
            const row = [];
            for (let j = 0; j < xy_num_positions[0]; j++) {
                const index = (i * xy_num_positions[0]) + j;
                row.push(posis_i[index]);
            }
            posis_i2.push(row);
        }
    }
    else if (method === _EGridMethod.COLUMNS) {
        for (let i = 0; i < xy_num_positions[0]; i++) {
            const col = [];
            for (let j = 0; j < xy_num_positions[1]; j++) {
                const index = (j * xy_num_positions[0]) + i;
                col.push(posis_i[index]);
            }
            posis_i2.push(col);
        }
    }
    else if (method === _EGridMethod.QUADS) {
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
    return idsMakeFromIdxs(EEntType.POSI, posis_i2);
}
// ================================================================================================
export var _EBoxMethod;
(function (_EBoxMethod) {
    _EBoxMethod["FLAT"] = "flat";
    _EBoxMethod["ROWS"] = "rows";
    _EBoxMethod["COLUMNS"] = "columns";
    _EBoxMethod["LAYERS"] = "layers";
    _EBoxMethod["QUADS"] = "quads";
})(_EBoxMethod || (_EBoxMethod = {}));
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
export function Box(__model__, origin, size, num_positions, method) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Box';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'size', size, [chk.isNum, chk.isXY, chk.isXYZ]);
    }
    // --- Error Check ---
    // create the matrix one time
    let matrix;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin);
    }
    // create params
    const xyz_size = arrFill(size, 3);
    const xyz_num_positions = arrFill(num_positions, 3);
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
                        xyz = multMatrix(xyz, matrix);
                    }
                    else { // we have a plane
                        xyz = vecAdd(xyz, origin);
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
    if (method === _EBoxMethod.FLAT) {
        const layers_posis_i = [];
        for (let k = 1; k < posis_i.length - 2; k++) {
            layers_posis_i.push(arrMakeFlat([
                posis_i[k][0],
                posis_i[k][1],
                posis_i[k][2].reverse(),
                posis_i[k][3].reverse(),
            ]));
        }
        const all_posis = arrMakeFlat([layer_bot_posis_i, layers_posis_i, layer_top_posis_i]);
        return idsMakeFromIdxs(EEntType.POSI, all_posis);
    }
    else if (method === _EBoxMethod.ROWS) {
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
        return idsMakeFromIdxs(EEntType.POSI, posis_i2);
    }
    else if (method === _EBoxMethod.COLUMNS) {
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
        return idsMakeFromIdxs(EEntType.POSI, posis_i2);
    }
    else if (method === _EBoxMethod.LAYERS) {
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
        return idsMakeFromIdxs(EEntType.POSI, posis_i2);
    }
    else if (method === _EBoxMethod.QUADS) {
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
            layers_posis_i.push(arrMakeFlat([
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
        return idsMakeFromIdxs(EEntType.POSI, posis_i2);
    }
    return [];
}
// ================================================================================================
export var _EPolyhedronMethod;
(function (_EPolyhedronMethod) {
    _EPolyhedronMethod["FLAT_TETRA"] = "flat_tetra";
    _EPolyhedronMethod["FLAT_CUBE"] = "flat_cube";
    _EPolyhedronMethod["FLAT_OCTA"] = "flat_octa";
    _EPolyhedronMethod["FLAT_ICOSA"] = "flat_icosa";
    _EPolyhedronMethod["FLAT_DODECA"] = "flat_dodeca";
    _EPolyhedronMethod["FACE_TETRA"] = "face_tetra";
    _EPolyhedronMethod["FACE_CUBE"] = "face_cube";
    _EPolyhedronMethod["FACE_OCTA"] = "face_octa";
    _EPolyhedronMethod["FACE_ICOSA"] = "face_icosa";
    _EPolyhedronMethod["FACE_DODECA"] = "face_dodeca";
})(_EPolyhedronMethod || (_EPolyhedronMethod = {}));
/**
 * Creates positions in a polyhedron pattern.
 * \n
 * The five regular polyhedrons can be generated:
 * - Tetrahedron (4 triangular faces)
 * - Cube (4 square faces)
 * - Octahedron (8 triangular faces)
 * - Icosahedron (20 triangular faces)
 * - Dodecahedron (12 pentagon faces)
 * \n
 * The `origin` parameter specifies the centre of the polyhedron for which positions will be
 * generated. The origin can be specified as either a |coordinate| or a |plane|. If a coordinate
 * is given, then a plane will be automatically generated, aligned with the global XY plane.
 * \n
 * The positions will be generated for a polyhedron aligned with the origin XY plane.
 * So if the origin plane is rotated, then the polyhedron will also be rotated.
 * \n
 * The `radius` parameter specifies the size of the polyhedron.
 * All positions that are generated are projected onto the surface of a sphere,
 * with the specified `radius`.
 * \n
 * The faces of the regular polyhedron can be further subdivided by specifying the level of
 * `detail`. (When subdivided, it will no longer be regular polyhedrons.)
 * \n
 * For tetrahedrons, octahedrons, and icosahedrons, the `detail` subdivides as follows:
 * - Detail = 0: No subdivision
 * - Detail = 1: Each triangle edge is subdivided into two edges.
 * - Detail = 2: Each triangle edge is subdivided into three edges.
 * - etc
 * \n
 * Cubes and dodecahedrons do not have triangular faces. So in these cases, the first level of
 * `detail` converts each non-triangular face into triangles by adding a position at the centre of
 * the face. The `detail` subdivides as follows:
 * - Detail= 0: No subdivision.
 * - Detail = 1: Convert non-triangular faces into triangles.
 * - Detail = 2: Each triangle edge is subdivided into two edges.
 * - Detail = 3: Each triangle edge is subdivided into three edges.
 * - etc
 * \n
 * The positions can either be returned as a flat list or as nested lists.
 * The nested lists represent the faces of the polyhedron.
 * However, note that only the positions are returned.
 * If you want to have polygon faces, you need to generate polygons from the positions.
 * \n
 * For example, calling the function with `detail = 0` and `method = 'flat_tetra'`,
 * will result in the following positions:
 * ```
 * posis = ["ps0", "ps1", "ps2", "ps3"]
 * ```
 * If you change the method to `method = 'face_tetra'`, then you will get the following nested lists.
 * ```
 * posis = [
 *     ["ps2", "ps1", "ps0"],
 *     ["ps0", "ps3", "ps2"],
 *     ["ps1", "ps3", "ps0"],
 *     ["ps2", "ps3", "ps1"]
 * ]
 * ```
 * Notice that the number of positions is the same in both cases
 * (i.e. in both cases there are 4 positions: 'ps0', 'ps1', 'ps2', 'ps3').
 * When `face_tetra` is selected selected, the positions are organised into 4 lists,
 * representing the 4 faces of the tetrahedron.
 * \n
 * The nested lists can be passed to the `make.Polygon` function in order to generated polygonal faces.
 * Here is an example:
 * \n
 * ```
 * posis = pattern.Polyhedron(XY, 10, 0, 'face_tetra')
 * pgons = make.Polygon(posis)
 * ```
 * \n
 * ![Tetrahedron with triangular faces](assets/typedoc-json/docMDimgs/polyhedron_tetra.png)
 * \n
 * @param __model__
 * @param origin A |coordinate| or a |plane|, specifying the origin of the polyhedron.
 * If a coordinate is given, then the plane is assumed to be aligned with the global XY plane.
 * @param radius The radius of the polyhedron.
 * @param detail The level of detail for the polyhedron.
 * @param method Enum: The Type of polyhedron to generate.
 * @returns Entities, a list of positions.
 * @example `posis = pattern.Polyhedron(XY, 20, 0, 'face_tetra')`
 * @example_info Creates positions in a regular tetrahedron pattern, with a radius of 20. The
 * positions are returned as nested lists, where each list contains the positions for one face.
 */
export function Polyhedron(__model__, origin, radius, detail, method) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Polyhedron';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'radius', radius, [chk.isNum]);
        chk.checkArgs(fn_name, 'detail', detail, [chk.isInt]);
        if (detail > 6) {
            throw new Error('pattern.Polyhedron: The "detail" argument is too high, the maximum is 6.');
        }
    }
    // --- Error Check ---
    // create the matrix one time
    let matrix = null;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin);
    }
    else {
        matrix = new THREE.Matrix4();
        matrix.makeTranslation(...origin);
    }
    // make polyhedron posis
    const posis_i = _polyhedron(__model__, matrix, radius, detail, method);
    return idsMakeFromIdxs(EEntType.POSI, posis_i);
}
// create the polyhedron
export function _polyhedron(__model__, matrix, radius, detail, method) {
    // create the posis
    let xyzs;
    let faces;
    switch (method) {
        case _EPolyhedronMethod.FLAT_TETRA:
        case _EPolyhedronMethod.FACE_TETRA:
            [xyzs, faces] = _polyhedronCreate(_polyhedronTetra(), radius, detail);
            break;
        case _EPolyhedronMethod.FLAT_CUBE:
        case _EPolyhedronMethod.FACE_CUBE:
            [xyzs, faces] = _polyhedronCreate(_polyhedronCube(), radius, detail);
            break;
        case _EPolyhedronMethod.FLAT_OCTA:
        case _EPolyhedronMethod.FACE_OCTA:
            [xyzs, faces] = _polyhedronCreate(_polyhedronOcta(), radius, detail);
            break;
        case _EPolyhedronMethod.FLAT_ICOSA:
        case _EPolyhedronMethod.FACE_ICOSA:
            [xyzs, faces] = _polyhedronCreate(_polyhedronIcosa(), radius, detail);
            break;
        case _EPolyhedronMethod.FLAT_DODECA:
        case _EPolyhedronMethod.FACE_DODECA:
            [xyzs, faces] = _polyhedronCreate(_polyhedronDodeca(), radius, detail);
            break;
        default:
            throw new Error('pattern.Polyhedron: method not recognised.');
    }
    // make posis
    const posis_i = [];
    for (const xyz of xyzs) {
        const posi_i = __model__.modeldata.geom.add.addPosi();
        const xyz_xform = multMatrix(xyz, matrix);
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz_xform);
        posis_i.push(posi_i);
    }
    // if the method is flat, then we are done, return the posis
    switch (method) {
        case _EPolyhedronMethod.FLAT_TETRA:
        case _EPolyhedronMethod.FLAT_CUBE:
        case _EPolyhedronMethod.FLAT_OCTA:
        case _EPolyhedronMethod.FLAT_ICOSA:
        case _EPolyhedronMethod.FLAT_DODECA:
            return posis_i;
    }
    // if we want faces, then make lists of posis for each face
    const faces_posis_i = [];
    for (const face of faces) {
        const face_posis_i = [];
        for (const i of face) {
            face_posis_i.push(posis_i[i]);
        }
        faces_posis_i.push(face_posis_i);
    }
    return faces_posis_i;
}
// Create a tetrahedron
function _polyhedronTetra() {
    // copied from threejs
    const xyzs = [
        [1, 1, 1],
        [-1, -1, 1],
        [-1, 1, -1],
        [1, -1, -1]
    ];
    const faces = [
        [2, 1, 0],
        [0, 3, 2],
        [1, 3, 0],
        [2, 3, 1]
    ];
    return [xyzs, faces];
}
// Create a cube
function _polyhedronCube() {
    const xyzs = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
    ];
    const faces = [
        [0, 1, 2, 3],
        [0, 1, 5, 4],
        [1, 2, 6, 5],
        [2, 3, 7, 6],
        [3, 0, 4, 7],
        [7, 6, 5, 4]
    ];
    return [xyzs, faces];
}
// Create a Octahedron
function _polyhedronOcta() {
    // copied from threejs
    const xyzs = [
        [1, 0, 0], [-1, 0, 0], [0, 1, 0],
        [0, -1, 0], [0, 0, 1], [0, 0, -1]
    ];
    const faces = [
        [0, 2, 4], [0, 4, 3], [0, 3, 5],
        [0, 5, 2], [1, 2, 5], [1, 5, 3],
        [1, 3, 4], [1, 4, 2]
    ];
    return [xyzs, faces];
}
// Create a Icosahedron
function _polyhedronIcosa() {
    // copied from threejs
    const t = (1 + Math.sqrt(5)) / 2;
    const xyzs = [
        [-1, t, 0], [1, t, 0], [-1, -t, 0],
        [1, -t, 0], [0, -1, t], [0, 1, t],
        [0, -1, -t], [0, 1, -t], [t, 0, -1],
        [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
    ];
    const faces = [
        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
        [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
        [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];
    return [xyzs, faces];
}
// Create a Dodecahedron
function _polyhedronDodeca() {
    // copied from threejs
    const t = (1 + Math.sqrt(5)) / 2;
    const r = 1 / t;
    const xyzs = [
        // (±1, ±1, ±1)
        [-1, -1, -1], [-1, -1, 1],
        [-1, 1, -1], [-1, 1, 1],
        [1, -1, -1], [1, -1, 1],
        [1, 1, -1], [1, 1, 1],
        // (0, ±1/φ, ±φ)
        [0, -r, -t], [0, -r, t],
        [0, r, -t], [0, r, t],
        // (±1/φ, ±φ, 0)
        [-r, -t, 0], [-r, t, 0],
        [r, -t, 0], [r, t, 0],
        // (±φ, 0, ±1/φ)
        [-t, 0, -r], [t, 0, -r],
        [-t, 0, r], [t, 0, r]
    ];
    const faces = [
        // [3, 11, 7], [3, 7, 15], [3, 15, 13],
        // [7, 19, 17], [7, 17, 6], [7, 6, 15],
        // [17, 4, 8], [17, 8, 10], [17, 10, 6],
        // [8, 0, 16], [8, 16, 2], [8, 2, 10],
        // [0, 12, 1], [0, 1, 18], [0, 18, 16],
        // [6, 10, 2], [6, 2, 13], [6, 13, 15],
        // [2, 16, 18], [2, 18, 3], [2, 3, 13],
        // [18, 1, 9], [18, 9, 11], [18, 11, 3],
        // [4, 14, 12], [4, 12, 0], [4, 0, 8],
        // [11, 9, 5], [11, 5, 19], [11, 19, 7],
        // [19, 5, 14], [19, 14, 4], [19, 4, 17],
        // [1, 12, 14], [1, 14, 5], [1, 5, 9]
        [3, 11, 7, 15, 13],
        [7, 19, 17, 6, 15],
        [17, 4, 8, 10, 6],
        [8, 0, 16, 2, 10],
        [0, 12, 1, 18, 16],
        [6, 10, 2, 13, 15],
        [2, 16, 18, 3, 13],
        [18, 1, 9, 11, 3],
        [4, 14, 12, 0, 8],
        [11, 9, 5, 19, 7],
        [19, 5, 14, 4, 17],
        [1, 12, 14, 5, 9]
    ];
    return [xyzs, faces];
}
// Subdivide and apply radius
function _polyhedronCreate(xyzs_faces, radius, detail) {
    const xyzs = xyzs_faces[0];
    const faces = xyzs_faces[1];
    // subdiv
    const [new_xyzs, new_faces] = _polyhedronSubDdiv(xyzs, faces, detail);
    // apply radius
    _polyhedronApplyRadiusXyzs(new_xyzs, radius);
    // return
    return [new_xyzs, new_faces];
}
// Subdiv all faces
function _polyhedronSubDdiv(xyzs, faces, detail) {
    if (detail === 0) {
        return [xyzs, faces];
    }
    const new_faces = [];
    for (const face of faces) {
        if (face.length > 3) {
            const mid = [0, 0, 0];
            for (const xyz_i of face) {
                mid[0] = mid[0] + xyzs[xyz_i][0];
                mid[1] = mid[1] + xyzs[xyz_i][1];
                mid[2] = mid[2] + xyzs[xyz_i][2];
            }
            mid[0] = mid[0] / face.length;
            mid[1] = mid[1] / face.length;
            mid[2] = mid[2] / face.length;
            const mid_i = xyzs.push(mid) - 1;
            for (let i = 0; i < face.length; i++) {
                const tri_face = [mid_i, face[i], face[(i + 1) % face.length]];
                const subdiv_faces = _polyhedronSubDdivTriFace(xyzs, tri_face, detail - 1);
                subdiv_faces.map(subdiv_face => new_faces.push(subdiv_face));
            }
        }
        else {
            const subdiv_faces = _polyhedronSubDdivTriFace(xyzs, face, detail);
            subdiv_faces.map(subdiv_face => new_faces.push(subdiv_face));
        }
    }
    // merge xyzs
    const new_xyzs = _polyhedronMergeXyzs(xyzs, new_faces);
    // return
    return [new_xyzs, new_faces];
}
// Subdivide one face
function _polyhedronSubDdivTriFace(xyzs, face, detail) {
    const a = xyzs[face[0]];
    const b = xyzs[face[1]];
    const c = xyzs[face[2]];
    const cols = detail + 1;
    // we use this multidimensional array as a data structure for creating the subdivision
    const xyzs_i = [];
    // construct all of the xyzs for this subdivision
    for (let i = 0; i <= cols; i++) {
        xyzs_i[i] = [];
        const aj = _polyhedronLerp(a, c, i / cols);
        const bj = _polyhedronLerp(b, c, i / cols);
        const rows = cols - i;
        for (let j = 0; j <= rows; j++) {
            let xyz_i;
            if (j === 0 && i === cols) {
                xyz_i = xyzs.push(aj) - 1;
            }
            else {
                xyz_i = xyzs.push(_polyhedronLerp(aj, bj, j / rows)) - 1;
            }
            xyzs_i[i][j] = xyz_i;
        }
    }
    // construct all of the tri faces
    const new_faces = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < 2 * (cols - i) - 1; j++) {
            const new_face = [];
            const k = Math.floor(j / 2);
            if (j % 2 === 0) {
                new_face.push(xyzs_i[i][k + 1]);
                new_face.push(xyzs_i[i + 1][k]);
                new_face.push(xyzs_i[i][k]);
            }
            else {
                new_face.push(xyzs_i[i][k + 1]);
                new_face.push(xyzs_i[i + 1][k + 1]);
                new_face.push(xyzs_i[i + 1][k]);
            }
            new_faces.push(new_face);
        }
    }
    return new_faces;
}
function _polyhedronMergeXyzs(xyzs, faces) {
    // iterate over the xyzs
    const xyz_i_old_new_map = new Map();
    const new_xyzs = [];
    for (let i = 0; i < xyzs.length; i++) {
        if (!xyz_i_old_new_map.has(i)) {
            const new_i = new_xyzs.push(xyzs[i]) - 1;
            xyz_i_old_new_map.set(i, new_i);
            for (let j = i + 1; j < xyzs.length; j++) {
                const dist_sq = Math.abs(xyzs[i][0] - xyzs[j][0]) +
                    Math.abs(xyzs[i][1] - xyzs[j][1]) +
                    Math.abs(xyzs[i][2] - xyzs[j][2]);
                if (dist_sq < 1e-6) {
                    xyz_i_old_new_map.set(j, new_i);
                }
            }
        }
    }
    // update indexes
    for (const face of faces) {
        for (let i = 0; i < face.length; i++) {
            face[i] = xyz_i_old_new_map.get(face[i]);
        }
    }
    // return
    return new_xyzs;
}
function _polyhedronApplyRadiusXyzs(xyzs, radius) {
    // iterate over the xyzs and apply the radius to each xyz
    for (const xyz of xyzs) {
        const scale = radius / Math.sqrt(xyz[0] * xyz[0] + xyz[1] * xyz[1] + xyz[2] * xyz[2]);
        xyz[0] = xyz[0] * scale;
        xyz[1] = xyz[1] * scale;
        xyz[2] = xyz[2] * scale;
    }
}
function _polyhedronLerp(a, b, alpha) {
    // interpolate between two points
    return [
        a[0] + (b[0] - a[0]) * alpha,
        a[1] + (b[1] - a[1]) * alpha,
        a[2] + (b[2] - a[2]) * alpha
    ];
}
// ================================================================================================
/**
 * Creates positions in an arc or circle pattern.
 * \n
 * The `origin` parameter specifies the centre of the polyhedron for which positions will be
 * generated. The origin can be specified as either a |coordinate| or a |plane|. If a coordinate
 * is given, then a plane will be automatically generated, aligned with the global XY plane.
 * \n
 * The positions will be generated for an arc aligned with the origin XY plane.
 * So if the origin plane is rotated, then the rotated will also be rotated.
 * \n
 * The `radius` parameter specifies the size of the arc.
 * \n
 * The `num_positions` parameter specifies the total number of positions to be generated on the arc.
 * \n
 * The `arc_angle` specifies the angle of the arc, in radians. Angles start at thet X-axis of the
 * origin plane and move in a counter-clockwise direction. Two angles are needed to define an arc,
 * a `start_angle` and `end_angle`. The angles may be positive or negative, and may be
 * greater than `2*PI` or smaller than `-2*PI`.
 * \n
 * Positions will always be generated in sequence, from the start angle towards the end angle.
 * - If the start angle is smaller than the end angle, then the positions will be generated in
 * counter-clockwise order.
 * - If the start angle is greater than the end angle, then the positions will be generated in
 * clockwise order.
 * \n
 * The angle may either be given as a single number, as a list of two numbers, or as `null`:
 * - If the angle is given as a single number, then the arc angles will be ser to be
 * `[0, end_angle]`. This means that the start of the arc will coincide with the X-axis
 * of the origin plane.
 * - If the angle is given as a list of two numbers, then they will be set to be
 * `[start_angle, end_angle]`.
 * - If the angle is set to `null`, then the arc angles will be set to be
 * `[0, 2*PI]` In addition, duplicate positions at start and end of the arc are
 * automatically removed.
 * \n
 * Note that setting the arc angle to null is not the same as setting it to `2*PI`
 * When setting the arc angle to `2*PI`, you will get a duplicate positions at start and end
 * of the arc.
 * \n
 * @param __model__
 * @param origin A |coordinate| or a |plane|, specifying the centre of the arc.
 * If a coordinate is given, then the plane is assumed to be aligned with the global XY plane.
 * @param radius Radius of circle as a number.
 * @param num_positions Number of positions to be distributed equally along the arc.
 * @param arc_angle Angle of arc (in radians). If a list of two numbers is given, then the first
 * number specifies the arc start angle, and the second number the arc end angle, i.e.
 * `[arc_start_angle, arc_end_angle]`. If a single numer is specified, then the angles will be set
 * to `[0, arc_end_angle]`. If `null` is given, then the angles will be set to `[0, 2 * PI]`.
 * @returns Entities, a list of positions.
 * @example `posis = pattern.Arc([0,0,0], 10, 12, PI)`
 * @example_info Creates a list of 12 positions distributed equally along a semicircle of radius 10
 * starting at an angle of 0 and ending at an angle of 180 degrees, rotating in a counter-clockwise
 * direction.
 */
export function Arc(__model__, origin, radius, num_positions, arc_angle) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Arc';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'radius', radius, [chk.isNum]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
        chk.checkArgs(fn_name, 'arc_angle', arc_angle, [chk.isNum, chk.isNumL, chk.isNull]);
        if (Array.isArray(arc_angle)) {
            if (arc_angle.length !== 2) {
                throw new Error('pattern.Arc: If the "arc_angle" is given as a list of numbers, \
                then the list must contain exactly two angles (in radians).');
            }
        }
    }
    // --- Error Check ---
    // create the matrix one time
    let matrix;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin);
    }
    // get the two arc angles
    let arc_angles;
    if (arc_angle === null) {
        arc_angles = [0, 2 * Math.PI];
    }
    else if (Array.isArray(arc_angle)) {
        arc_angles = arc_angle;
    }
    else {
        arc_angles = [0, arc_angle];
    }
    // calc the rot angle per position
    let rot;
    const div = arc_angle === null ? num_positions : num_positions - 1;
    if (arc_angles[0] < arc_angles[1]) {
        rot = (arc_angles[1] - arc_angles[0]) / div; // CCW
    }
    else {
        rot = (arc_angles[0] - arc_angles[1]) / -div; // CW
    }
    // create positions
    const posis_i = [];
    for (let i = 0; i < num_positions; i++) {
        const angle = arc_angles[0] + (rot * i);
        const x = (Math.cos(angle) * radius);
        const y = (Math.sin(angle) * radius);
        let xyz = [x, y, 0];
        if (origin_is_plane) {
            xyz = multMatrix(xyz, matrix);
        }
        else { // we have a plane
            xyz = vecAdd(xyz, origin);
        }
        const posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    // return the list of posis
    return idsMakeFromIdxs(EEntType.POSI, posis_i);
}
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
export function Bezier(__model__, coords, num_positions) {
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
    return idsMakeFromIdxs(EEntType.POSI, posis_i);
}
// ================================================================================================
export var _EClose;
(function (_EClose) {
    _EClose["OPEN"] = "open";
    _EClose["CLOSE"] = "close";
})(_EClose || (_EClose = {}));
/**
 * Creates positions in an NURBS curve pattern, defined a list of coordinates.
 * \n
 * The positions are created along the curve according to the parametric equation of the curve.
 * This means that the euclidean distance between the positions will not necessarily be equal.
 * For open BSpline curves, the positions at the start and end tend to be closer together.
 * \n
 * The `coords` parameter gives the list of |coordinates| for generating the curve.
 * - If the curve is open, then the first and last coordinates in the list are the start and end
 * positions of the curve. The middle coordinates act as the control points for controlling the
 * shape of the curve.
 * - If the curve is closed, then all coordinates act as the control points for controlling the
 * shape of the curve.
 * \n
 * The degree (between 2 and 5) of the curve defines how smooth the curve is.
 * Quadratic: degree = 2
 * Cubic: degree = 3
 * Quartic: degree = 4.
 * \n
 * The number of coordinates should be at least one greater than the degree of the curve.
 * \n
 * The `num_positions` parameter specifies the total number of positions to be generated.
 * \n
 * @param __model__
 * @param coords A list of |coordinates| (must be at least three).
 * @param degree The degree of the curve, and integer between 2 and 5.
 * @param close Enum, 'close' or 'open'
 * @param num_positions Number of positions to be distributed along the Bezier.
 * @returns Entities, a list of positions.
 * @example `posis = pattern.Nurbs([[0,0,0], [10,0,50], [20,0,50], [30,0,0]], 3, 'open', 20)`
 * @example_info Creates a list of 20 positions distributed along a Nurbs curve.
 */
export function Nurbs(__model__, coords, degree, close, num_positions) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Nurbs';
        chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
        if (coords.length < 3) {
            throw new Error(fn_name + ': "coords" should be a list of at least three XYZ coords.');
        }
        if (degree < 2 || degree > 5) {
            throw new Error(fn_name + ': "degree" should be between 2 and 5.');
        }
        if (degree > (coords.length - 1)) {
            throw new Error(fn_name + ': a curve of degree ' + degree + ' requires at least ' +
                (degree + 1) + ' coords.');
        }
    }
    // --- Error Check ---
    const closed = close === _EClose.CLOSE;
    // create the curve using the VERBS library
    const offset = degree + 1;
    const coords2 = coords.slice();
    if (closed) {
        const start = coords2.slice(0, offset);
        const end = coords2.slice(coords2.length - offset, coords2.length);
        coords2.splice(0, 0, ...end);
        coords2.splice(coords2.length, 0, ...start);
    }
    const weights = coords2.forEach(_ => 1);
    const num_knots = coords2.length + degree + 1;
    const knots = [];
    const uniform_knots = num_knots - (2 * degree);
    for (let i = 0; i < degree; i++) {
        knots.push(0);
    }
    for (let i = 0; i < uniform_knots; i++) {
        knots.push(i / (uniform_knots - 1));
    }
    for (let i = 0; i < degree; i++) {
        knots.push(1);
    }
    const curve_verb = new VERB.geom.NurbsCurve.byKnotsControlPointsWeights(degree, knots, coords2, weights);
    // Testing VERB closed curve
    // const k: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // const c: number[][] = [[0, 0, 0], [10, 0, 0], [10, 10, 0], [0, 10, 0], [0, 0, 0], [10, 0, 0]];
    // const w: number[] = [1, 1, 1, 1, 1, 1];
    // const curve_verb2 = new VERB.geom.NurbsCurve.byKnotsControlPointsWeights(2, k, c, w);
    // This gives an error: Error:
    // Invalid knot vector format!
    // Should begin with degree + 1 repeats and end with degree + 1 repeats!
    const posis_i = nurbsToPosis(__model__, curve_verb, degree, closed, num_positions, coords[0]);
    // return the list of posis
    return idsMakeFromIdxs(EEntType.POSI, posis_i);
}
// ================================================================================================
// Enums for CurveCatRom()
export var _ECurveCatRomType;
(function (_ECurveCatRomType) {
    _ECurveCatRomType["CENTRIPETAL"] = "centripetal";
    _ECurveCatRomType["CHORDAL"] = "chordal";
    _ECurveCatRomType["CATMULLROM"] = "catmullrom";
})(_ECurveCatRomType || (_ECurveCatRomType = {}));
/**
 * Creates positions in an spline pattern. Returns a list of new positions.
 * It is a type of interpolating spline (a curve that goes through its control points).
 * \n
 * The input is a list of XYZ coordinates. These act as the control points for creating the Spline curve.
 * The positions that get generated will be divided equally between the control points.
 * For example, if you define 4 control points for a closed spline, and set 'num_positions' to be 40,
 * then you will get 8 positions between each pair of control points,
 * irrespective of the distance between the control points.
 * \n
 * The spline curve can be created in three ways: 'centripetal', 'chordal', or 'catmullrom'.
 * \n
 * For more information, see the wikipedia article:
 * <a href="https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline">Catmull–Rom spline</a>.
 * \n
 * <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Catmull-Rom_examples_with_parameters..png"
 * alt="Curve types" width="100">
 * \n
 * @param __model__
 * @param coords A list of |coordinates|.
 * @param type Enum, the type of interpolation algorithm.
 * @param tension Curve tension, between 0 and 1. This only has an effect when the 'type' is set
 * to 'catmullrom'.
 * @param close Enum, 'open' or 'close'.
 * @param num_positions Number of positions to be distributed distributed along the spline.
 * @returns Entities, a list of positions.
 * @example `posis = pattern.Spline([[0,0,0], [10,0,50], [20,0,0], [30,0,20], [40,0,10]],
 * 'chordal','close', 0.2, 50)`
 * @example_info Creates a list of 50 positions distributed along a spline curve pattern.
 */
export function Interpolate(__model__, coords, type, tension, close, num_positions) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Interpolate';
        chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL]);
        chk.checkArgs(fn_name, 'tension', tension, [chk.isNum01]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
        if (coords.length < 3) {
            throw new Error(fn_name + ': "coords" should be a list of at least three XYZ coords.');
        }
    }
    // --- Error Check ---
    const closed_tjs = close === _EClose.CLOSE;
    const num_positions_tjs = closed_tjs ? num_positions : num_positions - 1;
    if (tension === 0) {
        tension = 1e-16;
    } // There seems to be a bug in threejs, so this is a fix
    // Check we have enough coords
    // create the curve
    const coords_tjs = coords.map(coord => new THREE.Vector3(coord[0], coord[1], coord[2]));
    const curve_tjs = new THREE.CatmullRomCurve3(coords_tjs, closed_tjs, type, tension);
    const points_tjs = curve_tjs.getPoints(num_positions_tjs);
    // create positions
    const posis_i = [];
    for (let i = 0; i < num_positions; i++) {
        const posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, points_tjs[i].toArray());
        posis_i.push(posi_i);
    }
    // return the list of posis
    return idsMakeFromIdxs(EEntType.POSI, posis_i);
}
// ================================================================================================
function nurbsToPosis(__model__, curve_verb, degree, closed, num_positions, start) {
    // create positions
    const posis_i = [];
    const [offset_start, offset_end] = { 2: [5, 3], 3: [6, 5], 4: [8, 6], 5: [9, 8] }[degree];
    const knots = curve_verb.knots();
    const u_start = knots[offset_start];
    const u_end = knots[knots.length - offset_end - 1];
    const u_range = u_end - u_start;
    // trying split
    // const [c1, c2] = curve_verb.split(u_start);
    // const [c3, c4] = c2.split(u_end);
    // const curve_length_samples_verb: any[] = c3.divideByEqualArcLength(num_positions - 1);
    // const u_values_verb: number[] = curve_length_samples_verb.map( cls => cls.u as number );
    let min_dist_to_start = Infinity;
    let closest_to_start = -1;
    for (let i = 0; i < num_positions; i++) {
        let u;
        if (closed) {
            u = u_start + ((i / num_positions) * u_range);
        }
        else {
            u = i / (num_positions - 1);
        }
        const xyz = curve_verb.point(u);
        // xyz[2] = i / 10;
        const posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
        const dist = Math.abs(start[0] - xyz[0]) +
            Math.abs(start[1] - xyz[1]) +
            Math.abs(start[2] - xyz[2]);
        if (dist < min_dist_to_start) {
            min_dist_to_start = dist;
            closest_to_start = i;
        }
    }
    const posis_i_start = posis_i.slice(closest_to_start, posis_i.length);
    const posis_i_end = posis_i.slice(0, closest_to_start);
    const posis_i_sorted = posis_i_start.concat(posis_i_end);
    // return the list of posis
    return posis_i_sorted;
}
// // ================================================================================================
// /**
//  * Creates positions in an NURBS curve pattern, by iterpolating between the coordinates.
//  * \n
//  * The positions are created along the curve according to the parametric equation of the curve.
//  * This means that the euclidean distance between the positions will not necessarily be equal.
//  * For open BSpline curves, the positions at the start and end tend to be closer together.
//  * \n
//  * The `coords` parameter gives the list of |coordinates| for generating the curve.
//  * - If the curve is open, then the first and last coordinates in the list are the start and end
//  * positions of the curve. The middle coordinates act as the control points for controlling the
//  * shape of the curve.
//  * - If the curve is closed, then all coordinates act as the control points for controlling the
//  * shape of the curve.
//  * \n
//  * The degree (between 2 and 5) of the curve defines how smooth the curve is.
//  * Quadratic: degree = 2
//  * Cubic: degree = 3
//  * Quartic: degree = 4.
//  * \n
//  * The number of coordinates should be at least one greater than the degree of the curve.
//  * \n
//  * The `num_positions` parameter specifies the total number of positions to be generated.
//  * \n
//  * @param __model__
//  * @param coords A list of |coordinates| (must be at least three).
//  * @param degree The degree of the curve, and integer between 2 and 5.
//  * @param close Enum, 'close' or 'open'
//  * @param num_positions Number of positions to be distributed along the Bezier.
//  * @returns Entities, a list of positions.
//  * @example posis = pattern.Nurbs([[0,0,0], [10,0,50], [20,0,10]], 20)
//  * @example_info Creates a list of 20 positions distributed along a Bezier curve pattern.
//  */
// export function _Interpolate(__model__: GIModel, coords: Txyz[], degree: number, close: _EClose, num_positions: number): TId[] {
//     // --- Error Check ---
//     if (__model__.debug) {
//         const fn_name = 'pattern._Interpolate';
//         chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL]);
//         chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
//         // --- Error Check ---
//         if (coords.length < 3) {
//             throw new Error(fn_name + ': "coords" should be a list of at least three XYZ coords.');
//         }
//         if (degree < 2 || degree > 5) {
//             throw new Error(fn_name + ': "degree" should be between 2 and 5.');
//         }
//         if (degree > (coords.length - 1)) {
//             throw new Error(fn_name + ': a curve of degree ' + degree + ' requires at least ' + (degree + 1) + ' coords.');
//         }
//     }
//     const closed: boolean = close === _EClose.CLOSE;
//     // create the curve using the VERBS library
//     const offset = degree + 1;
//     const coords2: Txyz[] = coords.slice();
//     if (closed) {
//         const start: Txyz[] = coords2.slice(0, offset);
//         const end: Txyz[] = coords2.slice(coords2.length - offset, coords2.length);
//         coords2.splice(0, 0, ...end);
//         coords2.splice(coords2.length, 0, ...start);
//     }
//     const curve_verb = new VERB.geom.NurbsCurve.byPoints(coords2, degree);
//     // return the list of posis
//     const posis_i: number[] = nurbsToPosis(__model__, curve_verb, degree, closed, num_positions, coords[0]);
//     return idsMakeFromIdxs(EEntType.POSI, posis_i) as TId[];
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0dGVybi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGVzL2Jhc2ljL3BhdHRlcm4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFHSCxPQUFPLEtBQUssR0FBRyxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sS0FBSyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBRS9CLE9BQU8sRUFBZ0IsT0FBTyxFQUFPLFFBQVEsRUFBTyxPQUFPLEVBQUUsZUFBZSxFQUN4RSxXQUFXLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQVUsdUJBQXVCLEVBQ3ZFLFVBQVUsRUFBVyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDckYsT0FBTyxLQUFLLElBQUksTUFBTSw4Q0FBOEMsQ0FBQztBQUVyRSxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBQ0gsTUFBTSxVQUFVLElBQUksQ0FBQyxTQUFrQixFQUFFLE1BQW1CLEVBQUUsTUFBYyxFQUFFLGFBQXFCO0lBQy9GLHNCQUFzQjtJQUN0QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDO1FBQy9CLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN0RCxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDdkU7SUFDRCxzQkFBc0I7SUFD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QUFFLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3hDLENBQUM7SUFDRixNQUFNLEtBQUssR0FBZTtRQUN0QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUN6RCxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMs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