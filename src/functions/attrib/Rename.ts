import { ENT_TYPE, Sim } from '../../mobius_sim';

import { checkAttribName } from '../../_check_attribs';
import { _ENT_TYPEAndMod } from './_enum';
import { _getEntTypeFromStr } from './_shared';



// ================================================================================================
/**
 * Rename an attribute in the model.
 * The header for the column in the attribute table will be renamed.
 * All values will remain the same.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type: `'ps', '_v', '_e', '_w', '_f', 'pt', 'pl', 'pg', 'co',` or `'mo'`.
 * @param old_attrib The old attribute name.
 * @param new_attrib The new attribute name.
 * @returns void 
 */
export function Rename(__model__: Sim, ent_type_sel: _ENT_TYPEAndMod, old_attrib: string, new_attrib: string): void {
    if (ent_type_sel === "ps" && old_attrib === "xyz") {
        return;
    }
    // --- Error Check ---
    const fn_name = "attrib.Rename";
    const arg_name = "ent_type_sel";
    const ent_type: ENT_TYPE = _getEntTypeFromStr(ent_type_sel);
    if (this.debug) {
        checkAttribName(fn_name, old_attrib);
        checkAttribName(fn_name, new_attrib);
        // --- Error Check ---
        // convert the ent_type_str to an ent_type
        if (ent_type === undefined) {
            throw new Error(fn_name + ": " + arg_name + " is not one of the following valid types - " + "ps, _v, _e, _w, _f, pt, pl, pg, co, mo.");
        }
    }
    // create the attribute
    __model__.modeldata.attribs.renameAttrib(ent_type, old_attrib, new_attrib);
}
