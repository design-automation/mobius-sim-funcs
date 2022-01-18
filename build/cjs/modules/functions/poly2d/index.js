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
// CLASS DEFINITION
class Poly2dFunc {
    constructor(model) {
        this.__enum__ = Object.assign({}, Enum);
        this.__model__ = model;
    }
    BBoxPolygon(entities, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, BBoxPolygon_1.BBoxPolygon)(this.__model__, entities, method);
        });
    }
    Boolean(a_entities, b_entities, method) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Boolean_1.Boolean)(this.__model__, a_entities, b_entities, method);
        });
    }
    Clean(entities, tolerance) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Clean_1.Clean)(this.__model__, entities, tolerance);
        });
    }
    ConvexHull(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, ConvexHull_1.ConvexHull)(this.__model__, entities);
        });
    }
    Delaunay(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Delaunay_1.Delaunay)(this.__model__, entities);
        });
    }
    OffsetChamfer(entities, dist, end_type) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, OffsetChamfer_1.OffsetChamfer)(this.__model__, entities, dist, end_type);
        });
    }
    OffsetMitre(entities, dist, limit, end_type) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, OffsetMitre_1.OffsetMitre)(this.__model__, entities, dist, limit, end_type);
        });
    }
    OffsetRound(entities, dist, tolerance, end_type) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, OffsetRound_1.OffsetRound)(this.__model__, entities, dist, tolerance, end_type);
        });
    }
    Stitch(entities, tolerance) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Stitch_1.Stitch)(this.__model__, entities, tolerance);
        });
    }
    Union(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Union_1.Union)(this.__model__, entities);
        });
    }
    Voronoi(pgons, entities) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Voronoi_1.Voronoi)(this.__model__, pgons, entities);
        });
    }
}
exports.Poly2dFunc = Poly2dFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvcG9seTJkL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNQSw4Q0FBZ0M7QUFDaEMsK0NBQTRDO0FBZW5DLDRGQWZBLHlCQUFXLE9BZUE7QUFkcEIsdUNBQW9DO0FBZ0IzQix3RkFoQkEsaUJBQU8sT0FnQkE7QUFmaEIsbUNBQWdDO0FBb0J2QixzRkFwQkEsYUFBSyxPQW9CQTtBQW5CZCw2Q0FBMEM7QUFXakMsMkZBWEEsdUJBQVUsT0FXQTtBQVZuQix5Q0FBc0M7QUFTN0IseUZBVEEsbUJBQVEsT0FTQTtBQVJqQixtREFBZ0Q7QUFjdkMsOEZBZEEsNkJBQWEsT0FjQTtBQWJ0QiwrQ0FBNEM7QUFZbkMsNEZBWkEseUJBQVcsT0FZQTtBQVhwQiwrQ0FBNEM7QUFhbkMsNEZBYkEseUJBQVcsT0FhQTtBQVpwQixxQ0FBa0M7QUFhekIsdUZBYkEsZUFBTSxPQWFBO0FBWmYsbUNBQWdDO0FBT3ZCLHNGQVBBLGFBQUssT0FPQTtBQU5kLHVDQUFvQztBQUUzQix3RkFGQSxpQkFBTyxPQUVBO0FBWWhCLG1CQUFtQjtBQUNuQixNQUFhLFVBQVU7SUFNbkIsWUFBWSxLQUFjO1FBTDFCLGFBQVEscUJBQ0QsSUFBSSxFQUNWO1FBSUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNLLFdBQVcsQ0FBQyxRQUFRLEVBQUUsTUFBTTs7WUFDOUIsT0FBTyxJQUFBLHlCQUFXLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDekQsQ0FBQztLQUFBO0lBQ0ssT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTTs7WUFDeEMsT0FBTyxJQUFBLGlCQUFPLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25FLENBQUM7S0FBQTtJQUNLLEtBQUssQ0FBQyxRQUFRLEVBQUUsU0FBUzs7WUFDM0IsT0FBTyxJQUFBLGFBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN0RCxDQUFDO0tBQUE7SUFDSyxVQUFVLENBQUMsUUFBUTs7WUFDckIsT0FBTyxJQUFBLHVCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNoRCxDQUFDO0tBQUE7SUFDSyxRQUFRLENBQUMsUUFBUTs7WUFDbkIsT0FBTyxJQUFBLG1CQUFRLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM5QyxDQUFDO0tBQUE7SUFDSyxhQUFhLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFROztZQUN4QyxPQUFPLElBQUEsNkJBQWEsRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbkUsQ0FBQztLQUFBO0lBQ0ssV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVE7O1lBQzdDLE9BQU8sSUFBQSx5QkFBVyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEUsQ0FBQztLQUFBO0lBQ0ssV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVE7O1lBQ2pELE9BQU8sSUFBQSx5QkFBVyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDNUUsQ0FBQztLQUFBO0lBQ0ssTUFBTSxDQUFDLFFBQVEsRUFBRSxTQUFTOztZQUM1QixPQUFPLElBQUEsZUFBTSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7S0FBQTtJQUNLLEtBQUssQ0FBQyxRQUFROztZQUNoQixPQUFPLElBQUEsYUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDM0MsQ0FBQztLQUFBO0lBQ0ssT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFROztZQUN6QixPQUFPLElBQUEsaUJBQU8sRUFBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNwRCxDQUFDO0tBQUE7Q0FFSjtBQTNDRCxnQ0EyQ0MifQ==