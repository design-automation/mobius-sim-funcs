import { GIModel, TId, TPlane, TRay } from '@design-automation/mobius-sim';
interface TWindResult {
    wind: number[];
}
/**
 * Calculate an approximation of the wind frequency for a set sensors positioned at specified
 * locations.
 * \n
 * @param __model__
 * @param sensors A list of Rays or a list of Planes, to be used as the
 * sensors for calculating wind.
 * @param entities The obstructions, polygons, or collections of polygons.
 * @param radius The max distance for raytracing.
 * @param num_rays An integer specifying the number of rays to generate in each wind direction.
 * @param layers Three numbers specifying layers of rays, as [start, stop, step] relative to the
 * sensors.
 * @returns A dictionary containing wind results.
 */
export declare function Wind(__model__: GIModel, sensors: TRay[] | TPlane[] | TRay[][] | TPlane[][], entities: TId | TId[] | TId[][], radius: number | [number, number], num_rays: number, layers: number | [number, number] | [number, number, number]): TWindResult | [TWindResult, TWindResult];
export {};
