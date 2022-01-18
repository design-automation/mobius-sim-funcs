import { GIModel, TId } from '@design-automation/mobius-sim';
/**
 * Joins existing polyline or polygons to create new polyline or polygons.
 *
 * In order to be joined, the polylines or polygons must be fused (i.e. share the same positions)
 *
 * The existing polygons are not affected.
 *
 * Note: Joining polylines currently not implemented.
 *
 * @param __model__
 * @param entities Polylines or polygons, or entities from which polylines or polygons can be extracted.
 * @returns Entities, a list of new polylines or polygons resulting from the join.
 */
export declare function Join(__model__: GIModel, entities: TId[]): TId[];
