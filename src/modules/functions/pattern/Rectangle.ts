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

import * as chk from '../../_check_types';



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
export function Rectangle(__model__: GIModel, origin: Txyz|TPlane,
        size: number|[number, number]): TId[] {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Rectangle';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'size', size, [chk.isNum, chk.isXY]);
    }
    // --- Error Check ---
    // create the matrix one time
    let matrix: THREE.Matrix4;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin as TPlane);
    }
    // create the positions
    const posis_i: number[] = [];
    const xy_size: [number, number] =
        (Array.isArray(size) ? size : [size, size]) as [number, number];
    const coords: Txyz[] = [
        [-(xy_size[0] / 2), -(xy_size[1] / 2), 0],
        [ (xy_size[0] / 2), -(xy_size[1] / 2), 0],
        [ (xy_size[0] / 2),  (xy_size[1] / 2), 0],
        [-(xy_size[0] / 2),  (xy_size[1] / 2), 0]
    ];
    for (const coord of coords) {
        let xyz: Txyz = coord;
        if (origin_is_plane) {
            xyz = multMatrix(xyz, matrix);
        } else { // we have a plane
            xyz = vecAdd(xyz, origin as Txyz);
        }
        const posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    // return
    return idsMakeFromIdxs(EEntType.POSI, posis_i) as TId[];
}
