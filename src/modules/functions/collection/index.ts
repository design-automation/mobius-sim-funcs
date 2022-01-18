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


// CLASS DEFINITION
export class CollectionFunc {

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    async Add(coll, entities): Promise<void> {
        Add(this.__model__, coll, entities);
    }
    async Create(entities, name): Promise<any> {
        return Create(this.__model__, entities, name);
    }
    async Delete(coll): Promise<void> {
        Delete(this.__model__, coll);
    }
    async Get(names): Promise<any> {
        return Get(this.__model__, names);
    }
    async Remove(coll, entities): Promise<void> {
        Remove(this.__model__, coll, entities);
    }

}
