import { Sim } from 'src/mobius_sim';

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
    // // --- Error Check ---
    // const fn_name = 'make.Clone';
    // let ents_arr;
    // if (__model__.debug) {
    //     ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
    //     [ID.isID, ID.isIDL1, ID.isIDL2],
    //     [EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    // } else {
    //     ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    // }
    // // --- Error Check ---
    // // copy the list of entities
    // const new_ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] = __model__.modeldata.funcs_common.copyGeom(ents_arr, true);
    // __model__.modeldata.funcs_common.clonePosisInEnts(new_ents_arr, true);
    // // delete the existing entities
    // __model__.modeldata.funcs_edit.delete(ents_arr, false);
    // // return the new entities
    // return idsMake(new_ents_arr) as TId|TId[]|TId[][];
    // =============================================================================================
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