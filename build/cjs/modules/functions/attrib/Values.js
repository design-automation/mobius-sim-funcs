"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Values = void 0;
const _check_attribs_1 = require("../../../_check_attribs");
const _shared_1 = require("./_shared");
// ================================================================================================
/**
 * Get a list of unique attribute balues for an attribute.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @returns A list of dictionaries, defining the name and type of each attribute.
 * @example attribs = attrib.Discover("pg")
 * @example_info An example of `attribs`: `[{name: "description", type: "str"}, {name: "area", type: "number"}]`.
 */
function Values(__model__, ent_type_sel, attribs) {
    // --- Error Check ---
    const fn_name = "attrib.Values";
    const arg_name = "ent_type_sel";
    let ent_type;
    if (__model__.debug) {
        // convert the ent_type_str to an ent_type
        ent_type = (0, _shared_1._getEntTypeFromStr)(ent_type_sel);
        if (ent_type === undefined) {
            throw new Error(fn_name + ": " + arg_name + " is not one of the following valid types - " + "ps, _v, _e, _w, _f, pt, pl, pg, co, mo.");
        }
        // create an array of attrib names
        if (attribs === null) {
            attribs = __model__.modeldata.attribs.getAttribNamesUser(ent_type);
        }
        if (!Array.isArray(attribs)) {
            attribs = [attribs];
        }
        attribs = attribs;
        for (const attrib of attribs) {
            (0, _check_attribs_1.checkAttribName)(fn_name, attrib);
        }
    }
    else {
        // convert the ent_type_str to an ent_type
        ent_type = (0, _shared_1._getEntTypeFromStr)(ent_type_sel);
    }
    // --- Error Check ---
    const all_values = [];
    for (const attrib of attribs) {
        const vals = __model__.modeldata.attribs.get.getEntAttribVals(ent_type, attrib);
        for (const val of vals) {
            all_values.push(val);
        }
    }
    return all_values;
}
exports.Values = Values;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsdWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2F0dHJpYi9WYWx1ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNERBQTBEO0FBRzFELHVDQUErQztBQUUvQyxtR0FBbUc7QUFDbkc7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFnQixNQUFNLENBQUMsU0FBa0IsRUFBRSxZQUE2QixFQUFFLE9BQXdCO0lBRTlGLHNCQUFzQjtJQUV0QixNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUM7SUFDaEMsTUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDO0lBQ2hDLElBQUksUUFBa0IsQ0FBQztJQUV2QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFFakIsMENBQTBDO1FBQzFDLFFBQVEsR0FBRyxJQUFBLDRCQUFrQixFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVDLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsUUFBUSxHQUFHLDZDQUE2QyxHQUFHLHlDQUF5QyxDQUFDLENBQUM7U0FDMUk7UUFDRCxrQ0FBa0M7UUFDbEMsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO1lBQUUsT0FBTyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQUU7UUFDN0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFBRSxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUFFO1FBQ3JELE9BQU8sR0FBRyxPQUFtQixDQUFDO1FBQzlCLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO1lBQUUsSUFBQSxnQ0FBZSxFQUFDLE9BQU8sRUFBRyxNQUFNLENBQUMsQ0FBQztTQUFFO0tBQ3ZFO1NBQU07UUFDSCwwQ0FBMEM7UUFDMUMsUUFBUSxHQUFHLElBQUEsNEJBQWtCLEVBQUMsWUFBWSxDQUFDLENBQUM7S0FDL0M7SUFFRCxzQkFBc0I7SUFFdEIsTUFBTSxVQUFVLEdBQXVCLEVBQUUsQ0FBQztJQUMxQyxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtRQUMxQixNQUFNLElBQUksR0FBdUIsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwRyxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtZQUNwQixVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3hCO0tBQ0o7SUFDRCxPQUFPLFVBQVUsQ0FBQztBQUN0QixDQUFDO0FBbkNELHdCQW1DQyJ9