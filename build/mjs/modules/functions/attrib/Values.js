import { checkAttribName } from '../../../_check_attribs';
import { _getEntTypeFromStr } from './_shared';
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
export function Values(__model__, ent_type_sel, attribs) {
    // --- Error Check ---
    const fn_name = "attrib.Values";
    const arg_name = "ent_type_sel";
    let ent_type;
    if (__model__.debug) {
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
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
            checkAttribName(fn_name, attrib);
        }
    }
    else {
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsdWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2F0dHJpYi9WYWx1ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRzFELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUUvQyxtR0FBbUc7QUFDbkc7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLFVBQVUsTUFBTSxDQUFDLFNBQWtCLEVBQUUsWUFBNkIsRUFBRSxPQUF3QjtJQUU5RixzQkFBc0I7SUFFdEIsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDO0lBQ2hDLE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQztJQUNoQyxJQUFJLFFBQWtCLENBQUM7SUFFdkIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBRWpCLDBDQUEwQztRQUMxQyxRQUFRLEdBQUcsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUMsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxRQUFRLEdBQUcsNkNBQTZDLEdBQUcseUNBQXlDLENBQUMsQ0FBQztTQUMxSTtRQUNELGtDQUFrQztRQUNsQyxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7WUFBRSxPQUFPLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7U0FBRTtRQUM3RixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUFFLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQUU7UUFDckQsT0FBTyxHQUFHLE9BQW1CLENBQUM7UUFDOUIsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFBRSxlQUFlLENBQUMsT0FBTyxFQUFHLE1BQU0sQ0FBQyxDQUFDO1NBQUU7S0FDdkU7U0FBTTtRQUNILDBDQUEwQztRQUMxQyxRQUFRLEdBQUcsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDL0M7SUFFRCxzQkFBc0I7SUFFdEIsTUFBTSxVQUFVLEdBQXVCLEVBQUUsQ0FBQztJQUMxQyxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtRQUMxQixNQUFNLElBQUksR0FBdUIsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwRyxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtZQUNwQixVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3hCO0tBQ0o7SUFDRCxPQUFPLFVBQVUsQ0FBQztBQUN0QixDQUFDIn0=