import {
    arrMakeFlat,
    EEntType,
    GIModel,
    idsBreak,
    idsMake,
    isEmptyArr,
    TEntTypeIdx,
    TId,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { _EClipJointType, _EOffsetRound } from './_enum';
import {
    _getPgonsPlines,
    _offsetPgon,
    _offsetPline,
    IClipOffsetOptions,
    MClipOffsetEndType,
    SCALE,
    TPosisMap,
} from './_shared';



/**
 * Offset a polyline or polygon, with round joints. The original entities are unmodified.
 * \n
 * The types of joints of the generated offset polygon are shown below. 
 * The red border indicates the generated offset polygon, whereas the black polygon
 * is the original/input polygon. 
 * \n
 * ![Examples of offset joints](/assets/typedoc-json/docMDimgs/funcs_poly2d_offsets_joints_examples.png)
 * \n
 * See `poly2d.OffsetMitre` and `poly2d.OffsetChamfer` to use different joints while offsetting.
 * Alternatively, try `modify.Offset` for a different offset operation that works in 3D and modifies
 * the original entities. 
 * \n 
 * For open polylines, the type of ends can be changed with `end\_type`, shown below. 
 * \n
 * ![Examples of offset ends](/assets/typedoc-json/docMDimgs/funcs_poly2d_offsetRound_examples.png)
 * \n
* @param __model__
* @param entities A list of polylines or polygons, or entities from which polylines or polygons can
* be extracted.
* @param dist Offset distance, a number. 
* @param tolerance The tolerance for the rounded corners, a number that is more than 0. In general,
  the smaller the number, the rounder the joints. Will also apply to `round_end` if selected. 
* @param end_type Enum, the type of end shape for open polylines: `'square_end', 'butt_end'` or `'round_end'`.
* @returns A list of new polygons.
*/
export function OffsetRound(__model__: GIModel, entities: TId | TId[], dist: number,
    tolerance: number, end_type: _EOffsetRound): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'poly2d.OffsetRound';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        chk.checkArgs(fn_name, 'tolerance', tolerance, [chk.isNum]);
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    const all_new_pgons: TEntTypeIdx[] = [];
    const options: IClipOffsetOptions = {
        jointType: _EClipJointType.ROUND,
        endType: MClipOffsetEndType.get(end_type),
        roundPrecision: tolerance * SCALE
    };
    const [pgons_i, plines_i]: [number[], number[]] = _getPgonsPlines(__model__, ents_arr);
    for (const pgon_i of pgons_i) {
        const new_pgons_i: number[] = _offsetPgon(__model__, pgon_i, dist, options, posis_map);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([EEntType.PGON, new_pgon_i]);
        }
    }
    for (const pline_i of plines_i) {
        const new_pgons_i: number[] = _offsetPline(__model__, pline_i, dist, options, posis_map);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([EEntType.PGON, new_pgon_i]);
        }
    }
    return idsMake(all_new_pgons) as TId[];
}
