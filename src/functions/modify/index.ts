/**
 * The `modify` module has functions for modifying existing entities in the model.
 * These functions do not make any new entities, and they do not change the topology of objects.
 * These functions only change attribute values.
 * All these functions have no return value.
 * @module
 */
import { ENT_TYPE, Sim } from '../../mobius_sim';
import { TPlane, TRay, Txyz } from '../_common/consts';
import { getPlane } from '../_common/getPlane';
import { getRay } from '../_common/getRay';

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
        // --- Error Check ---
        const fn_name = 'modify.Mirror';
        if (this.debug) {
            checkIDs(this.__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
                [ENT_TYPE.POSI, ENT_TYPE.VERT, ENT_TYPE.EDGE, ENT_TYPE.WIRE,
                ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
        } 
        // does plane go outside or inside
        plane = getPlane(this.__model__, plane, fn_name) as TPlane;
        // --- Error Check ---    
        Mirror(this.__model__, entities, plane);
    }
    Move(entities: string | string[], vectors: Txyz | Txyz[]): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'modify.Move';
            checkIDs(this.__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null) as string[];
            chk.checkArgs(fn_name, 'vectors', vectors, [chk.isXYZ, chk.isXYZL]);
        } 
        // --- Error Check ---    
        Move(this.__model__, entities, vectors);
    }
    Offset(entities: string | string[], dist: number): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'modify.Offset';
            checkIDs(this.__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
                [ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
            chk.checkArgs(fn_name, 'dist', dist, [chk.isNum]);
        } 
        // --- Error Check ---
        Offset(this.__model__, entities, dist);
    }
    Remesh(entities: string[]): void {
        // --- Error Check ---
        if (this.debug) {
            checkIDs(this.__model__, 'modify.Remesh', 'entities', entities,
            [ID.isID, ID.isIDL1], [ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
        } 
        // --- Error Check ---
        Remesh(this.__model__, entities);
    }
    Rotate(entities: string | string[], ray: string | string[] | Txyz | TRay | TPlane, angle: number): void {
        // --- Error Check ---
        const fn_name = 'modify.Rotate';
        if (this.debug) {
            checkIDs(this.__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
                [ENT_TYPE.POSI, ENT_TYPE.VERT, ENT_TYPE.EDGE, ENT_TYPE.WIRE,
                ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
            chk.checkArgs(fn_name, 'angle', angle, [chk.isNum]);
        }
        // does ray go outside or inside
        ray = getRay(this.__model__, ray, fn_name) as TRay;
        // --- Error Check ---        
        Rotate(this.__model__, entities, ray, angle);
    }
    Scale(entities: string | string[], plane: string | string[] | Txyz | TRay | TPlane, scale: number | Txyz): void {
        // --- Error Check ---
        const fn_name = 'modify.Scale';
        let ents_arr: string[];
        if (this.debug) {
            ents_arr = checkIDs(this.__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
                [ENT_TYPE.POSI, ENT_TYPE.VERT, ENT_TYPE.EDGE, ENT_TYPE.WIRE,
                ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
            chk.checkArgs(fn_name, 'scale', scale, [chk.isNum, chk.isXYZ]);
        } 
        // does plane go outside or inside
        plane = getPlane(this.__model__, plane, fn_name) as TPlane;
        // --- Error Check ---        
        Scale(this.__model__, entities, plane, scale);
    }
    XForm(entities: string | string[], from_plane: string | string[] | Txyz | TRay | TPlane, to_plane: string | string[] | Txyz | TRay | TPlane): void {
        // --- Error Check ---
        const fn_name = 'modify.XForm';
        let ents_arr: string[];
        if (this.debug) {
            ents_arr = checkIDs(this.__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
                [ENT_TYPE.POSI, ENT_TYPE.VERT, ENT_TYPE.EDGE, ENT_TYPE.WIRE,
                ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
        } 
        // does plane go outside or inside
        from_plane = getPlane(this.__model__, from_plane, fn_name) as TPlane;
        to_plane = getPlane(this.__model__, to_plane, fn_name) as TPlane;
        // --- Error Check ---        
        XForm(this.__model__, entities, from_plane, to_plane);
    }

}
