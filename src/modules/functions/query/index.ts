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
    __enum__ = {
        ...Enum
    }

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    async Edge(entities, edge_query_enum): Promise<any> {
        return Edge(this.__model__, entities, edge_query_enum);
    }
    async Filter(entities, attrib, operator_enum, value): Promise<any> {
        return Filter(this.__model__, entities, attrib, operator_enum, value);
    }
    async Get(ent_type_enum, entities): Promise<any> {
        return Get(this.__model__, ent_type_enum, entities);
    }
    async Invert(ent_type_enum, entities): Promise<any> {
        return Invert(this.__model__, ent_type_enum, entities);
    }
    async Neighbor(ent_type_enum, entities): Promise<any> {
        return Neighbor(this.__model__, ent_type_enum, entities);
    }
    async Perimeter(ent_type, entities): Promise<any> {
        return Perimeter(this.__model__, ent_type, entities);
    }
    async Sort(entities, attrib, method_enum): Promise<any> {
        return Sort(this.__model__, entities, attrib, method_enum);
    }
    async Type(entities, type_query_enum): Promise<any> {
        return Type(this.__model__, entities, type_query_enum);
    }

}
