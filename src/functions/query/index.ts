/**
 * The `query` module has functions for querying entities in the the model.
 * Most of these functions all return a list of IDs of entities in the model.
 * @module
 */
import { Sim } from '../../mobius_sim';

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
        return Edge(this.__model__, entities, edge_query_enum);
    }
    Filter(entities: string | string[], attrib: string | [string, string | number], operator_enum: Enum._EFilterOperator, value: string | number | boolean | object | any[]): any {
        return Filter(this.__model__, entities, attrib, operator_enum, value);
    }
    Get(ent_type_enum: Enum._ENT_TYPE, entities: string | string[]): any {
        return Get(this.__model__, ent_type_enum, entities);
    }
    Invert(ent_type_enum: Enum._ENT_TYPE, entities: string | string[]): any {
        return Invert(this.__model__, ent_type_enum, entities);
    }
    Neighbor(ent_type_enum: Enum._ENT_TYPE, entities: string | string[]): any {
        return Neighbor(this.__model__, ent_type_enum, entities);
    }
    Perimeter(ent_type: Enum._ENT_TYPE, entities: string | string[]): any {
        return Perimeter(this.__model__, ent_type, entities);
    }
    Sort(entities: string[], attrib: string | [string, string | number], method_enum: Enum._ESortMethod): any {
        return Sort(this.__model__, entities, attrib, method_enum);
    }
    Type(entities: string | string[], type_query_enum: Enum._ETypeQueryEnum): any {
        return Type(this.__model__, entities, type_query_enum);
    }

}
