import { GIModel, TId } from '@design-automation/mobius-sim';
/**
 * Deletes a collection without deleting the entities in the collection.
 * \n
 * @param __model__
 * @param coll The collection or list of collections to be deleted.
 * @returns void
 */
export declare function Delete(__model__: GIModel, coll: TId | TId[]): void;
