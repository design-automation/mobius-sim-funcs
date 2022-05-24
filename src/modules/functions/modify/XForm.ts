import {
    arrMakeFlat,
    EEntType,
    GIModel,
    idsBreak,
    isEmptyArr,
    TEntTypeIdx,
    TId,
    TPlane,
    TRay,
    Txyz,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';
import { getPlane } from '../_common';




// ================================================================================================
/**
 * Transforms entities from a source plane to a target plane.
 * \n
 * @param __model__
 * @param entities Vertex, edge, wire, face, position, point, polyline, polygon, collection.
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
export function XForm(__model__: GIModel, entities: TId|TId[],
        from_plane: Txyz|TRay|TPlane|TId|TId[], to_plane: Txyz|TRay|TPlane|TId|TId[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.XForm';
        let ents_arr: TEntTypeIdx[];
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
                [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        } else {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        from_plane = getPlane(__model__, from_plane, fn_name) as TPlane;
        to_plane = getPlane(__model__, to_plane, fn_name) as TPlane;
        // --- Error Check ---
        __model__.modeldata.funcs_modify.xform(ents_arr, from_plane, to_plane);
    }
}
