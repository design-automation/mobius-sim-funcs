/**
 * The `visualize` module has functions for defining various settings for the 3D viewer.
 * Color is saved as vertex attributes.
 * @module
 */
import { GIModel, TBBox, TColor, TPlane, TRay } from '@design-automation/mobius-sim';

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

    // Document Enums here
    __enum__ = {
        Edge: {
            method: Enum._EEdgeMethod
        },
        Mesh: {
            method: Enum._EMeshMethod
        },
    };

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    BBox(bboxes: TBBox): any {
        return BBox(this.__model__, bboxes);
    }
    Color(entities: string | string[], color: TColor): void {
        Color(this.__model__, entities, color);
    }
    Edge(entities: string | string[], method: Enum._EEdgeMethod): void {
        Edge(this.__model__, entities, method);
    }
    Gradient(entities: string | string[], attrib: string | [string, number] | [string, string], range: number | [number, number], method: Enum._EColorRampMethod): void {
        Gradient(this.__model__, entities, attrib, range, method);
    }
    Mesh(entities: string | string[], method: Enum._EMeshMethod): void {
        Mesh(this.__model__, entities, method);
    }
    Plane(planes: TPlane | TPlane[], scale: number): any {
        return Plane(this.__model__, planes, scale);
    }
    Ray(rays: TRay | TRay[], scale: number): any {
        return Ray(this.__model__, rays, scale);
    }

}
