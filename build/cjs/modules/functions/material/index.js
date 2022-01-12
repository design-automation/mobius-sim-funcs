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
class MaterialFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    Set(entities, material) {
        return (0, Set_1.Set)(this.__model__, entities, material);
    }
    LineMat(name, color, dash_gap_scale, select_vert_colors) {
        return (0, LineMat_1.LineMat)(this.__model__, name, color, dash_gap_scale, select_vert_colors);
    }
    MeshMat(name, color, opacity, select_side, select_vert_colors) {
        return (0, MeshMat_1.MeshMat)(this.__model__, name, color, opacity, select_side, select_vert_colors);
    }
    Glass(name, opacity) {
        return (0, Glass_1.Glass)(this.__model__, name, opacity);
    }
    Lambert(name, emissive) {
        return (0, Lambert_1.Lambert)(this.__model__, name, emissive);
    }
    Phong(name, emissive, specular, shininess) {
        return (0, Phong_1.Phong)(this.__model__, name, emissive, specular, shininess);
    }
    Standard(name, emissive, roughness, metalness) {
        return (0, Standard_1.Standard)(this.__model__, name, emissive, roughness, metalness);
    }
    Physical(name, emissive, roughness, metalness, reflectivity) {
        return (0, Physical_1.Physical)(this.__model__, name, emissive, roughness, metalness, reflectivity);
    }
}
exports.MaterialFunc = MaterialFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvbWF0ZXJpYWwvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLDhDQUFnQztBQUNoQyxtQ0FBZ0M7QUFZdkIsc0ZBWkEsYUFBSyxPQVlBO0FBWGQsdUNBQW9DO0FBWTNCLHdGQVpBLGlCQUFPLE9BWUE7QUFYaEIsdUNBQW9DO0FBUTNCLHdGQVJBLGlCQUFPLE9BUUE7QUFQaEIsdUNBQW9DO0FBUTNCLHdGQVJBLGlCQUFPLE9BUUE7QUFQaEIsbUNBQWdDO0FBVXZCLHNGQVZBLGFBQUssT0FVQTtBQVRkLHlDQUFzQztBQVc3Qix5RkFYQSxtQkFBUSxPQVdBO0FBVmpCLCtCQUE0QjtBQUduQixvRkFIQSxTQUFHLE9BR0E7QUFGWix5Q0FBc0M7QUFRN0IseUZBUkEsbUJBQVEsT0FRQTtBQUVqQixNQUFhLFlBQVk7SUFLckIsWUFBWSxLQUFjO1FBSDFCLGFBQVEscUJBQ0QsSUFBSSxFQUNWO1FBRUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNELEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUTtRQUNsQixPQUFPLElBQUEsU0FBRyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFDRCxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsa0JBQWtCO1FBQ25ELE9BQU8sSUFBQSxpQkFBTyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBQ0QsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxrQkFBa0I7UUFDekQsT0FBTyxJQUFBLGlCQUFPLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUMxRixDQUFDO0lBQ0QsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPO1FBQ2YsT0FBTyxJQUFBLGFBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRO1FBQ2xCLE9BQU8sSUFBQSxpQkFBTyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFDRCxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUztRQUNyQyxPQUFPLElBQUEsYUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUNELFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTO1FBQ3pDLE9BQU8sSUFBQSxtQkFBUSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUNELFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsWUFBWTtRQUN2RCxPQUFPLElBQUEsbUJBQVEsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUN4RixDQUFDO0NBQ0o7QUFoQ0Qsb0NBZ0NDIn0=