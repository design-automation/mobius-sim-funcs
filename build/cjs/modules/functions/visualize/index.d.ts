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
        _EColorRampMethod: typeof Enum._EColorRampMethod;
    };
    __model__: GIModel;
    constructor(model: GIModel);
    BBox(bboxes: any): any;
    Color(entities: any, color: any): void;
    Edge(entities: any, method: any): void;
    Gradient(entities: any, attrib: any, range: any, method: any): void;
    Mesh(entities: any, method: any): void;
    Plane(planes: any, scale: any): any;
    Ray(rays: any, scale: any): any;
}
