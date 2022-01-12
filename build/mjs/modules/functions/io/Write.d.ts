/**
 * The `io` module has functions for importing and exporting.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';
import { _EIODataTarget } from './_enum';
/**
 * Write data to the hard disk or to the local storage.
 *
 * @param data The data to be saved (can be the url to the file).
 * @param file_name The name to be saved in the file system (file extension should be included).
 * @param data_target Enum, where the data is to be exported to.
 * @returns whether the data is successfully saved.
 */
export declare function Write(__model__: GIModel, data: string, file_name: string, data_target: _EIODataTarget): Promise<Boolean>;
export declare function _Async_Param_Write(__model__: GIModel, data: string, file_name: string, data_target: _EIODataTarget): Promise<Boolean>;
