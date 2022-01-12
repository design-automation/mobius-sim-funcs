"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilFunc = exports.SendData = exports.ModelMerge = exports.ModelCompare = exports.ModelCheck = exports.ModelInfo = exports.EntityInfo = exports.ParamInfo = exports.VrPanorama = exports.VrHotspot = exports.Select = void 0;
const EntityInfo_1 = require("./EntityInfo");
Object.defineProperty(exports, "EntityInfo", { enumerable: true, get: function () { return EntityInfo_1.EntityInfo; } });
const ModelCheck_1 = require("./ModelCheck");
Object.defineProperty(exports, "ModelCheck", { enumerable: true, get: function () { return ModelCheck_1.ModelCheck; } });
const ModelCompare_1 = require("./ModelCompare");
Object.defineProperty(exports, "ModelCompare", { enumerable: true, get: function () { return ModelCompare_1.ModelCompare; } });
const ModelInfo_1 = require("./ModelInfo");
Object.defineProperty(exports, "ModelInfo", { enumerable: true, get: function () { return ModelInfo_1.ModelInfo; } });
const ModelMerge_1 = require("./ModelMerge");
Object.defineProperty(exports, "ModelMerge", { enumerable: true, get: function () { return ModelMerge_1.ModelMerge; } });
const ParamInfo_1 = require("./ParamInfo");
Object.defineProperty(exports, "ParamInfo", { enumerable: true, get: function () { return ParamInfo_1.ParamInfo; } });
const Select_1 = require("./Select");
Object.defineProperty(exports, "Select", { enumerable: true, get: function () { return Select_1.Select; } });
const SendData_1 = require("./SendData");
Object.defineProperty(exports, "SendData", { enumerable: true, get: function () { return SendData_1.SendData; } });
const VrHotspot_1 = require("./VrHotspot");
Object.defineProperty(exports, "VrHotspot", { enumerable: true, get: function () { return VrHotspot_1.VrHotspot; } });
const VrPanorama_1 = require("./VrPanorama");
Object.defineProperty(exports, "VrPanorama", { enumerable: true, get: function () { return VrPanorama_1.VrPanorama; } });
class UtilFunc {
    constructor(model) {
        this.__model__ = model;
    }
    Select(entities) {
        return (0, Select_1.Select)(this.__model__, entities);
    }
    VrHotspot(point, name, camera_rot) {
        return (0, VrHotspot_1.VrHotspot)(this.__model__, point, name, camera_rot);
    }
    VrPanorama(point, back_url, back_rot, fore_url, fore_rot) {
        return (0, VrPanorama_1.VrPanorama)(this.__model__, point, back_url, back_rot, fore_url, fore_rot);
    }
    ParamInfo(__constList__) {
        return (0, ParamInfo_1.ParamInfo)(this.__model__, __constList__);
    }
    EntityInfo(entities) {
        return (0, EntityInfo_1.EntityInfo)(this.__model__, entities);
    }
    ModelInfo() {
        return (0, ModelInfo_1.ModelInfo)(this.__model__);
    }
    ModelCheck() {
        return (0, ModelCheck_1.ModelCheck)(this.__model__);
    }
    ModelCompare(input_data) {
        return (0, ModelCompare_1.ModelCompare)(this.__model__, input_data);
    }
    ModelMerge(input_data) {
        return (0, ModelMerge_1.ModelMerge)(this.__model__, input_data);
    }
    SendData(data) {
        return (0, SendData_1.SendData)(this.__model__, data);
    }
    _Async_Param_ModelCompare(input_data) {
        return null;
    }
    _Async_Param_ModelMerge(input_data) {
        return null;
    }
}
exports.UtilFunc = UtilFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvdXRpbC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSw2Q0FBMEM7QUFlakMsMkZBZkEsdUJBQVUsT0FlQTtBQWRuQiw2Q0FBMEM7QUFnQmpDLDJGQWhCQSx1QkFBVSxPQWdCQTtBQWZuQixpREFBOEM7QUFnQnJDLDZGQWhCQSwyQkFBWSxPQWdCQTtBQWZyQiwyQ0FBd0M7QUFhL0IsMEZBYkEscUJBQVMsT0FhQTtBQVpsQiw2Q0FBMEM7QUFlakMsMkZBZkEsdUJBQVUsT0FlQTtBQWRuQiwyQ0FBd0M7QUFTL0IsMEZBVEEscUJBQVMsT0FTQTtBQVJsQixxQ0FBa0M7QUFLekIsdUZBTEEsZUFBTSxPQUtBO0FBSmYseUNBQXNDO0FBYTdCLHlGQWJBLG1CQUFRLE9BYUE7QUFaakIsMkNBQXdDO0FBSS9CLDBGQUpBLHFCQUFTLE9BSUE7QUFIbEIsNkNBQTBDO0FBSWpDLDJGQUpBLHVCQUFVLE9BSUE7QUFRbkIsTUFBYSxRQUFRO0lBRWpCLFlBQVksS0FBYztRQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVE7UUFDWCxPQUFPLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVU7UUFDN0IsT0FBTyxJQUFBLHFCQUFTLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFDRCxVQUFVLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVE7UUFDcEQsT0FBTyxJQUFBLHVCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUNELFNBQVMsQ0FBQyxhQUFhO1FBQ25CLE9BQU8sSUFBQSxxQkFBUyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUNELFVBQVUsQ0FBQyxRQUFRO1FBQ2YsT0FBTyxJQUFBLHVCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsU0FBUztRQUNMLE9BQU8sSUFBQSxxQkFBUyxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsVUFBVTtRQUNOLE9BQU8sSUFBQSx1QkFBVSxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBQ0QsWUFBWSxDQUFDLFVBQVU7UUFDbkIsT0FBTyxJQUFBLDJCQUFZLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBQ0QsVUFBVSxDQUFDLFVBQVU7UUFDakIsT0FBTyxJQUFBLHVCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0QsUUFBUSxDQUFDLElBQUk7UUFDVCxPQUFPLElBQUEsbUJBQVEsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDRCx5QkFBeUIsQ0FBQyxVQUFVO1FBQ2hDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCx1QkFBdUIsQ0FBQyxVQUFVO1FBQzlCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FFSjtBQTFDRCw0QkEwQ0MifQ==