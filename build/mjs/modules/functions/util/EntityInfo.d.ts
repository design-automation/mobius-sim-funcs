import { GIModel, TId } from '@design-automation/mobius-sim';
/**
 * Returns an html string representation of one or more entities in the model.
 * The string can be printed to the console for viewing.
 *
 * @param __model__
 * @param entities One or more objects ot collections.
 * @returns void
 */
export declare function EntityInfo(__model__: GIModel, entities: TId | TId[]): string;
