/**
 * The `make` module has functions for making new entities in the model.
 * All these functions return the IDs of the entities that are created.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';
import * as Enum from './_enum';
import { Clone } from './Clone';
import { Copy } from './Copy';
import { Cut } from './Cut';
import { Extrude } from './Extrude';
import { Join } from './Join';
import { Loft } from './Loft';
import { Point } from './Point';
import { Polygon } from './Polygon';
import { Polyline } from './Polyline';
import { Position } from './Position';
import { Sweep } from './Sweep';
export { Position };
export { Point };
export { Polyline };
export { Polygon };
export { Loft };
export { Extrude };
export { Sweep };
export { Join };
export { Cut };
export { Copy };
export { Clone };
export declare class MakeFunc {
    __enum__: {
        /**
         * The `make` module has functions for making new entities in the model.
         * All these functions return the IDs of the entities that are created.
         * @module
         */
        _ECutMethod: typeof Enum._ECutMethod;
        _EExtrudeMethod: typeof Enum._EExtrudeMethod;
        _ELoftMethod: typeof Enum._ELoftMethod;
        _EClose: typeof Enum._EClose;
    };
    __model__: GIModel;
    constructor(model: GIModel);
    Clone(entities: any): Promise<any>;
    Copy(entities: any, vector: any): Promise<any>;
    Cut(entities: any, plane: any, method: any): Promise<any>;
    Extrude(entities: any, dist: any, divisions: any, method: any): Promise<any>;
    Join(entities: any): Promise<any>;
    Loft(entities: any, divisions: any, method: any): Promise<any>;
    Point(entities: any): Promise<any>;
    Polygon(entities: any): Promise<any>;
    Polyline(entities: any, close: any): Promise<any>;
    Position(coords: any): Promise<any>;
    Sweep(entities: any, x_section: any, divisions: any, method: any): Promise<any>;
}
