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
export declare function Split(__model__: GIModel, geometry: TId[], polyline: TId): TId[];
