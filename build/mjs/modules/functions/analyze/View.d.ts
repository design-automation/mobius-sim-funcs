import { GIModel, TId, TPlane, TRay } from '@design-automation/mobius-sim';
interface TViewResult {
    avg_dist?: number[];
    min_dist?: number[];
    max_dist?: number[];
    area?: number[];
    perimeter?: number[];
    area_ratio?: number[];
    perimeter_ratio?: number[];
    distance_ratio?: number[];
}
/**
 * Calculates an approximation of the unobstructed view for a set of origins.
 * \n
 * Typically, the origins are created as centroids of a set of windows.
 * \n
 * The unobstructed view is calculated by shooting rays out from the origins in a fan pattern.
 * The 'radius' argument defines the maximum radius of the unobstructed view.
 * (The radius is used to define the maximum distance for shooting the rays.)
 * The 'num_rays' argument defines the number of rays that will be shot,
 * in a fab pattern parallel to the XY plane, with equal angle between rays.
 * More rays will result in more accurate result, but will also be slower to execute.
 * \n
 * Returns a dictionary containing different unobstructed view metrics.
 * \n
 * \n
 * @param __model__
 * @param origins A list of Rays or Planes, to be used as the origins for calculating the uobstructed views.
 * @param entities The obstructions: faces, polygons, or collections.
 * @param radius The maximum radius of the uobstructed views.
 * @param num_rays The number of rays to generate when calculating uobstructed views.
 * @param view_ang The angle of the unobstructed view, in radians.
 */
export declare function View(__model__: GIModel, origins: TRay[] | TPlane[], entities: TId | TId[] | TId[][], radius: number, num_rays: number, view_ang: number): TViewResult;
export {};
