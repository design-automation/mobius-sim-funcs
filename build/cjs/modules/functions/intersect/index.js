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
exports.IntersectFunc = exports.PlaneEdge = exports.RayFace = void 0;
const PlaneEdge_1 = require("./PlaneEdge");
Object.defineProperty(exports, "PlaneEdge", { enumerable: true, get: function () { return PlaneEdge_1.PlaneEdge; } });
const RayFace_1 = require("./RayFace");
Object.defineProperty(exports, "RayFace", { enumerable: true, get: function () { return RayFace_1.RayFace; } });
// CLASS DEFINITION
class IntersectFunc {
    constructor(model) {
        this.__model__ = model;
    }
    PlaneEdge(plane, entities) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, PlaneEdge_1.PlaneEdge)(this.__model__, plane, entities);
        });
    }
    RayFace(ray, entities) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, RayFace_1.RayFace)(this.__model__, ray, entities);
        });
    }
}
exports.IntersectFunc = IntersectFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvaW50ZXJzZWN0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQU1BLDJDQUF3QztBQUkvQiwwRkFKQSxxQkFBUyxPQUlBO0FBSGxCLHVDQUFvQztBQUUzQix3RkFGQSxpQkFBTyxPQUVBO0FBR2hCLG1CQUFtQjtBQUNuQixNQUFhLGFBQWE7SUFHdEIsWUFBWSxLQUFjO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDSyxTQUFTLENBQUMsS0FBSyxFQUFFLFFBQVE7O1lBQzNCLE9BQU8sSUFBQSxxQkFBUyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3RELENBQUM7S0FBQTtJQUNLLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUTs7WUFDdkIsT0FBTyxJQUFBLGlCQUFPLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbEQsQ0FBQztLQUFBO0NBRUo7QUFiRCxzQ0FhQyJ9