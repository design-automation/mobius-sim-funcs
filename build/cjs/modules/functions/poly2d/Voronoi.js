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
exports.Voronoi = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const clipper_js_1 = __importDefault(require("@doodle3d/clipper-js"));
const d3vor = __importStar(require("d3-voronoi"));
const _check_ids_1 = require("../../../_check_ids");
const _shared_1 = require("./_shared");
let ShapeClass = clipper_js_1.default;
//@ts-ignore
if (clipper_js_1.default.default) {
    ShapeClass = clipper_js_1.default.default;
}
// ================================================================================================
/**
 * Create a voronoi subdivision of one or more polygons.
 * \n
 * @param __model__
 * @param pgons A list of polygons, or entities from which polygons can be extracted.
 * @param entities A list of positions, or entities from which positions can be extracted.
 * @returns A list of new polygons.
 */
function Voronoi(__model__, pgons, entities) {
    pgons = (0, mobius_sim_1.arrMakeFlat)(pgons);
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    if ((0, mobius_sim_1.isEmptyArr)(pgons)) {
        return [];
    }
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'poly2d.Voronoi';
    let pgons_ents_arr;
    let posis_ents_arr;
    if (__model__.debug) {
        pgons_ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'pgons', pgons, [_check_ids_1.ID.isIDL1], null);
        posis_ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isIDL1], null);
    }
    else {
        // pgons_ents_arr = splitIDs(fn_name, 'pgons', pgons,
        //     [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // posis_ents_arr = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        pgons_ents_arr = (0, mobius_sim_1.idsBreak)(pgons);
        posis_ents_arr = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    const posis_map = new Map();
    // pgons
    const pgons_i = (0, _shared_1._getPgons)(__model__, pgons_ents_arr);
    if (pgons_i.length === 0) {
        return [];
    }
    // posis
    const posis_i = (0, _shared_1._getPosis)(__model__, posis_ents_arr);
    if (posis_i.length === 0) {
        return [];
    }
    // posis
    const d3_cell_points = [];
    for (const posi_i of posis_i) {
        const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        d3_cell_points.push([xyz[0], xyz[1]]);
    }
    // loop and create cells
    const all_cells_i = [];
    for (const pgon_i of pgons_i) {
        // pgon and bounds
        const bounds = [Infinity, Infinity, -Infinity, -Infinity]; // xmin, ymin, xmax, ymax
        // const pgon_shape_coords: IClipCoord[] = [];
        for (const posi_i of __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.PGON, pgon_i)) {
            const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
            // pgon_shape_coords.push( { X: xyz[0], Y: xyz[1]} );
            if (xyz[0] < bounds[0]) {
                bounds[0] = xyz[0];
            }
            if (xyz[1] < bounds[1]) {
                bounds[1] = xyz[1];
            }
            if (xyz[0] > bounds[2]) {
                bounds[2] = xyz[0];
            }
            if (xyz[1] > bounds[3]) {
                bounds[3] = xyz[1];
            }
        }
        // const pgon_shape: Shape = new ShapeClass([pgon_shape_coords], true); // TODO holes
        const pgon_shape = (0, _shared_1._convertPgonToShape)(__model__, pgon_i, posis_map);
        // pgon_shape.scaleUp(SCALE);
        // create voronoi
        const cells_i = _voronoiOld(__model__, pgon_shape, d3_cell_points, bounds, posis_map);
        for (const cell_i of cells_i) {
            all_cells_i.push(cell_i);
        }
    }
    // return cell pgons
    return (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.PGON, all_cells_i);
    // return idsMake(all_cells_i.map( cell_i => [EEntType.PGON, cell_i] as TEntTypeIdx )) as TId[];
}
exports.Voronoi = Voronoi;
// There is a bug in d3 new voronoi, it produces wrong results...
// function _voronoi(__model__: GIModel, pgon_shape: Shape, d3_cell_points: [number, number][],
//         bounds: number[], posis_map: TPosisMap): number[] {
//     const d3_delaunay = Delaunay.from(d3_cell_points);
//     const d3_voronoi = d3_delaunay.voronoi(bounds);
//     const shapes: Shape[] = [];
//     for (const d3_cell_coords of Array.from(d3_voronoi.cellPolygons())) {
//         const clipped_shape: Shape = _voronoiClip(__model__, pgon_shape, d3_cell_coords as [number, number][]);
//         shapes.push(clipped_shape);
//     }
//     return _convertShapesToPgons(__model__, shapes, posis_map);
// }
// function _voronoiClip(__model__: GIModel, pgon_shape: Shape, d3_cell_coords: [number, number][]): Shape {
//     const cell_shape_coords: IClipCoord[] = [];
//     // for (const d3_cell_coord of d3_cell_coords) {
//     for (let i = 0; i < d3_cell_coords.length - 1; i++) {
//         cell_shape_coords.push( {X: d3_cell_coords[i][0], Y: d3_cell_coords[i][1]} );
//     }
//     const cell_shape: Shape = new ShapeClass([cell_shape_coords], true);
//     cell_shape.scaleUp(SCALE);
//     const clipped_shape: Shape = pgon_shape.intersect(cell_shape);
//     return clipped_shape;
// }
function _voronoiOld(__model__, pgon_shape, d3_cell_points, bounds, posis_map) {
    const d3_voronoi = d3vor.voronoi().extent([[bounds[0], bounds[1]], [bounds[2], bounds[3]]]);
    const d3_voronoi_diag = d3_voronoi(d3_cell_points);
    const shapes = [];
    for (const d3_cell_coords of d3_voronoi_diag.polygons()) {
        if (d3_cell_coords !== undefined) {
            const clipped_shape = _voronoiClipOld(__model__, pgon_shape, d3_cell_coords);
            shapes.push(clipped_shape);
        }
    }
    return (0, _shared_1._convertShapesToPgons)(__model__, shapes, posis_map);
}
function _voronoiClipOld(__model__, pgon_shape, d3_cell_coords) {
    const cell_shape_coords = [];
    // for (const d3_cell_coord of d3_cell_coords) {
    for (let i = 0; i < d3_cell_coords.length; i++) {
        cell_shape_coords.push({ X: d3_cell_coords[i][0], Y: d3_cell_coords[i][1] });
    }
    const cell_shape = new ShapeClass([cell_shape_coords], true);
    cell_shape.scaleUp(_shared_1.SCALE);
    const clipped_shape = pgon_shape.intersect(cell_shape);
    return clipped_shape;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVm9yb25vaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9wb2x5MmQvVm9yb25vaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhEQVV1QztBQUN2QyxzRUFBeUM7QUFDekMsa0RBQW9DO0FBRXBDLG9EQUFtRDtBQUNuRCx1Q0FBMkg7QUFFM0gsSUFBSSxVQUFVLEdBQUcsb0JBQUssQ0FBQztBQUN2QixZQUFZO0FBQ1osSUFBSSxvQkFBSyxDQUFDLE9BQU8sRUFBRTtJQUFFLFVBQVUsR0FBRyxvQkFBSyxDQUFDLE9BQU8sQ0FBQztDQUFFO0FBRWxELG1HQUFtRztBQUNuRzs7Ozs7OztHQU9HO0FBQ0gsU0FBZ0IsT0FBTyxDQUFDLFNBQWtCLEVBQUUsS0FBZ0IsRUFBRSxRQUFtQjtJQUM3RSxLQUFLLEdBQUcsSUFBQSx3QkFBVyxFQUFDLEtBQUssQ0FBVSxDQUFDO0lBQ3BDLFFBQVEsR0FBRyxJQUFBLHdCQUFXLEVBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsSUFBSSxJQUFBLHVCQUFVLEVBQUMsS0FBSyxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3JDLElBQUksSUFBQSx1QkFBVSxFQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUN4QyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsZ0JBQWdCLENBQUM7SUFDakMsSUFBSSxjQUE2QixDQUFDO0lBQ2xDLElBQUksY0FBNkIsQ0FBQztJQUNsQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsY0FBYyxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQ3hELENBQUMsZUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBa0IsQ0FBQztRQUN4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