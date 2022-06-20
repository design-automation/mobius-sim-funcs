import { Sim } from '../../mobius_sim';

// ================================================================================================
/**
 * Adds a new copy of specified entities to the model, and deletes the original entity.
 *
 * @param __model__
 * @param entities Entity or lists of entities to be copied. Entities can be positions, points, polylines, polygons and collections.
 * @returns Entities, the cloned entity or a list of cloned entities.
 * @example `copies = make.Clone([position1,polyine1,polygon1])`
 * @example_info Creates a copy of position1, polyline1, and polygon1 and deletes the originals.
 */
export function Clone(__model__: Sim, entities: string|string[]|string[][]): string|string[]|string[][] {
    return _clone(__model__, entities);
}
function _clone(__model__: Sim, ents: string|string[]|string[][]):string|string[]|string[][]  {
    // single ent
    if (!Array.isArray(ents)) { return __model__.cloneEnts([ents as string])[0]; }
    // empty list
    if (ents.length === 0) { return []; }
    // list of ents
    if (!Array.isArray(ents[0])) { return __model__.cloneEnts(ents as string[]); }
    // list of lists of ents
    const clones: string[][] = [];
    for (const a_ents of ents) {
        clones.push( _clone(__model__, a_ents)  as string[] );
    }
}