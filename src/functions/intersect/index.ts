/**
 * The `intersect` module has functions for calculating intersections between different types of entities.
 * @module
*/
import { Sim } from '../../mobius_sim';
import { TPlane, TRay } from '../_common/consts';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

import { PlaneEdge } from './PlaneEdge';
import { RayFace } from './RayFace';

export { RayFace };
export { PlaneEdge };

// CLASS DEFINITION
export class IntersectFunc {

    public __model__: Sim;
    public debug: boolean;
    constructor(model: Sim, debug: boolean) {
        this.__model__ = model;
        this.debug = debug;
    }
    PlaneEdge(plane: TRay | TPlane, entities: string | string[]): any {
        return PlaneEdge(this.__model__, plane, entities);
    }
    RayFace(ray: TRay, entities: string | string[]): any {
        return RayFace(this.__model__, ray, entities);
    }

}
