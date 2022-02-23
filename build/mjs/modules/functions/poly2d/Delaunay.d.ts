import { GIModel, TId } from '@design-automation/mobius-sim';
/**
 * Create a delaunay triangulation of set of positions.
 * \n
 * @param __model__
 * @param entities A list of positions, or entities from which positions can be extracted.
 * @returns A list of new polygons.
 */
export declare function Delaunay(__model__: GIModel, entities: TId | TId[]): TId[];