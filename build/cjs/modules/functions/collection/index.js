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
// CLASS DEFINITION
class CollectionFunc {
    constructor(model) {
        this.__model__ = model;
    }
    Add(coll, entities) {
        (0, Add_1.Add)(this.__model__, coll, entities);
    }
    Create(entities, name) {
        return (0, Create_1.Create)(this.__model__, entities, name);
    }
    Delete(coll) {
        (0, Delete_1.Delete)(this.__model__, coll);
    }
    Get(names) {
        return (0, Get_1.Get)(this.__model__, names);
    }
    Remove(coll, entities) {
        (0, Remove_1.Remove)(this.__model__, coll, entities);
    }
}
exports.CollectionFunc = CollectionFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvY29sbGVjdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFNQSwrQkFBNEI7QUFXbkIsb0ZBWEEsU0FBRyxPQVdBO0FBVloscUNBQWtDO0FBTXpCLHVGQU5BLGVBQU0sT0FNQTtBQUxmLHFDQUFrQztBQWF6Qix1RkFiQSxlQUFNLE9BYUE7QUFaZiwrQkFBNEI7QUFNbkIsb0ZBTkEsU0FBRyxPQU1BO0FBTFoscUNBQWtDO0FBU3pCLHVGQVRBLGVBQU0sT0FTQTtBQUtmLG1CQUFtQjtBQUNuQixNQUFhLGNBQWM7SUFHdkIsWUFBWSxLQUFjO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVE7UUFDZCxJQUFBLFNBQUcsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJO1FBQ2pCLE9BQU8sSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJO1FBQ1AsSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ0QsR0FBRyxDQUFDLEtBQUs7UUFDTCxPQUFPLElBQUEsU0FBRyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUTtRQUNqQixJQUFBLGVBQU0sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzQyxDQUFDO0NBRUo7QUF0QkQsd0NBc0JDIn0=