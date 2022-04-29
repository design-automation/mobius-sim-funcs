"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilFunc = exports.SendData = exports.ModelMerge = exports.ModelCompare = exports.ModelCheck = exports.ModelInfo = exports.EntityInfo = exports.ParamInfo = exports.VrPanorama = exports.VrHotspot = exports.HTTPRequest = exports.Select = void 0;
const Enum = __importStar(require("./_enum"));
const EntityInfo_1 = require("./EntityInfo");
Object.defineProperty(exports, "EntityInfo", { enumerable: true, get: function () { return EntityInfo_1.EntityInfo; } });
const httpRequest_1 = require("./httpRequest");
Object.defineProperty(exports, "HTTPRequest", { enumerable: true, get: function () { return httpRequest_1.HTTPRequest; } });
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
// CLASS DEFINITION
class UtilFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    EntityInfo(entities) {
        return (0, EntityInfo_1.EntityInfo)(this.__model__, entities);
    }
    ModelCheck() {
        return (0, ModelCheck_1.ModelCheck)(this.__model__);
    }
    ModelCompare(input_data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, ModelCompare_1.ModelCompare)(this.__model__, input_data);
        });
    }
    ModelInfo() {
        return (0, ModelInfo_1.ModelInfo)(this.__model__);
    }
    ModelMerge(input_data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, ModelMerge_1.ModelMerge)(this.__model__, input_data);
        });
    }
    ParamInfo(__constList__) {
        return (0, ParamInfo_1.ParamInfo)(this.__model__, __constList__);
    }
    Select(entities) {
        (0, Select_1.Select)(this.__model__, entities);
    }
    SendData(data) {
        (0, SendData_1.SendData)(this.__model__, data);
    }
    VrHotspot(point, name, camera_rot) {
        (0, VrHotspot_1.VrHotspot)(this.__model__, point, name, camera_rot);
    }
    VrPanorama(point, back_url, back_rot, fore_url, fore_rot) {
        (0, VrPanorama_1.VrPanorama)(this.__model__, point, back_url, back_rot, fore_url, fore_rot);
    }
    HTTPRequest(request_data, request_url, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, httpRequest_1.HTTPRequest)(this.__model__, request_data, request_url, method);
        });
    }
}
exports.UtilFunc = UtilFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvdXRpbC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLDhDQUFnQztBQUNoQyw2Q0FBMEM7QUFpQmpDLDJGQWpCQSx1QkFBVSxPQWlCQTtBQWhCbkIsK0NBQTRDO0FBWW5DLDRGQVpBLHlCQUFXLE9BWUE7QUFYcEIsNkNBQTBDO0FBaUJqQywyRkFqQkEsdUJBQVUsT0FpQkE7QUFoQm5CLGlEQUE4QztBQWlCckMsNkZBakJBLDJCQUFZLE9BaUJBO0FBaEJyQiwyQ0FBd0M7QUFjL0IsMEZBZEEscUJBQVMsT0FjQTtBQWJsQiw2Q0FBMEM7QUFnQmpDLDJGQWhCQSx1QkFBVSxPQWdCQTtBQWZuQiwyQ0FBd0M7QUFVL0IsMEZBVkEscUJBQVMsT0FVQTtBQVRsQixxQ0FBa0M7QUFLekIsdUZBTEEsZUFBTSxPQUtBO0FBSmYseUNBQXNDO0FBYzdCLHlGQWRBLG1CQUFRLE9BY0E7QUFiakIsMkNBQXdDO0FBSy9CLDBGQUxBLHFCQUFTLE9BS0E7QUFKbEIsNkNBQTBDO0FBS2pDLDJGQUxBLHVCQUFVLE9BS0E7QUFTbkIsbUJBQW1CO0FBQ25CLE1BQWEsUUFBUTtJQU1qQixZQUFZLEtBQWM7UUFMMUIsYUFBUSxxQkFDRCxJQUFJLEVBQ1Q7UUFJRSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsVUFBVSxDQUFDLFFBQVE7UUFDZixPQUFPLElBQUEsdUJBQVUsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDRCxVQUFVO1FBQ04sT0FBTyxJQUFBLHVCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFDSyxZQUFZLENBQUMsVUFBVTs7WUFDekIsT0FBTyxNQUFNLElBQUEsMkJBQVksRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzFELENBQUM7S0FBQTtJQUNELFNBQVM7UUFDTCxPQUFPLElBQUEscUJBQVMsRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNLLFVBQVUsQ0FBQyxVQUFVOztZQUN2QixPQUFPLE1BQU0sSUFBQSx1QkFBVSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDeEQsQ0FBQztLQUFBO0lBQ0QsU0FBUyxDQUFDLGFBQWE7UUFDbkIsT0FBTyxJQUFBLHFCQUFTLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVE7UUFDWCxJQUFBLGVBQU0sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxRQUFRLENBQUMsSUFBSTtRQUNULElBQUEsbUJBQVEsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFDRCxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVO1FBQzdCLElBQUEscUJBQVMsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUNELFVBQVUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUTtRQUNwRCxJQUFBLHVCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUNLLFdBQVcsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLE1BQU07O1lBQy9DLE9BQU8sTUFBTSxJQUFBLHlCQUFXLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hGLENBQUM7S0FBQTtDQUVKO0FBM0NELDRCQTJDQyJ9