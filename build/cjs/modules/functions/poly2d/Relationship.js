"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relationship = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../_check_ids");
const _shared_1 = require("./_shared");
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
function Relationship(__model__, pgons, entities, method) {
    const single = !Array.isArray(entities);
    pgons = (0, mobius_sim_1.arrMakeFlat)(pgons);
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    // --- Error Check ---
    const fn_name = 'poly2d.Contains';
    let pgons_ents_arr;
    let ents_arr;
    if (__model__.debug) {
        pgons_ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'pgons', pgons, [_check_ids_1.ID.isIDL1], null);
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isIDL1], null);
    }
    else {
        pgons_ents_arr = (0, mobius_sim_1.idsBreak)(pgons);
        ents_arr = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    // pgons
    const pgons_i = (0, _shared_1._getPgons)(__model__, pgons_ents_arr);
    const results = [];
    for (const ent_arr of ents_arr) {
        let is_contained = false;
        for (const pgon_i of pgons_i) {
            if (contains(__model__, pgon_i, ent_arr)) {
                is_contained = true;
                break;
            }
        }
        results.push(is_contained);
    }
    if (single) {
        return results[0];
    }
    return results;
}
exports.Relationship = Relationship;
// =================================================================================================
function contains(__model__, pgon_i, ent_arr) {
    const posis_i = (0, _shared_1._getPosis)(__model__, [ent_arr]);
    for (const posi_i of posis_i) {
        if (!pgonContainsPosi(__model__, pgon_i, posi_i)) {
            return false;
        }
    }
    return true;
}
// =================================================================================================
function pgonContainsPosi(__model__, pgon_i, posi_i) {
    const wires_i = __model__.modeldata.geom.nav.navPgonToWire(pgon_i);
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
function wireContainsPosi(__model__, wire_i, posi_i) {
    let count = 0;
    const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
    for (const edge_i of __model__.modeldata.geom.nav.navWireToEdge(wire_i)) {
        const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.EDGE, edge_i);
        const start = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
        const end = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
        count += _intersect([[start[0], start[1]], [end[0], end[1]]], [xyz[0], xyz[1]]);
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
function _intersect(a_line, b) {
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
    if (denominator === 0) {
        return 0;
    } // no intersection
    // calc intersection
    const t = (((x1 - x3) * (y3 - y4)) - ((y1 - y3) * (x3 - x4))) / denominator;
    const u = -(((x1 - x2) * (y1 - y3)) - ((y1 - y2) * (x1 - x3))) / denominator;
    if ((t > 0 && t <= 1) && (u >= 0)) {
        return 1; // no intersection
    }
    return 0; // no intersection
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVsYXRpb25zaGlwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL3BvbHkyZC9SZWxhdGlvbnNoaXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBU3VDO0FBRXZDLGlEQUFnRDtBQUVoRCx1Q0FLbUI7QUFJbkIsb0dBQW9HO0FBQ3BHOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsU0FBZ0IsWUFBWSxDQUFDLFNBQWtCLEVBQUUsS0FBZ0IsRUFBRSxRQUFrQixFQUFFLE1BQTRCO0lBQy9HLE1BQU0sTUFBTSxHQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqRCxLQUFLLEdBQUcsSUFBQSx3QkFBVyxFQUFDLEtBQUssQ0FBVSxDQUFDO0lBQ3BDLFFBQVEsR0FBRyxJQUFBLHdCQUFXLEVBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDO0lBQ2xDLElBQUksY0FBNkIsQ0FBQztJQUNsQyxJQUFJLFFBQXVCLENBQUM7SUFDNUIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLGNBQWMsR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUN4RCxDQUFDLGVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQWtCLENBQUM7UUFDeEMsUUFBUSxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQ3hELENBQUMsZUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBa0IsQ0FBQztLQUMzQztTQUFNO1FBQ0gsY0FBYyxHQUFHLElBQUEscUJBQVEsRUFBQyxLQUFLLENBQWtCLENBQUM7UUFDbEQsUUFBUSxHQUFHLElBQUEscUJBQVEsRUFBQyxRQUFR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