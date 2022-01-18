import { GIModel, TId } from '@design-automation/mobius-sim';
/**
 * Create a voronoi subdivision of a polygon.
 *
 * @param __model__
 * @param entities A list of positions, or entities from which positions can bet extracted.
 * @returns A new polygons, the convex hull of the positions.
 */
export declare function ConvexHull(__model__: GIModel, entities: TId | TId[]): TId;
