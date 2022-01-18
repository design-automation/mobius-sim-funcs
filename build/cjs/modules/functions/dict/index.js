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
exports.DictFunc = exports.Replace = exports.Remove = exports.Add = void 0;
/**
 * The `dict` module has functions for working with dictionaries.
 * These functions have no direct link with the model, the are generic functions for manipulating dictionaries.
 * These functions neither make nor modify anything in the model.
 * In addition to these functions, there are also inline functions available for working with dictionaries.
 * @module
 */
const Add_1 = require("./Add");
Object.defineProperty(exports, "Add", { enumerable: true, get: function () { return Add_1.Add; } });
const Remove_1 = require("./Remove");
Object.defineProperty(exports, "Remove", { enumerable: true, get: function () { return Remove_1.Remove; } });
const Replace_1 = require("./Replace");
Object.defineProperty(exports, "Replace", { enumerable: true, get: function () { return Replace_1.Replace; } });
// CLASS DEFINITION
class DictFunc {
    Add(dict, keys, values) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Add_1.Add)(dict, keys, values);
        });
    }
    Remove(dict, keys) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Remove_1.Remove)(dict, keys);
        });
    }
    Replace(dict, old_keys, new_keys) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Replace_1.Replace)(dict, old_keys, new_keys);
        });
    }
}
exports.DictFunc = DictFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvZGljdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQkFBNEI7QUFJbkIsb0ZBSkEsU0FBRyxPQUlBO0FBSFoscUNBQWtDO0FBSXpCLHVGQUpBLGVBQU0sT0FJQTtBQUhmLHVDQUFvQztBQUkzQix3RkFKQSxpQkFBTyxPQUlBO0FBR2hCLG1CQUFtQjtBQUNuQixNQUFhLFFBQVE7SUFFWCxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNOztZQUN4QixJQUFBLFNBQUcsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLENBQUM7S0FBQTtJQUNLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSTs7WUFDbkIsSUFBQSxlQUFNLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7S0FBQTtJQUNLLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVE7O1lBQ2xDLElBQUEsaUJBQU8sRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7S0FBQTtDQUVKO0FBWkQsNEJBWUMifQ==