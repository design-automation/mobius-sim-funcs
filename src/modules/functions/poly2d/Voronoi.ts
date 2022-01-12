import {
    arrMakeFlat,
    EEntType,
    GIModel,
    idsBreak,
    idsMakeFromIdxs,
    isEmptyArr,
    TEntTypeIdx,
    TId,
    Txyz,
} from '@design-automation/mobius-sim';
import Shape from '@doodle3d/clipper-js';
import * as d3vor from 'd3-voronoi';

import { checkIDs, ID } from '../../../_check_ids';
import { _convertPgonToShape, _convertShapesToPgons, _getPgons, _getPosis, IClipCoord, SCALE, TPosisMap } from './_shared';

let ShapeClass = Shape;
//@ts-ignore
if (Shape.default) { ShapeClass = Shape.default; }

// ================================================================================================
/**
 * Create a voronoi subdivision of one or more polygons.
 * \n
 * @param __model__
 * @param pgons A list of polygons, or entities from which polygons can be extracted.
 * @param entities A list of positions, or entities from which positions can be extracted.
 * @returns A list of new polygons.
 */
export function Voronoi(__model__: GIModel, pgons: TId|TId[], entities: TId|TId[]): TId[] {
    pgons = arrMakeFlat(pgons) as TId[];
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(pgons)) { return []; }
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'poly2d.Voronoi';
    let pgons_ents_arr: TEntTypeIdx[];
    let posis_ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        pgons_ents_arr = checkIDs(__model__, fn_name, 'pgons', pgons,
            [ID.isIDL1], null) as TEntTypeIdx[];
        posis_ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
            [ID.isIDL1], null) as TEntTypeIdx[];
    } else {
        // pgons_ents_arr = splitIDs(fn_name, 'pgons', pgons,
        //     [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // posis_ents_arr = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        pgons_ents_arr = idsBreak(pgons) as TEntTypeIdx[];
        posis_ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    // pgons
    const pgons_i: number[] = _getPgons(__model__, pgons_ents_arr);
    if (pgons_i.length === 0) { return []; }
    // posis
    const posis_i: number[] = _getPosis(__model__, posis_ents_arr);
    if (posis_i.length === 0) { return []; }
    // posis
    const d3_cell_points: [number, number][] = [];
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        d3_cell_points.push([xyz[0], xyz[1]]);
    }
    // loop and create cells
    const all_cells_i: number[] = [];
    for (const pgon_i of pgons_i) {
        // pgon and bounds
        const bounds: number[] = [Infinity, Infinity, -Infinity, -Infinity]; // xmin, ymin, xmax, ymax
        // const pgon_shape_coords: IClipCoord[] = [];
        for (const posi_i of __model__.modeldata.geom.nav.navAnyToPosi(EEntType.PGON, pgon_i)) {
            const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
            // pgon_shape_coords.push( { X: xyz[0], Y: xyz[1]} );
            if (xyz[0] < bounds[0]) { bounds[0] = xyz[0]; }
            if (xyz[1] < bounds[1]) { bounds[1] = xyz[1]; }
            if (xyz[0] > bounds[2]) { bounds[2] = xyz[0]; }
            if (xyz[1] > bounds[3]) { bounds[3] = xyz[1]; }
        }
        // const pgon_shape: Shape = new ShapeClass([pgon_shape_coords], true); // TODO holes
        const pgon_shape: Shape = _convertPgonToShape(__model__, pgon_i, posis_map);
        // pgon_shape.scaleUp(SCALE);
        // create voronoi
        const cells_i: number[] = _voronoiOld(__model__, pgon_shape, d3_cell_points, bounds, posis_map);
        for (const cell_i of cells_i) {
            all_cells_i.push(cell_i);
        }
    }
    // return cell pgons
    return idsMakeFromIdxs(EEntType.PGON, all_cells_i) as TId[];
    // return idsMake(all_cells_i.map( cell_i => [EEntType.PGON, cell_i] as TEntTypeIdx )) as TId[];
}
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
function _voronoiOld(__model__: GIModel, pgon_shape: Shape, d3_cell_points: [number, number][],
        bounds: number[], posis_map: TPosisMap): number[] {
    const d3_voronoi = d3vor.voronoi().extent([   [bounds[0], bounds[1]],    [bounds[2], bounds[3]]   ]);
    const d3_voronoi_diag = d3_voronoi(d3_cell_points);
    const shapes: Shape[] = [];
    for (const d3_cell_coords of d3_voronoi_diag.polygons()) {
        if (d3_cell_coords !== undefined) {
            const clipped_shape: Shape = _voronoiClipOld(__model__, pgon_shape, d3_cell_coords as [number, number][]);
            shapes.push(clipped_shape);
        }
    }
    return _convertShapesToPgons(__model__, shapes, posis_map);
}
function _voronoiClipOld(__model__: GIModel, pgon_shape: Shape, d3_cell_coords: [number, number][]): Shape {
    const cell_shape_coords: IClipCoord[] = [];
    // for (const d3_cell_coord of d3_cell_coords) {
    for (let i = 0; i < d3_cell_coords.length; i++) {
        cell_shape_coords.push( {X: d3_cell_coords[i][0], Y: d3_cell_coords[i][1]} );
    }
    const cell_shape: Shape = new ShapeClass([cell_shape_coords], true);
    cell_shape.scaleUp(SCALE);
    const clipped_shape: Shape = pgon_shape.intersect(cell_shape);
    return clipped_shape;
}
