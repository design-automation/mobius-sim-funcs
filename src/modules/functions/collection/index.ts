/**
 * The `collections` module has functions for creating and modifying collections.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';

import { Add } from './Add';
import { Create } from './Create';
import { Delete } from './Delete';
import { Get } from './Get';
import { Remove } from './Remove';


export { Create }

export { Get }

export { Add }

export { Remove }

export { Delete }

export class CollectionFunc {
    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Create(entities, name): any {
        return Create(this.__model__, entities, name);
    }
    Get(names): any {
        return Get(this.__model__, names);
    }
    Add(coll, entities): any {
        return Add(this.__model__, coll, entities);
    }
    Remove(coll, entities): any {
        return Remove(this.__model__, coll, entities);
    }
    Delete(coll): any {
        return Delete(this.__model__, coll);
    }
}
