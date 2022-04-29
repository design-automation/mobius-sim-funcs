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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvZWRpdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFBLDhDQUFnQztBQUNoQyxxQ0FBa0M7QUFnQnpCLHVGQWhCQSxlQUFNLE9BZ0JBO0FBZmYscUNBQWtDO0FBUXpCLHVGQVJBLGVBQU0sT0FRQTtBQVBmLGlDQUE4QjtBQVVyQixxRkFWQSxXQUFJLE9BVUE7QUFUYixpQ0FBOEI7QUFPckIscUZBUEEsV0FBSSxPQU9BO0FBTmIsdUNBQW9DO0FBVzNCLHdGQVhBLGlCQUFPLE9BV0E7QUFWaEIsaUNBQThCO0FBUXJCLHFGQVJBLFdBQUksT0FRQTtBQVBiLG1DQUFnQztBQVF2QixzRkFSQSxhQUFLLE9BUUE7QUFQZCxpQ0FBOEI7QUFJckIscUZBSkEsV0FBSSxPQUlBO0FBT2IsbUJBQW1CO0FBQ25CLE1BQWEsUUFBUTtJQU1qQixZQUFZLEtBQWM7UUFMMUIsYUFBUSxxQkFDRCxJQUFJLEVBQ1Y7UUFJRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNO1FBQ25CLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFDRCxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNO1FBQzVCLE9BQU8sSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLFNBQVM7UUFDcEIsT0FBTyxJQUFBLFdBQUksRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBQ0QsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRO1FBQ2YsT0FBTyxJQUFBLFdBQUksRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsT0FBTyxDQUFDLFFBQVE7UUFDWixJQUFBLGlCQUFPLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNO1FBQ2pCLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDRCxLQUFLLENBQUMsUUFBUSxFQUFFLE1BQU07UUFDbEIsSUFBQSxhQUFLLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTTtRQUNqQixPQUFPLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELENBQUM7Q0FFSjtBQWxDRCw0QkFrQ0MifQ==