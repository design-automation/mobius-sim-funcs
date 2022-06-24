/**
 * The `util` module has some utility functions used for debugging.
 * @module
 */
import { ENT_TYPE, Sim } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

import * as Enum from './_enum';
import { EntityInfo } from './EntityInfo';
import { HTTPRequest } from './httpRequest';
import { ModelCheck } from './ModelCheck';
import { ModelCompare } from './ModelCompare';
import { ModelInfo } from './ModelInfo';
import { ModelMerge } from './ModelMerge';
import { ParamInfo } from './ParamInfo';
import { Select } from './Select';
import { SendData } from './SendData';
import { VrHotspot } from './VrHotspot';
import { VrPanorama } from './VrPanorama';

export { Select };
export { HTTPRequest };
export { VrHotspot };
export { VrPanorama };
export { ParamInfo };
export { EntityInfo };
export { ModelInfo };
export { ModelCheck };
export { ModelCompare };
export { ModelMerge };
export { SendData };

// CLASS DEFINITION
export class UtilFunc {
;
    // Document Enums here
    __enum__ = {
        HTTPRequest: {
            method: Enum._HTTPRequestMethod
        },
    };

    public __model__: Sim;
    public debug: boolean;
    constructor(model: Sim, debug: boolean) {
        this.__model__ = model;
        this.debug = debug;
    }
    EntityInfo(entities: string | string[]): any {
        // --- Error Check ---
        const fn_name = 'util.EntityInfo';
        let ents_arr: string[];
        if (this.debug) {
            ents_arr = checkIDs(this.__model__, fn_name, 'coll', entities,
                [ID.isID, ID.isIDL1],
                [ENT_TYPE.COLL, ENT_TYPE.PGON, ENT_TYPE.PLINE, ENT_TYPE.POINT]) as string[];
        } 
        // --- Error Check ---    
        return EntityInfo(this.__model__, entities);
    }
    ModelCheck(): any {
        return ModelCheck(this.__model__);
    }
    async ModelCompare(input_data: string): Promise<any> {
        return await ModelCompare(this.__model__, input_data);
    }
    ModelInfo(): any {
        return ModelInfo(this.__model__);
    }
    async ModelMerge(input_data: string): Promise<any> {
        return await ModelMerge(this.__model__, input_data);
    }
    ParamInfo(__constList__: {}): any {
        return ParamInfo(this.__model__, __constList__);
    }
    Select(entities: string | string[] | string[][]): void {
        Select(this.__model__, entities);
    }
    SendData(data: any): void {
        SendData(this.__model__, data);
    }
    VrHotspot(point: string, name: string, camera_rot: number): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'util.vrHotspot';
            checkIDs(this.__model__, fn_name, 'points', point,
                [ID.isID],
                [ENT_TYPE.POINT]) as string;
            chk.checkArgs(fn_name, 'name', name, [chk.isStr, chk.isNull]);
            chk.checkArgs(fn_name, 'camera_rot', camera_rot, [chk.isNum, chk.isNull]);
        } 
        // --- Error Check ---    
        VrHotspot(this.__model__, point, name, camera_rot);
    }
    VrPanorama(point: string, back_url: number, back_rot: number, fore_url: number, fore_rot: number): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'util.vrPanorama';
            checkIDs(this.__model__, fn_name, 'point', point,
                [ID.isID],
                [ENT_TYPE.POINT]) as string;
            chk.checkArgs(fn_name, 'back_url', back_url, [chk.isStr]);
            chk.checkArgs(fn_name, 'back_rot', back_rot, [chk.isNum, chk.isNull]);
            chk.checkArgs(fn_name, 'fore_url', fore_url, [chk.isStr, chk.isNull]);
            chk.checkArgs(fn_name, 'fore_rot', fore_rot, [chk.isNum, chk.isNull]);
        }
        // --- Error Check ---    
        VrPanorama(this.__model__, point, back_url, back_rot, fore_url, fore_rot);
    }
    async HTTPRequest(request_data: any, request_url: string, method: Enum._HTTPRequestMethod) {
        return await HTTPRequest(this.__model__, request_data, request_url, method);
    }

}
