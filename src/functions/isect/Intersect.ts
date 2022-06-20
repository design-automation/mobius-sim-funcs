import { Sim, string } from '../../mobius_sim';



// import { __merge__ } from '../_model';

/**
 * Adds positions by intersecting polylines, planes, and polygons.
 * @param __model__
 * @param entities1 First polyline, plane, face, or polygon.
 * @param entities2 Second polyline, plane face, or polygon.
 * @returns List of positions.
 * @example `intersect1 = isect.Intersect (object1, object2)`
 * @example_info Returns a list of positions at the intersections between both objects.
 */
export function Intersect(__model__: Sim, entities1: string, entities2: string): string[] {
    // --- Error Check ---
    // const fn_name = 'isect.Intersect';
    // const ents_arr_1 = checkIDnTypes(fn_name, 'object1', entities1,
    //                                  [IDcheckObj.isID, TypeCheckObj.isPlane],
    //                                  [ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.FACE]);
    // const ents_arr_2 = checkIDnTypes(fn_name, 'object2', entities2,
    //                                  [IDcheckObj.isID, TypeCheckObj.isPlane],
    //                                  [ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.FACE]);
    // --- Error Check ---
    throw new Error('Not impemented.'); return null;
}
