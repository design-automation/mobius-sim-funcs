/**
 * The `poly2D` module has a set of functions for working with 2D polygons, on the XY plane.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';

import * as Enum from './_enum';
import { BBoxPolygon } from './BBoxPolygon';
import { Boolean } from './Boolean';
import { Clean } from './Clean';
import { ConvexHull } from './ConvexHull';
import { Delaunay } from './Delaunay';
import { OffsetChamfer } from './OffsetChamfer';
import { OffsetMitre } from './OffsetMitre';
import { OffsetRound } from './OffsetRound';
import { Stitch } from './Stitch';
import { Union } from './Union';
import { Voronoi } from './Voronoi';

export { Voronoi };
export { Delaunay };
export { ConvexHull };
export { BBoxPolygon };
export { Union };
export { Boolean };
export { OffsetMitre };
export { OffsetChamfer };
export { OffsetRound };
export { Stitch };
export { Clean };

// CLASS DEFINITION
export class Poly2dFunc {
    __enum__ = {
        ...Enum
    }

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    async BBoxPolygon(entities, method): Promise<any> {
        return BBoxPolygon(this.__model__, entities, method);
    }
    async Boolean(a_entities, b_entities, method): Promise<any> {
        return Boolean(this.__model__, a_entities, b_entities, method);
    }
    async Clean(entities, tolerance): Promise<any> {
        return Clean(this.__model__, entities, tolerance);
    }
    async ConvexHull(entities): Promise<any> {
        return ConvexHull(this.__model__, entities);
    }
    async Delaunay(entities): Promise<any> {
        return Delaunay(this.__model__, entities);
    }
    async OffsetChamfer(entities, dist, end_type): Promise<any> {
        return OffsetChamfer(this.__model__, entities, dist, end_type);
    }
    async OffsetMitre(entities, dist, limit, end_type): Promise<any> {
        return OffsetMitre(this.__model__, entities, dist, limit, end_type);
    }
    async OffsetRound(entities, dist, tolerance, end_type): Promise<any> {
        return OffsetRound(this.__model__, entities, dist, tolerance, end_type);
    }
    async Stitch(entities, tolerance): Promise<any> {
        return Stitch(this.__model__, entities, tolerance);
    }
    async Union(entities): Promise<any> {
        return Union(this.__model__, entities);
    }
    async Voronoi(pgons, entities): Promise<any> {
        return Voronoi(this.__model__, pgons, entities);
    }

}
