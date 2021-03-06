import {
    arrMakeFlat,
    EEntType,
    GIModel,
    idMake,
    idsBreak,
    isEmptyArr,
    TEntTypeIdx,
    TId,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';
import { _convexHull, _getPosis } from './_shared';


// ================================================================================================
/**
 * Creates a convex hull from a list of positions. 
 * \n
 * For more information, see the wikipedia article: 
 * <a href="https://en.wikipedia.org/wiki/Convex_hull" target="_blank">Convex_Hull</a>
 * \n
 * <img
 * src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Extreme_points.svg/330px-Extreme_points.svg.png"
 * alt="Convex hull example" width="150">
 * \n
 * In the image above, the convex hull of the red set is the blue and red convex set.
 * 
 * @param __model__
 * @param entities A list of positions, or entities from which positions can be extracted.
 * @returns A list of new polygons, the convex hull of the positions.
 */
export function ConvexHull(__model__: GIModel, entities: TId|TId[]): TId {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return null; }
    // --- Error Check ---
    const fn_name = 'poly2d.ConvexHull';
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
    const hull_posis_i: number[] = _convexHull(__model__, posis_i);
    // return cell pgons
    const hull_pgon_i: number = __model__.modeldata.geom.add.addPgon(hull_posis_i);
    return idMake(EEntType.PGON, hull_pgon_i) as TId;
}
