import { checkIDs, ID } from '../_common/_check_ids';

import { Sim, string, Txyz, ENT_TYPE, string, vecAvg } from '../../mobius_sim';
import { getCentroid } from '.';
// ================================================================================================
export function getCentoridFromEnts(__model__: Sim, ents: string|string[], fn_name: string): Txyz {
    // this must be an ID or an array of IDs, so lets get the centroid
    // TODO this error message is confusing
    const ents_arr: string|string[] = checkIDs(__model__, fn_name, 'ents', ents,
        [ID.isID, ID.isIDL1],
        [ENT_TYPE.POSI, ENT_TYPE.VERT, ENT_TYPE.POINT, ENT_TYPE.EDGE, ENT_TYPE.WIRE,
            ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string;
    const centroid: Txyz|Txyz[] = getCentroid(__model__, ents_arr);
    if (Array.isArray(centroid[0])) {
        return vecAvg(centroid as Txyz[]) as Txyz;
    }
    return centroid as Txyz;
}
