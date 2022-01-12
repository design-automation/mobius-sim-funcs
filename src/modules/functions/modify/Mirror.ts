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

import { checkIDs, ID } from '../../../_check_ids';
import { getPlane } from '../_common';




// ================================================================================================
/**
 * Mirrors entities across a plane.
 * \n
 * @param __model__
 * @param entities An entity or list of entities to mirros.
 * @param plane A plane to scale around. \n
 * Given a ray, a plane will be generated that is perpendicular to the ray. \n
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \n
 * Given any entities, the centroid will be extracted, \n
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @returns void
 * @example modify.Mirror(polygon1, plane1)
 * @example_info Mirrors polygon1 across plane1.
 */
export function Mirror(__model__: GIModel, entities: TId|TId[], plane: Txyz|TRay|TPlane|TId|TId[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Mirror';
        let ents_arr: TEntTypeIdx[];
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
                [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        } else {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        plane = getPlane(__model__, plane, fn_name) as TPlane;
        // --- Error Check ---
        __model__.modeldata.funcs_modify.mirror(ents_arr, plane);
    }
}
