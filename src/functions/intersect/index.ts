/**
 * The `intersect` module has functions for calculating intersections between different types of entities.
 * @module
*/
import { ENT_TYPE, Sim } from '../../mobius_sim';
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
    // --- Error Check ---
    if (this.debug) {
        const fn_name = 'intersect.PlaneEdge';
        chk.checkArgs(fn_name, 'plane', plane, [chk.isPln]);
        checkIDs(this.__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1],
            [ENT_TYPE.EDGE, ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string|string[];
    } 
    // --- Error Check ---        
        return PlaneEdge(this.__model__, plane, entities);
    }
    RayFace(ray: TRay, entities: string | string[]): any {
    // --- Error Check ---
    if (this.debug) {
        const fn_name = 'intersect.RayFace';
        chk.checkArgs(fn_name, 'ray', ray, [chk.isRay]);
        checkIDs(this.__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1],
            [ENT_TYPE.PGON, ENT_TYPE.COLL]) as string|string[];
    } 
    // --- Error Check ---        
        return RayFace(this.__model__, ray, entities);
    }

}
