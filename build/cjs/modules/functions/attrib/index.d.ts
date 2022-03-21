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
        _ESet: typeof Enum._ESet;
        _EPushMethodSel: typeof Enum._EPushMethodSel;
    };
    __model__: GIModel;
    constructor(model: GIModel);
    Add(ent_type_sel: any, data_type_sel: any, attribs: any): void;
    Delete(ent_type_sel: any, attribs: any): void;
    Get(entities: any, attrib: any): any;
    Push(entities: any, attrib: any, ent_type_sel: any, method_sel: any): void;
    Rename(ent_type_sel: any, old_attrib: any, new_attrib: any): void;
    Set(entities: any, attrib: any, value: any, method: any): void;
}
