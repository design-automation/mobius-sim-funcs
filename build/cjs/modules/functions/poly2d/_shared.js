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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._offsetPline = exports._offsetPgon = exports._convexHull = exports._convertShapeToCutPlines = exports._convertShapeToPlines = exports._convertShapesToPgons = exports._convertPlineToShape = exports._convertWireToShape = exports._convertPgonsToShapeUnion = exports._convertPgonToShape = exports._getPosiFromMap = exports._getPosis = exports._getPgonsPlines = exports._getPgons = exports.MClipOffsetEndType = exports.SCALE = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const clipper_js_1 = __importDefault(require("@doodle3d/clipper-js"));
const d3poly = __importStar(require("d3-polygon"));
const _enum_1 = require("./_enum");
let ShapeClass = clipper_js_1.default;
//@ts-ignore
if (clipper_js_1.default.default) {
    ShapeClass = clipper_js_1.default.default;
}
exports.SCALE = 1e9;
exports.MClipOffsetEndType = new Map([
    ['square_end', _enum_1._EClipEndType.OPEN_SQUARE],
    ['round_end', _enum_1._EClipEndType.OPEN_ROUND],
    ['butt_end', _enum_1._EClipEndType.OPEN_BUTT]
]);
// ================================================================================================
// get polygons from the model
function _getPgons(__model__, ents_arr) {
    const set_pgons_i = new Set();
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case mobius_sim_1.EEntType.PLINE:
            case mobius_sim_1.EEntType.POINT:
                break;
            case mobius_sim_1.EEntType.PGON:
                set_pgons_i.add(ent_i);
                break;
            case mobius_sim_1.EEntType.COLL:
                const coll_pgons_i = __model__.modeldata.geom.nav.navCollToPgon(ent_i);
                for (const coll_pgon_i of coll_pgons_i) {
                    set_pgons_i.add(coll_pgon_i);
                }
                break;
            default:
                const ent_pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
                for (const ent_pgon_i of ent_pgons_i) {
                    set_pgons_i.add(ent_pgon_i);
                }
                break;
        }
    }
    return Array.from(set_pgons_i);
}
exports._getPgons = _getPgons;
// get polygons and polylines from the model
function _getPgonsPlines(__model__, ents_arr) {
    const set_pgons_i = new Set();
    const set_plines_i = new Set();
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case mobius_sim_1.EEntType.PLINE:
                set_plines_i.add(ent_i);
                break;
            case mobius_sim_1.EEntType.POINT:
                break;
            case mobius_sim_1.EEntType.PGON:
                set_pgons_i.add(ent_i);
                break;
            case mobius_sim_1.EEntType.COLL:
                const coll_pgons_i = __model__.modeldata.geom.nav.navCollToPgon(ent_i);
                for (const coll_pgon_i of coll_pgons_i) {
                    set_pgons_i.add(coll_pgon_i);
                }
                const coll_plines_i = __model__.modeldata.geom.nav.navCollToPline(ent_i);
                for (const coll_pline_i of coll_plines_i) {
                    set_plines_i.add(coll_pline_i);
                }
                break;
            default:
                const ent_pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
                for (const ent_pgon_i of ent_pgons_i) {
                    set_pgons_i.add(ent_pgon_i);
                }
                const ent_plines_i = __model__.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
                for (const ent_pline_i of ent_plines_i) {
                    set_plines_i.add(ent_pline_i);
                }
                break;
        }
    }
    return [Array.from(set_pgons_i), Array.from(set_plines_i)];
}
exports._getPgonsPlines = _getPgonsPlines;
// get posis from the model
function _getPosis(__model__, ents_arr) {
    const set_posis_i = new Set();
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case mobius_sim_1.EEntType.POSI:
                set_posis_i.add(ent_i);
                break;
            default:
                const ent_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
                for (const ent_posi_i of ent_posis_i) {
                    set_posis_i.add(ent_posi_i);
                }
                break;
        }
    }
    return Array.from(set_posis_i);
}
exports._getPosis = _getPosis;
// ================================================================================================
// clipperjs -> Mobius Posi
function _getPosiFromMap(__model__, x, y, posis_map) {
    // TODO consider using a hash function insetad of a double map
    // try to find this coord in the map
    // if not found, create a new posi and add it to the map
    let posi_i;
    let map1 = posis_map.get(x);
    if (map1 !== undefined) {
        posi_i = map1.get(y);
    }
    else {
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
exports._getPosiFromMap = _getPosiFromMap;
function _putPosiInMap(x, y, posi_i, posis_map) {
    let map1 = posis_map.get(x);
    if (map1 === undefined) {
        map1 = new Map();
    }
    map1.set(y, posi_i);
}
// mobius -> clipperjs
function _convertPgonToShape(__model__, pgon_i, posis_map) {
    const wires_i = __model__.modeldata.geom.nav.navAnyToWire(mobius_sim_1.EEntType.PGON, pgon_i);
    const shape_coords = [];
    for (const wire_i of wires_i) {
        const len = shape_coords.push([]);
        const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.WIRE, wire_i);
        for (const posi_i of posis_i) {
            const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
            const coord = { X: xyz[0], Y: xyz[1] };
            shape_coords[len - 1].push(coord);
            _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
        }
    }
    const shape = new ShapeClass(shape_coords, true);
    shape.scaleUp(exports.SCALE);
    return shape;
}
exports._convertPgonToShape = _convertPgonToShape;
// clipperjs
function _convertPgonsToShapeUnion(__model__, pgons_i, posis_map) {
    let result_shape = null;
    for (const pgon_i of pgons_i) {
        const shape = _convertPgonToShape(__model__, pgon_i, posis_map);
        if (result_shape == null) {
            result_shape = shape;
        }
        else {
            result_shape = result_shape.union(shape);
        }
    }
    return result_shape;
}
exports._convertPgonsToShapeUnion = _convertPgonsToShapeUnion;
// clipperjs
function _convertPgonsToShapeJoin(__model__, pgons_i, posis_map) {
    let result_shape = null;
    for (const pgon_i of pgons_i) {
        const shape = _convertPgonToShape(__model__, pgon_i, posis_map);
        if (result_shape == null) {
            result_shape = shape;
        }
        else {
            result_shape = result_shape.join(shape);
        }
    }
    return result_shape;
}
// mobius -> clipperjs
function _convertWireToShape(__model__, wire_i, is_closed, posis_map) {
    const shape_coords = [];
    shape_coords.push([]);
    const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.WIRE, wire_i);
    for (const posi_i of posis_i) {
        const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        const coord = { X: xyz[0], Y: xyz[1] };
        shape_coords[0].push(coord);
        _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
    }
    const shape = new ShapeClass(shape_coords, is_closed);
    shape.scaleUp(exports.SCALE);
    return shape;
}
exports._convertWireToShape = _convertWireToShape;
// mobius -> clipperjs
function _convertPlineToShape(__model__, pline_i, posis_map) {
    const wire_i = __model__.modeldata.geom.nav.navPlineToWire(pline_i);
    const is_closed = __model__.modeldata.geom.query.isWireClosed(wire_i);
    const shape_coords = [];
    shape_coords.push([]);
    const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.PLINE, pline_i);
    for (const posi_i of posis_i) {
        const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        const coord = { X: xyz[0], Y: xyz[1] };
        shape_coords[0].push(coord);
        _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
    }
    if (is_closed) {
        // close the pline by adding an extra point
        const first = shape_coords[0][0];
        const last = { X: first.X, Y: first.Y };
        shape_coords[0].push(last);
    }
    const shape = new ShapeClass(shape_coords, false); // this is always false, even if pline is closed
    shape.scaleUp(exports.SCALE);
    return shape;
}
exports._convertPlineToShape = _convertPlineToShape;
// clipperjs -> mobius
function _convertShapesToPgons(__model__, shapes, posis_map) {
    shapes = Array.isArray(shapes) ? shapes : [shapes];
    const pgons_i = [];
    for (const shape of shapes) {
        shape.scaleDown(exports.SCALE);
        const sep_shapes = shape.separateShapes();
        for (const sep_shape of sep_shapes) {
            const posis_i = [];
            const paths = sep_shape.paths;
            for (const path of paths) {
                if (path.length === 0) {
                    continue;
                }
                const len = posis_i.push([]);
                for (const coord of path) {
                    const posi_i = _getPosiFromMap(__model__, coord.X, coord.Y, posis_map);
                    posis_i[len - 1].push(posi_i);
                }
            }
            if (posis_i.length === 0) {
                continue;
            }
            const outer_posis_i = posis_i[0];
            const holes_posis_i = posis_i.slice(1);
            const pgon_i = __model__.modeldata.geom.add.addPgon(outer_posis_i, holes_posis_i);
            pgons_i.push(pgon_i);
        }
    }
    return pgons_i;
}
exports._convertShapesToPgons = _convertShapesToPgons;
// clipperjs
function _convertShapeToPlines(__model__, shape, is_closed, posis_map) {
    shape.scaleDown(exports.SCALE);
    const sep_shapes = shape.separateShapes();
    const plines_i = [];
    for (const sep_shape of sep_shapes) {
        const paths = sep_shape.paths;
        for (const path of paths) {
            if (path.length === 0) {
                continue;
            }
            const list_posis_i = [];
            for (const coord of path) {
                const posi_i = _getPosiFromMap(__model__, coord.X, coord.Y, posis_map);
                list_posis_i.push(posi_i);
            }
            if (list_posis_i.length < 2) {
                continue;
            }
            const pgon_i = __model__.modeldata.geom.add.addPline(list_posis_i, is_closed);
            plines_i.push(pgon_i);
        }
    }
    return plines_i;
}
exports._convertShapeToPlines = _convertShapeToPlines;
// clipperjs
function _convertShapeToCutPlines(__model__, shape, posis_map) {
    shape.scaleDown(exports.SCALE);
    const sep_shapes = shape.separateShapes();
    const lists_posis_i = [];
    for (const sep_shape of sep_shapes) {
        const paths = sep_shape.paths;
        for (const path of paths) {
            if (path.length === 0) {
                continue;
            }
            const posis_i = [];
            // make a list of posis
            for (const coord of path) {
                const posi_i = _getPosiFromMap(__model__, coord.X, coord.Y, posis_map);
                posis_i.push(posi_i);
            }
            // must have at least 2 posis
            if (posis_i.length < 2) {
                continue;
            }
            // add the list
            lists_posis_i.push(posis_i);
        }
    }
    // see if there is a join between two lists
    // this can occur when boolean with closed polylines
    // for each closed polyline in the input, there can only be one merge
    // this is the point where the end meets the start
    const to_merge = [];
    for (let p = 0; p < lists_posis_i.length; p++) {
        const posis0 = lists_posis_i[p];
        for (let q = 0; q < lists_posis_i.length; q++) {
            const posis1 = lists_posis_i[q];
            if (p !== q && posis0[posis0.length - 1] === posis1[0]) {
                to_merge.push([p, q]);
            }
        }
    }
    for (const [p, q] of to_merge) {
        // copy posis from sub list q to sub list p
        // skip the first posi
        for (let idx = 1; idx < lists_posis_i[q].length; idx++) {
            const posi_i = lists_posis_i[q][idx];
            lists_posis_i[p].push(posi_i);
        }
        // set sub list q to null
        lists_posis_i[q] = null;
    }
    // create plines and check closed
    const plines_i = [];
    for (const posis_i of lists_posis_i) {
        if (posis_i === null) {
            continue;
        }
        const is_closed = posis_i[0] === posis_i[posis_i.length - 1];
        if (is_closed) {
            posis_i.splice(posis_i.length - 1, 1);
        }
        const pline_i = __model__.modeldata.geom.add.addPline(posis_i, is_closed);
        plines_i.push(pline_i);
    }
    // return the list of new plines
    return plines_i;
}
exports._convertShapeToCutPlines = _convertShapeToCutPlines;
// clipperjs
function _printPaths(paths, mesage) {
    console.log(mesage);
    for (const path of paths) {
        console.log('    PATH');
        for (const coord of path) {
            console.log('        ', JSON.stringify(coord));
        }
    }
}
function _convexHull(__model__, posis_i) {
    const points = [];
    const posis_map = new Map();
    for (const posi_i of posis_i) {
        const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        points.push([xyz[0], xyz[1]]);
        _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
    }
    if (points.length < 3) {
        return null;
    }
    // loop and create hull
    const hull_points = d3poly.polygonHull(points);
    const hull_posis_i = [];
    for (const hull_point of hull_points) {
        const hull_posi_i = _getPosiFromMap(__model__, hull_point[0], hull_point[1], posis_map);
        hull_posis_i.push(hull_posi_i);
    }
    hull_posis_i.reverse();
    return hull_posis_i;
}
exports._convexHull = _convexHull;
function _offsetPgon(__model__, pgon_i, dist, options, posis_map) {
    options.endType = _enum_1._EClipEndType.CLOSED_PGON;
    const shape = _convertPgonToShape(__model__, pgon_i, posis_map);
    const result = shape.offset(dist * exports.SCALE, options);
    const result_shape = new ShapeClass(result.paths, result.closed);
    return _convertShapesToPgons(__model__, result_shape, posis_map);
}
exports._offsetPgon = _offsetPgon;
function _offsetPline(__model__, pline_i, dist, options, posis_map) {
    const wire_i = __model__.modeldata.geom.nav.navPlineToWire(pline_i);
    const is_closed = __model__.modeldata.geom.query.isWireClosed(wire_i);
    if (is_closed) {
        options.endType = _enum_1._EClipEndType.CLOSED_PLINE;
    }
    const shape = _convertWireToShape(__model__, wire_i, is_closed, posis_map);
    const result = shape.offset(dist * exports.SCALE, options);
    const result_shape = new ShapeClass(result.paths, result.closed);
    return _convertShapesToPgons(__model__, result_shape, posis_map);
}
exports._offsetPline = _offsetPline;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3NoYXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9wb2x5MmQvX3NoYXJlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBQXFGO0FBQ3JGLHNFQUF5QztBQUN6QyxtREFBcUM7QUFFckMsbUNBQXdDO0FBRXhDLElBQUksVUFBVSxHQUFHLG9CQUFLLENBQUM7QUFDdkIsWUFBWTtBQUNaLElBQUksb0JBQUssQ0FBQyxPQUFPLEVBQUU7SUFBRSxVQUFVLEdBQUcsb0JBQUssQ0FBQyxPQUFPLENBQUM7Q0FBRTtBQUVyQyxRQUFBLEtBQUssR0FBRyxHQUFHLENBQUM7QUFtQlosUUFBQSxrQkFBa0IsR0FBd0IsSUFBSSxHQUFHLENBQUM7SUFDM0QsQ0FBQyxZQUFZLEVBQUUscUJBQWEsQ0FBQyxXQUFXLENBQUM7SUFDekMsQ0FBQyxXQUFXLEVBQUUscUJBQWEsQ0FBQyxVQUFVLENBQUM7SUFDdkMsQ0FBQyxVQUFVLEVBQUUscUJBQWEsQ0FBQyxTQUFTLENBQUM7Q0FDeEMsQ0FBQyxDQUFDO0FBRUgsbUdBQW1HO0FBQ25HLDhCQUE4QjtBQUM5QixTQUFnQixTQUFTLENBQUMsU0FBa0IsRUFBRSxRQUF1QjtJQUNqRSxNQUFNLFdBQVcsR0FBZ0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUMzQyxLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLElBQUksUUFBUSxFQUFFO1FBQ3RDLFFBQVEsUUFBUSxFQUFFO1lBQ2QsS0FBSyxxQkFBUSxDQUFDLEtBQUssQ0FBQztZQUNwQixLQUFLLHFCQUFRLENBQUMsS0FBSztnQkFDZixNQUFNO1lBQ1YsS0FBSyxxQkFBUSxDQUFDLElBQUk7Z0JBQ2QsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdkIsTUFBTTtZQUNWLEtBQUsscUJBQVEsQ0FBQyxJQUFJ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