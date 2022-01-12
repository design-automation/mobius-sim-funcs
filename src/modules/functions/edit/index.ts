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
export class EditFunc {
    __model__: GIModel;
    __enum__ = {
        ...Enum
    }
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Divide(entities, divisor, method): any {
        return Divide(this.__model__, entities, divisor, method);
    }
    Hole(pgon, entities): any {
        return Hole(this.__model__, pgon, entities);
    }
    Weld(entities, method): any {
        return Weld(this.__model__, entities, method);
    }
    Fuse(entities, tolerance): any {
        return Fuse(this.__model__, entities, tolerance);
    }
    Ring(entities, method): any {
        return Ring(this.__model__, entities, method);
    }
    Shift(entities, offset): any {
        return Shift(this.__model__, entities, offset);
    }
    Reverse(entities): any {
        return Reverse(this.__model__, entities);
    }
    Delete(entities, method): any {
        return Delete(this.__model__, entities, method);
    }
}
