/**
 * The `visualize` module has functions for defining various settings for the 3D viewer.
 * Color is saved as vertex attributes.
 * @module
 */
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

// CLASS DEFINITION
export class VisualizeFunc {
    __enum__ = {
        ...Enum
    }

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    BBox(bboxes): any {
        return BBox(this.__model__, bboxes);
    }
    Color(entities, color): void {
        Color(this.__model__, entities, color);
    }
    Edge(entities, method): void {
        Edge(this.__model__, entities, method);
    }
    Gradient(entities, attrib, range, method): void {
        Gradient(this.__model__, entities, attrib, range, method);
    }
    Mesh(entities, method): void {
        Mesh(this.__model__, entities, method);
    }
    Plane(planes, scale): any {
        return Plane(this.__model__, planes, scale);
    }
    Ray(rays, scale): any {
        return Ray(this.__model__, rays, scale);
    }

}
