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
class AnalyzeFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    Raytrace(rays, entities, dist, method) {
        return (0, Raytrace_1.Raytrace)(this.__model__, rays, entities, dist, method);
    }
    Isovist(origins, entities, radius, num_rays) {
        return (0, Isovist_1.Isovist)(this.__model__, origins, entities, radius, num_rays);
    }
    Sky(origins, detail, entities, limits, method) {
        return (0, Sky_1.Sky)(this.__model__, origins, detail, entities, limits, method);
    }
    Sun(origins, detail, entities, limits, method) {
        return (0, Sun_1.Sun)(this.__model__, origins, detail, entities, limits, method);
    }
    SkyDome(origin, detail, radius, method) {
        return (0, SkyDome_1.SkyDome)(this.__model__, origin, detail, radius, method);
    }
    Nearest(source, target, radius, max_neighbors) {
        return (0, Nearest_1.Nearest)(this.__model__, source, target, radius, max_neighbors);
    }
    ShortestPath(source, target, entities, method, result) {
        return (0, ShortestPath_1.ShortestPath)(this.__model__, source, target, entities, method, result);
    }
    ClosestPath(source, target, entities, method, result) {
        return (0, ClosestPath_1.ClosestPath)(this.__model__, source, target, entities, method, result);
    }
    Degree(source, entities, alpha, method) {
        return (0, Degree_1.Degree)(this.__model__, source, entities, alpha, method);
    }
    Centrality(source, entities, method, cen_type) {
        return (0, Centrality_1.Centrality)(this.__model__, source, entities, method, cen_type);
    }
}
exports.AnalyzeFunc = AnalyzeFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYW5hbHl6ZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT0EsOENBQWdDO0FBQ2hDLDZDQUEwQztBQThCakMsMkZBOUJBLHVCQUFVLE9BOEJBO0FBN0JuQiwrQ0FBNEM7QUF5Qm5DLDRGQXpCQSx5QkFBVyxPQXlCQTtBQXhCcEIscUNBQWtDO0FBMEJ6Qix1RkExQkEsZUFBTSxPQTBCQTtBQXpCZix1Q0FBb0M7QUFXM0Isd0ZBWEEsaUJBQU8sT0FXQTtBQVZoQix1Q0FBb0M7QUFrQjNCLHdGQWxCQSxpQkFBTyxPQWtCQTtBQWpCaEIseUNBQXNDO0FBTzdCLHlGQVBBLG1CQUFRLE9BT0E7QUFOakIsaURBQThDO0FBa0JyQyw2RkFsQkEsMkJBQVksT0FrQkE7QUFqQnJCLCtCQUE0QjtBQVNuQixvRkFUQSxTQUFHLE9BU0E7QUFSWix1Q0FBb0M7QUFZM0Isd0ZBWkEsaUJBQU8sT0FZQTtBQVhoQiwrQkFBNEI7QUFTbkIsb0ZBVEEsU0FBRyxPQVNBO0FBY1osTUFBYSxXQUFXO0lBS3BCLFlBQVksS0FBYztRQUgxQixhQUFRLHFCQUNELElBQUksRUFDVjtRQUVHLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTTtRQUNqQyxPQUFPLElBQUEsbUJBQVEsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFDRCxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUTtRQUN2QyxPQUFPLElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDRCxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU07UUFDekMsT0FBTyxJQUFBLFNBQUcsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBQ0QsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNO1FBQ3pDLE9BQU8sSUFBQSxTQUFHLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUNELE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO1FBQ2xDLE9BQU8sSUFBQSxpQkFBTyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUNELE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxhQUFhO1FBQ3pDLE9BQU8sSUFBQSxpQkFBTyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUNELFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTTtRQUNqRCxPQUFPLElBQUEsMkJBQVksRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsRixDQUFDO0lBQ0QsV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNO1FBQ2hELE9BQU8sSUFBQSx5QkFBVyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFDRCxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTTtRQUNsQyxPQUFPLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUNELFVBQVUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRO1FBQ3pDLE9BQU8sSUFBQSx1QkFBVSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDMUUsQ0FBQztDQUVKO0FBdkNELGtDQXVDQyJ9