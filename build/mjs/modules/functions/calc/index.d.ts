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
export { Distance };
export { Length };
export { Area };
export { Vector };
export { Centroid };
export { Normal };
export { Eval };
export { Ray };
export { Plane };
export { BBox };
export declare class CalcFunc {
    __model__: GIModel;
    __enum__: {
        /**
         * The `calc` module has functions for performing various types of calculations with entities in the model.
         * These functions neither make nor modify anything in the model.
         * These functions all return either numbers or lists of numbers.
         * @module
         */
        _ECentroidMethod: typeof Enum._ECentroidMethod;
        _EDistanceMethod: typeof Enum._EDistanceMethod;
    };
    constructor(model: GIModel);
    Distance(entities1: any, entities2: any, method: any): any;
    Length(entities: any): any;
    Area(entities: any): any;
    Vector(entities: any): any;
    Centroid(entities: any, method: any): any;
    Normal(entities: any, scale: any): any;
    Eval(entities: any, t_param: any): any;
    Ray(entities: any): any;
    Plane(entities: any): any;
    BBox(entities: any): any;
}
