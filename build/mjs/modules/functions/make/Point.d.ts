import { GIModel, TId } from '@design-automation/mobius-sim';
/**
 * Adds one or more new points to the model.
 *
 * @param __model__
 * @param entities Position, or list of positions, or entities from which positions can be extracted.
 * @returns Entities, new point or a list of new points.
 * @example point1 = make.Point(position1)
 * @example_info Creates a point at position1.
 */
export declare function Point(__model__: GIModel, entities: TId | TId[] | TId[][]): TId | TId[] | TId[][];
