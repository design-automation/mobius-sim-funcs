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
exports.AnalyzeFunc = exports.Visibility = exports.View = exports.Centrality = exports.Degree = exports.ClosestPath = exports.ShortestPath = exports.Nearest = exports.SkyDome = exports.Sun = exports.Sky = exports.Isovist = exports.Raytrace = void 0;
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
const View_1 = require("./View");
Object.defineProperty(exports, "View", { enumerable: true, get: function () { return View_1.View; } });
const Visibility_1 = require("./Visibility");
Object.defineProperty(exports, "Visibility", { enumerable: true, get: function () { return Visibility_1.Visibility; } });
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
    View(origins, entities, radius, num_rays, view_ang) {
        return (0, View_1.View)(this.__model__, origins, entities, radius, num_rays, view_ang);
    }
    Visibility(origins, entities, radius, targets) {
        return (0, Visibility_1.Visibility)(this.__model__, origins, entities, radius, targets);
    }
}
exports.AnalyzeFunc = AnalyzeFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYW5hbHl6ZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9BLDhDQUFnQztBQUNoQyw2Q0FBMEM7QUErQmpDLDJGQS9CQSx1QkFBVSxPQStCQTtBQTlCbkIsK0NBQTRDO0FBMEJuQyw0RkExQkEseUJBQVcsT0EwQkE7QUF6QnBCLHFDQUFrQztBQTJCekIsdUZBM0JBLGVBQU0sT0EyQkE7QUExQmYsdUNBQW9DO0FBWTNCLHdGQVpBLGlCQUFPLE9BWUE7QUFYaEIsdUNBQW9DO0FBbUIzQix3RkFuQkEsaUJBQU8sT0FtQkE7QUFsQmhCLHlDQUFzQztBQVE3Qix5RkFSQSxtQkFBUSxPQVFBO0FBUGpCLGlEQUE4QztBQW1CckMsNkZBbkJBLDJCQUFZLE9BbUJBO0FBbEJyQiwrQkFBNEI7QUFVbkIsb0ZBVkEsU0FBRyxPQVVBO0FBVFosdUNBQW9DO0FBYTNCLHdGQWJBLGlCQUFPLE9BYUE7QUFaaEIsK0JBQTRCO0FBVW5CLG9GQVZBLFNBQUcsT0FVQTtBQVRaLGlDQUE4QjtBQXVCckIscUZBdkJBLFdBQUksT0F1QkE7QUF0QmIsNkNBQTBDO0FBd0JqQywyRkF4QkEsdUJBQVUsT0F3QkE7QUFHbkIsbUJBQW1CO0FBQ25CLE1BQWEsV0FBVztJQU1wQixZQUFZLEtBQWM7UUFMMUIsYUFBUSxxQkFDRCxJQUFJLEVBQ1Y7UUFJRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsVUFBVSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVE7UUFDekMsT0FBTyxJQUFBLHVCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lB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