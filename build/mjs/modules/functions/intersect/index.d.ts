import { GIModel } from '@design-automation/mobius-sim';
import { PlaneEdge } from './PlaneEdge';
import { RayFace } from './RayFace';
export { RayFace };
export { PlaneEdge };
export declare class IntersectFunc {
    __model__: GIModel;
    constructor(model: GIModel);
    RayFace(ray: any, entities: any): any;
    PlaneEdge(plane: any, entities: any): any;
}
