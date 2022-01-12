import { checkIDs, ID } from '../../../_check_ids';
import { EEntType, vecAvg } from '@design-automation/mobius-sim';
import { getCentroid } from '.';
// ================================================================================================
export function getCentoridFromEnts(__model__, ents, fn_name) {
    // this must be an ID or an array of IDs, so lets get the centroid
    // TODO this error message is confusing
    const ents_arr = checkIDs(__model__, fn_name, 'ents', ents, [ID.isID, ID.isIDL1], [EEntType.POSI, EEntType.VERT, EEntType.POINT, EEntType.EDGE, EEntType.WIRE,
        EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
    const centroid = getCentroid(__model__, ents_arr);
    if (Array.isArray(centroid[0])) {
        return vecAvg(centroid);
    }
    return centroid;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Q2VudG9yaWRGcm9tRW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9fY29tbW9uL2dldENlbnRvcmlkRnJvbUVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVuRCxPQUFPLEVBQXNCLFFBQVEsRUFBZSxNQUFNLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNsRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sR0FBRyxDQUFDO0FBQ2hDLG1HQUFtRztBQUNuRyxNQUFNLFVBQVUsbUJBQW1CLENBQUMsU0FBa0IsRUFBRSxJQUFlLEVBQUUsT0FBZTtJQUNwRixrRUFBa0U7SUFDbEUsdUNBQXVDO0lBQ3ZDLE1BQU0sUUFBUSxHQUE4QixRQUFRLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUNqRixDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUNwQixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7UUFDdkUsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBZ0IsQ0FBQztJQUN0RSxNQUFNLFFBQVEsR0FBZ0IsV0FBVyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMvRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDNUIsT0FBTyxNQUFNLENBQUMsUUFBa0IsQ0FBUyxDQUFDO0tBQzdDO0lBQ0QsT0FBTyxRQUFnQixDQUFDO0FBQzVCLENBQUMifQ==