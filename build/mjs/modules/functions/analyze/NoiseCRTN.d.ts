import { GIModel, TId, TPlane, TRay } from '@design-automation/mobius-sim';
interface TNoiseResult {
    noise_level: number[];
}
/**
 * Calculates the noise impact on a set of sensors from a set of noise sources, using the CRTN
 * method (Calculation of Road Traffic Noise, 1988).
 * \n
 * Typically, the sensors are created as centroids of a set of windows. The noise sources are
 * typically polylines placed along road centrelines. The CRTN method specified that the
 * centrelines should be inset 3.5 meters from the road kerb that is closest to the sensors.
 * \n
 * The noise impact is calculated by shooting rays out from the sensors towards the noise sources.
 * \n
 * There are several cases for the input of 'sensors'.
 * - `PlnL` will return a dictionary of values, with each value corresponding to each plane.
 * - `[PlnL, Pln]` will return a dictionary with two keys, while visualizing the raycasting process for `Pln`.
 * - `RayL` will return a dictionary of values, with each value corresponding to each ray.
 * - `[RayL, Ray]` will return a dictionary with two keys, while visualizing the raycasting process for `Ray`.
 * \n
 * The radius is used to define the distance of the resultant rays.
 * \n
 * - If 'radius' is a number, it defines the maximum radius of the calculation.
 * - If 'radius' is a list of two numbers, it defines the minimum and maximum distance of the calculation.
 * The "min_dist" must be less than the "max_dist": [min_dist, max_dist].
 * \n
 * Returns a dictionary containing the noise level values, in decibels (dB).
 * \n
 * @param __model__
 * @param sensors A list of Rays or Planes, to be used as the origins for calculating the unobstructed views.
 * @param entities A list of the obstructions: faces, polygons, or collections.
 * @param radius A number or list of two numbers. The maximum radius of the visibility analysis.
 * @param roads A Polyline or list of polylines defining the road segments as noise sources.
 * @param noise_levels The noise level for each road polyline, in dB. Either a single number for all
 * roads, or a list of numbers with the same length as the list of roads.
 * @param length The length of each road segment, in meters.
 * @returns A dictionary containing different visibility metrics.
 */
export declare function NoiseCRTN(__model__: GIModel, sensors: TRay[] | TPlane[] | TRay[][] | TPlane[][], entities: TId | TId[] | TId[][], radius: number | [number, number], roads: TId | TId[] | TId[][], noise_levels: number | number[], length: number): TNoiseResult | [TNoiseResult, TNoiseResult];
export {};
