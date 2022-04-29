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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3NoYXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9wb2x5MmQvX3NoYXJlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhEQUFxRjtBQUNyRixzRUFBeUM7QUFDekMsbURBQXFDO0FBRXJDLG1DQUF3QztBQUV4QyxJQUFJLFVBQVUsR0FBRyxvQkFBSyxDQUFDO0FBQ3ZCLFlBQVk7QUFDWixJQUFJLG9CQUFLLENBQUMsT0FBTyxFQUFFO0lBQUUsVUFBVSxHQUFHLG9CQUFLLENBQUMsT0FBTyxDQUFDO0NBQUU7QUFFckMsUUFBQSxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBbUJaLFFBQUEsa0JBQWtCLEdBQXdCLElBQUksR0FBRyxDQUFDO0lBQzNELENBQUMsWUFBWSxFQUFFLHFCQUFhLENBQUMsV0FBVyxDQUFDO0lBQ3pDLENBQUMsV0FBVyxFQUFFLHFCQUFhLENBQUMsVUFBVSxDQUFDO0lBQ3ZDLENBQUMsVUFBVSxFQUFFLHFCQUFhLENBQUMsU0FBUyxDQUFDO0NBQ3hDLENBQUMsQ0FBQztBQUVILG1HQUFtRztBQUNuRyw4QkFBOEI7QUFDOUIsU0FBZ0IsU0FBUyxDQUFDLFNBQWtCLEVBQUUsUUFBdUI7SUFDakUsTUFBTSxXQUFXLEdBQWdCLElBQUksR0FBRyxFQUFFLENBQUM7SUFDM0MsS0FBSyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxJQUFJLFFBQVEsRUFBRTtRQUN0QyxRQUFRLFFBQVEsRUFBRTtZQUNkLEtBQUsscUJBQVEsQ0FBQyxLQUFLLENBQUM7WUFDcEIsS0FBSyxxQkFBUSxDQUFDLEtBQUs7Z0JBQ2YsTUFBTTtZQUNWLEtBQUsscUJBQVEsQ0FBQyxJQUFJO2dCQUNkLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZCLE1BQU07WUFDVixLQUFLLHFCQUFRLENBQUMs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