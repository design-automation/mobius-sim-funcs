"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Centroid = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const _common_1 = require("../_common");
const _enum_1 = require("./_enum");
// ================================================================================================
/**
 * Calculates the centroid of an entity.
 *
 * If 'ps_average' is selected, the centroid is the average of the positions that make up that entity.
 *
 * If 'center_of_mass' is selected, the centroid is the centre of mass of the faces that make up that entity.
 * Note that only faces are deemed to have mass.
 *
 * Given a list of entities, a list of centroids will be returned.
 *
 * Given a list of positions, a single centroid that is the average of all those positions will be returned.
 *
 * @param __model__
 * @param entities Single or list of entities. (Can be any type of entities.)
 * @param method Enum, the method for calculating the centroid.
 * @returns A centroid [x, y, z] or a list of centroids.
 * @example centroid1 = calc.Centroid (polygon1)
 */
function Centroid(__model__, entities, method) {
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'calc.Centroid';
    let ents_arrs;
    if (__model__.debug) {
        ents_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
    }
    else {
        ents_arrs = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    switch (method) {
        case _enum_1._ECentroidMethod.PS_AVERAGE:
            return (0, _common_1.getCentroid)(__model__, ents_arrs);
        case _enum_1._ECentroidMethod.CENTER_OF_MASS:
            return (0, _common_1.getCenterOfMass)(__model__, ents_arrs);
        default:
            break;
    }
}
exports.Centroid = Centroid;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2VudHJvaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvY2FsYy9DZW50cm9pZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4REFBc0c7QUFFdEcsb0RBQW1EO0FBQ25ELHdDQUEwRDtBQUMxRCxtQ0FBMkM7QUFJM0MsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUNILFNBQWdCLFFBQVEsQ0FBQyxTQUFrQixFQUFFLFFBQW1CLEVBQUUsTUFBd0I7SUFDdEYsSUFBSSxJQUFBLHVCQUFVLEVBQUMsUUFBUSxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3hDLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUM7SUFDaEMsSUFBSSxTQUFvQyxDQUFDO0lBQ3pDLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixTQUFTLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDN0QsQ0FBQyxlQUFFLENBQUMsSUFBSSxFQUFFLGVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQThCLENBQUM7S0FDNUQ7U0FBTTtRQUNILFNBQVMsR0FBRyxJQUFBLHFCQUFRLEVBQUMsUUFBUSxDQUE4QixDQUFDO0tBQy9EO0lBQ0Qsc0JBQXNCO0lBQ3RCLFFBQVEsTUFBTSxFQUFFO1FBQ1osS0FBSyx3QkFBZ0IsQ0FBQyxVQUFVO1lBQzVCLE9BQU8sSUFBQSxxQkFBVyxFQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3QyxLQUFLLHdCQUFnQixDQUFDLGNBQWM7WUFDaEMsT0FBTyxJQUFBLHlCQUFlLEVBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2pEO1lBQ0ksTUFBTTtLQUNiO0FBQ0wsQ0FBQztBQXBCRCw0QkFvQkMifQ==