import {
    arrMakeFlat,
    ENT_TYPE,
    Sim,
    idsBreak,
    idsMakeFromIdxs,
    isEmptyArr,
    string,
    string,
} from '../../mobius_sim';
import Shape from '@doodle3d/clipper-js';

import { checkIDs, ID } from '../_common/_check_ids';
import { _convertPgonsToShapeUnion, _convertShapesToPgons, _getPgons } from './_shared';


type TPosisMap = Map<number, Map<number, number>>;
// ================================================================================================
/**
 * Create the union of a set of polygons. The original polygons are not edited.
 *
 * @param __model__
 * @param entities A list of polygons, or entities from which polygons can be extracted.
 * @returns A list of new polygons.
 */
export function Union(__model__: Sim, entities: string|string[]): string[] {
    entities = arrMakeFlat(entities) as string[];
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'poly2d.Union';
    let ents_arr: string[];
    if (this.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL1], [ENT_TYPE.PGON]) as string[];
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], null) as string[];
        ents_arr = idsBreak(entities) as string[];
    }
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    const pgons_i: number[] = _getPgons(__model__, ents_arr);
    if (pgons_i.length === 0) { return []; }
    const result_shape: Shape = _convertPgonsToShapeUnion(__model__, pgons_i, posis_map);
    if (result_shape === null) { return []; }
    const all_new_pgons: number[] = _convertShapesToPgons(__model__, result_shape, posis_map);
    return idsMakeFromIdxs(ENT_TYPE.PGON, all_new_pgons) as string[];
    // return idsMake(all_new_pgons.map( pgon_i => [ENT_TYPE.PGON, pgon_i] as string )) as string[];
}
