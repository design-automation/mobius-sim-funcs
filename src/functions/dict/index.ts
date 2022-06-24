/**
 * The `dict` module has functions for working with dictionaries.
 * These functions have no direct link with the model, they are generic functions for manipulating dictionaries.
 * These functions neither make nor modify anything in the model.
 * In addition to these functions, there are also inline functions available for working with dictionaries.
 * @module
 */

import { ENT_TYPE, Sim } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

import { Add } from './Add';
import { Remove } from './Remove';
import { Replace } from './Replace';

export { Add };
export { Remove };
export { Replace };


// CLASS DEFINITION
export class DictFunc {
    public debug: boolean;
    constructor(debug: boolean) {
        this.debug = debug;
    }
    Add(dict: object, keys: string | string[], values: any): void {
        // --- Error Check ---
        const fn_name = 'dict.Add';
        chk.checkArgs(fn_name, 'keys', keys, [chk.isStr, chk.isStrL]);
        chk.checkArgs(fn_name, 'values', keys, [chk.isAny, chk.isList]);
        keys = Array.isArray(keys) ? keys : [keys];
        values = Array.isArray(values) ? values : [values];
        if (keys.length !== values.length) {
            throw new Error(fn_name + ': The list of keys must be the same length as the list of values.');
        }
        // --- Error Check ---    
        Add(dict, keys, values);
    }
    Remove(dict: object, keys: string | string[]): void {
        // --- Error Check ---
        const fn_name = 'dict.Remove';
        chk.checkArgs(fn_name, 'key', keys, [chk.isStr, chk.isStrL]);
        // --- Error Check ---    
        Remove(dict, keys);
    }
    Replace(dict: object, old_keys: string | string[], new_keys: string | string[]): void {
        // --- Error Check ---
        const fn_name = 'dict.Replace';
        chk.checkArgs(fn_name, 'old_keys', old_keys, [chk.isStr, chk.isStrL]);
        chk.checkArgs(fn_name, 'new_keys', new_keys, [chk.isStr, chk.isStrL]);
        old_keys = Array.isArray(old_keys) ? old_keys : [old_keys];
        new_keys = Array.isArray(new_keys) ? new_keys : [new_keys];
        if (old_keys.length !== new_keys.length) {
            throw new Error(fn_name + ': The list of new keys must be the same length as the list of old keys.');
        }
        // --- Error Check ---    
        Replace(dict, old_keys, new_keys);
    }

}
