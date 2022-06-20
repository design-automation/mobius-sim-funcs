import { Sim, string, TPlane, Txyz, TRay, getArrDepth, vecCross, isRay, isPlane, isXYZ } from "../../../mobius_sim";
import { getCentoridFromEnts } from ".";
function rayFromPln(pln: TPlane | TPlane[]): TRay | TRay[] {
    // overloaded case
    const pln_dep: number = getArrDepth(pln);
    if (pln_dep === 3) {
        return (pln as TPlane[]).map((pln_one) => rayFromPln(pln_one)) as TRay[];
    }
    // normal case
    pln = pln as TPlane;
    return [pln[0].slice() as Txyz, vecCross(pln[1], pln[2])];
}
// ================================================================================================
export function getRay(__model__: Sim, data: Txyz | TRay | TPlane | string | string[], fn_name: string): TRay {
    if (isXYZ(data)) {
        return [data, [0, 0, 1]] as TRay;
    }
    if (isRay(data)) {
        return data as TRay;
    }
    if (isPlane(data)) {
        return rayFromPln(data as TPlane) as TRay;
    }
    const ents: string | string[] = data as string | string[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents, fn_name);
    return [origin, [0, 0, 1]] as TRay;
}