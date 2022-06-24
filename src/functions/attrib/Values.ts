import { ENT_TYPE, Sim, TAttribDataTypes } from '../../mobius_sim';
import { checkAttribName } from '../_common/_check_attribs';

import { _EDataType, _ENT_TYPEAndMod } from './_enum';
import { _getEntTypeFromStr } from './_shared';

// ================================================================================================
/**
 * Get a list of unique attribute values for an attribute.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type: `'ps', '_v', '_e', '_w', '_f', 'pt', 'pl', 'pg', 'co',` or `'mo'`.
 * @param attribs A single attribute name, or a list of attribute names.
 * @returns A list of values of the attribute.
 * @example `attribs = attrib.Values("pg")`
 * @example_info An example of `attribs`: `["True", "False"]`.
 */
export function Values(__model__: Sim, ent_type_sel: _ENT_TYPEAndMod, attribs: string|string[]): TAttribDataTypes[] {
    // //-----
    // const all_values: TAttribDataTypes[] = [];
    // for (const attrib of attribs) {
    //     const vals: TAttribDataTypes[] = __model__.modeldata.attribs.get.getEntAttribVals(ent_type, attrib);
    //     for (const val of vals) {
    //         all_values.push(val);
    //     }
    // }
    // return all_values;    
    throw new Error();
}
