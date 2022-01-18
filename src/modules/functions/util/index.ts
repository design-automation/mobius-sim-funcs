/**
 * The `util` module has some utility functions used for debugging.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';

import { EntityInfo } from './EntityInfo';
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
    async EntityInfo(entities): Promise<any> {
        return EntityInfo(this.__model__, entities);
    }
    async ModelCheck(): Promise<any> {
        return ModelCheck(this.__model__);
    }
    async ModelCompare(input_data): Promise<any> {
        return ModelCompare(this.__model__, input_data);
    }
    async ModelInfo(): Promise<any> {
        return ModelInfo(this.__model__);
    }
    async ModelMerge(input_data): Promise<any> {
        return ModelMerge(this.__model__, input_data);
    }
    async ParamInfo(__constList__): Promise<any> {
        return ParamInfo(this.__model__, __constList__);
    }
    async Select(entities): Promise<void> {
        Select(this.__model__, entities);
    }
    async SendData(data): Promise<void> {
        SendData(this.__model__, data);
    }
    async VrHotspot(point, name, camera_rot): Promise<void> {
        VrHotspot(this.__model__, point, name, camera_rot);
    }
    async VrPanorama(point, back_url, back_rot, fore_url, fore_rot): Promise<void> {
        VrPanorama(this.__model__, point, back_url, back_rot, fore_url, fore_rot);
    }

}
