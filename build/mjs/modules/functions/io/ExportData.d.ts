import { GIModel, TId } from '@design-automation/mobius-sim';
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
export declare function ExportData(__model__: GIModel, entities: TId | TId[] | TId[][], data_format: _EIOExportDataFormat): Promise<string>;
