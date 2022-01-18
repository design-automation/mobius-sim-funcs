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
export declare class UtilFunc {
    __model__: GIModel;
    constructor(model: GIModel);
    EntityInfo(entities: any): any;
    ModelCheck(): any;
    ModelCompare(input_data: any): Promise<any>;
    ModelInfo(): any;
    ModelMerge(input_data: any): Promise<any>;
    ParamInfo(__constList__: any): any;
    Select(entities: any): void;
    SendData(data: any): void;
    VrHotspot(point: any, name: any, camera_rot: any): void;
    VrPanorama(point: any, back_url: any, back_rot: any, fore_url: any, fore_rot: any): void;
}
