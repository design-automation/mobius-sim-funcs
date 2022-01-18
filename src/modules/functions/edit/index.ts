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
    async Delete(entities, method): Promise<void> {
        Delete(this.__model__, entities, method);
    }
    async Divide(entities, divisor, method): Promise<any> {
        return Divide(this.__model__, entities, divisor, method);
    }
    async Fuse(entities, tolerance): Promise<any> {
        return Fuse(this.__model__, entities, tolerance);
    }
    async Hole(pgon, entities): Promise<any> {
        return Hole(this.__model__, pgon, entities);
    }
    async Reverse(entities): Promise<void> {
        Reverse(this.__model__, entities);
    }
    async Ring(entities, method): Promise<void> {
        Ring(this.__model__, entities, method);
    }
    async Shift(entities, offset): Promise<void> {
        Shift(this.__model__, entities, offset);
    }
    async Weld(entities, method): Promise<any> {
        return Weld(this.__model__, entities, method);
    }

}
