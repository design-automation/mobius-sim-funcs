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

export class AttribFunc {
    __model__: GIModel;
    __enum__ = {
        ...Enum
    }
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Set(entities, attrib, value, method): any {
        return Set(this.__model__, entities, attrib, value, method);
    }
    Get(entities, attrib): any {
        return Get(this.__model__, entities, attrib);
    }
    Add(ent_type_sel, data_type_sel, attribs): any {
        return Add(this.__model__, ent_type_sel, data_type_sel, attribs);
    }
    Delete(ent_type_sel, attribs): any {
        return Delete(this.__model__, ent_type_sel, attribs);
    }
    Rename(ent_type_sel, old_attrib, new_attrib): any {
        return Rename(this.__model__, ent_type_sel, old_attrib, new_attrib);
    }
    Push(entities, attrib, ent_type_sel, method_sel): any {
        return Push(this.__model__, entities, attrib, ent_type_sel, method_sel);
    }
}
