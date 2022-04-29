import { _getEntTypeFromStr } from './_shared';
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
export function Discover(__model__, ent_type_sel) {
    // --- Error Check ---
    const fn_name = "attrib.Names";
    const arg_name = "ent_type_sel";
    let ent_type;
    if (__model__.debug) {
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        if (ent_type === undefined) {
            throw new Error(fn_name + ": " + arg_name + " is not one of the following valid types - " + "ps, _v, _e, _w, _f, pt, pl, pg, co, mo.");
        }
    }
    else {
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzY292ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYXR0cmliL0Rpc2NvdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUUvQyxtR0FBbUc7QUFDbkc7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLFVBQVUsUUFBUSxDQUFDLFNBQWtCLEVBQUUsWUFBNkI7SUFFdEUsc0JBQXNCO0lBRXRCLE1BQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQztJQUMvQixNQUFNLFFBQVEsR0FBRyxjQUFjLENBQUM7SUFDaEMsSUFBSSxRQUFrQixDQUFDO0lBRXZCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUVqQiwwQ0FBMEM7UUFDMUMsUUFBUSxHQUFHLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVDLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsUUFBUSxHQUFHLDZDQUE2QyxHQUFHLHlDQUF5QyxDQUFDLENBQUM7U0FDMUk7S0FDSjtTQUFNO1FBQ0gsMENBQTBDO1FBQzFDLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUMvQztJQUVELHNCQUFzQjtJQUV0QixNQUFNLEtBQUssR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqRixNQUFNLE9BQU8sR0FBcUQsRUFBRSxDQUFDO0lBQ3JFLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1FBQ3RCLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDVCxJQUFJLEVBQUUsSUFBSTtZQUNWLElBQUksRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQztTQUM1RSxDQUFDLENBQUM7S0FDTjtJQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckIsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQyJ9