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
export class Poly2dFunc {
    __model__: GIModel;
    __enum__ = {
        ...Enum
    }
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Voronoi(pgons, entities): any {
        return Voronoi(this.__model__, pgons, entities);
    }
    Delaunay(entities): any {
        return Delaunay(this.__model__, entities);
    }
    ConvexHull(entities): any {
        return ConvexHull(this.__model__, entities);
    }
    BBoxPolygon(entities, method): any {
        return BBoxPolygon(this.__model__, entities, method);
    }
    Union(entities): any {
        return Union(this.__model__, entities);
    }
    Boolean(a_entities, b_entities, method): any {
        return Boolean(this.__model__, a_entities, b_entities, method);
    }
    OffsetMitre(entities, dist, limit, end_type): any {
        return OffsetMitre(this.__model__, entities, dist, limit, end_type);
    }
    OffsetChamfer(entities, dist, end_type): any {
        return OffsetChamfer(this.__model__, entities, dist, end_type);
    }
    OffsetRound(entities, dist, tolerance, end_type): any {
        return OffsetRound(this.__model__, entities, dist, tolerance, end_type);
    }
    Stitch(entities, tolerance): any {
        return Stitch(this.__model__, entities, tolerance);
    }
    Clean(entities, tolerance): any {
        return Clean(this.__model__, entities, tolerance);
    }
}
