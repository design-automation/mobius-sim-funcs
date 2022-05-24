import {
    arrMakeFlat,
    EEntType,
    GIModel,
    idsBreak,
    idsMake,
    isEmptyArr,
    TEntTypeIdx,
    TId,
    Txyz,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { _EExtrudeMethod } from './_enum';





// ================================================================================================
/**
 * Extrudes geometry by distance or by vector.
 * - Extrusion of a position, vertex, or point produces polylines;
 * - Extrusion of an edge, wire, or polyline produces polygons;
 * - Extrusion of a face or polygon produces polygons, capped at the top.
 * \n
 * \n
 * The geometry that is generated depends on the method that is selected.
 * - The 'quads' methods will generate polygons.
 * - The 'stringers' and 'ribs' methods will generate polylines.
 * - The 'copies' method will generate copies of the input geometry type.
 *
 * @param __model__
 * @param entities A list of entities, can be any type of entitiy.
 * @param dist Number or vector. If number, assumed to be [0,0,value] (i.e. extrusion distance in 
 * z-direction).
 * @param divisions Number of divisions to divide extrusion by. Minimum is 1.
 * @param method Enum, when extruding edges, select quads, stringers, or ribs
 * @returns Entities, a list of new polygons or polylines resulting from the extrude.
 * @example extrusion1 = make.Extrude(point1, 10, 2, 'quads')
 * @example_info Creates a polyline of total length 10 (with two edges of length 5 each) in the 
 * z-direction.
 * In this case, the 'quads' setting is ignored.
 * @example extrusion2 = make.Extrude(polygon1, [0,5,0], 1, 'quads')
 * @example_info Extrudes polygon1 by 5 in the y-direction, creating a list of quad surfaces.
 */
export function Extrude(__model__: GIModel, entities: TId|TId[],
        dist: number|Txyz, divisions: number, method: _EExtrudeMethod): TId|TId[] {
    if (isEmptyArr(entities)) { return []; }
    entities = Array.isArray(entities) ? arrMakeFlat(entities) : entities;
    // --- Error Check ---
    const fn_name = 'make.Extrude';
    let ents_arr;
    if (__model__.debug) {
        ents_arr =  checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1],
            [EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
            EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
        chk.checkArgs(fn_name, 'dist', dist, [chk.isNum, chk.isXYZ]);
        chk.checkArgs(fn_name, 'divisions', divisions, [chk.isInt]);
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_make.extrude(ents_arr, dist, divisions, method);
    // create IDs
    if (!Array.isArray(entities) && new_ents_arr.length === 1) {
        return idsMake(new_ents_arr[0]) as TId;
    } else {
        return idsMake(new_ents_arr) as TId|TId[];
    }
}
