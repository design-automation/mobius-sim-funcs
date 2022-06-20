import { Sim } from "src/mobius_sim";
import { vecCross } from "./calcVectors";
import { TPlane, TRay, Txyz } from "./consts";
import { getCentoridFromEnts } from "./getCentroid";
import { valIsPlane, valIsRay, valIsXYZ } from "./isType";
import { getArrDepth } from "./_arrs";
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param __model__ 
 * @param data 
 * @param fn_name 
 * @returns 
 */
export function getRay(__model__: Sim, data: Txyz | TRay | TPlane | string | string[], fn_name: string): TRay {
    if (valIsXYZ(data)) {
        return [data, [0, 0, 1]] as TRay;
    }
    if (valIsRay(data)) {
        return data as TRay;
    }
    if (valIsPlane(data)) {
        return rayFromPln(data as TPlane) as TRay;
    }
    const ents: string | string[] = data as string | string[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents);
    return [origin, [0, 0, 1]] as TRay;
}
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param pln 
 * @returns 
 */
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
// -------------------------------------------------------------------------------------------------