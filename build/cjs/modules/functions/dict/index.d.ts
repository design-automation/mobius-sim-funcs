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
export declare class DictFunc {
    Add(dict: any, keys: any, values: any): void;
    Remove(dict: any, keys: any): void;
    Replace(dict: any, old_keys: any, new_keys: any): void;
}
