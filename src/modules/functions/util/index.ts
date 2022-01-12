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
export class UtilFunc {
    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Select(entities): any {
        return Select(this.__model__, entities);
    }
    VrHotspot(point, name, camera_rot): any {
        return VrHotspot(this.__model__, point, name, camera_rot);
    }
    VrPanorama(point, back_url, back_rot, fore_url, fore_rot): any {
        return VrPanorama(this.__model__, point, back_url, back_rot, fore_url, fore_rot);
    }
    ParamInfo(__constList__): any {
        return ParamInfo(this.__model__, __constList__);
    }
    EntityInfo(entities): any {
        return EntityInfo(this.__model__, entities);
    }
    ModelInfo(): any {
        return ModelInfo(this.__model__);
    }
    ModelCheck(): any {
        return ModelCheck(this.__model__);
    }
    ModelCompare(input_data): any {
        return ModelCompare(this.__model__, input_data);
    }
    ModelMerge(input_data): any {
        return ModelMerge(this.__model__, input_data);
    }
    SendData(data): any {
        return SendData(this.__model__, data);
    }
    _Async_Param_ModelCompare(input_data) {
        return null;
    }
    _Async_Param_ModelMerge(input_data){
        return null;
    }
    
}
