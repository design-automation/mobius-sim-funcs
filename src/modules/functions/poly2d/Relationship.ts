import {
    arrMakeFlat,
    EEntType,
    GIModel,
    idsBreak,
    TEntTypeIdx,
    TId,
    Txy,
    Txyz
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';

import { 
    _convertPgonToShape, 
    _convertShapesToPgons, 
    _getPgons, 
    _getPosis
} from './_shared';
import { 
    _ERelationshipMethod
} from './_enum';
// =================================================================================================
/**
 * Analyses the relationship between a set of polygons and a set of entities.
 * \n
 * Touches—A part of the feature from feature class 1 comes into contact with the boundary of a feature from feature class 2. The interiors of the features do not intersect.
 * Contains—A feature from feature class 1 completely encloses a feature from feature class 2.
 * Intersects—Any part of a feature from feature class 1 comes into contact with any part of a feature from feature class 2.
 * Relation—A custom spatial relationship is defined based on the interior, boundary, and exterior of features from both feature classes.
 * Within—A feature from feature class 2 completely encloses a feature from feature class 1.
 * Crosses—The interior of a feature from feature class 1 comes into contact with the interior or boundary (if a polygon) of a feature from feature class 2 at a point.
 * Overlaps—The interior of a feature from feature class 1 partly covers a feature from feature class 2. Only features of the same geometry can be compared.
 * @param __model__
 * @param pgons A polygon, list of polygons, or entities from which polygons can be extracted. 
 * (These will be subdivided.)
 * @param entities A list of entities. 
 * @param method Enum
 * @returns Boolean values indicating if the entities are inside any of the polygons.
 */
export function Relationship(__model__: GIModel, pgons: TId|TId[], entities:TId|TId[], method: _ERelationshipMethod): boolean|boolean[] {
    const single: boolean = !Array.isArray(entities);
    pgons = arrMakeFlat(pgons) as TId[];
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = 'poly2d.Contains';
    let pgons_ents_arr: TEntTypeIdx[];
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        pgons_ents_arr = checkIDs(__model__, fn_name, 'pgons', pgons,
            [ID.isIDL1], null) as TEntTypeIdx[];
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isIDL1], null) as TEntTypeIdx[];
    } else {
        pgons_ents_arr = idsBreak(pgons) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    // pgons
    const pgons_i: number[] = _getPgons(__model__, pgons_ents_arr);
    const results: boolean[] = [];
    for (const ent_arr of ents_arr) {
        let is_contained: boolean = false;
        for (const pgon_i of pgons_i) {
            if (contains(__model__, pgon_i, ent_arr)) {
                is_contained = true;
                break;
            }
        }
        results.push(is_contained);
    }
    if (single) { return results[0]; }
    return results;
}
// =================================================================================================
function contains(__model__: GIModel, pgon_i: number, ent_arr:TEntTypeIdx): boolean {
    const posis_i: number[] = _getPosis(__model__, [ent_arr]);
    for (const posi_i of posis_i) {
        if (!pgonContainsPosi(__model__, pgon_i, posi_i)) {
            return false;
        }
    }
    return true;
}
// =================================================================================================
function pgonContainsPosi(__model__: GIModel, pgon_i: number, posi_i:number): boolean {
    const wires_i: number[] = __model__.modeldata.geom.nav.navPgonToWire(pgon_i);
    if (wires_i.length === 1) {
        return wireContainsPosi(__model__, wires_i[0], posi_i);
    }
    if (wireContainsPosi(__model__, wires_i[0], posi_i)) {
        for (let i = 1; i < wires_i.length; i++) {
            if (wireContainsPosi(__model__, wires_i[i], posi_i)) {
                return false;
            }
        }
        return true;
    }
}
// =================================================================================================
function wireContainsPosi(__model__: GIModel, wire_i: number, posi_i:number): boolean {
    let count = 0;
    const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
    for (const edge_i of __model__.modeldata.geom.nav.navWireToEdge(wire_i)) {
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
        const start: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
        const end: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
        count += _intersect(
            [[start[0], start[1]], [end[0], end[1]]],
            [xyz[0], xyz[1]]
        );
    }
    return count % 2 !== 0;
}
// =================================================================================================
/**
 * Returns 1 if a rays that starts at b intersect with line a.
 * @param a_line [[x,y], [x,y]]
 * @param b [x,y]
 * @returns
 */
 function _intersect(a_line: [Txy, Txy], b: Txy): number {
    // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    // line 1, t
    const x1 = a_line[0][0];
    const y1 = a_line[0][1];
    const x2 = a_line[1][0];
    const y2 = a_line[1][1];
    // line 2, u
    const x3 = b[0];
    const y3 = b[1];
    const x4 = 1;
    const y4 = 0;
    const denominator = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));
    if (denominator === 0) { return 0; } // no intersection
    
    // calc intersection
    const t = (((x1 - x3) * (y3 - y4)) - ((y1 - y3) * (x3 - x4))) / denominator;
    const u = -(((x1 - x2) * (y1 - y3)) - ((y1 - y2) * (x1 - x3))) / denominator;
    if ((t > 0 && t <= 1) && (u >= 0)) {
        return 1; // no intersection
    }
    return 0; // no intersection
}

