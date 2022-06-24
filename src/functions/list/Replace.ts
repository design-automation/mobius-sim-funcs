import { _EReplaceMethod } from './_enum';




// ================================================================================================
/**
 * Replaces items in a list.
 * \n
 * If method is set to 'index', then old\_item should be the index of the item to be replaced. Negative indexes are allowed.
 * If method is not set to 'index', then old\_item should be the value to be replaced. 
 *
 * @param list The list in which to replace items.
 * @param old_item The old item to replace.
 * @param new_item The new item.
 * @param method Enum, select the method for replacing items in the list: `'index', 'first_value',
 * 'last_value'` or `'all_values'`.
 * @returns void
 * @example `list.Replace(list, 3, [6, 7, 8], 'last_value')`
 * @example_info where `list = [3, 1, 2, 3, 4]`. 
 * Expected new value of list is `[3, 1, 2, [6, 7, 8], 4]`.
 * @example `list.Replace(list, 2, 0, 'index')`
 * @example_info where `list = [0,1,2,3,4,5]`. 
 * Expected new value of list is `[0,1,0,3,4,5]`.
 */
export function Replace(list: any[], old_item: any, new_item: any, method: _EReplaceMethod): void {
    // // --- Error Check ---
    // const fn_name = 'list.Replace';
    // chk.checkArgs(fn_name, 'list', list, [chk.isList]);
    // chk.checkArgs(fn_name, 'item', old_item, [chk.isAny]);
    // chk.checkArgs(fn_name, 'new_value', new_item, [chk.isAny]);
    // // --- Error Check ---
    let index: number;
    switch (method) {
        case _EReplaceMethod.REPLACE_INDEX:
            index = old_item;
            if (! isNaN(index) ) {
                if (index < 0) { index = list.length + index; }
                list[index] = new_item;
            }
            break;
        case _EReplaceMethod.REPLACE_FIRST_VALUE:
            index = list.indexOf(old_item);
            if (index !== -1) { list[index] = new_item; }
            break;
        case _EReplaceMethod.REPLACE_LAST_VALUE:
            index = list.lastIndexOf(old_item);
            if (index !== -1) { list[index] = new_item; }
            break;
        case _EReplaceMethod.REPLACE_ALL_VALUES:
            for (index = 0; index < list.length; index++) {
                if (list[index] === old_item) {
                    list[index] = new_item;
                }
            }
            break;
        default:
            throw new Error('list.Replace: Replace method not recognised.');
    }
}
