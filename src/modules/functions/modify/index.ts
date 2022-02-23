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
    Mirror(entities, plane): void {
        Mirror(this.__model__, entities, plane);
    }
    Move(entities, vectors): void {
        Move(this.__model__, entities, vectors);
    }
    Offset(entities, dist): void {
        Offset(this.__model__, entities, dist);
    }
    Remesh(entities): void {
        Remesh(this.__model__, entities);
    }
    Rotate(entities, ray, angle): void {
        Rotate(this.__model__, entities, ray, angle);
    }
    Scale(entities, plane, scale): void {
        Scale(this.__model__, entities, plane, scale);
    }
    XForm(entities, from_plane, to_plane): void {
        XForm(this.__model__, entities, from_plane, to_plane);
    }

}