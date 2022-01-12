import { Add } from './Add';
import { Remove } from './Remove';
import { Replace } from './Replace';
export { Add };
export { Remove };
export { Replace };
export declare class DictFunc {
    constructor();
    Add(dict: any, keys: any, values: any): any;
    Remove(dict: any, keys: any): any;
    Replace(dict: any, old_keys: any, new_keys: any): any;
}
