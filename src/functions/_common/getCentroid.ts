import { Sim, ENT_TYPE } from "src/mobius_sim";
import { vecAvg, vecDiv, vecSum } from "./calcVectors";
import { Txyz } from "./consts";
// -------------------------------------------------------------------------------------------------
/**
 * Calculates a single centroid for a set of entities
 * @param __model__ 
 * @param ents 
 * @returns 
 */
export function getCentoridFromEnts(__model__: Sim, ents: string|string[]): Txyz {
    const centroid: Txyz|Txyz[] = getCentroid(__model__, ents);
    if (Array.isArray(centroid[0])) {
        return vecAvg(centroid as Txyz[]) as Txyz;
    }
    return centroid as Txyz;
}
// -------------------------------------------------------------------------------------------------
/**
 * Calculates centroids. Give a list of posis, calculates a single centroid. Given a signle entity,
 * calculates a single centroid. Given a list of entities, calculates a list of centroids. If the
 * list contains a mix of posis end other entities, then the centroid of the posis will be the last.
 * TODO hving a mix of ents and posis is confusing, should throw an error.
 * @param __model__ 
 * @param ents 
 * @returns 
 */
export function getCentroid(__model__: Sim, ents: string | string[]): Txyz | Txyz[] {
    if (!Array.isArray(ents)) {
        // a single entity, return a single centroid
        const posis: string[] = __model__.getEnts(ENT_TYPE.POSI, ents as string);
        return _centroidPosis(__model__, posis);
    } else {
        // divide the input into posis and non posis
        const posis: string[] = [];
        const np_ents: string[] = [];
        for (const ent of ents) {
            if (__model__.entType(ent) === ENT_TYPE.POSI) {
                posis.push(ent[1]);
            } else {
                np_ents.push(ent);
            }
        }
        // calc centroids
        const np_cents: Txyz[] = np_ents.map((ent) => getCentroid(__model__, ent)) as Txyz[]; // recursive
        if (posis.length > 0) {
            const cen_posis: Txyz = _centroidPosis(__model__, posis);
            if (np_cents.length === 0) {
                // if we only have posis, just return one centorid
                return cen_posis;
            } else {
                // add the posis centroid to the lists of centroids
                np_cents.push(cen_posis);
            }
        }
        // return a list of centroids
        return np_cents;
    }
}
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param __model__ 
 * @param posis 
 * @returns 
 */
function _centroidPosis(__model__: Sim, posis: string[]): Txyz {
    const unique_posis_i = Array.from(new Set(posis));
    const unique_xyzs: Txyz[] = unique_posis_i.map((posi) => __model__.getPosiCoords(posi));
    return vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
}
// -------------------------------------------------------------------------------------------------
