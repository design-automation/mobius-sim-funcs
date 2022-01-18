"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Boolean = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const _enum_1 = require("./_enum");
const _shared_1 = require("./_shared");
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
function Boolean(__model__, a_entities, b_entities, method) {
    a_entities = (0, mobius_sim_1.arrMakeFlat)(a_entities);
    if ((0, mobius_sim_1.isEmptyArr)(a_entities)) {
        return [];
    }
    b_entities = (0, mobius_sim_1.arrMakeFlat)(b_entities);
    // --- Error Check ---
    const fn_name = 'poly2d.Boolean';
    let a_ents_arr;
    let b_ents_arr;
    if (__model__.debug) {
        a_ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'a_entities', a_entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
        b_ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'b_entities', b_entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
    }
    else {
        // a_ents_arr = splitIDs(fn_name, 'a_entities', a_entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // b_ents_arr = splitIDs(fn_name, 'b_entities', b_entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        a_ents_arr = (0, mobius_sim_1.idsBreak)(a_entities);
        b_ents_arr = (0, mobius_sim_1.idsBreak)(b_entities);
    }
    // --- Error Check ---
    const posis_map = new Map();
    const [a_pgons_i, a_plines_i] = (0, _shared_1._getPgonsPlines)(__model__, a_ents_arr);
    const b_pgons_i = (0, _shared_1._getPgons)(__model__, b_ents_arr);
    if (a_pgons_i.length === 0 && a_plines_i.length === 0) {
        return [];
    }
    if (b_pgons_i.length === 0) {
        switch (method) {
            case _enum_1._EBooleanMethod.INTERSECT:
                // intersect with nothing returns nothing
                return [];
            case _enum_1._EBooleanMethod.DIFFERENCE:
            case _enum_1._EBooleanMethod.SYMMETRIC:
                // difference with nothing returns copies
                return (0, mobius_sim_1.idsMake)(__model__.modeldata.funcs_common.copyGeom(a_ents_arr, false));
            default:
                return [];
        }
    }
    // const a_shape: Shape = _convertPgonsToShapeUnion(__model__, a_pgons_i, posis_map);
    const b_shape = (0, _shared_1._convertPgonsToShapeUnion)(__model__, b_pgons_i, posis_map);
    // call the boolean function
    const new_pgons_i = _booleanPgons(__model__, a_pgons_i, b_shape, method, posis_map);
    const new_plines_i = _booleanPlines(__model__, a_plines_i, b_shape, method, posis_map);
    // make the list of polylines and polygons
    const result_ents = [];
    const new_pgons = (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.PGON, new_pgons_i);
    // const new_pgons: TId[] = idsMake(new_pgons_i.map( pgon_i => [EEntType.PGON, pgon_i] as TEntTypeIdx )) as TId[];
    for (const new_pgon of new_pgons) {
        result_ents.push(new_pgon);
    }
    const new_plines = (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.PLINE, new_plines_i);
    // const new_plines: TId[] = idsMake(new_plines_i.map( pline_i => [EEntType.PLINE, pline_i] as TEntTypeIdx )) as TId[];
    for (const new_pline of new_plines) {
        result_ents.push(new_pline);
    }
    // always return a list
    return result_ents;
}
exports.Boolean = Boolean;
function _booleanPgons(__model__, pgons_i, b_shape, method, posis_map) {
    if (!Array.isArray(pgons_i)) {
        pgons_i = pgons_i;
        const a_shape = (0, _shared_1._convertPgonToShape)(__model__, pgons_i, posis_map);
        let result_shape;
        switch (method) {
            case _enum_1._EBooleanMethod.INTERSECT:
                result_shape = a_shape.intersect(b_shape);
                break;
            case _enum_1._EBooleanMethod.DIFFERENCE:
                result_shape = a_shape.difference(b_shape);
                break;
            case _enum_1._EBooleanMethod.SYMMETRIC:
                result_shape = a_shape.xor(b_shape);
                break;
            default:
                break;
        }
        return (0, _shared_1._convertShapesToPgons)(__model__, result_shape, posis_map);
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
        const a_shape = (0, _shared_1._convertPlineToShape)(__model__, plines_i, posis_map);
        let result_shape;
        switch (method) {
            case _enum_1._EBooleanMethod.INTERSECT:
                result_shape = a_shape.intersect(b_shape);
                break;
            case _enum_1._EBooleanMethod.DIFFERENCE:
                result_shape = a_shape.difference(b_shape);
                break;
            case _enum_1._EBooleanMethod.SYMMETRIC:
                // the perimeter of the B polygon is included in the output
                // but the perimeter is not closed, which seems strange
                result_shape = a_shape.xor(b_shape);
                break;
            default:
                break;
        }
        return (0, _shared_1._convertShapeToCutPlines)(__model__, result_shape, posis_map);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbGVhbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9wb2x5MmQvQm9vbGVhbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4REFVdUM7QUFHdkMsb0RBQW1EO0FBQ25ELG1DQUEwQztBQUMxQyx1Q0FTbUI7QUFHbkIsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsU0FBZ0IsT0FBTyxDQUFDLFNBQWtCLEVBQUUsVUFBcUIsRUFBRSxVQUFxQixFQUFFLE1BQXVCO0lBQzdHLFVBQVUsR0FBRyxJQUFBLHdCQUFXLEVBQUMsVUFBVSxDQUFVLENBQUM7SUFDOUMsSUFBSSxJQUFBLHVCQUFVLEVBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQzFDLFVBQVUsR0FBRyxJQUFBLHdCQUFXLEVBQUMsVUFBVSxDQUFVLENBQUM7SUFDOUMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDO0lBQ2pDLElBQUksVUFBeUIsQ0FBQztJQUM5QixJQUFJLFVBQXlCLENBQUM7SUFDOUIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLFVBQVUsR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUNsRSxDQUFDLGVBQUUsQ0FBQyxJQUFJLEVBQUUsZUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBa0IsQ0FBQztRQUM3QyxVQUFVLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFDbEUsQ0FBQyxlQUFFLENBQUMsSUFBSSxFQUFFLGVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQWtCLENBQUM7S0FDaEQ7U0FBTTtRQUNILDJEQUEyRDtRQUMzRCxrRUFBa0U7UUFDbEUsMkRB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