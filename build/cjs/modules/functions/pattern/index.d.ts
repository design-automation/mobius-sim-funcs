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
export declare class PatternFunc {
    __enum__: {
        /**
         * The `pattern` module has functions for creating patters of positions.
         * These functions all return lists of position IDs.
         * The list may be nested, depending on which function is selected.
         * @module
         */
        _EBoxMethod: typeof Enum._EBoxMethod;
        _EGridMethod: typeof Enum._EGridMethod;
        _ECurveCatRomType: typeof Enum._ECurveCatRomType;
        _EClose: typeof Enum._EClose;
        _EPolyhedronMethod: typeof Enum._EPolyhedronMethod;
    };
    __model__: GIModel;
    constructor(model: GIModel);
    Arc(origin: any, radius: any, num_positions: any, arc_angle: any): Promise<any>;
    Bezier(coords: any, num_positions: any): Promise<any>;
    Box(origin: any, size: any, num_positions: any, method: any): Promise<any>;
    Grid(origin: any, size: any, num_positions: any, method: any): Promise<any>;
    Interpolate(coords: any, type: any, tension: any, close: any, num_positions: any): Promise<any>;
    Line(origin: any, length: any, num_positions: any): Promise<any>;
    Linear(coords: any, close: any, num_positions: any): Promise<any>;
    Nurbs(coords: any, degree: any, close: any, num_positions: any): Promise<any>;
    Polyhedron(origin: any, radius: any, detail: any, method: any): Promise<any>;
    Rectangle(origin: any, size: any): Promise<any>;
}
