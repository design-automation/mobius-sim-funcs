import { ENT_TYPE, Sim, idsMakeFromIdxs, string, Txyz } from '../../mobius_sim';
import * as THREE from 'three';

import * as chk from '../../_check_types';
import { _EClose, _ECurveCatRomType } from './_enum';



// ================================================================================================
// Enums for CurveCatRom()
/**
 * Creates positions in a spline pattern. Returns a list of new positions.
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
 * alt="Curve types" width="150">
 * \n
 * @param __model__
 * @param coords A list of |coordinates|.
 * @param type Enum, the type of interpolation algorithm: 'centripetal', 'chordal', or 'catmullrom'.
 * @param tension Curve tension, between 0 and 1. This only has an effect when the 'type' is set
 * to 'catmullrom'.
 * @param close Enum, `'open'` or `'close'`.
 * @param num_positions Number of positions to be distributed distributed along the spline.
 * @returns Entities, a list of positions.
 * @example `posis = pattern.Spline([[0,0,0], [10,0,50], [20,0,0], [30,0,20], [40,0,10]],
 * 'chordal','close', 0.2, 50)`
 * @example_info Creates a list of 50 positions distributed along a spline curve pattern.
 */
export function Interpolate(__model__: Sim, coords: Txyz[], type: _ECurveCatRomType, 
    tension: number, close: _EClose, num_positions: number): string[] {
    // // --- Error Check ---
    // if (this.debug) {
    //     const fn_name = 'pattern.Interpolate';
    //     chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL]);
    //     chk.checkArgs(fn_name, 'tension', tension, [chk.isNum01]);
    //     chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
    //     if (coords.length < 3) {
    //         throw new Error(fn_name + ': "coords" should be a list of at least three XYZ coords.');
    //     }
    // }
    // // --- Error Check ---
    const closed_tjs: boolean = close === _EClose.CLOSE;
    const num_positions_tjs: number = closed_tjs ? num_positions : num_positions - 1;
    if (tension === 0) { tension = 1e-16; } // There seems to be a bug in threejs, so this is a fix
    // Check we have enough coords
    // create the curve
    const coords_tjs: THREE.Vector3[] =
        coords.map(coord => new THREE.Vector3(coord[0], coord[1], coord[2]));
    const curve_tjs: THREE.CatmullRomCurve3 =
        new THREE.CatmullRomCurve3(coords_tjs, closed_tjs, type, tension);
    const points_tjs: THREE.Vector3[] = curve_tjs.getPoints(num_positions_tjs);
    // create positions
    const posis_i: number[] = [];
    for (let i = 0; i < num_positions; i++) {
        const posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, points_tjs[i].toArray() as Txyz);
        posis_i.push(posi_i);
    }
    // return the list of posis
    return idsMakeFromIdxs(ENT_TYPE.POSI, posis_i) as string[];
}
