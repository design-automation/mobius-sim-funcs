


// ================================================================================================
/**
 * Removes keys from a dict. If the key does not exist, no action is taken and no error is thrown.
 * \n
 * @param dict The dict in which to remove keys
 * @param keys The key or list of keys to remove.
 * @returns void
 */
export function Remove(dict: object, keys: string|string[]): void {
    // // --- Error Check ---
    // const fn_name = 'dict.Remove';
    // chk.checkArgs(fn_name, 'key', keys, [chk.isStr, chk.isStrL]);
    // // --- Error Check ---
    if (!Array.isArray(keys)) { keys = [keys] as string[]; }
    keys = keys as string[];
    for (const key of keys) {
        if (typeof key !== 'string') {
            throw new Error('dict.Remove: Keys must be strings; \
                the following key is not valid:"' + key + '".');
        }
        if (key in dict) {
            delete dict[key];
        }
    }
}
