"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rename = void 0;
const _check_attribs_1 = require("../../../_check_attribs");
const _shared_1 = require("./_shared");
// ================================================================================================
/**
 * Rename an attribute in the model.
 * The header for column in the attribute table will be renamed.
 * All values will remain the same.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param old_attrib The old attribute name.
 * @param new_attrib The old attribute name.
 */
function Rename(__model__, ent_type_sel, old_attrib, new_attrib) {
    if (ent_type_sel === "ps" && old_attrib === "xyz") {
        return;
    }
    // --- Error Check ---
    const fn_name = "attrib.Rename";
    const arg_name = "ent_type_sel";
    const ent_type = (0, _shared_1._getEntTypeFromStr)(ent_type_sel);
    if (__model__.debug) {
        (0, _check_attribs_1.checkAttribName)(fn_name, old_attrib);
        (0, _check_attribs_1.checkAttribName)(fn_name, new_attrib);
        // --- Error Check ---
        // convert the ent_type_str to an ent_type
        if (ent_type === undefined) {
            throw new Error(fn_name + ": " + arg_name + " is not one of the following valid types - " + "ps, _v, _e, _w, _f, pt, pl, pg, co, mo.");
        }
    }
    // create the attribute
    __model__.modeldata.attribs.renameAttrib(ent_type, old_attrib, new_attrib);
}
exports.Rename = Rename;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVuYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2F0dHJpYi9SZW5hbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsNERBQTBEO0FBRTFELHVDQUErQztBQUkvQyxtR0FBbUc7QUFDbkc7Ozs7Ozs7OztHQVNHO0FBQ0gsU0FBZ0IsTUFBTSxDQUFDLFNBQWtCLEVBQUUsWUFBNkIsRUFBRSxVQUFrQixFQUFFLFVBQWtCO0lBQzVHLElBQUksWUFBWSxLQUFLLElBQUksSUFBSSxVQUFVLEtBQUssS0FBSyxFQUFFO1FBQy9DLE9BQU87S0FDVjtJQUNELHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUM7SUFDaEMsTUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDO0lBQ2hDLE1BQU0sUUFBUSxHQUFhLElBQUEsNEJBQWtCLEVBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUQsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLElBQUEsZ0NBQWUsRUFBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDckMsSUFBQSxnQ0FBZSxFQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNyQyxzQkFBc0I7UUFDdEIsMENBQTBDO1FBQzFDLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsUUFBUSxHQUFHLDZDQUE2QyxHQUFHLHlDQUF5QyxDQUFDLENBQUM7U0FDMUk7S0FDSjtJQUNELHVCQUF1QjtJQUN2QixTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvRSxDQUFDO0FBbkJELHdCQW1CQyJ9