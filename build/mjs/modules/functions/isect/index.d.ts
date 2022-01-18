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
export declare class IsectFunc {
    __enum__: {
        /**
         * The `isect` module has functions for performing intersections between entities in the model.
         * These functions may make new entities, and may modify existing entities, depending on the function that is selected.
         * If new entities are created, then the function will return the IDs of those entities.
         * @module
         */
        _EKnifeKeep: typeof Enum._EKnifeKeep;
    };
    __model__: GIModel;
    constructor(model: GIModel);
    Intersect(entities1: any, entities2: any): Promise<any>;
    Knife(geometry: any, plane: any, keep: any): Promise<any>;
    Split(geometry: any, polyline: any): Promise<any>;
}
