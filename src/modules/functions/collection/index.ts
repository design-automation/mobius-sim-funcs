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
    Add(coll: string, entities: string | string[]): void {
        Add(this.__model__, coll, entities);
    }
    Create(entities: string | string[] | string[][], name: string): any {
        return Create(this.__model__, entities, name);
    }
    Delete(coll: string | string[]): void {
        Delete(this.__model__, coll);
    }
    Get(names: string | string[]): any {
        return Get(this.__model__, names);
    }
    Remove(coll: string, entities: string | string[]): void {
        Remove(this.__model__, coll, entities);
    }

}
