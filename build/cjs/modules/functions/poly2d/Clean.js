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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clean = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const clipper_js_1 = __importDefault(require("@doodle3d/clipper-js"));
const _check_ids_1 = require("../../../_check_ids");
const chk = __importStar(require("../../../_check_types"));
const _shared_1 = require("./_shared");
let ShapeClass = clipper_js_1.default;
//@ts-ignore
if (clipper_js_1.default.default) {
    ShapeClass = clipper_js_1.default.default;
}
// Clipper types
// ================================================================================================
/**
 * Clean a polyline or polygon.
 * \n
 * Vertices that are closer together than the specified tolerance will be merged.
 * Vertices that are colinear within the tolerance distance will be deleted.
 * \n
 * @param __model__
 * @param entities A list of polylines or polygons, or entities from which polylines or polygons can be extracted.
 * @param tolerance The tolerance for deleting vertices from the polyline.
 * @returns A list of new polygons.
 */
function Clean(__model__, entities, tolerance) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'poly2d.Clean';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.PLINE, mobius_sim_1.EEntType.PGON]);
        chk.checkArgs(fn_name, 'tolerance', tolerance, [chk.isNum]);
    }
    else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        ents_arr = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    const posis_map = new Map();
    const all_new_ents = [];
    const [pgons_i, plines_i] = (0, _shared_1._getPgonsPlines)(__model__, ents_arr);
    for (const pgon_i of pgons_i) {
        const new_pgons_i = _cleanPgon(__model__, pgon_i, tolerance, posis_map);
        for (const new_pgon_i of new_pgons_i) {
            all_new_ents.push([mobius_sim_1.EEntType.PGON, new_pgon_i]);
        }
    }
    for (const pline_i of plines_i) {
        const new_plines_i = _cleanPline(__model__, pline_i, tolerance, posis_map);
        for (const new_pline_i of new_plines_i) {
            all_new_ents.push([mobius_sim_1.EEntType.PLINE, new_pline_i]);
        }
    }
    return (0, mobius_sim_1.idsMake)(all_new_ents);
}
exports.Clean = Clean;
function _cleanPgon(__model__, pgon_i, tolerance, posis_map) {
    const shape = (0, _shared_1._convertPgonToShape)(__model__, pgon_i, posis_map);
    const result = shape.clean(tolerance * _shared_1.SCALE);
    const result_shape = new ShapeClass(result.paths, result.closed);
    return (0, _shared_1._convertShapesToPgons)(__model__, result_shape, posis_map);
}
function _cleanPline(__model__, pline_i, tolerance, posis_map) {
    const wire_i = __model__.modeldata.geom.nav.navPlineToWire(pline_i);
    const verts_i = __model__.modeldata.geom.nav.navAnyToVert(mobius_sim_1.EEntType.WIRE, wire_i);
    if (verts_i.length === 2) {
        return [pline_i];
    }
    const is_closed = __model__.modeldata.geom.query.isWireClosed(wire_i);
    const shape = (0, _shared_1._convertWireToShape)(__model__, wire_i, is_closed, posis_map);
    const result = shape.clean(tolerance * _shared_1.SCALE);
    const result_shape = new ShapeClass(result.paths, result.closed);
    const shape_num_verts = result_shape.paths[0].length;
    if (shape_num_verts === 0 || shape_num_verts === verts_i.length) {
        return [pline_i];
    }
    return (0, _shared_1._convertShapeToPlines)(__model__, result_shape, result.closed, posis_map);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xlYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvcG9seTJkL0NsZWFuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBU3VDO0FBQ3ZDLHNFQUF5QztBQUV6QyxvREFBbUQ7QUFDbkQsMkRBQTZDO0FBQzdDLHVDQVNtQjtBQUVuQixJQUFJLFVBQVUsR0FBRyxvQkFBSyxDQUFDO0FBQ3ZCLFlBQVk7QUFDWixJQUFJLG9CQUFLLENBQUMsT0FBTyxFQUFFO0lBQUUsVUFBVSxHQUFHLG9CQUFLLENBQUMsT0FBTyxDQUFDO0NBQUU7QUFFbEQsZ0JBQWdCO0FBQ2hCLG1HQUFtRztBQUNuRzs7Ozs7Ozs7OztHQVVHO0FBQ0gsU0FBZ0IsS0FBSyxDQUFDLFNBQWtCLEVBQUUsUUFBbUIsRUFBRSxTQUFpQjtJQUM1RSxRQUFRLEdBQUcsSUFBQSx3QkFBVyxFQUFDLFFBQVEsQ0FBVSxDQUFDO0lBQzFDLElBQUksSUFBQSx1QkFBVSxFQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUN4QyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDO0lBQy9CLElBQUksUUFBdUIsQ0FBQztJQUM1QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsUUFBUSxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQ3hELENBQUMsZUFBRSxDQUFDLElBQUksRUFBRSxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxxQkFBUSxDQUFDLEtBQUssRUFBRSxxQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFrQixDQUFDO1FBQzVFLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLENB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