import { GIModel, TId, TRay } from '@design-automation/mobius-sim';
/**
 * Visualises a ray or a list of rays by creating a polyline with an arrow head.
 *
 * @param __model__
 * @param rays Polylines representing the ray or rays.
 * @param scale Scales the arrow head of the vector.
 * @returns entities, a line with an arrow head representing the ray.
 * @example ray1 = visualize.Ray([[1,2,3],[0,0,1]])
 */
export declare function Ray(__model__: GIModel, rays: TRay | TRay[], scale: number): TId[];
