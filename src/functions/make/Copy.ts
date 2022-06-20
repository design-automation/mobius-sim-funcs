import {Sim, ENT_TYPE} from '../../mobius_sim';
import { Txyz } from '../_common/consts';
import { getArrDepth, isEmptyArr } from '../_common/_arrs';

// ================================================================================================
/**
 * Creates a copy of one or more entities (without deleting the original entity).
 * \n
 * Positions, objects, and collections can be copied. Sub-entities (vertices, edges, and
 * wires) cannot be copied since they cannot exist without a parent entity.
 * \n
 * When entities are copied, their positions are also copied. The original entities and the copied
 * entities will not be welded (they will not share positions).
 * \n
 * The copy operation includes an option to also move entities, by a specified vector. If the vector
 * is null, then the entities will not be moved.
 * \n
 * The vector argument is overloaded. If you supply a list of vectors, the function will try to find
 * a 1 -to-1 match between the list of entities and the list of vectors. In the overloaded case, if
 * the two lists do not have the same length, then an error will be thrown.
 * \n
 * @param __model__
 * @param entities Entity or lists of entities to be copied. Entities can be positions, points,
 * polylines, polygons and collections.
 * @param vector A vector to move the entities by after copying, can be `null`.
 * @returns Entities, the copied entity or a list of copied entities.
 * @example `copies = make.Copy([position1, polyine1, polygon1], [0,0,10])`
 * @example_info Creates a copy of position1, polyine1, and polygon1 and moves all three entities 10
 * units in the Z direction.
 */
export function Copy(__model__: Sim, entities: string | string[] | string[][], 
        vector: Txyz | Txyz[] = null): string|string[]|string[][] {
    if (isEmptyArr(entities)) { return []; }
    // copy ents
    if (vector === null) {
        return _copy(__model__, entities, null);
    }
    // copy ents and move all ents by same vector
    const depth: number = getArrDepth(vector);
    if (depth === 1) {
        return _copy(__model__, entities, vector as Txyz);
    }
    // copy ents and move each ent by different vector
    if (depth === 2) {
        // handle the overloaded case
        // the list of entities should be the same length as the list of vectors
        // so we can match them 1 to 1
        const depth2: number = getArrDepth(entities);
        if (depth2 > 1 && entities.length === vector.length) {
            const new_ents: string[][] = [];
            for (let i = 0; i < vector.length; i++) {
                new_ents.push( _copy( __model__, entities[i], vector[i] as Txyz) as string[] );
            }
            return new_ents;
        } else {
            throw new Error('Error in make.Copy: ' +
            'The value passed to the vector argument is invalid.' +
            'If multiple vectors are given, then the number of vectors must be equal to the number of entities.');
        }
    } else {
        throw new Error('Error in make.Copy: ' +
        'The value passed to the vector argument is invalid.' + 
        'The argument value is: ' + vector);
    }
}
function _copy(__model__: Sim, ents: string | string[] | string[][],
        vec: Txyz):string | string[] | string[][] {
    // single ent
    if (!Array.isArray(ents)) { return __model__.copyEnts([ents as string], vec)[0]; }
    // empty list
    if (ents.length === 0) { return []; }
    // list of ents
    if (!Array.isArray(ents[0])) { return __model__.copyEnts(ents as string[], vec); }
    // list of lists of ents
    const clones: string[][] = [];
    for (const a_ents of ents) {
        clones.push( _copy(__model__, a_ents, vec)  as string[] );
    }
}