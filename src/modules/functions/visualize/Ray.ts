import {
    EEntType,
    getArrDepth,
    GIModel,
    idsMake,
    TEntTypeIdx,
    TId,
    TRay,
    Txyz,
    vecAdd,
    vecCross,
    vecDot,
    vecMult,
    vecNorm,
    vecSetLen,
    vecSub,
} from '@design-automation/mobius-sim';

import * as chk from '../../_check_types';


// ================================================================================================
/**
 * Visualises a ray or a list of rays by creating a polyline with an arrow head.
 *
 * @param __model__
 * @param rays Polylines representing the ray or rays.
 * @param scale Scales the arrow head of the vector.
 * @returns entities, a line with an arrow head representing the ray.
 * @example ray1 = visualize.Ray([[1,2,3],[0,0,1]])
 */
export function Ray(__model__: GIModel, rays: TRay|TRay[], scale: number): TId[] {
    // --- Error Check ---
    const fn_name = 'visualize.Ray';
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'ray', rays, [chk.isRay, chk.isRayL]);
        chk.checkArgs(fn_name, 'scale', scale, [chk.isNum]);
    }
    // --- Error Check ---
   return idsMake(_visRay(__model__, rays, scale)) as TId[];
}
function _visRay(__model__: GIModel, rays: TRay|TRay[], scale: number): TEntTypeIdx[] {
    if (getArrDepth(rays) === 2) {
        const ray: TRay = rays as TRay;
        const origin: Txyz = ray[0];
        const vec: Txyz = ray[1]; // vecMult(ray[1], scale);
        const end: Txyz = vecAdd(origin, vec);
        // create orign point
        const origin_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(origin_posi_i, origin);
        // create pline
        const end_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(end_posi_i, end);
        const pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, end_posi_i]);
        // create the arrow heads
        const vec_unit: Txyz = vecNorm(ray[1]);
        const head_scale = scale;
        let vec_norm: Txyz = null;
        if (vecDot([0, 0, 1], vec)) {
            vec_norm = vecSetLen(vecCross(vec_unit, [0, 1, 0]), head_scale);
        } else {
            vec_norm = vecSetLen(vecCross(vec_unit, [0, 0, 1]), head_scale);
        }
        const vec_rev: Txyz = vecSetLen(vecMult(vec, -1), head_scale);
        const arrow_a: Txyz = vecAdd(vecAdd(end, vec_rev), vec_norm);
        const arrow_a_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(arrow_a_posi_i, arrow_a);
        const arrow_a_pline_i: number = __model__.modeldata.geom.add.addPline([end_posi_i, arrow_a_posi_i]);
        const arrow_b: Txyz = vecSub(vecAdd(end, vec_rev), vec_norm);
        const arrow_b_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(arrow_b_posi_i, arrow_b);
        const arrow_b_pline_i = __model__.modeldata.geom.add.addPline([end_posi_i, arrow_b_posi_i]);
        // return the geometry IDs
        return [
            [EEntType.PLINE, pline_i],
            [EEntType.PLINE, arrow_a_pline_i],
            [EEntType.PLINE, arrow_b_pline_i]
        ];
    } else {
        const ents_arr: TEntTypeIdx[] = [];
        for (const ray of rays) {
            const ray_ents: TEntTypeIdx[] = _visRay(__model__, ray as TRay, scale);
            for (const ray_ent of ray_ents) {
                ents_arr.push(ray_ent);
            }
        }
        return ents_arr;
    }
}
