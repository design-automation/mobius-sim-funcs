import { GIModel, TId } from '@design-automation/mobius-sim';
/**
 * Create a voronoi subdivision of one or more polygons.
 * \n
 * @param __model__
 * @param pgons A list of polygons, or entities from which polygons can be extracted.
 * @param entities A list of positions, or entities from which positions can be extracted.
 * @returns A list of new polygons.
 */
export declare function Voronoi(__model__: GIModel, pgons: TId | TId[], entities: TId | TId[]): TId[];
