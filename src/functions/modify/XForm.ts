import {
    arrMakeFlat,
    ENT_TYPE,
    Sim,
    idsBreak,
    isEmptyArr,
    string,
    string,
    TPlane,
    TRay,
    Txyz,
} from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import { getPlane } from '../_common';




// ================================================================================================
/**
 * Transforms entities from a source plane to a target plane.
 * \n
 * @param __model__
 * @param entities Vertex, edge, wire, position, point, polyline, polygon, collection.
 * @param from_plane Plane defining source plane for the transformation. \n
 * Given a ray, a plane will be generated that is perpendicular to the ray. \n
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \n
 * Given any entities, the centroid will be extracted,
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @param to_plane Plane defining target plane for the transformation. \n
 * Given a ray, a plane will be generated that is perpendicular to the ray. \n
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \n
 * Given any entities, the centroid will be extracted, 
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @returns void
 * @example `modify.XForm(polygon1, plane1, plane2)`
 * @example_info Transforms polygon1 from plane1 to plane2.
 */
export function XForm(__model__: Sim, entities: string|string[],
        from_plane: Txyz|TRay|TPlane|string|string[], to_plane: Txyz|TRay|TPlane|string|string[]): void {
    entities = arrMakeFlat(entities) as string[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.XForm';
        let ents_arr: string[];
        if (this.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
                [ENT_TYPE.POSI, ENT_TYPE.VERT, ENT_TYPE.EDGE, ENT_TYPE.WIRE,
                ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
        } else {
            ents_arr = idsBreak(entities) as string[];
        }
        from_plane = getPlane(__model__, from_plane, fn_name) as TPlane;
        to_plane = getPlane(__model__, to_plane, fn_name) as TPlane;
        // --- Error Check ---
        __model__.modeldata.funcs_modify.xform(ents_arr, from_plane, to_plane);
    }
}
