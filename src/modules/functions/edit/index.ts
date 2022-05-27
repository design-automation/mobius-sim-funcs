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

// CLASS DEFINITION
export class EditFunc {
    __enum__ = {
        ...Enum
    }

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Delete(entities: string | string[], method: Enum._EDeleteMethod): void {
        Delete(this.__model__, entities, method);
    }
    Divide(entities: string | string[], divisor: number, method: Enum._EDivisorMethod): any {
        return Divide(this.__model__, entities, divisor, method);
    }
    Fuse(entities: string | string[], tolerance: number): any {
        return Fuse(this.__model__, entities, tolerance);
    }
    Hole(pgon: string, entities: string | string[] | string[][]): any {
        return Hole(this.__model__, pgon, entities);
    }
    Reverse(entities: string | string[]): void {
        Reverse(this.__model__, entities);
    }
    Ring(entities: string | string[], method: Enum._ERingMethod): void {
        Ring(this.__model__, entities, method);
    }
    Shift(entities: string | string[], offset: number): void {
        Shift(this.__model__, entities, offset);
    }
    Weld(entities: string | string[], method: Enum._EWeldMethod): any {
        return Weld(this.__model__, entities, method);
    }

}
