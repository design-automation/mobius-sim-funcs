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
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Centrality_1.Centrality)(this.__model__, source, entities, method, cen_type);
        });
    }
    ClosestPath(source, target, entities, method, result) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, ClosestPath_1.ClosestPath)(this.__model__, source, target, entities, method, result);
        });
    }
    Degree(source, entities, alpha, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Degree_1.Degree)(this.__model__, source, entities, alpha, method);
        });
    }
    Isovist(origins, entities, radius, num_rays) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Isovist_1.Isovist)(this.__model__, origins, entities, radius, num_rays);
        });
    }
    Nearest(source, target, radius, max_neighbors) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Nearest_1.Nearest)(this.__model__, source, target, radius, max_neighbors);
        });
    }
    Raytrace(rays, entities, dist, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Raytrace_1.Raytrace)(this.__model__, rays, entities, dist, method);
        });
    }
    ShortestPath(source, target, entities, method, result) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, ShortestPath_1.ShortestPath)(this.__model__, source, target, entities, method, result);
        });
    }
    Sky(origins, detail, entities, limits, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Sky_1.Sky)(this.__model__, origins, detail, entities, limits, method);
        });
    }
    SkyDome(origin, detail, radius, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, SkyDome_1.SkyDome)(this.__model__, origin, detail, radius, method);
        });
    }
    Sun(origins, detail, entities, limits, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Sun_1.Sun)(this.__model__, origins, detail, entities, limits, method);
        });
    }
}
exports.AnalyzeFunc = AnalyzeFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYW5hbHl6ZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT0EsOENBQWdDO0FBQ2hDLDZDQUEwQztBQThCakMsMkZBOUJBLHVCQUFVLE9BOEJBO0FBN0JuQiwrQ0FBNEM7QUF5Qm5DLDRGQXpCQSx5QkFBVyxPQXlCQTtBQXhCcEIscUNBQWtDO0FBMEJ6Qix1RkExQkEsZUFBTSxPQTBCQTtBQXpCZix1Q0FBb0M7QUFXM0Isd0ZBWEEsaUJBQU8sT0FXQTtBQVZoQix1Q0FBb0M7QUFrQjNCLHdGQWxCQSxpQkFBTyxPQWtCQTtBQWpCaEIseUNBQXNDO0FBTzdCLHlGQVBBLG1CQUFRLE9BT0E7QUFOakIsaURBQThDO0FBa0JyQyw2RkFsQkEsMkJBQVksT0FrQkE7QUFqQnJCLCtCQUE0QjtBQVNuQixvRkFUQSxTQUFHLE9BU0E7QUFSWix1Q0FBb0M7QUFZM0Isd0ZBWkEsaUJBQU8sT0FZQTtBQVhoQiwrQkFBNEI7QUFTbkIsb0ZBVEEsU0FBRyxPQVNBO0FBZVosbUJBQW1CO0FBQ25CLE1BQWEsV0FBVztJQU1wQixZQUFZLEtBQWM7UUFMMUIsYUFBUSxxQkFDRCxJQUFJLEVBQ1Y7UUFJRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0ssVUFBVSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVE7O1lBQy9DLE9BQU8sSUFBQSx1QkFBVSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDMUUsQ0FBQztLQUFBO0lBQ0ssV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNOztZQUN0RCxPQUFPLElBQUEseUJBQVcsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNqRixDQUFDO0tBQUE7SUFDSyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTTs7WUFDeEMsT0FBTyxJQUFBLGVBQU0sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25FLENBQUM7S0FBQTtJQUNLLE9BQU8sQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFROztZQUM3QyxPQUFPLElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3hFLENBQUM7S0FBQTtJQUNLLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxhQUFhOztZQUMvQyxPQUFPLElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQzFFLENBQUM7S0FBQTtJQUNLLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNOztZQUN2QyxPQUFPLElBQUEsbUJBQVEsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2xFLENBQUM7S0FBQTtJQUNLLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTTs7WUFDdkQsT0FBTyxJQUFBLDJCQUFZLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEYsQ0FBQztLQUFBO0lBQ0ssR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNOztZQUMvQyxPQUFPLElBQUEsU0FBRyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzFFLENBQUM7S0FBQTtJQUNLLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNOztZQUN4QyxPQUFPLElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25FLENBQUM7S0FBQTtJQUNLLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTTs7WUFDL0MsT0FBTyxJQUFBLFNBQUcsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMxRSxDQUFDO0tBQUE7Q0FFSjtBQXhDRCxrQ0F3Q0MifQ==