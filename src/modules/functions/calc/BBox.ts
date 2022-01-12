import { arrMakeFlat, GIModel, idsBreak, TBBox, TEntTypeIdx, TId, Txyz } from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../../_check_ids';


// ================================================================================================
/**
 * Returns the bounding box of the entities.
 * The bounding box is an imaginary box that completley contains all the geometry.
 * The box is always aligned with the global x, y, and z axes.
 * The bounding box consists of a list of lists, as follows [[x, y, z], [x, y, z], [x, y, z], [x, y, z]].
 *
 * - The first [x, y, z] is the coordinates of the centre of the bounding box.
 * - The second [x, y, z] is the corner of the bounding box with the lowest x, y, z values.
 * - The third [x, y, z] is the corner of the bounding box with the highest x, y, z values.
 * - The fourth [x, y, z] is the dimensions of the bounding box.
 *
 * @param __model__
 * @param entities The etities for which to calculate the bounding box.
 * @returns The bounding box consisting of a list of four lists.
 */
export function BBox(__model__: GIModel, entities: TId|TId[]): TBBox {
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = 'calc.BBox';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isIDL1], null) as TEntTypeIdx[]; // all
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    return _getBoundingBox(__model__, ents_arr);
}
function _getBoundingBox(__model__: GIModel, ents_arr: TEntTypeIdx[]): TBBox {
    const posis_set_i: Set<number> = new Set();
    for (const ent_arr of ents_arr) {
        const ent_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]);
        for (const ent_posi_i of ent_posis_i) {
            posis_set_i.add(ent_posi_i);
        }
    }
    const unique_posis_i = Array.from(posis_set_i);
    const unique_xyzs: Txyz[] = unique_posis_i.map( posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
    const corner_min: Txyz = [Infinity, Infinity, Infinity];
    const corner_max: Txyz = [-Infinity, -Infinity, -Infinity];
    for (const unique_xyz of unique_xyzs) {
        if (unique_xyz[0] < corner_min[0]) { corner_min[0] = unique_xyz[0]; }
        if (unique_xyz[1] < corner_min[1]) { corner_min[1] = unique_xyz[1]; }
        if (unique_xyz[2] < corner_min[2]) { corner_min[2] = unique_xyz[2]; }
        if (unique_xyz[0] > corner_max[0]) { corner_max[0] = unique_xyz[0]; }
        if (unique_xyz[1] > corner_max[1]) { corner_max[1] = unique_xyz[1]; }
        if (unique_xyz[2] > corner_max[2]) { corner_max[2] = unique_xyz[2]; }
    }
    return [
        [(corner_min[0] + corner_max[0]) / 2, (corner_min[1] + corner_max[1]) / 2, (corner_min[2] + corner_max[2]) / 2],
        corner_min,
        corner_max,
        [corner_max[0] - corner_min[0], corner_max[1] - corner_min[1], corner_max[2] - corner_min[2]]
    ];
}
