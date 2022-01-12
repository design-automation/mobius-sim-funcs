/**
 * The `io` module has functions for importing and exporting.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';

import { _getFile } from './_getFile';


// ================================================================================================
/**
 * Read data from a Url or from local storage.
 *
 * @param data The data to be read (from URL or from Local Storage).
 * @returns the data.
 */
export async function Read(__model__: GIModel, data: string): Promise<string | {}> {
    return _getFile(data);
}
export function _Async_Param_Read(__model__: GIModel, data: string): Promise<string | {}> {
    return null;
}
