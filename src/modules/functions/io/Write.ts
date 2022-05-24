import { download, GIModel } from '@design-automation/mobius-sim';

import { _EIODataTarget } from './_enum';
import { _saveResource } from './Export';




// ================================================================================================
/**
 * Write data to the hard disk or to the local storage.
 * Depending on your browser's download settings,
 * a dialog box may pop up to manually confirm the action if writing to the hard disk.
 *
 * @param data The data to be saved (can be the url to the file).
 * @param file_name The name to be saved in the file system as a string (file extension should be included).
 * @param data_target Enum, where the data is to be exported to: `'Save to Hard Disk'` or `'Save to Local Storage'`.
 * @returns Whether the data is successfully saved. (True/false)
 */
export async function Write(__model__: GIModel, data: string, file_name: string, data_target: _EIODataTarget): Promise<Boolean> {
    try {
        if (data_target === _EIODataTarget.DEFAULT) {
            return download(data, file_name);
        }
        return _saveResource(data, file_name);
    } catch (ex) {
        return false;
    }
}
export function _Async_Param_Write(__model__: GIModel, data: string, file_name: string, data_target: _EIODataTarget): Promise<Boolean> {
    return null;
}

