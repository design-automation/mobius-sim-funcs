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


    Add(list: any[], item: any, method: Enum._EAddMethod): void {
        Add(list, item, method);
    }
    Remove(list: any[], item: any, method: Enum._ERemoveMethod): void {
        Remove(list, item, method);
    }
    Replace(list: any[], old_item: any, new_item: any, method: Enum._EReplaceMethod): void {
        Replace(list, old_item, new_item, method);
    }
    Sort(list: any[], method: Enum._ESortMethod): void {
        Sort(list, method);
    }
    Splice(list: any[], index: number, num_to_remove: number, items_to_insert: any[]): void {
        Splice(list, index, num_to_remove, items_to_insert);
    }

}
