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
export declare class VisualizeFunc {
    __enum__: {
        /**
         * The `visualize` module has functions for defining various settings for the 3D viewer.
         * Color is saved as vertex attributes.
         * @module
         */
        _EEdgeMethod: typeof Enum._EEdgeMethod;
        _EMeshMethod: typeof Enum._EMeshMethod;
    };
    __model__: GIModel;
    constructor(model: GIModel);
    BBox(bboxes: any): Promise<any>;
    Color(entities: any, color: any): Promise<void>;
    Edge(entities: any, method: any): Promise<void>;
    Gradient(entities: any, attrib: any, range: any, method: any): Promise<void>;
    Mesh(entities: any, method: any): Promise<void>;
    Plane(planes: any, scale: any): Promise<any>;
    Ray(rays: any, scale: any): Promise<any>;
}
