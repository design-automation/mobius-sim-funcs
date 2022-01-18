import { GIModel, TId } from '@design-automation/mobius-sim';
/**
 * Addes entities to a collection.
 * \n
 * @param __model__
 * @param coll The collection to be updated.
 * @param entities Points, polylines, polygons, and collections to add.
 * @returns void
 */
export declare function Add(__model__: GIModel, coll: TId, entities: TId | TId[]): void;
