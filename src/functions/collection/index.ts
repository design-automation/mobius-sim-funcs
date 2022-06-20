/**
 * The `collections` module has functions for creating and modifying collections.
 * @module
 */
import { Sim } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

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

    public __model__: Sim;
    public debug: boolean;
    constructor(model: Sim, debug: boolean) {
        this.__model__ = model;
        this.debug = debug;
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
