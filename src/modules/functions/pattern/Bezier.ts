import { EEntType, GIModel, idsMakeFromIdxs, TId, Txyz } from '@design-automation/mobius-sim';
import * as THREE from 'three';

import * as chk from '../../_check_types';



// ================================================================================================
/**
 * Creates positions in a Bezier curve pattern, defined by a list of coordinates.
 * \n
 * The Bezier is created as either a quadratic or cubic Bezier. It is always an open curve.
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
 * <a href="https://en.wikipedia.org/wiki/B%C3%A9zier_curve" target="_blank">Bezier_curve</a>.
 * \n
 * @param __model__
 * @param coords A |coordinate| or a |plane| (three coords for quadratics, four coords for cubics).
 * If a coordinate is given, then the plane is assumed to be aligned with the global XY plane.
 * @param num_positions Number of positions to be distributed along the Bezier.
 * @returns Entities, a list of positions.
 * @example `posis = pattern.Bezier([[0,0,0], [10,0,50], [20,0,0]], 20)`
 * @example_info Creates a list of 20 positions distributed along a Bezier curve.
 */
export function Bezier(__model__: GIModel, coords: Txyz[], num_positions: number): TId[] {
    // --- Error Check ---
    const fn_name = 'pattern.Bezier';
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL, chk.isPln]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
    }
    // --- Error Check ---
    // create the curve
    const coords_tjs: THREE.Vector3[] =
        coords.map(coord => new THREE.Vector3(coord[0], coord[1], coord[2]));
    let points_tjs: THREE.Vector3[] = [];
    let curve_tjs: THREE.CubicBezierCurve3|THREE.QuadraticBezierCurve3 = null;
    if (coords.length === 4) {
        curve_tjs =
            new THREE.CubicBezierCurve3(coords_tjs[0], coords_tjs[1], coords_tjs[2], coords_tjs[3]);
        points_tjs = curve_tjs.getPoints(num_positions - 1);
    } else if (coords.length === 3) {
        curve_tjs = new THREE.QuadraticBezierCurve3(coords_tjs[0], coords_tjs[1], coords_tjs[2]);
        points_tjs = curve_tjs.getPoints(num_positions - 1);
    } else {
        throw new Error (fn_name + 
            ': "coords" should be a list of either three or four XYZ coords.');
    }
    // create positions
    const posis_i: number[] = [];
    for (let i = 0; i < num_positions; i++) {
        const posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, points_tjs[i].toArray() as Txyz);
        posis_i.push(posi_i);
    }
    // return the list of posis
    return idsMakeFromIdxs(EEntType.POSI, posis_i) as TId[];
}
