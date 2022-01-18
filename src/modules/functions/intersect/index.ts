/**
 * The `intersect` module has functions for calculating intersections between different types of entities.
 * @module
*/
import { GIModel } from '@design-automation/mobius-sim';

import { PlaneEdge } from './PlaneEdge';
import { RayFace } from './RayFace';

export { RayFace };
export { PlaneEdge };

// CLASS DEFINITION
export class IntersectFunc {

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    async PlaneEdge(plane, entities): Promise<any> {
        return PlaneEdge(this.__model__, plane, entities);
    }
    async RayFace(ray, entities): Promise<any> {
        return RayFace(this.__model__, ray, entities);
    }

}
