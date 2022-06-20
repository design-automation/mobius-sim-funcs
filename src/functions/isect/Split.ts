import { Sim, string } from '../../mobius_sim';



/**
 * Splits a polyline or polygon with a polyline.
 * @param __model__
 * @param geometry A list of polylines or polygons to be split.
 * @param polyline Splitter.
 * @returns List of two lists containing polylines or polygons.
 * @example splitresult = isect.Split (pl1, pl2)
 * @example_info Returns [[pl1A],[pl1B]], where pl1A and pl1B are polylines resulting from the split occurring where pl1 and pl2 intersect.
 */
export function Split(__model__: Sim, geometry: string[], polyline: string): string[] {
    // --- Error Check ---
    // const fn_name = 'isect.Split';
    // const ents_arr = checkIDs(__model__, fn_name, 'objects', geometry, ['isIDList'], [ENT_TYPE.PLINE, ENT_TYPE.PGON]);
    // checkIDs(__model__, fn_name, 'polyline', polyline, [IDcheckObj.isID], [ENT_TYPE.PLINE]);
    // --- Error Check ---
    throw new Error('Not implemented.'); return null;
}

// Ray and plane
