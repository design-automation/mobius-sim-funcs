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
