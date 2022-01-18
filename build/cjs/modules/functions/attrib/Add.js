"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Add = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_attribs_1 = require("../../../_check_attribs");
const _enum_1 = require("./_enum");
const _shared_1 = require("./_shared");
// ================================================================================================
/**
 * Add one or more attributes to the model.
 * The attribute will appear as a new column in the attribute table.
 * (At least one entity must have a value for the column to be visible in the attribute table).
 * All attribute values will be set to null.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @param data_type_sel Enum, the data type for this attribute
 * @param attribs A single attribute name, or a list of attribute names.
 */
function Add(__model__, ent_type_sel, data_type_sel, attribs) {
    // --- Error Check ---
    const fn_name = "attrib.Add";
    const arg_name = "ent_type_sel";
    let ent_type;
    if (__model__.debug) {
        if (ent_type_sel === "ps" && attribs === "xyz") {
            throw new Error(fn_name + ": " + arg_name + " The xyz attribute already exists.");
        }
        // convert the ent_type_str to an ent_type
        ent_type = (0, _shared_1._getEntTypeFromStr)(ent_type_sel);
        if (ent_type === undefined) {
            throw new Error(fn_name + ": " + arg_name + " is not one of the following valid types - " + "ps, _v, _e, _w, _f, pt, pl, pg, co, mo.");
        }
        // create an array of attrib names
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
        // create an array of attrib names
        if (!Array.isArray(attribs)) {
            attribs = [attribs];
        }
        attribs = attribs;
    }
    // --- Error Check ---
    // set the data type
    let data_type = null;
    switch (data_type_sel) {
        case _enum_1._EDataType.NUMBER:
            data_type = mobius_sim_1.EAttribDataTypeStrs.NUMBER;
            break;
        case _enum_1._EDataType.STRING:
            data_type = mobius_sim_1.EAttribDataTypeStrs.STRING;
            break;
        case _enum_1._EDataType.BOOLEAN:
            data_type = mobius_sim_1.EAttribDataTypeStrs.BOOLEAN;
            break;
        case _enum_1._EDataType.LIST:
            data_type = mobius_sim_1.EAttribDataTypeStrs.LIST;
            break;
        case _enum_1._EDataType.DICT:
            data_type = mobius_sim_1.EAttribDataTypeStrs.DICT;
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
exports.Add = Add;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2F0dHJpYi9BZGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBQXVGO0FBRXZGLDREQUEwRDtBQUMxRCxtQ0FBc0Q7QUFDdEQsdUNBQStDO0FBSS9DLG1HQUFtRztBQUNuRzs7Ozs7Ozs7OztHQVVHO0FBQ0gsU0FBZ0IsR0FBRyxDQUFDLFNBQWtCLEVBQUUsWUFBNkIsRUFBRSxhQUF5QixFQUFFLE9BQTBCO0lBQ3hILHNCQUFzQjtJQUV0QixNQUFNLE9BQU8sR0FBRyxZQUFZLENBQUM7SUFDN0IsTUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDO0lBQ2hDLElBQUksUUFBa0IsQ0FBQztJQUV2QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsSUFBSSxZQUFZLEtBQUssSUFBSSxJQUFJLE9BQU8sS0FBSyxLQUFLLEVBQUU7WUFDNUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLFFBQVEsR0FBRyxvQ0FBb0MsQ0FBQyxDQUFDO1NBQ3JGO1FBQ0QsMENBQTBDO1FBQzFDLFFBQVEsR0FBRyxJQUFBLDRCQUFrQixFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVDLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsUUFBUSxHQUFHLDZDQUE2QyxHQUFHLHlDQUF5QyxDQUFDLENBQUM7U0FDMUk7UUFDRCxrQ0FBa0M7UUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDekIsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdkI7UUFDRCxPQUFPLEdBQUcsT0FBbUIsQ0FBQztRQUM5QixLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtZQUMxQixJQUFBLGdDQUFlLEVBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3BDO0tBQ0o7U0FBTTtRQUNILDBDQUEwQztRQUMxQyxRQUFRLEdBQUcsSUFBQSw0QkFBa0IsRUFBQyxZQUFZLENBQUMsQ0FBQztRQUM1QyxrQ0FBa0M7UUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDekIsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdkI7UUFDRCxPQUFPLEdBQUcsT0FBbUIsQ0FBQztLQUNqQztJQUVELHNCQUFzQjtJQUN0QixvQkFBb0I7SUFDcEIsSUFBSSxTQUFTLEdBQXdCLElBQUksQ0FBQztJQUMxQyxRQUFRLGFBQWEsRUFBRTtRQUNuQixLQUFLLGtCQUFVLENBQUMsTUFBTTtZQUNsQixTQUFTLEdBQUcsZ0NBQW1CLENBQUMsTUFBTSxDQUFDO1lBQ3ZDLE1BQU07UUFDVixLQUFLLGtCQUFVLENBQUMsTUFBTTtZQUNsQixTQUFTLEdBQUcsZ0NBQW1CLENBQUMsTUFBTSxDQUFDO1lBQ3ZDLE1BQU07UUFDVixLQUFLLGtCQUFVLENBQUMsT0FBTztZQUNuQixTQUFTLEdBQUcsZ0NBQW1CLENBQUMsT0FBTyxDQUFDO1lBQ3hDLE1BQU07UUFDVixLQUFLLGtCQUFVLENBQUMsSUFBSTtZQUNoQixTQUFTLEdBQUcsZ0NBQW1CLENBQUMsSUFBSSxDQUFDO1lBQ3JDLE1BQU07UUFDVixLQUFLLGtCQUFVLENBQUMsSUFBSTtZQUNoQixTQUFTLEdBQUcsZ0NBQW1CLENBQUMsSUFBSSxDQUFDO1lBQ3JDLE1BQU07UUFDVjtZQUNJLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztZQUM3QyxNQUFNO0tBQ2I7SUFDRCx1QkFBdUI7SUFDdkIsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7UUFDMUIsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQzFFO0FBQ0wsQ0FBQztBQTdERCxrQkE2REMifQ==