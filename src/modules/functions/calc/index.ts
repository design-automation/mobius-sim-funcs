/**
 * The `calc` module has functions for performing various types of calculations with entities in the model.
 * These functions neither make nor modify anything in the model.
 * These functions all return either numbers or lists of numbers.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';

import * as Enum from './_enum';
import { Area } from './Area';
import { BBox } from './BBox';
import { Centroid } from './Centroid';
import { Distance } from './Distance';
import { Eval } from './Eval';
import { Length } from './Length';
import { Normal } from './Normal';
import { Plane } from './Plane';
import { Ray } from './Ray';
import { Vector } from './Vector';

export { Distance }

export { Length }

export { Area }

export { Vector }

export { Centroid }

export { Normal }

export { Eval }

export { Ray }

export { Plane }

export { BBox }


// CLASS DEFINITION
export class CalcFunc {
    __enum__ = {
        ...Enum
    }

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    async Area(entities): Promise<any> {
        return Area(this.__model__, entities);
    }
    async BBox(entities): Promise<any> {
        return BBox(this.__model__, entities);
    }
    async Centroid(entities, method): Promise<any> {
        return Centroid(this.__model__, entities, method);
    }
    async Distance(entities1, entities2, method): Promise<any> {
        return Distance(this.__model__, entities1, entities2, method);
    }
    async Eval(entities, t_param): Promise<any> {
        return Eval(this.__model__, entities, t_param);
    }
    async Length(entities): Promise<any> {
        return Length(this.__model__, entities);
    }
    async Normal(entities, scale): Promise<any> {
        return Normal(this.__model__, entities, scale);
    }
    async Plane(entities): Promise<any> {
        return Plane(this.__model__, entities);
    }
    async Ray(entities): Promise<any> {
        return Ray(this.__model__, entities);
    }
    async Vector(entities): Promise<any> {
        return Vector(this.__model__, entities);
    }

}
