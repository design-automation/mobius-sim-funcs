/**
 * The `make` module has functions for making new entities in the model.
 * All these functions return the IDs of the entities that are created.
 * @module
 */
import { Sim, ENT_TYPE } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

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
import { Txyz, TPlane } from '../_common/consts';

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

    // Document Enums here
    __enum__ = {
        Cut: {
            method: Enum._ECutMethod
        },
        Extrude: {
            method: Enum._EExtrudeMethod
        },
        Loft: {
            method: Enum._ELoftMethod
        },
        Polyline: {
            close: Enum._EClose
        },
        Sweep: {
            method: Enum._EExtrudeMethod
        },
    };

    public __model__: Sim;
    public debug: boolean;
    constructor(model: Sim, debug: boolean) {
        this.__model__ = model;
        this.debug = debug;
    }
    Clone(entities: string | string[] | string[][]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'make.Clone';
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1, ID.isIDL2],
                [ENT_TYPE.POSI, ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]);
        }
        // --- Error Check ---
        return Clone(this.__model__, entities);
    }

    Copy(entities: string | string[] | string[][], vector: Txyz | Txyz[]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'make.Copy';
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1, ID.isIDL2],
                [ENT_TYPE.POSI, ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]);
            chk.checkArgs(fn_name, 'vector', vector, [chk.isXYZ, chk.isXYZL, chk.isNull]);
        }
        // --- Error Check ---
        return Copy(this.__model__, entities, vector);
    }
    Cut(entities: string | string[], plane: TPlane, method: Enum._ECutMethod): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'make.Cut';
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1], null);
            chk.checkArgs(fn_name, 'plane', plane, [chk.isPln]);
        }
        // --- Error Check ---
        return Cut(this.__model__, entities, plane, method);
    }
    Extrude(entities: string | string[], dist: number | Txyz, divisions: number, method: Enum._EExtrudeMethod): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'make.Extrude';
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1],
                [ENT_TYPE.VERT, ENT_TYPE.EDGE, ENT_TYPE.WIRE,
                ENT_TYPE.POSI, ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]);
            chk.checkArgs(fn_name, 'dist', dist, [chk.isNum, chk.isXYZ]);
            chk.checkArgs(fn_name, 'divisions', divisions, [chk.isInt]);
        }
        // --- Error Check ---
        return Extrude(this.__model__, entities, dist, divisions, method);
    }
    Join(entities: string[]): any {
        // --- Error Check ---
        if (this.debug) {
            checkIDs(this.__model__, 'make.Join', 'entities', entities,
                [ID.isIDL1], [ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON]);
        }
        // --- Error Check ---
        return Join(this.__model__, entities);
    }
    Loft(entities: string[] | string[][], divisions: number, method: Enum._ELoftMethod): any {
        // --- Error Check ---
        if (this.debug) {
            checkIDs(this.__model__, 'make.Loft', 'entities', entities,
                [ID.isIDL1, ID.isIDL2],
                [ENT_TYPE.EDGE, ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON]);
        }
        // --- Error Check ---
        return Loft(this.__model__, entities, divisions, method);
    }
    Point(entities: string | string[] | string[][]): any {
        // --- Error Check ---
        if (this.debug) {
            checkIDs(this.__model__, 'make.Point', 'entities', entities,
                [ID.isID, ID.isIDL1, ID.isIDL2],
                [ENT_TYPE.POSI, ENT_TYPE.VERT, ENT_TYPE.EDGE, ENT_TYPE.WIRE,
                ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON]);
        }
        // --- Error Check ---
        return Point(this.__model__, entities);
    }
    Polygon(entities: string | string[] | string[][]): any {
        // --- Error Check ---
        if (this.debug) {
            checkIDs(this.__model__, 'make.Polygon', 'entities', entities,
                [ID.isID, ID.isIDL1, ID.isIDL2],
                [ENT_TYPE.POSI, ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON]);
        }
        // --- Error Check ---
        return Polygon(this.__model__, entities);
    }
    Polyline(entities: string | string[] | string[][], close: Enum._EClose): any {
            // --- Error Check ---
        if (this.debug) {
            checkIDs(this.__model__, 'make.Polyline', 'entities', entities,
                [ID.isID, ID.isIDL1, ID.isIDL2],
                [ENT_TYPE.POSI, ENT_TYPE.VERT, ENT_TYPE.EDGE, ENT_TYPE.WIRE,
                ENT_TYPE.PLINE, ENT_TYPE.PGON]);
        }
        // --- Error Check ---
        return Polyline(this.__model__, entities, close);
    }
    Position(coords: Txyz | Txyz[] | Txyz[][]): any {
        // --- Error Check ---
        if (this.debug) {
            chk.checkArgs('make.Position', 'coords', coords, 
                [chk.isXYZ, chk.isXYZL, chk.isXYZLL]);
        }
        // --- Error Check ---
        return Position(this.__model__, coords);
    }
    Sweep(entities: string | string[], x_section: string, divisions: number, method: Enum._EExtrudeMethod): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'make.Sweep';
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1], [ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON]);
            checkIDs(this.__model__, fn_name, 'xsextion', x_section,
                [ID.isID], [ENT_TYPE.EDGE, ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON]);
            chk.checkArgs(fn_name, 'divisions', divisions, [chk.isInt]);
            if (divisions === 0) {
                throw new Error(fn_name + ' : Divisor cannot be zero.');
            }
        }
        // --- Error Check ---
        return Sweep(this.__model__, entities, x_section, divisions, method);
    }
}
