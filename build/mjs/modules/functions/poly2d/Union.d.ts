import { GIModel, TId } from '@design-automation/mobius-sim';
/**
 * Create the union of a set of polygons.
 *
 * @param __model__
 * @param entities A list of polygons, or entities from which polygons can bet extracted.
 * @returns A list of new polygons.
 */
export declare function Union(__model__: GIModel, entities: TId | TId[]): TId[];
