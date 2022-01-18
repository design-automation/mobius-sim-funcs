import { GIModel, TId } from '@design-automation/mobius-sim';
import { _EIOImportDataFormat } from './_enum';
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
export declare function Import(__model__: GIModel, data_url: string, data_format: _EIOImportDataFormat): Promise<TId | TId[] | {}>;
export declare function _Async_Param_Import(__model__: GIModel, input_data: string, data_format: _EIOImportDataFormat): Promise<TId | TId[] | {}>;
export declare function _import(__model__: GIModel, model_data: string, data_format: _EIOImportDataFormat): TId;
export declare function _importGI(__model__: GIModel, json_str: string): number;
