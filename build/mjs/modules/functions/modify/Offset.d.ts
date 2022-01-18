import { GIModel, TId } from '@design-automation/mobius-sim';
/**
 * Offsets wires.
 * \n
 * @param __model__
 * @param entities Edges, wires, faces, polylines, polygons, collections.
 * @param dist The distance to offset by, can be either positive or negative
 * @returns void
 * @example modify.Offset(polygon1, 10)
 * @example_info Offsets the wires inside polygon1 by 10 units. Holes will also be offset.
 */
export declare function Offset(__model__: GIModel, entities: TId | TId[], dist: number): void;
