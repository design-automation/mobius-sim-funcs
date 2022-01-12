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
class PatternFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    Line(origin, length, num_positions) {
        return (0, Line_1.Line)(this.__model__, origin, length, num_positions);
    }
    Linear(coords, close, num_positions) {
        return (0, Linear_1.Linear)(this.__model__, coords, close, num_positions);
    }
    Rectangle(origin, size) {
        return (0, Rectangle_1.Rectangle)(this.__model__, origin, size);
    }
    Grid(origin, size, num_positions, method) {
        return (0, Grid_1.Grid)(this.__model__, origin, size, num_positions, method);
    }
    Box(origin, size, num_positions, method) {
        return (0, Box_1.Box)(this.__model__, origin, size, num_positions, method);
    }
    Polyhedron(origin, radius, detail, method) {
        return (0, Polyhedron_1.Polyhedron)(this.__model__, origin, radius, detail, method);
    }
    Arc(origin, radius, num_positions, arc_angle) {
        return (0, Arc_1.Arc)(this.__model__, origin, radius, num_positions, arc_angle);
    }
    Bezier(coords, num_positions) {
        return (0, Bezier_1.Bezier)(this.__model__, coords, num_positions);
    }
    Nurbs(coords, degree, close, num_positions) {
        return (0, Nurbs_1.Nurbs)(this.__model__, coords, degree, close, num_positions);
    }
    Interpolate(coords, type, tension, close, num_positions) {
        return (0, Interpolate_1.Interpolate)(this.__model__, coords, type, tension, close, num_positions);
    }
}
exports.PatternFunc = PatternFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvcGF0dGVybi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsOENBQWdDO0FBQ2hDLCtCQUE0QjtBQWlCbkIsb0ZBakJBLFNBQUcsT0FpQkE7QUFoQloscUNBQWtDO0FBaUJ6Qix1RkFqQkEsZUFBTSxPQWlCQTtBQWhCZiwrQkFBNEI7QUFhbkIsb0ZBYkEsU0FBRyxPQWFBO0FBWlosaUNBQThCO0FBV3JCLHFGQVhBLFdBQUksT0FXQTtBQVZiLCtDQUE0QztBQWdCbkMsNEZBaEJBLHlCQUFXLE9BZ0JBO0FBZnBCLGlDQUE4QjtBQU1yQixxRkFOQSxXQUFJLE9BTUE7QUFMYixxQ0FBa0M7QUFNekIsdUZBTkEsZUFBTSxPQU1BO0FBTGYsbUNBQWdDO0FBWXZCLHNGQVpBLGFBQUssT0FZQTtBQVhkLDZDQUEwQztBQVFqQywyRkFSQSx1QkFBVSxPQVFBO0FBUG5CLDJDQUF3QztBQUkvQiwwRkFKQSxxQkFBUyxPQUlBO0FBUWxCLE1BQWEsV0FBVztJQUtwQixZQUFZLEtBQWM7UUFIMUIsYUFBUSxxQkFDRCxJQUFJLEVBQ1Y7UUFFRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsYUFBYTtRQUM5QixPQUFPLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYTtRQUMvQixPQUFPLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBQ0QsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJO1FBQ2xCLE9BQU8sSUFBQSxxQkFBUyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFDRCxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsTUFBTTtRQUNwQyxPQUFPLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUNELEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNO1FBQ25DLE9BQU8sSUFBQSxTQUFHLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBQ0QsVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU07UUFDckMsT0FBTyxJQUFBLHVCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBQ0QsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLFNBQVM7UUFDeEMsT0FBTyxJQUFBLFNBQUcsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFDRCxNQUFNLENBQUMsTUFBTSxFQUFFLGFBQWE7UUFDeEIsT0FBTyxJQUFBLGVBQU0sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBQ0QsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLGFBQWE7UUFDdEMsT0FBTyxJQUFBLGFBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFDRCxXQUFXLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLGFBQWE7UUFDbkQsT0FBTyxJQUFBLHlCQUFXLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDcEYsQ0FBQztDQUNKO0FBdENELGtDQXNDQyJ9