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
export { Set };
export { Get };
export { Add };
export { Delete };
export { Rename };
export { Push };
export declare class AttribFunc {
    __model__: GIModel;
    __enum__: {
        /**
         * The `attrib` module has functions for working with attributes in teh model.
         * Note that attributes can also be set and retrieved using the "@" symbol.
         * @module
         */
        _EEntType: typeof Enum._EEntType;
        _EEntTypeAndMod: typeof Enum._EEntTypeAndMod;
        _EAttribPushTarget: typeof Enum._EAttribPushTarget;
        _EDataType: typeof Enum._EDataType;
    };
    constructor(model: GIModel);
    Set(entities: any, attrib: any, value: any, method: any): any;
    Get(entities: any, attrib: any): any;
    Add(ent_type_sel: any, data_type_sel: any, attribs: any): any;
    Delete(ent_type_sel: any, attribs: any): any;
    Rename(ent_type_sel: any, old_attrib: any, new_attrib: any): any;
    Push(entities: any, attrib: any, ent_type_sel: any, method_sel: any): any;
}
