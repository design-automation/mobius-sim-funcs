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
exports.VisualizeFunc = exports.BBox = exports.Plane = exports.Ray = exports.Mesh = exports.Edge = exports.Gradient = exports.Color = void 0;
const Enum = __importStar(require("./_enum"));
const BBox_1 = require("./BBox");
Object.defineProperty(exports, "BBox", { enumerable: true, get: function () { return BBox_1.BBox; } });
const Color_1 = require("./Color");
Object.defineProperty(exports, "Color", { enumerable: true, get: function () { return Color_1.Color; } });
const Edge_1 = require("./Edge");
Object.defineProperty(exports, "Edge", { enumerable: true, get: function () { return Edge_1.Edge; } });
const Gradient_1 = require("./Gradient");
Object.defineProperty(exports, "Gradient", { enumerable: true, get: function () { return Gradient_1.Gradient; } });
const Mesh_1 = require("./Mesh");
Object.defineProperty(exports, "Mesh", { enumerable: true, get: function () { return Mesh_1.Mesh; } });
const Plane_1 = require("./Plane");
Object.defineProperty(exports, "Plane", { enumerable: true, get: function () { return Plane_1.Plane; } });
const Ray_1 = require("./Ray");
Object.defineProperty(exports, "Ray", { enumerable: true, get: function () { return Ray_1.Ray; } });
// CLASS DEFINITION
class VisualizeFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    BBox(bboxes) {
        return (0, BBox_1.BBox)(this.__model__, bboxes);
    }
    Color(entities, color) {
        (0, Color_1.Color)(this.__model__, entities, color);
    }
    Edge(entities, method) {
        (0, Edge_1.Edge)(this.__model__, entities, method);
    }
    Gradient(entities, attrib, range, method) {
        (0, Gradient_1.Gradient)(this.__model__, entities, attrib, range, method);
    }
    Mesh(entities, method) {
        (0, Mesh_1.Mesh)(this.__model__, entities, method);
    }
    Plane(planes, scale) {
        return (0, Plane_1.Plane)(this.__model__, planes, scale);
    }
    Ray(rays, scale) {
        return (0, Ray_1.Ray)(this.__model__, rays, scale);
    }
}
exports.VisualizeFunc = VisualizeFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvdmlzdWFsaXplL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQSw4Q0FBZ0M7QUFDaEMsaUNBQThCO0FBY3JCLHFGQWRBLFdBQUksT0FjQTtBQWJiLG1DQUFnQztBQU92QixzRkFQQSxhQUFLLE9BT0E7QUFOZCxpQ0FBOEI7QUFRckIscUZBUkEsV0FBSSxPQVFBO0FBUGIseUNBQXNDO0FBTTdCLHlGQU5BLG1CQUFRLE9BTUE7QUFMakIsaUNBQThCO0FBT3JCLHFGQVBBLFdBQUksT0FPQTtBQU5iLG1DQUFnQztBQVF2QixzRkFSQSxhQUFLLE9BUUE7QUFQZCwrQkFBNEI7QUFNbkIsb0ZBTkEsU0FBRyxPQU1BO0FBSVosbUJBQW1CO0FBQ25CLE1BQWEsYUFBYTtJQU10QixZQUFZLEtBQWM7UUFMMUIsYUFBUSxxQkFDRCxJQUFJLEVBQ1Y7UUFJRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsSUFBSSxDQUFDLE1BQU07UUFDUCxPQUFPLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUNELEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSztRQUNqQixJQUFBLGFBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNO1FBQ2pCLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDRCxRQUFRLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTTtRQUNwQyxJQUFBLG1CQUFRLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNO1FBQ2pCLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDRCxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUs7UUFDZixPQUFPLElBQUEsYUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDRCxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUs7UUFDWCxPQUFPLElBQUEsU0FBRyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVDLENBQUM7Q0FFSjtBQS9CRCxzQ0ErQkMifQ==