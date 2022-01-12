import { GIModel } from '@design-automation/mobius-sim';

import { _getFile } from '../io';


// ================================================================================================
/**
 * Compares two models. Used for grading models.
 * 
 * Checks that every entity in this model also exists in the input_data.
 *
 * Additional entitis in the input data will not affect the score.
 *
 * Attributes at the model level are ignored except for the `material` attributes.
 *
 * For grading, this model is assumed to be the answer model, and the input model is assumed to be
 * the model submitted by the student.
 *
 * The order or entities in this model may be modified in the comparison process.
 *
 * For specifying the location of the GI Model, you can either specify a URL, or the name of a file in LocalStorage.
 * In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'
 *
 * @param __model__
 * @param input_data The location of the GI Model to compare this model to.
 * @returns Text that summarises the comparison between the two models.
 */
export async function ModelCompare(__model__: GIModel, input_data: string): Promise<string> {
    const input_data_str: string = await _getFile(input_data);
    if (!input_data_str) {
        throw new Error('Invalid imported model data');
    }
    const input_model = new GIModel();
    input_model.importGI(input_data_str);
    const result: {score: number, total: number, comment: string} = __model__.compare(input_model, true, false, false);
    return result.comment;
}
export function _Async_Param_ModelCompare(__model__: GIModel, input_data: string): Promise<string> {
    return null;
}
