import { checkIDs, ID } from '../../../_check_ids';

import { GIModel, TId, Txyz, EEntType, TEntTypeIdx, vecAvg } from '@design-automation/mobius-sim';
import { getCentroid } from '.';
// ================================================================================================
export function getCentoridFromEnts(__model__: GIModel, ents: TId|TId[], fn_name: string): Txyz {
    // this must be an ID or an array of IDs, so lets get the centroid
    // TODO this error message is confusing
    const ents_arr: TEntTypeIdx|TEntTypeIdx[] = checkIDs(__model__, fn_name, 'ents', ents,
        [ID.isID, ID.isIDL1],
        [EEntType.POSI, EEntType.VERT, EEntType.POINT, EEntType.EDGE, EEntType.WIRE,
            EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx;
    const centroid: Txyz|Txyz[] = getCentroid(__model__, ents_arr);
    if (Array.isArray(centroid[0])) {
        return vecAvg(centroid as Txyz[]) as Txyz;
    }
    return centroid as Txyz;
}
