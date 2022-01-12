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
        _EAddMethod: typeof Enum._EAddMethod;
        _ERemoveMethod: typeof Enum._ERemoveMethod;
        _EReplaceMethod: typeof Enum._EReplaceMethod;
        _ESortMethod: typeof Enum._ESortMethod;
    };
    constructor();
    Add(list: any, item: any, method: any): any;
    Remove(list: any, item: any, method: any): any;
    Replace(list: any, old_item: any, new_item: any, method: any): any;
    Sort(list: any, method: any): any;
    Splice(list: any, index: any, num_to_remove: any, items_to_insert: any): any;
}
