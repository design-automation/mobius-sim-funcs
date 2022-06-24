import {
    arrMakeFlat,
    ENT_TYPE,
    exportGeojson,
    exportGltf,
    exportPosiBasedObj,
    exportVertBasedObj,
    Sim,
    idsBreak,
    string,
    string,
} from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import { _EIOExportDataFormat } from './_enum';


/**
 * Export data from the model as a string.
 * \n
 * @param __model__
 * @param entities (Optional) Entities to be exported. If null, the whole model will be exported.
 * @param file_name Name of the file as a string.
 * @param data_format Enum, the export file format: `'gi', 'sim', 'obj_v', 'obj_ps', 'geojson'` or `'gltf'`.
 * @returns The model data as a string.
 * @example `io.Export (#pg, 'my_model.obj', 'obj')`
 * @example_info Exports all the polygons in the model as an OBJ.
 */
 export async function ExportData(__model__: Sim, entities: string | string[] | string[][], data_format: _EIOExportDataFormat): Promise<string> {
    // if (typeof localStorage === 'undefined') { return; }
    // // --- Error Check ---
    // const fn_name = 'io.Export';
    // let ents_arr = null;
    // if (this.debug) {
    //     if (entities !== null) {
    //         entities = arrMakeFlat(entities) as string[];
    //         ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
    //             [ID.isIDL1], [ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
    //     }
    // } else {
    //     if (entities !== null) {
    //         entities = arrMakeFlat(entities) as string[];
    //         ents_arr = idsBreak(entities) as string[];
    //     }
    // }
    // // --- Error Check ---
    const ssid: number = __model__.modeldata.active_ssid;
    switch (data_format) {
        case _EIOExportDataFormat.GI:
            const gi_model_data: string = __model__.exportGI(ents_arr);
            return gi_model_data.replace(/\\/g, '\\\\\\'); // TODO temporary fix
        case _EIOExportDataFormat.SIM:
            const sim_model_data: string = __model__.exportSIM(ents_arr);
            return sim_model_data.replace(/\\/g, '\\\\\\'); // TODO temporary fix
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
