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
export declare class ModifyFunc {
    __model__: GIModel;
    constructor(model: GIModel);
    Mirror(entities: any, plane: any): void;
    Move(entities: any, vectors: any): void;
    Offset(entities: any, dist: any): void;
    Remesh(entities: any): void;
    Rotate(entities: any, ray: any, angle: any): void;
    Scale(entities: any, plane: any, scale: any): void;
    XForm(entities: any, from_plane: any, to_plane: any): void;
}