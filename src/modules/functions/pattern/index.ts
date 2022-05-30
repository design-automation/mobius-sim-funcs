/**
 * The `pattern` module has functions for creating patterns of positions.
 * These functions all return lists of position IDs.
 * The list may be nested, depending on which function is selected.
 * @module
 */
import { GIModel, TPlane, Txyz } from '@design-automation/mobius-sim';

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
    };


    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Arc(origin: Txyz | TPlane, radius: number, num_positions: number, arc_angle: number | [number, number]): any {
        return Arc(this.__model__, origin, radius, num_positions, arc_angle);
    }
    Bezier(coords: Txyz[], num_positions: number): any {
        return Bezier(this.__model__, coords, num_positions);
    }
    Box(origin: Txyz | TPlane, size: number | [number, number] | [number, number, number], num_positions: number | [number, number] | [number, number, number], method: Enum._EBoxMethod): any {
        return Box(this.__model__, origin, size, num_positions, method);
    }
    Grid(origin: Txyz | TPlane, size: number | [number, number], num_positions: number | [number, number], method: Enum._EGridMethod): any {
        return Grid(this.__model__, origin, size, num_positions, method);
    }
    Interpolate(coords: Txyz[], type: Enum._ECurveCatRomType, tension: number, close: Enum._EClose, num_positions: number): any {
        return Interpolate(this.__model__, coords, type, tension, close, num_positions);
    }
    Line(origin: Txyz | TPlane, length: number, num_positions: number): any {
        return Line(this.__model__, origin, length, num_positions);
    }
    Linear(coords: Txyz[], close: Enum._EClose, num_positions: number): any {
        return Linear(this.__model__, coords, close, num_positions);
    }
    Nurbs(coords: Txyz[], degree: number, close: Enum._EClose, num_positions: number): any {
        return Nurbs(this.__model__, coords, degree, close, num_positions);
    }
    Polyhedron(origin: Txyz | TPlane, radius: number, detail: number, method: Enum._EPolyhedronMethod): any {
        return Polyhedron(this.__model__, origin, radius, detail, method);
    }
    Rectangle(origin: Txyz | TPlane, size: number | [number, number]): any {
        return Rectangle(this.__model__, origin, size);
    }

}
