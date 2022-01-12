"use strict";
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
class CollectionFunc {
    constructor(model) {
        this.__model__ = model;
    }
    Create(entities, name) {
        return (0, Create_1.Create)(this.__model__, entities, name);
    }
    Get(names) {
        return (0, Get_1.Get)(this.__model__, names);
    }
    Add(coll, entities) {
        return (0, Add_1.Add)(this.__model__, coll, entities);
    }
    Remove(coll, entities) {
        return (0, Remove_1.Remove)(this.__model__, coll, entities);
    }
    Delete(coll) {
        return (0, Delete_1.Delete)(this.__model__, coll);
    }
}
exports.CollectionFunc = CollectionFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvY29sbGVjdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFNQSwrQkFBNEI7QUFVbkIsb0ZBVkEsU0FBRyxPQVVBO0FBVFoscUNBQWtDO0FBS3pCLHVGQUxBLGVBQU0sT0FLQTtBQUpmLHFDQUFrQztBQVl6Qix1RkFaQSxlQUFNLE9BWUE7QUFYZiwrQkFBNEI7QUFLbkIsb0ZBTEEsU0FBRyxPQUtBO0FBSloscUNBQWtDO0FBUXpCLHVGQVJBLGVBQU0sT0FRQTtBQUlmLE1BQWEsY0FBYztJQUV2QixZQUFZLEtBQWM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSTtRQUNqQixPQUFPLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFDRCxHQUFHLENBQUMsS0FBSztRQUNMLE9BQU8sSUFBQSxTQUFHLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBQ0QsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRO1FBQ2QsT0FBTyxJQUFBLFNBQUcsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRO1FBQ2pCLE9BQU8sSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJO1FBQ1AsT0FBTyxJQUFBLGVBQU0sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FDSjtBQXBCRCx3Q0FvQkMifQ==