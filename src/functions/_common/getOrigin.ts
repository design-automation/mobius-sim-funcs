import { Sim } from "src/mobius_sim";
import { TPlane, Txyz, TRay } from './consts';
import { getCentoridFromEnts } from "./getCentroid";
import { valIsRay, valIsPlane, valIsXYZ} from './isType';
// -------------------------------------------------------------------------------------------------
export function getOrigin(__model__: Sim, data: Txyz | TRay | TPlane | string | string[], fn_name: string): Txyz {
    if (valIsXYZ(data)) {
        return data as Txyz;
    }
    if (valIsRay(data)) {
        return data[0] as Txyz;
    }
    if (valIsPlane(data)) {
        return data[0] as Txyz;
    }
    const ents: string | string[] = data as string | string[];
    const origin: Txyz = getCentoridFromEnts(__model__, ents);
    return origin as Txyz;
}
// -------------------------------------------------------------------------------------------------