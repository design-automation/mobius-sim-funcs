/**
 * The `make` module has functions for making new entities in the model.
 * All these functions return the IDs of the entities that are created.
 * @module
 */
import { GIModel, Txyz, TPlane } from '@design-automation/mobius-sim';

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


// CLASS DEFINITION
export class MakeFunc {
    __enum__ = {
        ...Enum
    }

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Clone(entities: string | string[] | string[][]): any {
        return Clone(this.__model__, entities);
    }
    Copy(entities: string | string[] | string[][], vector: Txyz | Txyz[]): any {
        return Copy(this.__model__, entities, vector);
    }
    Cut(entities: string | string[], plane: TPlane, method: Enum._ECutMethod): any {
        return Cut(this.__model__, entities, plane, method);
    }
    Extrude(entities: string | string[], dist: number | Txyz, divisions: number, method: Enum._EExtrudeMethod): any {
        return Extrude(this.__model__, entities, dist, divisions, method);
    }
    Join(entities: string[]): any {
        return Join(this.__model__, entities);
    }
    Loft(entities: string[] | string[][], divisions: number, method: Enum._ELoftMethod): any {
        return Loft(this.__model__, entities, divisions, method);
    }
    Point(entities: string | string[] | string[][]): any {
        return Point(this.__model__, entities);
    }
    Polygon(entities: string | string[] | string[][]): any {
        return Polygon(this.__model__, entities);
    }
    Polyline(entities: string | string[] | string[][], close: Enum._EClose): any {
        return Polyline(this.__model__, entities, close);
    }
    Position(coords: Txyz | Txyz[] | Txyz[][]): any {
        return Position(this.__model__, coords);
    }
    Sweep(entities: string | string[], x_section: string, divisions: number, method: Enum._EExtrudeMethod): any {
        return Sweep(this.__model__, entities, x_section, divisions, method);
    }

}
