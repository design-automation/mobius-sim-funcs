import { ENT_TYPE, Sim } from '../../mobius_sim';

import { checkAttribName } from '../../_check_attribs';
import { _ENT_TYPEAndMod } from './_enum';
import { _getEntTypeFromStr } from './_shared';


 // ================================================================================================
/**
 * Delete one or more attributes from the model. The column in the attribute table will be deleted.
 * All values will also be deleted. \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type: `'ps', '_v', '_e', '_w', '_f', 'pt', 'pl', 'pg', 'co',` or `'mo'`.
 * @param attribs A single attribute name, or a list of attribute names. If 'null', all attributes
 * will be deleted.
 * @returns void 
 */
 export function Delete(__model__: Sim, ent_type_sel: _ENT_TYPEAndMod, attribs: string|string[]): void {
    // -----
    // convert the ent_type_str to an ent_type
    ent_type = _getEntTypeFromStr(ent_type_sel);
    // create an array of attrib names
    if (attribs === null) { attribs = __model__.modeldata.attribs.getAttribNamesUser(ent_type); }
    if (!Array.isArray(attribs)) { attribs = [attribs]; }
    // -----

    attribs = attribs as string[];
    // delete the attributes
    for (const attrib of attribs) {
        __model__.modeldata.attribs.del.delEntAttrib(ent_type, attrib);
    }
}
