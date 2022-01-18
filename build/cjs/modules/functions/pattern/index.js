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
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Arc_1.Arc)(this.__model__, origin, radius, num_positions, arc_angle);
        });
    }
    Bezier(coords, num_positions) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Bezier_1.Bezier)(this.__model__, coords, num_positions);
        });
    }
    Box(origin, size, num_positions, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Box_1.Box)(this.__model__, origin, size, num_positions, method);
        });
    }
    Grid(origin, size, num_positions, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Grid_1.Grid)(this.__model__, origin, size, num_positions, method);
        });
    }
    Interpolate(coords, type, tension, close, num_positions) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Interpolate_1.Interpolate)(this.__model__, coords, type, tension, close, num_positions);
        });
    }
    Line(origin, length, num_positions) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Line_1.Line)(this.__model__, origin, length, num_positions);
        });
    }
    Linear(coords, close, num_positions) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Linear_1.Linear)(this.__model__, coords, close, num_positions);
        });
    }
    Nurbs(coords, degree, close, num_positions) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Nurbs_1.Nurbs)(this.__model__, coords, degree, close, num_positions);
        });
    }
    Polyhedron(origin, radius, detail, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Polyhedron_1.Polyhedron)(this.__model__, origin, radius, detail, method);
        });
    }
    Rectangle(origin, size) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Rectangle_1.Rectangle)(this.__model__, origin, size);
        });
    }
}
exports.PatternFunc = PatternFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvcGF0dGVybi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUEsOENBQWdDO0FBQ2hDLCtCQUE0QjtBQWlCbkIsb0ZBakJBLFNBQUcsT0FpQkE7QUFoQloscUNBQWtDO0FBaUJ6Qix1RkFqQkEsZUFBTSxPQWlCQTtBQWhCZiwrQkFBNEI7QUFhbkIsb0ZBYkEsU0FBRyxPQWFBO0FBWlosaUNBQThCO0FBV3JCLHFGQVhBLFdBQUksT0FXQTtBQVZiLCtDQUE0QztBQWdCbkMsNEZBaEJBLHlCQUFXLE9BZ0JBO0FBZnBCLGlDQUE4QjtBQU1yQixxRkFOQSxXQUFJLE9BTUE7QUFMYixxQ0FBa0M7QUFNekIsdUZBTkEsZUFBTSxPQU1BO0FBTGYsbUNBQWdDO0FBWXZCLHNGQVpBLGFBQUssT0FZQTtBQVhkLDZDQUEwQztBQVFqQywyRkFSQSx1QkFBVSxPQVFBO0FBUG5CLDJDQUF3QztBQUkvQiwwRkFKQSxxQkFBUyxPQUlBO0FBU2xCLG1CQUFtQjtBQUNuQixNQUFhLFdBQVc7SUFNcEIsWUFBWSxLQUFjO1FBTDFCLGFBQVEscUJBQ0QsSUFBSSxFQUNWO1FBSUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNLLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxTQUFTOztZQUM5QyxPQUFPLElBQUEsU0FBRyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDekUsQ0FBQztLQUFBO0lBQ0ssTUFBTSxDQUFDLE1BQU0sRUFBRSxhQUFhOztZQUM5QixPQUFPLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3pELENBQUM7S0FBQTtJQUNLLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNOztZQUN6QyxPQUFPLElBQUEsU0FBRyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEUsQ0FBQztLQUFBO0lBQ0ssSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE1BQU07O1lBQzFDLE9BQU8sSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNyRSxDQUFDO0tBQUE7SUFDSyxXQUFXLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLGFBQWE7O1lBQ3pELE9BQU8sSUFBQSx5QkFBVyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3BGLENBQUM7S0FBQTtJQUNLLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLGFBQWE7O1lBQ3BDLE9BQU8sSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQy9ELENBQUM7S0FBQTtJQUNLLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLGFBQWE7O1lBQ3JDLE9BQU8sSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7S0FBQTtJQUNLLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxhQUFhOztZQUM1QyxPQUFPLElBQUEsYUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDdkUsQ0FBQztLQUFBO0lBQ0ssVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU07O1lBQzNDLE9BQU8sSUFBQSx1QkFBVSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdEUsQ0FBQztLQUFBO0lBQ0ssU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJOztZQUN4QixPQUFPLElBQUEscUJBQVMsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuRCxDQUFDO0tBQUE7Q0FFSjtBQXhDRCxrQ0F3Q0MifQ==