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


// CLASS DEFINITION
export class MakeFunc {
    __enum__ = {
        ...Enum
    }

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    async Clone(entities): Promise<any> {
        return Clone(this.__model__, entities);
    }
    async Copy(entities, vector): Promise<any> {
        return Copy(this.__model__, entities, vector);
    }
    async Cut(entities, plane, method): Promise<any> {
        return Cut(this.__model__, entities, plane, method);
    }
    async Extrude(entities, dist, divisions, method): Promise<any> {
        return Extrude(this.__model__, entities, dist, divisions, method);
    }
    async Join(entities): Promise<any> {
        return Join(this.__model__, entities);
    }
    async Loft(entities, divisions, method): Promise<any> {
        return Loft(this.__model__, entities, divisions, method);
    }
    async Point(entities): Promise<any> {
        return Point(this.__model__, entities);
    }
    async Polygon(entities): Promise<any> {
        return Polygon(this.__model__, entities);
    }
    async Polyline(entities, close): Promise<any> {
        return Polyline(this.__model__, entities, close);
    }
    async Position(coords): Promise<any> {
        return Position(this.__model__, coords);
    }
    async Sweep(entities, x_section, divisions, method): Promise<any> {
        return Sweep(this.__model__, entities, x_section, divisions, method);
    }

}
