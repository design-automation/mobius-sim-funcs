import { Sim, ENT_TYPE } from 'src/mobius_sim';
import { arrMakeFlat } from '../_common/_arrs';

// ================================================================================================
/**
 * Joins existing polyline or polygons to create new polyline or polygons.
 * \n
 * In order to be joined, the polylines or polygons must be fused (i.e. share the same positions)
 * \n
 * The existing polygons are not affected.
 * \n
 * Note: Joining polylines currently not implemented.
 *
 * @param __model__
 * @param entities Polylines or polygons, or entities from which polylines or polygons can be extracted.
 * @returns Entities, a list of new polylines or polygons resulting from the join.
 */
export function Join(__model__: Sim, entities: string[]): string[] {
    entities = arrMakeFlat(entities) as string[];
    if (entities.length === 0) { return []; }
    // -----
    const new_ents: string[] = __model__.modeldata.funcs_make.join(ents);
    return new_ents as string[];
}
