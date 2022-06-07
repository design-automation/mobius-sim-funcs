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
import Shape from '@doodle3d/clipper-js';

import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import {
    _convertPgonToShape,
    _convertShapesToPgons,
    _convertShapeToPlines,
    _convertWireToShape,
    _getPgonsPlines,
    IClipResult,
    SCALE,
    TPosisMap,
} from './_shared';

let ShapeClass = Shape;
//@ts-ignore
if (Shape.default) { ShapeClass = Shape.default; }

// Clipper types
// ================================================================================================
/**
 * Clean a polyline or polygon.
 * \n
 * Vertices that are closer together than the specified tolerance will be merged.
 * Vertices that are colinear within the tolerance distance will be deleted.
 * \n
 * @param __model__
 * @param entities A list of polylines or polygons, or entities from which polylines or polygons can be extracted.
 * @param tolerance The tolerance for deleting vertices from the polyline. 
 * (If nothing happens, try using a smaller tolerance number from 0-2. 
 * Results of tolerance can be checked with query.Get vertices.)
 * @returns A list of new polylines or polygons.
 */
export function Clean(__model__: GIModel, entities: TId|TId[], tolerance: number): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'poly2d.Clean';
    let ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        chk.checkArgs(fn_name, 'tolerance', tolerance, [chk.isNum]);
    } else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    const all_new_ents: TEntTypeIdx[] = [];
    const [pgons_i, plines_i]: [number[], number[]] = _getPgonsPlines(__model__, ents_arr);
    for (const pgon_i of pgons_i) {
        const new_pgons_i: number[] = _cleanPgon(__model__, pgon_i, tolerance, posis_map);
        for (const new_pgon_i of new_pgons_i) {
            all_new_ents.push([EEntType.PGON, new_pgon_i]);
        }
    }
    for (const pline_i of plines_i) {
        const new_plines_i: number[] = _cleanPline(__model__, pline_i, tolerance, posis_map);
        for (const new_pline_i of new_plines_i) {
            all_new_ents.push([EEntType.PLINE, new_pline_i]);
        }
    }
    return idsMake(all_new_ents) as TId[];
}
function _cleanPgon(__model__: GIModel, pgon_i: number, tolerance: number, posis_map: TPosisMap): number[] {
    const shape: Shape = _convertPgonToShape(__model__, pgon_i, posis_map);
    const result: IClipResult = shape.clean(tolerance * SCALE);
    const result_shape: Shape = new ShapeClass(result.paths, result.closed);
    return _convertShapesToPgons(__model__, result_shape, posis_map);
}
function _cleanPline(__model__: GIModel, pline_i: number, tolerance: number, posis_map: TPosisMap): number[] {
    const wire_i: number = __model__.modeldata.geom.nav.navPlineToWire(pline_i);
    const verts_i: number[] = __model__.modeldata.geom.nav.navAnyToVert(EEntType.WIRE,  wire_i);
    if (verts_i.length === 2) { return [pline_i]; }
    const is_closed: boolean = __model__.modeldata.geom.query.isWireClosed(wire_i);
    const shape: Shape = _convertWireToShape(__model__, wire_i, is_closed, posis_map);
    const result: IClipResult = shape.clean(tolerance * SCALE);
    const result_shape: Shape = new ShapeClass(result.paths, result.closed);
    const shape_num_verts: number = result_shape.paths[0].length;
    if (shape_num_verts === 0 || shape_num_verts === verts_i.length) { return [pline_i]; }
    return _convertShapeToPlines(__model__, result_shape, result.closed, posis_map);
}
