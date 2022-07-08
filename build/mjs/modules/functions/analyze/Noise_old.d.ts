import { GIModel, TId, TPlane, TRay, Txyz } from '@design-automation/mobius-sim';
interface TNoiseResult {
    avg_dist?: number[];
    min_dist?: number[];
    max_dist?: number[];
    distance_ratio?: number[];
}
/**
 * Calculates the noise impact on a set of sensors from a set of noise sources.
 * \n
 * Typically, the sensors are created as centroids of a set of windows. The noise sources are
 * typically placed along road centrelines.
 * \n
 * The noise impact is calculated by shooting rays out from the sensors towards the noise sources.
 * The 'radius' argument defines the maximum radius of the calculation.
 * (The radius is used to define the maximum distance for shooting the rays.)
 * \n
 * Returns a dictionary containing different metrics.
 * \n
 * @param __model__
 * @param sensors A list of Rays or Planes, to be used as the origins for calculating the unobstructed views.
 * @param entities The obstructions: faces, polygons, or collections.
 * @param limits The maximum radius of the visibility analysis.
 * @param sources Positions defining the noise sources.
 * @returns A dictionary containing different visibility metrics.
 */
export declare function Noise(__model__: GIModel, sensors: Txyz[] | TRay[] | TPlane[], entities: TId | TId[] | TId[][], limits: number | [number, number], sources: TId | TId[] | TId[][]): TNoiseResult;
export {};
