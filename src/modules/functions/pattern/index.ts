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

// CLASS DEFINITION
export class PatternFunc {
    __enum__ = {
        ...Enum
    }

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    async Arc(origin, radius, num_positions, arc_angle): Promise<any> {
        return Arc(this.__model__, origin, radius, num_positions, arc_angle);
    }
    async Bezier(coords, num_positions): Promise<any> {
        return Bezier(this.__model__, coords, num_positions);
    }
    async Box(origin, size, num_positions, method): Promise<any> {
        return Box(this.__model__, origin, size, num_positions, method);
    }
    async Grid(origin, size, num_positions, method): Promise<any> {
        return Grid(this.__model__, origin, size, num_positions, method);
    }
    async Interpolate(coords, type, tension, close, num_positions): Promise<any> {
        return Interpolate(this.__model__, coords, type, tension, close, num_positions);
    }
    async Line(origin, length, num_positions): Promise<any> {
        return Line(this.__model__, origin, length, num_positions);
    }
    async Linear(coords, close, num_positions): Promise<any> {
        return Linear(this.__model__, coords, close, num_positions);
    }
    async Nurbs(coords, degree, close, num_positions): Promise<any> {
        return Nurbs(this.__model__, coords, degree, close, num_positions);
    }
    async Polyhedron(origin, radius, detail, method): Promise<any> {
        return Polyhedron(this.__model__, origin, radius, detail, method);
    }
    async Rectangle(origin, size): Promise<any> {
        return Rectangle(this.__model__, origin, size);
    }

}
