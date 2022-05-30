/**
 * The `query` module has functions for querying entities in the the model.
 * Most of these functions all return a list of IDs of entities in the model.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';

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
            ent_type_enum: Enum._EEntType
        },
        Invert: {
            ent_type_enum: Enum._EEntType
        },
        Neighbor: {
            ent_type_enum: Enum._EEntType
        },
        Perimeter: {
            ent_type: Enum._EEntType
        },
        Sort: {
            method_enum: Enum._ESortMethod
        },
        Type: {
            type_query_enum: Enum._ETypeQueryEnum
        },
    };


    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Edge(entities: string | string[], edge_query_enum: Enum._EEdgeMethod): any {
        return Edge(this.__model__, entities, edge_query_enum);
    }
    Filter(entities: string | string[], attrib: string | [string, string | number], operator_enum: Enum._EFilterOperator, value: string | number | boolean | object | any[]): any {
        return Filter(this.__model__, entities, attrib, operator_enum, value);
    }
    Get(ent_type_enum: Enum._EEntType, entities: string | string[]): any {
        return Get(this.__model__, ent_type_enum, entities);
    }
    Invert(ent_type_enum: Enum._EEntType, entities: string | string[]): any {
        return Invert(this.__model__, ent_type_enum, entities);
    }
    Neighbor(ent_type_enum: Enum._EEntType, entities: string | string[]): any {
        return Neighbor(this.__model__, ent_type_enum, entities);
    }
    Perimeter(ent_type: Enum._EEntType, entities: string | string[]): any {
        return Perimeter(this.__model__, ent_type, entities);
    }
    Sort(entities: string[], attrib: string | [string, string | number], method_enum: Enum._ESortMethod): any {
        return Sort(this.__model__, entities, attrib, method_enum);
    }
    Type(entities: string | string[], type_query_enum: Enum._ETypeQueryEnum): any {
        return Type(this.__model__, entities, type_query_enum);
    }

}
