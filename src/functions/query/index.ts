/**
 * The `query` module has functions for querying entities in the the model.
 * Most of these functions all return a list of IDs of entities in the model.
 * @module
 */
import { ENT_TYPE, Sim } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

import * as Enum from './_enum';
import { Edge } from './Edge';
import { Filter } from './Filter';
import { Get } from './Get';
import { Invert } from './Invert';
import { Neighbor } from './Neighbor';
import { Perimeter } from './Perimeter';
import { Sort } from './Sort';
import { Type } from './Type';
import { checkAttribNameIdxKey, checkAttribValue, splitAttribNameIdxKey } from '../_common/_check_attribs';

export { Get };
export { Filter };
export { Invert };
export { Sort };
export { Perimeter };
export { Neighbor };
export { Edge };
export { Type };

// CLASS DEFINITION
export class QueryFunc {

    // Document Enums here
    __enum__ = {
        Edge: {
            edge_query_enum: Enum._EEdgeMethod
        },
        Filter: {
            operator_enum: Enum._EFilterOperator
        },
        Get: {
            ent_type_enum: Enum._ENT_TYPE
        },
        Invert: {
            ent_type_enum: Enum._ENT_TYPE
        },
        Neighbor: {
            ent_type_enum: Enum._ENT_TYPE
        },
        Perimeter: {
            ent_type: Enum._ENT_TYPE
        },
        Sort: {
            method_enum: Enum._ESortMethod
        },
        Type: {
            type_query_enum: Enum._ETypeQueryEnum
        },
    };


    public __model__: Sim;
    public debug: boolean;
    constructor(model: Sim, debug: boolean) {
        this.__model__ = model;
        this.debug = debug;
    }
    Edge(entities: string | string[], edge_query_enum: Enum._EEdgeMethod): any {
        // --- Error Check ---
        if (this.debug) {
            if (entities !== null && entities !== undefined) {
                checkIDs(this.__model__, 'query.Edge', 'entities', entities, [ID.isIDL1], [ENT_TYPE.EDGE]) as string[];
            }
        } 
        // --- Error Check ---    
        return Edge(this.__model__, entities, edge_query_enum);
    }
    Filter(entities: string | string[], attrib: string | [string, string | number], operator_enum: Enum._EFilterOperator, value: string | number | boolean | object | any[]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'query.Filter';
            let attrib_name: string, attrib_idx_key: number|string;
            if (entities !== null && entities !== undefined) {
                checkIDs(this.__model__, fn_name, 'entities', entities,
                    [ID.isID, ID.isIDL1, ID.isIDL2], null, false) as string|string[];
            }
            [attrib_name, attrib_idx_key] = checkAttribNameIdxKey(fn_name, attrib);
            checkAttribValue(fn_name, value);
        } 
        // --- Error Check ---    
        return Filter(this.__model__, entities, attrib, operator_enum, value);
    }
    Get(ent_type_enum: Enum._ENT_TYPE, entities: string | string[]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'query.Get';
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isNull, ID.isID, ID.isIDL1, ID.isIDL2], null, false) as string|string[];
        } 
        // --- Error Check ---    
        return Get(this.__model__, ent_type_enum, entities);
    }
    Invert(ent_type_enum: Enum._ENT_TYPE, entities: string | string[]): any {
        // --- Error Check ---
        if (this.debug) {
            if (entities !== null && entities !== undefined) {
                checkIDs(this.__model__, 'query.Invert', 'entities', entities, [ID.isIDL1], null, false) as string[];
            }
        }
        // --- Error Check ---    
        return Invert(this.__model__, ent_type_enum, entities);
    }
    Neighbor(ent_type_enum: Enum._ENT_TYPE, entities: string | string[]): any {
        // --- Error Check ---
        if (this.debug) {
            if (entities !== null && entities !== undefined) {
                checkIDs(this.__model__, 'query.Neighbor', 'entities', entities, [ID.isIDL1], null) as string[];
            }
        } 
        // --- Error Check ---
        return Neighbor(this.__model__, ent_type_enum, entities);
    }
    Perimeter(ent_type: Enum._ENT_TYPE, entities: string | string[]): any {
        // --- Error Check ---
        if (this.debug) {
            if (entities !== null && entities !== undefined) {
                checkIDs(this.__model__, 'query.Perimeter', 'entities', entities, [ID.isIDL1], null) as string[];
            }
        } 
        // --- Error Check ---    
        return Perimeter(this.__model__, ent_type, entities);
    }
    Sort(entities: string[], attrib: string | [string, string | number], method_enum: Enum._ESortMethod): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'query.Sort';
            let attrib_name: string, attrib_idx_key: number|string;
            checkIDs(this.__model__, fn_name, 'entities', entities, [ID.isIDL1], null) as string[];
            [attrib_name, attrib_idx_key] = checkAttribNameIdxKey(fn_name, attrib);
        } 
        // --- Error Check ---    
        return Sort(this.__model__, entities, attrib, method_enum);
    }
    Type(entities: string | string[], type_query_enum: Enum._ETypeQueryEnum): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'query.Type';
            checkIDs(this.__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null, false) as string|string[];
        } 
        // --- Error Check ---    
        return Type(this.__model__, entities, type_query_enum);
    }

}
