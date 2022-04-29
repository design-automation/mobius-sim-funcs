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
exports.AnalyzeFunc = exports.Centrality = exports.Degree = exports.ClosestPath = exports.ShortestPath = exports.Nearest = exports.SkyDome = exports.Sun = exports.Sky = exports.Isovist = exports.Raytrace = void 0;
const Enum = __importStar(require("./_enum"));
const Centrality_1 = require("./Centrality");
Object.defineProperty(exports, "Centrality", { enumerable: true, get: function () { return Centrality_1.Centrality; } });
const ClosestPath_1 = require("./ClosestPath");
Object.defineProperty(exports, "ClosestPath", { enumerable: true, get: function () { return ClosestPath_1.ClosestPath; } });
const Degree_1 = require("./Degree");
Object.defineProperty(exports, "Degree", { enumerable: true, get: function () { return Degree_1.Degree; } });
const Isovist_1 = require("./Isovist");
Object.defineProperty(exports, "Isovist", { enumerable: true, get: function () { return Isovist_1.Isovist; } });
const Nearest_1 = require("./Nearest");
Object.defineProperty(exports, "Nearest", { enumerable: true, get: function () { return Nearest_1.Nearest; } });
const Raytrace_1 = require("./Raytrace");
Object.defineProperty(exports, "Raytrace", { enumerable: true, get: function () { return Raytrace_1.Raytrace; } });
const ShortestPath_1 = require("./ShortestPath");
Object.defineProperty(exports, "ShortestPath", { enumerable: true, get: function () { return ShortestPath_1.ShortestPath; } });
const Sky_1 = require("./Sky");
Object.defineProperty(exports, "Sky", { enumerable: true, get: function () { return Sky_1.Sky; } });
const SkyDome_1 = require("./SkyDome");
Object.defineProperty(exports, "SkyDome", { enumerable: true, get: function () { return SkyDome_1.SkyDome; } });
const Sun_1 = require("./Sun");
Object.defineProperty(exports, "Sun", { enumerable: true, get: function () { return Sun_1.Sun; } });
// CLASS DEFINITION
class AnalyzeFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    Centrality(source, entities, method, cen_type) {
        return (0, Centrality_1.Centrality)(this.__model__, source, entities, method, cen_type);
    }
    ClosestPath(source, target, entities, method, result) {
        return (0, ClosestPath_1.ClosestPath)(this.__model__, source, target, entities, method, result);
    }
    Degree(source, entities, alpha, method) {
        return (0, Degree_1.Degree)(this.__model__, source, entities, alpha, method);
    }
    Isovist(origins, entities, radius, num_rays) {
        return (0, Isovist_1.Isovist)(this.__model__, origins, entities, radius, num_rays);
    }
    Nearest(source, target, radius, max_neighbors) {
        return (0, Nearest_1.Nearest)(this.__model__, source, target, radius, max_neighbors);
    }
    Raytrace(rays, entities, dist, method) {
        return (0, Raytrace_1.Raytrace)(this.__model__, rays, entities, dist, method);
    }
    ShortestPath(source, target, entities, method, result) {
        return (0, ShortestPath_1.ShortestPath)(this.__model__, source, target, entities, method, result);
    }
    Sky(origins, detail, entities, limits, method) {
        return (0, Sky_1.Sky)(this.__model__, origins, detail, entities, limits, method);
    }
    SkyDome(origin, detail, radius, method) {
        return (0, SkyDome_1.SkyDome)(this.__model__, origin, detail, radius, method);
    }
    Sun(origins, detail, entities, limits, method) {
        return (0, Sun_1.Sun)(this.__model__, origins, detail, entities, limits, method);
    }
}
exports.AnalyzeFunc = AnalyzeFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYW5hbHl6ZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9BLDhDQUFnQztBQUNoQyw2Q0FBMEM7QUE4QmpDLDJGQTlCQSx1QkFBVSxPQThCQTtBQTdCbkIsK0NBQTRDO0FBeUJuQyw0RkF6QkEseUJBQVcsT0F5QkE7QUF4QnBCLHFDQUFrQztBQTBCekIsdUZBMUJBLGVBQU0sT0EwQkE7QUF6QmYsdUNBQW9DO0FBVzNCLHdGQVhBLGlCQUFPLE9BV0E7QUFWaEIsdUNBQW9DO0FBa0IzQix3RkFsQkEsaUJBQU8sT0FrQkE7QUFqQmhCLHlDQUFzQztBQU83Qix5RkFQQSxtQkFBUSxPQU9BO0FBTmpCLGlEQUE4QztBQWtCckMsNkZBbEJBLDJCQUFZLE9Ba0JBO0FBakJyQiwrQkFBNEI7QUFTbkIsb0ZBVEEsU0FBRyxPQVNBO0FBUlosdUNBQW9DO0FBWTNCLHdGQVpBLGlCQUFPLE9BWUE7QUFYaEIsK0JBQTRCO0FBU25CLG9GQVRBLFNBQUcsT0FTQTtBQWVaLG1CQUFtQjtBQUNuQixNQUFhLFdBQVc7SUFNcEIsWUFBWSxLQUFjO1FBTDFCLGFBQVEscUJBQ0QsSUFBSSxFQUNWO1FBSUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNELFVBQVUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRO1FBQ3pDLE9BQU8sSUFBQSx1QkFBVSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUNELFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTTtRQUNoRCxPQUFPLElBQUEseUJBQVcsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU07UUFDbEMsT0FBTyxJQUFBLGVBQU0sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFDRCxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUTtRQUN2QyxPQUFPLElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDRCxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsYUFBYTtRQUN6QyxPQUFPLElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFDRCxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTTtRQUNqQyxPQUFPLElBQUEsbUJBQVEsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFDRCxZQUFZLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU07UUFDakQsT0FBTyxJQUFBLDJCQUFZLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUNELEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTTtRQUN6QyxPQUFPLElBQUEsU0FBRyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFDRCxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTTtRQUNsQyxPQUFPLElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFDRCxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU07UUFDekMsT0FBTyxJQUFBLFNBQUcsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxRSxDQUFDO0NBRUo7QUF4Q0Qsa0NBd0NDIn0=