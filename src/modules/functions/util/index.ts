/**
 * The `util` module has some utility functions used for debugging.
 * @module
 */
import { GIModel, TId, TPlane, Txyz } from '@design-automation/mobius-sim';

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
import { Text } from './Text';

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
export { Text };

// CLASS DEFINITION
export class UtilFunc {
;
    // Document Enums here
    __enum__ = {
        HTTPRequest: {
            method: Enum._HTTPRequestMethod
        },
    };

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    EntityInfo(entities: string | string[]): any {
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
        VrHotspot(this.__model__, point, name, camera_rot);
    }
    VrPanorama(point: string, back_url: number, back_rot: number, fore_url: number, fore_rot: number): void {
        VrPanorama(this.__model__, point, back_url, back_rot, fore_url, fore_rot);
    }
    async HTTPRequest(request_data: any, request_url: string, method: Enum._HTTPRequestMethod) {
        return await HTTPRequest(this.__model__, request_data, request_url, method);
    }
    Text(text: string, origin: Txyz | TPlane, options: object): TId {
        return Text(this.__model__, text, origin, options);
    }
}
