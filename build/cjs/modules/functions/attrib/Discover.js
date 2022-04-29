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
    const fn_name = "attrib.Names";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzY292ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYXR0cmliL0Rpc2NvdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLHVDQUErQztBQUUvQyxtR0FBbUc7QUFDbkc7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFnQixRQUFRLENBQUMsU0FBa0IsRUFBRSxZQUE2QjtJQUV0RSxzQkFBc0I7SUFFdEIsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDO0lBQy9CLE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQztJQUNoQyxJQUFJLFFBQWtCLENBQUM7SUFFdkIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBRWpCLDBDQUEwQztRQUMxQyxRQUFRLEdBQUcsSUFBQSw0QkFBa0IsRUFBQyxZQUFZLENBQUMsQ0FBQztRQUM1QyxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLFFBQVEsR0FBRyw2Q0FBNkMsR0FBRyx5Q0FBeUMsQ0FBQyxDQUFDO1NBQzFJO0tBQ0o7U0FBTTtRQUNILDBDQUEwQztRQUMxQyxRQUFRLEdBQUcsSUFBQSw0QkFBa0IsRUFBQyxZQUFZLENBQUMsQ0FBQztLQUMvQztJQUVELHNCQUFzQjtJQUV0QixNQUFNLEtBQUssR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqRixNQUFNLE9BQU8sR0FBcUQsRUFBRSxDQUFDO0lBQ3JFLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1FBQ3RCLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDVCxJQUFJLEVBQUUsSUFBSTtZQUNWLElBQUksRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQztTQUM1RSxDQUFDLENBQUM7S0FDTjtJQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckIsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQztBQWhDRCw0QkFnQ0MifQ==