/**
 * The `intersect` module has functions for calculating intersections between different types of entities.
 * @module
*/
import { GIModel } from '@design-automation/mobius-sim';
import { PlaneEdge } from './PlaneEdge';
import { RayFace } from './RayFace';
export { RayFace };
export { PlaneEdge };
export declare class IntersectFunc {
    __model__: GIModel;
    constructor(model: GIModel);
    PlaneEdge(plane: any, entities: any): Promise<any>;
    RayFace(ray: any, entities: any): Promise<any>;
}
