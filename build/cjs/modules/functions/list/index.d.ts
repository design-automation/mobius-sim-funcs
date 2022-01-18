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
export declare class ListFunc {
    __enum__: {
        /**
         * The `list` module has functions for working with lists of items.
         * These functions have no direct link with the model, the are generic functions for manipulating lists.
         * The functions are often used when manipulating lists of IDs of entities in the model.
         * These functions neither make nor modify anything in the model.
         * In addition to these functions, there are also various inline functions available for working with lists.
         * @module
         */
        _EAddMethod: typeof Enum._EAddMethod;
        _ERemoveMethod: typeof Enum._ERemoveMethod;
        _EReplaceMethod: typeof Enum._EReplaceMethod;
        _ESortMethod: typeof Enum._ESortMethod;
    };
    Add(list: any, item: any, method: any): Promise<void>;
    Remove(list: any, item: any, method: any): Promise<void>;
    Replace(list: any, old_item: any, new_item: any, method: any): Promise<void>;
    Sort(list: any, method: any): Promise<void>;
    Splice(list: any, index: any, num_to_remove: any, items_to_insert: any): Promise<void>;
}
