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
exports.AttribFunc = exports.Discover = exports.Values = exports.Push = exports.Rename = exports.Delete = exports.Add = exports.Get = exports.Set = void 0;
const Enum = __importStar(require("./_enum"));
const Add_1 = require("./Add");
Object.defineProperty(exports, "Add", { enumerable: true, get: function () { return Add_1.Add; } });
const Delete_1 = require("./Delete");
Object.defineProperty(exports, "Delete", { enumerable: true, get: function () { return Delete_1.Delete; } });
const Get_1 = require("./Get");
Object.defineProperty(exports, "Get", { enumerable: true, get: function () { return Get_1.Get; } });
const Rename_1 = require("./Rename");
Object.defineProperty(exports, "Rename", { enumerable: true, get: function () { return Rename_1.Rename; } });
const Set_1 = require("./Set");
Object.defineProperty(exports, "Set", { enumerable: true, get: function () { return Set_1.Set; } });
const Push_1 = require("./Push");
Object.defineProperty(exports, "Push", { enumerable: true, get: function () { return Push_1.Push; } });
const Values_1 = require("./Values");
Object.defineProperty(exports, "Values", { enumerable: true, get: function () { return Values_1.Values; } });
const Discover_1 = require("./Discover");
Object.defineProperty(exports, "Discover", { enumerable: true, get: function () { return Discover_1.Discover; } });
// CLASS DEFINITION
class AttribFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    Add(ent_type_sel, data_type_sel, attribs) {
        (0, Add_1.Add)(this.__model__, ent_type_sel, data_type_sel, attribs);
    }
    Delete(ent_type_sel, attribs) {
        (0, Delete_1.Delete)(this.__model__, ent_type_sel, attribs);
    }
    Get(entities, attrib) {
        return (0, Get_1.Get)(this.__model__, entities, attrib);
    }
    Rename(ent_type_sel, old_attrib, new_attrib) {
        (0, Rename_1.Rename)(this.__model__, ent_type_sel, old_attrib, new_attrib);
    }
    Set(entities, attrib, value, method) {
        (0, Set_1.Set)(this.__model__, entities, attrib, value, method);
    }
    Push(entities, attrib, ent_type_sel, method_sel) {
        (0, Push_1.Push)(this.__model__, entities, attrib, ent_type_sel, method_sel);
    }
    Values(ent_type_sel, attribs) {
        return (0, Values_1.Values)(this.__model__, ent_type_sel, attribs);
    }
    Discover(ent_type_sel) {
        return (0, Discover_1.Discover)(this.__model__, ent_type_sel);
    }
}
exports.AttribFunc = AttribFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYXR0cmliL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT0EsOENBQWdDO0FBQ2hDLCtCQUE0QjtBQWNuQixvRkFkQSxTQUFHLE9BY0E7QUFiWixxQ0FBa0M7QUFlekIsdUZBZkEsZUFBTSxPQWVBO0FBZGYsK0JBQTRCO0FBVW5CLG9GQVZBLFNBQUcsT0FVQTtBQVRaLHFDQUFrQztBQWV6Qix1RkFmQSxlQUFNLE9BZUE7QUFkZiwrQkFBNEI7QUFNbkIsb0ZBTkEsU0FBRyxPQU1BO0FBTFosaUNBQThCO0FBZXJCLHFGQWZBLFdBQUksT0FlQTtBQWRiLHFDQUFrQztBQWdCekIsdUZBaEJBLGVBQU0sT0FnQkE7QUFmZix5Q0FBc0M7QUFpQjdCLHlGQWpCQSxtQkFBUSxPQWlCQTtBQUVqQixtQkFBbUI7QUFDbkIsTUFBYSxVQUFVO0lBTW5CLFlBQVksS0FBYztRQUwxQixhQUFRLHFCQUNELElBQUksRUFDVjtRQUlHLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxHQUFHLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxPQUFPO1FBQ3BDLElBQUEsU0FBRyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFlBQVksRUFBRSxPQUFPO1FBQ3hCLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFDRCxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU07UUFDaEIsT0FBTyxJQUFBLFNBQUcsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFlBQVksRUFBRSxVQUFVLEVBQUUsVUFBVTtRQUN2QyxJQUFBLGVBQU0sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUNELEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNO1FBQy9CLElBQUEsU0FBRyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUNELElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxVQUFVO1FBQzNDLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUNELE1BQU0sQ0FBQyxZQUFZLEVBQUUsT0FBTztRQUN4QixPQUFPLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDRCxRQUFRLENBQUMsWUFBWTtRQUNqQixPQUFPLElBQUEsbUJBQVEsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ2xELENBQUM7Q0FDSjtBQWpDRCxnQ0FpQ0MifQ==