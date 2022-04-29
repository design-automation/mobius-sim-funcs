"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discover = void 0;
const _shared_1 = require("./_shared");
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
function Discover(__model__, ent_type_sel) {
    // --- Error Check ---
    const fn_name = "attrib.Discover";
    const arg_name = "ent_type_sel";
    let ent_type;
    if (__model__.debug) {
        // convert the ent_type_str to an ent_type
        ent_type = (0, _shared_1._getEntTypeFromStr)(ent_type_sel);
        if (ent_type === undefined) {
            throw new Error(fn_name + ": " + arg_name + " is not one of the following valid types - " + "ps, _v, _e, _w, _f, pt, pl, pg, co, mo.");
        }
    }
    else {
        // convert the ent_type_str to an ent_type
        ent_type = (0, _shared_1._getEntTypeFromStr)(ent_type_sel);
    }
    // --- Error Check ---
    const names = __model__.modeldata.attribs.getAttribNamesUser(ent_type);
    const attribs = [];
    for (const name of names) {
        attribs.push({
            name: name,
            type: __model__.modeldata.attribs.query.getAttribDataType(ent_type, name)
        });
    }
    console.log(attribs);
    return attribs;
}
exports.Discover = Discover;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzY292ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYXR0cmliL0Rpc2NvdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLHVDQUErQztBQUUvQyxtR0FBbUc7QUFDbkc7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFnQixRQUFRLENBQUMsU0FBa0IsRUFBRSxZQUE2QjtJQUV0RSxzQkFBc0I7SUFFdEIsTUFBTSxPQUFPLEdBQUcsaUJBQWlCLENBQUM7SUFDbEMsTUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDO0lBQ2hDLElBQUksUUFBa0IsQ0FBQztJQUV2QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFFakIsMENBQTBDO1FBQzFDLFFBQVEsR0FBRyxJQUFBLDRCQUFrQixFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVDLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsUUFBUSxHQUFHLDZDQUE2QyxHQUFHLHlDQUF5QyxDQUFDLENBQUM7U0FDMUk7S0FDSjtTQUFNO1FBQ0gsMENBQTBDO1FBQzFDLFFBQVEsR0FBRyxJQUFBLDRCQUFrQixFQUFDLFlBQVksQ0FBQyxDQUFDO0tBQy9DO0lBRUQsc0JBQXNCO0lBRXRCLE1BQU0sS0FBSyxHQUFhLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pGLE1BQU0sT0FBTyxHQUFxRCxFQUFFLENBQUM7SUFDckUsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7UUFDdEIsT0FBTyxDQUFDLElBQUksQ0FBQztZQUNULElBQUksRUFBRSxJQUFJO1lBQ1YsSUFBSSxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDO1NBQzVFLENBQUMsQ0FBQztLQUNOO0lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQixPQUFPLE9BQU8sQ0FBQztBQUNuQixDQUFDO0FBaENELDRCQWdDQyJ9