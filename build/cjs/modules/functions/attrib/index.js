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
exports.AttribFunc = exports.Push = exports.Rename = exports.Delete = exports.Add = exports.Get = exports.Set = void 0;
const Enum = __importStar(require("./_enum"));
const Add_1 = require("./Add");
Object.defineProperty(exports, "Add", { enumerable: true, get: function () { return Add_1.Add; } });
const Delete_1 = require("./Delete");
Object.defineProperty(exports, "Delete", { enumerable: true, get: function () { return Delete_1.Delete; } });
const Get_1 = require("./Get");
Object.defineProperty(exports, "Get", { enumerable: true, get: function () { return Get_1.Get; } });
const Push_1 = require("./Push");
Object.defineProperty(exports, "Push", { enumerable: true, get: function () { return Push_1.Push; } });
const Rename_1 = require("./Rename");
Object.defineProperty(exports, "Rename", { enumerable: true, get: function () { return Rename_1.Rename; } });
const Set_1 = require("./Set");
Object.defineProperty(exports, "Set", { enumerable: true, get: function () { return Set_1.Set; } });
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
    Push(entities, attrib, ent_type_sel, method_sel) {
        (0, Push_1.Push)(this.__model__, entities, attrib, ent_type_sel, method_sel);
    }
    Rename(ent_type_sel, old_attrib, new_attrib) {
        (0, Rename_1.Rename)(this.__model__, ent_type_sel, old_attrib, new_attrib);
    }
    Set(entities, attrib, value, method) {
        (0, Set_1.Set)(this.__model__, entities, attrib, value, method);
    }
}
exports.AttribFunc = AttribFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYXR0cmliL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQSw4Q0FBZ0M7QUFDaEMsK0JBQTRCO0FBWW5CLG9GQVpBLFNBQUcsT0FZQTtBQVhaLHFDQUFrQztBQWF6Qix1RkFiQSxlQUFNLE9BYUE7QUFaZiwrQkFBNEI7QUFRbkIsb0ZBUkEsU0FBRyxPQVFBO0FBUFosaUNBQThCO0FBZXJCLHFGQWZBLFdBQUksT0FlQTtBQWRiLHFDQUFrQztBQVl6Qix1RkFaQSxlQUFNLE9BWUE7QUFYZiwrQkFBNEI7QUFHbkIsb0ZBSEEsU0FBRyxPQUdBO0FBYVosbUJBQW1CO0FBQ25CLE1BQWEsVUFBVTtJQU1uQixZQUFZLEtBQWM7UUFMMUIsYUFBUSxxQkFDRCxJQUFJLEVBQ1Y7UUFJRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsR0FBRyxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsT0FBTztRQUNwQyxJQUFBLFNBQUcsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUNELE1BQU0sQ0FBQyxZQUFZLEVBQUUsT0FBTztRQUN4QixJQUFBLGVBQU0sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0QsR0FBRyxDQUFDLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLE9BQU8sSUFBQSxTQUFHLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUNELElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxVQUFVO1FBQzNDLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUNELE1BQU0sQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLFVBQVU7UUFDdkMsSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFDRCxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTTtRQUMvQixJQUFBLFNBQUcsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELENBQUM7Q0FFSjtBQTVCRCxnQ0E0QkMifQ==