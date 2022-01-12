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

export class CalcFunc {
    __model__: GIModel;
    __enum__ = {
        ...Enum
    }
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Distance(entities1, entities2, method): any {
        return Distance(this.__model__, entities1, entities2, method);
    }
    Length(entities): any {
        return Length(this.__model__, entities);
    }
    Area(entities): any {
        return Area(this.__model__, entities);
    }
    Vector(entities): any {
        return Vector(this.__model__, entities);
    }
    Centroid(entities, method): any {
        return Centroid(this.__model__, entities, method);
    }
    Normal(entities, scale): any {
        return Normal(this.__model__, entities, scale);
    }
    Eval(entities, t_param): any {
        return Eval(this.__model__, entities, t_param);
    }
    Ray(entities): any {
        return Ray(this.__model__, entities);
    }
    Plane(entities): any {
        return Plane(this.__model__, entities);
    }
    BBox(entities): any {
        return BBox(this.__model__, entities);
    }
}
