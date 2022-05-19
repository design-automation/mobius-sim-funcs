import { EEntType, GIModel } from '@design-automation/mobius-sim';

import { checkAttribName } from '../../../_check_attribs';
import { _EEntTypeAndMod } from './_enum';
import { _getEntTypeFromStr } from './_shared';


 // ================================================================================================
/**
 * Delete one or more attributes from the model. The column in the attribute table will be deleted.
 * All values will also be deleted. \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param attribs A single attribute name, or a list of attribute names. If 'null', all attributes
 * will be deleted.
 * @returns void 
 */
 export function Delete(__model__: GIModel, ent_type_sel: _EEntTypeAndMod, attribs: string|string[]): void {
    // --- Error Check ---
    const fn_name = 'attrib.Delete';
    const arg_name = 'ent_type_sel';
    let ent_type: EEntType;
    if (__model__.debug) {
        if (ent_type_sel === 'ps' && attribs === 'xyz') {
            throw new Error(fn_name + ': ' + arg_name + ' Deleting xyz attribute is not allowed.');
        }
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        if (ent_type === undefined) {
            throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' +
            'ps, _v, _e, _w, _f, pt, pl, pg, co, mo.');
        }
        // create an array of attrib names
        if (attribs === null) { attribs = __model__.modeldata.attribs.getAttribNamesUser(ent_type); }
        if (!Array.isArray(attribs)) { attribs = [attribs]; }
        attribs = attribs as string[];
        for (const attrib of attribs) { checkAttribName(fn_name , attrib); }
    } else {
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        // create an array of attrib names
        if (attribs === null) { attribs = __model__.modeldata.attribs.getAttribNamesUser(ent_type); }
        if (!Array.isArray(attribs)) { attribs = [attribs]; }
        attribs = attribs as string[];
    }
    // --- Error Check ---
    // delete the attributes
    for (const attrib of attribs) {
        __model__.modeldata.attribs.del.delEntAttrib(ent_type, attrib);
    }
}
