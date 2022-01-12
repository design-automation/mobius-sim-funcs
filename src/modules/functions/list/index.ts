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
export class ListFunc {
    __enum__ = {
        ...Enum
    }
    constructor() {
    }
    Add(list, item, method): any {
        return Add(list, item, method);
    }
    Remove(list, item, method): any {
        return Remove(list, item, method);
    }
    Replace(list, old_item, new_item, method): any {
        return Replace(list, old_item, new_item, method);
    }
    Sort(list, method): any {
        return Sort(list, method);
    }
    Splice(list, index, num_to_remove, items_to_insert): any {
        return Splice(list, index, num_to_remove, items_to_insert);
    }
}
