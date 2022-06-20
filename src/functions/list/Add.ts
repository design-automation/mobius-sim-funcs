import { idsBreak, string } from '../../mobius_sim';

import * as chk from '../../_check_types';
import { _EAddMethod } from './_enum';




// ================================================================================================
/**
 * Adds an item to a list.
 *
 * @param list List to add the item to.
 * @param item Item to add.
 * @param method Enum, select the method: `'to_start', 'to_end', 'extend_start', 'extend_end',
    'alpha_descending', 'alpha_ascending', 'numeric_descending', 'numeric_ascending',
    'ID_descending'` or `'ID_ascending'`.
 * @returns void
 * @example `append = list.Add([1,2,3], 4, 'at_end')`
 * @example_info Expected value of list is `[1,2,3,4]`.
 * @example `append = list.Add([1,2,3], [4, 5], 'at_end')`
 * @example_info Expected value of list is `[1,2,3,[4,5]]`.
 * @example `append = list.Add([1,2,3], [4,5], 'extend_end')`
 * @example_info Expected value of list is `[1,2,3,4,5]`.
 * @example `append = list.Add(["a", "c", "d"], "b", 'alpha_descending')`
 * @example_info Expected value of list is `["a", "b", "c", "d"]`.
 */
export function Add(list: any[], item: any|any[], method: _EAddMethod): void {
    // --- Error Check ---
    const fn_name = 'list.Add';
    chk.checkArgs(fn_name, 'list', list, [chk.isList]);
    chk.checkArgs(fn_name, 'value', item, [chk.isAny]);
    // --- Error Check ---
    let str_value: string;
    switch (method) {
        case _EAddMethod.TO_START:
            list.unshift(item);
            break;
        case _EAddMethod.TO_END:
            list.push(item);
            break;
        case _EAddMethod.EXTEND_START:
            if (!Array.isArray(item)) { item = [item]; }
            for (let i = item.length - 1; i >= 0; i--) {
                list.unshift(item[i]);
            }
            break;
        case _EAddMethod.EXTEND_END:
            if (!Array.isArray(item)) { item = [item]; }
            for (let i = 0; i < item.length; i++) {
                list.push(item[i]);
            }
            break;
        case _EAddMethod.SORTED_ALPHA:
            str_value = item + '';
            for (let i = 0; i < list.length + 1; i++) {
                if (str_value < list[i] + '' || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        case _EAddMethod.SORTED_REV_ALPHA:
            str_value = item + '';
            for (let i = 0; i < list.length + 1; i++) {
                if (str_value > list[i] + '' || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        case _EAddMethod.SORTED_NUM:
            for (let i = 0; i < list.length + 1; i++) {
                if (item - list[i] > 0 || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        case _EAddMethod.SORTED_REV_NUM:
            for (let i = 0; i < list.length + 1; i++) {
                if (item - list[i] < 0 || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        case _EAddMethod.SORTED_ID:
            for (let i = 0; i < list.length + 1; i++) {
                if (_compareID(item, list[i]) > 0 || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        case _EAddMethod.SORTED_REV_ID:
            for (let i = 0; i < list.length + 1; i++) {
                if (_compareID(item, list[i]) < 0 || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        default:
            break;
    }
}
function _compareID(id1: string, id2: string): number {
    const [ent_type1, index1]: string = idsBreak(id1) as string;
    const [ent_type2, index2]: string = idsBreak(id2) as string;
    if (ent_type1 !== ent_type2) { return ent_type1 -  ent_type2; }
    if (index1 !== index2) { return index1 -  index2; }
    return 0;
}
