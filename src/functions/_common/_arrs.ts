import lodash from 'lodash';
// -------------------------------------------------------------------------------------------------
/**
 * Remove an item from an array
 * Return teh index where the item was removed.
 * Returns -1 if teh item was not found.
 * @param arr
 * @param item
 */
export function arrRem(arr: any[], item: any): number {
    const index: number = arr.indexOf(item);
    if (index === -1) { return -1; }
    arr.splice(index, 1);
    return index;
}
// -------------------------------------------------------------------------------------------------
/**
 * Make flat array (depth = 1) from anything.
 * If it is not an array, then make it an array
 * If it is an array, then make it flat
 * @param data
 */
export function arrMakeFlat(data: any): any[] {
    if (!Array.isArray(data)) {
        return [data];
    }
    return lodash.flattenDeep(data);
}
// -------------------------------------------------------------------------------------------------
/**
 * Maximum depth of an array
 * @param data
 */
export function arrMaxDepth(data: any[]): number {
    let d1 = 0;
    if (Array.isArray(data)) {
        d1 = 1;
        let max = 0;
        for (const item of data) {
            if (Array.isArray(data)) {
                const d2 = arrMaxDepth(item);
                if (d2 > max) {
                    max = d2;
                }
            }
        }
        d1 += max;
    }
    return d1;
}
// -------------------------------------------------------------------------------------------------
/**
 * Converts a value to an array of specified length.
 * @param data
 */
export function arrFill(data: any, length: number): any[] {
    if (! Array.isArray(data)) {
        data = [data];
    }
    data = data as any[];
    const last = data[data.length - 1];
    for (let i = data.length; i < length; i++)  {
        data[i] = last;
    }
    if (data.length > length)   {
        data = data.slice(0, length);
    }
    return data;
}
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param arr 
 * @returns 
 */
export function getArrDepth(arr: any): number {
    if (Array.isArray(arr)) {
        return 1 + getArrDepth(arr[0]);
    }
    return 0;
}
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param arr 
 * @returns 
 */
export function isEmptyArr(arr: any): boolean {
    if (Array.isArray(arr) && !arr.length) {
        return true;
    }
    return false;
}
// -------------------------------------------------------------------------------------------------