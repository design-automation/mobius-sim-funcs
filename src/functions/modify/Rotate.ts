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
import { getRay } from '../_common';




// ================================================================================================
/**
 * Rotates entities on a plane by an angle.
 * \n
 * @param __model__
 * @param entities  An entity or list of entities to rotate.
 * @param ray A ray to rotate around. \n
 * Given a plane, a ray will be created from the plane's z axis. \n
 * Given an `xyz` location, a ray will be generated with an origin at this location, and a direction `[0, 0, 1]`. \n
 * Given any entities, the centroid will be extracted, 
 * and a ray will be generated with an origin at this centroid, and a direction `[0, 0, 1]`.
 * @param angle Angle (in radians).
 * @returns void
 * @example `modify.Rotate(polyline1, plane1, PI)`
 * @example_info Rotates polyline1 around the z-axis of plane1 by PI (i.e. 180 degrees).
 */
export function Rotate(__model__: Sim, entities: string|string[], ray: Txyz|TRay|TPlane|string|string[], angle: number): void {
    entities = arrMakeFlat(entities) as string[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Rotate';
        let ents_arr: string[];
        if (this.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
                [ENT_TYPE.POSI, ENT_TYPE.VERT, ENT_TYPE.EDGE, ENT_TYPE.WIRE,
                ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
            chk.checkArgs(fn_name, 'angle', angle, [chk.isNum]);
        } else {
            ents_arr = idsBreak(entities) as string[];
        }
        ray = getRay(__model__, ray, fn_name) as TRay;
        // --- Error Check ---
        __model__.modeldata.funcs_modify.rotate(ents_arr, ray, angle);
    }
}
