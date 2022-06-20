import { Sim, ENT_TYPE } from 'src/mobius_sim';
import { isEmptyArr } from '../_common/_arrs';

// ================================================================================================
/**
 * Adds one or more new points to the model. Points are objects that can be added to collections.
 *
 * @param __model__
 * @param entities Position, or list of positions, or entities from which positions can be extracted.
 * @returns Entities, new point or a list of new points.
 * @example `point1 = make.Point(position1)`
 * @example_info Creates a point at position1.
 */
export function Point(__model__: Sim, entities: string|string[]|string[][]): string|string[]|string[][] {
    if (isEmptyArr(entities)) { return []; }
    // -----
    const new_ents: string|string[]|string[][] =  __model__.modeldata.funcs_make.point(ents_arr);
    return new_ents;
}
