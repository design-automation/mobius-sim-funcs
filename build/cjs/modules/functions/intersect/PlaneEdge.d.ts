import { GIModel, TId, TPlane, TRay, Txyz } from '@design-automation/mobius-sim';
/**
 * Calculates the xyz intersection between a plane and a list of edges.
 * \n
 * This ignores the intersections between planes and polygon face triangles.
 * \n
 * @param __model__
 * @param plane A plane.
 * @param entities An edge or list of edges, or entities from which edges can be extracted.
 * @return A list of xyz intersection coordinates.
 * @example coords = intersect.PlaneEdge(plane, polyline1)
 * @example_info Returns a list of coordinates where the plane intersects with the edges of polyline1.
 */
export declare function PlaneEdge(__model__: GIModel, plane: TRay | TPlane, entities: TId | TId[]): Txyz[];
