"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Add = void 0;
/**
 * The `attrib` module has functions for working with attributes in teh model.
 * Note that attributes can also be set and retrieved using the "@" symbol.
 * @module
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2F0dHJpYi9BZGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7R0FJRztBQUNILDhEQUF1RjtBQUV2Riw0REFBMEQ7QUFDMUQsbUNBQXNEO0FBQ3RELHVDQUErQztBQUcvQyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7R0FVRztBQUNILFNBQWdCLEdBQUcsQ0FBQyxTQUFrQixFQUFFLFlBQTZCLEVBQUUsYUFBeUIsRUFBRSxPQUEwQjtJQUN4SCxzQkFBc0I7SUFFdEIsTUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDO0lBQzdCLE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQztJQUNoQyxJQUFJLFFBQWtCLENBQUM7SUFFdkIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLElBQUksWUFBWSxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssS0FBSyxFQUFFO1lBQzVDLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxRQUFRLEdBQUcsb0NBQW9DLENBQUMsQ0FBQztTQUNyRjtRQUNELDBDQUEwQztRQUMxQyxRQUFRLEdBQUcsSUFBQSw0QkFBa0IsRUFBQyxZQUFZLENBQUMsQ0FBQztRQUM1QyxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLFFBQVEsR0FBRyw2Q0FBNkMsR0FBRyx5Q0FBeUMsQ0FBQyxDQUFDO1NBQzFJO1FBQ0Qsa0NBQWtDO1FBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3pCLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3ZCO1FBQ0QsT0FBTyxHQUFHLE9BQW1CLENBQUM7UUFDOUIsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDMUIsSUFBQSxnQ0FBZSxFQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNwQztLQUNKO1NBQU07UUFDSCwwQ0FBMEM7UUFDMUMsUUFBUSxHQUFHLElBQUEsNEJBQWtCLEVBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUMsa0NBQWtDO1FBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3pCLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3ZCO1FBQ0QsT0FBTyxHQUFHLE9BQW1CLENBQUM7S0FDakM7SUFFRCxzQkFBc0I7SUFDdEIsb0JBQW9CO0lBQ3BCLElBQUksU0FBUyxHQUF3QixJQUFJLENBQUM7SUFDMUMsUUFBUSxhQUFhLEVBQUU7UUFDbkIsS0FBSyxrQkFBVSxDQUFDLE1BQU07WUFDbEIsU0FBUyxHQUFHLGdDQUFtQixDQUFDLE1BQU0sQ0FBQztZQUN2QyxNQUFNO1FBQ1YsS0FBSyxrQkFBVSxDQUFDLE1BQU07WUFDbEIsU0FBUyxHQUFHLGdDQUFtQixDQUFDLE1BQU0sQ0FBQztZQUN2QyxNQUFNO1FBQ1YsS0FBSyxrQkFBVSxDQUFDLE9BQU87WUFDbkIsU0FBUyxHQUFHLGdDQUFtQixDQUFDLE9BQU8sQ0FBQztZQUN4QyxNQUFNO1FBQ1YsS0FBSyxrQkFBVSxDQUFDLElBQUk7WUFDaEIsU0FBUyxHQUFHLGdDQUFtQixDQUFDLElBQUksQ0FBQztZQUNyQyxNQUFNO1FBQ1YsS0FBSyxrQkFBVSxDQUFDLElBQUk7WUFDaEIsU0FBUyxHQUFHLGdDQUFtQixDQUFDLElBQUksQ0FBQztZQUNyQyxNQUFNO1FBQ1Y7WUFDSSxNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFDN0MsTUFBTTtLQUNiO0lBQ0QsdUJBQXVCO0lBQ3ZCLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO1FBQzFCLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztLQUMxRTtBQUNMLENBQUM7QUE3REQsa0JBNkRDIn0=