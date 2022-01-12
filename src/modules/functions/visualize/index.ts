import { GIModel } from '@design-automation/mobius-sim';

import * as Enum from './_enum';
import { BBox } from './BBox';
import { Color } from './Color';
import { Edge } from './Edge';
import { Gradient } from './Gradient';
import { Mesh } from './Mesh';
import { Plane } from './Plane';
import { Ray } from './Ray';

export { Color };
export { Gradient };
export { Edge };
export { Mesh };
export { Ray };
export { Plane };
export { BBox };
export class VisualizeFunc {
    __model__: GIModel;
    __enum__ = {
        ...Enum
    }
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Color(entities, color): any {
        return Color(this.__model__, entities, color);
    }
    Gradient(entities, attrib, range, method): any {
        return Gradient(this.__model__, entities, attrib, range, method);
    }
    Edge(entities, method): any {
        return Edge(this.__model__, entities, method);
    }
    Mesh(entities, method): any {
        return Mesh(this.__model__, entities, method);
    }
    Ray(rays, scale): any {
        return Ray(this.__model__, rays, scale);
    }
    Plane(planes, scale): any {
        return Plane(this.__model__, planes, scale);
    }
    BBox(bboxes): any {
        return BBox(this.__model__, bboxes);
    }
}
