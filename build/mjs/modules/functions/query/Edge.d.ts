import { GIModel, TId } from '@design-automation/mobius-sim';
import { _EEdgeMethod } from './_enum';
/**
* Given an edge, returns other edges.
* - If "previous" is selected, it returns the previous edge in the wire or null if there is no previous edge.
* - If "next" is selected, it returns the next edge in the wire or null if there is no next edge.
* - If "both" is selected, it returns a list of two edges, [previous, next]. Either can be null.
* - If "touching" is selected, it returns a list of edges from other wires that share the same start and end positions (in any order).
* @param __model__
* @param entities An edge or list of edges.
* @param edge_query_enum Enum, select the types of edges to return.
* @returns Entities, an edge or list of edges
*/
export declare function Edge(__model__: GIModel, entities: TId | TId[], edge_query_enum: _EEdgeMethod): TId | TId[];
