import {
    EEntType,
    getArrDepth,
    GIModel,
    idsMakeFromIdxs,
    multMatrix,
    TId,
    TPlane,
    Txyz,
    vecAdd,
    xfromSourceTargetMatrix,
    XYPLANE,
} from '@design-automation/mobius-sim';
import * as THREE from 'three';

import * as chk from '../../../_check_types';
import { _EGridMethod } from './_enum';



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
export function Grid(__model__: GIModel, origin: Txyz|TPlane, size: number|[number, number],
        num_positions: number|[number, number], method: _EGridMethod): TId[]|TId[][] {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Grid';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'size', size, [chk.isNum, chk.isXY]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt, chk.isXYInt]);
    }
    // --- Error Check ---
    // create the matrix one time
    let matrix: THREE.Matrix4;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin as  TPlane);
    }
    // create the positions
    const posis_i: number[] = [];
    const xy_size: [number, number] =
        (Array.isArray(size) ? size : [size, size]) as [number, number];
    const xy_num_positions: [number, number] =
        (Array.isArray(num_positions) ?
        num_positions : [num_positions, num_positions]) as [number, number];
    const x_offset: number = xy_size[0] / (xy_num_positions[0] - 1);
    const y_offset: number = xy_size[1] / (xy_num_positions[1] - 1);
    for (let i = 0; i < xy_num_positions[1]; i++) {
        const y: number = (i * y_offset) - (xy_size[1] / 2);
        for (let j = 0; j < xy_num_positions[0]; j++) {
            const x: number = (j * x_offset) - (xy_size[0] / 2);
            let xyz: Txyz = [x, y, 0];
            if (origin_is_plane) {
                xyz = multMatrix(xyz, matrix);
            } else { // we have a plane
                xyz = vecAdd(xyz, origin as Txyz);
            }
            const posi_i: number = __model__.modeldata.geom.add.addPosi();
            __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
            posis_i.push(posi_i);
        }
    }
    // structure the grid of posis, and return
    const posis_i2: number[][] = [];
    if (method === _EGridMethod.FLAT) {
        return idsMakeFromIdxs(EEntType.POSI, posis_i) as TId[];
    } else if (method === _EGridMethod.ROWS) {
        for (let i = 0; i < xy_num_positions[1]; i++) {
            const row: number[] = [];
            for (let j = 0; j < xy_num_positions[0]; j++) {
                const index: number = (i * xy_num_positions[0]) + j;
                row.push( posis_i[index] );
            }
            posis_i2.push(row);
        }
    } else if (method === _EGridMethod.COLUMNS) {
        for (let i = 0; i < xy_num_positions[0]; i++) {
            const col: number[] = [];
            for (let j = 0; j < xy_num_positions[1]; j++) {
                const index: number = (j * xy_num_positions[0]) + i;
                col.push( posis_i[index] );
            }
            posis_i2.push(col);
        }
    } else if (method === _EGridMethod.QUADS) {
        for (let i = 0; i < xy_num_positions[1] - 1; i++) {
            for (let j = 0; j < xy_num_positions[0] - 1; j++) {
                const index: number = (i * xy_num_positions[0]) + j;
                const square: number[] = [
                    posis_i[index],
                    posis_i[index + 1],
                    posis_i[index + xy_num_positions[0] + 1],
                    posis_i[index + xy_num_positions[0]]
                ];
                posis_i2.push( square );
            }
        }
    }
    return idsMakeFromIdxs(EEntType.POSI, posis_i2) as TId[][];
}
