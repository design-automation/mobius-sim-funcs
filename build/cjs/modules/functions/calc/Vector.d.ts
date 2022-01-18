import { GIModel, TId, Txyz } from '@design-automation/mobius-sim';
/**
 * Returns a vector along an edge, from the start position to the end position.
 * The vector is not normalized.
 *
 * Given a single edge, a single vector will be returned. Given a list of edges, a list of vectors will be returned.
 *
 * Given any entity that has edges (collection, polygons, polylines, faces, and wires),
 * a list of edges will be extracted, and a list of vectors will be returned.
 *
 * @param __model__
 * @param entities Single or list of edges, or any entity from which edges can be extracted.
 * @returns The vector [x, y, z] or a list of vectors.
 */
export declare function Vector(__model__: GIModel, entities: TId | TId[]): Txyz | Txyz[];
