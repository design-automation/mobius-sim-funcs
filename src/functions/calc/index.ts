/**
 * The `calc` module has functions for performing various types of calculations with entities in the model.
 * These functions neither make nor modify anything in the model.
 * These functions all return either numbers or lists of numbers.
 * @module
 */
import { ENT_TYPE, Sim } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

import * as Enum from './_enum';
import { Area } from './Area';
import { BBox } from './BBox';
import { Centroid } from './Centroid';
import { Distance } from './Distance';
import { Eval } from './Eval';
import { Length } from './Length';
import { Normal } from './Normal';
import { Plane } from './Plane';
import { Ray } from './Ray';
import { Vector } from './Vector';

export { Distance }

export { Length }

export { Area }

export { Vector }

export { Centroid }

export { Normal }

export { Eval }

export { Ray }

export { Plane }

export { BBox }


// CLASS DEFINITION
export class CalcFunc {

    // Document Enums here
    __enum__ = {
        Centroid: {
            method: Enum._ECentroidMethod
        },
        Distance: {
            method: Enum._EDistanceMethod
        },
    };

    public __model__: Sim;
    public debug: boolean;
    constructor(model: Sim, debug: boolean) {
        this.__model__ = model;
        this.debug = debug;
    }
    Area(entities: string | string[]): any {
        // --- Error Check ---        
        if (this.debug) {
            const fn_name = 'calc.Area';
            checkIDs(this.__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1],
            [ENT_TYPE.PGON, ENT_TYPE.PLINE, ENT_TYPE.WIRE, ENT_TYPE.COLL]) as string|string[];
        } 
        // --- Error Check ---
        return Area(this.__model__, entities);
    }
    BBox(entities: string | string[]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'calc.BBox';
            checkIDs(this.__model__, fn_name, 'entities', entities, [ID.isIDL1], null) as string[]; // all
        } 
        // --- Error Check ---
        return BBox(this.__model__, entities);
    }
    Centroid(entities: string | string[], method: Enum._ECentroidMethod): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'calc.Centroid';
            checkIDs(this.__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1], null) as string|string[];
        } 
    // --- Error Check ---
        return Centroid(this.__model__, entities, method);
    }
    Distance(entities1: string | string[], entities2: string | string[], method: Enum._EDistanceMethod): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'calc.Distance';
            checkIDs(this.__model__, fn_name, 'entities1', entities1, [ID.isID, ID.isIDL1],
                null)  as string|string[];
            checkIDs(this.__model__, fn_name, 'entities2', entities2, [ID.isIDL1],
                null) as string[];
        } 
        // --- Error Check ---
        return Distance(this.__model__, entities1, entities2, method);
    }
    Eval(entities: string | string[], t_param: number): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'calc.Eval';
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1 ],
                [ENT_TYPE.EDGE, ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string|string[];
            chk.checkArgs(fn_name, 'param', t_param, [chk.isNum01]);
        } 
        // --- Error Check ---    
        return Eval(this.__model__, entities, t_param);
    }
    Length(entities: string | string[]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'calc.Length';
            checkIDs(this.__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
            [ENT_TYPE.EDGE, ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string|string[];
        }
        // --- Error Check ---    
        return Length(this.__model__, entities);
    }
    Normal(entities: string | string[], scale: number): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'calc.Normal';
            checkIDs(this.__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1], null) as  string|string[];
            chk.checkArgs(fn_name, 'scale', scale, [chk.isNum]);
        } 
        // --- Error Check ---    
        return Normal(this.__model__, entities, scale);
    }
    Plane(entities: string | string[]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'calc.Plane';
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1, ID.isIDL2], null) as string|string[]; // takes in any
        }
        // --- Error Check ---    
        return Plane(this.__model__, entities);
    }
    Ray(entities: string | string[]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'calc.Ray';
            checkIDs(this.__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1, ID.isIDL2], [ENT_TYPE.EDGE, ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON]) as string|string[];
        } 
        // --- Error Check ---    
        return Ray(this.__model__, entities);
    }
    Vector(entities: string | string[]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'calc.Vector';
            checkIDs(this.__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1],
            [ENT_TYPE.PGON, ENT_TYPE.PLINE, ENT_TYPE.WIRE, ENT_TYPE.EDGE]) as string|string[];
        } 
        // --- Error Check ---    
        return Vector(this.__model__, entities);
    }

}
