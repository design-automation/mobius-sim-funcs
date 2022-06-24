/**
 * The `pattern` module has functions for creating patterns of positions.
 * These functions all return lists of position IDs.
 * The list may be nested, depending on which function is selected.
 * @module
 */
import { Sim } from '../../mobius_sim';
import { TPlane, Txyz } from '../_common/consts';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

import * as Enum from './_enum';
import { Arc } from './Arc';
import { Bezier } from './Bezier';
import { Box } from './Box';
import { Grid } from './Grid';
import { Interpolate } from './Interpolate';
import { Line } from './Line';
import { Linear } from './Linear';
import { Nurbs } from './Nurbs';
import { Polyhedron } from './Polyhedron';
import { Rectangle } from './Rectangle';

export { Line };
export { Linear };
export { Rectangle };
export { Grid };
export { Box };
export { Polyhedron };
export { Arc };
export { Bezier };
export { Nurbs };
export { Interpolate };

// CLASS DEFINITION
export class PatternFunc {

    // Document Enums here
    __enum__ = {
        Grid: {
            method: Enum._EGridMethod
        },
        Interpolate: {
            type: Enum._ECurveCatRomType, close: Enum._EClose
        },
        Linear: {
            close: Enum._EClose
        },
        Nurbs: {
            close: Enum._EClose
        },
        Polyhedron: {
            method: Enum._EPolyhedronMethod
        },
        Box: {
            method: Enum._EBoxMethod
        },
    };


    public __model__: Sim;
    public debug: boolean;
    constructor(model: Sim, debug: boolean) {
        this.__model__ = model;
        this.debug = debug;
    }
    Arc(origin: Txyz | TPlane, radius: number, num_positions: number, arc_angle: number | [number, number]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'pattern.Arc';
            chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
            chk.checkArgs(fn_name, 'radius', radius, [chk.isNum]);
            chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
            chk.checkArgs(fn_name, 'arc_angle', arc_angle, [chk.isNum, chk.isNumL, chk.isNull]);
            if (Array.isArray(arc_angle)) {
                if (arc_angle.length !== 2) {
                    throw new Error('pattern.Arc: If the "arc_angle" is given as a list of numbers, \
                    then the list must contain exactly two angles (in radians).');
                }
            }
        }
        // --- Error Check ---    
        return Arc(this.__model__, origin, radius, num_positions, arc_angle);
    }
    Bezier(coords: Txyz[], num_positions: number): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'pattern.Bezier';
            chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL]);
            chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
        }
        // --- Error Check ---    
        return Bezier(this.__model__, coords, num_positions);
    }
    Box(origin: Txyz | TPlane, size: number | [number, number] | [number, number, number], num_positions: number | [number, number] | [number, number, number], method: Enum._EBoxMethod): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'pattern.Box';
            chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
            chk.checkArgs(fn_name, 'size', size, [chk.isNum, chk.isXY, chk.isXYZ]);
        }
        // --- Error Check ---    
        return Box(this.__model__, origin, size, num_positions, method);
    }
    Grid(origin: Txyz | TPlane, size: number | [number, number], num_positions: number | [number, number], method: Enum._EGridMethod): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'pattern.Grid';
            chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
            chk.checkArgs(fn_name, 'size', size, [chk.isNum, chk.isXY]);
            chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt, chk.isXYInt]);
        }
        // --- Error Check ---    
        return Grid(this.__model__, origin, size, num_positions, method);
    }
    Interpolate(coords: Txyz[], type: Enum._ECurveCatRomType, tension: number, close: Enum._EClose, num_positions: number): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'pattern.Interpolate';
            chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL]);
            chk.checkArgs(fn_name, 'tension', tension, [chk.isNum01]);
            chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
            if (coords.length < 3) {
                throw new Error(fn_name + ': "coords" should be a list of at least three XYZ coords.');
            }
        }
        // --- Error Check ---s    
        return Interpolate(this.__model__, coords, type, tension, close, num_positions);
    }
    Line(origin: Txyz | TPlane, length: number, num_positions: number): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'pattern.Line';
            chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
            chk.checkArgs(fn_name, 'length', length, [chk.isNum]);
            chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
        }
        // --- Error Check ---    
        return Line(this.__model__, origin, length, num_positions);
    }
    Linear(coords: Txyz[], close: Enum._EClose, num_positions: number): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'pattern.Linear';
            chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL]);
            chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
        }
        // --- Error Check ---    
        return Linear(this.__model__, coords, close, num_positions);
    }
    Nurbs(coords: Txyz[], degree: number, close: Enum._EClose, num_positions: number): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'pattern.Nurbs';
            chk.checkArgs(fn_name, 'coords', coords, [chk.isXYZL]);
            chk.checkArgs(fn_name, 'num_positions', num_positions, [chk.isInt]);
            if (coords.length < 3) {
                throw new Error (fn_name + ': "coords" should be a list of at least three XYZ coords.');
            }
            if (degree < 2  || degree > 5) {
                throw new Error (fn_name + ': "degree" should be between 2 and 5.');
            }
            if (degree > (coords.length - 1)) {
                throw new Error (fn_name + ': a curve of degree ' + degree + ' requires at least ' +
                    (degree + 1) + ' coords.' );
            }
        }
        // --- Error Check ---    
        return Nurbs(this.__model__, coords, degree, close, num_positions);
    }
    Polyhedron(origin: Txyz | TPlane, radius: number, detail: number, method: Enum._EPolyhedronMethod): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'pattern.Polyhedron';
            chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
            chk.checkArgs(fn_name, 'radius', radius, [chk.isNum]);
            chk.checkArgs(fn_name, 'detail', detail, [chk.isInt]);
            if (detail > 6) {
                throw new Error('pattern.Polyhedron: The "detail" argument is too high, the maximum is 6.');
            }
        }
        // --- Error Check ---    
        return Polyhedron(this.__model__, origin, radius, detail, method);
    }
    Rectangle(origin: Txyz | TPlane, size: number | [number, number]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'pattern.Rectangle';
            chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
            chk.checkArgs(fn_name, 'size', size, [chk.isNum, chk.isXY]);
        }
        // --- Error Check ---    
        return Rectangle(this.__model__, origin, size);
    }

}
