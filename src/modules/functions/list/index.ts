/**
 * The `list` module has functions for working with lists of items.
 * These functions have no direct link with the model, the are generic functions for manipulating lists.
 * The functions are often used when manipulating lists of IDs of entities in the model.
 * These functions neither make nor modify anything in the model.
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
    __enum__ = {
        ...Enum
    }

    Add(list, item, method): void {
        Add(list, item, method);
    }
    Remove(list, item, method): void {
        Remove(list, item, method);
    }
    Replace(list, old_item, new_item, method): void {
        Replace(list, old_item, new_item, method);
    }
    Sort(list, method): void {
        Sort(list, method);
    }
    Splice(list, index, num_to_remove, items_to_insert): void {
        Splice(list, index, num_to_remove, items_to_insert);
    }

}
