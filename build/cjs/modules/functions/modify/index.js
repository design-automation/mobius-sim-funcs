"use strict";
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
// CLASS DEFINITION
class ModifyFunc {
    constructor(model) {
        this.__model__ = model;
    }
    Mirror(entities, plane) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Mirror_1.Mirror)(this.__model__, entities, plane);
        });
    }
    Move(entities, vectors) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Move_1.Move)(this.__model__, entities, vectors);
        });
    }
    Offset(entities, dist) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Offset_1.Offset)(this.__model__, entities, dist);
        });
    }
    Remesh(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Remesh_1.Remesh)(this.__model__, entities);
        });
    }
    Rotate(entities, ray, angle) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Rotate_1.Rotate)(this.__model__, entities, ray, angle);
        });
    }
    Scale(entities, plane, scale) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Scale_1.Scale)(this.__model__, entities, plane, scale);
        });
    }
    XForm(entities, from_plane, to_plane) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, XForm_1.XForm)(this.__model__, entities, from_plane, to_plane);
        });
    }
}
exports.ModifyFunc = ModifyFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvbW9kaWZ5L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVNBLHFDQUFrQztBQVd6Qix1RkFYQSxlQUFNLE9BV0E7QUFWZixpQ0FBOEI7QUFPckIscUZBUEEsV0FBSSxPQU9BO0FBTmIscUNBQWtDO0FBV3pCLHVGQVhBLGVBQU0sT0FXQTtBQVZmLHFDQUFrQztBQVd6Qix1RkFYQSxlQUFNLE9BV0E7QUFWZixxQ0FBa0M7QUFLekIsdUZBTEEsZUFBTSxPQUtBO0FBSmYsbUNBQWdDO0FBS3ZCLHNGQUxBLGFBQUssT0FLQTtBQUpkLG1DQUFnQztBQU12QixzRkFOQSxhQUFLLE9BTUE7QUFJZCxtQkFBbUI7QUFDbkIsTUFBYSxVQUFVO0lBR25CLFlBQVksS0FBYztRQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0ssTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLOztZQUN4QixJQUFBLGVBQU0sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1QyxDQUFDO0tBQUE7SUFDSyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU87O1lBQ3hCLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVDLENBQUM7S0FBQTtJQUNLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSTs7WUFDdkIsSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0MsQ0FBQztLQUFBO0lBQ0ssTUFBTSxDQUFDLFFBQVE7O1lBQ2pCLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckMsQ0FBQztLQUFBO0lBQ0ssTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsS0FBSzs7WUFDN0IsSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pELENBQUM7S0FBQTtJQUNLLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUs7O1lBQzlCLElBQUEsYUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRCxDQUFDO0tBQUE7SUFDSyxLQUFLLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFROztZQUN0QyxJQUFBLGFBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDMUQsQ0FBQztLQUFBO0NBRUo7QUE1QkQsZ0NBNEJDIn0=