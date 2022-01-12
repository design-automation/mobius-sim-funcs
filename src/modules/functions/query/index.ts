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
export class QueryFunc {
    __model__: GIModel;
    __enum__ = {
        ...Enum
    }
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Get(ent_type_enum, entities): any {
        return Get(this.__model__, ent_type_enum, entities);
    }
    Filter(entities, attrib, operator_enum, value): any {
        return Filter(this.__model__, entities, attrib, operator_enum, value);
    }
    Invert(ent_type_enum, entities): any {
        return Invert(this.__model__, ent_type_enum, entities);
    }
    Sort(entities, attrib, method_enum): any {
        return Sort(this.__model__, entities, attrib, method_enum);
    }
    Perimeter(ent_type, entities): any {
        return Perimeter(this.__model__, ent_type, entities);
    }
    Neighbor(ent_type_enum, entities): any {
        return Neighbor(this.__model__, ent_type_enum, entities);
    }
    Edge(entities, edge_query_enum): any {
        return Edge(this.__model__, entities, edge_query_enum);
    }
    Type(entities, type_query_enum): any {
        return Type(this.__model__, entities, type_query_enum);
    }
}
