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
    __model__: GIModel;
    __enum__: {
        _EEdgeMethod: typeof Enum._EEdgeMethod;
        _EMeshMethod: typeof Enum._EMeshMethod;
    };
    constructor(model: GIModel);
    Color(entities: any, color: any): any;
    Gradient(entities: any, attrib: any, range: any, method: any): any;
    Edge(entities: any, method: any): any;
    Mesh(entities: any, method: any): any;
    Ray(rays: any, scale: any): any;
    Plane(planes: any, scale: any): any;
    BBox(bboxes: any): any;
}
