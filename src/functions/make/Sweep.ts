import { Sim, ENT_TYPE} from 'src/mobius_sim';
import { _EExtrudeMethod } from './_enum';

// ================================================================================================
/**
 * Sweeps a cross section wire along a backbone wire.
 *
 * @param __model__
 * @param entities Wires, or entities from which wires can be extracted.
 * @param x_section Cross section wire to sweep, or entity from which a wire can be extracted.
 * @param divisions Segment length or number of segments.
 * @param method Enum, select the method for sweeping: `'quads', 'stringers', 'ribs'` or `'copies'`.
 * @returns Entities, a list of new polygons or polylines resulting from the sweep.
 */
export function Sweep(__model__: Sim, entities: string|string[], x_section: string, divisions: number, method: _EExtrudeMethod): string[] {
    entities = arrMakeFlat(entities) as string[];
    if (isEmptyArr(entities)) { return []; }
    // -----
    const new_ents: string[] = __model__.modeldata.funcs_make.sweep(backbone_ents, xsection_ent, divisions, method);
    return idsMake(new_ents) as string[];
}
