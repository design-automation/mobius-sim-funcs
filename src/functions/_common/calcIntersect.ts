import { TPlane, TRay, Txyz } from './consts';
import { vecAdd, vecCross, vecFromTo, vecDot, vecMult } from './calcVectors';
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param r1 
 * @param r2 
 * @param met 
 * @returns 
 */
export function intersect(r1: TRay, r2: TRay|TPlane, met: number = 2): Txyz {
    if (r2.length === 2) {
        return intersectRayRay(r1, r2, met);
    } else if (r2.length === 3) {
        return intersectRayPlane(r1, r2, met);
    } else {
        throw new Error('Error calculating intersection. Elements to intersect must be either rays or planes.');
    }
}
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param r1 
 * @param r2 
 * @param met 
 * @returns 
 */
export function intersectRayRay(r1: TRay, r2: TRay, met: number): Txyz {
    const dc: Txyz = vecFromTo(r1[0], r2[0]);
    const da: Txyz = r1[1];
    const db: Txyz = r2[1];
    if (vecDot(dc, vecCross(da, db)) !== 0) { return null; }
    const da_x_db: Txyz = vecCross(da, db);
    const da_x_db_norm2: number = (da_x_db[0] * da_x_db[0]) + (da_x_db[1] * da_x_db[1]) + (da_x_db[2] * da_x_db[2]);
    if (da_x_db_norm2 === 0) { return null; }
    const s = vecDot(vecCross(dc, db), da_x_db) / da_x_db_norm2;
    const t = vecDot(vecCross(dc, da), da_x_db) / da_x_db_norm2;
    switch (met) {
        case 2:
            return vecAdd(r1[0], vecMult(da, s));
        case 1:
            if ((s >= 0) && (t >= 0)) {
                return vecAdd(r1[0], vecMult(da, s));
            }
            return null;
        case 0:
            if ((s >= 0 && s <= 1) && (t >= 0 && t <= 1)) {
                return vecAdd(r1[0], vecMult(da, s));
            }
            return null;
        default:
            return null;
    }
}
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param r 
 * @param p 
 * @param met 
 * @returns 
 */
export function intersectRayPlane(r: TRay, p: TPlane, met: number): Txyz {
    const normal: Txyz = vecCross(p[1], p[2]);
    const normal_dot_r: number = vecDot(normal, r[1]);
    if (normal_dot_r === 0) { return null; }
    const u: number = vecDot(normal, vecFromTo(r[0], p[0])) / normal_dot_r;
    switch (met) {
        case 2:
            return vecAdd(r[0], vecMult(r[1], u));
        case 1:
            if (u >= 0) {
                return vecAdd(r[0], vecMult(r[1], u));
            }
            return null;
        case 0:
            if (u >= 0 && u <= 1) {
                return vecAdd(r[0], vecMult(r[1], u));
            }
            return null;
        default:
            return null;
    }
}
// -------------------------------------------------------------------------------------------------