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
 * Mirrors entities across a plane.
 * \n
 * @param __model__
 * @param entities An entity or list of entities to mirror.
 * @param plane A plane to scale around. \n
 * Given a ray, a plane will be generated that is perpendicular to the ray. \n
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \n
 * Given any entities, the centroid will be extracted, 
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @returns void
 * @example `modify.Mirror(polygon1, plane1)`
 * @example_info Mirrors polygon1 across plane1.
 */
export function Mirror(__model__: Sim, entities: string|string[], plane: Txyz|TRay|TPlane|string|string[]): void {
    entities = arrMakeFlat(entities) as string[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Mirror';
        let ents_arr: string[];
        if (this.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
                [ENT_TYPE.POSI, ENT_TYPE.VERT, ENT_TYPE.EDGE, ENT_TYPE.WIRE,
                ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
        } else {
            ents_arr = idsBreak(entities) as string[];
        }
        plane = getPlane(__model__, plane, fn_name) as TPlane;
        // --- Error Check ---
        __model__.modeldata.funcs_modify.mirror(ents_arr, plane);
    }
}
