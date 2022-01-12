import { GIModel } from '@design-automation/mobius-sim';
import * as Enum from './_enum';
import { Delete } from './Delete';
import { Divide } from './Divide';
import { Fuse } from './Fuse';
import { Hole } from './Hole';
import { Reverse } from './Reverse';
import { Ring } from './Ring';
import { Shift } from './Shift';
import { Weld } from './Weld';
export { Divide };
export { Hole };
export { Weld };
export { Fuse };
export { Ring };
export { Shift };
export { Reverse };
export { Delete };
export declare class EditFunc {
    __model__: GIModel;
    __enum__: {
        _EDeleteMethod: typeof Enum._EDeleteMethod;
        _EDivisorMethod: typeof Enum._EDivisorMethod;
        _EWeldMethod: typeof Enum._EWeldMethod;
        _ERingMethod: typeof Enum._ERingMethod;
    };
    constructor(model: GIModel);
    Divide(entities: any, divisor: any, method: any): any;
    Hole(pgon: any, entities: any): any;
    Weld(entities: any, method: any): any;
    Fuse(entities: any, tolerance: any): any;
    Ring(entities: any, method: any): any;
    Shift(entities: any, offset: any): any;
    Reverse(entities: any): any;
    Delete(entities: any, method: any): any;
}
