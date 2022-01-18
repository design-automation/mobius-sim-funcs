import { GIModel, TId } from '@design-automation/mobius-sim';
import { _EIOImportDataFormat } from './_enum';
/**
 * Imports a string of data into the model.
 * \n
 * @param model_data The model data
 * @param data_format Enum, the file format.
 * @returns A list of the positions, points, polylines, polygons and collections added to the model.
 * @example io.Import ("my_data.obj", obj)
 * @example_info Imports the data from my_data.obj, from local storage.
 */
export declare function ImportData(__model__: GIModel, model_data: string, data_format: _EIOImportDataFormat): TId | TId[] | {};
