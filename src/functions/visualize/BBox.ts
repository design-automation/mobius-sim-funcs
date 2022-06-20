import { ENT_TYPE, getArrDepth, Sim, idsMake, TBBox, string, string, Txyz } from '../../mobius_sim';

import * as chk from '../../_check_types';


// ================================================================================================
/**
 * Visualises a bounding box by adding geometry to the model.
 * \n
 * See `calc.BBox` for creating the bounding box.
 * To create polygons of the bounding box instead, see `poly2d.BBoxPolygon`.
 * \n
 * The bounding box is an imaginary box that completely contains all the geometry.
 * The box is always aligned with the global x, y, and z axes.
 * \n
 * The bounding box consists of a list of lists, as follows [[x, y, z], [x, y, z], [x, y, z], [x, y, z]].
 * - The first [x, y, z] is the coordinates of the centre of the bounding box.
 * - The second [x, y, z] is the corner of the bounding box with the lowest x, y, z values.
 * - The third [x, y, z] is the corner of the bounding box with the highest x, y, z values.
 * - The fourth [x, y, z] is the dimensions of the bounding box.
 *
 * @param __model__
 * @param bboxes A list of 4 lists (created from `calc.BBox`).
 * @returns Entities, twelve polylines representing the box.
 * @example `bbox1 = calc.BBox(geometry)`, `bbox_vis = visualize.BBox(bbox1)`
 * @example_info Creates a box around the inital geometry. 
 */
export function BBox(__model__: Sim, bboxes: TBBox|TBBox): string[] {
    // --- Error Check ---
    const fn_name = 'visualize.BBox';
    if (this.debug) {
        chk.checkArgs(fn_name, 'bbox', bboxes, [chk.isBBox]); // TODO bboxs can be a list // add isBBoxList to enable check
    }
    // --- Error Check ---
    return  idsMake(_visBBox(__model__, bboxes)) as string[];
}
function _visBBox(__model__: Sim, bboxs: TBBox|TBBox[]): string[] {
    if (getArrDepth(bboxs) === 2) {
        const bbox: TBBox = bboxs as TBBox;
        const _min: Txyz = bbox[1];
        const _max: Txyz = bbox[2];
        // bottom
        const ps0: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps0, _min);
        const ps1: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps1, [_max[0], _min[1], _min[2]]);
        const ps2: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps2, [_max[0], _max[1], _min[2]]);
        const ps3: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps3, [_min[0], _max[1], _min[2]]);
        // top
        const ps4: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps4, [_min[0], _min[1], _max[2]]);
        const ps5: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps5, [_max[0], _min[1], _max[2]]);
        const ps6: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps6, _max);
        const ps7: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps7, [_min[0], _max[1], _max[2]]);
        // plines bottom
        const pl0 = __model__.modeldata.geom.add.addPline([ps0, ps1]);
        const pl1 = __model__.modeldata.geom.add.addPline([ps1, ps2]);
        const pl2 = __model__.modeldata.geom.add.addPline([ps2, ps3]);
        const pl3 = __model__.modeldata.geom.add.addPline([ps3, ps0]);
        // plines top
        const pl4 = __model__.modeldata.geom.add.addPline([ps4, ps5]);
        const pl5 = __model__.modeldata.geom.add.addPline([ps5, ps6]);
        const pl6 = __model__.modeldata.geom.add.addPline([ps6, ps7]);
        const pl7 = __model__.modeldata.geom.add.addPline([ps7, ps4]);
        // plines vertical
        const pl8 = __model__.modeldata.geom.add.addPline([ps0, ps4]);
        const pl9 = __model__.modeldata.geom.add.addPline([ps1, ps5]);
        const pl10 = __model__.modeldata.geom.add.addPline([ps2, ps6]);
        const pl11 = __model__.modeldata.geom.add.addPline([ps3, ps7]);
        // return
        return [pl0, pl1, pl2, pl3, pl4, pl5, pl6, pl7, pl8, pl9, pl10, pl11].map(pl => [ENT_TYPE.PLINE, pl]) as string[];
    } else {
        const ents_arr: string[] = [];
        for (const bbox of bboxs) {
            const bbox_ents: string[] = _visBBox(__model__, bbox as TBBox);
            for (const bbox_ent of bbox_ents) {
                ents_arr.push(bbox_ent);
            }
        }
        return ents_arr;
    }
}
