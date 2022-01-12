"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifyFunc = exports.Remesh = exports.Offset = exports.XForm = exports.Mirror = exports.Scale = exports.Rotate = exports.Move = void 0;
const Mirror_1 = require("./Mirror");
Object.defineProperty(exports, "Mirror", { enumerable: true, get: function () { return Mirror_1.Mirror; } });
const Move_1 = require("./Move");
Object.defineProperty(exports, "Move", { enumerable: true, get: function () { return Move_1.Move; } });
const Offset_1 = require("./Offset");
Object.defineProperty(exports, "Offset", { enumerable: true, get: function () { return Offset_1.Offset; } });
const Remesh_1 = require("./Remesh");
Object.defineProperty(exports, "Remesh", { enumerable: true, get: function () { return Remesh_1.Remesh; } });
const Rotate_1 = require("./Rotate");
Object.defineProperty(exports, "Rotate", { enumerable: true, get: function () { return Rotate_1.Rotate; } });
const Scale_1 = require("./Scale");
Object.defineProperty(exports, "Scale", { enumerable: true, get: function () { return Scale_1.Scale; } });
const XForm_1 = require("./XForm");
Object.defineProperty(exports, "XForm", { enumerable: true, get: function () { return XForm_1.XForm; } });
class ModifyFunc {
    constructor(model) {
        this.__model__ = model;
    }
    Move(entities, vectors) {
        return (0, Move_1.Move)(this.__model__, entities, vectors);
    }
    Rotate(entities, ray, angle) {
        return (0, Rotate_1.Rotate)(this.__model__, entities, ray, angle);
    }
    Scale(entities, plane, scale) {
        return (0, Scale_1.Scale)(this.__model__, entities, plane, scale);
    }
    Mirror(entities, plane) {
        return (0, Mirror_1.Mirror)(this.__model__, entities, plane);
    }
    XForm(entities, from_plane, to_plane) {
        return (0, XForm_1.XForm)(this.__model__, entities, from_plane, to_plane);
    }
    Offset(entities, dist) {
        return (0, Offset_1.Offset)(this.__model__, entities, dist);
    }
    Remesh(entities) {
        return (0, Remesh_1.Remesh)(this.__model__, entities);
    }
}
exports.ModifyFunc = ModifyFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvbW9kaWZ5L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHFDQUFrQztBQVd6Qix1RkFYQSxlQUFNLE9BV0E7QUFWZixpQ0FBOEI7QUFPckIscUZBUEEsV0FBSSxPQU9BO0FBTmIscUNBQWtDO0FBV3pCLHVGQVhBLGVBQU0sT0FXQTtBQVZmLHFDQUFrQztBQVd6Qix1RkFYQSxlQUFNLE9BV0E7QUFWZixxQ0FBa0M7QUFLekIsdUZBTEEsZUFBTSxPQUtBO0FBSmYsbUNBQWdDO0FBS3ZCLHNGQUxBLGFBQUssT0FLQTtBQUpkLG1DQUFnQztBQU12QixzRkFOQSxhQUFLLE9BTUE7QUFHZCxNQUFhLFVBQVU7SUFFbkIsWUFBWSxLQUFjO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU87UUFDbEIsT0FBTyxJQUFBLFdBQUksRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsS0FBSztRQUN2QixPQUFPLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBQ0QsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSztRQUN4QixPQUFPLElBQUEsYUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLO1FBQ2xCLE9BQU8sSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUNELEtBQUssQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLFFBQVE7UUFDaEMsT0FBTyxJQUFBLGFBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSTtRQUNqQixPQUFPLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFDRCxNQUFNLENBQUMsUUFBUTtRQUNYLE9BQU8sSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQ0o7QUExQkQsZ0NBMEJDIn0=