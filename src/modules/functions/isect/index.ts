import { GIModel } from '@design-automation/mobius-sim';

import * as Enum from './_enum';
import { Intersect } from './Intersect';
import { Knife } from './Knife';
import { Split } from './Split';

export { Intersect };
export { Knife };
export { Split };
export class AnalyzeFunc {
    __model__: GIModel;
    __enum__ = {
        ...Enum
    }
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Intersect(entities1, entities2): any {
        return Intersect(this.__model__, entities1, entities2);
    }
    Knife(geometry, plane, keep): any {
        return Knife(this.__model__, geometry, plane, keep);
    }
    Split(geometry, polyline): any {
        return Split(this.__model__, geometry, polyline);
    }
}
