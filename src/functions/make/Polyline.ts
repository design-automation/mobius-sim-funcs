import { Sim, ENT_TYPE } from '../../mobius_sim';

// ================================================================================================
/**
 * Adds one or more new polylines to the model. Polylines are objects.
 *
 * @param __model__
 * @param entities List or nested lists of positions, or entities from which positions can be extracted.
 * @param close Enum, `'open'` or `'close'`.
 * @returns Entities, new polyline, or a list of new polylines.
 * @example `polyline1 = make.Polyline([position1,position2,position3], 'close')`
 * @example_info Creates a closed polyline with vertices position1, position2, position3 in sequence.
 */
export function Polyline(__model__: Sim, entities: string|string[]|string[][], close: _EClose): string|string[] {
    if (isEmptyArr(entities)) { return []; }
    // -----
    const new_ents_arr: string[] = __model__.modeldata.funcs_make.polyline(ents_arr, close) as  string[];
    const depth: number = getArrDepth(ents_arr);
    if (depth === 1 || (depth === 2 && ents_arr[0][0] === ENT_TYPE.POSI)) {
        const first_ent: string = new_ents_arr[0] as string;
        return idsMake(first_ent) as string;
    } else {
        return idsMake(new_ents_arr) as string|string[];
    }
}
