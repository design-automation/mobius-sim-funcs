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
        (0, Glass_1.Glass)(this.__model__, name, opacity);
    }
    Lambert(name, emissive) {
        (0, Lambert_1.Lambert)(this.__model__, name, emissive);
    }
    LineMat(name, color, dash_gap_scale, select_vert_colors) {
        (0, LineMat_1.LineMat)(this.__model__, name, color, dash_gap_scale, select_vert_colors);
    }
    MeshMat(name, color, opacity, select_side, select_vert_colors) {
        (0, MeshMat_1.MeshMat)(this.__model__, name, color, opacity, select_side, select_vert_colors);
    }
    Phong(name, emissive, specular, shininess) {
        (0, Phong_1.Phong)(this.__model__, name, emissive, specular, shininess);
    }
    Physical(name, emissive, roughness, metalness, reflectivity) {
        (0, Physical_1.Physical)(this.__model__, name, emissive, roughness, metalness, reflectivity);
    }
    Set(entities, material) {
        (0, Set_1.Set)(this.__model__, entities, material);
    }
    Standard(name, emissive, roughness, metalness) {
        (0, Standard_1.Standard)(this.__model__, name, emissive, roughness, metalness);
    }
}
exports.MaterialFunc = MaterialFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvbWF0ZXJpYWwvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRQSw4Q0FBZ0M7QUFDaEMsbUNBQWdDO0FBWXZCLHNGQVpBLGFBQUssT0FZQTtBQVhkLHVDQUFvQztBQVkzQix3RkFaQSxpQkFBTyxPQVlBO0FBWGhCLHVDQUFvQztBQVEzQix3RkFSQSxpQkFBTyxPQVFBO0FBUGhCLHVDQUFvQztBQVEzQix3RkFSQSxpQkFBTyxPQVFBO0FBUGhCLG1DQUFnQztBQVV2QixzRkFWQSxhQUFLLE9BVUE7QUFUZCx5Q0FBc0M7QUFXN0IseUZBWEEsbUJBQVEsT0FXQTtBQVZqQiwrQkFBNEI7QUFHbkIsb0ZBSEEsU0FBRyxPQUdBO0FBRloseUNBQXNDO0FBUTdCLHlGQVJBLG1CQUFRLE9BUUE7QUFHakIsbUJBQW1CO0FBQ25CLE1BQWEsWUFBWTtJQU1yQixZQUFZLEtBQWM7UUFMMUIsYUFBUSxxQkFDRCxJQUFJLEVBQ1Y7UUFJRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPO1FBQ2YsSUFBQSxhQUFLLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUNELE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUTtRQUNsQixJQUFBLGlCQUFPLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxrQkFBa0I7UUFDbkQsSUFBQSxpQkFBTyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBQ0QsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxrQkFBa0I7UUFDekQsSUFBQSxpQkFBTyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUNELEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTO1FBQ3JDLElBQUEsYUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUNELFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsWUFBWTtRQUN2RCxJQUFBLG1CQUFRLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDakYsQ0FBQztJQUNELEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUTtRQUNsQixJQUFBLFNBQUcsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQ0QsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVM7UUFDekMsSUFBQSxtQkFBUSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbkUsQ0FBQztDQUVKO0FBbENELG9DQWtDQyJ9