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
import * as chk from '../../_check_types';
import { getPlane } from '../_common';




// ================================================================================================
/**
 * Scales entities relative to a plane.
 * \n
 * @param __model__
 * @param entities  An entity or list of entities to scale.
 * @param plane A plane to scale around. \n
 * Given a ray, a plane will be generated that is perpendicular to the ray. \n
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \n
 * Given any entities, the centroid will be extracted, 
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @param scale Scale factor, a single number to scale equally, or [scale_x, scale_y, scale_z] relative to the plane.
 * @returns void
 * @example `modify.Scale(entities, plane1, 0.5)`
 * @example_info Scales entities by 0.5 on plane1.
 * @example `modify.Scale(entities, plane1, [0.5, 1, 1])`
 * @example_info Scales entities by 0.5 along the x axis of plane1, with no scaling along the y and z axes.
 */
export function Scale(__model__: Sim, entities: string|string[], plane: Txyz|TRay|TPlane|string|string[], scale: number|Txyz): void {
    entities = arrMakeFlat(entities) as string[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Scale';
        let ents_arr: string[];
        if (this.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
                [ENT_TYPE.POSI, ENT_TYPE.VERT, ENT_TYPE.EDGE, ENT_TYPE.WIRE,
                ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
            chk.checkArgs(fn_name, 'scale', scale, [chk.isNum, chk.isXYZ]);
        } else {
            ents_arr = idsBreak(entities) as string[];
        }
        plane = getPlane(__model__, plane, fn_name) as TPlane;
        // --- Error Check ---
        __model__.modeldata.funcs_modify.scale(ents_arr, plane, scale);
    }
}
