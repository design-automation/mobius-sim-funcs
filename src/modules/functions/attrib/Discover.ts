import { EAttribDataTypeStrs, EEntType, GIModel } from '@design-automation/mobius-sim';

import { _EDataType, _EEntTypeAndMod } from './_enum';
import { _getEntTypeFromStr } from './_shared';

// ================================================================================================
/**
 * Get all attribute names and attribute types for an entity type.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @returns A list of dictionaries, defining the name and type of each attribute.
 * @example attribs = attrib.Discover("pg")
 * @example_info An example of `attribs`: `[{name: "description", type: "str"}, {name: "area", type: "number"}]`.
 */
export function Discover(__model__: GIModel, ent_type_sel: _EEntTypeAndMod): Array<{name: string, type: EAttribDataTypeStrs}> {

    // --- Error Check ---

    const fn_name = "attrib.Discover";
    const arg_name = "ent_type_sel";
    let ent_type: EEntType;

    if (__model__.debug) {

        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        if (ent_type === undefined) {
            throw new Error(fn_name + ": " + arg_name + " is not one of the following valid types - " + "ps, _v, _e, _w, _f, pt, pl, pg, co, mo.");
        }
    } else {
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
    }

    // --- Error Check ---

    const names: string[] = __model__.modeldata.attribs.getAttribNamesUser(ent_type);
    const attribs: Array<{name: string, type: EAttribDataTypeStrs}> = [];
    for (const name of names) {
        attribs.push({
            name: name, 
            type: __model__.modeldata.attribs.query.getAttribDataType(ent_type, name)
        });
    }
    return attribs;    
}
