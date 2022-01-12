/**
 * The `dict` module has functions for working with dictionaries.
 * These functions have no direct link with the model, the are generic functions for manipulating dictionaries.
 * These functions neither make nor modify anything in the model.
 * In addition to these functions, there are also inline functions available for working with dictionaries.
 * @module
 */
import { Add } from './Add';
import { Remove } from './Remove';
import { Replace } from './Replace';

export { Add };
export { Remove };
export { Replace };

export class DictFunc {
    constructor() {
    }
    Add(dict, keys, values): any {
        return Add(dict, keys, values);
    }
    Remove(dict, keys): any {
        return Remove(dict, keys);
    }
    Replace(dict, old_keys, new_keys): any {
        return Replace(dict, old_keys, new_keys);
    }
}
