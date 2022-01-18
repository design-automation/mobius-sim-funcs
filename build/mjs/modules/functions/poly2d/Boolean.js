import { arrMakeFlat, EEntType, idsBreak, idsMake, idsMakeFromIdxs, isEmptyArr, } from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../../_check_ids';
import { _EBooleanMethod } from './_enum';
import { _convertPgonsToShapeUnion, _convertPgonToShape, _convertPlineToShape, _convertShapesToPgons, _convertShapeToCutPlines, _getPgons, _getPgonsPlines, } from './_shared';
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
 * @param __model__
 * @param a_entities A list of polyline or polygons, or entities from which polyline or polygons can be extracted.
 * @param b_entities A list of polygons, or entities from which polygons can be extracted.
 * @param method Enum, the boolean operator to apply.
 * @returns A list of new polylines and polygons.
 */
export function Boolean(__model__, a_entities, b_entities, method) {
    a_entities = arrMakeFlat(a_entities);
    if (isEmptyArr(a_entities)) {
        return [];
    }
    b_entities = arrMakeFlat(b_entities);
    // --- Error Check ---
    const fn_name = 'poly2d.Boolean';
    let a_ents_arr;
    let b_ents_arr;
    if (__model__.debug) {
        a_ents_arr = checkIDs(__model__, fn_name, 'a_entities', a_entities, [ID.isID, ID.isIDL1], null);
        b_ents_arr = checkIDs(__model__, fn_name, 'b_entities', b_entities, [ID.isID, ID.isIDL1], null);
    }
    else {
        // a_ents_arr = splitIDs(fn_name, 'a_entities', a_entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // b_ents_arr = splitIDs(fn_name, 'b_entities', b_entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        a_ents_arr = idsBreak(a_entities);
        b_ents_arr = idsBreak(b_entities);
    }
    // --- Error Check ---
    const posis_map = new Map();
    const [a_pgons_i, a_plines_i] = _getPgonsPlines(__model__, a_ents_arr);
    const b_pgons_i = _getPgons(__model__, b_ents_arr);
    if (a_pgons_i.length === 0 && a_plines_i.length === 0) {
        return [];
    }
    if (b_pgons_i.length === 0) {
        switch (method) {
            case _EBooleanMethod.INTERSECT:
                // intersect with nothing returns nothing
                return [];
            case _EBooleanMethod.DIFFERENCE:
            case _EBooleanMethod.SYMMETRIC:
                // difference with nothing returns copies
                return idsMake(__model__.modeldata.funcs_common.copyGeom(a_ents_arr, false));
            default:
                return [];
        }
    }
    // const a_shape: Shape = _convertPgonsToShapeUnion(__model__, a_pgons_i, posis_map);
    const b_shape = _convertPgonsToShapeUnion(__model__, b_pgons_i, posis_map);
    // call the boolean function
    const new_pgons_i = _booleanPgons(__model__, a_pgons_i, b_shape, method, posis_map);
    const new_plines_i = _booleanPlines(__model__, a_plines_i, b_shape, method, posis_map);
    // make the list of polylines and polygons
    const result_ents = [];
    const new_pgons = idsMakeFromIdxs(EEntType.PGON, new_pgons_i);
    // const new_pgons: TId[] = idsMake(new_pgons_i.map( pgon_i => [EEntType.PGON, pgon_i] as TEntTypeIdx )) as TId[];
    for (const new_pgon of new_pgons) {
        result_ents.push(new_pgon);
    }
    const new_plines = idsMakeFromIdxs(EEntType.PLINE, new_plines_i);
    // const new_plines: TId[] = idsMake(new_plines_i.map( pline_i => [EEntType.PLINE, pline_i] as TEntTypeIdx )) as TId[];
    for (const new_pline of new_plines) {
        result_ents.push(new_pline);
    }
    // always return a list
    return result_ents;
}
function _booleanPgons(__model__, pgons_i, b_shape, method, posis_map) {
    if (!Array.isArray(pgons_i)) {
        pgons_i = pgons_i;
        const a_shape = _convertPgonToShape(__model__, pgons_i, posis_map);
        let result_shape;
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
    }
    else {
        pgons_i = pgons_i;
        const all_new_pgons = [];
        for (const pgon_i of pgons_i) {
            const result_pgons_i = _booleanPgons(__model__, pgon_i, b_shape, method, posis_map);
            for (const result_pgon_i of result_pgons_i) {
                all_new_pgons.push(result_pgon_i);
            }
        }
        return all_new_pgons;
    }
}
function _booleanPlines(__model__, plines_i, b_shape, method, posis_map) {
    if (!Array.isArray(plines_i)) {
        plines_i = plines_i;
        // const wire_i: number = __model__.modeldata.geom.nav.navPlineToWire(plines_i);
        // const is_closed: boolean = __model__.modeldata.geom.query.isWireClosed(wire_i);
        // const a_shape: Shape = _convertWireToShape(__model__, wire_i, is_closed, posis_map);
        const a_shape = _convertPlineToShape(__model__, plines_i, posis_map);
        let result_shape;
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
    }
    else {
        plines_i = plines_i;
        const all_new_plines = [];
        for (const pline_i of plines_i) {
            const result_plines_i = _booleanPlines(__model__, pline_i, b_shape, method, posis_map);
            for (const result_pline_i of result_plines_i) {
                all_new_plines.push(result_pline_i);
            }
        }
        return all_new_plines;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbGVhbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9wb2x5MmQvQm9vbGVhbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsV0FBVyxFQUNYLFFBQVEsRUFFUixRQUFRLEVBQ1IsT0FBTyxFQUNQLGVBQWUsRUFDZixVQUFVLEdBR2IsTUFBTSwrQkFBK0IsQ0FBQztBQUd2QyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDMUMsT0FBTyxFQUNILHlCQUF5QixFQUN6QixtQkFBbUIsRUFDbkIsb0JBQW9CLEVBQ3BCLHFCQUFxQixFQUNyQix3QkFBd0IsRUFDeEIsU0FBUyxFQUNULGVBQWUsR0FFbEIsTUFBTSxXQUFXLENBQUM7QUFHbkIsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsTUFBTSxVQUFVLE9BQU8sQ0FBQyxTQUFrQixFQUFFLFVBQXFCLEVBQUUsVUFBcUIsRUFBRSxNQUF1QjtJQUM3RyxVQUFVLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBVSxDQUFDO0lBQzlDLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUMxQyxVQUFVLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBVSxDQUFDO0lBQzlDLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQztJQUNqQyxJQUFJLFVBQXlCLENBQUM7SUFDOUIsSUFBSSxVQUF5QixDQUFDO0lBQzlCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixVQUFVLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFDbEUsQ0FBQyxFQUFFLENBQUMsSUFBSSxF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