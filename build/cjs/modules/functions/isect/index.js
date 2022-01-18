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
exports.IsectFunc = exports.Split = exports.Knife = exports.Intersect = void 0;
const Enum = __importStar(require("./_enum"));
const Intersect_1 = require("./Intersect");
Object.defineProperty(exports, "Intersect", { enumerable: true, get: function () { return Intersect_1.Intersect; } });
const Knife_1 = require("./Knife");
Object.defineProperty(exports, "Knife", { enumerable: true, get: function () { return Knife_1.Knife; } });
const Split_1 = require("./Split");
Object.defineProperty(exports, "Split", { enumerable: true, get: function () { return Split_1.Split; } });
// CLASS DEFINITION
class IsectFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    Intersect(entities1, entities2) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Intersect_1.Intersect)(this.__model__, entities1, entities2);
        });
    }
    Knife(geometry, plane, keep) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Knife_1.Knife)(this.__model__, geometry, plane, keep);
        });
    }
    Split(geometry, polyline) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Split_1.Split)(this.__model__, geometry, polyline);
        });
    }
}
exports.IsectFunc = IsectFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvaXNlY3QvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFBLDhDQUFnQztBQUNoQywyQ0FBd0M7QUFJL0IsMEZBSkEscUJBQVMsT0FJQTtBQUhsQixtQ0FBZ0M7QUFJdkIsc0ZBSkEsYUFBSyxPQUlBO0FBSGQsbUNBQWdDO0FBSXZCLHNGQUpBLGFBQUssT0FJQTtBQUVkLG1CQUFtQjtBQUNuQixNQUFhLFNBQVM7SUFNbEIsWUFBWSxLQUFjO1FBTDFCLGFBQVEscUJBQ0QsSUFBSSxFQUNWO1FBSUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNLLFNBQVMsQ0FBQyxTQUFTLEVBQUUsU0FBUzs7WUFDaEMsT0FBTyxJQUFBLHFCQUFTLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDM0QsQ0FBQztLQUFBO0lBQ0ssS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSTs7WUFDN0IsT0FBTyxJQUFBLGFBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsQ0FBQztLQUFBO0lBQ0ssS0FBSyxDQUFDLFFBQVEsRUFBRSxRQUFROztZQUMxQixPQUFPLElBQUEsYUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELENBQUM7S0FBQTtDQUVKO0FBbkJELDhCQW1CQyJ9