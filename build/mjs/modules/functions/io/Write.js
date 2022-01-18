import { download } from '@design-automation/mobius-sim';
import { _EIODataTarget } from './_enum';
import { _saveResource } from './Export';
// ================================================================================================
/**
 * Write data to the hard disk or to the local storage.
 *
 * @param data The data to be saved (can be the url to the file).
 * @param file_name The name to be saved in the file system (file extension should be included).
 * @param data_target Enum, where the data is to be exported to.
 * @returns whether the data is successfully saved.
 */
export async function Write(__model__, data, file_name, data_target) {
    try {
        if (data_target === _EIODataTarget.DEFAULT) {
            return download(data, file_name);
        }
        return _saveResource(data, file_name);
    }
    catch (ex) {
        return false;
    }
}
export function _Async_Param_Write(__model__, data, file_name, data_target) {
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV3JpdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvaW8vV3JpdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBVyxNQUFNLCtCQUErQixDQUFDO0FBRWxFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUt6QyxtR0FBbUc7QUFDbkc7Ozs7Ozs7R0FPRztBQUNILE1BQU0sQ0FBQyxLQUFLLFVBQVUsS0FBSyxDQUFDLFNBQWtCLEVBQUUsSUFBWSxFQUFFLFNBQWlCLEVBQUUsV0FBMkI7SUFDeEcsSUFBSTtRQUNBLElBQUksV0FBVyxLQUFLLGNBQWMsQ0FBQyxPQUFPLEVBQUU7WUFDeEMsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3BDO1FBQ0QsT0FBTyxhQUFhLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ3pDO0lBQUMsT0FBTyxFQUFFLEVBQUU7UUFDVCxPQUFPLEtBQUssQ0FBQztLQUNoQjtBQUNMLENBQUM7QUFDRCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsU0FBa0IsRUFBRSxJQUFZLEVBQUUsU0FBaUIsRUFBRSxXQUEyQjtJQUMvRyxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDIn0=