import {
    arrMakeFlat,
    EEntType,
    exportGeojson,
    exportGltf,
    exportPosiBasedObj,
    exportVertBasedObj,
    GIModel,
    idsBreak,
    TEntTypeIdx,
    TId,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../../_check_ids';
import { _EIOExportDataFormat } from './_enum';


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
 export async function ExportData(__model__: GIModel, entities: TId | TId[] | TId[][], data_format: _EIOExportDataFormat): Promise<string> {
    // if (typeof localStorage === 'undefined') { return; }
    // --- Error Check ---
    const fn_name = 'io.Export';
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null) {
            entities = arrMakeFlat(entities) as TId[];
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isIDL1], [EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        }
    } else {
        if (entities !== null) {
            entities = arrMakeFlat(entities) as TId[];
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
    }
    // --- Error Check ---
    const ssid: number = __model__.modeldata.active_ssid;
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
