"use strict";
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
// CLASS DEFINITION
class UtilFunc {
    constructor(model) {
        this.__model__ = model;
    }
    EntityInfo(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, EntityInfo_1.EntityInfo)(this.__model__, entities);
        });
    }
    ModelCheck() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, ModelCheck_1.ModelCheck)(this.__model__);
        });
    }
    ModelCompare(input_data) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, ModelCompare_1.ModelCompare)(this.__model__, input_data);
        });
    }
    ModelInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, ModelInfo_1.ModelInfo)(this.__model__);
        });
    }
    ModelMerge(input_data) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, ModelMerge_1.ModelMerge)(this.__model__, input_data);
        });
    }
    ParamInfo(__constList__) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, ParamInfo_1.ParamInfo)(this.__model__, __constList__);
        });
    }
    Select(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Select_1.Select)(this.__model__, entities);
        });
    }
    SendData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, SendData_1.SendData)(this.__model__, data);
        });
    }
    VrHotspot(point, name, camera_rot) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, VrHotspot_1.VrHotspot)(this.__model__, point, name, camera_rot);
        });
    }
    VrPanorama(point, back_url, back_rot, fore_url, fore_rot) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, VrPanorama_1.VrPanorama)(this.__model__, point, back_url, back_rot, fore_url, fore_rot);
        });
    }
}
exports.UtilFunc = UtilFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvdXRpbC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFNQSw2Q0FBMEM7QUFlakMsMkZBZkEsdUJBQVUsT0FlQTtBQWRuQiw2Q0FBMEM7QUFnQmpDLDJGQWhCQSx1QkFBVSxPQWdCQTtBQWZuQixpREFBOEM7QUFnQnJDLDZGQWhCQSwyQkFBWSxPQWdCQTtBQWZyQiwyQ0FBd0M7QUFhL0IsMEZBYkEscUJBQVMsT0FhQTtBQVpsQiw2Q0FBMEM7QUFlakMsMkZBZkEsdUJBQVUsT0FlQTtBQWRuQiwyQ0FBd0M7QUFTL0IsMEZBVEEscUJBQVMsT0FTQTtBQVJsQixxQ0FBa0M7QUFLekIsdUZBTEEsZUFBTSxPQUtBO0FBSmYseUNBQXNDO0FBYTdCLHlGQWJBLG1CQUFRLE9BYUE7QUFaakIsMkNBQXdDO0FBSS9CLDBGQUpBLHFCQUFTLE9BSUE7QUFIbEIsNkNBQTBDO0FBSWpDLDJGQUpBLHVCQUFVLE9BSUE7QUFTbkIsbUJBQW1CO0FBQ25CLE1BQWEsUUFBUTtJQUdqQixZQUFZLEtBQWM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNLLFVBQVUsQ0FBQyxRQUFROztZQUNyQixPQUFPLElBQUEsdUJBQVUsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELENBQUM7S0FBQTtJQUNLLFVBQVU7O1lBQ1osT0FBTyxJQUFBLHVCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7S0FBQTtJQUNLLFlBQVksQ0FBQyxVQUFVOztZQUN6QixPQUFPLElBQUEsMkJBQVksRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3BELENBQUM7S0FBQTtJQUNLLFNBQVM7O1lBQ1gsT0FBTyxJQUFBLHFCQUFTLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7S0FBQTtJQUNLLFVBQVUsQ0FBQyxVQUFVOztZQUN2QixPQUFPLElBQUEsdUJBQVUsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2xELENBQUM7S0FBQTtJQUNLLFNBQVMsQ0FBQyxhQUFhOztZQUN6QixPQUFPLElBQUEscUJBQVMsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELENBQUM7S0FBQTtJQUNLLE1BQU0sQ0FBQyxRQUFROztZQUNqQixJQUFBLGVBQU0sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7S0FBQTtJQUNLLFFBQVEsQ0FBQyxJQUFJOztZQUNmLElBQUEsbUJBQVEsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25DLENBQUM7S0FBQTtJQUNLLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVU7O1lBQ25DLElBQUEscUJBQVMsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdkQsQ0FBQztLQUFBO0lBQ0ssVUFBVSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFROztZQUMxRCxJQUFBLHVCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDOUUsQ0FBQztLQUFBO0NBRUo7QUFyQ0QsNEJBcUNDIn0=