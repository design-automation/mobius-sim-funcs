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
exports.Poly2dFunc = exports.Clean = exports.Stitch = exports.OffsetRound = exports.OffsetChamfer = exports.OffsetMitre = exports.Boolean = exports.Union = exports.BBoxPolygon = exports.ConvexHull = exports.Delaunay = exports.Voronoi = void 0;
const Enum = __importStar(require("./_enum"));
const BBoxPolygon_1 = require("./BBoxPolygon");
Object.defineProperty(exports, "BBoxPolygon", { enumerable: true, get: function () { return BBoxPolygon_1.BBoxPolygon; } });
const Boolean_1 = require("./Boolean");
Object.defineProperty(exports, "Boolean", { enumerable: true, get: function () { return Boolean_1.Boolean; } });
const Clean_1 = require("./Clean");
Object.defineProperty(exports, "Clean", { enumerable: true, get: function () { return Clean_1.Clean; } });
const ConvexHull_1 = require("./ConvexHull");
Object.defineProperty(exports, "ConvexHull", { enumerable: true, get: function () { return ConvexHull_1.ConvexHull; } });
const Delaunay_1 = require("./Delaunay");
Object.defineProperty(exports, "Delaunay", { enumerable: true, get: function () { return Delaunay_1.Delaunay; } });
const OffsetChamfer_1 = require("./OffsetChamfer");
Object.defineProperty(exports, "OffsetChamfer", { enumerable: true, get: function () { return OffsetChamfer_1.OffsetChamfer; } });
const OffsetMitre_1 = require("./OffsetMitre");
Object.defineProperty(exports, "OffsetMitre", { enumerable: true, get: function () { return OffsetMitre_1.OffsetMitre; } });
const OffsetRound_1 = require("./OffsetRound");
Object.defineProperty(exports, "OffsetRound", { enumerable: true, get: function () { return OffsetRound_1.OffsetRound; } });
const Stitch_1 = require("./Stitch");
Object.defineProperty(exports, "Stitch", { enumerable: true, get: function () { return Stitch_1.Stitch; } });
const Union_1 = require("./Union");
Object.defineProperty(exports, "Union", { enumerable: true, get: function () { return Union_1.Union; } });
const Voronoi_1 = require("./Voronoi");
Object.defineProperty(exports, "Voronoi", { enumerable: true, get: function () { return Voronoi_1.Voronoi; } });
class Poly2dFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    Voronoi(pgons, entities) {
        return (0, Voronoi_1.Voronoi)(this.__model__, pgons, entities);
    }
    Delaunay(entities) {
        return (0, Delaunay_1.Delaunay)(this.__model__, entities);
    }
    ConvexHull(entities) {
        return (0, ConvexHull_1.ConvexHull)(this.__model__, entities);
    }
    BBoxPolygon(entities, method) {
        return (0, BBoxPolygon_1.BBoxPolygon)(this.__model__, entities, method);
    }
    Union(entities) {
        return (0, Union_1.Union)(this.__model__, entities);
    }
    Boolean(a_entities, b_entities, method) {
        return (0, Boolean_1.Boolean)(this.__model__, a_entities, b_entities, method);
    }
    OffsetMitre(entities, dist, limit, end_type) {
        return (0, OffsetMitre_1.OffsetMitre)(this.__model__, entities, dist, limit, end_type);
    }
    OffsetChamfer(entities, dist, end_type) {
        return (0, OffsetChamfer_1.OffsetChamfer)(this.__model__, entities, dist, end_type);
    }
    OffsetRound(entities, dist, tolerance, end_type) {
        return (0, OffsetRound_1.OffsetRound)(this.__model__, entities, dist, tolerance, end_type);
    }
    Stitch(entities, tolerance) {
        return (0, Stitch_1.Stitch)(this.__model__, entities, tolerance);
    }
    Clean(entities, tolerance) {
        return (0, Clean_1.Clean)(this.__model__, entities, tolerance);
    }
}
exports.Poly2dFunc = Poly2dFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvcG9seTJkL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSw4Q0FBZ0M7QUFDaEMsK0NBQTRDO0FBZW5DLDRGQWZBLHlCQUFXLE9BZUE7QUFkcEIsdUNBQW9DO0FBZ0IzQix3RkFoQkEsaUJBQU8sT0FnQkE7QUFmaEIsbUNBQWdDO0FBb0J2QixzRkFwQkEsYUFBSyxPQW9CQTtBQW5CZCw2Q0FBMEM7QUFXakMsMkZBWEEsdUJBQVUsT0FXQTtBQVZuQix5Q0FBc0M7QUFTN0IseUZBVEEsbUJBQVEsT0FTQTtBQVJqQixtREFBZ0Q7QUFjdkMsOEZBZEEsNkJBQWEsT0FjQTtBQWJ0QiwrQ0FBNEM7QUFZbkMsNEZBWkEseUJBQVcsT0FZQTtBQVhwQiwrQ0FBNEM7QUFhbkMsNEZBYkEseUJBQVcsT0FhQTtBQVpwQixxQ0FBa0M7QUFhekIsdUZBYkEsZUFBTSxPQWFBO0FBWmYsbUNBQWdDO0FBT3ZCLHNGQVBBLGFBQUssT0FPQTtBQU5kLHVDQUFvQztBQUUzQix3RkFGQSxpQkFBTyxPQUVBO0FBV2hCLE1BQWEsVUFBVTtJQUtuQixZQUFZLEtBQWM7UUFIMUIsYUFBUSxxQkFDRCxJQUFJLEVBQ1Y7UUFFRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRO1FBQ25CLE9BQU8sSUFBQSxpQkFBTyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFDRCxRQUFRLENBQUMsUUFBUTtRQUNiLE9BQU8sSUFBQSxtQkFBUSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUNELFVBQVUsQ0FBQyxRQUFRO1FBQ2YsT0FBTyxJQUFBLHVCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsV0FBVyxDQUFDLFFBQVEsRUFBRSxNQUFNO1FBQ3hCLE9BQU8sSUFBQSx5QkFBVyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDRCxLQUFLLENBQUMsUUFBUTtRQUNWLE9BQU8sSUFBQSxhQUFLLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBQ0QsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTTtRQUNsQyxPQUFPLElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUNELFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRO1FBQ3ZDLE9BQU8sSUFBQSx5QkFBVyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUNELGFBQWEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVE7UUFDbEMsT0FBTyxJQUFBLDZCQUFhLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFDRCxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsUUFBUTtRQUMzQyxPQUFPLElBQUEseUJBQVcsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFDRCxNQUFNLENBQUMsUUFBUSxFQUFFLFNBQVM7UUFDdEIsT0FBTyxJQUFBLGVBQU0sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBQ0QsS0FBSyxDQUFDLFFBQVEsRUFBRSxTQUFTO1FBQ3JCLE9BQU8sSUFBQSxhQUFLLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDdEQsQ0FBQztDQUNKO0FBekNELGdDQXlDQyJ9