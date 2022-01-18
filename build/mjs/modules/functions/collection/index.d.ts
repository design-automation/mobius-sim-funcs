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
export { Create };
export { Get };
export { Add };
export { Remove };
export { Delete };
export declare class CollectionFunc {
    __model__: GIModel;
    constructor(model: GIModel);
    Add(coll: any, entities: any): Promise<void>;
    Create(entities: any, name: any): Promise<any>;
    Delete(coll: any): Promise<void>;
    Get(names: any): Promise<any>;
    Remove(coll: any, entities: any): Promise<void>;
}
