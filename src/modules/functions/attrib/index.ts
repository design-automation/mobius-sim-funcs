/**
 * The `attrib` module has functions for working with attributes in teh model.
 * Note that attributes can also be set and retrieved using the "@" symbol.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';

import * as Enum from './_enum';
import { Add } from './Add';
import { Delete } from './Delete';
import { Get } from './Get';
import { Push } from './Push';
import { Rename } from './Rename';
import { Set } from './Set';


export { Set }

export { Get }

export { Add }

export { Delete }

export { Rename }

export { Push }


// CLASS DEFINITION
export class AttribFunc {
    __enum__ = {
        ...Enum
    }

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    async Add(ent_type_sel, data_type_sel, attribs): Promise<void> {
        Add(this.__model__, ent_type_sel, data_type_sel, attribs);
    }
    async Delete(ent_type_sel, attribs): Promise<void> {
        Delete(this.__model__, ent_type_sel, attribs);
    }
    async Get(entities, attrib): Promise<any> {
        return Get(this.__model__, entities, attrib);
    }
    async Push(entities, attrib, ent_type_sel, method_sel): Promise<void> {
        Push(this.__model__, entities, attrib, ent_type_sel, method_sel);
    }
    async Rename(ent_type_sel, old_attrib, new_attrib): Promise<void> {
        Rename(this.__model__, ent_type_sel, old_attrib, new_attrib);
    }
    async Set(entities, attrib, value, method): Promise<void> {
        Set(this.__model__, entities, attrib, value, method);
    }

}
