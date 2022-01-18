import { GIModel, TId } from '@design-automation/mobius-sim';
import { _EClose } from './_enum';
/**
 * Adds one or more new polylines to the model.
 *
 * @param __model__
 * @param entities List or nested lists of positions, or entities from which positions can be extracted.
 * @param close Enum, 'open' or 'close'.
 * @returns Entities, new polyline, or a list of new polylines.
 * @example polyline1 = make.Polyline([position1,position2,position3], close)
 * @example_info Creates a closed polyline with vertices position1, position2, position3 in sequence.
 */
export declare function Polyline(__model__: GIModel, entities: TId | TId[] | TId[][], close: _EClose): TId | TId[];
