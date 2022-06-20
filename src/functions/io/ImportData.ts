import { Sim, string } from '../../mobius_sim';

import { _EIOImportDataFormat } from './_enum';
import { _import } from './Import';




// ================================================================================================
/**
 * Imports a string of geometry data into the model, in various formats.
 * The geometry will be added to the model.
 * \n
 * @param model_data The model data.
 * @param data_format Enum, the file format: `'gi', 'sim', 'obj', 'geojson'` or `'CityJSON'`.
 * @returns A collection of entities added to the model.
 * @example `io.ImportData (data_str, "obj")`
 * @example_info Imports the data in obj format.
 */
export function ImportData(__model__: Sim, model_data: string, data_format: _EIOImportDataFormat): string | string[] | {} {
    if (!model_data) {
        throw new Error('Invalid imported model data');
    }
    // zip file
    if (model_data.constructor === {}.constructor) {
        const coll_results = {};
        for (const data_name in <Object>model_data) {
            if (model_data[data_name]) {
                coll_results[data_name] = _import(__model__, <string>model_data[data_name], data_format);
            }
        }
        return coll_results;
    }
    // single file
    return _import(__model__, model_data, data_format);
}
