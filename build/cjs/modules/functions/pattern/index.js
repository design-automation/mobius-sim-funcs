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
exports.PatternFunc = exports.Interpolate = exports.Nurbs = exports.Bezier = exports.Arc = exports.Polyhedron = exports.Box = exports.Grid = exports.Rectangle = exports.Linear = exports.Line = void 0;
const Enum = __importStar(require("./_enum"));
const Arc_1 = require("./Arc");
Object.defineProperty(exports, "Arc", { enumerable: true, get: function () { return Arc_1.Arc; } });
const Bezier_1 = require("./Bezier");
Object.defineProperty(exports, "Bezier", { enumerable: true, get: function () { return Bezier_1.Bezier; } });
const Box_1 = require("./Box");
Object.defineProperty(exports, "Box", { enumerable: true, get: function () { return Box_1.Box; } });
const Grid_1 = require("./Grid");
Object.defineProperty(exports, "Grid", { enumerable: true, get: function () { return Grid_1.Grid; } });
const Interpolate_1 = require("./Interpolate");
Object.defineProperty(exports, "Interpolate", { enumerable: true, get: function () { return Interpolate_1.Interpolate; } });
const Line_1 = require("./Line");
Object.defineProperty(exports, "Line", { enumerable: true, get: function () { return Line_1.Line; } });
const Linear_1 = require("./Linear");
Object.defineProperty(exports, "Linear", { enumerable: true, get: function () { return Linear_1.Linear; } });
const Nurbs_1 = require("./Nurbs");
Object.defineProperty(exports, "Nurbs", { enumerable: true, get: function () { return Nurbs_1.Nurbs; } });
const Polyhedron_1 = require("./Polyhedron");
Object.defineProperty(exports, "Polyhedron", { enumerable: true, get: function () { return Polyhedron_1.Polyhedron; } });
const Rectangle_1 = require("./Rectangle");
Object.defineProperty(exports, "Rectangle", { enumerable: true, get: function () { return Rectangle_1.Rectangle; } });
// CLASS DEFINITION
class PatternFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    Arc(origin, radius, num_positions, arc_angle) {
        return (0, Arc_1.Arc)(this.__model__, origin, radius, num_positions, arc_angle);
    }
    Bezier(coords, num_positions) {
        return (0, Bezier_1.Bezier)(this.__model__, coords, num_positions);
    }
    Box(origin, size, num_positions, method) {
        return (0, Box_1.Box)(this.__model__, origin, size, num_positions, method);
    }
    Grid(origin, size, num_positions, method) {
        return (0, Grid_1.Grid)(this.__model__, origin, size, num_positions, method);
    }
    Interpolate(coords, type, tension, close, num_positions) {
        return (0, Interpolate_1.Interpolate)(this.__model__, coords, type, tension, close, num_positions);
    }
    Line(origin, length, num_positions) {
        return (0, Line_1.Line)(this.__model__, origin, length, num_positions);
    }
    Linear(coords, close, num_positions) {
        return (0, Linear_1.Linear)(this.__model__, coords, close, num_positions);
    }
    Nurbs(coords, degree, close, num_positions) {
        return (0, Nurbs_1.Nurbs)(this.__model__, coords, degree, close, num_positions);
    }
    Polyhedron(origin, radius, detail, method) {
        return (0, Polyhedron_1.Polyhedron)(this.__model__, origin, radius, detail, method);
    }
    Rectangle(origin, size) {
        return (0, Rectangle_1.Rectangle)(this.__model__, origin, size);
    }
}
exports.PatternFunc = PatternFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvcGF0dGVybi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFBLDhDQUFnQztBQUNoQywrQkFBNEI7QUFpQm5CLG9GQWpCQSxTQUFHLE9BaUJBO0FBaEJaLHFDQUFrQztBQWlCekIsdUZBakJBLGVBQU0sT0FpQkE7QUFoQmYsK0JBQTRCO0FBYW5CLG9GQWJBLFNBQUcsT0FhQTtBQVpaLGlDQUE4QjtBQVdyQixxRkFYQSxXQUFJLE9BV0E7QUFWYiwrQ0FBNEM7QUFnQm5DLDRGQWhCQSx5QkFBVyxPQWdCQTtBQWZwQixpQ0FBOEI7QUFNckIscUZBTkEsV0FBSSxPQU1BO0FBTGIscUNBQWtDO0FBTXpCLHVGQU5BLGVBQU0sT0FNQTtBQUxmLG1DQUFnQztBQVl2QixzRkFaQSxhQUFLLE9BWUE7QUFYZCw2Q0FBMEM7QUFRakMsMkZBUkEsdUJBQVUsT0FRQTtBQVBuQiwyQ0FBd0M7QUFJL0IsMEZBSkEscUJBQVMsT0FJQTtBQVNsQixtQkFBbUI7QUFDbkIsTUFBYSxXQUFXO0lBTXBCLFlBQVksS0FBYztRQUwxQixhQUFRLHFCQUNELElBQUksRUFDVjtRQUlHLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsU0FBUztRQUN4QyxPQUFPLElBQUEsU0FBRyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLEVBQUUsYUFBYTtRQUN4QixPQUFPLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDRCxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsTUFBTTtRQUNuQyxPQUFPLElBQUEsU0FBRyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUNELElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNO1FBQ3BDLE9BQU8sSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBQ0QsV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxhQUFhO1FBQ25ELE9BQU8sSUFBQSx5QkFBVyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFDRCxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxhQUFhO1FBQzlCLE9BQU8sSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFDRCxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxhQUFhO1FBQy9CLE9BQU8sSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFDRCxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYTtRQUN0QyxPQUFPLElBQUEsYUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUNELFVBQVUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO1FBQ3JDLE9BQU8sSUFBQSx1QkFBVSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUNELFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSTtRQUNsQixPQUFPLElBQUEscUJBQVMsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBRUo7QUF4Q0Qsa0NBd0NDIn0=