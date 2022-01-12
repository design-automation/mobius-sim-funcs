import { GIModel, TId, TPlane, Txyz, TRay, isRay, isPlane, isXYZ } from "@design-automation/mobius-sim";
import { getCentoridFromEnts } from ".";
// ================================================================================================
export function getOrigin(__model__: GIModel, data: Txyz | TRay | TPlane | TId | TId[], fn_name: string): Txyz {
    if (isXYZ(data)) {
        return data as Txyz;
    }
    if (isRay(data)) {
        return data[0] as Txyz;
    }
    if (isPlane(data)) {
        return data[0] as Txyz;
    }
    const ents: TId | TId[] = data as TId | TId[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents, fn_name);
    return origin as Txyz;
}
