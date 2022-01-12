"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCentoridFromEnts = void 0;
const _check_ids_1 = require("../../../_check_ids");
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _1 = require(".");
// ================================================================================================
function getCentoridFromEnts(__model__, ents, fn_name) {
    // this must be an ID or an array of IDs, so lets get the centroid
    // TODO this error message is confusing
    const ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'ents', ents, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.POSI, mobius_sim_1.EEntType.VERT, mobius_sim_1.EEntType.POINT, mobius_sim_1.EEntType.EDGE, mobius_sim_1.EEntType.WIRE,
        mobius_sim_1.EEntType.PLINE, mobius_sim_1.EEntType.PGON, mobius_sim_1.EEntType.COLL]);
    const centroid = (0, _1.getCentroid)(__model__, ents_arr);
    if (Array.isArray(centroid[0])) {
        return (0, mobius_sim_1.vecAvg)(centroid);
    }
    return centroid;
}
exports.getCentoridFromEnts = getCentoridFromEnts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Q2VudG9yaWRGcm9tRW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9fY29tbW9uL2dldENlbnRvcmlkRnJvbUVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsb0RBQW1EO0FBRW5ELDhEQUFrRztBQUNsRyx3QkFBZ0M7QUFDaEMsbUdBQW1HO0FBQ25HLFNBQWdCLG1CQUFtQixDQUFDLFNBQWtCLEVBQUUsSUFBZSxFQUFFLE9BQWU7SUFDcEYsa0VBQWtFO0lBQ2xFLHVDQUF1QztJQUN2QyxNQUFNLFFBQVEsR0FBOEIsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFDakYsQ0FBQyxlQUFFLENBQUMsSUFBSSxFQUFFLGVBQUUsQ0FBQyxNQUFNLENBQUMsRUFDcEIsQ0FBQyxxQkFBUSxDQUFDLElBQUksRUFBRSxxQkFBUSxDQUFDLElBQUksRUFBRSxxQkFBUSxDQUFDLEtBQUssRUFBRSxxQkFBUSxDQUFDLElBQUksRUFBRSxxQkFBUSxDQUFDLElBQUk7UUFDdkUscUJBQVEsQ0FBQyxLQUFLLEVBQUUscUJBQVEsQ0FBQyxJQUFJLEVBQUUscUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBZ0IsQ0FBQztJQUN0RSxNQUFNLFFBQVEsR0FBZ0IsSUFBQSxjQUFXLEVBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQy9ELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUM1QixPQUFPLElBQUEsbUJBQU0sRUFBQyxRQUFrQixDQUFTLENBQUM7S0FDN0M7SUFDRCxPQUFPLFFBQWdCLENBQUM7QUFDNUIsQ0FBQztBQVpELGtEQVlDIn0=