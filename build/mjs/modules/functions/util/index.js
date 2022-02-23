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
    constructor(model) {
        this.__enum__ = {
            ...Enum
        };
        this.__model__ = model;
    }
    EntityInfo(entities) {
        return EntityInfo(this.__model__, entities);
    }
    ModelCheck() {
        return ModelCheck(this.__model__);
    }
    async ModelCompare(input_data) {
        return await ModelCompare(this.__model__, input_data);
    }
    ModelInfo() {
        return ModelInfo(this.__model__);
    }
    async ModelMerge(input_data) {
        return await ModelMerge(this.__model__, input_data);
    }
    ParamInfo(__constList__) {
        return ParamInfo(this.__model__, __constList__);
    }
    Select(entities) {
        Select(this.__model__, entities);
    }
    SendData(data) {
        SendData(this.__model__, data);
    }
    VrHotspot(point, name, camera_rot) {
        VrHotspot(this.__model__, point, name, camera_rot);
    }
    VrPanorama(point, back_url, back_rot, fore_url, fore_rot) {
        VrPanorama(this.__model__, point, back_url, back_rot, fore_url, fore_rot);
    }
    async HTTPRequest(request_data, request_url, method) {
        return await HTTPRequest(this.__model__, request_data, request_url, method);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvdXRpbC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNQSxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUNoQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUMxQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUUxQyxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDbEIsT0FBTyxFQUFFLFdBQVcsRUFBRSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQztBQUNyQixPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUM7QUFDdEIsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQztBQUN0QixPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUM7QUFDckIsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDO0FBQ3RCLE9BQU8sRUFBRSxZQUFZLEVBQUUsQ0FBQztBQUN4QixPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUM7QUFDdEIsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDO0FBRXBCLG1CQUFtQjtBQUNuQixNQUFNLE9BQU8sUUFBUTtJQU1qQixZQUFZLEtBQWM7UUFMMUIsYUFBUSxHQUFHO1lBQ1AsR0FBRyxJQUFJO1NBQ1YsQ0FBQztRQUlFLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxVQUFVLENBQUMsUUFBUTtRQUNmLE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNELFVBQVU7UUFDTixPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNELEtBQUssQ0FBQyxZQUFZLENBQUMsVUFBVTtRQUN6QixPQUFPLE1BQU0sWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUNELFNBQVM7UUFDTCxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVTtRQUN2QixPQUFPLE1BQU0sVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUNELFNBQVMsQ0FBQyxhQUFhO1FBQ25CLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRO1FBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELFFBQVEsQ0FBQyxJQUFJO1FBQ1QsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUNELFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVU7UUFDN0IsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBQ0QsVUFBVSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRO1FBQ3BELFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBQ0QsS0FBSyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLE1BQU07UUFDL0MsT0FBTyxNQUFNLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEYsQ0FBQztDQUVKIn0=