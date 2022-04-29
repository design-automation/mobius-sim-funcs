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
// CLASS DEFINITION
class CalcFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    Area(entities) {
        return (0, Area_1.Area)(this.__model__, entities);
    }
    BBox(entities) {
        return (0, BBox_1.BBox)(this.__model__, entities);
    }
    Centroid(entities, method) {
        return (0, Centroid_1.Centroid)(this.__model__, entities, method);
    }
    Distance(entities1, entities2, method) {
        return (0, Distance_1.Distance)(this.__model__, entities1, entities2, method);
    }
    Eval(entities, t_param) {
        return (0, Eval_1.Eval)(this.__model__, entities, t_param);
    }
    Length(entities) {
        return (0, Length_1.Length)(this.__model__, entities);
    }
    Normal(entities, scale) {
        return (0, Normal_1.Normal)(this.__model__, entities, scale);
    }
    Plane(entities) {
        return (0, Plane_1.Plane)(this.__model__, entities);
    }
    Ray(entities) {
        return (0, Ray_1.Ray)(this.__model__, entities);
    }
    Vector(entities) {
        return (0, Vector_1.Vector)(this.__model__, entities);
    }
}
exports.CalcFunc = CalcFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvY2FsYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFBLDhDQUFnQztBQUNoQyxpQ0FBOEI7QUFlckIscUZBZkEsV0FBSSxPQWVBO0FBZGIsaUNBQThCO0FBNEJyQixxRkE1QkEsV0FBSSxPQTRCQTtBQTNCYix5Q0FBc0M7QUFpQjdCLHlGQWpCQSxtQkFBUSxPQWlCQTtBQWhCakIseUNBQXNDO0FBUTdCLHlGQVJBLG1CQUFRLE9BUUE7QUFQakIsaUNBQThCO0FBbUJyQixxRkFuQkEsV0FBSSxPQW1CQTtBQWxCYixxQ0FBa0M7QUFRekIsdUZBUkEsZUFBTSxPQVFBO0FBUGYscUNBQWtDO0FBZXpCLHVGQWZBLGVBQU0sT0FlQTtBQWRmLG1DQUFnQztBQW9CdkIsc0ZBcEJBLGFBQUssT0FvQkE7QUFuQmQsK0JBQTRCO0FBaUJuQixvRkFqQkEsU0FBRyxPQWlCQTtBQWhCWixxQ0FBa0M7QUFRekIsdUZBUkEsZUFBTSxPQVFBO0FBZWYsbUJBQW1CO0FBQ25CLE1BQWEsUUFBUTtJQU1qQixZQUFZLEtBQWM7UUFMMUIsYUFBUSxxQkFDRCxJQUFJLEVBQ1Y7UUFJRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsSUFBSSxDQUFDLFFBQVE7UUFDVCxPQUFPLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUNELElBQUksQ0FBQyxRQUFRO1FBQ1QsT0FBTyxJQUFBLFdBQUksRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDRCxRQUFRLENBQUMsUUFBUSxFQUFFLE1BQU07UUFDckIsT0FBTyxJQUFBLG1CQUFRLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUNELFFBQVEsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU07UUFDakMsT0FBTyxJQUFBLG1CQUFRLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU87UUFDbEIsT0FBTyxJQUFBLFdBQUksRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVE7UUFDWCxPQUFPLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSztRQUNsQixPQUFPLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFDRCxLQUFLLENBQUMsUUFBUTtRQUNWLE9BQU8sSUFBQSxhQUFLLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBQ0QsR0FBRyxDQUFDLFFBQVE7UUFDUixPQUFPLElBQUEsU0FBRyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRO1FBQ1gsT0FBTyxJQUFBLGVBQU0sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzVDLENBQUM7Q0FFSjtBQXhDRCw0QkF3Q0MifQ==