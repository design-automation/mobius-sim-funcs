/**
 * The `visualize` module has functions for defining various settings for the 3D viewer.
 * Color is saved as vertex attributes.
 * @module
 */
import { Sim } from '../../mobius_sim';
import { TBBox, TColor, TPlane, TRay } from '../_common/consts';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

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

    public __model__: Sim;
    public debug: boolean;
    constructor(model: Sim, debug: boolean) {
        this.__model__ = model;
        this.debug = debug;
    }
    BBox(bboxes: TBBox): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'visualize.BBox';
            chk.checkArgs(fn_name, 'bbox', bboxes, [chk.isBBox]); // TODO bboxs can be a list // add isBBoxList to enable check
        }
        // --- Error Check ---    
        return BBox(this.__model__, bboxes);
    }
    Color(entities: string | string[], color: TColor): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'visualize.Color';
            if (entities !== null) {
                checkIDs(this.__model__, fn_name, 'entities', entities,
                    [ID.isID, ID.isIDL1, ID.isIDL2], null) as string[];
            }
            chk.checkArgs(fn_name, 'color', color, [chk.isColor]);
        } 
        // --- Error Check ---    
        Color(this.__model__, entities, color);
    }
    Edge(entities: string | string[], method: Enum._EEdgeMethod): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'visualize.Edge';
            if (entities !== null) {
                checkIDs(this.__model__, fn_name, 'entities', entities,
                    [ID.isIDL1], null) as string[];
            }
        } 
        // --- Error Check ---    
        Edge(this.__model__, entities, method);
    }
    Gradient(entities: string | string[], attrib: string | [string, number] | [string, string], range: number | [number, number], method: Enum._EColorRampMethod): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'visualize.Gradient';
            let ents_arr: string[] = null;
            let attrib_name: string;
            let attrib_idx_or_key: number|string;
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1, ID.isIDL2], null) as string[];
            chk.checkArgs(fn_name, 'attrib', attrib,
                [chk.isStr, chk.isStrStr, chk.isStrNum]);
            chk.checkArgs(fn_name, 'range', range, [chk.isNull, chk.isNum, chk.isNumL]);
            attrib_name = Array.isArray(attrib) ? attrib[0] : attrib;
            attrib_idx_or_key = Array.isArray(attrib) ? attrib[1] : null;
            if (!this.__model__.modeldata.attribs.query.hasEntAttrib(ents_arr[0][0], attrib_name)) {
                throw new Error(fn_name + ': The attribute with name "' + attrib + '" does not exist on these entities.');
            } else {
                let data_type = null;
                if (attrib_idx_or_key === null) {
                    data_type = this.__model__.modeldata.attribs.query.getAttribDataType(ents_arr[0][0], attrib_name);
                } else {
                    const first_val = this.__model__.modeldata.attribs.get.getEntAttribValOrItem(
                        ents_arr[0][0], ents_arr[0][1], attrib_name, attrib_idx_or_key);
                }
                if (data_type !== EAttribDataTypeStrs.NUMBER) {
                    throw new Error(fn_name + ': The attribute with name "' + attrib_name + '" is not a number data type.' +
                    'For generating a gradient, the attribute must be a number.');
                }
            }
        } 
        // --- Error Check ---    
        Gradient(this.__model__, entities, attrib, range, method);
    }
    Mesh(entities: string | string[], method: Enum._EMeshMethod): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'visualize.Mesh';
            if (entities !== null) {
                checkIDs(this.__model__, fn_name, 'entities', entities,
                    [ID.isIDL1], null) as string[];
            }
        } 
        // --- Error Check ---    
        Mesh(this.__model__, entities, method);
    }
    Plane(planes: TPlane | TPlane[], scale: number): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'visualize.Plane';
            chk.checkArgs(fn_name, 'planes', planes,
                [chk.isPln, chk.isPlnL]);
            chk.checkArgs(fn_name, 'scale', scale, [chk.isNum]);
        }
        // --- Error Check ---    
        return Plane(this.__model__, planes, scale);
    }
    Ray(rays: TRay | TRay[], scale: number): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'visualize.Ray';
            chk.checkArgs(fn_name, 'ray', rays, [chk.isRay, chk.isRayL]);
            chk.checkArgs(fn_name, 'scale', scale, [chk.isNum]);
        }
        // --- Error Check ---    
        return Ray(this.__model__, rays, scale);
    }

}
