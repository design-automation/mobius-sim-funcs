import { Sim } from '../../mobius_sim';

import { _getFile } from './_getFile';



// ================================================================================================
/**
 * Read data from a Url or from local storage.
 *
 * @param data The data to be read (from URL or from Local Storage).
 * @returns The data.
 */
export async function Read(__model__: Sim, data: string): Promise<string | {}> {
    return _getFile(data);
}
export function _Async_Param_Read(__model__: Sim, data: string): Promise<string | {}> {
    return null;
}
