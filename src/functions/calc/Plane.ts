import {
    // getArrDepth,
    Sim,
    // idsBreak,
    // isEmptyArr,
    // string,
    // string,
    // TPlane,
    Txyz,
    // vecCross,
    // vecDiv,
    // vecFromTo,
    // vecNorm,
    // vecSum,
} from '../../mobius_sim';

import { TPlane } from '../_common/consts';

import { checkIDs, ID } from '../_common/_check_ids';
import { _normal } from './Normal';


// ================================================================================================
/**
 * Returns a plane from a polygon, a face, a polyline, or a wire.
 * For polylines or wires, there must be at least three non-colinear vertices.
 * \n
 * The winding order is counter-clockwise.
 * This means that if the vertices are ordered counter-clockwise relative to your point of view,
 * then the z axis of the plane will be pointing towards you.
 *
 * @param entities Any entities.
 * @returns The plane.
 */
export function Plane(__model__: Sim, entities: string|string[]): TPlane|TPlane[] {
    // if (isEmptyArr(entities)) { return []; }
    // // // --- Error Check ---
    // // const fn_name = 'calc.Plane';
    // // let ents_arr: string|string[];
    // // if (this.debug) {
    // //     ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
    // //         [ID.isID, ID.isIDL1, ID.isIDL2], null) as string|string[]; // takes in any
    // // } else {
    // //     ents_arr = idsBreak(entities) as string|string[];
    // // }
    // // // --- Error Check ---
    // return _getPlane(__model__, ents_arr);
    throw new Error();
}
export function _getPlane(__model__: Sim, ents_arr: string|string[]): TPlane|TPlane[] {
    // if (getArrDepth(ents_arr) === 1) {
    //     const ent_arr = ents_arr as string;
    //     const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]);
    //     const unique_posis_i = Array.from(new Set(posis_i));
    //     if (unique_posis_i.length < 3) { throw new Error('Too few points to calculate plane.'); }
    //     const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
    //     const origin: Txyz = vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
    //     // const normal: Txyz = newellNorm(unique_xyzs);
    //     const normal: Txyz = _normal(__model__, ent_arr, 1) as Txyz;
    //     const x_vec: Txyz = vecNorm(vecFromTo(unique_xyzs[0], unique_xyzs[1]));
    //     const y_vec: Txyz = vecCross(normal, x_vec); // must be z-axis, x-axis
    //     return [origin, x_vec, y_vec] as TPlane;
    // } else {
    //     return (ents_arr as string[]).map(ent_arr => _getPlane(__model__, ent_arr)) as TPlane[];
    // }
    throw new Error();
}
