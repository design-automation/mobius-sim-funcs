"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._importSIM = exports._importGI = exports._import = exports._Async_Param_Import = exports.Import = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _1 = require(".");
const _enum_1 = require("./_enum");
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
function Import(__model__, data_url, data_format) {
    return __awaiter(this, void 0, void 0, function* () {
        const model_data = yield (0, _1._getFile)(data_url);
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
    });
}
exports.Import = Import;
function _Async_Param_Import(__model__, input_data, data_format) {
    return null;
}
exports._Async_Param_Import = _Async_Param_Import;
function _import(__model__, model_data, data_format) {
    switch (data_format) {
        case _enum_1._EIOImportDataFormat.GI:
            const gi_coll_i = _importGI(__model__, model_data);
            return (0, mobius_sim_1.idMake)(mobius_sim_1.EEntType.COLL, gi_coll_i);
        case _enum_1._EIOImportDataFormat.SIM:
            const sim_coll_i = _importSIM(__model__, model_data);
            return (0, mobius_sim_1.idMake)(mobius_sim_1.EEntType.COLL, sim_coll_i);
        case _enum_1._EIOImportDataFormat.OBJ:
            const obj_coll_i = _importObj(__model__, model_data);
            return (0, mobius_sim_1.idMake)(mobius_sim_1.EEntType.COLL, obj_coll_i);
        case _enum_1._EIOImportDataFormat.GEOJSON:
            const gj_coll_i = _importGeoJSON(__model__, model_data);
            return (0, mobius_sim_1.idMake)(mobius_sim_1.EEntType.COLL, gj_coll_i);
        case _enum_1._EIOImportDataFormat.CITYJSON:
            const cj_coll_i = _importCityJSON(__model__, model_data);
            return (0, mobius_sim_1.idMake)(mobius_sim_1.EEntType.COLL, cj_coll_i);
        default:
            throw new Error('Import type not recognised');
    }
}
exports._import = _import;
function _importGI(__model__, json_str) {
    const ssid = __model__.modeldata.active_ssid;
    // import
    const ents = __model__.importGI(json_str);
    const container_coll_i = __model__.modeldata.geom.add.addColl();
    for (const [ent_type, ent_i] of ents) {
        switch (ent_type) {
            case mobius_sim_1.EEntType.POINT:
                __model__.modeldata.geom.snapshot.addCollPoints(ssid, container_coll_i, ent_i);
                break;
            case mobius_sim_1.EEntType.PLINE:
                __model__.modeldata.geom.snapshot.addCollPlines(ssid, container_coll_i, ent_i);
                break;
            case mobius_sim_1.EEntType.PGON:
                __model__.modeldata.geom.snapshot.addCollPgons(ssid, container_coll_i, ent_i);
                break;
            case mobius_sim_1.EEntType.COLL:
                __model__.modeldata.geom.snapshot.addCollChildren(ssid, container_coll_i, ent_i);
                break;
        }
    }
    __model__.modeldata.attribs.set.setEntAttribVal(mobius_sim_1.EEntType.COLL, container_coll_i, 'name', 'import GI');
    // return the result
    return container_coll_i;
}
exports._importGI = _importGI;
function _importSIM(__model__, json_str) {
    const ssid = __model__.modeldata.active_ssid;
    // import
    const ents = __model__.importSIM(json_str);
    const container_coll_i = __model__.modeldata.geom.add.addColl();
    for (const [ent_type, ent_i] of ents) {
        switch (ent_type) {
            case mobius_sim_1.EEntType.POINT:
                __model__.modeldata.geom.snapshot.addCollPoints(ssid, container_coll_i, ent_i);
                break;
            case mobius_sim_1.EEntType.PLINE:
                __model__.modeldata.geom.snapshot.addCollPlines(ssid, container_coll_i, ent_i);
                break;
            case mobius_sim_1.EEntType.PGON:
                __model__.modeldata.geom.snapshot.addCollPgons(ssid, container_coll_i, ent_i);
                break;
            case mobius_sim_1.EEntType.COLL:
                __model__.modeldata.geom.snapshot.addCollChildren(ssid, container_coll_i, ent_i);
                break;
        }
    }
    __model__.modeldata.attribs.set.setEntAttribVal(mobius_sim_1.EEntType.COLL, container_coll_i, 'name', 'import GI');
    // return the result
    return container_coll_i;
}
exports._importSIM = _importSIM;
function _importObj(__model__, model_data) {
    // get number of ents before merge
    const num_ents_before = __model__.metadata.getEntCounts();
    // import
    (0, mobius_sim_1.importObj)(__model__, model_data);
    // get number of ents after merge
    const num_ents_after = __model__.metadata.getEntCounts();
    // return the result
    const container_coll_i = _createColl(__model__, num_ents_before, num_ents_after);
    __model__.modeldata.attribs.set.setEntAttribVal(mobius_sim_1.EEntType.COLL, container_coll_i, 'name', 'import OBJ');
    return container_coll_i;
}
function _importGeoJSON(__model__, model_data) {
    // get number of ents before merge
    const num_ents_before = __model__.metadata.getEntCounts();
    // import
    (0, mobius_sim_1.importGeojson)(__model__, model_data, 0);
    // get number of ents after merge
    const num_ents_after = __model__.metadata.getEntCounts();
    // return the result
    const container_coll_i = _createColl(__model__, num_ents_before, num_ents_after);
    __model__.modeldata.attribs.set.setEntAttribVal(mobius_sim_1.EEntType.COLL, container_coll_i, 'name', 'import_GeoJSON');
    return container_coll_i;
}
function _importCityJSON(__model__, model_data) {
    // get number of ents before merge
    const num_ents_before = __model__.metadata.getEntCounts();
    // import
    (0, mobius_sim_1.importCityJSON)(__model__, model_data);
    // get number of ents after merge
    const num_ents_after = __model__.metadata.getEntCounts();
    // return the result
    const container_coll_i = _createColl(__model__, num_ents_before, num_ents_after);
    __model__.modeldata.attribs.set.setEntAttribVal(mobius_sim_1.EEntType.COLL, container_coll_i, 'name', 'import_CityJSON');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1wb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2lvL0ltcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSw4REFTdUM7QUFFdkMsd0JBQTZCO0FBQzdCLG1DQUErQztBQUsvQyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsU0FBc0IsTUFBTSxDQUFDLFNBQWtCLEVBQUUsUUFBZ0IsRUFBRSxXQUFpQzs7UUFDaEcsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFBLFdBQVEsRUFBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1NBQ2xEO1FBQ0QsV0FBVztRQUNYLElBQUksVUFBVSxDQUFDLFdBQVcsS0FBSyxFQUFFLENBQUMsV0FBVyxFQUFFO1lBQzNDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztZQUN4QixLQUFLLE1BQU0sU0FBUyxJQUFZLFVBQVUsRUFBRTtnQkFDeEMsSUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUU7b0JBQ3ZCLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFVLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztpQkFDNUY7YUFDSjtZQUNELE9BQU8sWUFBWSxDQUFDO1NBQ3ZCO1FBQ0QsY0FBYztRQUNkLE9BQU8sT0FBTyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDdkQsQ0FBQztDQUFBO0FBakJELHdCQWlCQztBQUNELFNBQWdCLG1CQUFtQixDQUFDLFNBQWtCLEVBQUUsVUFBa0IsRUFBRSxXQUFpQztJQUN6RyxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO0FBRkQsa0RBRUM7QUFDRCxTQUFnQixPQUFP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