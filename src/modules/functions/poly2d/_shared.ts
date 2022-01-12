/**
 * The `poly2D` module has a set of functions for working with 2D polygons, on the XY plane.
 * @module
 */
import { EEntType, GIModel, TEntTypeIdx, Txyz } from '@design-automation/mobius-sim';
import Shape from '@doodle3d/clipper-js';
import * as d3poly from 'd3-polygon';

import { _EClipEndType } from './_enum';

let ShapeClass = Shape;
//@ts-ignore
if (Shape.default) { ShapeClass = Shape.default; }

export const SCALE = 1e9;
export type TPosisMap = Map<number, Map<number, number>>;
// Clipper types
export interface IClipCoord {
    X: number;
    Y: number;
}
type TClipPath = IClipCoord[];
type TClipPaths = TClipPath[];
export interface IClipResult {
    closed: boolean;
    paths: TClipPaths;
}
export interface IClipOffsetOptions {
    jointType: string;
    endType: string;
    miterLimit?: number;
    roundPrecision?: number;
}
export const MClipOffsetEndType: Map<string, string> = new Map([
    ['square_end', _EClipEndType.OPEN_SQUARE],
    ['round_end', _EClipEndType.OPEN_ROUND],
    ['butt_end', _EClipEndType.OPEN_BUTT]
]);

// ================================================================================================
// get polygons from the model
export function _getPgons(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[] {
    const set_pgons_i: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case EEntType.PLINE:
            case EEntType.POINT:
                break;
            case EEntType.PGON:
                set_pgons_i.add(ent_i);
                break;
            case EEntType.COLL:
                const coll_pgons_i: number[] = __model__.modeldata.geom.nav.navCollToPgon(ent_i);
                for (const coll_pgon_i of coll_pgons_i) {
                    set_pgons_i.add(coll_pgon_i);
                }
                break;
            default:
                const ent_pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
                for (const ent_pgon_i of ent_pgons_i) {
                    set_pgons_i.add(ent_pgon_i);
                }
                break;
        }
    }
    return Array.from(set_pgons_i);
}
// get polygons and polylines from the model
export function _getPgonsPlines(__model__: GIModel, ents_arr: TEntTypeIdx[]): [number[], number[]] {
    const set_pgons_i: Set<number> = new Set();
    const set_plines_i: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case EEntType.PLINE:
                set_plines_i.add(ent_i);
                break;
            case EEntType.POINT:
                break;
            case EEntType.PGON:
                set_pgons_i.add(ent_i);
                break;
            case EEntType.COLL:
                const coll_pgons_i: number[] = __model__.modeldata.geom.nav.navCollToPgon(ent_i);
                for (const coll_pgon_i of coll_pgons_i) {
                    set_pgons_i.add(coll_pgon_i);
                }
                const coll_plines_i: number[] = __model__.modeldata.geom.nav.navCollToPline(ent_i);
                for (const coll_pline_i of coll_plines_i) {
                    set_plines_i.add(coll_pline_i);
                }
                break;
            default:
                const ent_pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
                for (const ent_pgon_i of ent_pgons_i) {
                    set_pgons_i.add(ent_pgon_i);
                }
                const ent_plines_i: number[] = __model__.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
                for (const ent_pline_i of ent_plines_i) {
                    set_plines_i.add(ent_pline_i);
                }
                break;
        }
    }
    return [Array.from(set_pgons_i), Array.from(set_plines_i)];
}
// get posis from the model
export function _getPosis(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[] {
    const set_posis_i: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case EEntType.POSI:
                set_posis_i.add(ent_i);
                break;
            default:
                const ent_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
                for (const ent_posi_i of ent_posis_i) {
                    set_posis_i.add(ent_posi_i);
                }
                break;
        }
    }
    return Array.from(set_posis_i);
}

// ================================================================================================
// clipperjs -> Mobius Posi
export function _getPosiFromMap(__model__: GIModel, x: number, y: number, posis_map: TPosisMap): number {
    // TODO consider using a hash function insetad of a double map
    // try to find this coord in the map
    // if not found, create a new posi and add it to the map
    let posi_i: number;
    let map1 = posis_map.get(x);
    if (map1 !== undefined) {
        posi_i = map1.get(y);
    } else {
        map1 = new Map();
        posis_map.set(x, map1);
    }
    if (posi_i === undefined) {
        posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, [x, y, 0]);
        map1.set(y, posi_i);
    }
    return posi_i;
}
function _putPosiInMap(x: number, y: number, posi_i: number, posis_map: TPosisMap): void {
    let map1 = posis_map.get(x);
    if (map1 === undefined) {
        map1 = new Map();
    }
    map1.set(y, posi_i);
}
// mobius -> clipperjs
export function _convertPgonToShape(__model__: GIModel, pgon_i: number, posis_map: TPosisMap): Shape {
    const wires_i: number[] = __model__.modeldata.geom.nav.navAnyToWire(EEntType.PGON, pgon_i);
    const shape_coords: TClipPaths = [];
    for (const wire_i of wires_i) {
        const len: number = shape_coords.push([]);
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
        for (const posi_i of posis_i) {
            const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
            const coord: IClipCoord = { X: xyz[0], Y: xyz[1] };
            shape_coords[len - 1].push(coord);
            _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
        }
    }
    const shape: Shape = new ShapeClass(shape_coords, true);
    shape.scaleUp(SCALE);
    return shape;
}
// clipperjs
export function _convertPgonsToShapeUnion(__model__: GIModel, pgons_i: number[], posis_map: TPosisMap): Shape {
    let result_shape: Shape = null;
    for (const pgon_i of pgons_i) {
        const shape: Shape = _convertPgonToShape(__model__, pgon_i, posis_map);
        if (result_shape == null) {
            result_shape = shape;
        } else {
            result_shape = result_shape.union(shape);
        }
    }
    return result_shape;
}
// clipperjs
function _convertPgonsToShapeJoin(__model__: GIModel, pgons_i: number[], posis_map: TPosisMap): Shape {
    let result_shape: Shape = null;
    for (const pgon_i of pgons_i) {
        const shape: Shape = _convertPgonToShape(__model__, pgon_i, posis_map);
        if (result_shape == null) {
            result_shape = shape;
        } else {
            result_shape = result_shape.join(shape);
        }
    }
    return result_shape;
}
// mobius -> clipperjs
export function _convertWireToShape(__model__: GIModel, wire_i: number, is_closed: boolean, posis_map: TPosisMap): Shape {
    const shape_coords: TClipPaths = [];
    shape_coords.push([]);
    const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        const coord: IClipCoord = { X: xyz[0], Y: xyz[1] };
        shape_coords[0].push(coord);
        _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
    }
    const shape: Shape = new ShapeClass(shape_coords, is_closed);
    shape.scaleUp(SCALE);
    return shape;
}
// mobius -> clipperjs
export function _convertPlineToShape(__model__: GIModel, pline_i: number, posis_map: TPosisMap): Shape {
    const wire_i: number = __model__.modeldata.geom.nav.navPlineToWire(pline_i);
    const is_closed: boolean = __model__.modeldata.geom.query.isWireClosed(wire_i);
    const shape_coords: TClipPaths = [];
    shape_coords.push([]);
    const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.PLINE, pline_i);
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        const coord: IClipCoord = { X: xyz[0], Y: xyz[1] };
        shape_coords[0].push(coord);
        _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
    }
    if (is_closed) {
        // close the pline by adding an extra point
        const first: IClipCoord = shape_coords[0][0];
        const last: IClipCoord = { X: first.X, Y: first.Y };
        shape_coords[0].push(last);
    }
    const shape: Shape = new ShapeClass(shape_coords, false); // this is always false, even if pline is closed
    shape.scaleUp(SCALE);
    return shape;
}
// clipperjs -> mobius
export function _convertShapesToPgons(__model__: GIModel, shapes: Shape | Shape[], posis_map: TPosisMap): number[] {
    shapes = Array.isArray(shapes) ? shapes : [shapes];
    const pgons_i: number[] = [];
    for (const shape of shapes) {
        shape.scaleDown(SCALE);
        const sep_shapes: Shape[] = shape.separateShapes();
        for (const sep_shape of sep_shapes) {
            const posis_i: number[][] = [];
            const paths: TClipPaths = sep_shape.paths;
            for (const path of paths) {
                if (path.length === 0) { continue; }
                const len: number = posis_i.push([]);
                for (const coord of path) {
                    const posi_i: number = _getPosiFromMap(__model__, coord.X, coord.Y, posis_map);
                    posis_i[len - 1].push(posi_i);
                }
            }
            if (posis_i.length === 0) { continue; }
            const outer_posis_i: number[] = posis_i[0];
            const holes_posis_i: number[][] = posis_i.slice(1);
            const pgon_i: number = __model__.modeldata.geom.add.addPgon(outer_posis_i, holes_posis_i);
            pgons_i.push(pgon_i);
        }
    }
    return pgons_i;
}
// clipperjs
export function _convertShapeToPlines(__model__: GIModel, shape: Shape, is_closed: boolean, posis_map: TPosisMap): number[] {
    shape.scaleDown(SCALE);
    const sep_shapes: Shape[] = shape.separateShapes();
    const plines_i: number[] = [];
    for (const sep_shape of sep_shapes) {
        const paths: TClipPaths = sep_shape.paths;
        for (const path of paths) {
            if (path.length === 0) { continue; }
            const list_posis_i: number[] = [];
            for (const coord of path) {
                const posi_i: number = _getPosiFromMap(__model__, coord.X, coord.Y, posis_map);
                list_posis_i.push(posi_i);
            }
            if (list_posis_i.length < 2) { continue; }
            const pgon_i: number = __model__.modeldata.geom.add.addPline(list_posis_i, is_closed);
            plines_i.push(pgon_i);
        }
    }
    return plines_i;
}
// clipperjs
export function _convertShapeToCutPlines(__model__: GIModel, shape: Shape, posis_map: TPosisMap): number[] {
    shape.scaleDown(SCALE);
    const sep_shapes: Shape[] = shape.separateShapes();
    const lists_posis_i: number[][] = [];
    for (const sep_shape of sep_shapes) {
        const paths: TClipPaths = sep_shape.paths;
        for (const path of paths) {
            if (path.length === 0) { continue; }
            const posis_i: number[] = [];
            // make a list of posis
            for (const coord of path) {
                const posi_i: number = _getPosiFromMap(__model__, coord.X, coord.Y, posis_map);
                posis_i.push(posi_i);
            }
            // must have at least 2 posis
            if (posis_i.length < 2) { continue; }
            // add the list
            lists_posis_i.push(posis_i);
        }
    }
    // see if there is a join between two lists
    // this can occur when boolean with closed polylines
    // for each closed polyline in the input, there can only be one merge
    // this is the point where the end meets the start
    const to_merge: number[][] = [];
    for (let p = 0; p < lists_posis_i.length; p++) {
        const posis0: number[] = lists_posis_i[p];
        for (let q = 0; q < lists_posis_i.length; q++) {
            const posis1: number[] = lists_posis_i[q];
            if (p !== q && posis0[posis0.length - 1] === posis1[0]) {
                to_merge.push([p, q]);
            }
        }
    }
    for (const [p, q] of to_merge) {
        // copy posis from sub list q to sub list p
        // skip the first posi
        for (let idx = 1; idx < lists_posis_i[q].length; idx++) {
            const posi_i: number = lists_posis_i[q][idx];
            lists_posis_i[p].push(posi_i);
        }
        // set sub list q to null
        lists_posis_i[q] = null;
    }
    // create plines and check closed
    const plines_i: number[] = [];
    for (const posis_i of lists_posis_i) {
        if (posis_i === null) { continue; }
        const is_closed = posis_i[0] === posis_i[posis_i.length - 1];
        if (is_closed) { posis_i.splice(posis_i.length - 1, 1); }
        const pline_i: number = __model__.modeldata.geom.add.addPline(posis_i, is_closed);
        plines_i.push(pline_i);
    }
    // return the list of new plines
    return plines_i;
}
// clipperjs
function _printPaths(paths: TClipPaths, mesage: string) {
    console.log(mesage);
    for (const path of paths) {
        console.log('    PATH');
        for (const coord of path) {
            console.log('        ', JSON.stringify(coord));
        }
    }
}
export function _convexHull(__model__: GIModel, posis_i: number[]): number[] {
    const points: [number, number][] = [];
    const posis_map: TPosisMap = new Map();
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        points.push([xyz[0], xyz[1]]);
        _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
    }
    if (points.length < 3) { return null; }
    // loop and create hull
    const hull_points: [number, number][] = d3poly.polygonHull(points);
    const hull_posis_i: number[] = [];
    for (const hull_point of hull_points) {
        const hull_posi_i: number = _getPosiFromMap(__model__, hull_point[0], hull_point[1], posis_map);
        hull_posis_i.push(hull_posi_i);
    }
    hull_posis_i.reverse();
    return hull_posis_i;
}
export function _offsetPgon(__model__: GIModel, pgon_i: number, dist: number,
    options: IClipOffsetOptions, posis_map: TPosisMap): number[] {
    options.endType = _EClipEndType.CLOSED_PGON;
    const shape: Shape = _convertPgonToShape(__model__, pgon_i, posis_map);
    const result: IClipResult = shape.offset(dist * SCALE, options);
    const result_shape: Shape = new ShapeClass(result.paths, result.closed);
    return _convertShapesToPgons(__model__, result_shape, posis_map);
}
export function _offsetPline(__model__: GIModel, pline_i: number, dist: number,
    options: IClipOffsetOptions, posis_map: TPosisMap): number[] {
    const wire_i: number = __model__.modeldata.geom.nav.navPlineToWire(pline_i);
    const is_closed: boolean = __model__.modeldata.geom.query.isWireClosed(wire_i);
    if (is_closed) {
        options.endType = _EClipEndType.CLOSED_PLINE;
    }
    const shape: Shape = _convertWireToShape(__model__, wire_i, is_closed, posis_map);
    const result: IClipResult = shape.offset(dist * SCALE, options);
    const result_shape: Shape = new ShapeClass(result.paths, result.closed);
    return _convertShapesToPgons(__model__, result_shape, posis_map);
}
