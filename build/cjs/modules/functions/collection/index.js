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
exports.CollectionFunc = exports.Delete = exports.Remove = exports.Add = exports.Get = exports.Create = void 0;
const Add_1 = require("./Add");
Object.defineProperty(exports, "Add", { enumerable: true, get: function () { return Add_1.Add; } });
const Create_1 = require("./Create");
Object.defineProperty(exports, "Create", { enumerable: true, get: function () { return Create_1.Create; } });
const Delete_1 = require("./Delete");
Object.defineProperty(exports, "Delete", { enumerable: true, get: function () { return Delete_1.Delete; } });
const Get_1 = require("./Get");
Object.defineProperty(exports, "Get", { enumerable: true, get: function () { return Get_1.Get; } });
const Remove_1 = require("./Remove");
Object.defineProperty(exports, "Remove", { enumerable: true, get: function () { return Remove_1.Remove; } });
// CLASS DEFINITION
class CollectionFunc {
    constructor(model) {
        this.__model__ = model;
    }
    Add(coll, entities) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Add_1.Add)(this.__model__, coll, entities);
        });
    }
    Create(entities, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Create_1.Create)(this.__model__, entities, name);
        });
    }
    Delete(coll) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Delete_1.Delete)(this.__model__, coll);
        });
    }
    Get(names) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Get_1.Get)(this.__model__, names);
        });
    }
    Remove(coll, entities) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Remove_1.Remove)(this.__model__, coll, entities);
        });
    }
}
exports.CollectionFunc = CollectionFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvY29sbGVjdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFNQSwrQkFBNEI7QUFXbkIsb0ZBWEEsU0FBRyxPQVdBO0FBVloscUNBQWtDO0FBTXpCLHVGQU5BLGVBQU0sT0FNQTtBQUxmLHFDQUFrQztBQWF6Qix1RkFiQSxlQUFNLE9BYUE7QUFaZiwrQkFBNEI7QUFNbkIsb0ZBTkEsU0FBRyxPQU1BO0FBTFoscUNBQWtDO0FBU3pCLHVGQVRBLGVBQU0sT0FTQTtBQUtmLG1CQUFtQjtBQUNuQixNQUFhLGNBQWM7SUFHdkIsWUFBWSxLQUFjO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDSyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVE7O1lBQ3BCLElBQUEsU0FBRyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7S0FBQTtJQUNLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSTs7WUFDdkIsT0FBTyxJQUFBLGVBQU0sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsRCxDQUFDO0tBQUE7SUFDSyxNQUFNLENBQUMsSUFBSTs7WUFDYixJQUFBLGVBQU0sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pDLENBQUM7S0FBQTtJQUNLLEdBQUcsQ0FBQyxLQUFLOztZQUNYLE9BQU8sSUFBQSxTQUFHLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0QyxDQUFDO0tBQUE7SUFDSyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVE7O1lBQ3ZCLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLENBQUM7S0FBQTtDQUVKO0FBdEJELHdDQXNCQyJ9