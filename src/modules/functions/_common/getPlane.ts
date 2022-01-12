import { GIModel, TId, TPlane, Txyz, TRay, isRay, isPlane, isXYZ } from "@design-automation/mobius-sim";
import { getCentoridFromEnts } from ".";
import { plnFromRay } from "./plnFromRay";

// ================================================================================================
export function getPlane(__model__: GIModel, data: Txyz | TRay | TPlane | TId | TId[], fn_name: string): TPlane {
    if (isXYZ(data)) {
        return [data, [1, 0, 0], [0, 1, 0]] as TPlane;
    }
    if (isRay(data)) {
        return plnFromRay(data as TRay) as TPlane;
    }
    if (isPlane(data)) {
        return data as TPlane;
    }
    const ents: TId | TId[] = data as TId | TId[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents, fn_name);
    return [origin, [1, 0, 0], [0, 1, 0]] as TPlane;
}
