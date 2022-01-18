import { GIModel, TId } from '@design-automation/mobius-sim';
import { _EEdgeMethod } from './_enum';
/**
 * Controls how edges are visualized by setting the visibility of the edge.
 * \n
 * The method can either be 'visible' or 'hidden'.
 * 'visible' means that an edge line will be visible.
 * 'hidden' means that no edge lines will be visible.
 * \n
 * @param entities A list of edges, or other entities from which edges can be extracted.
 * @param method Enum, visible or hidden.
 * @returns void
 */
export declare function Edge(__model__: GIModel, entities: TId | TId[], method: _EEdgeMethod): void;
