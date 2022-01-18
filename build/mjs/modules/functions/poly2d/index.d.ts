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
export declare class Poly2dFunc {
    __enum__: {
        /**
         * The `poly2D` module has a set of functions for working with 2D polygons, on the XY plane.
         * @module
         */
        _EBBoxMethod: typeof Enum._EBBoxMethod;
        _EClipJointType: typeof Enum._EClipJointType;
        _EClipEndType: typeof Enum._EClipEndType;
        _EOffset: typeof Enum._EOffset;
        _EOffsetRound: typeof Enum._EOffsetRound;
        _EBooleanMethod: typeof Enum._EBooleanMethod;
    };
    __model__: GIModel;
    constructor(model: GIModel);
    BBoxPolygon(entities: any, method: any): Promise<any>;
    Boolean(a_entities: any, b_entities: any, method: any): Promise<any>;
    Clean(entities: any, tolerance: any): Promise<any>;
    ConvexHull(entities: any): Promise<any>;
    Delaunay(entities: any): Promise<any>;
    OffsetChamfer(entities: any, dist: any, end_type: any): Promise<any>;
    OffsetMitre(entities: any, dist: any, limit: any, end_type: any): Promise<any>;
    OffsetRound(entities: any, dist: any, tolerance: any, end_type: any): Promise<any>;
    Stitch(entities: any, tolerance: any): Promise<any>;
    Union(entities: any): Promise<any>;
    Voronoi(pgons: any, entities: any): Promise<any>;
}
