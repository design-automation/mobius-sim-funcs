import { GIModel, TId } from '@design-automation/mobius-sim';
/**
 * Calculates the area of en entity.
 *
 * The entity can be a polygon, a face, a closed polyline, a closed wire, or a collection.
 *
 * Given a list of entities, a list of areas are returned.
 *
 * @param __model__
 * @param entities Single or list of polygons, closed polylines, closed wires, collections.
 * @returns Area.
 * @example area1 = calc.Area (surface1)
 */
export declare function Area(__model__: GIModel, entities: TId | TId[]): number | number[];
