import { Sim, Txyz } from '../../mobius_sim';

// ================================================================================================
/**
 * Adds one or more new positions to the model. Positions are unique entities and cannot be added to
 * collections.
 *
 * @param __model__
 * @param coords A list of three numbers, or a list of lists of three numbers.
 * @returns A new position, or nested list of new positions. 
 * Each position is an entity with an xyz attribute, that can be called with `posi@xyz`.
 * @example `position1 = make.Position([1,2,3])`
 * @example_info Creates a position with coordinates x=1, y=2, z=3.
 * @example `positions = make.Position([[1,2,3],[3,4,5],[5,6,7]])`
 * @example_info Creates three positions, with coordinates [1,2,3],[3,4,5] and [5,6,7].
 */
export function Position(__model__: Sim, coords: Txyz|Txyz[]|Txyz[][]): string|string[]|string[][] {
    return _position(__model__, coords);
}
function _position(__model__: Sim, coords: Txyz|Txyz[]|Txyz[][]):string|string[]|string[][]  {
    // empty list
    if (coords.length === 0) { return []; }
    // single coord
    if (!Array.isArray(coords[0])) { return __model__.addPosi(coords as Txyz)[0]; }
    // list of cords
    const posis: string[] = [];
    for (const a_coord of coords) {
        posis.push( _position(__model__, a_coord as Txyz)  as string );
    }
    return posis;
}