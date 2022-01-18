import { EAttribDataTypeStrs } from '@design-automation/mobius-sim';
import { checkAttribName } from '../../../_check_attribs';
import { _EDataType } from './_enum';
import { _getEntTypeFromStr } from './_shared';
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
export function Add(__model__, ent_type_sel, data_type_sel, attribs) {
    // --- Error Check ---
    const fn_name = "attrib.Add";
    const arg_name = "ent_type_sel";
    let ent_type;
    if (__model__.debug) {
        if (ent_type_sel === "ps" && attribs === "xyz") {
            throw new Error(fn_name + ": " + arg_name + " The xyz attribute already exists.");
        }
        // convert the ent_type_str to an ent_type
        ent_type = _getEntTypeFromStr(ent_type_sel);
        if (ent_type === undefined) {
            throw new Error(fn_name + ": " + arg_name + " is not one of the following valid types - " + "ps, _v, _e, _w, _f, pt, pl, pg, co, mo.");
        }
        // create an array of attrib names
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
        case _EDataType.NUMBER:
            data_type = EAttribDataTypeStrs.NUMBER;
            break;
        case _EDataType.STRING:
            data_type = EAttribDataTypeStrs.STRING;
            break;
        case _EDataType.BOOLEAN:
            data_type = EAttribDataTypeStrs.BOOLEAN;
            break;
        case _EDataType.LIST:
            data_type = EAttribDataTypeStrs.LIST;
            break;
        case _EDataType.DICT:
            data_type = EAttribDataTypeStrs.DICT;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2F0dHJpYi9BZGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLG1CQUFtQixFQUFxQixNQUFNLCtCQUErQixDQUFDO0FBRXZGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsVUFBVSxFQUFtQixNQUFNLFNBQVMsQ0FBQztBQUN0RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFJL0MsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFNLFVBQVUsR0FBRyxDQUFDLFNBQWtCLEVBQUUsWUFBNkIsRUFBRSxhQUF5QixFQUFFLE9BQTBCO0lBQ3hILHNCQUFzQjtJQUV0QixNQUFNLE9BQU8sR0FBRyxZQUFZLENBQUM7SUFDN0IsTUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDO0lBQ2hDLElBQUksUUFBa0IsQ0FBQztJQUV2QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsSUFBSSxZQUFZLEtBQUssSUFBSSxJQUFJLE9BQU8sS0FBSyxLQUFLLEVBQUU7WUFDNUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLFFBQVEsR0FBRyxvQ0FBb0MsQ0FBQyxDQUFDO1NBQ3JGO1FBQ0QsMENBQTBDO1FBQzFDLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM1QyxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLFFBQVEsR0FBRyw2Q0FBNkMsR0FBRyx5Q0FBeUMsQ0FBQyxDQUFDO1NBQzFJO1FBQ0Qsa0NBQWtDO1FBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3pCLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3ZCO1FBQ0QsT0FBTyxHQUFHLE9BQW1CLENBQUM7UUFDOUIsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDMUIsZUFBZSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNwQztLQUNKO1NBQU07UUFDSCwwQ0FBMEM7UUFDMUMsUUFBUSxHQUFHLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVDLGtDQUFrQztRQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN6QixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN2QjtRQUNELE9BQU8sR0FBRyxPQUFtQixDQUFDO0tBQ2pDO0lBRUQsc0JBQXNCO0lBQ3RCLG9CQUFvQjtJQUNwQixJQUFJLFNBQVMsR0FBd0IsSUFBSSxDQUFDO0lBQzFDLFFBQVEsYUFBYSxFQUFFO1FBQ25CLEtBQUssVUFBVSxDQUFDLE1BQU07WUFDbEIsU0FBUyxHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBQztZQUN2QyxNQUFNO1FBQ1YsS0FBSyxVQUFVLENBQUMsTUFBTTtZQUNsQixTQUFTLEdBQUcsbUJBQW1CLENBQUMsTUFBTSxDQUFDO1lBQ3ZDLE1BQU07UUFDVixLQUFLLFVBQVUsQ0FBQyxPQUFPO1lBQ25CLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLENBQUM7WUFDeEMsTUFBTTtRQUNWLEtBQUssVUFBVSxDQUFDLElBQUk7WUFDaEIsU0FBUyxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQztZQUNyQyxNQUFNO1FBQ1YsS0FBSyxVQUFVLENBQUMsSUFBSTtZQUNoQixTQUFTLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDO1lBQ3JDLE1BQU07UUFDVjtZQUNJLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztZQUM3QyxNQUFNO0tBQ2I7SUFDRCx1QkFBdUI7SUFDdkIsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7UUFDMUIsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQzFFO0FBQ0wsQ0FBQyJ9