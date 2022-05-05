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
    const fn_name = "attrib.Discover";
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
    // console.log(attribs);
    return attribs;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzY292ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYXR0cmliL0Rpc2NvdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUUvQyxtR0FBbUc7QUFDbkc7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLFVBQVUsUUFBUSxDQUFDLFNBQWtCLEVBQUUsWUFBNkI7SUFFdEUsc0JBQXNCO0lBRXRCLE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDO0lBQ2xDLE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQztJQUNoQyxJQUFJLFFBQWtCLENBQUM7SUFFdkIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBRWpCLDBDQUEwQztRQUMxQyxRQUFRLEdBQUcsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUMsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxRQUFRLEdBQUcsNkNBQTZDLEdBQUcseUNBQXlDLENBQUMsQ0FBQztTQUMxSTtLQUNKO1NBQU07UUFDSCwwQ0FBMEM7UUFDMUMsUUFBUSxHQUFHLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQy9DO0lBRUQsc0JBQXNCO0lBRXRCLE1BQU0sS0FBSyxHQUFhLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pGLE1BQU0sT0FBTyxHQUFxRCxFQUFFLENBQUM7SUFDckUsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7UUFDdEIsT0FBTyxDQUFDLElBQUksQ0FBQztZQUNULElBQUksRUFBRSxJQUFJO1lBQ1YsSUFBSSxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDO1NBQzVFLENBQUMsQ0FBQztLQUNOO0lBQ0Qsd0JBQXdCO0lBQ3hCLE9BQU8sT0FBTyxDQUFDO0FBQ25CLENBQUMifQ==