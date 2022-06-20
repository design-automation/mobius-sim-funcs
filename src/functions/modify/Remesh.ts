import { arrMakeFlat, ENT_TYPE, Sim, idsBreak, isEmptyArr, string, string } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';




// ================================================================================================
/**
 * Remesh a face or polygon.
 * \n
 * When a face or polygon is deformed, the triangles that make up that face will sometimes become incorrect.
 * \n
 * Remeshing will regenerate the triangulated mesh for the face.
 * \n
 * Remeshing is not performed automatically as it would degrade performance.
 * Instead, it is left up to the user to remesh only when it is actually required.
 * \n
 * @param __model__
 * @param entities Single or list of faces, polygons, collections.
 * @returns void
 * @example <a href="/editor?file=/assets/examples/Functions_modify.Remesh_example.mob&node=1" target="_blank"> Example of Usage </a>
 * @example_info A model showing proper usage of make.Remesh, to remove extra polygons created when modifying the model.
 * @example `modify.Remesh(polygon1)`
 * @example_info Remeshes the face of the polygon.
 * 
 */
export function Remesh(__model__: Sim, entities: string[]): void {
    entities = arrMakeFlat(entities) as string[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        let ents_arr: string[];
        if (this.debug) {
            ents_arr = checkIDs(__model__, 'modify.Remesh', 'entities', entities,
            [ID.isID, ID.isIDL1], [ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
        } else {
            ents_arr = idsBreak(entities) as string[];
        }
        // --- Error Check ---
        __model__.modeldata.funcs_modify.remesh(ents_arr);
    }
}
