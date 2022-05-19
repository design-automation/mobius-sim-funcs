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
        (0, Delete_1.Delete)(this.__model__, entities, method);
    }
    Divide(entities, divisor, method) {
        return (0, Divide_1.Divide)(this.__model__, entities, divisor, method);
    }
    Fuse(entities, tolerance) {
        return (0, Fuse_1.Fuse)(this.__model__, entities, tolerance);
    }
    Hole(pgon, entities) {
        return (0, Hole_1.Hole)(this.__model__, pgon, entities);
    }
    Reverse(entities) {
        (0, Reverse_1.Reverse)(this.__model__, entities);
    }
    Ring(entities, method) {
        (0, Ring_1.Ring)(this.__model__, entities, method);
    }
    Shift(entities, offset) {
        (0, Shift_1.Shift)(this.__model__, entities, offset);
    }
    Weld(entities, method) {
        return (0, Weld_1.Weld)(this.__model__, entities, method);
    }
}
exports.EditFunc = EditFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvZWRpdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUEsOENBQWdDO0FBQ2hDLHFDQUFrQztBQWdCekIsdUZBaEJBLGVBQU0sT0FnQkE7QUFmZixxQ0FBa0M7QUFRekIsdUZBUkEsZUFBTSxPQVFBO0FBUGYsaUNBQThCO0FBVXJCLHFGQVZBLFdBQUksT0FVQTtBQVRiLGlDQUE4QjtBQU9yQixxRkFQQSxXQUFJLE9BT0E7QUFOYix1Q0FBb0M7QUFXM0Isd0ZBWEEsaUJBQU8sT0FXQTtBQVZoQixpQ0FBOEI7QUFRckIscUZBUkEsV0FBSSxPQVFBO0FBUGIsbUNBQWdDO0FBUXZCLHNGQVJBLGFBQUssT0FRQTtBQVBkLGlDQUE4QjtBQUlyQixxRkFKQSxXQUFJLE9BSUE7QUFPYixtQkFBbUI7QUFDbkIsTUFBYSxRQUFRO0lBTWpCLFlBQVksS0FBYztRQUwxQixhQUFRLHFCQUNELElBQUksRUFDVjtRQUlHLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU07UUFDbkIsSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU07UUFDNUIsT0FBTyxJQUFBLGVBQU0sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUNELElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUztRQUNwQixPQUFPLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVE7UUFDZixPQUFPLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDRCxPQUFPLENBQUMsUUFBUTtRQUNaLElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU07UUFDakIsSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNELEtBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTTtRQUNsQixJQUFBLGFBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNO1FBQ2pCLE9BQU8sSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEQsQ0FBQztDQUVKO0FBbENELDRCQWtDQyJ9