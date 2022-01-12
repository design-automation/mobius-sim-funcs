/**
 * The `pattern` module has functions for creating patters of positions.
 * These functions all return lists of position IDs.
 * The list may be nested, depending on which function is selected.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';

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
export class PatternFunc {
    __model__: GIModel;
    __enum__ = {
        ...Enum
    }
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Line(origin, length, num_positions): any {
        return Line(this.__model__, origin, length, num_positions);
    }
    Linear(coords, close, num_positions): any {
        return Linear(this.__model__, coords, close, num_positions);
    }
    Rectangle(origin, size): any {
        return Rectangle(this.__model__, origin, size);
    }
    Grid(origin, size, num_positions, method): any {
        return Grid(this.__model__, origin, size, num_positions, method);
    }
    Box(origin, size, num_positions, method): any {
        return Box(this.__model__, origin, size, num_positions, method);
    }
    Polyhedron(origin, radius, detail, method): any {
        return Polyhedron(this.__model__, origin, radius, detail, method);
    }
    Arc(origin, radius, num_positions, arc_angle): any {
        return Arc(this.__model__, origin, radius, num_positions, arc_angle);
    }
    Bezier(coords, num_positions): any {
        return Bezier(this.__model__, coords, num_positions);
    }
    Nurbs(coords, degree, close, num_positions): any {
        return Nurbs(this.__model__, coords, degree, close, num_positions);
    }
    Interpolate(coords, type, tension, close, num_positions): any {
        return Interpolate(this.__model__, coords, type, tension, close, num_positions);
    }
}
