import { arrMakeFlat, EEntType, idsBreak, idsMakeFromIdxs, isEmptyArr, } from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../../_check_ids';
import { _convertPgonsToShapeUnion, _convertShapesToPgons, _getPgons } from './_shared';
// ================================================================================================
/**
 * Create the union of a set of polygons.
 *
 * @param __model__
 * @param entities A list of polygons, or entities from which polygons can bet extracted.
 * @returns A list of new polygons.
 */
export function Union(__model__, entities) {
    entities = arrMakeFlat(entities);
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'poly2d.Union';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null);
    }
    else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    const posis_map = new Map();
    const pgons_i = _getPgons(__model__, ents_arr);
    if (pgons_i.length === 0) {
        return [];
    }
    const result_shape = _convertPgonsToShapeUnion(__model__, pgons_i, posis_map);
    if (result_shape === null) {
        return [];
    }
    const all_new_pgons = _convertShapesToPgons(__model__, result_shape, posis_map);
    return idsMakeFromIdxs(EEntType.PGON, all_new_pgons);
    // return idsMake(all_new_pgons.map( pgon_i => [EEntType.PGON, pgon_i] as TEntTypeIdx )) as TId[];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5pb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvcG9seTJkL1VuaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxXQUFXLEVBQ1gsUUFBUSxFQUVSLFFBQVEsRUFDUixlQUFlLEVBQ2YsVUFBVSxHQUdiLE1BQU0sK0JBQStCLENBQUM7QUFHdkMsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUseUJBQXlCLEVBQUUscUJBQXFCLEVBQUUsU0FBUyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBSXhGLG1HQUFtRztBQUNuRzs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUFDLFNBQWtCLEVBQUUsUUFBbUI7SUFDekQsUUFBUSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQVUsQ0FBQztJQUMxQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUFFLE9BQU8sRUFBRSxDQUFDO0tBQUU7SUFDeEMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQztJQUMvQixJQUFJLFFBQXVCLENBQUM7SUFDNUIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLFFBQVEsR0FBRyxRQUFRLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUM1RCxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBa0IsQ0FBQztLQUNoRDtTQUFNO1FBQ0gscURBQXFEO1FBQ3JELGtFQUFrRTtRQUNsRSxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBa0IsQ0FBQztLQUNsRDtJQUNELHNCQUFzQjtJQUN0QixNQUFNLFNBQVMsR0FBYyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ3ZDLE1BQU0sT0FBTyxHQUFhLFNBQVMsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDekQsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUFFLE9BQU8sRUFBRSxDQUFDO0tBQUU7SUFDeEMsTUFBTSxZQUFZLEdBQVUseUJBQXlCLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNyRixJQUFJLFlBQVksS0FBSyxJQUFJLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3pDLE1BQU0sYUFBYSxHQUFhLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDMUYsT0FBTyxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxhQUFhLENBQVUsQ0FBQztJQUM5RCxrR0FBa0c7QUFDdEcsQ0FBQyJ9