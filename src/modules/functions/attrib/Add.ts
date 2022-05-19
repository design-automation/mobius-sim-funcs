import { EAttribDataTypeStrs, EEntType, GIModel } from '@design-automation/mobius-sim';

import { checkAttribName } from '../../../_check_attribs';
import { _EDataType, _EEntTypeAndMod } from './_enum';
import { _getEntTypeFromStr } from './_shared';



// ================================================================================================
/**
 * Add one or more attributes to the model.
 * The attribute will appear as a new column in the attribute table.
 * (At least one entity must have a value for the column to be visible in the attribute table).
 * All attribute values will be set to null.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param data_type_sel Enum, the data type for this attribute.
 * @param attribs A single attribute name, or a list of attribute names.
 * @returns void 
 */
export function Add(__model__: GIModel, ent_type_sel: _EEntTypeAndMod, data_type_sel: _EDataType, attribs: string | string[]): void {
    // --- Error Check ---

    const fn_name = "attrib.Add";
    const arg_name = "ent_type_sel";
    let ent_type: EEntType;

    if (__model__.debug) {
        if (ent_type_sel === "ps" && attribs === "xyz") {
            throw new Error(fn_name + ": " + arg_name + " The xyz attribute already exists.");
        }
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        if (ent_type === undefined) {
            throw new Error(fn_name + ": " + arg_name + " is not one of the following valid types - " + "ps, _v, _e, _w, _f, pt, pl, pg, co, mo.");
        }
        // create an array of attrib names
        if (!Array.isArray(attribs)) {
            attribs = [attribs];
        }
        attribs = attribs as string[];
        for (const attrib of attribs) {
            checkAttribName(fn_name, attrib);
        }
    } else {
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        // create an array of attrib names
        if (!Array.isArray(attribs)) {
            attribs = [attribs];
        }
        attribs = attribs as string[];
    }

    // --- Error Check ---
    // set the data type
    let data_type: EAttribDataTypeStrs = null;
    switch (data_type_sel) {
        case _EDataType.NUMBER:
            data_type = EAttribDataTypeStrs.NUMBER;
            break;
        case _EDataType.STRING:
            data_type = EAttribDataTypeStrs.STRING;
            break;
        case _EDataType.BOOLEAN:
            data_type = EAttribDataTypeStrs.BOOLEAN;
            break;
        case _EDataType.LIST:
            data_type = EAttribDataTypeStrs.LIST;
            break;
        case _EDataType.DICT:
            data_type = EAttribDataTypeStrs.DICT;
            break;
        default:
            throw new Error("Data type not recognised.");
            break;
    }
    // create the attribute
    for (const attrib of attribs) {
        __model__.modeldata.attribs.add.addAttrib(ent_type, attrib, data_type);
    }
}
