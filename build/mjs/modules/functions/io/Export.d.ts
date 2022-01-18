import { GIModel, TId } from '@design-automation/mobius-sim';
import { _EIODataTarget, _EIOExportDataFormat } from './_enum';
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
export declare function Export(__model__: GIModel, entities: TId | TId[] | TId[][], file_name: string, data_format: _EIOExportDataFormat, data_target: _EIODataTarget): Promise<void>;
export declare function _Async_Param_Export(__model__: GIModel, entities: TId | TId[] | TId[][], file_name: string, data_format: _EIOExportDataFormat, data_target: _EIODataTarget): void;
/**
 * Functions for saving and loading resources to file system.
 */
export declare function _saveResource(file: string, name: string): Promise<boolean>;
