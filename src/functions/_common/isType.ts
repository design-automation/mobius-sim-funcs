// -------------------------------------------------------------------------------------------------
export function valIsXYZ(data: any): boolean {
    if (!Array.isArray(data)) { return false; }
    data = data as any[];
    if (data.length !== 3) { return false; }
    for (const item of data) {
        if (typeof item !== 'number') { return false; }
    }
    return true;
}
// -------------------------------------------------------------------------------------------------
export function valIsRay(data: any): boolean {
    if (!Array.isArray(data)) { return false; }
    data = data as any[];
    if (data.length !== 2) { return false; }
    for (const item of data) {
        if (!valIsXYZ(item)) { return false; }
    }
    return true;
}
// -------------------------------------------------------------------------------------------------
export function valIsPlane(data: any): boolean {
    if (!Array.isArray(data)) { return false; }
    data = data as any[];
    if (data.length !== 3) { return false; }
    for (const item of data) {
        if (!valIsXYZ(item)) { return false; }
    }
    return true;
}
// -------------------------------------------------------------------------------------------------
export function valIsBBox(data: any): boolean {
    if (!Array.isArray(data)) { return false; }
    data = data as any[];
    if (data.length !== 4) { return false; }
    for (const item of data) {
        if (!valIsXYZ(item)) { return false; }
    }
    return true;
}
// -------------------------------------------------------------------------------------------------
