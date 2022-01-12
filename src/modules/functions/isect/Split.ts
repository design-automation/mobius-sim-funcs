/**
 * The `isect` module has functions for performing intersections between entities in the model.
 * These functions may make new entities, and may modify existing entities, depending on the function that is selected.
 * If new entities are created, then the function will return the IDs of those entities.
 * @module
 */
import { GIModel, TId } from '@design-automation/mobius-sim';


/**
 * Splits a polyline or polygon with a polyline.
 * @param __model__
 * @param geometry A list of polylines or polygons to be split.
 * @param polyline Splitter.
 * @returns List of two lists containing polylines or polygons.
 * @example splitresult = isect.Split (pl1, pl2)
 * @example_info Returns [[pl1A],[pl1B]], where pl1A and pl1B are polylines resulting from the split occurring where pl1 and pl2 intersect.
 */
export function Split(__model__: GIModel, geometry: TId[], polyline: TId): TId[] {
    // --- Error Check ---
    // const fn_name = 'isect.Split';
    // const ents_arr = checkIDs(__model__, fn_name, 'objects', geometry, ['isIDList'], [EEntType.PLINE, EEntType.PGON]);
    // checkIDs(__model__, fn_name, 'polyline', polyline, [IDcheckObj.isID], [EEntType.PLINE]);
    // --- Error Check ---
    throw new Error('Not implemented.'); return null;
}

// Ray and plane
