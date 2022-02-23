/**
 * The `util` module has some utility functions used for debugging.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';

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

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    EntityInfo(entities): any {
        return EntityInfo(this.__model__, entities);
    }
    ModelCheck(): any {
        return ModelCheck(this.__model__);
    }
    async ModelCompare(input_data): Promise<any> {
        return ModelCompare(this.__model__, input_data);
    }
    ModelInfo(): any {
        return ModelInfo(this.__model__);
    }
    async ModelMerge(input_data): Promise<any> {
        return ModelMerge(this.__model__, input_data);
    }
    ParamInfo(__constList__): any {
        return ParamInfo(this.__model__, __constList__);
    }
    Select(entities): void {
        Select(this.__model__, entities);
    }
    SendData(data): void {
        SendData(this.__model__, data);
    }
    VrHotspot(point, name, camera_rot): void {
        VrHotspot(this.__model__, point, name, camera_rot);
    }
    VrPanorama(point, back_url, back_rot, fore_url, fore_rot): void {
        VrPanorama(this.__model__, point, back_url, back_rot, fore_url, fore_rot);
    }
    HTTPRequest(request_data, request_url, method): void {
        HTTPRequest(this.__model__, request_data, request_url, method);
    }

}
