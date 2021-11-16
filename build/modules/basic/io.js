/**
 * The `io` module has functions for importing and exporting.
 * @module
 */
import { checkIDs, ID } from '../../_check_ids';
import { checkArgs, isNull, isNum, isStr, isStrL, isXY } from '../../_check_types';
import proj4 from 'proj4';
import { loadAsync } from 'jszip';
import { importObj, exportPosiBasedObj, exportVertBasedObj, importGeojson, exportGeojson, download, EEntType, idsBreak, idMake, arrMakeFlat, getArrDepth, exportGltf, vecAng2, vecFromTo, vecRot, multMatrix, rotateMatrix, importCityJSON } from '@design-automation/mobius-sim';
const requestedBytes = 1024 * 1024 * 200; // 200 MB local storage quota
// ================================================================================================
// Import / Export data types
export var _EIOImportDataFormat;
(function (_EIOImportDataFormat) {
    _EIOImportDataFormat["GI"] = "gi";
    _EIOImportDataFormat["OBJ"] = "obj";
    _EIOImportDataFormat["GEOJSON"] = "geojson";
    _EIOImportDataFormat["CITYJSON"] = "CityJSON";
})(_EIOImportDataFormat || (_EIOImportDataFormat = {}));
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
 * Imports a string of data into the model.
 * \n
 * @param model_data The model data
 * @param data_format Enum, the file format.
 * @returns A list of the positions, points, polylines, polygons and collections added to the model.
 * @example io.Import ("my_data.obj", obj)
 * @example_info Imports the data from my_data.obj, from local storage.
 */
export function ImportData(__model__, model_data, data_format) {
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
 * @param data_url The url to retrieve the data from
 * @param data_format Enum, the file format.
 * @returns A list of the positions, points, polylines, polygons and collections added to the model.
 * @example io.Import ("my_data.obj", obj)
 * @example_info Imports the data from my_data.obj, from local storage.
 */
export async function Import(__model__, data_url, data_format) {
    const model_data = await _getFile(data_url);
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
        case _EIOImportDataFormat.GI:
            const gi_coll_i = _importGI(__model__, model_data);
            return idMake(EEntType.COLL, gi_coll_i);
        case _EIOImportDataFormat.OBJ:
            const obj_coll_i = _importObj(__model__, model_data);
            return idMake(EEntType.COLL, obj_coll_i);
        case _EIOImportDataFormat.GEOJSON:
            const gj_coll_i = _importGeoJSON(__model__, model_data);
            return idMake(EEntType.COLL, gj_coll_i);
        case _EIOImportDataFormat.CITYJSON:
            const cj_coll_i = _importCityJSON(__model__, model_data);
            return idMake(EEntType.COLL, cj_coll_i);
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
function _importGeoJSON(__model__, model_data) {
    // get number of ents before merge
    const num_ents_before = __model__.metadata.getEntCounts();
    // import
    importGeojson(__model__, model_data, 0);
    // get number of ents after merge
    const num_ents_after = __model__.metadata.getEntCounts();
    // return the result
    const container_coll_i = _createColl(__model__, num_ents_before, num_ents_after);
    __model__.modeldata.attribs.set.setEntAttribVal(EEntType.COLL, container_coll_i, 'name', 'import_GeoJSON');
    return container_coll_i;
}
function _importCityJSON(__model__, model_data) {
    // get number of ents before merge
    const num_ents_before = __model__.metadata.getEntCounts();
    // import
    importCityJSON(__model__, model_data);
    // get number of ents after merge
    const num_ents_after = __model__.metadata.getEntCounts();
    // return the result
    const container_coll_i = _createColl(__model__, num_ents_before, num_ents_after);
    __model__.modeldata.attribs.set.setEntAttribVal(EEntType.COLL, container_coll_i, 'name', 'import_CityJSON');
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
 * Export data from the model as a string.
 * \n
 * @param __model__
 * @param entities Optional. Entities to be exported. If null, the whole model will be exported.
 * @param file_name Name of the file as a string.
 * @param data_format Enum, the file format.
 * @returns the model data as a string.
 * @example io.Export (#pg, 'my_model.obj', obj)
 * @example_info Exports all the polgons in the model as an OBJ.
 */
export async function ExportFile(__model__, entities, file_name, data_format) {
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
        checkArgs(fn_name, 'file_name', file_name, [isStr, isStrL]);
    }
    else {
        if (entities !== null) {
            entities = arrMakeFlat(entities);
            ents_arr = idsBreak(entities);
        }
    }
    // --- Error Check ---
    const ssid = __model__.modeldata.active_ssid;
    let model_data = '';
    switch (data_format) {
        case _EIOExportDataFormat.GI:
            model_data = __model__.exportGI(ents_arr);
            return model_data.replace(/\\/g, '\\\\\\'); // TODO temporary fix
        case _EIOExportDataFormat.OBJ_VERT:
            return exportVertBasedObj(__model__, ents_arr, ssid);
        case _EIOExportDataFormat.OBJ_POSI:
            return exportPosiBasedObj(__model__, ents_arr, ssid);
        case _EIOExportDataFormat.GEOJSON:
            return exportGeojson(__model__, ents_arr, true, ssid); // flatten
        case _EIOExportDataFormat.GLTF:
            return await exportGltf(__model__, ents_arr, ssid);
        default:
            throw new Error('Data type not recognised');
    }
}
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
        checkArgs(fn_name, 'file_name', file_name, [isStr, isStrL]);
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
    await loadAsync(zipFile).then(async function (zip) {
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
    if (source.indexOf('://') !== -1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlcy9iYXNpYy9pby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRWhELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRW5GLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBRWxDLE9BQU8sRUFBVyxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFDN0YsUUFBUSxFQUFPLFFBQVEsRUFDdkIsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFDdEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUVoSCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLDZCQUE2QjtBQVV2RSxtR0FBbUc7QUFDbkcsNkJBQTZCO0FBQzdCLE1BQU0sQ0FBTixJQUFZLG9CQUtYO0FBTEQsV0FBWSxvQkFBb0I7SUFDNUIsaUNBQVMsQ0FBQTtJQUNULG1DQUFXLENBQUE7SUFDWCwyQ0FBbUIsQ0FBQTtJQUNuQiw2Q0FBcUIsQ0FBQTtBQUN6QixDQUFDLEVBTFcsb0JBQW9CLEtBQXBCLG9CQUFvQixRQUsvQjtBQUNELE1BQU0sQ0FBTixJQUFZLGNBR1g7QUFIRCxXQUFZLGNBQWM7SUFDdEIsc0NBQW9CLENBQUE7SUFDcEIsZ0RBQThCLENBQUE7QUFDbEMsQ0FBQyxFQUhXLGNB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