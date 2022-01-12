/**
 * The `collections` module has functions for creating and modifying collections.
 * @module
 */
import { GIModel, TId } from '@design-automation/mobius-sim';
/**
 * Removes entities from a collection.
 * \n
 * @param __model__
 * @param coll The collection to be updated.
 * @param entities Points, polylines, polygons, and collections to add. Or null to empty the collection.
 * @returns void
 */
export declare function Remove(__model__: GIModel, coll: TId, entities: TId | TId[]): void;
