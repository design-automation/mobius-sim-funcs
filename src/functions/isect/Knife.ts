import { Sim, string, TPlane } from '../../mobius_sim';

import { _EKnifeKeep } from './_enum';


/**
 * Separates a list of points, polylines or polygons into two lists with a plane.
 * 
 * @param __model__
 * @param geometry List of points, polylines or polygons.
 * @param plane Knife.
 * @param keep Enum, Keep above, keep below, or keep both lists of separated points, polylines or polygons.
 * @returns List, or list of two lists, of points, polylines or polygons.
 * @example `knife1 = isect.Knife ([p1,p2,p3,p4,p5], plane1, keepabove)`
 * @example_info Returns `[[p1,p2,p3],[p4,p5]]` if p1, p2, p3 are points above the plane and p4, p5 are points below the plane.
 */
export function Knife(__model__: Sim, geometry: string[], plane: TPlane, keep: _EKnifeKeep): string[] {
    // --- Error Check ---
    // const fn_name = 'isect.Knife';
    // const ents_arr = checkIDs(__model__, fn_name, 'geometry', geometry, ['isIDList'], [ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON]);
    // checkCommTypes(fn_name, 'plane', plane, [TypeCheckObj.isPlane]);
    // --- Error Check ---
    throw new Error('Not implemented.'); return null;
}
