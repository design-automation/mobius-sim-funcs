import { GIModel, TId } from '@design-automation/mobius-sim';
/**
 * Adds a new copy of specified entities to the model, and deletes the original entity.
 *
 * @param __model__
 * @param entities Entity or lists of entities to be copied. Entities can be positions, points, polylines, polygons and collections.
 * @returns Entities, the cloned entity or a list of cloned entities.
 * @example copies = make.Copy([position1,polyine1,polygon1])
 * @example_info Creates a copy of position1, polyine1, and polygon1.
 */
export declare function Clone(__model__: GIModel, entities: TId | TId[] | TId[][]): TId | TId[] | TId[][];
