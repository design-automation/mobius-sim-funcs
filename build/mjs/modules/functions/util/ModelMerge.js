/**
 * The `util` module has some utility functions used for debugging.
 * @module
 */
import { idsMake } from '@design-automation/mobius-sim';
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
export async function ModelMerge(__model__, input_data) {
    const input_data_str = await _getFile(input_data);
    if (!input_data_str) {
        throw new Error('Invalid imported model data');
    }
    const ents_arr = __model__.importGI(input_data_str);
    return idsMake(ents_arr);
}
export function _Async_Param_ModelMerge(__model__, input_data) {
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWxNZXJnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy91dGlsL01vZGVsTWVyZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBQ0gsT0FBTyxFQUFXLE9BQU8sRUFBb0IsTUFBTSwrQkFBK0IsQ0FBQztBQUVuRixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBR2pDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7OztHQVVHO0FBQ0gsTUFBTSxDQUFDLEtBQUssVUFBVSxVQUFVLENBQUMsU0FBa0IsRUFBRSxVQUFrQjtJQUNuRSxNQUFNLGNBQWMsR0FBVyxNQUFNLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxRCxJQUFJLENBQUMsY0FBYyxFQUFFO1FBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztLQUNsRDtJQUNELE1BQU0sUUFBUSxHQUFrQixTQUFTLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ25FLE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBVSxDQUFDO0FBQ3RDLENBQUM7QUFDRCxNQUFNLFVBQVUsdUJBQXVCLENBQUMsU0FBa0IsRUFBRSxVQUFrQjtJQUMxRSxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDIn0=