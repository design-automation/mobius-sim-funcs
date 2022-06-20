import { vecCross, vecDot, vecNorm } from "./calcVectors";
import { TPlane, TRay, Txyz } from "./consts";
import { getArrDepth } from "./_arrs";
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param ray 
 * @returns 
 */
export function plnFromRay(ray: TRay | TRay[]): TPlane | TPlane[] {
    // overloaded case
    const ray_dep: number = getArrDepth(ray);
    if (ray_dep === 3) {
        return (ray as TRay[]).map((ray_one) => plnFromRay(ray_one)) as TPlane[];
    }
    // normal case
    ray = ray as TRay;
    const z_vec: Txyz = vecNorm(ray[1]);
    let vec: Txyz = [0, 0, 1];
    if (vecDot(vec, z_vec) === 1) {
        vec = [1, 0, 0];
    }
    const x_axis: Txyz = vecCross(vec, z_vec);
    const y_axis: Txyz = vecCross(x_axis, z_vec);
    return [ray[0].slice() as Txyz, x_axis, y_axis];
}
// -------------------------------------------------------------------------------------------------