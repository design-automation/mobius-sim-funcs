/**
 * The `edit` module has functions for editing entities in the model.
 * These function modify the topology of objects: vertices, edges, wires and faces.
 * Some functions return the IDs of the entities that are created or modified.
 * @module
 */
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
    __enum__: {
        /**
         * The `edit` module has functions for editing entities in the model.
         * These function modify the topology of objects: vertices, edges, wires and faces.
         * Some functions return the IDs of the entities that are created or modified.
         * @module
         */
        _EDeleteMethod: typeof Enum._EDeleteMethod;
        _EDivisorMethod: typeof Enum._EDivisorMethod;
        _EWeldMethod: typeof Enum._EWeldMethod;
        _ERingMethod: typeof Enum._ERingMethod;
    };
    __model__: GIModel;
    constructor(model: GIModel);
    Delete(entities: any, method: any): void;
    Divide(entities: any, divisor: any, method: any): any;
    Fuse(entities: any, tolerance: any): any;
    Hole(pgon: any, entities: any): any;
    Reverse(entities: any): void;
    Ring(entities: any, method: any): void;
    Shift(entities: any, offset: any): void;
    Weld(entities: any, method: any): any;
}
