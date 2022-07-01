/**
 * The `poly2D` module has a set of functions for working with 2D polygons, with the results
 * projected on the XY plane.
 * \n
 * All the functions create new entities and do not modify the original geometry. 
 * 
 *  @module
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
import { Relationship } from './Relationship';

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
export { Relationship };

// CLASS DEFINITION
export class Poly2dFunc {

    // Document Enums here
    __enum__ = {
        BBoxPolygon: {
            method: Enum._EBBoxMethod
        },
        Boolean: {
            method: Enum._EBooleanMethod
        },
        OffsetChamfer: {
            end_type: Enum._EOffset
        },
        OffsetMitre: {
            end_type: Enum._EOffset
        },
        OffsetRound: {
            end_type: Enum._EOffsetRound
        },
        RelationshipMethod: {
            end_type: Enum._ERelationshipMethod
        },
    };


    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    BBoxPolygon(entities: string | string[], method: Enum._EBBoxMethod): any {
        return BBoxPolygon(this.__model__, entities, method);
    }
    Boolean(a_entities: string | string[], b_entities: string | string[], method: Enum._EBooleanMethod): any {
        return Boolean(this.__model__, a_entities, b_entities, method);
    }
    Clean(entities: string | string[], tolerance: number): any {
        return Clean(this.__model__, entities, tolerance);
    }
    ConvexHull(entities: string | string[]): any {
        return ConvexHull(this.__model__, entities);
    }
    Delaunay(entities: string | string[]): any {
        return Delaunay(this.__model__, entities);
    }
    OffsetChamfer(entities: string | string[], dist: number, end_type: Enum._EOffset): any {
        return OffsetChamfer(this.__model__, entities, dist, end_type);
    }
    OffsetMitre(entities: string | string[], dist: number, limit: number, end_type: Enum._EOffset): any {
        return OffsetMitre(this.__model__, entities, dist, limit, end_type);
    }
    OffsetRound(entities: string | string[], dist: number, tolerance: number, end_type: Enum._EOffsetRound): any {
        return OffsetRound(this.__model__, entities, dist, tolerance, end_type);
    }
    Stitch(entities: string | string[], tolerance: number): any {
        return Stitch(this.__model__, entities, tolerance);
    }
    Union(entities: string | string[]): any {
        return Union(this.__model__, entities);
    }
    Voronoi(pgons: string | string[], entities: string | string[]): any {
        return Voronoi(this.__model__, pgons, entities);
    }
    Relationship(pgons: string|string[], entities:string|string[], 
            method: Enum._ERelationshipMethod): boolean|boolean[] {
        return Relationship(this.__model__, pgons, entities, method);
    }
}
