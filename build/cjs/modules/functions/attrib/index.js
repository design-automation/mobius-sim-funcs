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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYXR0cmliL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQSw4Q0FBZ0M7QUFDaEMsK0JBQTRCO0FBY25CLG9GQWRBLFNBQUcsT0FjQTtBQWJaLHFDQUFrQztBQWV6Qix1RkFmQSxlQUFNLE9BZUE7QUFkZiwrQkFBNEI7QUFVbkIsb0ZBVkEsU0FBRyxPQVVBO0FBVFoscUNBQWtDO0FBZXpCLHVGQWZBLGVBQU0sT0FlQTtBQWRmLCtCQUE0QjtBQU1uQixvRkFOQSxTQUFHLE9BTUE7QUFMWixpQ0FBOEI7QUFlckIscUZBZkEsV0FBSSxPQWVBO0FBZGIscUNBQWtDO0FBZ0J6Qix1RkFoQkEsZUFBTSxPQWdCQTtBQWZmLHlDQUFzQztBQWlCN0IseUZBakJBLG1CQUFRLE9BaUJBO0FBRWpCLG1CQUFtQjtBQUNuQixNQUFhLFVBQVU7SUFNbkIsWUFBWSxLQUFjO1FBTDFCLGFBQVEscUJBQ0QsSUFBSSxFQUNWO1FBSUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNELEdBQUcsQ0FBQyxZQUFZLEVBQUUsYUFBYSxFQUFFLE9BQU87UUFDcEMsSUFBQSxTQUFHLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFDRCxNQUFNLENBQUMsWUFBWSxFQUFFLE9BQU87UUFDeEIsSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNELEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTTtRQUNoQixPQUFPLElBQUEsU0FBRyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFDRCxNQUFNLENBQUMsWUFBWSxFQUFFLFVBQVUsRUFBRSxVQUFVO1FBQ3ZDLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBQ0QsR0FBRyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU07UUFDL0IsSUFBQSxTQUFHLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQVU7UUFDM0MsSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBQ0QsTUFBTSxDQUFDLFlBQVksRUFBRSxPQUFPO1FBQ3hCLE9BQU8sSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUNELFFBQVEsQ0FBQyxZQUFZO1FBQ2pCLE9BQU8sSUFBQSxtQkFBUSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDbEQsQ0FBQztDQUNKO0FBakNELGdDQWlDQyJ9