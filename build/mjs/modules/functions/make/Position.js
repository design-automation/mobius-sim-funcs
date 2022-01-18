import { idsMake, isEmptyArr } from '@design-automation/mobius-sim';
import * as chk from '../../../_check_types';
// ================================================================================================
/**
 * Adds one or more new position to the model.
 *
 * @param __model__
 * @param coords A list of three numbers, or a list of lists of three numbers.
 * @returns A new position, or nested list of new positions.
 * @example position1 = make.Position([1,2,3])
 * @example_info Creates a position with coordinates x=1, y=2, z=3.
 * @example positions = make.Position([[1,2,3],[3,4,5],[5,6,7]])
 * @example_info Creates three positions, with coordinates [1,2,3],[3,4,5] and [5,6,7].
 */
export function Position(__model__, coords) {
    if (isEmptyArr(coords)) {
        return [];
    }
    // --- Error Check ---
    if (__model__.debug) {
        chk.checkArgs('make.Position', 'coords', coords, [chk.isXYZ, chk.isXYZL, chk.isXYZLL]);
    }
    // --- Error Check ---
    const new_ents_arr = __model__.modeldata.funcs_make.position(coords);
    return idsMake(new_ents_arr);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9zaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvbWFrZS9Qb3NpdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQVcsT0FBTyxFQUFFLFVBQVUsRUFBMEIsTUFBTSwrQkFBK0IsQ0FBQztBQUVyRyxPQUFPLEtBQUssR0FBRyxNQUFNLHVCQUF1QixDQUFDO0FBSzdDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7OztHQVVHO0FBQ0gsTUFBTSxVQUFVLFFBQVEsQ0FBQyxTQUFrQixFQUFFLE1BQTRCO0lBQ3JFLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUN0QyxzQkFBc0I7SUFDdEIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLEdBQUcsQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDMUY7SUFDRCxzQkFBc0I7SUFDdEIsTUFBTSxZQUFZLEdBQThDLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoSCxPQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNqQyxDQUFDIn0=