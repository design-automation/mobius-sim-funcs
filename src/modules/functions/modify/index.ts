/**
 * The `modify` module has functions for modifying existing entities in the model.
 * These functions do not make any new entities, and they do not change the topology of objects.
 * These functions only change attribute values.
 * All these functions have no return value.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';

import { Mirror } from './Mirror';
import { Move } from './Move';
import { Offset } from './Offset';
import { Remesh } from './Remesh';
import { Rotate } from './Rotate';
import { Scale } from './Scale';
import { XForm } from './XForm';

export { Move };
export { Rotate };
export { Scale };
export { Mirror };
export { XForm };
export { Offset };
export { Remesh };

// CLASS DEFINITION
export class ModifyFunc {

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    async Mirror(entities, plane): Promise<void> {
        Mirror(this.__model__, entities, plane);
    }
    async Move(entities, vectors): Promise<void> {
        Move(this.__model__, entities, vectors);
    }
    async Offset(entities, dist): Promise<void> {
        Offset(this.__model__, entities, dist);
    }
    async Remesh(entities): Promise<void> {
        Remesh(this.__model__, entities);
    }
    async Rotate(entities, ray, angle): Promise<void> {
        Rotate(this.__model__, entities, ray, angle);
    }
    async Scale(entities, plane, scale): Promise<void> {
        Scale(this.__model__, entities, plane, scale);
    }
    async XForm(entities, from_plane, to_plane): Promise<void> {
        XForm(this.__model__, entities, from_plane, to_plane);
    }

}
