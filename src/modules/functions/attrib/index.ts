/**
 * The `attrib` module has functions for working with attributes in the model.
 * Note that attributes can also be set and retrieved using the "@" symbol.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';

import * as Enum from './_enum';
import { Add } from './Add';
import { Delete } from './Delete';
import { Get } from './Get';
import { Rename } from './Rename';
import { Set } from './Set';
import { Push } from './Push';
import { Values } from './Values';
import { Discover } from './Discover';


export { Set }

export { Get }

export { Add }

export { Delete }

export { Rename }

export { Push }

export { Values }

export { Discover }

// CLASS DEFINITION
export class AttribFunc {
    __enum__ = {
        ...Enum
    }

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Add(ent_type_sel, data_type_sel, attribs): void {
        Add(this.__model__, ent_type_sel, data_type_sel, attribs);
    }
    Delete(ent_type_sel, attribs): void {
        Delete(this.__model__, ent_type_sel, attribs);
    }
    Get(entities, attrib): any {
        return Get(this.__model__, entities, attrib);
    }
    Rename(ent_type_sel, old_attrib, new_attrib): void {
        Rename(this.__model__, ent_type_sel, old_attrib, new_attrib);
    }
    Set(entities, attrib, value, method): void {
        Set(this.__model__, entities, attrib, value, method);
    }
    Push(entities, attrib, ent_type_sel, method_sel): void {
        Push(this.__model__, entities, attrib, ent_type_sel, method_sel);
    }
    Values(ent_type_sel, attribs): any {
        return Values(this.__model__, ent_type_sel, attribs);
    }
    Discover(ent_type_sel): any {
        return Discover(this.__model__, ent_type_sel);
    }
}
