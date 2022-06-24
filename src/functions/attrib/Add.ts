import { ENT_TYPE, Sim } from '../../mobius_sim';

import { _EDataType, _ENT_TYPEAndMod } from './_enum';
import { _getEntTypeFromStr } from './_shared';



// ================================================================================================
/**
 * Add one or more attributes to the model.
 * The attribute will appear as a new column in the attribute table.
 * (At least one entity must have a value for the column to be visible in the attribute table).
 * All attribute values will be set to null.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, select the attribute entity type: `'ps', '_v', '_e', '_w', '_f', 'pt', 'pl',
 * 'pg', 'co',` or `'mo'`.
 * @param data_type_sel Enum, the method to use for data type for this attribute: `'number', 'string', 'boolean',
 * 'list'` or `'dict'`.
 * @param attribs A single attribute name, or a list of attribute names.
 * @returns void 
 */
export function Add(__model__: Sim, ent_type_sel: _ENT_TYPEAndMod, data_type_sel: _EDataType, attribs: string | string[]): void {
    // // -----
    // // set the data type
    // let data_type: EAttribDataTypeStrs = null;
    // switch (data_type_sel) {
    //     case _EDataType.NUMBER:
    //         data_type = EAttribDataTypeStrs.NUMBER;
    //         break;
    //     case _EDataType.STRING:
    //         data_type = EAttribDataTypeStrs.STRING;
    //         break;
    //     case _EDataType.BOOLEAN:
    //         data_type = EAttribDataTypeStrs.BOOLEAN;
    //         break;
    //     case _EDataType.LIST:
    //         data_type = EAttribDataTypeStrs.LIST;
    //         break;
    //     case _EDataType.DICT:
    //         data_type = EAttribDataTypeStrs.DICT;
    //         break;
    //     default:
    //         throw new Error("Data type not recognised.");
    //         break;
    // }
    // // create the attribute
    // for (const attrib of attribs) {
    //     __model__.modeldata.attribs.add.addAttrib(ent_type, attrib, data_type);
    // }
    throw new Error();
}
