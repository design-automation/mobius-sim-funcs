/**
 * The `io` module has functions for importing and exporting.
 * @module
 */
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { importObj, exportPosiBasedObj, exportVertBasedObj } from '@design-automation/mobius-sim/dist/geo-info/io/io_obj';
import { importGeojson, exportGeojson } from '@design-automation/mobius-sim/dist/geo-info/io/io_geojson';
import { download } from '@design-automation/mobius-sim/dist/filesys/download';
import { EEntType } from '@design-automation/mobius-sim/dist/geo-info/common';
// import { __merge__ } from '../_model';
// import { _model } from '..';
import { idsBreak, idMake } from '@design-automation/mobius-sim/dist/geo-info/common_id_funcs';
import { arrMakeFlat, getArrDepth } from '@design-automation/mobius-sim/dist/util/arrs';
import JSZip from 'jszip';
import { exportGltf } from '@design-automation/mobius-sim/dist/geo-info/io/io_gltf';
import { vecAng2, vecFromTo, vecRot } from '@design-automation/mobius-sim/dist/geom/vectors';
import { multMatrix, rotateMatrix } from '@design-automation/mobius-sim/dist/geom/matrix';
import proj4 from 'proj4';
import { checkArgs, isNull, isNum, isXY } from '../../_check_types';
const requestedBytes = 1024 * 1024 * 200; // 200 MB local storage quota
// ================================================================================================
// Import / Export data types
export var _EIODataFormat;
(function (_EIODataFormat) {
    _EIODataFormat["GI"] = "gi";
    _EIODataFormat["OBJ"] = "obj";
    _EIODataFormat["GEOJSON"] = "geojson";
})(_EIODataFormat || (_EIODataFormat = {}));
export var _EIODataSource;
(function (_EIODataSource) {
    _EIODataSource["DEFAULT"] = "From URL";
    _EIODataSource["FILESYS"] = "From Local Storage";
})(_EIODataSource || (_EIODataSource = {}));
export var _EIODataTarget;
(function (_EIODataTarget) {
    _EIODataTarget["DEFAULT"] = "Save to Hard Disk";
    _EIODataTarget["FILESYS"] = "Save to Local Storage";
})(_EIODataTarget || (_EIODataTarget = {}));
// ================================================================================================
/**
 * Read data from a Url or from local storage.
 *
 * @param data The data to be read (from URL or from Local Storage).
 * @returns the data.
 */
export async function Read(__model__, data) {
    return _getFile(data);
}
export function _Async_Param_Read(__model__, data) {
    return null;
}
// ================================================================================================
/**
 * Write data to the hard disk or to the local storage.
 *
 * @param data The data to be saved (can be the url to the file).
 * @param file_name The name to be saved in the file system (file extension should be included).
 * @param data_target Enum, where the data is to be exported to.
 * @returns whether the data is successfully saved.
 */
export async function Write(__model__, data, file_name, data_target) {
    try {
        if (data_target === _EIODataTarget.DEFAULT) {
            return download(data, file_name);
        }
        return saveResource(data, file_name);
    }
    catch (ex) {
        return false;
    }
}
export function _Async_Param_Write(__model__, data, file_name, data_target) {
    return null;
}
// ================================================================================================
/**
 * Imports data into the model.
 * \n
 * There are two ways of specifying the file location to be imported:
 * - A url, e.g. "https://www.dropbox.com/xxxx/my_data.obj"
 * - A file name in the local storage, e.g. "my_data.obj".
 * \n
 * To place a file in local storage, go to the Mobius menu, and select 'Local Storage' from the dropdown.
 * Note that a script using a file in local storage may fail when others try to open the file.
 * \n
 * @param model_data The model data
 * @param data_format Enum, the file format.
 * @returns A list of the positions, points, polylines, polygons and collections added to the model.
 * @example io.Import ("my_data.obj", obj)
 * @example_info Imports the data from my_data.obj, from local storage.
 */
export async function Import(__model__, input_data, data_format) {
    const model_data = await _getFile(input_data);
    if (!model_data) {
        throw new Error('Invalid imported model data');
    }
    // zip file
    if (model_data.constructor === {}.constructor) {
        const coll_results = {};
        for (const data_name in model_data) {
            if (model_data[data_name]) {
                coll_results[data_name] = _import(__model__, model_data[data_name], data_format);
            }
        }
        return coll_results;
    }
    // single file
    return _import(__model__, model_data, data_format);
}
export function _Async_Param_Import(__model__, input_data, data_format) {
    return null;
}
export function _import(__model__, model_data, data_format) {
    switch (data_format) {
        case _EIODataFormat.GI:
            const gi_coll_i = _importGI(__model__, model_data);
            return idMake(EEntType.COLL, gi_coll_i);
        case _EIODataFormat.OBJ:
            const obj_coll_i = _importObj(__model__, model_data);
            return idMake(EEntType.COLL, obj_coll_i);
        case _EIODataFormat.GEOJSON:
            const gj_coll_i = _importGeojson(__model__, model_data);
            return idMake(EEntType.COLL, gj_coll_i);
        default:
            throw new Error('Import type not recognised');
    }
}
export function _importGI(__model__, json_str) {
    const ssid = __model__.modeldata.active_ssid;
    // import
    const ents = __model__.importGI(json_str);
    const container_coll_i = __model__.modeldata.geom.add.addColl();
    for (const [ent_type, ent_i] of ents) {
        switch (ent_type) {
            case EEntType.POINT:
                __model__.modeldata.geom.snapshot.addCollPoints(ssid, container_coll_i, ent_i);
                break;
            case EEntType.PLINE:
                __model__.modeldata.geom.snapshot.addCollPlines(ssid, container_coll_i, ent_i);
                break;
            case EEntType.PGON:
                __model__.modeldata.geom.snapshot.addCollPgons(ssid, container_coll_i, ent_i);
                break;
            case EEntType.COLL:
                __model__.modeldata.geom.snapshot.addCollChildren(ssid, container_coll_i, ent_i);
                break;
        }
    }
    __model__.modeldata.attribs.set.setEntAttribVal(EEntType.COLL, container_coll_i, 'name', 'import GI');
    // return the result
    return container_coll_i;
}
function _importObj(__model__, model_data) {
    // get number of ents before merge
    const num_ents_before = __model__.metadata.getEntCounts();
    // import
    importObj(__model__, model_data);
    // get number of ents after merge
    const num_ents_after = __model__.metadata.getEntCounts();
    // return the result
    const container_coll_i = _createColl(__model__, num_ents_before, num_ents_after);
    __model__.modeldata.attribs.set.setEntAttribVal(EEntType.COLL, container_coll_i, 'name', 'import OBJ');
    return container_coll_i;
}
function _importGeojson(__model__, model_data) {
    // get number of ents before merge
    const num_ents_before = __model__.metadata.getEntCounts();
    // import
    importGeojson(__model__, model_data, 0);
    // get number of ents after merge
    const num_ents_after = __model__.metadata.getEntCounts();
    // return the result
    const container_coll_i = _createColl(__model__, num_ents_before, num_ents_after);
    __model__.modeldata.attribs.set.setEntAttribVal(EEntType.COLL, container_coll_i, 'name', 'import GEOJSON');
    return container_coll_i;
}
// function _createGIColl(__model__: GIModel, before: number[], after: number[]): number {
//     throw new Error('Not implemented');
//     // const points_i: number[] = [];
//     // const plines_i: number[] = [];
//     // const pgons_i: number[] = [];
//     // for (let point_i = before[1]; point_i < after[1]; point_i++) {
//     //     if (__model__.modeldata.geom.query.entExists(EEntType.POINT, point_i)) {
//     //         points_i.push( point_i );
//     //     }
//     // }
//     // for (let pline_i = before[2]; pline_i < after[2]; pline_i++) {
//     //     if (__model__.modeldata.geom.query.entExists(EEntType.PLINE, pline_i)) {
//     //         plines_i.push( pline_i );
//     //     }
//     // }
//     // for (let pgon_i = before[3]; pgon_i < after[3]; pgon_i++) {
//     //     if (__model__.modeldata.geom.query.entExists(EEntType.PGON, pgon_i)) {
//     //         pgons_i.push( pgon_i );
//     //     }
//     // }
//     // if (points_i.length + plines_i.length + pgons_i.length === 0) { return null; }
//     // const container_coll_i: number = __model__.modeldata.geom.add.addColl(null, points_i, plines_i, pgons_i);
//     // for (let coll_i = before[4]; coll_i < after[4]; coll_i++) {
//     //     if (__model__.modeldata.geom.query.entExists(EEntType.COLL, coll_i)) {
//     //         __model__.modeldata.geom.modify_coll.setCollParent(coll_i, container_coll_i);
//     //     }
//     // }
//     // return container_coll_i;
// }
function _createColl(__model__, before, after) {
    const ssid = __model__.modeldata.active_ssid;
    const points_i = [];
    const plines_i = [];
    const pgons_i = [];
    const colls_i = [];
    for (let point_i = before[1]; point_i < after[1]; point_i++) {
        points_i.push(point_i);
    }
    for (let pline_i = before[2]; pline_i < after[2]; pline_i++) {
        plines_i.push(pline_i);
    }
    for (let pgon_i = before[3]; pgon_i < after[3]; pgon_i++) {
        pgons_i.push(pgon_i);
    }
    for (let coll_i = before[4]; coll_i < after[4]; coll_i++) {
        colls_i.push(coll_i);
    }
    if (points_i.length + plines_i.length + pgons_i.length === 0) {
        return null;
    }
    const container_coll_i = __model__.modeldata.geom.add.addColl();
    __model__.modeldata.geom.snapshot.addCollPoints(ssid, container_coll_i, points_i);
    __model__.modeldata.geom.snapshot.addCollPlines(ssid, container_coll_i, plines_i);
    __model__.modeldata.geom.snapshot.addCollPgons(ssid, container_coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.addCollChildren(ssid, container_coll_i, colls_i);
    return container_coll_i;
}
// ================================================================================================
export var _EIOExportDataFormat;
(function (_EIOExportDataFormat) {
    _EIOExportDataFormat["GI"] = "gi";
    _EIOExportDataFormat["OBJ_VERT"] = "obj_v";
    _EIOExportDataFormat["OBJ_POSI"] = "obj_ps";
    // DAE = 'dae',
    _EIOExportDataFormat["GEOJSON"] = "geojson";
    _EIOExportDataFormat["GLTF"] = "gltf";
})(_EIOExportDataFormat || (_EIOExportDataFormat = {}));
/**
 * Export data from the model as a file.
 * \n
 * If you expore to your  hard disk,
 * it will result in a popup in your browser, asking you to save the file.
 * \n
 * If you export to Local Storage, there will be no popup.
 * \n
 * @param __model__
 * @param entities Optional. Entities to be exported. If null, the whole model will be exported.
 * @param file_name Name of the file as a string.
 * @param data_format Enum, the file format.
 * @param data_target Enum, where the data is to be exported to.
 * @returns void.
 * @example io.Export (#pg, 'my_model.obj', obj)
 * @example_info Exports all the polgons in the model as an OBJ.
 */
export async function Export(__model__, entities, file_name, data_format, data_target) {
    if (typeof localStorage === 'undefined') {
        return;
    }
    // --- Error Check ---
    const fn_name = 'io.Export';
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null) {
            entities = arrMakeFlat(entities);
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isIDL1], [EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
        }
        chk.checkArgs(fn_name, 'file_name', file_name, [chk.isStr, chk.isStrL]);
    }
    else {
        if (entities !== null) {
            entities = arrMakeFlat(entities);
            ents_arr = idsBreak(entities);
        }
    }
    // --- Error Check ---
    await _export(__model__, ents_arr, file_name, data_format, data_target);
}
export function _Async_Param_Export(__model__, entities, file_name, data_format, data_target) {
}
async function _export(__model__, ents_arr, file_name, data_format, data_target) {
    const ssid = __model__.modeldata.active_ssid;
    switch (data_format) {
        case _EIOExportDataFormat.GI:
            {
                let model_data = '';
                model_data = __model__.exportGI(ents_arr);
                // gi_data = gi_data.replace(/\\\"/g, '\\\\\\"'); // TODO temporary fix
                model_data = model_data.replace(/\\/g, '\\\\\\'); // TODO temporary fix
                // === save the file ===
                if (data_target === _EIODataTarget.DEFAULT) {
                    return download(model_data, file_name);
                }
                return saveResource(model_data, file_name);
            }
        case _EIOExportDataFormat.OBJ_VERT:
            {
                const obj_verts_data = exportVertBasedObj(__model__, ents_arr, ssid);
                // obj_data = obj_data.replace(/#/g, '%23'); // TODO temporary fix
                if (data_target === _EIODataTarget.DEFAULT) {
                    return download(obj_verts_data, file_name);
                }
                return saveResource(obj_verts_data, file_name);
            }
        case _EIOExportDataFormat.OBJ_POSI:
            {
                const obj_posis_data = exportPosiBasedObj(__model__, ents_arr, ssid);
                // obj_data = obj_data.replace(/#/g, '%23'); // TODO temporary fix
                if (data_target === _EIODataTarget.DEFAULT) {
                    return download(obj_posis_data, file_name);
                }
                return saveResource(obj_posis_data, file_name);
            }
        // case _EIOExportDataFormat.DAE:
        //     const dae_data: string = exportDae(__model__);
        //     // dae_data = dae_data.replace(/#/g, '%23'); // TODO temporary fix
        //     if (data_target === _EIODataTarget.DEFAULT) {
        //         return download(dae_data, file_name);
        //     }
        //     return saveResource(dae_data, file_name);
        //     break;
        case _EIOExportDataFormat.GEOJSON:
            {
                const geojson_data = exportGeojson(__model__, ents_arr, true, ssid); // flatten
                if (data_target === _EIODataTarget.DEFAULT) {
                    return download(geojson_data, file_name);
                }
                return saveResource(geojson_data, file_name);
            }
        case _EIOExportDataFormat.GLTF:
            {
                const gltf_data = await exportGltf(__model__, ents_arr, ssid);
                if (data_target === _EIODataTarget.DEFAULT) {
                    return download(gltf_data, file_name);
                }
                return saveResource(gltf_data, file_name);
            }
        default:
            throw new Error('Data type not recognised');
    }
}
// ================================================================================================
/**
 * Set the geolocation of the Cartesian coordinate system.
 *
 * @param __model__
 * @param lat_long Set the latitude and longitude of the origin of the Cartesian coordinate system.
 * @param rot Set the counter-clockwise rotation of the Cartesian coordinate system, in radians.
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns void
 */
export function Geolocate(__model__, lat_long, rot, elev) {
    // --- Error Check ---
    const fn_name = 'io.Geolocate';
    if (__model__.debug) {
        checkArgs(fn_name, 'lat_long_o', lat_long, [isXY, isNull]);
        checkArgs(fn_name, 'rot', elev, [isNum, isNull]);
        checkArgs(fn_name, 'elev', elev, [isNum, isNull]);
    }
    // --- Error Check ---
    const gl_dict = { "latitude": lat_long[0], "longitude": lat_long[1] };
    if (elev !== null) {
        gl_dict["elevation"] = elev;
    }
    __model__.modeldata.attribs.set.setModelAttribVal("geolocation", gl_dict);
    let n_vec = [0, 1, 0];
    if (rot !== null) {
        n_vec = vecRot(n_vec, [0, 0, 1], -rot);
    }
    __model__.modeldata.attribs.set.setModelAttribVal("north", [n_vec[0], n_vec[1]]);
}
// ================================================================================================
/**
 * Set the geolocation of the Cartesian coordinate system.
 * \n
 * The Cartesian coordinate system is geolocated by defining two points:
 * - The latitude-longitude of the Cartesian origin.
 * - The latitude-longitude of a point on the positive Cartesian X-axis.
 * \n
 * @param __model__
 * @param lat_long_o Set the latitude and longitude of the origin of the Cartesian coordinate
 * system.
 * @param lat_long_x Set the latitude and longitude of a point on the x-axis of the Cartesian
 * coordinate system.
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns void
 */
export function Geoalign(__model__, lat_long_o, lat_long_x, elev) {
    // --- Error Check ---
    const fn_name = 'io.Geoalign';
    if (__model__.debug) {
        checkArgs(fn_name, 'lat_long_o', lat_long_o, [isXY, isNull]);
        checkArgs(fn_name, 'lat_long_x', lat_long_x, [isXY, isNull]);
        checkArgs(fn_name, 'elev', elev, [isNum, isNull]);
    }
    // --- Error Check ---
    const gl_dict = { "latitude": lat_long_o[0], "longitude": lat_long_o[1] };
    if (elev !== null) {
        gl_dict["elevation"] = elev;
    }
    __model__.modeldata.attribs.set.setModelAttribVal("geolocation", gl_dict);
    // calc
    const proj_obj = _createProjection(__model__);
    // origin
    let xyz_o = _xformFromLongLatToXYZ([lat_long_o[1], lat_long_o[0]], proj_obj, 0);
    // point on x axis
    let xyz_x = _xformFromLongLatToXYZ([lat_long_x[1], lat_long_x[0]], proj_obj, 0);
    // x axis vector
    const old_x_vec = [1, 0, 0];
    const new_x_vec = vecFromTo(xyz_o, xyz_x);
    const rot = vecAng2(old_x_vec, new_x_vec, [0, 0, 1]);
    // console.log("rot = ", rot, "x_vec = ", x_vec, xyz_o, xyz_x)
    // north vector
    const n_vec = vecRot([0, 1, 0], [0, 0, 1], -rot);
    __model__.modeldata.attribs.set.setModelAttribVal("north", [n_vec[0], n_vec[1]]);
}
// ================================================================================================
// ================================================================================================
// ================================================================================================
// ================================================================================================
/**
 * Functions for geospatial projection
 */
// longitude latitude in Singapore, NUS
const LONGLAT = [103.778329, 1.298759];
/**
 * TODO MEgre with io_geojson.ts
 * Get long lat, Detect CRS, create projection function
 * @param model The model.
 * @param point The features to add.
 */
function _createProjection(model) {
    // create the function for transformation
    const proj_str_a = '+proj=tmerc +lat_0=';
    const proj_str_b = ' +lon_0=';
    const proj_str_c = '+k=1 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs';
    let longitude = LONGLAT[0];
    let latitude = LONGLAT[1];
    if (model.modeldata.attribs.query.hasModelAttrib('geolocation')) {
        const geolocation = model.modeldata.attribs.get.getModelAttribVal('geolocation');
        const long_value = geolocation['longitude'];
        if (typeof long_value !== 'number') {
            throw new Error('Longitude attribute must be a number.');
        }
        longitude = long_value;
        if (longitude < -180 || longitude > 180) {
            throw new Error('Longitude attribute must be between -180 and 180.');
        }
        const lat_value = geolocation['latitude'];
        if (typeof lat_value !== 'number') {
            throw new Error('Latitude attribute must be a number');
        }
        latitude = lat_value;
        if (latitude < 0 || latitude > 90) {
            throw new Error('Latitude attribute must be between 0 and 90.');
        }
    }
    console.log("lat long", latitude, longitude);
    // try to figure out what the projection is of the source file
    // let proj_from_str = 'WGS84';
    // if (geojson_obj.hasOwnProperty('crs')) {
    //     if (geojson_obj.crs.hasOwnProperty('properties')) {
    //         if (geojson_obj.crs.properties.hasOwnProperty('name')) {
    //             const name: string = geojson_obj.crs.properties.name;
    //             const epsg_index = name.indexOf('EPSG');
    //             if (epsg_index !== -1) {
    //                 let epsg = name.slice(epsg_index);
    //                 epsg = epsg.replace(/\s/g, '+');
    //                 if (epsg === 'EPSG:4326') {
    //                     // do nothing, 'WGS84' is fine
    //                 } else if (['EPSG:4269', 'EPSG:3857', 'EPSG:3785', 'EPSG:900913', 'EPSG:102113'].indexOf(epsg) !== -1) {
    //                     // these are the epsg codes that proj4 knows
    //                     proj_from_str = epsg;
    //                 } else if (epsg === 'EPSG:3414') {
    //                     // singapore
    //                     proj_from_str =
    //                         '+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 ' +
    //                         '+ellps=WGS84 +units=m +no_defs';
    //                 }
    //             }
    //         }
    //     }
    // }
    // console.log('CRS of geojson data', proj_from_str);
    const proj_from_str = 'WGS84';
    const proj_to_str = proj_str_a + latitude + proj_str_b + longitude + proj_str_c;
    const proj_obj = proj4(proj_from_str, proj_to_str);
    return proj_obj;
}
/**
 * TODO MEgre with io_geojson.ts
 * Converts geojson long lat to cartesian coords
 * @param long_lat_arr
 * @param elevation
 */
function _xformFromLongLatToXYZ(long_lat_arr, proj_obj, elevation) {
    if (getArrDepth(long_lat_arr) === 1) {
        const long_lat = long_lat_arr;
        const xy = proj_obj.forward(long_lat);
        return [xy[0], xy[1], elevation];
    }
    else {
        long_lat_arr = long_lat_arr;
        const xyzs_xformed = [];
        for (const long_lat of long_lat_arr) {
            if (long_lat.length >= 2) {
                const xyz = _xformFromLongLatToXYZ(long_lat, proj_obj, elevation);
                xyzs_xformed.push(xyz);
            }
        }
        return xyzs_xformed;
    }
}
// ================================================================================================
/**
 * Transform a coordinate from latitude-longitude Geodesic coordinate to a Cartesian XYZ coordinate,
 * based on the geolocation of the model.
 *
 * @param __model__
 * @param lat_long Latitude and longitude coordinates.
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns XYZ coordinates
 */
export function LatLong2XYZ(__model__, lat_long, elev) {
    // --- Error Check ---
    const fn_name = 'util.LatLong2XYZ';
    if (__model__.debug) {
        checkArgs(fn_name, 'lat_long', lat_long, [isXY, isNull]);
        checkArgs(fn_name, 'elev', elev, [isNum, isNull]);
    }
    // --- Error Check ---
    const proj_obj = _createProjection(__model__);
    // calculate angle of rotation
    let rot_matrix = null;
    if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
        const north = __model__.modeldata.attribs.get.getModelAttribVal('north');
        if (Array.isArray(north)) {
            const rot_ang = vecAng2([0, 1, 0], [north[0], north[1], 0], [0, 0, 1]);
            rot_matrix = rotateMatrix([[0, 0, 0], [0, 0, 1]], rot_ang);
        }
    }
    // add feature
    let xyz = _xformFromLongLatToXYZ([lat_long[1], lat_long[0]], proj_obj, elev);
    // rotate to north
    if (rot_matrix !== null) {
        xyz = multMatrix(xyz, rot_matrix);
    }
    return xyz;
}
// ================================================================================================
// ================================================================================================
// ================================================================================================
// ================================================================================================
/**
 * Functions for saving and loading resources to file system.
 */
async function saveResource(file, name) {
    const itemstring = localStorage.getItem('mobius_backup_list');
    if (!itemstring) {
        localStorage.setItem('mobius_backup_list', `["${name}"]`);
        localStorage.setItem('mobius_backup_date_dict', `{ "${name}": "${(new Date()).toLocaleString()}"}`);
    }
    else {
        const items = JSON.parse(itemstring);
        let check = false;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item === name) {
                items.splice(i, 1);
                items.unshift(item);
                check = true;
                break;
            }
        }
        if (!check) {
            items.unshift(name);
            // if (items.length > 10) {
            //     const item = items.pop();
            //     localStorage.removeItem(item);
            // }
        }
        localStorage.setItem('mobius_backup_list', JSON.stringify(items));
        const itemDates = JSON.parse(localStorage.getItem('mobius_backup_date_dict'));
        itemDates[itemstring] = (new Date()).toLocaleString();
        localStorage.setItem('mobius_backup_date_dict', JSON.stringify(itemDates));
    }
    // window['_code__'] = name;
    // window['_file__'] = file;
    function saveToFS(fs) {
        const code = name;
        // console.log(code)
        fs.root.getFile(code, { create: true }, function (fileEntry) {
            fileEntry.createWriter(async function (fileWriter) {
                const bb = new Blob([file + '_|_|_'], { type: 'text/plain;charset=utf-8' });
                await fileWriter.write(bb);
            }, (e) => { console.log(e); });
        }, (e) => { console.log(e.code); });
    }
    navigator.webkitPersistentStorage.requestQuota(requestedBytes, function (grantedBytes) {
        // @ts-ignore
        window.webkitRequestFileSystem(PERSISTENT, grantedBytes, saveToFS, function (e) { throw e; });
    }, function (e) { throw e; });
    return true;
    // localStorage.setItem(code, file);
}
async function getURLContent(url) {
    url = url.replace('http://', 'https://');
    if (url.indexOf('dropbox') !== -1) {
        url = url.replace('www', 'dl').replace('dl=0', 'dl=1');
    }
    if (url[0] === '"' || url[0] === '\'') {
        url = url.substring(1);
    }
    if (url[url.length - 1] === '"' || url[url.length - 1] === '\'') {
        url = url.substring(0, url.length - 1);
    }
    const p = new Promise((resolve) => {
        const fetchObj = fetch(url);
        fetchObj.catch(err => {
            resolve('HTTP Request Error: Unable to retrieve file from ' + url);
        });
        fetchObj.then(res => {
            if (!res.ok) {
                resolve('HTTP Request Error: Unable to retrieve file from ' + url);
                return '';
            }
            if (url.indexOf('.zip') !== -1) {
                res.blob().then(body => resolve(body));
            }
            else {
                res.text().then(body => resolve(body.replace(/(\\[bfnrtv\'\"\\])/g, '\\$1')));
            }
        });
    });
    return await p;
}
async function openZipFile(zipFile) {
    const result = {};
    await JSZip.loadAsync(zipFile).then(async function (zip) {
        for (const filename of Object.keys(zip.files)) {
            // const splittedNames = filename.split('/').slice(1).join('/');
            await zip.files[filename].async('text').then(function (fileData) {
                result[filename] = fileData;
            });
        }
    });
    return result;
}
async function loadFromFileSystem(filecode) {
    const p = new Promise((resolve) => {
        navigator.webkitPersistentStorage.requestQuota(requestedBytes, function (grantedBytes) {
            // @ts-ignore
            window.webkitRequestFileSystem(PERSISTENT, grantedBytes, function (fs) {
                fs.root.getFile(filecode, {}, function (fileEntry) {
                    fileEntry.file((file) => {
                        const reader = new FileReader();
                        reader.onerror = () => {
                            resolve('error');
                        };
                        reader.onloadend = () => {
                            if ((typeof reader.result) === 'string') {
                                resolve(reader.result.split('_|_|_')[0]);
                                // const splitted = (<string>reader.result).split('_|_|_');
                                // let val = splitted[0];
                                // for (const i of splitted) {
                                //     if (val.length < i.length) {
                                //         val = i;
                                //     }
                                // }
                                // resolve(val);
                            }
                            else {
                                resolve(reader.result);
                            }
                        };
                        reader.readAsText(file, 'text/plain;charset=utf-8');
                    });
                });
            });
        }, function (e) { console.log('Error', e); });
    });
    return await p;
}
export async function _getFile(source) {
    if (source.indexOf('__model_data__') !== -1) {
        return source.split('__model_data__').join('');
    }
    else if (source[0] === '{') {
        return source;
    }
    else if (source.indexOf('://') !== -1) {
        const val = source.replace(/ /g, '');
        const result = await getURLContent(val);
        if (result === undefined) {
            return source;
        }
        else if (result.indexOf && result.indexOf('HTTP Request Error') !== -1) {
            throw new Error(result);
        }
        else if (val.indexOf('.zip') !== -1) {
            return await openZipFile(result);
        }
        else {
            return result;
        }
    }
    else {
        if (source.length > 1 && source[0] === '{') {
            return null;
        }
        const val = source.replace(/\"|\'/g, '');
        const backup_list = JSON.parse(localStorage.getItem('mobius_backup_list'));
        if (val.endsWith('.zip')) {
            throw (new Error(`Importing zip files from local storage is not supported`));
        }
        if (val.indexOf('*') !== -1) {
            const splittedVal = val.split('*');
            const start = splittedVal[0] === '' ? null : splittedVal[0];
            const end = splittedVal[1] === '' ? null : splittedVal[1];
            let result = '{';
            for (const backup_name of backup_list) {
                let valid_check = true;
                if (start && !backup_name.startsWith(start)) {
                    valid_check = false;
                }
                if (end && !backup_name.endsWith(end)) {
                    valid_check = false;
                }
                if (valid_check) {
                    const backup_file = await loadFromFileSystem(backup_name);
                    result += `"${backup_name}": \`${backup_file.replace(/\\/g, '\\\\')}\`,`;
                }
            }
            result += '}';
            return result;
        }
        else {
            if (backup_list.indexOf(val) !== -1) {
                const result = await loadFromFileSystem(val);
                if (!result || result === 'error') {
                    throw (new Error(`File named ${val} does not exist in the local storage`));
                    // return source;
                }
                else {
                    return result;
                }
            }
            else {
                throw (new Error(`File named ${val} does not exist in the local storage`));
            }
        }
    }
}
export function _Async_Param__getFile(source) {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlcy9iYXNpYy9pby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRWhELE9BQU8sS0FBSyxHQUFHLE1BQU0sb0JBQW9CLENBQUM7QUFHMUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQzFILE9BQU8sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkRBQTJELENBQUM7QUFDekcsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQy9FLE9BQU8sRUFBTyxRQUFRLEVBQXNELE1BQU0sb0RBQW9ELENBQUM7QUFDdkkseUNBQXlDO0FBQ3pDLCtCQUErQjtBQUMvQixPQUFPLEVBQVcsUUFBUSxFQUFtQixNQUFNLEVBQUUsTUFBTSw2REFBNkQsQ0FBQztBQUN6SCxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3hGLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFFcEYsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0saURBQWlELENBQUM7QUFDN0YsT0FBTyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUUxRixPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFpQixJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FB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