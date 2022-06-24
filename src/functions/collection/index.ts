/**
 * The `collections` module has functions for creating and modifying collections.
 * @module
 */
import { ENT_TYPE, Sim } from '../../mobius_sim';

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
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'collection.Add';
            checkIDs(this.__model__, fn_name, 'coll', coll, [ID.isID], [ENT_TYPE.COLL]) as string;
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1],
                [ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
        } 
        // --- Error Check ---        
        Add(this.__model__, coll, entities);
    }
    Create(entities: string | string[] | string[][], name: string): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'collection.Create';
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1, ID.isIDL2],
                [ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
            chk.checkArgs(fn_name, 'name', name, [chk.isStr, chk.isNull]);
        } 
        // --- Error Check ---    
        return Create(this.__model__, entities, name);
    }
    Delete(coll: string | string[]): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'collection.Delete';
            checkIDs(this.__model__, fn_name, 'coll', coll, [ID.isIDL1], [ENT_TYPE.COLL]) as string[];
        }
        // --- Error Check ---    
        Delete(this.__model__, coll);
    }
    Get(names: string | string[]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'collection.Get';
            chk.checkArgs(fn_name, 'names', names, [chk.isStr, chk.isStrL]);
        }
        // --- Error Check ---    
        return Get(this.__model__, names);
    }
    Remove(coll: string, entities: string | string[]): void {
        // --- Error Check ---
        const fn_name = 'collection.Remove';
        let ents_arr: string[] = null;
        let coll_arr;
        if (this.debug) {
            if (entities !== null) {
                entities = arrMakeFlat(entities) as string[];
                ents_arr = checkIDs(this.__model__, fn_name, 'entities', entities,
                    [ID.isID, ID.isIDL1],
                    [ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
            }
            coll_arr = checkIDs(this.__model__, fn_name, 'coll', coll, [ID.isID], [ENT_TYPE.COLL]) as string;
            }         
        // --- Error Check ---    
        Remove(this.__model__, coll, entities);
    }
}
