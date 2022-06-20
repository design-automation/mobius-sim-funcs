/**
 * The `attrib` module has functions for working with attributes in the model.
 * Note that attributes can also be set and retrieved using the "@" symbol.
 * @module
 */
import { Sim } from '../../mobius_sim';
import { TAttribDataTypes } from '../_common/consts';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

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


    // Document Enums here
    __enum__ = {
        Add: {
            ent_type_sel: Enum._ENT_TYPEAndMod, data_type_sel: Enum._EDataType
        },
        Delete: {
            ent_type_sel: Enum._ENT_TYPEAndMod
        },
        Rename: {
            ent_type_sel: Enum._ENT_TYPEAndMod
        },
        Set: {
            method: Enum._ESet
        },
        Push: {
            ent_type_sel: Enum._EAttribPushTarget, method_sel: Enum._EPushMethodSel
        },
        Values: {
            ent_type_sel: Enum._ENT_TYPEAndMod
        },
        Discover: {
            ent_type_sel: Enum._ENT_TYPEAndMod
        },
    };

    public __model__: Sim;
    public debug: boolean;
    constructor(model: Sim, debug: boolean) {
        this.__model__ = model;
        this.debug = debug;
    }
    Add(ent_type_sel: Enum._ENT_TYPEAndMod, data_type_sel: Enum._EDataType, attribs: string | string[]): void {
        Add(this.__model__, ent_type_sel, data_type_sel, attribs);
    }
    Delete(ent_type_sel: Enum._ENT_TYPEAndMod, attribs: string | string[]): void {
        Delete(this.__model__, ent_type_sel, attribs);
    }
    Get(entities: string | string[] | string[][], attrib: string | [string, string | number]): any {
        return Get(this.__model__, entities, attrib);
    }
    Rename(ent_type_sel: Enum._ENT_TYPEAndMod, old_attrib: string, new_attrib: string): void {
        Rename(this.__model__, ent_type_sel, old_attrib, new_attrib);
    }
    Set(entities: string | string[] | string[][], attrib: string | [string, string | number], value: string | number | boolean | object | any[] | TAttribDataTypes[], method: Enum._ESet): void {
        Set(this.__model__, entities, attrib, value, method);
    }
    Push(entities: string | string[], attrib: string | [string, string | number] | [string, string | number, string] | [string, string | number, string, string | number], ent_type_sel: Enum._EAttribPushTarget, method_sel: Enum._EPushMethodSel): void {
        Push(this.__model__, entities, attrib, ent_type_sel, method_sel);
    }
    Values(ent_type_sel: Enum._ENT_TYPEAndMod, attribs: string | string[]): any {
        return Values(this.__model__, ent_type_sel, attribs);
    }
    Discover(ent_type_sel: Enum._ENT_TYPEAndMod): any {
        return Discover(this.__model__, ent_type_sel);
    }
}
