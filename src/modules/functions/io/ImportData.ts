import { GIModel, TId } from '@design-automation/mobius-sim';

import { _EIOImportDataFormat } from './_enum';
import { _import } from './Import';




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
export function ImportData(__model__: GIModel, model_data: string, data_format: _EIOImportDataFormat): TId | TId[] | {} {
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
