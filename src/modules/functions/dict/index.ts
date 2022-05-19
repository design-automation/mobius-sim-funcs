/**
 * The `dict` module has functions for working with dictionaries.
 * These functions have no direct link with the model, they are generic functions for manipulating dictionaries.
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


// CLASS DEFINITION
export class DictFunc {

    Add(dict, keys, values): void {
        Add(dict, keys, values);
    }
    Remove(dict, keys): void {
        Remove(dict, keys);
    }
    Replace(dict, old_keys, new_keys): void {
        Replace(dict, old_keys, new_keys);
    }

}
