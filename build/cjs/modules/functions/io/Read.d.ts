/**
 * The `io` module has functions for importing and exporting.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';
/**
 * Read data from a Url or from local storage.
 *
 * @param data The data to be read (from URL or from Local Storage).
 * @returns the data.
 */
export declare function Read(__model__: GIModel, data: string): Promise<string | {}>;
export declare function _Async_Param_Read(__model__: GIModel, data: string): Promise<string | {}>;
