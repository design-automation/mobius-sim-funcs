import { GIModel, TId } from '@design-automation/mobius-sim';
import { _EDistanceMethod } from './_enum';
/**
 * Calculates the minimum distance from one position to other entities in the model.
 *
 * @param __model__
 * @param entities1 Position to calculate distance from.
 * @param entities2 List of entities to calculate distance to.
 * @param method Enum; distance method.
 * @returns Distance, or list of distances (if position2 is a list).
 * @example distance1 = calc.Distance (position1, position2, p_to_p_distance)
 * @example_info position1 = [0,0,0], position2 = [[0,0,10],[0,0,20]], Expected value of distance is 10.
 */
export declare function Distance(__model__: GIModel, entities1: TId | TId[], entities2: TId | TId[], method: _EDistanceMethod): number | number[];
