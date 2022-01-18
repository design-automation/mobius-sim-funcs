import { GIModel, TId } from '@design-automation/mobius-sim';
import { _EOffset } from './_enum';
/**
 * Offset a polyline or polygon, with chamfered joints.
 *
 * @param __model__
 * @param entities A list of pollines or polygons, or entities from which polylines or polygons can be extracted.
 * @param dist Offset distance
 * @param end_type Enum, the type of end shape for open polylines'.
 * @returns A list of new polygons.
 */
export declare function OffsetChamfer(__model__: GIModel, entities: TId | TId[], dist: number, end_type: _EOffset): TId[];
