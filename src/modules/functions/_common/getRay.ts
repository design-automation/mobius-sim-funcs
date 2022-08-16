import { GIModel, TId, TPlane, Txyz, TRay, getArrDepth, vecCross, isRay, isPlane, isXYZ } from "@design-automation/mobius-sim";
import { getCentoridFromEnts } from "./getCentoridFromEnts";
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
export function getRay(__model__: GIModel, data: Txyz | TRay | TPlane | TId | TId[], fn_name: string): TRay {
    if (isXYZ(data)) {
        return [data, [0, 0, 1]] as TRay;
    }
    if (isRay(data)) {
        return data as TRay;
    }
    if (isPlane(data)) {
        return rayFromPln(data as TPlane) as TRay;
    }
    const ents: TId | TId[] = data as TId | TId[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents, fn_name);
    return [origin, [0, 0, 1]] as TRay;
}
