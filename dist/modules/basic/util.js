/**
 * The `util` module has some utility functions used for debugging.
 * @module
 */
import { checkIDs, ID } from '../../_check_ids';
import { GIModel } from '@design-automation/mobius-sim/dist/geo-info/GIModel';
import { EEntType, EAttribNames, EAttribDataTypeStrs } from '@design-automation/mobius-sim/dist/geo-info/common';
import { arrMakeFlat } from '@design-automation/mobius-sim/dist/util/arrs';
import { idsBreak, idsMake } from '@design-automation/mobius-sim/dist/geo-info/common_id_funcs';
import { _getFile } from './io';
import { checkArgs, isNull, isNum, isStr } from '../../_check_types';
// ================================================================================================
/**
 * Select entities in the model.
 *
 * @param __model__
 * @param entities
 * @returns void
 */
export function Select(__model__, entities) {
    __model__.modeldata.geom.selected[__model__.getActiveSnapshot()] = [];
    const activeSelected = __model__.modeldata.geom.selected[__model__.getActiveSnapshot()];
    entities = ((Array.isArray(entities)) ? entities : [entities]);
    const [ents_id_flat, ents_indices] = _flatten(entities);
    const ents_arr = idsBreak(ents_id_flat);
    const attrib_name = '_selected';
    for (let i = 0; i < ents_arr.length; i++) {
        const ent_arr = ents_arr[i];
        const ent_indices = ents_indices[i];
        const attrib_value = 'selected[' + ent_indices.join('][') + ']';
        activeSelected.push(ent_arr);
        if (!__model__.modeldata.attribs.query.hasEntAttrib(ent_arr[0], attrib_name)) {
            __model__.modeldata.attribs.add.addAttrib(ent_arr[0], attrib_name, EAttribDataTypeStrs.STRING);
        }
        __model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_arr[0], ent_arr[1], attrib_name, attrib_value);
    }
}
function _flatten(arrs) {
    const arr_flat = [];
    const arr_indices = [];
    let count = 0;
    for (const item of arrs) {
        if (Array.isArray(item)) {
            const [arr_flat2, arr_indices2] = _flatten(item);
            for (let i = 0; i < arr_flat2.length; i++) {
                if (arr_flat.indexOf(arr_flat2[i]) !== -1) {
                    continue;
                }
                arr_flat.push(arr_flat2[i]);
                arr_indices2[i].unshift(count);
                arr_indices.push(arr_indices2[i]);
            }
        }
        else {
            arr_flat.push(item);
            arr_indices.push([count]);
        }
        count += 1;
    }
    return [arr_flat, arr_indices];
}
// ================================================================================================
/**
 * Creta a VR hotspot. In the VR Viewer, you can teleport to such hotspots.
 * \n
 * @param __model__
 * @param point A point object to be used for creating hotspots.
 * @param name A name for the VR hotspots. If `null`, a default name will be created.
 * @param camera_rot The rotation of the camera direction when you teleport yo the hotspot. The
 * rotation is specified in degrees, in the counter-clockwise direction, starting from the Y axis.
 * If `null`, the camera rotation will default to 0.
 * @returns void
 */
export function VrHotspot(__model__, point, name, camera_rot) {
    // --- Error Check ---
    const fn_name = 'util.vrHotspot';
    let ent_arr;
    if (__model__.debug) {
        ent_arr = checkIDs(__model__, fn_name, 'points', point, [ID.isID], [EEntType.POINT]);
        checkArgs(fn_name, 'name', name, [isStr, isNull]);
        checkArgs(fn_name, 'camera_rot', camera_rot, [isNum, isNull]);
    }
    else {
        ent_arr = idsBreak(point);
    }
    // --- Error Check ---
    const ent_i = ent_arr[1];
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.POINT, "vr_hotspot")) {
        __model__.modeldata.attribs.add.addEntAttrib(EEntType.POINT, "vr_hotspot", EAttribDataTypeStrs.DICT);
    }
    let hs_dict = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.POINT, ent_i, "vr_hotspot");
    if (hs_dict === undefined) {
        hs_dict = {};
    }
    if (name !== null) {
        hs_dict["name"] = name;
    }
    if (camera_rot !== null) {
        hs_dict["camera_rotation"] = camera_rot;
    }
    __model__.modeldata.attribs.set.setEntAttribVal(EEntType.POINT, ent_i, "vr_hotspot", hs_dict);
}
// ================================================================================================
/**
 * Create a VR panorama hotspot. In the VR Viewer, you can teleport to such hotspots.When you enter
 * the hotspot, the panorama images will be loaded into the view. \n
 * @param __model__
 * @param point The point object to be used for creating a panorama. If this point is already
 * defined as a VR hotspot, then the panorama hotspot will inherit the name and camera angle.
 * @param back_url The URL of the 360 degree panorama image to be used for the background.
 * @param Back_rot The rotation of the background panorama image, in degrees, in the
 * counter-clockwise direction. If `null`, then rotation will be 0.
 * @param fore_url The URL of the 360 degree panorama image to be used for the foreground. If `null`
 * then no foreground image will be used.
 * @param fore_rot The rotation of the forground panorama image, in degrees, in the
 * counter-clockwise direction. If `null`, then the foreground rotation will be equal to the background rotation.
 * @returns void
 */
export function VrPanorama(__model__, point, back_url, back_rot, fore_url, fore_rot) {
    // --- Error Check ---
    const fn_name = 'util.vrPanorama';
    let ent_arr;
    if (__model__.debug) {
        ent_arr = checkIDs(__model__, fn_name, 'point', point, [ID.isID], [EEntType.POINT]);
        checkArgs(fn_name, 'back_url', back_url, [isStr]);
        checkArgs(fn_name, 'back_rot', back_rot, [isNum, isNull]);
        checkArgs(fn_name, 'fore_url', fore_url, [isStr, isNull]);
        checkArgs(fn_name, 'fore_rot', fore_rot, [isNum, isNull]);
    }
    else {
        ent_arr = idsBreak(point);
    }
    // --- Error Check ---
    const ent_i = ent_arr[1];
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.POINT, "vr_hotspot")) {
        __model__.modeldata.attribs.add.addEntAttrib(EEntType.POINT, "vr_hotspot", EAttribDataTypeStrs.DICT);
    }
    let phs_dict = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.POINT, ent_i, "vr_hotspot");
    if (phs_dict === undefined) {
        phs_dict = {};
    }
    phs_dict["background_url"] = back_url;
    if (back_rot === null) {
        phs_dict["background_rotation"] = 0;
    }
    else {
        phs_dict["background_rotation"] = back_rot;
    }
    if (fore_url !== null) {
        phs_dict["foreground_url"] = fore_url;
        if (fore_rot === null) {
            phs_dict["foreground_rotation"] = phs_dict["background_rotation"];
        }
        else {
            phs_dict["foreground_rotation"] = fore_rot;
        }
    }
    __model__.modeldata.attribs.set.setEntAttribVal(EEntType.POINT, ent_i, "vr_hotspot", phs_dict);
}
// ================================================================================================
/**
 * Returns am html string representation of the parameters in this model.
 * The string can be printed to the console for viewing.
 *
 * @param __model__
 * @param __constList__
 * @returns Text that summarises what is in the model.
 */
export function ParamInfo(__model__, __constList__) {
    return JSON.stringify(__constList__);
}
// ================================================================================================
/**
 * Returns an html string representation of one or more entities in the model.
 * The string can be printed to the console for viewing.
 *
 * @param __model__
 * @param entities One or more objects ot collections.
 * @returns void
 */
export function EntityInfo(__model__, entities) {
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = 'util.EntityInfo';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'coll', entities, [ID.isID, ID.isIDL1], [EEntType.COLL, EEntType.PGON, EEntType.PLINE, EEntType.POINT]);
    }
    else {
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    let result = '<h4>Entity Information:</h4>';
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i] = ent_arr;
        switch (ent_type) {
            case EEntType.COLL:
                result += _collInfo(__model__, ent_i);
                break;
            case EEntType.PGON:
                result += _pgonInfo(__model__, ent_i);
                break;
            case EEntType.PLINE:
                result += _plineInfo(__model__, ent_i);
                break;
            case EEntType.POINT:
                result += _pointInfo(__model__, ent_i);
                break;
            default:
                break;
        }
    }
    return result;
}
function _getAttribs(__model__, ent_type, ent_i) {
    const names = __model__.modeldata.attribs.getAttribNames(ent_type);
    const attribs_with_vals = [];
    for (const name of names) {
        const val = __model__.modeldata.attribs.get.getEntAttribVal(ent_type, ent_i, name);
        if (val !== undefined) {
            attribs_with_vals.push(name);
        }
    }
    return attribs_with_vals;
}
function _getColls(__model__, ent_type, ent_i) {
    const ssid = __model__.modeldata.active_ssid;
    let colls_i = [];
    if (ent_type === EEntType.COLL) {
        const parent = __model__.modeldata.geom.snapshot.getCollParent(ssid, ent_i);
        if (parent !== -1) {
            colls_i = [parent];
        }
    }
    else {
        colls_i = __model__.modeldata.geom.nav.navAnyToColl(ent_type, ent_i);
    }
    const colls_names = [];
    for (const coll_i of colls_i) {
        let coll_name = 'No name';
        if (__model__.modeldata.attribs.query.hasEntAttrib(EEntType.COLL, EAttribNames.COLL_NAME)) {
            coll_name = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_NAME);
        }
        colls_names.push(coll_name);
    }
    return colls_names;
}
function _pointInfo(__model__, point_i) {
    let info = '';
    // get the data
    const attribs = _getAttribs(__model__, EEntType.POINT, point_i);
    const colls_names = _getColls(__model__, EEntType.POINT, point_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Point</b></li>';
    info += '<ul>';
    if (attribs.length !== 0) {
        info += '<li>Attribs: ' + attribs.join(', ') + '</li>';
    }
    if (colls_names.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    }
    else if (colls_names.length > 1) {
        info += '<li>In ' + colls_names.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
function _plineInfo(__model__, pline_i) {
    let info = '';
    // get the data
    const attribs = _getAttribs(__model__, EEntType.PLINE, pline_i);
    const num_verts = __model__.modeldata.geom.nav.navAnyToVert(EEntType.PLINE, pline_i).length;
    const num_edges = __model__.modeldata.geom.nav.navAnyToEdge(EEntType.PLINE, pline_i).length;
    const colls_names = _getColls(__model__, EEntType.PLINE, pline_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Polyline</b></li>';
    info += '<ul>';
    if (attribs.length !== 0) {
        info += '<li>Attribs: ' + attribs.join(', ') + '</li>';
    }
    if (num_verts) {
        info += '<li>Num verts: ' + num_verts + '</li>';
    }
    if (num_edges) {
        info += '<li>Num edges: ' + num_edges + '</li>';
    }
    if (colls_names.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    }
    else if (colls_names.length > 1) {
        info += '<li>In ' + colls_names.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
function _pgonInfo(__model__, pgon_i) {
    let info = '';
    // get the data
    const attribs = _getAttribs(__model__, EEntType.PGON, pgon_i);
    const num_verts = __model__.modeldata.geom.nav.navAnyToVert(EEntType.PGON, pgon_i).length;
    const num_edges = __model__.modeldata.geom.nav.navAnyToEdge(EEntType.PGON, pgon_i).length;
    const num_wires = __model__.modeldata.geom.nav.navAnyToWire(EEntType.PGON, pgon_i).length;
    const colls_i = __model__.modeldata.geom.nav.navPgonToColl(pgon_i);
    const colls_names = _getColls(__model__, EEntType.PGON, pgon_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Polygon</b></li>';
    info += '<ul>';
    if (attribs.length !== 0) {
        info += '<li>Attribs: ' + attribs.join(', ') + '</li>';
    }
    if (num_verts) {
        info += '<li>Num verts: ' + num_verts + '</li>';
    }
    if (num_edges) {
        info += '<li>Num edges: ' + num_edges + '</li>';
    }
    if (num_wires) {
        info += '<li>Num wires: ' + num_wires + '</li>';
    }
    if (colls_i.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    }
    else if (colls_i.length > 1) {
        info += '<li>In ' + colls_i.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
function _collInfo(__model__, coll_i) {
    const ssid = __model__.modeldata.active_ssid;
    let info = '';
    // get the data
    let coll_name = 'None';
    if (__model__.modeldata.attribs.query.hasEntAttrib(EEntType.COLL, EAttribNames.COLL_NAME)) {
        coll_name = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.COLL, coll_i, EAttribNames.COLL_NAME);
    }
    const attribs = _getAttribs(__model__, EEntType.COLL, coll_i);
    const num_pgons = __model__.modeldata.geom.nav.navCollToPgon(coll_i).length;
    const num_plines = __model__.modeldata.geom.nav.navCollToPline(coll_i).length;
    const num_points = __model__.modeldata.geom.nav.navCollToPoint(coll_i).length;
    const colls_names = _getColls(__model__, EEntType.COLL, coll_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Collection</b></li>';
    info += '<ul>';
    info += '<li>Name: <b>' + coll_name + '</b></li>';
    if (attribs.length !== 0) {
        info += '<li>Attribs: ' + attribs.join(', ') + '</li>';
    }
    if (num_pgons) {
        info += '<li>Num pgons: ' + num_pgons + '</li>';
    }
    if (num_plines) {
        info += '<li>Num plines: ' + num_plines + '</li>';
    }
    if (num_points) {
        info += '<li>Num points: ' + num_points + '</li>';
    }
    if (colls_names.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    }
    else if (colls_names.length > 1) {
        info += '<li>In ' + colls_names.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    const children = __model__.modeldata.geom.snapshot.getCollChildren(ssid, coll_i);
    if (children.length > 0) {
        info += '<li>Child collections: </li>';
        for (const child of children) {
            info += _collInfo(__model__, child);
        }
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
// ================================================================================================
/**
 * Returns an html string representation of the contents of this model.
 * The string can be printed to the console for viewing.
 *
 * @param __model__
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export function ModelInfo(__model__) {
    let info = '<h4>Model Information:</h4>';
    info += '<ul>';
    // model attribs
    const model_attribs = __model__.modeldata.attribs.getAttribNames(EEntType.MOD);
    if (model_attribs.length !== 0) {
        info += '<li>Model attribs: ' + model_attribs.join(', ') + '</li>';
    }
    // collections
    const num_colls = __model__.modeldata.geom.query.numEnts(EEntType.COLL);
    const coll_attribs = __model__.modeldata.attribs.getAttribNames(EEntType.COLL);
    info += '<li>';
    info += '<b>Collections</b>: ' + num_colls; // + ' (Deleted: ' + num_del_colls + ') ';
    if (coll_attribs.length !== 0) {
        info += 'Attribs: ' + coll_attribs.join(', ');
    }
    info += '</li>';
    // pgons
    const num_pgons = __model__.modeldata.geom.query.numEnts(EEntType.PGON);
    const pgon_attribs = __model__.modeldata.attribs.getAttribNames(EEntType.PGON);
    info += '<li>';
    info += '<b>Polygons</b>: ' + num_pgons; // + ' (Deleted: ' + num_del_pgons + ') ';
    if (pgon_attribs.length !== 0) {
        info += 'Attribs: ' + pgon_attribs.join(', ');
    }
    info += '</li>';
    // plines
    const num_plines = __model__.modeldata.geom.query.numEnts(EEntType.PLINE);
    const pline_attribs = __model__.modeldata.attribs.getAttribNames(EEntType.PLINE);
    info += '<li>';
    info += '<b>Polylines</b>: ' + num_plines; // + ' (Deleted: ' + num_del_plines + ') ';
    if (pline_attribs.length !== 0) {
        info += 'Attribs: ' + pline_attribs.join(', ');
    }
    info += '</li>';
    // points
    const num_points = __model__.modeldata.geom.query.numEnts(EEntType.POINT);
    const point_attribs = __model__.modeldata.attribs.getAttribNames(EEntType.POINT);
    info += '<li>';
    info += '<b>Points</b>: ' + num_points; // + ' (Deleted: ' + num_del_points + ') ';
    if (point_attribs.length !== 0) {
        info += 'Attribs: ' + point_attribs.join(', ');
    }
    info += '</li>';
    // wires
    const num_wires = __model__.modeldata.geom.query.numEnts(EEntType.WIRE);
    const wire_attribs = __model__.modeldata.attribs.getAttribNames(EEntType.WIRE);
    info += '<li>';
    info += '<b>Wires</b>: ' + num_wires; // + ' (Deleted: ' + num_del_wires + ') ';
    if (wire_attribs.length !== 0) {
        info += 'Attribs: ' + wire_attribs.join(', ');
    }
    info += '</li>';
    // edges
    const num_edges = __model__.modeldata.geom.query.numEnts(EEntType.EDGE);
    const edge_attribs = __model__.modeldata.attribs.getAttribNames(EEntType.EDGE);
    info += '<li>';
    info += '<b>Edges</b>: ' + num_edges; // + ' (Deleted: ' + num_del_edges + ') ';
    if (edge_attribs.length !== 0) {
        info += 'Attribs: ' + edge_attribs.join(', ');
    }
    info += '</li>';
    // verts
    const num_verts = __model__.modeldata.geom.query.numEnts(EEntType.VERT);
    const vert_attribs = __model__.modeldata.attribs.getAttribNames(EEntType.VERT);
    info += '<li>';
    info += '<b>Vertices</b>: ' + num_verts; // + ' (Deleted: ' + num_del_verts + ') ';
    if (vert_attribs.length !== 0) {
        info += 'Attribs: ' + vert_attribs.join(', ');
    }
    info += '</li>';
    // posis
    const num_posis = __model__.modeldata.geom.query.numEnts(EEntType.POSI);
    const posi_attribs = __model__.modeldata.attribs.getAttribNames(EEntType.POSI);
    info += '<li>';
    info += '<b>Positions</b>: ' + num_posis; // + ' (Deleted: ' + num_del_posis + ') ';
    if (posi_attribs.length !== 0) {
        info += 'Attribs: ' + posi_attribs.join(', ');
    }
    info += '</li>';
    // end
    info += '</ul>';
    // return the string
    return info;
}
// ================================================================================================
/**
 * Checks the internal consistency of the model. Used for debugigng Mobius.
 *
 * @param __model__
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export function ModelCheck(__model__) {
    console.log('==== ==== ==== ====');
    console.log('MODEL GEOM\n', __model__.modeldata.geom.toStr());
    // console.log('MODEL ATTRIBS\n', __model__.modeldata.attribs.toStr());
    console.log('META\n', __model__.metadata.toDebugStr());
    console.log('==== ==== ==== ====');
    console.log(__model__);
    const check = __model__.check();
    if (check.length > 0) {
        return String(check);
    }
    return 'No internal inconsistencies have been found.';
}
// ================================================================================================
/**
 * Compares two models. Used for grading models.
 *
 * Checks that every entity in this model also exists in the input_data.
 *
 * Additional entitis in the input data will not affect the score.
 *
 * Attributes at the model level are ignored except for the `material` attributes.
 *
 * For grading, this model is assumed to be the answer model, and the input model is assumed to be
 * the model submitted by the student.
 *
 * The order or entities in this model may be modified in the comparison process.
 *
 * For specifying the location of the GI Model, you can either specify a URL, or the name of a file in LocalStorage.
 * In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'
 *
 * @param __model__
 * @param input_data The location of the GI Model to compare this model to.
 * @returns Text that summarises the comparison between the two models.
 */
export async function ModelCompare(__model__, input_data) {
    const input_data_str = await _getFile(input_data);
    if (!input_data_str) {
        throw new Error('Invalid imported model data');
    }
    const input_model = new GIModel();
    input_model.importGI(input_data_str);
    const result = __model__.compare(input_model, true, false, false);
    return result.comment;
}
export function _Async_Param_ModelCompare(__model__, input_data) {
    return null;
}
// ================================================================================================
/**
 * Merges data from another model into this model.
 * This is the same as importing the model, except that no collection is created.
 *
 * For specifying the location of the GI Model, you can either specify a URL, or the name of a file in LocalStorage.
 * In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'
 *
 * @param __model__
 * @param input_data The location of the GI Model to import into this model to.
 * @returns Text that summarises the comparison between the two models.
 */
export async function ModelMerge(__model__, input_data) {
    const input_data_str = await _getFile(input_data);
    if (!input_data_str) {
        throw new Error('Invalid imported model data');
    }
    const ents_arr = __model__.importGI(input_data_str);
    return idsMake(ents_arr);
}
export function _Async_Param_ModelMerge(__model__, input_data) {
    return null;
}
// ================================================================================================
/**
 * Post a message to the parent window.
 *
 * @param __model__
 * @param data The data to send, a list or a dictionary.
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export function SendData(__model__, data) {
    window.parent.postMessage(data, '*');
}
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGVzL2Jhc2ljL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scURBQXFELENBQUM7QUFDOUUsT0FBTyxFQUFFLFFBQVEsRUFBb0IsWUFBWSxFQUFFLG1CQUFtQixFQUErQyxNQUFNLG9EQUFvRCxDQUFDO0FBQ2hMLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLDZEQUE2RCxDQUFDO0FBQ2hHLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDaEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFVLEtBQUssRUFBUSxNQUFNLG9CQUFvQixDQUFDO0FBRW5GLG1HQUFtRztBQUNuRzs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsTUFBTSxDQUFDLFNBQWtCLEVBQUUsUUFBb0M7SUFDM0UsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3RFLE1BQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0lBQ3hGLFFBQVEsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQWEsQ0FBQztJQUMzRSxNQUFNLENBQUMsWUFBWSxFQUFF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