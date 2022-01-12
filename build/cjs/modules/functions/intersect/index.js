"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntersectFunc = exports.PlaneEdge = exports.RayFace = void 0;
const PlaneEdge_1 = require("./PlaneEdge");
Object.defineProperty(exports, "PlaneEdge", { enumerable: true, get: function () { return PlaneEdge_1.PlaneEdge; } });
const RayFace_1 = require("./RayFace");
Object.defineProperty(exports, "RayFace", { enumerable: true, get: function () { return RayFace_1.RayFace; } });
class IntersectFunc {
    constructor(model) {
        this.__model__ = model;
    }
    RayFace(ray, entities) {
        return (0, RayFace_1.RayFace)(this.__model__, ray, entities);
    }
    PlaneEdge(plane, entities) {
        return (0, PlaneEdge_1.PlaneEdge)(this.__model__, plane, entities);
    }
}
exports.IntersectFunc = IntersectFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvaW50ZXJzZWN0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLDJDQUF3QztBQUkvQiwwRkFKQSxxQkFBUyxPQUlBO0FBSGxCLHVDQUFvQztBQUUzQix3RkFGQSxpQkFBTyxPQUVBO0FBRWhCLE1BQWEsYUFBYTtJQUV0QixZQUFZLEtBQWM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNELE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUTtRQUNqQixPQUFPLElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0QsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRO1FBQ3JCLE9BQU8sSUFBQSxxQkFBUyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RELENBQUM7Q0FDSjtBQVhELHNDQVdDIn0=