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
exports.CalcFunc = exports.BBox = exports.Plane = exports.Ray = exports.Eval = exports.Normal = exports.Centroid = exports.Vector = exports.Area = exports.Length = exports.Distance = void 0;
const Enum = __importStar(require("./_enum"));
const Area_1 = require("./Area");
Object.defineProperty(exports, "Area", { enumerable: true, get: function () { return Area_1.Area; } });
const BBox_1 = require("./BBox");
Object.defineProperty(exports, "BBox", { enumerable: true, get: function () { return BBox_1.BBox; } });
const Centroid_1 = require("./Centroid");
Object.defineProperty(exports, "Centroid", { enumerable: true, get: function () { return Centroid_1.Centroid; } });
const Distance_1 = require("./Distance");
Object.defineProperty(exports, "Distance", { enumerable: true, get: function () { return Distance_1.Distance; } });
const Eval_1 = require("./Eval");
Object.defineProperty(exports, "Eval", { enumerable: true, get: function () { return Eval_1.Eval; } });
const Length_1 = require("./Length");
Object.defineProperty(exports, "Length", { enumerable: true, get: function () { return Length_1.Length; } });
const Normal_1 = require("./Normal");
Object.defineProperty(exports, "Normal", { enumerable: true, get: function () { return Normal_1.Normal; } });
const Plane_1 = require("./Plane");
Object.defineProperty(exports, "Plane", { enumerable: true, get: function () { return Plane_1.Plane; } });
const Ray_1 = require("./Ray");
Object.defineProperty(exports, "Ray", { enumerable: true, get: function () { return Ray_1.Ray; } });
const Vector_1 = require("./Vector");
Object.defineProperty(exports, "Vector", { enumerable: true, get: function () { return Vector_1.Vector; } });
class CalcFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    Distance(entities1, entities2, method) {
        return (0, Distance_1.Distance)(this.__model__, entities1, entities2, method);
    }
    Length(entities) {
        return (0, Length_1.Length)(this.__model__, entities);
    }
    Area(entities) {
        return (0, Area_1.Area)(this.__model__, entities);
    }
    Vector(entities) {
        return (0, Vector_1.Vector)(this.__model__, entities);
    }
    Centroid(entities, method) {
        return (0, Centroid_1.Centroid)(this.__model__, entities, method);
    }
    Normal(entities, scale) {
        return (0, Normal_1.Normal)(this.__model__, entities, scale);
    }
    Eval(entities, t_param) {
        return (0, Eval_1.Eval)(this.__model__, entities, t_param);
    }
    Ray(entities) {
        return (0, Ray_1.Ray)(this.__model__, entities);
    }
    Plane(entities) {
        return (0, Plane_1.Plane)(this.__model__, entities);
    }
    BBox(entities) {
        return (0, BBox_1.BBox)(this.__model__, entities);
    }
}
exports.CalcFunc = CalcFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvY2FsYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUEsOENBQWdDO0FBQ2hDLGlDQUE4QjtBQWVyQixxRkFmQSxXQUFJLE9BZUE7QUFkYixpQ0FBOEI7QUE0QnJCLHFGQTVCQSxXQUFJLE9BNEJBO0FBM0JiLHlDQUFzQztBQWlCN0IseUZBakJBLG1CQUFRLE9BaUJBO0FBaEJqQix5Q0FBc0M7QUFRN0IseUZBUkEsbUJBQVEsT0FRQTtBQVBqQixpQ0FBOEI7QUFtQnJCLHFGQW5CQSxXQUFJLE9BbUJBO0FBbEJiLHFDQUFrQztBQVF6Qix1RkFSQSxlQUFNLE9BUUE7QUFQZixxQ0FBa0M7QUFlekIsdUZBZkEsZUFBTSxPQWVBO0FBZGYsbUNBQWdDO0FBb0J2QixzRkFwQkEsYUFBSyxPQW9CQTtBQW5CZCwrQkFBNEI7QUFpQm5CLG9GQWpCQSxTQUFHLE9BaUJBO0FBaEJaLHFDQUFrQztBQVF6Qix1RkFSQSxlQUFNLE9BUUE7QUFjZixNQUFhLFFBQVE7SUFLakIsWUFBWSxLQUFjO1FBSDFCLGFBQVEscUJBQ0QsSUFBSSxFQUNWO1FBRUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNELFFBQVEsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU07UUFDakMsT0FBTyxJQUFBLG1CQUFRLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFDRCxNQUFNLENBQUMsUUFBUTtRQUNYLE9BQU8sSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQ0QsSUFBSSxDQUFDLFFBQVE7UUFDVCxPQUFPLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRO1FBQ1gsT0FBTyxJQUFBLGVBQU0sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDRCxRQUFRLENBQUMsUUFBUSxFQUFFLE1BQU07UUFDckIsT0FBTyxJQUFBLG1CQUFRLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSztRQUNsQixPQUFPLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU87UUFDbEIsT0FBTyxJQUFBLFdBQUksRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQ0QsR0FBRyxDQUFDLFFBQVE7UUFDUixPQUFPLElBQUEsU0FBRyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUNELEtBQUssQ0FBQyxRQUFRO1FBQ1YsT0FBTyxJQUFBLGFBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDRCxJQUFJLENBQUMsUUFBUTtRQUNULE9BQU8sSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMxQyxDQUFDO0NBQ0o7QUF0Q0QsNEJBc0NDIn0=