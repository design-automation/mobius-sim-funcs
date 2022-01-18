"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polyline = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
// ================================================================================================
/**
 * Adds one or more new polylines to the model.
 *
 * @param __model__
 * @param entities List or nested lists of positions, or entities from which positions can be extracted.
 * @param close Enum, 'open' or 'close'.
 * @returns Entities, new polyline, or a list of new polylines.
 * @example polyline1 = make.Polyline([position1,position2,position3], close)
 * @example_info Creates a closed polyline with vertices position1, position2, position3 in sequence.
 */
function Polyline(__model__, entities, close) {
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    let ents_arr;
    if (__model__.debug) {
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, 'make.Polyline', 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1, _check_ids_1.ID.isIDL2], [mobius_sim_1.EEntType.POSI, mobius_sim_1.EEntType.VERT, mobius_sim_1.EEntType.EDGE, mobius_sim_1.EEntType.WIRE,
            mobius_sim_1.EEntType.PLINE, mobius_sim_1.EEntType.PGON]);
    }
    else {
        ents_arr = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    const new_ents_arr = __model__.modeldata.funcs_make.polyline(ents_arr, close);
    const depth = (0, mobius_sim_1.getArrDepth)(ents_arr);
    if (depth === 1 || (depth === 2 && ents_arr[0][0] === mobius_sim_1.EEntType.POSI)) {
        const first_ent = new_ents_arr[0];
        return (0, mobius_sim_1.idsMake)(first_ent);
    }
    else {
        return (0, mobius_sim_1.idsMake)(new_ents_arr);
    }
}
exports.Polyline = Polyline;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9seWxpbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvbWFrZS9Qb2x5bGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4REFTdUM7QUFFdkMsb0RBQW1EO0FBT25ELG1HQUFtRztBQUNuRzs7Ozs7Ozs7O0dBU0c7QUFDSCxTQUFnQixRQUFRLENBQUMsU0FBa0IsRUFBRSxRQUEyQixFQUFFLEtBQWM7SUFDcEYsSUFBSSxJQUFBLHVCQUFVLEVBQUMsUUFBUSxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3hDLHNCQUFzQjtJQUN0QixJQUFJLFFBQVEsQ0FBQztJQUNiLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixRQUFRLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDcEUsQ0FBQyxlQUFFLENBQUMsSUFBSSxFQUFFLGVBQUUsQ0FBQyxNQUFNLEVBQUUsZUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUMvQixDQUFDLHFCQUFRLENBQUMsSUFBSSxFQUFFLHFCQUFRLENBQUMsSUFBSSxFQUFFLHFCQUFRLENBQUMsSUFBSSxFQUFFLHFCQUFRLENBQUMsSUFBSTtZQUMzRCxxQkFBUSxDQUFDLEtBQUssRUFBRSxxQkFBUSxDQUFDLElBQUksQ0FBQyxDQUE4QyxDQUFDO0tBQ2hGO1NBQU07UUFDSCxRQUFRLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFFBQVEsQ0FBOEMsQ0FBQztLQUM5RTtJQUNELHNCQUFzQjtJQUN0QixNQUFNLFlBQVksR0FBa0IsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQW1CLENBQUM7SUFDL0csTUFBTSxLQUFLLEdBQVcsSUFBQSx3QkFBVyxFQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVDLElBQUksS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLHFCQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDbEUsTUFBTSxTQUFTLEdBQWdCLFlBQVksQ0FBQyxDQUFDLENBQWdCLENBQUM7UUFDOUQsT0FBTyxJQUFBLG9CQUFPLEVBQUMsU0FBUyxDQUFRLENBQUM7S0FDcEM7U0FBTTtRQUNILE9BQU8sSUFBQSxvQkFBTyxFQUFDLFlBQVksQ0FBYyxDQUFDO0tBQzdDO0FBQ0wsQ0FBQztBQXJCRCw0QkFxQkMifQ==