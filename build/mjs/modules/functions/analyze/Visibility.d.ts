import { GIModel, TId, TPlane, TRay, Txyz } from '@design-automation/mobius-sim';
interface TVisibilityResult {
    avg_dist?: number[];
    min_dist?: number[];
    max_dist?: number[];
    count?: number[];
    count_ratio?: number[];
    distance_ratio?: number[];
}
/**
 * Calculates the visibility of a set of target positions from a set of origins.
 * \n
 * Typically, the origins are created as centroids of a set of windows. The targets are a set of positions
 * whose visibility is to be analysed.
 * \n
 * The visibility is calculated by shooting rays out from the origins towards the targets.
 * The 'radius' argument defines the maximum radius of the visibility.
 * (The radius is used to define the maximum distance for shooting the rays.)
 * \n
 * Returns a dictionary containing different visibility metrics.
 * \n
 * \n
 * @param __model__
 * @param origins A list of Rays or Planes, to be used as the origins for calculating the uobstructed views.
 * @param entities The obstructions: faces, polygons, or collections.
 * @param radius The maximum radius of the visibility analysis.
 * @param targets The traget positions.
 */
export declare function Visibility(__model__: GIModel, origins: Txyz[] | TRay[] | TPlane[], entities: TId | TId[] | TId[][], radius: number, targets: TId | TId[] | TId[][]): TVisibilityResult;
export {};
