import {
    arrMakeFlat,
    ENT_TYPE,
    Sim,
    idsBreak,
    idsMake,
    isEmptyArr,
    string,
    string,
} from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../../_check_types';
import { _EClipJointType, _EOffset } from './_enum';
import { _getPgonsPlines, _offsetPgon, _offsetPline, IClipOffsetOptions, MClipOffsetEndType, TPosisMap } from './_shared';


// ================================================================================================
/**
 * Offset a polyline or polygon, with mitered joints. The original entities are unmodified.
 * \n
 * The types of joints of the generated offset polygon are shown below. 
 * The red border indicates the generated offset polygon, whereas the black polygon
 * is the original/input polygon. 
 * \n
 * ![Examples of offset joints](/assets/typedoc-json/docMDimgs/funcs_poly2d_offsets_joints_examples.png)
 * \n
 * See `poly2d.OffsetChamfer` and `poly2d.OffsetRound` to use different joints while offsetting. 
 * Alternatively, try `modify.Offset` for a different offset operation that works in 3D and modifies
 * the original entities. 
 * \n 
 * For open polylines, the type of ends can be changed with `end\_type`, shown below. 
 * \n
 * ![Examples of offset ends](/assets/typedoc-json/docMDimgs/funcs_poly2d_offsets_examples.png)
 * \n
 * `limit` determines how far a mitered joint can be offset if it is at a sharp angle (see above image).
 * If the mitered joint's length exceeds the `limit`, a "squared" offsetting is created at the joint. 
 *
 * @param __model__
 * @param entities A list of polylines or polygons, or entities from which polylines or polygons can be extracted.
 * @param dist Offset distance, a number. 
 * @param limit Mitre limit, a number.
 * @param end_type Enum, the type of end shape for open polylines: `'square_end'` or `'butt_end'`.
 * @returns A list of new polygons.
 */
export function OffsetMitre(__model__: Sim, entities: string|string[], dist: number,
        limit: number, end_type: _EOffset): string[] {
    entities = arrMakeFlat(entities) as string[];
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'poly2d.OffsetMitre';
    let ents_arr: string[];
    if (this.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1], [ENT_TYPE.PLINE, ENT_TYPE.PGON]) as string[];
        chk.checkArgs(fn_name, 'miter_limit', limit, [chk.isNum]);
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], [ENT_TYPE.PLINE, ENT_TYPE.PGON]) as string[];
        ents_arr = idsBreak(entities) as string[];
    }
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    const all_new_pgons: string[] = [];
    const options: IClipOffsetOptions = {
        jointType: _EClipJointType.MITER,
        endType: MClipOffsetEndType.get(end_type),
        miterLimit: limit / dist
    };
    const [pgons_i, plines_i]: [number[], number[]] = _getPgonsPlines(__model__, ents_arr);
    for (const pgon_i of pgons_i) {
        const new_pgons_i: number[] = _offsetPgon(__model__, pgon_i, dist, options, posis_map);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([ENT_TYPE.PGON, new_pgon_i]);
        }
    }
    for (const pline_i of plines_i) {
        const new_pgons_i: number[] = _offsetPline(__model__, pline_i, dist, options, posis_map);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([ENT_TYPE.PGON, new_pgon_i]);
        }
    }
    // for (const [ent_type, ent_i] of ents_arr) {
    //     const new_pgons_i: number[] = _offset(__model__, ent_type, ent_i, dist, options);
    //     if (new_pgons_i !== null) {
    //         for (const new_pgon_i of new_pgons_i) {
    //             all_new_pgons.push([ENT_TYPE.PGON, new_pgon_i]);
    //         }
    //     }
    // }
    return idsMake(all_new_pgons) as string[];
}
