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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvbWFrZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9BLDhDQUFnQztBQUNoQyxtQ0FBZ0M7QUFzQnZCLHNGQXRCQSxhQUFLLE9Bc0JBO0FBckJkLGlDQUE4QjtBQW9CckIscUZBcEJBLFdBQUksT0FvQkE7QUFuQmIsK0JBQTRCO0FBa0JuQixvRkFsQkEsU0FBRyxPQWtCQTtBQWpCWix1Q0FBb0M7QUFjM0Isd0ZBZEEsaUJBQU8sT0FjQTtBQWJoQixpQ0FBOEI7QUFlckIscUZBZkEsV0FBSSxPQWVBO0FBZGIsaUNBQThCO0FBV3JCLHFGQVhBLFdBQUksT0FXQTtBQVZiLG1DQUFnQztBQU92QixzRkFQQSxhQUFLLE9BT0E7QUFOZCx1Q0FBb0M7QUFRM0Isd0ZBUkEsaUJBQU8sT0FRQTtBQVBoQix5Q0FBc0M7QUFNN0IseUZBTkEsbUJBQVEsT0FNQTtBQUxqQix5Q0FBc0M7QUFHN0IseUZBSEEsbUJBQVEsT0FHQTtBQUZqQixtQ0FBZ0M7QUFRdkIsc0ZBUkEsYUFBSyxPQVFBO0FBT2QsbUJBQW1CO0FBQ25CLE1BQWEsUUFBUTtJQU1qQixZQUFZLEtBQWM7UUFMMUIsYUFBUSxxQkFDRCxJQUFJLEVBQ1Y7UUFJRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsS0FBSyxDQUFDLFFBQVE7UUFDVixPQUFPLElBQUEsYUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNELElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTTtRQUNqQixPQUFPLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFDRCxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNO1FBQ3ZCLE9BQU8sSUFBQSxTQUFHLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFDRCxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTTtRQUNyQyxPQUFPLElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFDRCxJQUFJLENBQUMsUUFBUTtRQUNULE9BQU8sSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTTtRQUM1QixPQUFPLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBQ0QsS0FBSyxDQUFDLFFBQVE7UUFDVixPQUFPLElBQUEsYUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNELE9BQU8sQ0FBQyxRQUFRO1FBQ1osT0FBTyxJQUFBLGlCQUFPLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBQ0QsUUFBUSxDQUFDLFFBQVEsRUFBRSxLQUFLO1FBQ3BCLE9BQU8sSUFBQSxtQkFBUSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFDRCxRQUFRLENBQUMsTUFBTTtRQUNYLE9BQU8sSUFBQSxtQkFBUSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELEtBQUssQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNO1FBQ3hDLE9BQU8sSUFBQSxhQUFLLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6RSxDQUFDO0NBRUo7QUEzQ0QsNEJBMkNDIn0=