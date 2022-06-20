/**
 * The `isect` module has functions for performing intersections between entities in the model.
 * These functions may make new entities, and may modify existing entities, depending on the function that is selected.
 * If new entities are created, then the function will return the IDs of those entities.
 * @module
 */
import { Sim } from '../../mobius_sim';
import { TPlane } from '../_common/consts';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

import * as Enum from './_enum';
import { Intersect } from './Intersect';
import { Knife } from './Knife';
import { Split } from './Split';

export { Intersect };
export { Knife };
export { Split };

// CLASS DEFINITION
export class IsectFunc {

    // Document Enums here
    __enum__ = {
        Knife: {
            keep: Enum._EKnifeKeep
        },
    };


    public __model__: Sim;
    public debug: boolean;
    constructor(model: Sim, debug: boolean) {
        this.__model__ = model;
        this.debug = debug;
    }
    Intersect(entities1: string, entities2: string): any {
        return Intersect(this.__model__, entities1, entities2);
    }
    Knife(geometry: string[], plane: TPlane, keep: Enum._EKnifeKeep): any {
        return Knife(this.__model__, geometry, plane, keep);
    }
    Split(geometry: string[], polyline: string): any {
        return Split(this.__model__, geometry, polyline);
    }

}
