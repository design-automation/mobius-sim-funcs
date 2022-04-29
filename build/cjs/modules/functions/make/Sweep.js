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
exports.Sweep = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const chk = __importStar(require("../../../_check_types"));
// ================================================================================================
/**
 * Sweeps a cross section wire along a backbone wire.
 *
 * @param __model__
 * @param entities Wires, or entities from which wires can be extracted.
 * @param xsection Cross section wire to sweep, or entity from which a wire can be extracted.
 * @param divisions Segment length or number of segments.
 * @param method Enum, select the method for sweeping.
 * @returns Entities, a list of new polygons or polylines resulting from the sweep.
 */
function Sweep(__model__, entities, x_section, divisions, method) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'make.Sweep';
    let backbone_ents;
    let xsection_ent;
    if (__model__.debug) {
        backbone_ents = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.WIRE, mobius_sim_1.EEntType.PLINE, mobius_sim_1.EEntType.PGON]);
        xsection_ent = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'xsextion', x_section, [_check_ids_1.ID.isID], [mobius_sim_1.EEntType.EDGE, mobius_sim_1.EEntType.WIRE, mobius_sim_1.EEntType.PLINE, mobius_sim_1.EEntType.PGON]);
        chk.checkArgs(fn_name, 'divisions', divisions, [chk.isInt]);
        if (divisions === 0) {
            throw new Error(fn_name + ' : Divisor cannot be zero.');
        }
    }
    else {
        backbone_ents = (0, mobius_sim_1.idsBreak)(entities);
        xsection_ent = (0, mobius_sim_1.idsBreak)(x_section);
    }
    // --- Error Check ---
    const new_ents = __model__.modeldata.funcs_make.sweep(backbone_ents, xsection_ent, divisions, method);
    return (0, mobius_sim_1.idsMake)(new_ents);
}
exports.Sweep = Sweep;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3dlZXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvbWFrZS9Td2VlcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhEQVN1QztBQUV2QyxvREFBbUQ7QUFDbkQsMkRBQTZDO0FBTzdDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7O0dBU0c7QUFDSCxTQUFnQixLQUFLLENBQUMsU0FBa0IsRUFBRSxRQUFtQixFQUFFLFNBQWMsRUFBRSxTQUFpQixFQUFFLE1BQXVCO0lBQ3JILFFBQVEsR0FBRyxJQUFBLHdCQUFXLEVBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsSUFBSSxJQUFBLHVCQUFVLEVBQUMsUUFBUSxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQztLQUFFO0lBQ3hDLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxZQUFZLENBQUM7SUFDN0IsSUFBSSxhQUE0QixDQUFDO0lBQ2pDLElBQUksWUFBeUIsQ0FBQztJQUM5QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsYUFBYSxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQzdELENBQUMsZUFBRSxDQUFDLElBQUksRUFBRSxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxxQkFBUSxDQUFDLElBQUksRUFBRSxxQkFBUSxDQUFDLEtBQUssRUFBRSxxQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFrQixDQUFDO1FBQzNGLFlBQVksR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUM3RCxDQUFDLGVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFRLENBQUMsSUFBSSxFQUFFLHFCQUFRLENBQUMsSUFBSSxFQUFFLHFCQUFRLENBQUMsS0FBSyxFQUFFLHFCQUFRLENBQUMsSUFBSSxDQUFDLENBQWdCLENBQUM7UUFDN0YsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzVELElBQUksU0FBUyxLQUFLLENBQUMsRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sR0FBRyw0QkFBNEIsQ0FBQyxDQUFDO1NBQzNEO0tBQ0o7U0FBTTtRQUNILGFBQWEsR0FBRyxJQUFBLHFCQUFRLEVBQUMsUUFBUSxDQUFrQixDQUFDO1FBQ3BELFlBQVksR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxDQUFnQixDQUFDO0tBQ3JEO0lBQ0Qsc0JBQXNCO0lBQ3RCLE1BQU0sUUFBUSxHQUFrQixTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckgsT0FBTyxJQUFBLG9CQUFPLEVBQUMsUUFBUSxDQUFVLENBQUM7QUFDdEMsQ0FBQztBQXZCRCxzQkF1QkMifQ==