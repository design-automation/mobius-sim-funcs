/**
 * The `poly2D` module has a set of functions for working with 2D polygons, on the XY plane.
 * @module
 */
import {
    arrMakeFlat,
    EEntType,
    GIModel,
    idsBreak,
    idsMakeFromIdxs,
    isEmptyArr,
    TEntTypeIdx,
    TId,
} from '@design-automation/mobius-sim';
import Shape from '@doodle3d/clipper-js';

import { checkIDs, ID } from '../../../_check_ids';
import { _convertPgonsToShapeUnion, _convertShapesToPgons, _getPgons } from './_shared';


type TPosisMap = Map<number, Map<number, number>>;
// ================================================================================================
/**
 * Create the union of a set of polygons.
 *
 * @param __model__
 * @param entities A list of polygons, or entities from which polygons can bet extracted.
 * @returns A list of new polygons.
 */
export function Union(__model__: GIModel, entities: TId|TId[]): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'poly2d.Union';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL1], null) as TEntTypeIdx[];
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    const pgons_i: number[] = _getPgons(__model__, ents_arr);
    if (pgons_i.length === 0) { return []; }
    const result_shape: Shape = _convertPgonsToShapeUnion(__model__, pgons_i, posis_map);
    if (result_shape === null) { return []; }
    const all_new_pgons: number[] = _convertShapesToPgons(__model__, result_shape, posis_map);
    return idsMakeFromIdxs(EEntType.PGON, all_new_pgons) as TId[];
    // return idsMake(all_new_pgons.map( pgon_i => [EEntType.PGON, pgon_i] as TEntTypeIdx )) as TId[];
}
