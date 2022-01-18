/**
 * The `isect` module has functions for performing intersections between entities in the model.
 * These functions may make new entities, and may modify existing entities, depending on the function that is selected.
 * If new entities are created, then the function will return the IDs of those entities.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';

import * as Enum from './_enum';
import { Intersect } from './Intersect';
import { Knife } from './Knife';
import { Split } from './Split';

export { Intersect };
export { Knife };
export { Split };

// CLASS DEFINITION
export class IsectFunc {
    __enum__ = {
        ...Enum
    }

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    async Intersect(entities1, entities2): Promise<any> {
        return Intersect(this.__model__, entities1, entities2);
    }
    async Knife(geometry, plane, keep): Promise<any> {
        return Knife(this.__model__, geometry, plane, keep);
    }
    async Split(geometry, polyline): Promise<any> {
        return Split(this.__model__, geometry, polyline);
    }

}
