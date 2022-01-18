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
exports.ListFunc = exports.Splice = exports.Sort = exports.Replace = exports.Remove = exports.Add = void 0;
/**
 * The `list` module has functions for working with lists of items.
 * These functions have no direct link with the model, the are generic functions for manipulating lists.
 * The functions are often used when manipulating lists of IDs of entities in the model.
 * These functions neither make nor modify anything in the model.
 * In addition to these functions, there are also various inline functions available for working with lists.
 * @module
 */
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
// CLASS DEFINITION
class ListFunc {
    constructor() {
        this.__enum__ = Object.assign({}, Enum);
    }
    Add(list, item, method) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Add_1.Add)(list, item, method);
        });
    }
    Remove(list, item, method) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Remove_1.Remove)(list, item, method);
        });
    }
    Replace(list, old_item, new_item, method) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Replace_1.Replace)(list, old_item, new_item, method);
        });
    }
    Sort(list, method) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Sort_1.Sort)(list, method);
        });
    }
    Splice(list, index, num_to_remove, items_to_insert) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Splice_1.Splice)(list, index, num_to_remove, items_to_insert);
        });
    }
}
exports.ListFunc = ListFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvbGlzdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7R0FPRztBQUNILDhDQUFnQztBQUNoQywrQkFBNEI7QUFNbkIsb0ZBTkEsU0FBRyxPQU1BO0FBTFoscUNBQWtDO0FBTXpCLHVGQU5BLGVBQU0sT0FNQTtBQUxmLHVDQUFvQztBQU0zQix3RkFOQSxpQkFBTyxPQU1BO0FBTGhCLGlDQUE4QjtBQU1yQixxRkFOQSxXQUFJLE9BTUE7QUFMYixxQ0FBa0M7QUFNekIsdUZBTkEsZUFBTSxPQU1BO0FBRWYsbUJBQW1CO0FBQ25CLE1BQWEsUUFBUTtJQUFyQjtRQUNJLGFBQVEscUJBQ0QsSUFBSSxFQUNWO0lBa0JMLENBQUM7SUFoQlMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTTs7WUFDeEIsSUFBQSxTQUFHLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1QixDQUFDO0tBQUE7SUFDSyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNOztZQUMzQixJQUFBLGVBQU0sRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLENBQUM7S0FBQTtJQUNLLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNOztZQUMxQyxJQUFBLGlCQUFPLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUMsQ0FBQztLQUFBO0lBQ0ssSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNOztZQUNuQixJQUFBLFdBQUksRUFBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkIsQ0FBQztLQUFBO0lBQ0ssTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLGVBQWU7O1lBQ3BELElBQUEsZUFBTSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3hELENBQUM7S0FBQTtDQUVKO0FBckJELDRCQXFCQyJ9