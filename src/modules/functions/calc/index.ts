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

    // Document Enums here
    __enum__ = {
        Centroid: {
            method: Enum._ECentroidMethod
        },
        Distance: {
            method: Enum._EDistanceMethod
        },
    };

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Area(entities: string | string[]): any {
        return Area(this.__model__, entities);
    }
    BBox(entities: string | string[]): any {
        return BBox(this.__model__, entities);
    }
    Centroid(entities: string | string[], method: Enum._ECentroidMethod): any {
        return Centroid(this.__model__, entities, method);
    }
    Distance(entities1: string | string[], entities2: string | string[], method: Enum._EDistanceMethod): any {
        return Distance(this.__model__, entities1, entities2, method);
    }
    Eval(entities: string | string[], t_param: number): any {
        return Eval(this.__model__, entities, t_param);
    }
    Length(entities: string | string[]): any {
        return Length(this.__model__, entities);
    }
    Normal(entities: string | string[], scale: number): any {
        return Normal(this.__model__, entities, scale);
    }
    Plane(entities: string | string[]): any {
        return Plane(this.__model__, entities);
    }
    Ray(entities: string | string[]): any {
        return Ray(this.__model__, entities);
    }
    Vector(entities: string | string[]): any {
        return Vector(this.__model__, entities);
    }

}
