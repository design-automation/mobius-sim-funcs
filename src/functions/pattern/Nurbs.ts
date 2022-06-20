import { ENT_TYPE, Sim, idsMakeFromIdxs, string, Txyz } from '../../mobius_sim';
import * as VERB from '../../../mobius_sim/libs/verb/verb';

import * as chk from '../../_check_types';
import { _EClose } from './_enum';



// ================================================================================================
/**
 * Creates positions in a NURBS curve pattern, defined by a list of coordinates.
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
 * @param degree The degree of the curve, an integer between 2 and 5.
 * @param close Enum, `'close'` or `'open'`.
 * @param num_positions Number of positions to be distributed along the Bezier.
 * @returns Entities, a list of positions.
 * @example `posis = pattern.Nurbs([[0,0,0], [10,0,50], [20,0,50], [30,0,0]], 3, 'open', 20)`
 * @example_info Creates a list of 20 positions distributed along a Nurbs curve.
 */
export function Nurbs(__model__: Sim, coords: Txyz[], degree: number, close: _EClose,
        num_positions: number): string[] {
    // --- Error Check ---
    if (this.debug) {
        const fn_name = 'pattern.Nurbs';
        chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL]);
        chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
        if (coords.length < 3) {
            throw new Error (fn_name + ': "coords" should be a list of at least three XYZ coords.');
        }
        if (degree < 2  || degree > 5) {
            throw new Error (fn_name + ': "degree" should be between 2 and 5.');
        }
        if (degree > (coords.length - 1)) {
            throw new Error (fn_name + ': a curve of degree ' + degree + ' requires at least ' +
                (degree + 1) + ' coords.' );
        }
    }
    // --- Error Check ---
    const closed: boolean = close === _EClose.CLOSE;
    // create the curve using the VERBS library
    const offset = degree + 1;
    const coords2: Txyz[] = coords.slice();
    if (closed) {
        const start: Txyz[] = coords2.slice(0, offset);
        const end: Txyz[] = coords2.slice(coords2.length - offset, coords2.length);
        coords2.splice(0, 0, ...end);
        coords2.splice(coords2.length, 0, ...start);
    }
    const weights = coords2.forEach( _ => 1);
    const num_knots: number = coords2.length + degree + 1;
    const knots: number [] = [];
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
    const curve_verb =
        new VERB.geom.NurbsCurve.byKnotsControlPointsWeights(degree, knots, coords2, weights);
    // Testing VERB closed curve
    // const k: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // const c: number[][] = [[0, 0, 0], [10, 0, 0], [10, 10, 0], [0, 10, 0], [0, 0, 0], [10, 0, 0]];
    // const w: number[] = [1, 1, 1, 1, 1, 1];
    // const curve_verb2 = new VERB.geom.NurbsCurve.byKnotsControlPointsWeights(2, k, c, w);
    // This gives an error: Error:
    // Invalid knot vector format!
    // Should begin with degree + 1 repeats and end with degree + 1 repeats!
    const posis_i: number[] =
        nurbsToPosis(__model__, curve_verb, degree, closed, num_positions, coords[0]);
    // return the list of posis
    return idsMakeFromIdxs(ENT_TYPE.POSI, posis_i) as string[];
}

// ================================================================================================
function nurbsToPosis(__model__: Sim, curve_verb: any, degree: number, closed: boolean,
    num_positions: number, start: Txyz): number[] {
    // create positions
    const posis_i: number[] = [];
    const [offset_start, offset_end] = { 2: [5, 3], 3: [6, 5], 4: [8, 6], 5: [9, 8] }[degree];
    const knots: number[] = curve_verb.knots();
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
        let u: number;
        if (closed) {
            u = u_start + ((i / num_positions) * u_range);
        } else {
            u = i / (num_positions - 1);
        }
        const xyz: Txyz = curve_verb.point(u) as Txyz;
        // xyz[2] = i / 10;
        const posi_i: number = __model__.modeldata.geom.add.addPosi();
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
    const posis_i_start: number[] = posis_i.slice(closest_to_start, posis_i.length);
    const posis_i_end: number[] = posis_i.slice(0, closest_to_start);
    const posis_i_sorted: number[] = posis_i_start.concat(posis_i_end);
    // return the list of posis
    return posis_i_sorted;
}
