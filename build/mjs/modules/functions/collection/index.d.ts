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
    Add(coll: any, entities: any): void;
    Create(entities: any, name: any): any;
    Delete(coll: any): void;
    Get(names: any): any;
    Remove(coll: any, entities: any): void;
}
