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
import { _EExtrudeMethod } from './_enum';





// ================================================================================================
/**
 * Sweeps a cross section wire along a backbone wire.
 *
 * @param __model__
 * @param entities Wires, or entities from which wires can be extracted.
 * @param x_section Cross section wire to sweep, or entity from which a wire can be extracted.
 * @param divisions Segment length or number of segments.
 * @param method Enum, select the method for sweeping.
 * @returns Entities, a list of new polygons or polylines resulting from the sweep.
 */
export function Sweep(__model__: GIModel, entities: TId|TId[], x_section: TId, divisions: number, method: _EExtrudeMethod): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'make.Sweep';
    let backbone_ents: TEntTypeIdx[];
    let xsection_ent: TEntTypeIdx;
    if (__model__.debug) {
        backbone_ents = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isID, ID.isIDL1], [EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        xsection_ent = checkIDs(__model__, fn_name, 'xsextion', x_section,
            [ID.isID], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx;
        chk.checkArgs(fn_name, 'divisions', divisions, [chk.isInt]);
        if (divisions === 0) {
            throw new Error(fn_name + ' : Divisor cannot be zero.');
        }
    } else {
        backbone_ents = idsBreak(entities) as TEntTypeIdx[];
        xsection_ent = idsBreak(x_section) as TEntTypeIdx;
    }
    // --- Error Check ---
    const new_ents: TEntTypeIdx[] = __model__.modeldata.funcs_make.sweep(backbone_ents, xsection_ent, divisions, method);
    return idsMake(new_ents) as TId[];
}
