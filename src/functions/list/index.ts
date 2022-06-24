/**
 * The `list` module has functions for working with lists of items.
 * These functions have no direct link with the model, they are generic functions for manipulating lists.
 * /n
 * The functions are often used when manipulating lists of IDs of entities in the model.
 * These functions neither make nor modify anything in the model.
 * /n
 * In addition to these functions, there are also various inline functions available for working with lists.
 * @module
 */
import * as Enum from './_enum';
import * as chk from '../_common/_check_types';
import { Add } from './Add';
import { Remove } from './Remove';
import { Replace } from './Replace';
import { Sort } from './Sort';
import { Splice } from './Splice';

export { Add };
export { Remove };
export { Replace };
export { Sort };
export { Splice };

// CLASS DEFINITION
export class ListFunc {

    // Document Enums here
    __enum__ = {
        Add: {
            method: Enum._EAddMethod
        },
        Remove: {
            method: Enum._ERemoveMethod
        },
        Replace: {
            method: Enum._EReplaceMethod
        },
        Sort: {
            method: Enum._ESortMethod
        },
    };

    public debug: boolean;
    constructor(debug: boolean) {
        this.debug = debug;
    }
    Add(list: any[], item: any, method: Enum._EAddMethod): void {
        // --- Error Check ---
        const fn_name = 'list.Add';
        chk.checkArgs(fn_name, 'list', list, [chk.isList]);
        chk.checkArgs(fn_name, 'value', item, [chk.isAny]);
        // --- Error Check ---    
        Add(list, item, method);
    }
    Remove(list: any[], item: any, method: Enum._ERemoveMethod): void {
        // --- Error Check ---
        const fn_name = 'list.Remove';
        chk.checkArgs(fn_name, 'list', list, [chk.isList]);
        chk.checkArgs(fn_name, 'item', item, [chk.isAny]);
        // --- Error Check ---    
        Remove(list, item, method);
    }
    Replace(list: any[], old_item: any, new_item: any, method: Enum._EReplaceMethod): void {
        // --- Error Check ---
        const fn_name = 'list.Replace';
        chk.checkArgs(fn_name, 'list', list, [chk.isList]);
        chk.checkArgs(fn_name, 'item', old_item, [chk.isAny]);
        chk.checkArgs(fn_name, 'new_value', new_item, [chk.isAny]);
        // --- Error Check ---    
        Replace(list, old_item, new_item, method);
    }
    Sort(list: any[], method: Enum._ESortMethod): void {
        // --- Error Check ---
        chk.checkArgs('list.Sort', 'list', list, [chk.isList]);
        // --- Error Check ---    
        Sort(list, method);
    }
    Splice(list: any[], index: number, num_to_remove: number, items_to_insert: any[]): void {
        // --- Error Check ---
        const fn_name = 'list.Splice';
        chk.checkArgs(fn_name, 'list', list, [chk.isList]);
        chk.checkArgs(fn_name, 'index', index, [chk.isInt]);
        chk.checkArgs(fn_name, 'num_to_remove', num_to_remove, [chk.isInt]);
        chk.checkArgs(fn_name, 'values_to_add', items_to_insert, [chk.isList, chk.isNull]);
        // --- Error Check ---    
        Splice(list, index, num_to_remove, items_to_insert);
    }

}
