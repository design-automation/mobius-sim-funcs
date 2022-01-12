/**
 * The `poly2D` module has a set of functions for working with 2D polygons, on the XY plane.
 * @module
 */
import { GIModel, TId } from '@design-automation/mobius-sim';
import { _EOffsetRound } from './_enum';
/**
* Offset a polyline or polygon, with round joints.
*
* @param __model__
* @param entities A list of pollines or polygons, or entities from which polylines or polygons can be extracted.
* @param dist Offset distance
* @param tolerance The tolerance for the rounded corners.
* @param end_type Enum, the type of end shape for open polylines'.
* @returns A list of new polygons.
*/
export declare function OffsetRound(__model__: GIModel, entities: TId | TId[], dist: number, tolerance: number, end_type: _EOffsetRound): TId[];
