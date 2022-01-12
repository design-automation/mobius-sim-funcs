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
exports.ListFunc = exports.Splice = exports.Sort = exports.Replace = exports.Remove = exports.Add = void 0;
const Enum = __importStar(require("./_enum"));
const Add_1 = require("./Add");
Object.defineProperty(exports, "Add", { enumerable: true, get: function () { return Add_1.Add; } });
const Remove_1 = require("./Remove");
Object.defineProperty(exports, "Remove", { enumerable: true, get: function () { return Remove_1.Remove; } });
const Replace_1 = require("./Replace");
Object.defineProperty(exports, "Replace", { enumerable: true, get: function () { return Replace_1.Replace; } });
const Sort_1 = require("./Sort");
Object.defineProperty(exports, "Sort", { enumerable: true, get: function () { return Sort_1.Sort; } });
const Splice_1 = require("./Splice");
Object.defineProperty(exports, "Splice", { enumerable: true, get: function () { return Splice_1.Splice; } });
class ListFunc {
    constructor() {
        this.__enum__ = Object.assign({}, Enum);
    }
    Add(list, item, method) {
        return (0, Add_1.Add)(list, item, method);
    }
    Remove(list, item, method) {
        return (0, Remove_1.Remove)(list, item, method);
    }
    Replace(list, old_item, new_item, method) {
        return (0, Replace_1.Replace)(list, old_item, new_item, method);
    }
    Sort(list, method) {
        return (0, Sort_1.Sort)(list, method);
    }
    Splice(list, index, num_to_remove, items_to_insert) {
        return (0, Splice_1.Splice)(list, index, num_to_remove, items_to_insert);
    }
}
exports.ListFunc = ListFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvbGlzdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQWdDO0FBQ2hDLCtCQUE0QjtBQU1uQixvRkFOQSxTQUFHLE9BTUE7QUFMWixxQ0FBa0M7QUFNekIsdUZBTkEsZUFBTSxPQU1BO0FBTGYsdUNBQW9DO0FBTTNCLHdGQU5BLGlCQUFPLE9BTUE7QUFMaEIsaUNBQThCO0FBTXJCLHFGQU5BLFdBQUksT0FNQTtBQUxiLHFDQUFrQztBQU16Qix1RkFOQSxlQUFNLE9BTUE7QUFDZixNQUFhLFFBQVE7SUFJakI7UUFIQSxhQUFRLHFCQUNELElBQUksRUFDVjtJQUVELENBQUM7SUFDRCxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNO1FBQ2xCLE9BQU8sSUFBQSxTQUFHLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTTtRQUNyQixPQUFPLElBQUEsZUFBTSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNELE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNO1FBQ3BDLE9BQU8sSUFBQSxpQkFBTyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU07UUFDYixPQUFPLElBQUEsV0FBSSxFQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLGVBQWU7UUFDOUMsT0FBTyxJQUFBLGVBQU0sRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUMvRCxDQUFDO0NBQ0o7QUFyQkQsNEJBcUJDIn0=