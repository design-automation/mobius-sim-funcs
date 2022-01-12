import { GIModel } from '@design-automation/mobius-sim';
import * as Enum from './_enum';
import { Intersect } from './Intersect';
import { Knife } from './Knife';
import { Split } from './Split';
export { Intersect };
export { Knife };
export { Split };
export declare class AnalyzeFunc {
    __model__: GIModel;
    __enum__: {
        _EKnifeKeep: typeof Enum._EKnifeKeep;
    };
    constructor(model: GIModel);
    Intersect(entities1: any, entities2: any): any;
    Knife(geometry: any, plane: any, keep: any): any;
    Split(geometry: any, polyline: any): any;
}
