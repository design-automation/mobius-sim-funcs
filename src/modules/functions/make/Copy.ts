import {
    EEntType,
    getArrDepth,
    GIModel,
    idsBreak,
    idsMake,
    isEmptyArr,
    TEntTypeIdx,
    TId,
    Txyz,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../../_check_ids';
import * as chk from '../../../_check_types';




// ================================================================================================
/**
 * Creates a copy of one or more entities.
 * \n
 * Positions, objects, and collections can be copied. Topological entities (vertices, edges, and
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
 * @example copies = make.Copy([position1, polyine1, polygon1], [0,0,10])
 * @example_info Creates a copy of position1, polyine1, and polygon1 and moves all three entities 10
 * units in the Z direction.
 */
export function Copy(__model__: GIModel, entities: TId | TId[] | TId[][], vector: Txyz | Txyz[]): TId|TId[]|TId[][] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'make.Copy';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL1, ID.isIDL2],
        [EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
        chk.checkArgs(fn_name, 'vector', vector, [chk.isXYZ, chk.isXYZL, chk.isNull]);
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    }
    // --- Error Check ---
    // copy the list of entities
    const new_ents_arr: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] = __model__.modeldata.funcs_common.copyGeom(ents_arr, true);
    // copy the positions that belong to the list of entities
    if (vector === null) {
        __model__.modeldata.funcs_common.clonePosisInEnts(new_ents_arr, true);
    } else {
        const depth: number = getArrDepth(vector);
        if (depth === 1) {
            vector = vector  as Txyz;
            __model__.modeldata.funcs_common.clonePosisInEntsAndMove(new_ents_arr, true, vector);
        } else if (depth === 2) {
            // handle the overloaded case
            // the list of entities should be the same length as the list of vectors
            // so we can match them 1 to 1
            const depth2: number = getArrDepth(new_ents_arr);
            if (depth2 > 1 && new_ents_arr.length === vector.length) {
                vector = vector as Txyz[];
                const new_ents_arr_oload = new_ents_arr as TEntTypeIdx[] | TEntTypeIdx[][];
                for (let i = 0; i < vector.length; i++) {
                    __model__.modeldata.funcs_common.clonePosisInEntsAndMove(new_ents_arr_oload[i], true, vector[i]);
                }
            } else {
                throw new Error('Error in ' + fn_name + ": " +
                'The value passed to the vector argument is invalid.' +
                'If multiple vectors are given, then the number of vectors must be equal to the number of entities.');
            }
        } else {
            throw new Error('Error in ' + fn_name + ": " +
            'The value passed to the vector argument is invalid.' + 
            'The argument value is: ' + vector);
        }
    }
    // return only the new entities
    return idsMake(new_ents_arr) as TId|TId[]|TId[][];
}
