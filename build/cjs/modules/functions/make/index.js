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
exports.MakeFunc = exports.Clone = exports.Copy = exports.Cut = exports.Join = exports.Sweep = exports.Extrude = exports.Loft = exports.Polygon = exports.Polyline = exports.Point = exports.Position = void 0;
const Enum = __importStar(require("./_enum"));
const Clone_1 = require("./Clone");
Object.defineProperty(exports, "Clone", { enumerable: true, get: function () { return Clone_1.Clone; } });
const Copy_1 = require("./Copy");
Object.defineProperty(exports, "Copy", { enumerable: true, get: function () { return Copy_1.Copy; } });
const Cut_1 = require("./Cut");
Object.defineProperty(exports, "Cut", { enumerable: true, get: function () { return Cut_1.Cut; } });
const Extrude_1 = require("./Extrude");
Object.defineProperty(exports, "Extrude", { enumerable: true, get: function () { return Extrude_1.Extrude; } });
const Join_1 = require("./Join");
Object.defineProperty(exports, "Join", { enumerable: true, get: function () { return Join_1.Join; } });
const Loft_1 = require("./Loft");
Object.defineProperty(exports, "Loft", { enumerable: true, get: function () { return Loft_1.Loft; } });
const Point_1 = require("./Point");
Object.defineProperty(exports, "Point", { enumerable: true, get: function () { return Point_1.Point; } });
const Polygon_1 = require("./Polygon");
Object.defineProperty(exports, "Polygon", { enumerable: true, get: function () { return Polygon_1.Polygon; } });
const Polyline_1 = require("./Polyline");
Object.defineProperty(exports, "Polyline", { enumerable: true, get: function () { return Polyline_1.Polyline; } });
const Position_1 = require("./Position");
Object.defineProperty(exports, "Position", { enumerable: true, get: function () { return Position_1.Position; } });
const Sweep_1 = require("./Sweep");
Object.defineProperty(exports, "Sweep", { enumerable: true, get: function () { return Sweep_1.Sweep; } });
// CLASS DEFINITION
class MakeFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    Clone(entities) {
        return (0, Clone_1.Clone)(this.__model__, entities);
    }
    Copy(entities, vector) {
        return (0, Copy_1.Copy)(this.__model__, entities, vector);
    }
    Cut(entities, plane, method) {
        return (0, Cut_1.Cut)(this.__model__, entities, plane, method);
    }
    Extrude(entities, dist, divisions, method) {
        return (0, Extrude_1.Extrude)(this.__model__, entities, dist, divisions, method);
    }
    Join(entities) {
        return (0, Join_1.Join)(this.__model__, entities);
    }
    Loft(entities, divisions, method) {
        return (0, Loft_1.Loft)(this.__model__, entities, divisions, method);
    }
    Point(entities) {
        return (0, Point_1.Point)(this.__model__, entities);
    }
    Polygon(entities) {
        return (0, Polygon_1.Polygon)(this.__model__, entities);
    }
    Polyline(entities, close) {
        return (0, Polyline_1.Polyline)(this.__model__, entities, close);
    }
    Position(coords) {
        return (0, Position_1.Position)(this.__model__, coords);
    }
    Sweep(entities, x_section, divisions, method) {
        return (0, Sweep_1.Sweep)(this.__model__, entities, x_section, divisions, method);
    }
}
exports.MakeFunc = MakeFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvbWFrZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT0EsOENBQWdDO0FBQ2hDLG1DQUFnQztBQXNCdkIsc0ZBdEJBLGFBQUssT0FzQkE7QUFyQmQsaUNBQThCO0FBb0JyQixxRkFwQkEsV0FBSSxPQW9CQTtBQW5CYiwrQkFBNEI7QUFrQm5CLG9GQWxCQSxTQUFHLE9Ba0JBO0FBakJaLHVDQUFvQztBQWMzQix3RkFkQSxpQkFBTyxPQWNBO0FBYmhCLGlDQUE4QjtBQWVyQixxRkFmQSxXQUFJLE9BZUE7QUFkYixpQ0FBOEI7QUFXckIscUZBWEEsV0FBSSxPQVdBO0FBVmIsbUNBQWdDO0FBT3ZCLHNGQVBBLGFBQUssT0FPQTtBQU5kLHVDQUFvQztBQVEzQix3RkFSQSxpQkFBTyxPQVFBO0FBUGhCLHlDQUFzQztBQU03Qix5RkFOQSxtQkFBUSxPQU1BO0FBTGpCLHlDQUFzQztBQUc3Qix5RkFIQSxtQkFBUSxPQUdBO0FBRmpCLG1DQUFnQztBQVF2QixzRkFSQSxhQUFLLE9BUUE7QUFPZCxtQkFBbUI7QUFDbkIsTUFBYSxRQUFRO0lBTWpCLFlBQVksS0FBYztRQUwxQixhQUFRLHFCQUNELElBQUksRUFDVjtRQUlHLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxLQUFLLENBQUMsUUFBUTtRQUNWLE9BQU8sSUFBQSxhQUFLLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNO1FBQ2pCLE9BQU8sSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNELEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU07UUFDdkIsT0FBTyxJQUFBLFNBQUcsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUNELE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNO1FBQ3JDLE9BQU8sSUFBQSxpQkFBTyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUNELElBQUksQ0FBQyxRQUFRO1FBQ1QsT0FBTyxJQUFBLFdBQUksRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNO1FBQzVCLE9BQU8sSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFDRCxLQUFLLENBQUMsUUFBUTtRQUNWLE9BQU8sSUFBQSxhQUFLLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBQ0QsT0FBTyxDQUFDLFFBQVE7UUFDWixPQUFPLElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFDRCxRQUFRLENBQUMsUUFBUSxFQUFFLEtBQUs7UUFDcEIsT0FBTyxJQUFBLG1CQUFRLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNELFFBQVEsQ0FBQyxNQUFNO1FBQ1gsT0FBTyxJQUFBLG1CQUFRLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQ0QsS0FBSyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU07UUFDeEMsT0FBTyxJQUFBLGFBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3pFLENBQUM7Q0FFSjtBQTNDRCw0QkEyQ0MifQ==