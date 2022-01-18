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
exports.QueryFunc = exports.Type = exports.Edge = exports.Neighbor = exports.Perimeter = exports.Sort = exports.Invert = exports.Filter = exports.Get = void 0;
const Enum = __importStar(require("./_enum"));
const Edge_1 = require("./Edge");
Object.defineProperty(exports, "Edge", { enumerable: true, get: function () { return Edge_1.Edge; } });
const Filter_1 = require("./Filter");
Object.defineProperty(exports, "Filter", { enumerable: true, get: function () { return Filter_1.Filter; } });
const Get_1 = require("./Get");
Object.defineProperty(exports, "Get", { enumerable: true, get: function () { return Get_1.Get; } });
const Invert_1 = require("./Invert");
Object.defineProperty(exports, "Invert", { enumerable: true, get: function () { return Invert_1.Invert; } });
const Neighbor_1 = require("./Neighbor");
Object.defineProperty(exports, "Neighbor", { enumerable: true, get: function () { return Neighbor_1.Neighbor; } });
const Perimeter_1 = require("./Perimeter");
Object.defineProperty(exports, "Perimeter", { enumerable: true, get: function () { return Perimeter_1.Perimeter; } });
const Sort_1 = require("./Sort");
Object.defineProperty(exports, "Sort", { enumerable: true, get: function () { return Sort_1.Sort; } });
const Type_1 = require("./Type");
Object.defineProperty(exports, "Type", { enumerable: true, get: function () { return Type_1.Type; } });
// CLASS DEFINITION
class QueryFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    Edge(entities, edge_query_enum) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Edge_1.Edge)(this.__model__, entities, edge_query_enum);
        });
    }
    Filter(entities, attrib, operator_enum, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Filter_1.Filter)(this.__model__, entities, attrib, operator_enum, value);
        });
    }
    Get(ent_type_enum, entities) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Get_1.Get)(this.__model__, ent_type_enum, entities);
        });
    }
    Invert(ent_type_enum, entities) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Invert_1.Invert)(this.__model__, ent_type_enum, entities);
        });
    }
    Neighbor(ent_type_enum, entities) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Neighbor_1.Neighbor)(this.__model__, ent_type_enum, entities);
        });
    }
    Perimeter(ent_type, entities) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Perimeter_1.Perimeter)(this.__model__, ent_type, entities);
        });
    }
    Sort(entities, attrib, method_enum) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Sort_1.Sort)(this.__model__, entities, attrib, method_enum);
        });
    }
    Type(entities, type_query_enum) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Type_1.Type)(this.__model__, entities, type_query_enum);
        });
    }
}
exports.QueryFunc = QueryFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvcXVlcnkvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9BLDhDQUFnQztBQUNoQyxpQ0FBOEI7QUFlckIscUZBZkEsV0FBSSxPQWVBO0FBZGIscUNBQWtDO0FBU3pCLHVGQVRBLGVBQU0sT0FTQTtBQVJmLCtCQUE0QjtBQU9uQixvRkFQQSxTQUFHLE9BT0E7QUFOWixxQ0FBa0M7QUFRekIsdUZBUkEsZUFBTSxPQVFBO0FBUGYseUNBQXNDO0FBVTdCLHlGQVZBLG1CQUFRLE9BVUE7QUFUakIsMkNBQXdDO0FBUS9CLDBGQVJBLHFCQUFTLE9BUUE7QUFQbEIsaUNBQThCO0FBTXJCLHFGQU5BLFdBQUksT0FNQTtBQUxiLGlDQUE4QjtBQVNyQixxRkFUQSxXQUFJLE9BU0E7QUFFYixtQkFBbUI7QUFDbkIsTUFBYSxTQUFTO0lBTWxCLFlBQVksS0FBYztRQUwxQixhQUFRLHFCQUNELElBQUksRUFDVjtRQUlHLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDSyxJQUFJLENBQUMsUUFBUSxFQUFFLGVBQWU7O1lBQ2hDLE9BQU8sSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDM0QsQ0FBQztLQUFBO0lBQ0ssTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLEtBQUs7O1lBQy9DLE9BQU8sSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMxRSxDQUFDO0tBQUE7SUFDSyxHQUFHLENBQUMsYUFBYSxFQUFFLFFBQVE7O1lBQzdCLE9BQU8sSUFBQSxTQUFHLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEQsQ0FBQztLQUFBO0lBQ0ssTUFBTSxDQUFDLGFBQWEsRUFBRSxRQUFROztZQUNoQyxPQUFPLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNELENBQUM7S0FBQTtJQUNLLFFBQVEsQ0FBQyxhQUFhLEVBQUUsUUFBUTs7WUFDbEMsT0FBTyxJQUFBLG1CQUFRLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDN0QsQ0FBQztLQUFBO0lBQ0ssU0FBUyxDQUFDLFFBQVEsRUFBRSxRQUFROztZQUM5QixPQUFPLElBQUEscUJBQVMsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN6RCxDQUFDO0tBQUE7SUFDSyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXOztZQUNwQyxPQUFPLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMvRCxDQUFDO0tBQUE7SUFDSyxJQUFJLENBQUMsUUFBUSxFQUFFLGVBQWU7O1lBQ2hDLE9BQU8sSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDM0QsQ0FBQztLQUFBO0NBRUo7QUFsQ0QsOEJBa0NDIn0=