import { EEntType, idMake, importCityJSON, importGeojson, importObj, } from '@design-automation/mobius-sim';
import { _getFile } from '.';
import { _EIOImportDataFormat } from './_enum';
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
        case _EIOImportDataFormat.SIM:
            const sim_coll_i = _importSIM(__model__, model_data);
            return idMake(EEntType.COLL, sim_coll_i);
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
export function _importSIM(__model__, json_str) {
    const ssid = __model__.modeldata.active_ssid;
    // import
    const ents = __model__.importSIM(json_str);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1wb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2lvL0ltcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsUUFBUSxFQUVSLE1BQU0sRUFDTixjQUFjLEVBQ2QsYUFBYSxFQUNiLFNBQVMsR0FHWixNQUFNLCtCQUErQixDQUFDO0FBRXZDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxHQUFHLENBQUM7QUFDN0IsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBSy9DLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxNQUFNLENBQUMsS0FBSyxVQUFVLE1BQU0sQ0FBQyxTQUFrQixFQUFFLFFBQWdCLEVBQUUsV0FBaUM7SUFDaEcsTUFBTSxVQUFVLEdBQUcsTUFBTSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztLQUNsRDtJQUNELFdBQVc7SUFDWCxJQUFJLFVBQVUsQ0FBQyxXQUFXLEtBQUssRUFBRSxDQUFDLFdBQVcsRUFBRTtRQUMzQyxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDeEIsS0FBSyxNQUFNLFNBQVMsSUFBWSxVQUFVLEVBQUU7WUFDeEMsSUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ3ZCLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFVLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQzthQUM1RjtTQUNKO1FBQ0QsT0FBTyxZQUFZLENBQUM7S0FDdkI7SUFDRCxjQUFjO0lBQ2QsT0FBTyxPQUFPLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBQ0Qs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