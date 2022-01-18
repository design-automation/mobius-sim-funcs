import { GIModel, TId } from '@design-automation/mobius-sim';
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
export declare function ModelMerge(__model__: GIModel, input_data: string): Promise<TId[]>;
export declare function _Async_Param_ModelMerge(__model__: GIModel, input_data: string): Promise<TId[]>;
