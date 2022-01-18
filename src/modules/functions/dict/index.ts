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


// CLASS DEFINITION
export class DictFunc {

    async Add(dict, keys, values): Promise<void> {
        Add(dict, keys, values);
    }
    async Remove(dict, keys): Promise<void> {
        Remove(dict, keys);
    }
    async Replace(dict, old_keys, new_keys): Promise<void> {
        Replace(dict, old_keys, new_keys);
    }

}
