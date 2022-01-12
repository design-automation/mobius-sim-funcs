"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DictFunc = exports.Replace = exports.Remove = exports.Add = void 0;
const Add_1 = require("./Add");
Object.defineProperty(exports, "Add", { enumerable: true, get: function () { return Add_1.Add; } });
const Remove_1 = require("./Remove");
Object.defineProperty(exports, "Remove", { enumerable: true, get: function () { return Remove_1.Remove; } });
const Replace_1 = require("./Replace");
Object.defineProperty(exports, "Replace", { enumerable: true, get: function () { return Replace_1.Replace; } });
class DictFunc {
    constructor() {
    }
    Add(dict, keys, values) {
        return (0, Add_1.Add)(dict, keys, values);
    }
    Remove(dict, keys) {
        return (0, Remove_1.Remove)(dict, keys);
    }
    Replace(dict, old_keys, new_keys) {
        return (0, Replace_1.Replace)(dict, old_keys, new_keys);
    }
}
exports.DictFunc = DictFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvZGljdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBNEI7QUFJbkIsb0ZBSkEsU0FBRyxPQUlBO0FBSFoscUNBQWtDO0FBSXpCLHVGQUpBLGVBQU0sT0FJQTtBQUhmLHVDQUFvQztBQUkzQix3RkFKQSxpQkFBTyxPQUlBO0FBRWhCLE1BQWEsUUFBUTtJQUNqQjtJQUNBLENBQUM7SUFDRCxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNO1FBQ2xCLE9BQU8sSUFBQSxTQUFHLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJO1FBQ2IsT0FBTyxJQUFBLGVBQU0sRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUNELE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVE7UUFDNUIsT0FBTyxJQUFBLGlCQUFPLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3QyxDQUFDO0NBQ0o7QUFaRCw0QkFZQyJ9