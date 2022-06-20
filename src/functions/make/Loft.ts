import { Sim, ENT_TYPE } from '../../mobius_sim';
import { isEmptyArr } from '../_common/_arrs';
import { _ELoftMethod } from './_enum';

// ================================================================================================
/**
 * Lofts between entities.
 * \n
 * The geometry that is generated depends on the method that is selected.
 * - The 'quads' method will generate polygons.
 * - The 'stringers' and 'ribs' methods will generate polylines.
 * - The 'copies' method will generate copies of the input geometry type.
 *
 * @param __model__
 * @param entities List of entities, or list of lists of entities.
 * @param divisions The number of divisions in the resultant entities. Minimum is 1.
 * @param method Enum, if 'closed', then close the loft back to the first entity in the list:
    `'open_quads', 'closed_quads', 'open_stringers', 'closed_stringers', 'open_ribs', 'closed_ribs'` or `'copies'`.
 * @returns Entities, a list of new polygons or polylines resulting from the loft.
 * @example <a href="/editor?file=/assets/gallery/building_examples/Chapel_Wavy_roof.mob&node=3" target="_blank"> Example model from the gallery, showing polylines being lofted. </a>
 * @example `quads = make.Loft([polyline1,polyline2,polyline3], 1, 'open_quads')`
 * @example_info Creates quad polygons lofting between polyline1, polyline2, polyline3.
 * @example `quads = make.Loft([polyline1,polyline2,polyline3], 1, 'closed_quads')`
 * @example_info Creates quad polygons lofting between polyline1, polyline2, polyline3, and back to polyline1.
 * @example `quads = make.Loft([ [polyline1,polyline2], [polyline3,polyline4] ] , 1, 'open_quads')`
 * @example_info Creates quad polygons lofting first between polyline1 and polyline2, and then between polyline3 and polyline4.
 */
export function Loft(__model__: Sim, entities: string[]|string[][], divisions: number, method: _ELoftMethod): string[] {
    if (isEmptyArr(entities)) { return []; }
    // -----
    const new_ents: string[] = __model__.modeldata.funcs_make.loft(ents_arr, divisions, method);
    return new_ents;
}
