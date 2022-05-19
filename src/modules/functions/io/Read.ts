import { GIModel } from '@design-automation/mobius-sim';

import { _getFile } from './_getFile';



// ================================================================================================
/**
 * Read data from a Url or from local storage.
 * 
 * //TEST WITH A TEST FILE ? AND INSERT DIAGRAMS AND REFERENCE THE VR VIEWER
 *
 * @param data The data to be read (from URL or from Local Storage).
 * @returns The data.
 */
export async function Read(__model__: GIModel, data: string): Promise<string | {}> {
    return _getFile(data);
}
export function _Async_Param_Read(__model__: GIModel, data: string): Promise<string | {}> {
    return null;
}
