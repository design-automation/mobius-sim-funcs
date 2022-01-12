import {
    arrFill,
    arrMakeFlat,
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
import { _EBoxMethod } from './_enum';



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
export function Box(__model__: GIModel, origin: Txyz | TPlane,
    size: number | [number, number] | [number, number, number],
    num_positions: number | [number, number] | [number, number, number],
    method: _EBoxMethod): TId[] | TId[][] {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Box';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'size', size, [chk.isNum, chk.isXY, chk.isXYZ]);
    }
    // --- Error Check ---
    // create the matrix one time
    let matrix: THREE.Matrix4;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin as TPlane);
    }
    // create params
    const xyz_size: Txyz = arrFill(size, 3) as [number, number, number];
    const xyz_num_positions: [number, number, number] =
        arrFill(num_positions, 3) as [number, number, number];
    // create the positions
    const layer_top_posis_i: number[] = [];
    const layer_bot_posis_i: number[] = [];
    const posis_i: number[][][] = [];
    const x_offset: number = xyz_size[0] / (xyz_num_positions[0] - 1);
    const y_offset: number = xyz_size[1] / (xyz_num_positions[1] - 1);
    const z_offset: number = xyz_size[2] / (xyz_num_positions[2] - 1);
    for (let k = 0; k < xyz_num_positions[2]; k++) {
        const layer_perim_x0_posis_i: number[] = [];
        const layer_perim_y0_posis_i: number[] = [];
        const layer_perim_x1_posis_i: number[] = [];
        const layer_perim_y1_posis_i: number[] = [];
        const z: number = (k * z_offset) - (xyz_size[2] / 2);
        for (let i = 0; i < xyz_num_positions[1]; i++) {
            const y: number = (i * y_offset) - (xyz_size[1] / 2);
            for (let j = 0; j < xyz_num_positions[0]; j++) {
                const x: number = (j * x_offset) - (xyz_size[0] / 2);
                let create_perim_layer = false;
                // perimeter layers
                if (i === 0 || i === xyz_num_positions[1] - 1) { create_perim_layer = true; }
                if (j === 0 || j === xyz_num_positions[0] - 1) { create_perim_layer = true; }
                // top layer
                let create_top_layer = false;
                if (k === xyz_num_positions[2] - 1) { create_top_layer = true; }
                // bot layer
                let create_bot_layer = false;
                if (k === 0) { create_bot_layer = true; }
                // create posis
                if (create_perim_layer || create_top_layer || create_bot_layer) {
                    let xyz: Txyz = [x, y, z];
                    if (origin_is_plane) {
                        xyz = multMatrix(xyz, matrix);
                    } else { // we have a plane
                        xyz = vecAdd(xyz, origin as Txyz);
                    }
                    const posi_i: number = __model__.modeldata.geom.add.addPosi();
                    __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
                    if (create_perim_layer) {
                        if (i === 0) {
                            layer_perim_x0_posis_i.push(posi_i);
                        } else if (i === xyz_num_positions[1] - 1) {
                            layer_perim_x1_posis_i.push(posi_i);
                        } else if (j === xyz_num_positions[0] - 1) {
                            layer_perim_y0_posis_i.push(posi_i);
                        } else if (j === 0) {
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
        const layers_posis_i: number[][] = [];
        for (let k = 1; k < posis_i.length - 2; k++) {
            layers_posis_i.push(
                arrMakeFlat([
                    posis_i[k][0],
                    posis_i[k][1],
                    posis_i[k][2].reverse(),
                    posis_i[k][3].reverse(),
                ])
            );
        }
        const all_posis: number[] = arrMakeFlat([layer_bot_posis_i, layers_posis_i, layer_top_posis_i]);
        return idsMakeFromIdxs(EEntType.POSI, all_posis) as TId[];
    } else if (method === _EBoxMethod.ROWS) {
        // rows that are parallel to x axis
        const posis_i2: number[][] = [];
        for (let i = 0; i < xyz_num_positions[1]; i++) {
            const row: number[] = [];
            // bottom
            for (let j = 0; j < xyz_num_positions[0]; j++) {
                const index: number = (i * xyz_num_positions[0]) + j;
                row.push(layer_bot_posis_i[index]);
            }
            // mid
            if (posis_i.length > 2) {
                for (let k = 1; k < posis_i.length - 1; k++) {
                    if (i === 0) {
                        row.push(...posis_i[k][0]);
                    } else if (i === xyz_num_positions[1] - 1) {
                        row.push(...posis_i[k][2]);
                    } else {
                        row.push(posis_i[k][3][i - 1]);
                        row.push(posis_i[k][1][i - 1]);
                    }
                }
            }
            // top
            for (let j = 0; j < xyz_num_positions[0]; j++) {
                const index: number = (i * xyz_num_positions[0]) + j;
                row.push(layer_top_posis_i[index]);
            }
            posis_i2.push(row);
        }
        return idsMakeFromIdxs(EEntType.POSI, posis_i2) as TId[][];
    } else if (method === _EBoxMethod.COLUMNS) {
        // columns that are parallel to the y axis
        // i is moving along x axis
        const posis_i2: number[][] = [];
        for (let i = 0; i < xyz_num_positions[0]; i++) {
            const col: number[] = [];
            // bot
            for (let j = 0; j < xyz_num_positions[1]; j++) {
                const index: number = (j * xyz_num_positions[0]) + i;
                col.push(layer_bot_posis_i[index]);
            }
            // mid
            if (posis_i.length > 2) {
                for (let k = 1; k < posis_i.length - 1; k++) {
                    if (i === 0) {
                        col.push(posis_i[k][0][0]);
                        col.push(...posis_i[k][3]);
                        col.push(posis_i[k][2][0]);
                    } else if (i === xyz_num_positions[1] - 1) {
                        col.push(posis_i[k][0][xyz_num_positions[0] - 1]);
                        col.push(...posis_i[k][1]);
                        col.push(posis_i[k][0][xyz_num_positions[0] - 1]);
                    } else {
                        col.push(posis_i[k][0][i]);
                        col.push(posis_i[k][2][i]);
                    }
                }
            }
            // top
            for (let j = 0; j < xyz_num_positions[1]; j++) {
                const index: number = (j * xyz_num_positions[0]) + i;
                col.push(layer_top_posis_i[index]);
            }
            posis_i2.push(col);
        }
        return idsMakeFromIdxs(EEntType.POSI, posis_i2) as TId[][];
    } else if (method === _EBoxMethod.LAYERS) {
        // layers that are parallel to the xy plane
        // i is moving along z axis
        // bottom
        const posis_i2: number[][] = [layer_bot_posis_i];
        // mid
        for (let i = 1; i < xyz_num_positions[2] - 1; i++) {
            if (posis_i.length > 2) {
                const layer: number[] = posis_i[i][0].slice();
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
        return idsMakeFromIdxs(EEntType.POSI, posis_i2) as TId[][];
    } else if (method === _EBoxMethod.QUADS) {
        const posis_i2: number[][] = [];
        // bottom
        for (let i = 0; i < xyz_num_positions[1] - 1; i++) {
            for (let j = 0; j < xyz_num_positions[0] - 1; j++) {
                const index: number = (i * xyz_num_positions[0]) + j;
                const quad: number[] = [
                    layer_bot_posis_i[index],
                    layer_bot_posis_i[index + xyz_num_positions[0]],
                    layer_bot_posis_i[index + xyz_num_positions[0] + 1],
                    layer_bot_posis_i[index + 1]
                ];
                posis_i2.push(quad);
            }
        }
        // mid
        const layers_posis_i: number[][] = [];
        for (let k = 0; k < posis_i.length; k++) {
            layers_posis_i.push(
                arrMakeFlat([
                    posis_i[k][0],
                    posis_i[k][1],
                    posis_i[k][2].reverse(),
                    posis_i[k][3].reverse(),
                ])
            );
        }
        for (let k = 0; k < layers_posis_i.length - 1; k++) {
            const layer_posis_i: number[] = layers_posis_i[k];
            const next_layer_posis_i: number[] = layers_posis_i[k + 1];
            for (let i = 0; i < layer_posis_i.length; i++) {
                const index: number = i;
                const next_index: number = i === layer_posis_i.length - 1 ? 0 : i + 1;
                const quad: number[] = [
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
                const index: number = (i * xyz_num_positions[0]) + j;
                const quad: number[] = [
                    layer_top_posis_i[index],
                    layer_top_posis_i[index + 1],
                    layer_top_posis_i[index + xyz_num_positions[0] + 1],
                    layer_top_posis_i[index + xyz_num_positions[0]]
                ];
                posis_i2.push(quad);
            }
        }
        return idsMakeFromIdxs(EEntType.POSI, posis_i2) as TId[][];
    }
    return [];
}
