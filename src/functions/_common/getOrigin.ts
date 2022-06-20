import { Sim, string, TPlane, Txyz, TRay, isRay, isPlane, isXYZ } from "../../../mobius_sim";
import { getCentoridFromEnts } from ".";
// ================================================================================================
export function getOrigin(__model__: Sim, data: Txyz | TRay | TPlane | string | string[], fn_name: string): Txyz {
    if (isXYZ(data)) {
        return data as Txyz;
    }
    if (isRay(data)) {
        return data[0] as Txyz;
    }
    if (isPlane(data)) {
        return data[0] as Txyz;
    }
    const ents: string | string[] = data as string | string[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents, fn_name);
    return origin as Txyz;
}
