import { GIModel, TId } from '@design-automation/mobius-sim';
/**
 * Adds vertices to polyline and polygons at all locations where egdes intersect one another.
 * The vertices are welded.
 * This can be useful for creating networks that can be used for shortest path calculations.
 * \n
 * The input polyline and polygons are copied.
 * \n
 * @param __model__
 * @param entities A list polylines or polygons, or entities from which polylines or polygons can be extracted.
 * @param tolerance The tolerance for extending open plines if they are almost intersecting.
 * @returns Copies of the input polyline and polygons, stiched.
 */
export declare function Stitch(__model__: GIModel, entities: TId | TId[], tolerance: number): TId[];
