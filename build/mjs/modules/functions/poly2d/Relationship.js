import { arrMakeFlat, EEntType, idsBreak } from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../_check_ids';
import { _getPgons, _getPosis } from './_shared';
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
export function Relationship(__model__, pgons, entities, method) {
    const single = !Array.isArray(entities);
    pgons = arrMakeFlat(pgons);
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = 'poly2d.Contains';
    let pgons_ents_arr;
    let ents_arr;
    if (__model__.debug) {
        pgons_ents_arr = checkIDs(__model__, fn_name, 'pgons', pgons, [ID.isIDL1], null);
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isIDL1], null);
    }
    else {
        pgons_ents_arr = idsBreak(pgons);
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    // pgons
    const pgons_i = _getPgons(__model__, pgons_ents_arr);
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
// =================================================================================================
function contains(__model__, pgon_i, ent_arr) {
    const posis_i = _getPosis(__model__, [ent_arr]);
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
        const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVsYXRpb25zaGlwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL3BvbHkyZC9SZWxhdGlvbnNoaXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFdBQVcsRUFDWCxRQUFRLEVBRVIsUUFBUSxFQUtYLE1BQU0sK0JBQStCLENBQUM7QUFFdkMsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUVoRCxPQUFPLEVBR0gsU0FBUyxFQUNULFNBQVMsRUFDWixNQUFNLFdBQVcsQ0FBQztBQUluQixvR0FBb0c7QUFDcEc7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUFDLFNBQWtCLEVBQUUsS0FBZ0IsRUFBRSxRQUFrQixFQUFFLE1BQTRCO0lBQy9HLE1BQU0sTUFBTSxHQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqRCxLQUFLLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBVSxDQUFDO0lBQ3BDLFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDO0lBQ2xDLElBQUksY0FBNkIsQ0FBQztJQUNsQyxJQUFJLFFBQXVCLENBQUM7SUFDNUIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLGNBQWMsR0FBRyxRQUFRLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUN4RCxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQWtCLENBQUM7UUFDeEMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQ3hELENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUks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