import { Sim, Txyz, ENT_TYPE, string, getArrDepth, vecDiv, vecSum } from "../../../mobius_sim";
// ================================================================================================
export function getCentroid(__model__: Sim, ents_arr: string | string[]): Txyz | Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: [ENT_TYPE, number] = ents_arr as string;
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, index);
        return _centroidPosis(__model__, posis_i);
    } else {
        // divide the input into posis and non posis
        ents_arr = ents_arr as string[];
        const posis_i: number[] = [];
        const np_ents_arr: string[] = [];
        for (const ent_arr of ents_arr) {
            if (ent_arr[0] === ENT_TYPE.POSI) {
                posis_i.push(ent_arr[1]);
            } else {
                np_ents_arr.push(ent_arr);
            }
        }
        // if we only have posis, just return one centorid
        // in all other cases return a list of centroids
        const np_cents: Txyz[] = (np_ents_arr as string[]).map((ent_arr) => getCentroid(__model__, ent_arr)) as Txyz[];
        if (posis_i.length > 0) {
            const cen_posis: Txyz = _centroidPosis(__model__, posis_i);
            if (np_cents.length === 0) {
                return cen_posis;
            } else {
                np_cents.push(cen_posis);
            }
        }
        return np_cents;
    }
}
function _centroidPosis(__model__: Sim, posis_i: number[]): Txyz {
    const unique_posis_i = Array.from(new Set(posis_i));
    const unique_xyzs: Txyz[] = unique_posis_i.map((posi_i) => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
    return vecDiv(vecSum(unique_xyzs), unique_xyzs.length);
}
