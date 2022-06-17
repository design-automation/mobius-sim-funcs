import {
    arrMakeFlat,
    EEntType,
    GIModel,
    idsBreak,
    idsMake,
    idsMakeFromIdxs,
    isEmptyArr,
    TEntTypeIdx,
    TId,
} from '@design-automation/mobius-sim';
import Shape from '@doodle3d/clipper-js';

import { checkIDs, ID } from '../../_check_ids';
import { _EBooleanMethod } from './_enum';
import {
    _convertPgonsToShapeUnion,
    _convertPgonToShape,
    _convertPlineToShape,
    _convertShapesToPgons,
    _convertShapeToCutPlines,
    _getPgons,
    _getPgonsPlines,
    TPosisMap,
} from './_shared';


// ================================================================================================
/**
 * Perform a boolean operation on polylines or polygons.
 * \n
 * The entities in A can be either polyline or polygons.
 * The entities in B must be polygons.
 * The polygons in B are first unioned before the operation is performed.
 * The boolean operation is then performed between each polyline or polygon in A, and the unioned B polygons.
 * \n
 * If A is an empty list, then an empty list is returned.
 * If B is an empty list, then the A list is returned.
 * \n
 * The input polygons or polylines are not deleted. 
 * 
 * @param __model__
 * @param a_entities A list of polyline or polygons, or entities from which polyline or polygons can be extracted.
 * @param b_entities A list of polygons, or entities from which polygons can be extracted.
 * @param method Enum, the boolean operator to apply: `'intersect', 'difference'` or `'symmetric'`.
 * @returns A list of new polylines and polygons.
 */
export function Boolean(__model__: GIModel, a_entities: TId|TId[], b_entities: TId|TId[], method: _EBooleanMethod): TId[] {
    a_entities = arrMakeFlat(a_entities) as TId[];
    if (isEmptyArr(a_entities)) { return []; }
    b_entities = arrMakeFlat(b_entities) as TId[];
    // --- Error Check ---
    const fn_name = 'poly2d.Boolean';
    let a_ents_arr: TEntTypeIdx[];
    let b_ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        a_ents_arr = checkIDs(__model__, fn_name, 'a_entities', a_entities,
        [ID.isID, ID.isIDL1], [EEntType.PGON, EEntType.PLINE]) as TEntTypeIdx[];
        b_ents_arr = checkIDs(__model__, fn_name, 'b_entities', b_entities,
        [ID.isID, ID.isIDL1], [EEntType.PGON]) as TEntTypeIdx[];
    } else {
        // a_ents_arr = splitIDs(fn_name, 'a_entities', a_entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // b_ents_arr = splitIDs(fn_name, 'b_entities', b_entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        a_ents_arr = idsBreak(a_entities) as TEntTypeIdx[];
        b_ents_arr = idsBreak(b_entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    const [a_pgons_i, a_plines_i]: [number[], number[]] = _getPgonsPlines(__model__, a_ents_arr);
    const b_pgons_i: number[] = _getPgons(__model__, b_ents_arr);
    if (a_pgons_i.length === 0 && a_plines_i.length === 0) { return []; }
    if (b_pgons_i.length === 0) {
        switch (method) {
            case _EBooleanMethod.INTERSECT:
                // intersect with nothing returns nothing
                return [];
            case _EBooleanMethod.DIFFERENCE:
            case _EBooleanMethod.SYMMETRIC:
                // difference with nothing returns copies
                return idsMake(__model__.modeldata.funcs_common.copyGeom(a_ents_arr, false)) as TId[];
            default:
                return [];
        }
    }
    // const a_shape: Shape = _convertPgonsToShapeUnion(__model__, a_pgons_i, posis_map);
    const b_shape: Shape = _convertPgonsToShapeUnion(__model__, b_pgons_i, posis_map);
    // call the boolean function
    const new_pgons_i: number[] = _booleanPgons(__model__, a_pgons_i, b_shape, method, posis_map);
    const new_plines_i: number[] = _booleanPlines(__model__, a_plines_i, b_shape, method, posis_map);
    // make the list of polylines and polygons
    const result_ents: TId[] = [];
    const new_pgons: TId[] = idsMakeFromIdxs(EEntType.PGON, new_pgons_i) as TId[];
    // const new_pgons: TId[] = idsMake(new_pgons_i.map( pgon_i => [EEntType.PGON, pgon_i] as TEntTypeIdx )) as TId[];
    for (const new_pgon of new_pgons) {
        result_ents.push(new_pgon);
    }
    const new_plines: TId[] = idsMakeFromIdxs(EEntType.PLINE, new_plines_i) as TId[];
    // const new_plines: TId[] = idsMake(new_plines_i.map( pline_i => [EEntType.PLINE, pline_i] as TEntTypeIdx )) as TId[];
    for (const new_pline of new_plines) {
        result_ents.push(new_pline);
    }
    // always return a list
    return result_ents;
}
function _booleanPgons(__model__: GIModel, pgons_i: number|number[], b_shape: Shape,
        method: _EBooleanMethod, posis_map: TPosisMap): number[] {
    if (!Array.isArray(pgons_i)) {
        pgons_i = pgons_i as number;
        const a_shape: Shape = _convertPgonToShape(__model__, pgons_i, posis_map);
        let result_shape: Shape;
        switch (method) {
            case _EBooleanMethod.INTERSECT:
                result_shape = a_shape.intersect(b_shape);
                break;
            case _EBooleanMethod.DIFFERENCE:
                result_shape = a_shape.difference(b_shape);
                break;
            case _EBooleanMethod.SYMMETRIC:
                result_shape = a_shape.xor(b_shape);
                break;
            default:
                break;
        }
        return _convertShapesToPgons(__model__, result_shape, posis_map);
    } else {
        pgons_i = pgons_i as number[];
        const all_new_pgons: number[] = [];
        for (const pgon_i of pgons_i) {
            const result_pgons_i: number[] = _booleanPgons(__model__, pgon_i, b_shape, method, posis_map);
            for (const result_pgon_i of result_pgons_i) {
                all_new_pgons.push(result_pgon_i);
            }
        }
        return all_new_pgons;
    }
}
function _booleanPlines(__model__: GIModel, plines_i: number|number[], b_shape: Shape,
        method: _EBooleanMethod, posis_map: TPosisMap): number[] {
    if (!Array.isArray(plines_i)) {
        plines_i = plines_i as number;
        // const wire_i: number = __model__.modeldata.geom.nav.navPlineToWire(plines_i);
        // const is_closed: boolean = __model__.modeldata.geom.query.isWireClosed(wire_i);
        // const a_shape: Shape = _convertWireToShape(__model__, wire_i, is_closed, posis_map);
        const a_shape: Shape = _convertPlineToShape(__model__, plines_i, posis_map);
        let result_shape: Shape;
        switch (method) {
            case _EBooleanMethod.INTERSECT:
                result_shape = a_shape.intersect(b_shape);
                break;
            case _EBooleanMethod.DIFFERENCE:
                result_shape = a_shape.difference(b_shape);
                break;
            case _EBooleanMethod.SYMMETRIC:
                // the perimeter of the B polygon is included in the output
                // but the perimeter is not closed, which seems strange
                result_shape = a_shape.xor(b_shape);
                break;
            default:
                break;
        }
        return _convertShapeToCutPlines(__model__, result_shape, posis_map);
    } else {
        plines_i = plines_i as number[];
        const all_new_plines: number[] = [];
        for (const pline_i of plines_i) {
            const result_plines_i: number[] = _booleanPlines(__model__, pline_i, b_shape, method, posis_map);
            for (const result_pline_i of result_plines_i) {
                all_new_plines.push(result_pline_i);
            }
        }
        return all_new_plines;
    }
}
