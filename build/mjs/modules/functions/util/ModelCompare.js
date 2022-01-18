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
export async function ModelCompare(__model__, input_data) {
    const input_data_str = await _getFile(input_data);
    if (!input_data_str) {
        throw new Error('Invalid imported model data');
    }
    const input_model = new GIModel();
    input_model.importGI(input_data_str);
    const result = __model__.compare(input_model, true, false, false);
    return result.comment;
}
export function _Async_Param_ModelCompare(__model__, input_data) {
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWxDb21wYXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL3V0aWwvTW9kZWxDb21wYXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUV4RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBR2pDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFDSCxNQUFNLENBQUMsS0FBSyxVQUFVLFlBQVksQ0FBQyxTQUFrQixFQUFFLFVBQWtCO0lBQ3JFLE1BQU0sY0FBYyxHQUFXLE1BQU0sUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFELElBQUksQ0FBQyxjQUFjLEVBQUU7UUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0tBQ2xEO0lBQ0QsTUFBTSxXQUFXLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztJQUNsQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sTUFBTSxHQUFvRCxTQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ25ILE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUMxQixDQUFDO0FBQ0QsTUFBTSxVQUFVLHlCQUF5QixDQUFDLFNBQWtCLEVBQUUsVUFBa0I7SUFDNUUsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyJ9