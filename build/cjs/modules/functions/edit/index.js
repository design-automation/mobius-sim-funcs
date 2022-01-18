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
exports.EditFunc = exports.Delete = exports.Reverse = exports.Shift = exports.Ring = exports.Fuse = exports.Weld = exports.Hole = exports.Divide = void 0;
const Enum = __importStar(require("./_enum"));
const Delete_1 = require("./Delete");
Object.defineProperty(exports, "Delete", { enumerable: true, get: function () { return Delete_1.Delete; } });
const Divide_1 = require("./Divide");
Object.defineProperty(exports, "Divide", { enumerable: true, get: function () { return Divide_1.Divide; } });
const Fuse_1 = require("./Fuse");
Object.defineProperty(exports, "Fuse", { enumerable: true, get: function () { return Fuse_1.Fuse; } });
const Hole_1 = require("./Hole");
Object.defineProperty(exports, "Hole", { enumerable: true, get: function () { return Hole_1.Hole; } });
const Reverse_1 = require("./Reverse");
Object.defineProperty(exports, "Reverse", { enumerable: true, get: function () { return Reverse_1.Reverse; } });
const Ring_1 = require("./Ring");
Object.defineProperty(exports, "Ring", { enumerable: true, get: function () { return Ring_1.Ring; } });
const Shift_1 = require("./Shift");
Object.defineProperty(exports, "Shift", { enumerable: true, get: function () { return Shift_1.Shift; } });
const Weld_1 = require("./Weld");
Object.defineProperty(exports, "Weld", { enumerable: true, get: function () { return Weld_1.Weld; } });
// CLASS DEFINITION
class EditFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    Delete(entities, method) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Delete_1.Delete)(this.__model__, entities, method);
        });
    }
    Divide(entities, divisor, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Divide_1.Divide)(this.__model__, entities, divisor, method);
        });
    }
    Fuse(entities, tolerance) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Fuse_1.Fuse)(this.__model__, entities, tolerance);
        });
    }
    Hole(pgon, entities) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Hole_1.Hole)(this.__model__, pgon, entities);
        });
    }
    Reverse(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Reverse_1.Reverse)(this.__model__, entities);
        });
    }
    Ring(entities, method) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Ring_1.Ring)(this.__model__, entities, method);
        });
    }
    Shift(entities, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Shift_1.Shift)(this.__model__, entities, offset);
        });
    }
    Weld(entities, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Weld_1.Weld)(this.__model__, entities, method);
        });
    }
}
exports.EditFunc = EditFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvZWRpdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUEsOENBQWdDO0FBQ2hDLHFDQUFrQztBQWdCekIsdUZBaEJBLGVBQU0sT0FnQkE7QUFmZixxQ0FBa0M7QUFRekIsdUZBUkEsZUFBTSxPQVFBO0FBUGYsaUNBQThCO0FBVXJCLHFGQVZBLFdBQUksT0FVQTtBQVRiLGlDQUE4QjtBQU9yQixxRkFQQSxXQUFJLE9BT0E7QUFOYix1Q0FBb0M7QUFXM0Isd0ZBWEEsaUJBQU8sT0FXQTtBQVZoQixpQ0FBOEI7QUFRckIscUZBUkEsV0FBSSxPQVFBO0FBUGIsbUNBQWdDO0FBUXZCLHNGQVJBLGFBQUssT0FRQTtBQVBkLGlDQUE4QjtBQUlyQixxRkFKQSxXQUFJLE9BSUE7QUFPYixtQkFBbUI7QUFDbkIsTUFBYSxRQUFRO0lBTWpCLFlBQVksS0FBYztRQUwxQixhQUFRLHFCQUNELElBQUksRUFDVjtRQUlHLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDSyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU07O1lBQ3pCLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLENBQUM7S0FBQTtJQUNLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU07O1lBQ2xDLE9BQU8sSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdELENBQUM7S0FBQTtJQUNLLElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUzs7WUFDMUIsT0FBTyxJQUFBLFdBQUksRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNyRCxDQUFDO0tBQUE7SUFDSyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVE7O1lBQ3JCLE9BQU8sSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDaEQsQ0FBQztLQUFBO0lBQ0ssT0FBTyxDQUFDLFFBQVE7O1lBQ2xCLElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7S0FBQTtJQUNLLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTTs7WUFDdkIsSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0MsQ0FBQztLQUFBO0lBQ0ssS0FBSyxDQUFDLFFBQVEsRUFBRSxNQUFNOztZQUN4QixJQUFBLGFBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1QyxDQUFDO0tBQUE7SUFDSyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU07O1lBQ3ZCLE9BQU8sSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEQsQ0FBQztLQUFBO0NBRUo7QUFsQ0QsNEJBa0NDIn0=