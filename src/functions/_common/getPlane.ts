import { Sim, string, TPlane, Txyz, TRay, isRay, isPlane, isXYZ } from "../../../mobius_sim";
import { getCentoridFromEnts } from ".";
import { plnFromRay } from "./plnFromRay";

// ================================================================================================
export function getPlane(__model__: Sim, data: Txyz | TRay | TPlane | string | string[], fn_name: string): TPlane {
    if (isXYZ(data)) {
        return [data, [1, 0, 0], [0, 1, 0]] as TPlane;
    }
    if (isRay(data)) {
        return plnFromRay(data as TRay) as TPlane;
    }
    if (isPlane(data)) {
        return data as TPlane;
    }
    const ents: string | string[] = data as string | string[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents, fn_name);
    return [origin, [1, 0, 0], [0, 1, 0]] as TPlane;
}
