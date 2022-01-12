/**
 * The `pattern` module has functions for creating patters of positions.
 * These functions all return lists of position IDs.
 * The list may be nested, depending on which function is selected.
 * @module
 */
import { EEntType, getArrDepth, idsMakeFromIdxs, multMatrix, vecAdd, xfromSourceTargetMatrix, XYPLANE, } from '@design-automation/mobius-sim';
import * as chk from '../../../_check_types';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXJjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL3BhdHRlcm4vQXJjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBQ0gsT0FBTyxFQUNILFFBQVEsRUFDUixXQUFXLEVBRVgsZUFBZSxFQUNmLFVBQVUsRUFJVixNQUFNLEVBQ04sdUJBQXVCLEVBQ3ZCLE9BQU8sR0FDVixNQUFNLCtCQUErQixDQUFDO0FBR3ZDLE9BQU8sS0FBSyxHQUFHLE1BQU0sdUJBQXVCLENBQUM7QUFJN0MsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFERztBQUNILE1BQU0sVUFBVSxHQUFHLENBQUMsU0FBa0IsRUFBRSxNQUFtQixFQUFFLE1BQWMsRUFBRSxhQUFxQixFQUMxRixTQUFrQztJQUN0QyxzQkFBc0I7SUFDdEIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQztRQUM5QixHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNqRSxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FB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