import { getArrDepth, idsBreak, TEntTypeIdx } from '@design-automation/mobius-sim';

import * as chk from '../../_check_types';
import { _ESortMethod } from './_enum';




// ================================================================================================
/**
 * Sorts a list, based on the values of the items in the list.
 * \n
 * For alphabetical sort, values are sorted character by character,
 * numbers before upper case alphabets, upper case alphabets before lower case alphabets.
 *
 * @param list List to sort.
 * @param method Enum; specifies the sort method to use.
 * @returns void
 * @example `list.Sort(list, 'alpha')`
 * @example_info where `list = ["1","2","10","Orange","apple"]`. 
 * Expected value of list is `["1","10","2","Orange","apple"]`.
 * @example `list.Sort(list, 'numeric')`
 * @example_info where `list = [56,6,48]`. 
 * Expected value of list is `[6,48,56]`.
 */
export function Sort(list: any[], method: _ESortMethod): void {
    // --- Error Check ---
    chk.checkArgs('list.Sort', 'list', list, [chk.isList]);
    // --- Error Check ---
    _sort(list, method);
}
function _compareID(id1: string, id2: string): number {
    const [ent_type1, index1]: TEntTypeIdx = idsBreak(id1) as TEntTypeIdx;
    const [ent_type2, index2]: TEntTypeIdx = idsBreak(id2) as TEntTypeIdx;
    if (ent_type1 !== ent_type2) { return ent_type1 -  ent_type2; }
    if (index1 !== index2) { return index1 -  index2; }
    return 0;
}
function _compareNumList(l1: any[], l2: any[], depth: number): number {
    if (depth === 1) { return l1[0] - l2[0] as number; }
    if (depth === 2) { return l1[0][0] - l2[0][0] as number; }
    let val1 = l1;
    let val2 = l2;
    for (let i = 0; i < depth; i++) {
        val1 = val1[0];
        val2 = val2[0];
    }
    return (val1 as unknown as number) - (val2 as unknown as number);
}
function _sort(list: any[], method: _ESortMethod): void {
    switch (method) {
        case _ESortMethod.REV:
            list.reverse();
            break;
        case _ESortMethod.ALPHA:
            list.sort().reverse();
            break;
        case _ESortMethod.REV_ALPHA:
            list.sort();
            break;
        case _ESortMethod.NUM:
            if (Array.isArray(list[0])) {
                const depth: number = getArrDepth(list[0]);
                list.sort((a, b) => _compareNumList(a, b, depth)).reverse();
            } else {
                list.sort((a, b) => b - a);
            }
            break;
        case _ESortMethod.REV_NUM:
            if (Array.isArray(list[0])) {
                const depth: number = getArrDepth(list[0]);
                list.sort((a, b) => _compareNumList(a, b, depth));
            } else {
                list.sort((a, b) => a - b);
            }
            break;
        case _ESortMethod.ID:
            list.sort(_compareID).reverse();
            break;
        case _ESortMethod.REV_ID:
            list.sort(_compareID);
            break;
        case _ESortMethod.SHIFT:
            const last: any = list.pop();
            list.unshift(last);
            break;
        case _ESortMethod.REV_SHIFT:
            const first: any = list.shift();
            list.push(first);
            break;
        case _ESortMethod.RANDOM:
            list.sort(() => .5 - Math.random());
            break;
        default:
            throw new Error('list.Sort: Sort method not recognised.');
    }
}
