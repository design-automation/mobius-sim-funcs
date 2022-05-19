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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYW5hbHl6ZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT0EsOENBQWdDO0FBQ2hDLDZDQUEwQztBQStCakMsMkZBL0JBLHVCQUFVLE9BK0JBO0FBOUJuQiwrQ0FBNEM7QUEwQm5DLDRGQTFCQSx5QkFBVyxPQTBCQTtBQXpCcEIscUNBQWtDO0FBMkJ6Qix1RkEzQkEsZUFBTSxPQTJCQTtBQTFCZix1Q0FBb0M7QUFZM0Isd0ZBWkEsaUJBQU8sT0FZQTtBQVhoQix1Q0FBb0M7QUFtQjNCLHdGQW5CQSxpQkFBTyxPQW1CQTtBQWxCaEIseUNBQXNDO0FBUTdCLHlGQVJBLG1CQUFRLE9BUUE7QUFQakIsaURBQThDO0FBbUJyQyw2RkFuQkEsMkJBQVksT0FtQkE7QUFsQnJCLCtCQUE0QjtBQVVuQixvRkFWQSxTQUFHLE9BVUE7QUFUWix1Q0FBb0M7QUFhM0Isd0ZBYkEsaUJBQU8sT0FhQTtBQVpoQiwrQkFBNEI7QUFVbkIsb0ZBVkEsU0FBRyxPQVVBO0FBVFosaUNBQThCO0FBdUJyQixxRkF2QkEsV0FBSSxPQXVCQTtBQXRCYiw2Q0FBMEM7QUF3QmpDLDJGQXhCQSx1QkFBVSxPQXdCQTtBQUduQixtQkFBbUI7QUFDbkIsTUFBYSxXQUFXO0lBTXBCLFlBQVksS0FBYztRQUwxQixhQUFRLHFCQUNELElBQUksRUFDVjtRQUlHLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxVQUFVLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUTtRQUN6QyxPQUFPLElBQUEsdUJBQVUsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFDRCxX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