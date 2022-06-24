/**
 * The `poly2D` module has a set of functions for working with 2D polygons, with the results
 * projected on the XY plane.
 * \n
 * All the functions create new entities and do not modify the original geometry. 
 * 
 *  @module
 */
import { ENT_TYPE, Sim } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

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
    };


    public __model__: Sim;
    public debug: boolean;
    constructor(model: Sim, debug: boolean) {
        this.__model__ = model;
        this.debug = debug;
    }
    BBoxPolygon(entities: string | string[], method: Enum._EBBoxMethod): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'poly2d.BBoxPolygon';
            checkIDs(this.__model__, fn_name, 'entities', entities,
            [ID.isIDL1], null) as string[];
        } 
        // --- Error Check ---    
        return BBoxPolygon(this.__model__, entities, method);
    }
    Boolean(a_entities: string | string[], b_entities: string | string[], method: Enum._EBooleanMethod): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'poly2d.Boolean';
            checkIDs(this.__model__, fn_name, 'a_entities', a_entities,
            [ID.isID, ID.isIDL1], [ENT_TYPE.PGON, ENT_TYPE.PLINE]) as string[];
            checkIDs(this.__model__, fn_name, 'b_entities', b_entities,
            [ID.isID, ID.isIDL1], [ENT_TYPE.PGON]) as string[];
        }
        // --- Error Check ---    
        return Boolean(this.__model__, a_entities, b_entities, method);
    }
    Clean(entities: string | string[], tolerance: number): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'poly2d.Clean';
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1], [ENT_TYPE.PLINE, ENT_TYPE.PGON]) as string[];
            chk.checkArgs(fn_name, 'tolerance', tolerance, [chk.isNum]);
        } 
        // --- Error Check ---    
        return Clean(this.__model__, entities, tolerance);
    }
    ConvexHull(entities: string | string[]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'poly2d.ConvexHull';
            checkIDs(this.__model__, fn_name, 'entities', entities,
            [ID.isIDL1], null) as string[];
        } 
        // --- Error Check ---    
        return ConvexHull(this.__model__, entities);
    }
    Delaunay(entities: string | string[]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'poly2d.Delaunay';
            checkIDs(this.__model__, fn_name, 'entities1', entities,
                [ID.isIDL1], null) as string[];
        } 
        // --- Error Check ---    
        return Delaunay(this.__model__, entities);
    }
    OffsetChamfer(entities: string | string[], dist: number, end_type: Enum._EOffset): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'poly2d.OffsetChamfer';
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1], [ENT_TYPE.PLINE, ENT_TYPE.PGON]) as string[];
        } 
        // --- Error Check ---    
        return OffsetChamfer(this.__model__, entities, dist, end_type);
    }
    OffsetMitre(entities: string | string[], dist: number, limit: number, end_type: Enum._EOffset): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'poly2d.OffsetMitre';
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1], [ENT_TYPE.PLINE, ENT_TYPE.PGON]) as string[];
            chk.checkArgs(fn_name, 'miter_limit', limit, [chk.isNum]);
        } 
        // --- Error Check ---    
        return OffsetMitre(this.__model__, entities, dist, limit, end_type);
    }
    OffsetRound(entities: string | string[], dist: number, tolerance: number, end_type: Enum._EOffsetRound): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'poly2d.OffsetRound';
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1], [ENT_TYPE.PLINE, ENT_TYPE.PGON]) as string[];
            chk.checkArgs(fn_name, 'tolerance', tolerance, [chk.isNum]);
        } 
        // --- Error Check ---    
        return OffsetRound(this.__model__, entities, dist, tolerance, end_type);
    }
    Stitch(entities: string | string[], tolerance: number): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'poly2d.Stitch';
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isIDL1, ID.isIDL2], [ENT_TYPE.PLINE, ENT_TYPE.PGON]) as string[];
            chk.checkArgs(fn_name, 'tolerance', tolerance, [chk.isNum]);
        } 
        // --- Error Check ---    
        return Stitch(this.__model__, entities, tolerance);
    }
    Union(entities: string | string[]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'poly2d.Union';
            checkIDs(this.__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1], [ENT_TYPE.PGON]) as string[];
        } 
        // --- Error Check ---    
        return Union(this.__model__, entities);
    }
    Voronoi(pgons: string | string[], entities: string | string[]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'poly2d.Voronoi';
            checkIDs(this.__model__, fn_name, 'pgons', pgons,
                [ID.isIDL1], null) as string[];
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isIDL1], null) as string[];
        } 
        // --- Error Check ---    
        return Voronoi(this.__model__, pgons, entities);
    }

}
