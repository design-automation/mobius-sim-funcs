import { download, GIModel } from '@design-automation/mobius-sim';

import { _EIODataTarget } from './_enum';
import { saveResource } from './Export';




// ================================================================================================
/**
 * Write data to the hard disk or to the local storage.
 *
 * @param data The data to be saved (can be the url to the file).
 * @param file_name The name to be saved in the file system (file extension should be included).
 * @param data_target Enum, where the data is to be exported to.
 * @returns whether the data is successfully saved.
 */
export async function Write(__model__: GIModel, data: string, file_name: string, data_target: _EIODataTarget): Promise<Boolean> {
    try {
        if (data_target === _EIODataTarget.DEFAULT) {
            return download(data, file_name);
        }
        return saveResource(data, file_name);
    } catch (ex) {
        return false;
    }
}
export function _Async_Param_Write(__model__: GIModel, data: string, file_name: string, data_target: _EIODataTarget): Promise<Boolean> {
    return null;
}

