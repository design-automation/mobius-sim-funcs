import { TPlane, TRay, Txyz } from './consts';
import { vecAdd, vecCross, vecLen, vecFromTo, vecDot, vecNorm, vecSetLen } from './calcVectors';
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param c 
 * @param r 
 * @param met 
 * @returns 
 */
export function project(c: Txyz, r: TRay|TPlane, met: number = 2): Txyz {
    if (r.length === 2) {
        return projectCoordOntoRay(c, r, met);
    } else if (r.length === 3) {
        return projectCoordOntoPlane(c, r);
    } else {
        throw new Error('Error calculating projection. Projection must be onto either rays or planes.');
    }
}
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param c 
 * @param r 
 * @param met 
 * @returns 
 */
export function projectCoordOntoRay(c: Txyz, r: TRay, met: number): Txyz {
    const vec: Txyz = vecFromTo(r[0], c);
    const dot: number = vecDot(vec, vecNorm(r[1]));
    switch (met) {
        case 2:
            return vecAdd(r[0], vecSetLen(r[1], dot));
        case 1:
            if (dot <= 0) {
                return r[0].slice() as Txyz;
            }
            return vecAdd(r[0], vecSetLen(r[1], dot));
        case 0:
            const length: number = vecLen(r[1]);
            if (dot <= 0) {
                return r[0].slice() as Txyz;
            } else if (dot >= length) {
                return vecAdd(r[0], r[1]);
            }
            return vecAdd(r[0], vecSetLen(r[1], dot));
        default:
            return null;
    }
}
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param c 
 * @param p 
 * @returns 
 */
export function projectCoordOntoPlane(c: Txyz, p: TPlane): Txyz {
    const vec_to_c: Txyz = vecFromTo(p[0], c);
    const pln_z_vec: Txyz = vecCross(p[1], p[2]);
    const vec_a: Txyz = vecCross(vec_to_c, pln_z_vec);
    if (vecLen(vec_a) === 0) { return p[0].slice() as Txyz; }
    const vec_b: Txyz = vecCross(vec_a, pln_z_vec);
    const dot: number = vecDot(vec_to_c, vecNorm(vec_b));
    return vecAdd(p[0], vecSetLen(vec_b, dot));
}
// -------------------------------------------------------------------------------------------------