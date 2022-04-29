"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffsetRound = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const chk = __importStar(require("../../../_check_types"));
const _enum_1 = require("./_enum");
const _shared_1 = require("./_shared");
/**
* Offset a polyline or polygon, with round joints.
*
* @param __model__
* @param entities A list of pollines or polygons, or entities from which polylines or polygons can be extracted.
* @param dist Offset distance
* @param tolerance The tolerance for the rounded corners.
* @param end_type Enum, the type of end shape for open polylines'.
* @returns A list of new polygons.
*/
function OffsetRound(__model__, entities, dist, tolerance, end_type) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'poly2d.OffsetRound';
    let ents_arr;
    if (__model__.debug) {
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.PLINE, mobius_sim_1.EEntType.PGON]);
        chk.checkArgs(fn_name, 'tolerance', tolerance, [chk.isNum]);
    }
    else {
        // ents_arr = splitIDs(fn_name, 'entities', entities,
        // [IDcheckObj.isID, IDcheckObj.isIDList], [EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx[];
        ents_arr = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    const posis_map = new Map();
    const all_new_pgons = [];
    const options = {
        jointType: _enum_1._EClipJointType.ROUND,
        endType: _shared_1.MClipOffsetEndType.get(end_type),
        roundPrecision: tolerance * _shared_1.SCALE
    };
    const [pgons_i, plines_i] = (0, _shared_1._getPgonsPlines)(__model__, ents_arr);
    for (const pgon_i of pgons_i) {
        const new_pgons_i = (0, _shared_1._offsetPgon)(__model__, pgon_i, dist, options, posis_map);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([mobius_sim_1.EEntType.PGON, new_pgon_i]);
        }
    }
    for (const pline_i of plines_i) {
        const new_pgons_i = (0, _shared_1._offsetPline)(__model__, pline_i, dist, options, posis_map);
        for (const new_pgon_i of new_pgons_i) {
            all_new_pgons.push([mobius_sim_1.EEntType.PGON, new_pgon_i]);
        }
    }
    return (0, mobius_sim_1.idsMake)(all_new_pgons);
}
exports.OffsetRound = OffsetRound;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT2Zmc2V0Um91bmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvcG9seTJkL09mZnNldFJvdW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBU3VDO0FBRXZDLG9EQUFtRDtBQUNuRCwyREFBNkM7QUFDN0MsbUNBQXlEO0FBQ3pELHVDQVFtQjtBQUluQjs7Ozs7Ozs7O0VBU0U7QUFDRixTQUFnQixXQUFXLENBQUMsU0FBa0IsRUFBRSxRQUFxQixFQUFFLElBQVksRUFDL0UsU0FBaUIsRUFBRSxRQUF1QjtJQUMxQyxRQUFRLEdBQUcsSUFBQSx3QkFBVyxFQUFDLFFBQVEsQ0FBVSxDQUFDO0lBQzFDLElBQUksSUFBQSx1QkFBVSxFQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ3RCLE9BQU8sRUFBRSxDQUFDO0tBQ2I7SUFDRCxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsb0JBQW9CLENBQUM7SUFDckMsSUFBSSxRQUF1QixDQUFDO0lBQzVCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixRQUFRLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDeEQsQ0FBQyxlQUFFLENBQUMsSUFBSSxFQUFFLGVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLHFCQUFRLENBQUMsS0FBSyxFQUFFLHFCQUFRLENBQUMsSUFBSSxDQUFDLENBQWtCLENBQUM7UUFDNUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQy9EO1NBQU07UUFDSCxxREFBcUQ7UUFDckQsNkZBQTZGO1FBQzdGLFFBQVEsR0FBRyxJQUFBLHFCQUFRLEVBQUMsUUFBUSxDQUFrQixDQUFDO0tBQ2xEO0lBQ0Qsc0JBQXNCO0lBQ3RCLE1BQU0sU0FBUyxHQUFjLElBQUksR0FBRyxFQUFFLENBQUM7SUFDdkMsTUFBTSxhQUFhLEdBQWtCLEVBQUUsQ0FBQztJQUN4QyxNQUFNLE9BQU8sR0FBdUI7UUFDaEMsU0FBUyxFQUFFLHVCQUFlLENBQUMsS0FBSztRQUNoQyxPQUFPLEVBQUUsNEJBQWtCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUN6QyxjQUFjLEVBQUUsU0FBUyxHQUFHLGVBQUs7S0FDcEMsQ0FBQztJQUNGLE1BQU0sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLEdBQXlCLElBQUEseUJBQWUsRUFBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdkYsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7UUFDMUIsTUFBTSxXQUFXLEdBQWEsSUFBQSxxQkFBVyxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN2RixLQUFLLE1BQU0sVUFBVSxJQUFJLFdBQVcsRUFBRTtZQUNsQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMscUJBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUNuRDtLQUNKO0lBQ0QsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUU7UUFDNUIsTUFBTSxXQUFXLEdBQWEsSUFBQSxzQkFBWSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN6RixLQUFLLE1BQU0sVUFBVSxJQUFJLFdBQVcsRUFBRTtZQUNsQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMscUJBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUNuRDtLQUNKO0lBQ0QsT0FBTyxJQUFBLG9CQUFPLEVBQUMsYUFBYSxDQUFVLENBQUM7QUFDM0MsQ0FBQztBQXhDRCxrQ0F3Q0MifQ==