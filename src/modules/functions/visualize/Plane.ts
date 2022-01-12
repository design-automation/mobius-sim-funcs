import {
    EEntType,
    getArrDepth,
    GIModel,
    idsMake,
    TEntTypeIdx,
    TId,
    TPlane,
    Txyz,
    vecAdd,
    vecCross,
    vecMult,
    vecSetLen,
    vecSub,
} from '@design-automation/mobius-sim';

import * as chk from '../../../_check_types';


// ================================================================================================
/**
 * Visualises a plane or a list of planes by creating polylines.
 *
 * @param __model__
 * @param plane A plane or a list of planes.
 * @returns Entities, a square plane polyline and three axis polyline.
 * @example plane1 = visualize.Plane(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
export function Plane(__model__: GIModel, planes: TPlane|TPlane[], scale: number): TId[] {
    // --- Error Check ---
    const fn_name = 'visualize.Plane';
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'planes', planes,
            [chk.isPln, chk.isPlnL]);
        chk.checkArgs(fn_name, 'scale', scale, [chk.isNum]);
    }
    // --- Error Check ---
    return idsMake(_visPlane(__model__, planes, scale)) as TId[];
}
function _visPlane(__model__: GIModel, planes: TPlane|TPlane[], scale: number): TEntTypeIdx[] {
    if (getArrDepth(planes) === 2) {
        const plane: TPlane = planes as TPlane;
        const origin: Txyz = plane[0];
        const x_vec: Txyz = vecMult(plane[1], scale);
        const y_vec: Txyz = vecMult(plane[2], scale);
        let x_end: Txyz = vecAdd(origin, x_vec);
        let y_end: Txyz = vecAdd(origin, y_vec);
        const z_end: Txyz = vecAdd(origin, vecSetLen(vecCross(x_vec, y_vec), scale) );
        const plane_corners: Txyz[] = [
            vecAdd(x_end, y_vec),
            vecSub(y_end, x_vec),
            vecSub(vecSub(origin, x_vec), y_vec),
            vecSub(x_end, y_vec),
        ];
        x_end = vecAdd(x_end, vecMult(x_vec, 0.1));
        y_end = vecSub(y_end, vecMult(y_vec, 0.1));
        // create the point
        const origin_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(origin_posi_i, origin);
        // create the x axis
        const x_end_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(x_end_posi_i, x_end);
        const x_pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, x_end_posi_i]);
        // create the y axis
        const y_end_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(y_end_posi_i, y_end);
        const y_pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, y_end_posi_i]);
        // create the z axis
        const z_end_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(z_end_posi_i, z_end);
        const z_pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, z_end_posi_i]);
        // create pline for plane
        const corner_posis_i: number[] = [];
        for (const corner of plane_corners) {
            const posi_i: number = __model__.modeldata.geom.add.addPosi();
            __model__.modeldata.attribs.posis.setPosiCoords(posi_i, corner);
            corner_posis_i.push(posi_i);
        }
        const plane_i = __model__.modeldata.geom.add.addPline(corner_posis_i, true);
        // return the geometry IDs
        return [
            [EEntType.PLINE, x_pline_i],
            [EEntType.PLINE, y_pline_i],
            [EEntType.PLINE, z_pline_i],
            [EEntType.PLINE, plane_i]
        ];
    } else {
        const ents_arr: TEntTypeIdx[] = [];
        for (const plane of planes) {
            const plane_ents: TEntTypeIdx[] = _visPlane(__model__, plane as TPlane, scale);
            for (const plane_ent of plane_ents) {
                ents_arr.push(plane_ent);
            }
        }
        return ents_arr;
    }
}
