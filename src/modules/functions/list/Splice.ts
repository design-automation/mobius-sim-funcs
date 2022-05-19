import * as chk from '../../../_check_types';




// ================================================================================================
/**
 * Removes and inserts items in a list.
 * \n
 * If no `items_to_add` are specified, then items are only removed.
 * If `num_to_remove` is 0, then values are only inserted.
 *
 * @param list List to splice.
 * @param index Zero-based index after which to start removing or inserting items.
 * @param num_to_remove Number of items to remove.
 * @param items_to_insert Optional, list of items to add, or null/empty list.
 * @returns void
 * @example `result = list.Splice(list1, 1, 3, [2.2, 3.3])`
 * @example_info where list1 = `[10, 20, 30, 40, 50]`. 
 * Expected value of result is `[10, 2.2, 3.3, 50]`. New items were added where the items were removed.
 */
export function Splice(list: any[], index: number, num_to_remove: number, items_to_insert: any[]): void {
    // --- Error Check ---
    const fn_name = 'list.Splice';
    chk.checkArgs(fn_name, 'list', list, [chk.isList]);
    chk.checkArgs(fn_name, 'index', index, [chk.isInt]);
    chk.checkArgs(fn_name, 'num_to_remove', num_to_remove, [chk.isInt]);
    chk.checkArgs(fn_name, 'values_to_add', items_to_insert, [chk.isList, chk.isNull]);
    // --- Error Check ---

    // avoid the spread operator
    list.splice(index, num_to_remove);
    if (items_to_insert !== null && items_to_insert.length) {
        for (let i = 0; i < items_to_insert.length; i++) {
            list.splice(index + i, 0, items_to_insert[i]);
        }
    }
}


