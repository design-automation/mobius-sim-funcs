import {
    arrMakeFlat,
    distance,
    EEntType,
    GIModel,
    idMake,
    idsBreak,
    isEmptyArr,
    multMatrix,
    TEntTypeIdx,
    TId,
    TPlane,
    Txy,
    Txyz,
    vecAdd,
    vecFromTo,
    vecMult,
    vecNorm,
    xfromSourceTargetMatrix,
} from '@design-automation/mobius-sim';
import { Matrix4 } from 'three';

import { checkIDs, ID } from '../../_check_ids';
import { _EBBoxMethod } from './_enum';
import { _convexHull, _getPosis } from './_shared';


// ================================================================================================
/**
 * Create a polygon that is a 2D bounding box of the entities.
 * \n
 * For the method, 'aabb' generates an Axis Aligned Bounding Box, and 'obb' generates an Oriented Bounding Box.
 * \n
 * See `calc.BBox` and `visualize.BBox` for more on bounding boxes. 
 *
 * @param __model__
 * @param entities A list of positions, or entities from which positions can be extracted.
 * @param method Enum, the method for generating the bounding box: `'aabb'` or `'obb'`.
 * @returns A new polygon, the bounding box of the positions.
 */
export function BBoxPolygon(__model__: GIModel, entities: TId|TId[], method: _EBBoxMethod): TId {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return null; }
    // --- Error Check ---
    const fn_name = 'poly2d.BBoxPolygon';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isIDL1], null) as TEntTypeIdx[];
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        // [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    // posis
    const posis_i: number[] = _getPosis(__model__, ents_arr);
    if (posis_i.length === 0) { return null; }
    let pgon_i: number;
    switch (method) {
        case _EBBoxMethod.AABB:
            pgon_i = _bboxAABB(__model__, posis_i);
            break;
        case _EBBoxMethod.OBB:
            pgon_i = _bboxOBB(__model__, posis_i);
            break;
        default:
            break;
    }
    return idMake(EEntType.PGON, pgon_i) as TId;
}
function _bboxAABB(__model__: GIModel, posis_i: number[]): number {
    const bbox: [number, number, number, number] = [Infinity, Infinity, -Infinity, -Infinity];
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        if (xyz[0] < bbox[0]) { bbox[0] = xyz[0]; }
        if (xyz[1] < bbox[1]) { bbox[1] = xyz[1]; }
        if (xyz[0] > bbox[2]) { bbox[2] = xyz[0]; }
        if (xyz[1] > bbox[3]) { bbox[3] = xyz[1]; }
    }
    const a: Txyz = [bbox[0], bbox[1], 0];
    const b: Txyz = [bbox[2], bbox[1], 0];
    const c: Txyz = [bbox[2], bbox[3], 0];
    const d: Txyz = [bbox[0], bbox[3], 0];
    const box_posis_i: number[] = [];
    for (const xyz of [a, b, c, d]) {
        const box_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(box_posi_i, xyz);
        box_posis_i.push(box_posi_i);
    }
    const box_pgon_i: number = __model__.modeldata.geom.add.addPgon(box_posis_i);
    return box_pgon_i;
}
function _bboxOBB(__model__: GIModel, posis_i: number[]): number {
    // posis
    const hull_posis_i: number[] = _convexHull(__model__, posis_i);
    hull_posis_i.push(hull_posis_i[0]);
    const first: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(hull_posis_i[0]);
    const hull_xyzs: Txyz[] = [[first[0], first[1], 0]];
    let longest_len = 0;
    let origin_index = -1;
    for (let i = 1; i < hull_posis_i.length; i++) {
        // add xy to list
        const next: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(hull_posis_i[i]);
        hull_xyzs.push([next[0], next[1], 0]);
        // get dist
        const curr_len = distance(hull_xyzs[i - 1], hull_xyzs[i]);
        if (curr_len > longest_len) {
            longest_len = curr_len;
            origin_index = i - 1;
        }
    }
    // get the plane
    const origin: Txyz = hull_xyzs[origin_index];
    const x_vec: Txyz = vecNorm(vecFromTo( origin, hull_xyzs[origin_index + 1] ));
    const y_vec: Txyz = [-x_vec[1], x_vec[0], 0]; // vecCross([0, 0, 1], x_vec);
    const source_pln: TPlane = [origin, x_vec, y_vec];
    // xform posis and get min max
    const bbox: [number, number, number, number] = [Infinity, Infinity, -Infinity, -Infinity];
    const target_pln: TPlane = [[0, 0, 0], [1, 0, 0], [0, 1, 0]];
    const matrix: Matrix4 = xfromSourceTargetMatrix(source_pln, target_pln);
    for (const xyz of hull_xyzs) {
        const new_xyz: Txyz = multMatrix(xyz, matrix);
        if (new_xyz[0] < bbox[0]) { bbox[0] = new_xyz[0]; }
        if (new_xyz[1] < bbox[1]) { bbox[1] = new_xyz[1]; }
        if (new_xyz[0] > bbox[2]) { bbox[2] = new_xyz[0]; }
        if (new_xyz[1] > bbox[3]) { bbox[3] = new_xyz[1]; }
    }
    // calc the bbx
    const a: Txyz = vecAdd(origin, vecMult(x_vec, bbox[0]));
    const b: Txyz = vecAdd(origin, vecMult(x_vec, bbox[2]));
    const height_vec: Txyz = vecMult(y_vec, bbox[3] - bbox[1]);
    const c: Txyz = vecAdd(b, height_vec);
    const d: Txyz = vecAdd(a, height_vec);
    const box_posis_i: number[] = [];
    for (const xyz of [a, b, c, d]) {
        const box_posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(box_posi_i, xyz);
        box_posis_i.push(box_posi_i);
    }
    const box_pgon_i: number = __model__.modeldata.geom.add.addPgon(box_posis_i);
    return box_pgon_i;
}
function _distance2d(xy1: Txy, xy2: Txy): number {
    const x = xy1[0] - xy2[0];
    const y = xy1[1] - xy2[1];
    return Math.sqrt(x * x + y * y);
}
