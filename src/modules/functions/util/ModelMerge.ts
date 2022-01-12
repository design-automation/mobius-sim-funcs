import { GIModel, idsMake, TEntTypeIdx, TId } from '@design-automation/mobius-sim';

import { _getFile } from '../io';


// ================================================================================================
/**
 * Merges data from another model into this model.
 * This is the same as importing the model, except that no collection is created.
 *
 * For specifying the location of the GI Model, you can either specify a URL, or the name of a file in LocalStorage.
 * In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'
 *
 * @param __model__
 * @param input_data The location of the GI Model to import into this model to.
 * @returns Text that summarises the comparison between the two models.
 */
export async function ModelMerge(__model__: GIModel, input_data: string): Promise<TId[]> {
    const input_data_str: string = await _getFile(input_data);
    if (!input_data_str) {
        throw new Error('Invalid imported model data');
    }
    const ents_arr: TEntTypeIdx[] = __model__.importGI(input_data_str);
    return idsMake(ents_arr) as TId[];
}
export function _Async_Param_ModelMerge(__model__: GIModel, input_data: string): Promise<TId[]> {
    return null;
}
