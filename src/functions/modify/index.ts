/**
 * The `modify` module has functions for modifying existing entities in the model.
 * These functions do not make any new entities, and they do not change the topology of objects.
 * These functions only change attribute values.
 * All these functions have no return value.
 * @module
 */
import { Sim } from '../../mobius_sim';
import { TPlane, TRay, Txyz } from '../_common/consts';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

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

    public __model__: Sim;
    public debug: boolean;
    constructor(model: Sim, debug: boolean) {
        this.__model__ = model;
        this.debug = debug;
    }
    Mirror(entities: string | string[], plane: string | Txyz | TRay | TPlane | string[]): void {
        Mirror(this.__model__, entities, plane);
    }
    Move(entities: string | string[], vectors: Txyz | Txyz[]): void {
        Move(this.__model__, entities, vectors);
    }
    Offset(entities: string | string[], dist: number): void {
        Offset(this.__model__, entities, dist);
    }
    Remesh(entities: string[]): void {
        Remesh(this.__model__, entities);
    }
    Rotate(entities: string | string[], ray: string | string[] | Txyz | TRay | TPlane, angle: number): void {
        Rotate(this.__model__, entities, ray, angle);
    }
    Scale(entities: string | string[], plane: string | string[] | Txyz | TRay | TPlane, scale: number | Txyz): void {
        Scale(this.__model__, entities, plane, scale);
    }
    XForm(entities: string | string[], from_plane: string | string[] | Txyz | TRay | TPlane, to_plane: string | string[] | Txyz | TRay | TPlane): void {
        XForm(this.__model__, entities, from_plane, to_plane);
    }

}
