import {
    ENT_TYPE,
    getArrDepth,
    Sim,
    idsMakeFromIdxs,
    multMatrix,
    string,
    TPlane,
    Txyz,
    vecAdd,
    xfromSourceTargetMatrix,
    XYPLANE,
} from '../../mobius_sim';
import * as THREE from 'three';

import * as chk from '../../_check_types';



// ================================================================================================
/**
 * Creates a set of positions in a straight line pattern.
 * \n
 * The `origin` parameter specifies the centre of the straight line along which positions will be
 * generated. The origin can be specified as either a |coordinate| or a |plane|. If a coordinate
 * is given, then a plane will be automatically generated, aligned with the global XY plane.
 * \n
 * The positions will be generated along a straight line aligned with the X axis of the origin 
 * plane.
 * \n
 * Returns the list of new positions.
 * \n
 * @param __model__
 * @param origin A |coordinate| or a |plane|.
 * If a coordinate is given, then the plane is assumed to be aligned with the global XY plane.
 * @param length A number. The length of the line along which positions will be generated.
 * @param num_positions An integer. The number of positions to be generated. 
 * @returns Entities, a list of new positions.
 */
export function Line(__model__: Sim, origin: Txyz|TPlane, length: number, num_positions: number): string[] {
    // --- Error Check ---
    if (this.debug) {
        const fn_name = 'pattern.Line';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'length', length, [chk.isNum]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
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
    const coords: Txyz[] = [];
    const step: number = length / (num_positions - 1);
    for (let i = 0; i < num_positions; i++) {
        coords.push([-(length / 2) + i * step, 0, 0]);
    }
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
    return idsMakeFromIdxs(ENT_TYPE.POSI, posis_i) as string[];
}
