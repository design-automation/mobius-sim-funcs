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
exports.MaterialFunc = exports.Physical = exports.Standard = exports.Phong = exports.Lambert = exports.Glass = exports.MeshMat = exports.LineMat = exports.Set = void 0;
const Enum = __importStar(require("./_enum"));
const Glass_1 = require("./Glass");
Object.defineProperty(exports, "Glass", { enumerable: true, get: function () { return Glass_1.Glass; } });
const Lambert_1 = require("./Lambert");
Object.defineProperty(exports, "Lambert", { enumerable: true, get: function () { return Lambert_1.Lambert; } });
const LineMat_1 = require("./LineMat");
Object.defineProperty(exports, "LineMat", { enumerable: true, get: function () { return LineMat_1.LineMat; } });
const MeshMat_1 = require("./MeshMat");
Object.defineProperty(exports, "MeshMat", { enumerable: true, get: function () { return MeshMat_1.MeshMat; } });
const Phong_1 = require("./Phong");
Object.defineProperty(exports, "Phong", { enumerable: true, get: function () { return Phong_1.Phong; } });
const Physical_1 = require("./Physical");
Object.defineProperty(exports, "Physical", { enumerable: true, get: function () { return Physical_1.Physical; } });
const Set_1 = require("./Set");
Object.defineProperty(exports, "Set", { enumerable: true, get: function () { return Set_1.Set; } });
const Standard_1 = require("./Standard");
Object.defineProperty(exports, "Standard", { enumerable: true, get: function () { return Standard_1.Standard; } });
// CLASS DEFINITION
class MaterialFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    Glass(name, opacity) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Glass_1.Glass)(this.__model__, name, opacity);
        });
    }
    Lambert(name, emissive) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Lambert_1.Lambert)(this.__model__, name, emissive);
        });
    }
    LineMat(name, color, dash_gap_scale, select_vert_colors) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, LineMat_1.LineMat)(this.__model__, name, color, dash_gap_scale, select_vert_colors);
        });
    }
    MeshMat(name, color, opacity, select_side, select_vert_colors) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, MeshMat_1.MeshMat)(this.__model__, name, color, opacity, select_side, select_vert_colors);
        });
    }
    Phong(name, emissive, specular, shininess) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Phong_1.Phong)(this.__model__, name, emissive, specular, shininess);
        });
    }
    Physical(name, emissive, roughness, metalness, reflectivity) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Physical_1.Physical)(this.__model__, name, emissive, roughness, metalness, reflectivity);
        });
    }
    Set(entities, material) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Set_1.Set)(this.__model__, entities, material);
        });
    }
    Standard(name, emissive, roughness, metalness) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Standard_1.Standard)(this.__model__, name, emissive, roughness, metalness);
        });
    }
}
exports.MaterialFunc = MaterialFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvbWF0ZXJpYWwvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFBLDhDQUFnQztBQUNoQyxtQ0FBZ0M7QUFZdkIsc0ZBWkEsYUFBSyxPQVlBO0FBWGQsdUNBQW9DO0FBWTNCLHdGQVpBLGlCQUFPLE9BWUE7QUFYaEIsdUNBQW9DO0FBUTNCLHdGQVJBLGlCQUFPLE9BUUE7QUFQaEIsdUNBQW9DO0FBUTNCLHdGQVJBLGlCQUFPLE9BUUE7QUFQaEIsbUNBQWdDO0FBVXZCLHNGQVZBLGFBQUssT0FVQTtBQVRkLHlDQUFzQztBQVc3Qix5RkFYQSxtQkFBUSxPQVdBO0FBVmpCLCtCQUE0QjtBQUduQixvRkFIQSxTQUFHLE9BR0E7QUFGWix5Q0FBc0M7QUFRN0IseUZBUkEsbUJBQVEsT0FRQTtBQUdqQixtQkFBbUI7QUFDbkIsTUFBYSxZQUFZO0lBTXJCLFlBQVksS0FBYztRQUwxQixhQUFRLHFCQUNELElBQUksRUFDVjtRQUlHLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDSyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU87O1lBQ3JCLElBQUEsYUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLENBQUM7S0FBQTtJQUNLLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUTs7WUFDeEIsSUFBQSxpQkFBTyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLENBQUM7S0FBQTtJQUNLLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxrQkFBa0I7O1lBQ3pELElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDN0UsQ0FBQztLQUFBO0lBQ0ssT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxrQkFBa0I7O1lBQy9ELElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25GLENBQUM7S0FBQTtJQUNLLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTOztZQUMzQyxJQUFBLGFBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQy9ELENBQUM7S0FBQTtJQUNLLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsWUFBWTs7WUFDN0QsSUFBQSxtQkFBUSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ2pGLENBQUM7S0FBQTtJQUNLLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUTs7WUFDeEIsSUFBQSxTQUFHLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDNUMsQ0FBQztLQUFBO0lBQ0ssUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVM7O1lBQy9DLElBQUEsbUJBQVEsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25FLENBQUM7S0FBQTtDQUVKO0FBbENELG9DQWtDQyJ9