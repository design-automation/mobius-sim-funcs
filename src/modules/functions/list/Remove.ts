import * as chk from '../../../_check_types';
import { _ERemoveMethod } from './_enum';




// ================================================================================================
/**
 * Removes items in a list.
 * \n
 * If method is set to 'index', then item should be the index of the item to be replaced.
 * Negative indexes are allowed.
 * If method is not set to 'index', then item should be the value.
 *
 * @param list The list in which to remove items
 * @param item The item to remove, either the index of the item or the value. Negative indexes are allowed.
 * @param method Enum, select the method for removing items from the list.
 * @returns void
 * @example `list.Remove(list, 3, 'index')`
 * @example_info where `list = [0, 1, 2, 3]`. Expected new value of list is [0, 1, 2].
 * @example `list.Remove(list, 3, 'all_values')`
 * @example_info where `list = [3, 1, 2, 3, 4]`. Expected new value of list is  [1, 2, 4].
 */
export function Remove(list: any[], item: any, method: _ERemoveMethod): void {
    // --- Error Check ---
    const fn_name = 'list.Remove';
    chk.checkArgs(fn_name, 'list', list, [chk.isList]);
    chk.checkArgs(fn_name, 'item', item, [chk.isAny]);
    // --- Error Check ---
    let index: number;
    switch (method) {
        case _ERemoveMethod.REMOVE_INDEX:
            index = item;
            if (! isNaN(index) ) {
                if (index < 0) { index = list.length + index; }
                list.splice(index, 1);
            }
            break;
        case _ERemoveMethod.REMOVE_FIRST_VALUE:
            index = list.indexOf(item);
            if (index !== -1) { list.splice(index, 1); }
            break;
        case _ERemoveMethod.REMOVE_LAST_VALUE:
            index = list.lastIndexOf(item);
            if (index !== -1) { list.splice(index, 1); }
            break;
        case _ERemoveMethod.REMOVE_ALL_VALUES:
            for (index = 0; index < list.length; index++) {
                if (list[index] === item) {
                    list.splice(index, 1);
                    index -= 1;
                }
            }
            break;
        default:
            throw new Error('list.Remove: Remove method not recognised.');
    }
}
