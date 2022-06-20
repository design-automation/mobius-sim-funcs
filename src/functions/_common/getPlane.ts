import { Sim } from "src/mobius_sim";
import { TPlane, Txyz, TRay } from './consts';
import { getCentoridFromEnts } from "./getCentroid";
import { plnFromRay } from "./plnFromRay";
import { valIsRay, valIsPlane, valIsXYZ} from './isType';
// -------------------------------------------------------------------------------------------------
export function getPlane(__model__: Sim, data: Txyz | TRay | TPlane | string | string[], fn_name: string): TPlane {
    if (valIsXYZ(data)) {
        return [data, [1, 0, 0], [0, 1, 0]] as TPlane;
    }
    if (valIsRay(data)) {
        return plnFromRay(data as TRay) as TPlane;
    }
    if (valIsPlane(data)) {
        return data as TPlane;
    }
    const ents: string | string[] = data as string | string[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents);
    return [origin, [1, 0, 0], [0, 1, 0]] as TPlane;
}
// -------------------------------------------------------------------------------------------------