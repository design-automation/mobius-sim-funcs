/**
 * The `attrib` module has functions for working with attributes in the model.
 * Note that attributes can also be set and retrieved using the "@" symbol.
 * @module
 */
import { ENT_TYPE, Sim } from '../../mobius_sim';
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
import { _getEntTypeFromStr } from './_shared';
import { checkAttribName, checkAttribNameIdxKey } from '../_common/_check_attribs';

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
        // --- Error Check ---
        if (this.debug) {
            const fn_name = "attrib.Add";
            const arg_name = "ent_type_sel";
            if (ent_type_sel === "ps" && attribs === "xyz") {
                throw new Error(fn_name + ": " + arg_name + " The xyz attribute already exists.");
            }
            // convert the ent_type_str to an ent_type
            const ent_type: ENT_TYPE = _getEntTypeFromStr(ent_type_sel);
            if (ent_type === undefined) {
                throw new Error(fn_name + ": " + arg_name + " is not one of the following valid types - " + "ps, _v, _e, _w, _f, pt, pl, pg, co, mo.");
            }
            // create an array of attrib names
            if (!Array.isArray(attribs)) {
                attribs = [attribs];
            }
            attribs = attribs as string[];
            for (const attrib of attribs) {
                checkAttribName(fn_name, attrib);
            }
        }
        // --- Error Check ---
        Add(this.__model__, ent_type_sel, data_type_sel, attribs);
    }
    Delete(ent_type_sel: Enum._ENT_TYPEAndMod, attribs: string | string[]): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'attrib.Delete';
            const arg_name = 'ent_type_sel';
            if (ent_type_sel === 'ps' && attribs === 'xyz') {
                throw new Error(fn_name + ': ' + arg_name + ' Deleting xyz attribute is not allowed.');
            }
            // convert the ent_type_str to an ent_type
            const ent_type: ENT_TYPE = _getEntTypeFromStr(ent_type_sel);
            if (ent_type === undefined) {
                throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' +
                'ps, _v, _e, _w, pt, pl, pg, co, mo.');
            }
            // create an array of attrib names
            if (attribs === null) { attribs = this.__model__.getAttribNamesUser(ent_type); }
            if (!Array.isArray(attribs)) { attribs = [attribs]; }
            for (const attrib of attribs) { checkAttribName(fn_name , attrib); }
        }
        // --- Error Check ---
        Delete(this.__model__, ent_type_sel, attribs);
    }
    Get(entities: string | string[] | string[][], attrib: string | [string, string | number]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'attrib.Get';
            if (entities !== null && entities !== undefined) {
                checkIDs(this.__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null) as string | string[];
            }
            const [attrib_name, _] = checkAttribNameIdxKey(fn_name, attrib); // TODO return name
            checkAttribName(fn_name, attrib_name);
        }
        // --- Error Check ---
        return Get(this.__model__, entities, attrib);
    }
    Rename(ent_type_sel: Enum._ENT_TYPEAndMod, old_attrib: string, new_attrib: string): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = "attrib.Rename";
            const arg_name = "ent_type_sel";
            const ent_type: ENT_TYPE = _getEntTypeFromStr(ent_type_sel);
            checkAttribName(fn_name, old_attrib);
            checkAttribName(fn_name, new_attrib);
            // convert the ent_type_str to an ent_type
            if (ent_type === undefined) {
                throw new Error(fn_name + ": " + arg_name + " is not one of the following valid types - " + "ps, _v, _e, _w, _f, pt, pl, pg, co, mo.");
            }
        }
        // --- Error Check ---
        Rename(this.__model__, ent_type_sel, old_attrib, new_attrib);
    }
    Set(entities: string | string[] | string[][], attrib: string | [string, string | number], value: string | number | boolean | object | any[] | TAttribDataTypes[], method: Enum._ESet): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = "attrib.Set";
            checkIDs(this.__model__, fn_name, "entities", entities, [ID.isNull, ID.isID, ID.isIDL1], null) as string | string[];
            const [attrib_name, _] = checkAttribNameIdxKey(fn_name, attrib);
            checkAttribName(fn_name, attrib_name);
        }
        // --- Error Check ---        
        Set(this.__model__, entities, attrib, value, method);
    }
    Push(entities: string | string[], attrib: string | [string, string | number] | [string, string | number, string] | [string, string | number, string, string | number], ent_type_sel: Enum._EAttribPushTarget, method_sel: Enum._EPushMethodSel): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'attrib.Push';
            if (entities !== null && entities !== undefined) {
                checkIDs(this.__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null) as string[];
            }
        // --- Error Check ---
        Push(this.__model__, entities, attrib, ent_type_sel, method_sel);
        }
    }
    Values(ent_type_sel: Enum._ENT_TYPEAndMod, attribs: string | string[]): any {
        // --- Error Check ---
        let ent_type: ENT_TYPE;
        if (this.debug) {
            // convert the ent_type_str to an ent_type
            ent_type = _getEntTypeFromStr(ent_type_sel);
            if (ent_type === undefined) {
                throw new Error("attrib.Values" + ": " + "ent_type_sel" + " is not one of the following valid types - " + "ps, _v, _e, _w, _f, pt, pl, pg, co, mo.");
            }
            // create an array of attrib names
            if (attribs === null) { attribs = this.__model__.modeldata.attribs.getAttribNamesUser(ent_type); }
            if (!Array.isArray(attribs)) { attribs = [attribs]; }
            attribs = attribs as string[];
            for (const attrib of attribs) { checkAttribName("attrib.Values" , attrib); }
        } 
        // --- Error Check ---
        return Values(this.__model__, ent_type_sel, attribs);
    }
    Discover(ent_type_sel: Enum._ENT_TYPEAndMod): any {
        // --- Error Check ---

        const fn_name = "attrib.Discover";
        const arg_name = "ent_type_sel";
        let ent_type: ENT_TYPE;

        if (this.debug) {

            // convert the ent_type_str to an ent_type
            ent_type = _getEntTypeFromStr(ent_type_sel);
            if (ent_type === undefined) {
                throw new Error(fn_name + ": " + arg_name + " is not one of the following valid types - " + "ps, _v, _e, _w, _f, pt, pl, pg, co, mo.");
            }
        } 
        // ----- TODO check if still needed -----
        // else {
        //     // convert the ent_type_str to an ent_type
        //     ent_type = _getEntTypeFromStr(ent_type_sel);
        // }

        // --- Error Check ---
        return Discover(this.__model__, ent_type_sel);
    }
}
