"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.IoFunc = exports._getFile = exports.LatLong2XYZ = exports.Geoalign = exports.Geolocate = exports.ExportData = exports.Export = exports.Import = exports.ImportData = exports.Write = exports.Read = void 0;
const Enum = __importStar(require("./_enum"));
const _getFile_1 = require("./_getFile");
Object.defineProperty(exports, "_getFile", { enumerable: true, get: function () { return _getFile_1._getFile; } });
const Export_1 = require("./Export");
Object.defineProperty(exports, "Export", { enumerable: true, get: function () { return Export_1.Export; } });
const ExportData_1 = require("./ExportData");
Object.defineProperty(exports, "ExportData", { enumerable: true, get: function () { return ExportData_1.ExportData; } });
const Geoalign_1 = require("./Geoalign");
Object.defineProperty(exports, "Geoalign", { enumerable: true, get: function () { return Geoalign_1.Geoalign; } });
const Geolocate_1 = require("./Geolocate");
Object.defineProperty(exports, "Geolocate", { enumerable: true, get: function () { return Geolocate_1.Geolocate; } });
const Import_1 = require("./Import");
Object.defineProperty(exports, "Import", { enumerable: true, get: function () { return Import_1.Import; } });
const ImportData_1 = require("./ImportData");
Object.defineProperty(exports, "ImportData", { enumerable: true, get: function () { return ImportData_1.ImportData; } });
const LatLong2XYZ_1 = require("./LatLong2XYZ");
Object.defineProperty(exports, "LatLong2XYZ", { enumerable: true, get: function () { return LatLong2XYZ_1.LatLong2XYZ; } });
const Read_1 = require("./Read");
Object.defineProperty(exports, "Read", { enumerable: true, get: function () { return Read_1.Read; } });
const Write_1 = require("./Write");
Object.defineProperty(exports, "Write", { enumerable: true, get: function () { return Write_1.Write; } });
// CLASS DEFINITION
class IoFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    Export(entities, file_name, data_format, data_target) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Export_1.Export)(this.__model__, entities, file_name, data_format, data_target);
        });
    }
    ExportData(entities, data_format) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, ExportData_1.ExportData)(this.__model__, entities, data_format);
        });
    }
    Geoalign(lat_long_o, lat_long_x, elev) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Geoalign_1.Geoalign)(this.__model__, lat_long_o, lat_long_x, elev);
        });
    }
    Geolocate(lat_long, rot, elev) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Geolocate_1.Geolocate)(this.__model__, lat_long, rot, elev);
        });
    }
    Import(data_url, data_format) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Import_1.Import)(this.__model__, data_url, data_format);
        });
    }
    ImportData(model_data, data_format) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, ImportData_1.ImportData)(this.__model__, model_data, data_format);
        });
    }
    LatLong2XYZ(lat_long, elev) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, LatLong2XYZ_1.LatLong2XYZ)(this.__model__, lat_long, elev);
        });
    }
    Read(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Read_1.Read)(this.__model__, data);
        });
    }
    Write(data, file_name, data_target) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Write_1.Write)(this.__model__, data, file_name, data_target);
        });
    }
}
exports.IoFunc = IoFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvaW8vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLDhDQUFnQztBQUNoQyx5Q0FBc0M7QUFvQjdCLHlGQXBCQSxtQkFBUSxPQW9CQTtBQW5CakIscUNBQWtDO0FBY3pCLHVGQWRBLGVBQU0sT0FjQTtBQWJmLDZDQUEwQztBQWNqQywyRkFkQSx1QkFBVSxPQWNBO0FBYm5CLHlDQUFzQztBQWU3Qix5RkFmQSxtQkFBUSxPQWVBO0FBZGpCLDJDQUF3QztBQWEvQiwwRkFiQSxxQkFBUyxPQWFBO0FBWmxCLHFDQUFrQztBQVN6Qix1RkFUQSxlQUFNLE9BU0E7QUFSZiw2Q0FBMEM7QUFPakMsMkZBUEEsdUJBQVUsT0FPQTtBQU5uQiwrQ0FBNEM7QUFZbkMsNEZBWkEseUJBQVcsT0FZQTtBQVhwQixpQ0FBOEI7QUFHckIscUZBSEEsV0FBSSxPQUdBO0FBRmIsbUNBQWdDO0FBR3ZCLHNGQUhBLGFBQUssT0FHQTtBQVVkLG1CQUFtQjtBQUNuQixNQUFhLE1BQU07SUFNZixZQUFZLEtBQWM7UUFMMUIsYUFBUSxxQkFDRCxJQUFJLEVBQ1Y7UUFJRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0ssTUFBTSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFdBQVc7O1lBQ3RELElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDMUUsQ0FBQztLQUFBO0lBQ0ssVUFBVSxDQUFDLFFBQVEsRUFBRSxXQUFXOztZQUNsQyxPQUFPLElBQUEsdUJBQVUsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUM3RCxDQUFDO0tBQUE7SUFDSyxRQUFRLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxJQUFJOztZQUN2QyxJQUFBLG1CQUFRLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNELENBQUM7S0FBQTtJQUNLLFNBQVMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUk7O1lBQy9CLElBQUEscUJBQVMsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkQsQ0FBQztLQUFBO0lBQ0ssTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXOztZQUM5QixPQUFPLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3pELENBQUM7S0FBQTtJQUNLLFVBQVUsQ0FBQyxVQUFVLEVBQUUsV0FBVzs7WUFDcEMsT0FBTyxJQUFBLHVCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDL0QsQ0FBQztLQUFBO0lBQ0ssV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJOztZQUM1QixPQUFPLElBQUEseUJBQVcsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2RCxDQUFDO0tBQUE7SUFDSyxJQUFJLENBQUMsSUFBSTs7WUFDWCxPQUFPLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEMsQ0FBQztLQUFBO0lBQ0ssS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsV0FBVzs7WUFDcEMsT0FBTyxJQUFBLGFBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDL0QsQ0FBQztLQUFBO0NBRUo7QUFyQ0Qsd0JBcUNDIn0=