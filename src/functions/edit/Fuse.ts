import { arrMakeFlat, Sim, idsBreak, idsMake, string, string } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';




// ================================================================================================
/**
 * Fuse positions that lie within a certain tolerance of one another.
 * New positions will be created.
 * \n
 * The existing positions are analysed and clustered into groups of positions that lie with the
 * tolerance distance from one another. For each cluster, a new position is created at the centre
 * of the cluster. The xyz coordinates of the new position will be calculated as the average of all 
 * the existing positions in the cluster.
 * \n
 * If the positions that are fuse have vertices attached, then the vertices will become welded.
 * (Note that when using the `edit.Weld()` function, there is no threshold tolerance. Even vertices
 * that are far apart can be welded together. Fusing allows only vertices that are close together 
 * to be welded.)
 * \n
 * In some cases, if edges are shorter than the tolerance, this can result in edges being deleted.
 * The deletion of edges may also result in polylines or polygons being deleted. (It is therefore
 * advisable to filter out deleted entities after applying the `edit.Fuse()` function. For example,
 * if you have a list of polygons, after fusing, you can filter the list like this: 
 * `pgons = pgons#pg`.)
 * \n
 * The new positions that get generated are returned.
 * \n
 * @param __model__
 * @param entities Entities, a list of positions, or entities from which positions can be extracted.
 * @param tolerance The distance tolerance for fusing positions.
 * @returns Entities, a list of new positions.
 */
export function Fuse(__model__: Sim, entities: string|string[], tolerance: number): string[] {
    entities = arrMakeFlat(entities) as string[];
    // --- Error Check ---
    const fn_name = 'edit.Fuse';
    let ents_arr: string[];
    if (this.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL1], null) as string[];
    } else {
        ents_arr = idsBreak(entities) as string[];
    }
    // --- Error Check ---
    const new_ents_arr: string[] = __model__.modeldata.funcs_edit.fuse(ents_arr, tolerance);
    // make and return the IDs of the new posis
    return idsMake(new_ents_arr) as string[];
}
