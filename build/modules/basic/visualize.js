/**
 * The `visualize` module has functions for defining various settings for the 3D viewer.
 * Color is saved as vertex attributes.
 * @module
 */
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { EAttribNames, EAttribDataTypeStrs, EAttribPush, EEntType, idsMake, idsBreak, isEmptyArr, arrMakeFlat, getArrDepth, vecMult, vecAdd, vecSetLen, vecCross, vecNorm, vecSub, vecDot } from '@design-automation/mobius-sim';
import { scale as chromaScale } from 'chroma-js';
import * as Mathjs from 'mathjs';
// ================================================================================================
export var _ESide;
(function (_ESide) {
    _ESide["FRONT"] = "front";
    _ESide["BACK"] = "back";
    _ESide["BOTH"] = "both";
})(_ESide || (_ESide = {}));
export var _Ecolors;
(function (_Ecolors) {
    _Ecolors["NO_VERT_COLORS"] = "none";
    _Ecolors["VERT_COLORS"] = "apply_rgb";
})(_Ecolors || (_Ecolors = {}));
// ================================================================================================
/**
 * Sets color by creating a vertex attribute called 'rgb' and setting the value.
 * \n
 * @param entities The entities for which to set the color.
 * @param color The color, [0,0,0] is black, [1,1,1] is white.
 * @returns void
 */
export function Color(__model__, entities, color) {
    entities = arrMakeFlat(entities);
    if (isEmptyArr(entities)) {
        return;
    }
    // --- Error Check ---
    const fn_name = 'visualize.Color';
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1, ID.isIDL2], null);
        }
        chk.checkArgs(fn_name, 'color', color, [chk.isColor]);
    }
    else {
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    _color(__model__, ents_arr, color);
}
function _color(__model__, ents_arr, color) {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, EAttribNames.COLOR)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.VERT, EAttribNames.COLOR, EAttribDataTypeStrs.LIST);
    }
    // make a list of all the verts
    let all_verts_i = [];
    if (ents_arr === null) {
        all_verts_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, EEntType.VERT);
    }
    else {
        for (const ent_arr of ents_arr) {
            const [ent_type, ent_i] = ent_arr;
            if (ent_type === EEntType.VERT) {
                all_verts_i.push(ent_i);
            }
            else {
                const verts_i = __model__.modeldata.geom.nav.navAnyToVert(ent_type, ent_i);
                for (const vert_i of verts_i) {
                    all_verts_i.push(vert_i);
                }
            }
        }
    }
    // set all verts to have same color
    __model__.modeldata.attribs.set.setEntsAttribVal(EEntType.VERT, all_verts_i, EAttribNames.COLOR, color);
}
// ================================================================================================
/**
 * Generates a colour range based on a numeric attribute.
 * Sets the color by creating a vertex attribute called 'rgb' and setting the value.
 * \n
 * @param entities The entities for which to set the color.
 * @param attrib The numeric attribute to be used to create the gradient.
 * You can spacify an attribute with an index. For example, ['xyz', 2] will create a gradient based on height.
 * @param range The range of the attribute, [minimum, maximum].
 * If only one number, it defaults to [0, maximum]. If null, then the range will be auto-calculated.
 * @param method Enum, the colour gradient to use.
 * @returns void
 */
export function Gradient(__model__, entities, attrib, range, method) {
    entities = arrMakeFlat(entities);
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'visualize.Gradient';
        let ents_arr = null;
        let attrib_name;
        let attrib_idx_or_key;
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1, ID.isIDL2], null);
            chk.checkArgs(fn_name, 'attrib', attrib, [chk.isStr, chk.isStrStr, chk.isStrNum]);
            chk.checkArgs(fn_name, 'range', range, [chk.isNull, chk.isNum, chk.isNumL]);
            attrib_name = Array.isArray(attrib) ? attrib[0] : attrib;
            attrib_idx_or_key = Array.isArray(attrib) ? attrib[1] : null;
            if (!__model__.modeldata.attribs.query.hasEntAttrib(ents_arr[0][0], attrib_name)) {
                throw new Error(fn_name + ': The attribute with name "' + attrib + '" does not exist on these entities.');
            }
            else {
                let data_type = null;
                if (attrib_idx_or_key === null) {
                    data_type = __model__.modeldata.attribs.query.getAttribDataType(ents_arr[0][0], attrib_name);
                }
                else {
                    const first_val = __model__.modeldata.attribs.get.getEntAttribValOrItem(ents_arr[0][0], ents_arr[0][1], attrib_name, attrib_idx_or_key);
                }
                if (data_type !== EAttribDataTypeStrs.NUMBER) {
                    throw new Error(fn_name + ': The attribute with name "' + attrib_name + '" is not a number data type.' +
                        'For generating a gradient, the attribute must be a number.');
                }
            }
        }
        else {
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            //     [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDListOfLists], null) as TEntTypeIdx[];
            ents_arr = idsBreak(entities);
            attrib_name = Array.isArray(attrib) ? attrib[0] : attrib;
            attrib_idx_or_key = Array.isArray(attrib) ? attrib[1] : null;
        }
        // --- Error Check ---
        if (range === null) {
            range = [null, null];
        }
        range = Array.isArray(range) ? range : [0, range];
        _gradient(__model__, ents_arr, attrib_name, attrib_idx_or_key, range, method);
    }
}
// https://codesandbox.io/s/5w573r54w4
export var _EColorRampMethod;
(function (_EColorRampMethod) {
    _EColorRampMethod["FALSE_COLOR"] = "false_color";
    _EColorRampMethod["BLACK_BODY"] = "black_body";
    _EColorRampMethod["WHITE_RED"] = "white_red";
    _EColorRampMethod["WHITE_GREEN"] = "white_green";
    _EColorRampMethod["WHITE_BLUE"] = "white_blue";
    _EColorRampMethod["BLUE_RED"] = "blue_red";
    _EColorRampMethod["GREEN_RED"] = "green_red";
    _EColorRampMethod["BLUE_GREEN"] = "blue_green";
    _EColorRampMethod["GREY_SCALE"] = "grey_scale";
    _EColorRampMethod["ORRD"] = "OrRd";
    _EColorRampMethod["PUBU"] = "PuBu";
    _EColorRampMethod["BUPU"] = "BuPu";
    _EColorRampMethod["ORANGES"] = "Oranges";
    _EColorRampMethod["BUGN"] = "BuGn";
    _EColorRampMethod["YLORBR"] = "YlOrBr";
    _EColorRampMethod["YLGN"] = "YlGn";
    _EColorRampMethod["REDS"] = "Reds";
    _EColorRampMethod["RDPU"] = "RdPu";
    _EColorRampMethod["GREENS"] = "Greens";
    _EColorRampMethod["YLGNBU"] = "YlGnBu";
    _EColorRampMethod["PURPLES"] = "Purples";
    _EColorRampMethod["GNBU"] = "GnBu";
    _EColorRampMethod["GREYS"] = "Greys";
    _EColorRampMethod["YLORRD"] = "YlOrRd";
    _EColorRampMethod["PURD"] = "PuRd";
    _EColorRampMethod["BLUES"] = "Blues";
    _EColorRampMethod["PUBUGN"] = "PuBuGn";
    _EColorRampMethod["VIRIDIS"] = "Viridis";
    _EColorRampMethod["SPECTRAL"] = "Spectral";
    _EColorRampMethod["RDYLGN"] = "RdYlGn";
    _EColorRampMethod["RDBU"] = "RdBu";
    _EColorRampMethod["PIYG"] = "PiYG";
    _EColorRampMethod["PRGN"] = "PRGn";
    _EColorRampMethod["RDYLBU"] = "RdYlBu";
    _EColorRampMethod["BRBG"] = "BrBG";
    _EColorRampMethod["RDGY"] = "RdGy";
    _EColorRampMethod["PUOR"] = "PuOr";
    _EColorRampMethod["SET2"] = "Set2";
    _EColorRampMethod["ACCENT"] = "Accent";
    _EColorRampMethod["SET1"] = "Set1";
    _EColorRampMethod["SET3"] = "Set3";
    _EColorRampMethod["DARK2"] = "Dark2";
    _EColorRampMethod["PAIRED"] = "Paired";
    _EColorRampMethod["PASTEL2"] = "Pastel2";
    _EColorRampMethod["PASTEL1"] = "Pastel1";
})(_EColorRampMethod || (_EColorRampMethod = {}));
function _gradient(__model__, ents_arr, attrib_name, idx_or_key, range, method) {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, EAttribNames.COLOR)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.VERT, EAttribNames.COLOR, EAttribDataTypeStrs.LIST);
    }
    // get the ents
    const first_ent_type = ents_arr[0][0];
    const ents_i = ents_arr.map(ent_arr => ent_arr[1]);
    // push the attrib down from the ent to its verts
    if (first_ent_type !== EEntType.VERT) {
        __model__.modeldata.attribs.push.pushAttribVals(first_ent_type, attrib_name, idx_or_key, ents_i, EEntType.VERT, attrib_name, null, EAttribPush.AVERAGE);
    }
    // make a list of all the verts
    const all_verts_i = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i] = ent_arr;
        if (ent_type === EEntType.VERT) {
            all_verts_i.push(ent_i);
        }
        else {
            const verts_i = __model__.modeldata.geom.nav.navAnyToVert(ent_type, ent_i);
            for (const vert_i of verts_i) {
                all_verts_i.push(vert_i);
            }
        }
    }
    // get the attribute values
    const vert_values = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.VERT, all_verts_i, attrib_name);
    // if range[0] is null, get min value
    if (range[0] === null) {
        range[0] = Mathjs.min(vert_values);
    }
    // if range[1] is null. get max value
    if (range[1] === null) {
        range[1] = Mathjs.max(vert_values);
    }
    // create color scale
    const scales = {
        'false_color': ['blue', 'cyan', 'green', 'yellow', 'red'],
        'black_body': ['black', 'red', 'yellow', 'white'],
        'white_red': ['white', 'red'],
        'white_blue': ['white', 'blue'],
        'white_green': ['white', 'green'],
        'blue_red': ['blue', 'red'],
        'green_red': ['green', 'red'],
        'blue_green': ['blue', 'green'],
        'grey_scale': ['white', 'black']
    };
    let scale = null;
    if (method in scales) {
        scale = scales[method];
    }
    else {
        scale = method;
    }
    const col_scale = chromaScale(scale);
    const col_domain = col_scale.domain(range);
    // make a values map, grouping together all the verts that have the same value
    const values_map = new Map();
    for (let i = 0; i < all_verts_i.length; i++) {
        if (!values_map.has(vert_values[i])) {
            // const col: TColor = colFalse(vert_values[i], range[0], range[1]);
            const ch_col = col_domain(vert_values[i]).gl();
            const col = [ch_col[0], ch_col[1], ch_col[2]];
            values_map.set(vert_values[i], [col, [all_verts_i[i]]]);
        }
        else {
            values_map.get(vert_values[i])[1].push(all_verts_i[i]);
        }
    }
    // set color of each group of verts
    values_map.forEach((col_and_verts_i) => {
        const col = col_and_verts_i[0];
        const verts_i = col_and_verts_i[1];
        __model__.modeldata.attribs.set.setEntsAttribVal(EEntType.VERT, verts_i, EAttribNames.COLOR, col);
    });
}
// ================================================================================================
export var _EEdgeMethod;
(function (_EEdgeMethod) {
    _EEdgeMethod["VISIBLE"] = "visible";
    _EEdgeMethod["HIDDEN"] = "hidden";
})(_EEdgeMethod || (_EEdgeMethod = {}));
/**
 * Controls how edges are visualized by setting the visibility of the edge.
 * \n
 * The method can either be 'visible' or 'hidden'.
 * 'visible' means that an edge line will be visible.
 * 'hidden' means that no edge lines will be visible.
 * \n
 * @param entities A list of edges, or other entities from which edges can be extracted.
 * @param method Enum, visible or hidden.
 * @returns void
 */
export function Edge(__model__, entities, method) {
    entities = arrMakeFlat(entities);
    if (isEmptyArr(entities)) {
        return;
    }
    // --- Error Check ---
    const fn_name = 'visualize.Edge';
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isIDL1], null);
        }
    }
    else {
        // if (entities !== null) {
        //     ents_arr = splitIDs(fn_name, 'entities', entities,
        //         [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // }
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.EDGE, EAttribNames.VISIBILITY)) {
        if (method === _EEdgeMethod.VISIBLE) {
            return;
        }
        else {
            __model__.modeldata.attribs.add.addAttrib(EEntType.EDGE, EAttribNames.VISIBILITY, EAttribDataTypeStrs.STRING);
        }
    }
    // Get the unique edges
    let edges_i = [];
    if (ents_arr !== null) {
        const set_edges_i = new Set();
        for (const [ent_type, ent_i] of ents_arr) {
            if (ent_type === EEntType.EDGE) {
                set_edges_i.add(ent_i);
            }
            else {
                const ent_edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
                for (const ent_edge_i of ent_edges_i) {
                    set_edges_i.add(ent_edge_i);
                }
            }
        }
        edges_i = Array.from(set_edges_i);
    }
    else {
        edges_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, EEntType.EDGE);
    }
    // Set edge visibility
    const setting = method === _EEdgeMethod.VISIBLE ? null : 'hidden';
    __model__.modeldata.attribs.set.setEntsAttribVal(EEntType.EDGE, edges_i, EAttribNames.VISIBILITY, setting);
}
// ================================================================================================
export var _EMeshMethod;
(function (_EMeshMethod) {
    _EMeshMethod["FACETED"] = "faceted";
    _EMeshMethod["SMOOTH"] = "smooth";
})(_EMeshMethod || (_EMeshMethod = {}));
/**
 * Controls how polygon meshes are visualized by creating normals on vertices.
 * \n
 * The method can either be 'faceted' or 'smooth'.
 * 'faceted' means that the normal direction for each vertex will be perpendicular to the polygon to which it belongs.
 * 'smooth' means that the normal direction for each vertex will be the average of all polygons welded to this vertex.
 * \n
 * @param entities Vertices belonging to polygons, or entities from which polygon vertices can be extracted.
 * @param method Enum, the types of normals to create, faceted or smooth.
 * @returns void
 */
export function Mesh(__model__, entities, method) {
    entities = arrMakeFlat(entities);
    if (isEmptyArr(entities)) {
        return;
    }
    // --- Error Check ---
    const fn_name = 'visualize.Mesh';
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isIDL1], null);
        }
    }
    else {
        // if (entities !== null) {
        //     ents_arr = splitIDs(fn_name, 'entities', entities,
        //         [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // }
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    // Get the unique verts that belong to pgons
    let verts_i = [];
    if (ents_arr !== null) {
        const set_verts_i = new Set();
        for (const [ent_type, ent_i] of ents_arr) {
            if (ent_type === EEntType.VERT) {
                if (__model__.modeldata.geom.query.getTopoObjType(EEntType.VERT, ent_i) === EEntType.PGON) {
                    set_verts_i.add(ent_i);
                }
            }
            else if (ent_type === EEntType.POINT) {
                // skip
            }
            else if (ent_type === EEntType.PLINE) {
                // skip
            }
            else if (ent_type === EEntType.PGON) {
                const ent_verts_i = __model__.modeldata.geom.nav.navAnyToVert(EEntType.PGON, ent_i);
                for (const ent_vert_i of ent_verts_i) {
                    set_verts_i.add(ent_vert_i);
                }
            }
            else if (ent_type === EEntType.COLL) {
                const coll_pgons_i = __model__.modeldata.geom.nav.navCollToPgon(ent_i);
                for (const coll_pgon_i of coll_pgons_i) {
                    const ent_verts_i = __model__.modeldata.geom.nav.navAnyToVert(EEntType.PGON, coll_pgon_i);
                    for (const ent_vert_i of ent_verts_i) {
                        set_verts_i.add(ent_vert_i);
                    }
                }
            }
            else {
                const ent_verts_i = __model__.modeldata.geom.nav.navAnyToVert(ent_type, ent_i);
                for (const ent_vert_i of ent_verts_i) {
                    if (__model__.modeldata.geom.query.getTopoObjType(EEntType.VERT, ent_vert_i) === EEntType.PGON) {
                        set_verts_i.add(ent_vert_i);
                    }
                }
            }
        }
        verts_i = Array.from(set_verts_i);
    }
    else {
        verts_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, EEntType.VERT);
    }
    // calc vertex normals and set edge visibility
    switch (method) {
        case _EMeshMethod.FACETED:
            _meshFaceted(__model__, verts_i);
            break;
        case _EMeshMethod.SMOOTH:
            _meshSmooth(__model__, verts_i);
            break;
        default:
            break;
    }
}
function _meshFaceted(__model__, verts_i) {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, EAttribNames.NORMAL)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.VERT, EAttribNames.NORMAL, EAttribDataTypeStrs.LIST);
    }
    // get the polygons
    const map_vert_pgons = new Map();
    const set_pgons_i = new Set();
    for (const vert_i of verts_i) {
        const pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(EEntType.VERT, vert_i); // TODO optimize
        if (pgons_i.length === 1) { // one polygon
            map_vert_pgons.set(vert_i, pgons_i[0]);
            set_pgons_i.add(pgons_i[0]);
        }
    }
    // calc the normals one time
    const normals = [];
    for (const pgon_i of Array.from(set_pgons_i)) {
        const normal = __model__.modeldata.geom.query.getPgonNormal(pgon_i);
        normals[pgon_i] = normal;
    }
    // set the normal
    map_vert_pgons.forEach((pgon_i, vert_i) => {
        const normal = normals[pgon_i];
        __model__.modeldata.attribs.set.setEntAttribVal(EEntType.VERT, vert_i, EAttribNames.NORMAL, normal);
    });
}
function _meshSmooth(__model__, verts_i) {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, EAttribNames.NORMAL)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.VERT, EAttribNames.NORMAL, EAttribDataTypeStrs.LIST);
    }
    // get the polygons
    const map_posi_pgons = new Map();
    const set_pgons_i = new Set();
    const vert_to_posi = [];
    for (const vert_i of verts_i) {
        const posi_i = __model__.modeldata.geom.nav.navVertToPosi(vert_i);
        vert_to_posi[vert_i] = posi_i;
        if (!map_posi_pgons.has(posi_i)) {
            const posi_pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(EEntType.VERT, vert_i);
            map_posi_pgons.set(posi_i, posi_pgons_i);
            for (const posi_pgon_i of posi_pgons_i) {
                set_pgons_i.add(posi_pgon_i);
            }
        }
    }
    // calc all normals one time
    const normals = [];
    for (const pgon_i of Array.from(set_pgons_i)) {
        const normal = __model__.modeldata.geom.query.getPgonNormal(pgon_i);
        normals[pgon_i] = normal;
    }
    // set normals on all verts
    for (const vert_i of verts_i) {
        const posi_i = vert_to_posi[vert_i];
        let normal = [0, 0, 0];
        const posi_pgons_i = map_posi_pgons.get(posi_i);
        for (const posi_pgon_i of posi_pgons_i) {
            normal = [
                normal[0] + normals[posi_pgon_i][0],
                normal[1] + normals[posi_pgon_i][1],
                normal[2] + normals[posi_pgon_i][2]
            ];
        }
        const div = posi_pgons_i.length;
        normal = [normal[0] / div, normal[1] / div, normal[2] / div];
        normal = vecNorm(normal);
        __model__.modeldata.attribs.set.setEntAttribVal(EEntType.VERT, vert_i, EAttribNames.NORMAL, normal);
    }
}
// ================================================================================================
/**
 * Visualises a ray or a list of rays by creating a polyline with an arrow head.
 *
 * @param __model__
 * @param rays Polylines representing the ray or rays.
 * @param scale Scales the arrow head of the vector.
 * @returns entities, a line with an arrow head representing the ray.
 * @example ray1 = visualize.Ray([[1,2,3],[0,0,1]])
 */
export function Ray(__model__, rays, scale) {
    // --- Error Check ---
    const fn_name = 'visualize.Ray';
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'ray', rays, [chk.isRay, chk.isRayL]);
        chk.checkArgs(fn_name, 'scale', scale, [chk.isNum]);
    }
    // --- Error Check ---
    return idsMake(_visRay(__model__, rays, scale));
}
function _visRay(__model__, rays, scale) {
    if (getArrDepth(rays) === 2) {
        const ray = rays;
        const origin = ray[0];
        const vec = ray[1]; // vecMult(ray[1], scale);
        const end = vecAdd(origin, vec);
        // create orign point
        const origin_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(origin_posi_i, origin);
        // create pline
        const end_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(end_posi_i, end);
        const pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, end_posi_i]);
        // create the arrow heads
        const vec_unit = vecNorm(ray[1]);
        const head_scale = scale;
        let vec_norm = null;
        if (vecDot([0, 0, 1], vec)) {
            vec_norm = vecSetLen(vecCross(vec_unit, [0, 1, 0]), head_scale);
        }
        else {
            vec_norm = vecSetLen(vecCross(vec_unit, [0, 0, 1]), head_scale);
        }
        const vec_rev = vecSetLen(vecMult(vec, -1), head_scale);
        const arrow_a = vecAdd(vecAdd(end, vec_rev), vec_norm);
        const arrow_a_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(arrow_a_posi_i, arrow_a);
        const arrow_a_pline_i = __model__.modeldata.geom.add.addPline([end_posi_i, arrow_a_posi_i]);
        const arrow_b = vecSub(vecAdd(end, vec_rev), vec_norm);
        const arrow_b_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(arrow_b_posi_i, arrow_b);
        const arrow_b_pline_i = __model__.modeldata.geom.add.addPline([end_posi_i, arrow_b_posi_i]);
        // return the geometry IDs
        return [
            [EEntType.PLINE, pline_i],
            [EEntType.PLINE, arrow_a_pline_i],
            [EEntType.PLINE, arrow_b_pline_i]
        ];
    }
    else {
        const ents_arr = [];
        for (const ray of rays) {
            const ray_ents = _visRay(__model__, ray, scale);
            for (const ray_ent of ray_ents) {
                ents_arr.push(ray_ent);
            }
        }
        return ents_arr;
    }
}
// ================================================================================================
/**
 * Visualises a plane or a list of planes by creating polylines.
 *
 * @param __model__
 * @param plane A plane or a list of planes.
 * @returns Entities, a square plane polyline and three axis polyline.
 * @example plane1 = visualize.Plane(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
export function Plane(__model__, planes, scale) {
    // --- Error Check ---
    const fn_name = 'visualize.Plane';
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'planes', planes, [chk.isPln, chk.isPlnL]);
        chk.checkArgs(fn_name, 'scale', scale, [chk.isNum]);
    }
    // --- Error Check ---
    return idsMake(_visPlane(__model__, planes, scale));
}
function _visPlane(__model__, planes, scale) {
    if (getArrDepth(planes) === 2) {
        const plane = planes;
        const origin = plane[0];
        const x_vec = vecMult(plane[1], scale);
        const y_vec = vecMult(plane[2], scale);
        let x_end = vecAdd(origin, x_vec);
        let y_end = vecAdd(origin, y_vec);
        const z_end = vecAdd(origin, vecSetLen(vecCross(x_vec, y_vec), scale));
        const plane_corners = [
            vecAdd(x_end, y_vec),
            vecSub(y_end, x_vec),
            vecSub(vecSub(origin, x_vec), y_vec),
            vecSub(x_end, y_vec),
        ];
        x_end = vecAdd(x_end, vecMult(x_vec, 0.1));
        y_end = vecSub(y_end, vecMult(y_vec, 0.1));
        // create the point
        const origin_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(origin_posi_i, origin);
        // create the x axis
        const x_end_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(x_end_posi_i, x_end);
        const x_pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, x_end_posi_i]);
        // create the y axis
        const y_end_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(y_end_posi_i, y_end);
        const y_pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, y_end_posi_i]);
        // create the z axis
        const z_end_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(z_end_posi_i, z_end);
        const z_pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, z_end_posi_i]);
        // create pline for plane
        const corner_posis_i = [];
        for (const corner of plane_corners) {
            const posi_i = __model__.modeldata.geom.add.addPosi();
            __model__.modeldata.attribs.posis.setPosiCoords(posi_i, corner);
            corner_posis_i.push(posi_i);
        }
        const plane_i = __model__.modeldata.geom.add.addPline(corner_posis_i, true);
        // return the geometry IDs
        return [
            [EEntType.PLINE, x_pline_i],
            [EEntType.PLINE, y_pline_i],
            [EEntType.PLINE, z_pline_i],
            [EEntType.PLINE, plane_i]
        ];
    }
    else {
        const ents_arr = [];
        for (const plane of planes) {
            const plane_ents = _visPlane(__model__, plane, scale);
            for (const plane_ent of plane_ents) {
                ents_arr.push(plane_ent);
            }
        }
        return ents_arr;
    }
}
// ================================================================================================
/**
 * Visualises a bounding box by adding geometry to the model.
 *
 * @param __model__
 * @param bboxes A list of lists.
 * @returns Entities, twelve polylines representing the box.
 * @example bbox1 = virtual.viBBox(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
export function BBox(__model__, bboxes) {
    // --- Error Check ---
    const fn_name = 'visualize.BBox';
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'bbox', bboxes, [chk.isBBox]); // TODO bboxs can be a list // add isBBoxList to enable check
    }
    // --- Error Check ---
    return idsMake(_visBBox(__model__, bboxes));
}
function _visBBox(__model__, bboxs) {
    if (getArrDepth(bboxs) === 2) {
        const bbox = bboxs;
        const _min = bbox[1];
        const _max = bbox[2];
        // bottom
        const ps0 = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps0, _min);
        const ps1 = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps1, [_max[0], _min[1], _min[2]]);
        const ps2 = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps2, [_max[0], _max[1], _min[2]]);
        const ps3 = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps3, [_min[0], _max[1], _min[2]]);
        // top
        const ps4 = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps4, [_min[0], _min[1], _max[2]]);
        const ps5 = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps5, [_max[0], _min[1], _max[2]]);
        const ps6 = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps6, _max);
        const ps7 = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(ps7, [_min[0], _max[1], _max[2]]);
        // plines bottom
        const pl0 = __model__.modeldata.geom.add.addPline([ps0, ps1]);
        const pl1 = __model__.modeldata.geom.add.addPline([ps1, ps2]);
        const pl2 = __model__.modeldata.geom.add.addPline([ps2, ps3]);
        const pl3 = __model__.modeldata.geom.add.addPline([ps3, ps0]);
        // plines top
        const pl4 = __model__.modeldata.geom.add.addPline([ps4, ps5]);
        const pl5 = __model__.modeldata.geom.add.addPline([ps5, ps6]);
        const pl6 = __model__.modeldata.geom.add.addPline([ps6, ps7]);
        const pl7 = __model__.modeldata.geom.add.addPline([ps7, ps4]);
        // plines vertical
        const pl8 = __model__.modeldata.geom.add.addPline([ps0, ps4]);
        const pl9 = __model__.modeldata.geom.add.addPline([ps1, ps5]);
        const pl10 = __model__.modeldata.geom.add.addPline([ps2, ps6]);
        const pl11 = __model__.modeldata.geom.add.addPline([ps3, ps7]);
        // return
        return [pl0, pl1, pl2, pl3, pl4, pl5, pl6, pl7, pl8, pl9, pl10, pl11].map(pl => [EEntType.PLINE, pl]);
    }
    else {
        const ents_arr = [];
        for (const bbox of bboxs) {
            const bbox_ents = _visBBox(__model__, bbox);
            for (const bbox_ent of bbox_ents) {
                ents_arr.push(bbox_ent);
            }
        }
        return ents_arr;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlzdWFsaXplLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZXMvYmFzaWMvdmlzdWFsaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFFSCxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRWhELE9BQU8sS0FBSyxHQUFHLE1BQU0sb0JBQW9CLENBQUM7QUFFMUMsT0FBTyxFQUF5QixZQUFZLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUNoRCxRQUFRLEVBQWUsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQzlFLFdBQVcsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUMxRixNQUFNLCtCQUErQixDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxLQUFLLElBQUksV0FBVyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQy9DLE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQ2pDLG1HQUFtRztBQUNuRyxNQUFNLENBQU4sSUFBWSxNQUlYO0FBSkQsV0FBWSxNQUFNO0lBQ2QseUJBQWlCLENBQUE7SUFDakIsdUJBQWUsQ0FBQTtJQUNmLHVCQUFlLENBQUE7QUFDbkIsQ0FBQyxFQUpXLE1BQU0sS0FBTixNQUFNLFFBSWpCO0FBQ0QsTUFBTSxDQUFOLElBQVksUUFHWDtBQUhELFdBQVksUUFBUTtJQUNoQixtQ0FBeUIsQ0FBQTtJQUN6QixxQ0FBMkIsQ0FBQTtBQUMvQixDQUFDLEVBSFcsUUFBUSxLQUFSLFFBQVEsUUFHbkI7QUFDRCxtR0FBbUc7QUFDbkc7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLEtBQUssQ0FBQyxTQUFrQixFQUFFLFFBQW1CLEVBQUUsS0FBYTtJQUN4RSxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBVSxDQUFDO0lBQzFDLElB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LE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRixNQUFNLEdBQUcsR0FBVyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDM0QsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEYsTUFBTTtRQUNOLE1BQU0sR0FBRyxHQUFXLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMzRCxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRixNQUFNLEdBQUcsR0FBVyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDM0QsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEYsTUFBTSxHQUFHLEdBQVcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9B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