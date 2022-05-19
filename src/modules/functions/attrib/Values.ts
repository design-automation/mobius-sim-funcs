import { EEntType, GIModel, TAttribDataTypes } from '@design-automation/mobius-sim';
import { checkAttribName } from '../../../_check_attribs';

import { _EDataType, _EEntTypeAndMod } from './_enum';
import { _getEntTypeFromStr } from './_shared';

// ================================================================================================
/**
 * Get a list of unique attribute values for an attribute.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param attribs A single attribute name, or a list of attribute names.
 * @returns A list of values of the attribute.
 * @example attribs = attrib.Values("pg")
 * @example_info An example of `attribs`: `["True", "False"]`.
 */
export function Values(__model__: GIModel, ent_type_sel: _EEntTypeAndMod, attribs: string|string[]): TAttribDataTypes[] {

    // --- Error Check ---

    const fn_name = "attrib.Values";
    const arg_name = "ent_type_sel";
    let ent_type: EEntType;

    if (__model__.debug) {

        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        if (ent_type === undefined) {
            throw new Error(fn_name + ": " + arg_name + " is not one of the following valid types - " + "ps, _v, _e, _w, _f, pt, pl, pg, co, mo.");
        }
        // create an array of attrib names
        if (attribs === null) { attribs = __model__.modeldata.attribs.getAttribNamesUser(ent_type); }
        if (!Array.isArray(attribs)) { attribs = [attribs]; }
        attribs = attribs as string[];
        for (const attrib of attribs) { checkAttribName(fn_name , attrib); }
    } else {
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
    }

    // --- Error Check ---

    const all_values: TAttribDataTypes[] = [];
    for (const attrib of attribs) {
        const vals: TAttribDataTypes[] = __model__.modeldata.attribs.get.getEntAttribVals(ent_type, attrib);
        for (const val of vals) {
            all_values.push(val);
        }
    }
    return all_values;    
}
