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
    async BBox(bboxes): Promise<any> {
        return BBox(this.__model__, bboxes);
    }
    async Color(entities, color): Promise<void> {
        Color(this.__model__, entities, color);
    }
    async Edge(entities, method): Promise<void> {
        Edge(this.__model__, entities, method);
    }
    async Gradient(entities, attrib, range, method): Promise<void> {
        Gradient(this.__model__, entities, attrib, range, method);
    }
    async Mesh(entities, method): Promise<void> {
        Mesh(this.__model__, entities, method);
    }
    async Plane(planes, scale): Promise<any> {
        return Plane(this.__model__, planes, scale);
    }
    async Ray(rays, scale): Promise<any> {
        return Ray(this.__model__, rays, scale);
    }

}
