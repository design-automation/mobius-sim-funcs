import { EEntType, getArrDepth, idsBreak, idsMake, isEmptyArr, } from '@design-automation/mobius-sim';
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
export function Copy(__model__, entities, vector) {
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'make.Copy';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1, ID.isIDL2], [EEntType.POSI, EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
        chk.checkArgs(fn_name, 'vector', vector, [chk.isXYZ, chk.isXYZL, chk.isNull]);
    }
    else {
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    // copy the list of entities
    const new_ents_arr = __model__.modeldata.funcs_common.copyGeom(ents_arr, true);
    // copy the positions that belong to the list of entities
    if (vector === null) {
        __model__.modeldata.funcs_common.clonePosisInEnts(new_ents_arr, true);
    }
    else {
        const depth = getArrDepth(vector);
        if (depth === 1) {
            vector = vector;
            __model__.modeldata.funcs_common.clonePosisInEntsAndMove(new_ents_arr, true, vector);
        }
        else if (depth === 2) {
            // handle the overloaded case
            // the list of entities should be the same length as the list of vectors
            // so we can match them 1 to 1
            const depth2 = getArrDepth(new_ents_arr);
            if (depth2 > 1 && new_ents_arr.length === vector.length) {
                vector = vector;
                const new_ents_arr_oload = new_ents_arr;
                for (let i = 0; i < vector.length; i++) {
                    __model__.modeldata.funcs_common.clonePosisInEntsAndMove(new_ents_arr_oload[i], true, vector[i]);
                }
            }
            else {
                throw new Error('Error in ' + fn_name + ": " +
                    'The value passed to the vector argument is invalid.' +
                    'If multiple vectors are given, then the number of vectors must be equal to the number of entities.');
            }
        }
        else {
            throw new Error('Error in ' + fn_name + ": " +
                'The value passed to the vector argument is invalid.' +
                'The argument value is: ' + vector);
        }
    }
    // return only the new entities
    return idsMake(new_ents_arr);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29weS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9tYWtlL0NvcHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFFBQVEsRUFDUixXQUFXLEVBRVgsUUFBUSxFQUNSLE9BQU8sRUFDUCxVQUFVLEdBSWIsTUFBTSwrQkFBK0IsQ0FBQztBQUV2QyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxHQUFHLE1BQU0sdUJBQXVCLENBQUM7QUFLN0MsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFDSCxNQUFNLFVBQVUsSUFBSSxDQUFDLFNBQWtCLEVBQUUsUUFBK0IsRUFBRSxNQUFxQjtJQUMzRixJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUFFLE9BQU8sRUFBRSxDQUFDO0tBQUU7SUFDeEMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQztJQUM1QixJQUFJLFFBQVEsQ0FBQztJQUNiLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDNUQsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUMvQixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUE4QyxDQUFDO1FBQzVILEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDakY7U0FBTTtRQUNILFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUE4QyxDQUFDO0tBQzlFO0lBQ0Qsc0JBQXNCO0lBQ3RCLDRCQUE0QjtJQUM1QixNQUFNLFlBQVksR0FBOEMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMxSCx5REFBeUQ7SUFDekQsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO1FBQ2pCLFNBQVMsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN6RTtTQUFNO1FBQ0gsTUFBTSxLQUFLLEdBQVcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNiLE1BQU0sR0FBRyxNQUFlLENBQUM7WUFDekIsU0FBUyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsdUJBQXVCLENBQUMsWUFBWSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztTQUN4RjthQUFNLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNwQiw2QkFBNkI7WUFDN0Isd0VBQXdFO1lBQ3hFLDhCQUE4QjtZQUM5QixNQUFNLE1BQU0sR0FBVyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakQsSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDckQsTUFBTSxHQUFHLE1BQWdCLENBQUM7Z0JBQzFCLE1BQU0sa0JBQWtCLEdBQUcsWUFBK0MsQ0FBQztnQkFDM0UsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3BDLFNBQVMsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLHVCQUF1QixDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDcEc7YUFDSjtpQkFBTTtnQkFDSCxNQUFNLElBQUksS0FBSyxDQUFDLFdBQVcsR0FBRyxPQUFPLEdBQUcsSUFBSTtvQkFDNUMscURBQXFEO29CQUNyRCxvR0FBb0csQ0FBQyxDQUFDO2FBQ3pHO1NBQ0o7YUFBTTtZQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxHQUFHLE9BQU8sR0FBRyxJQUFJO2dCQUM1QyxxREFBcUQ7Z0JBQ3JELHlCQUF5QixHQUFHLE1BQU0sQ0FBQyxDQUFDO1NBQ3ZDO0tBQ0o7SUFDRCwrQkFBK0I7SUFDL0IsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFzQixDQUFDO0FBQ3RELENBQUMifQ==