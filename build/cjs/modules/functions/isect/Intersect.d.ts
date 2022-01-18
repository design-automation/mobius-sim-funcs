import { GIModel, TId } from '@design-automation/mobius-sim';
/**
 * Adds positions by intersecting polylines, planes, and polygons.
 * @param __model__
 * @param entities1 First polyline, plane, face, or polygon.
 * @param entities2 Second polyline, plane face, or polygon.
 * @returns List of positions.
 * @example intersect1 = isect.Intersect (object1, object2)
 * @example_info Returns a list of positions at the intersections between both objects.
 */
export declare function Intersect(__model__: GIModel, entities1: TId, entities2: TId): TId[];
