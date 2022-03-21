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
export declare class QueryFunc {
    __enum__: {
        /**
         * The `query` module has functions for querying entities in the the model.
         * Most of these functions all return a list of IDs of entities in the model.
         * @module
         */
        _EEntType: typeof Enum._EEntType;
        _EEntTypeAndMod: typeof Enum._EEntTypeAndMod;
        _EDataType: typeof Enum._EDataType;
        _EEdgeMethod: typeof Enum._EEdgeMethod;
        _ESortMethod: typeof Enum._ESortMethod;
        _ETypeQueryEnum: typeof Enum._ETypeQueryEnum;
        _EFilterOperator: typeof Enum._EFilterOperator;
    };
    __model__: GIModel;
    constructor(model: GIModel);
    Edge(entities: any, edge_query_enum: any): any;
    Filter(entities: any, attrib: any, operator_enum: any, value: any): any;
    Get(ent_type_enum: any, entities: any): any;
    Invert(ent_type_enum: any, entities: any): any;
    Neighbor(ent_type_enum: any, entities: any): any;
    Perimeter(ent_type: any, entities: any): any;
    Sort(entities: any, attrib: any, method_enum: any): any;
    Type(entities: any, type_query_enum: any): any;
}
