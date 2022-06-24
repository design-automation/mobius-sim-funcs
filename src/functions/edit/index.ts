/**
 * The `edit` module has functions for editing entities in the model.
 * These function modify the topology of objects: vertices, edges, wires and faces.
 * Some functions return the IDs of the entities that are created or modified.
 * @module
 */
import { Sim, ENT_TYPE } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

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

    // Document Enums here
    __enum__ = {
        Delete: {
            method: Enum._EDeleteMethod
        },
        Divide: {
            method: Enum._EDivisorMethod
        },
        Ring: {
            method: Enum._ERingMethod
        },
        Weld: {
            method: Enum._EWeldMethod
        },
    };

    public __model__: Sim;
    public debug: boolean;
    constructor(model: Sim, debug: boolean) {
        this.__model__ = model;
        this.debug = debug;
    }
    Delete(entities: string | string[], method: Enum._EDeleteMethod): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'edit.Delete';
            checkIDs(this.__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1],
            [ENT_TYPE.POSI, ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
        } 
        // --- Error Check ---    
        Delete(this.__model__, entities, method);
    }
    Divide(entities: string | string[], divisor: number, method: Enum._EDivisorMethod): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'edit.Divide';
            checkIDs(this.__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1], [ENT_TYPE.EDGE, ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON]) as string[];
            chk.checkArgs(fn_name, 'divisor', divisor, [chk.isNum]);
        }
        // --- Error Check ---
        return Divide(this.__model__, entities, divisor, method);
    }
    Fuse(entities: string | string[], tolerance: number): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'edit.Fuse';
            checkIDs(this.__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1], null) as string[];
        } 
        // --- Error Check ---
        return Fuse(this.__model__, entities, tolerance);
    }
    Hole(pgon: string, entities: string | string[] | string[][]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'edit.Hole';
            checkIDs(this.__model__, fn_name, 'pgon', pgon, [ID.isID], [ENT_TYPE.PGON]) as string;
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1, ID.isIDL2],
                [ENT_TYPE.POSI, ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON]) as string[]|string[][];
        }
        // --- Error Check ---    
        return Hole(this.__model__, pgon, entities);
    }
    Reverse(entities: string | string[]): void {
        // --- Error Check ---
        if (this.debug) {
            checkIDs(this.__model__, 'edit.Reverse', 'entities', entities,
                [ID.isID, ID.isIDL1],
                [ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON])  as string[];
        } 
        // --- Error Check ---        
        Reverse(this.__model__, entities);
    }
    Ring(entities: string | string[], method: Enum._ERingMethod): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'edit.Ring';
            checkIDs(this.__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1], [ENT_TYPE.PLINE]) as string[];
        } 
        // --- Error Check ---        
        Ring(this.__model__, entities, method);
    }
    Shift(entities: string | string[], offset: number): void {
        // --- Error Check ---
        if (this.debug) {
            checkIDs(this.__model__, 'edit.Reverse', 'entities', entities,
            [ID.isID, ID.isIDL1],
            [ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON])  as string[];
        }
        // --- Error Check ---        
        Shift(this.__model__, entities, offset);
    }
    Weld(entities: string | string[], method: Enum._EWeldMethod): any {
    // --- Error Check ---
    if (this.debug) {
        const fn_name = 'edit.Weld';
        checkIDs(this.__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
            [ENT_TYPE.VERT, ENT_TYPE.EDGE, ENT_TYPE.WIRE,
            ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
    } 
    // --- Error Check ---        
        return Weld(this.__model__, entities, method);
    }

}
