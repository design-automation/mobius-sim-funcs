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
exports.Rotate = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const chk = __importStar(require("../../../_check_types"));
const _common_1 = require("../_common");
// ================================================================================================
/**
 * Rotates entities on plane by angle.
 * \n
 * @param __model__
 * @param entities  An entity or list of entities to rotate.
 * @param ray A ray to rotate around. \n
 * Given a plane, a ray will be created from the plane z axis. \n
 * Given an `xyz` location, a ray will be generated with an origin at this location, and a direction `[0, 0, 1]`. \n
 * Given any entities, the centroid will be extracted, \n
 * and a ray will be generated with an origin at this centroid, and a direction `[0, 0, 1]`.
 * @param angle Angle (in radians).
 * @returns void
 * @example modify.Rotate(polyline1, plane1, PI)
 * @example_info Rotates polyline1 around the z-axis of plane1 by PI (i.e. 180 degrees).
 */
function Rotate(__model__, entities, ray, angle) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    if (!(0, mobius_sim_1.isEmptyArr)(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Rotate';
        let ents_arr;
        if (__model__.debug) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.POSI, mobius_sim_1.EEntType.VERT, mobius_sim_1.EEntType.EDGE, mobius_sim_1.EEntType.WIRE,
                mobius_sim_1.EEntType.POINT, mobius_sim_1.EEntType.PLINE, mobius_sim_1.EEntType.PGON, mobius_sim_1.EEntType.COLL]);
            chk.checkArgs(fn_name, 'angle', angle, [chk.isNum]);
        }
        else {
            ents_arr = (0, mobius_sim_1.idsBreak)(entities);
        }
        ray = (0, _common_1.getRay)(__model__, ray, fn_name);
        // --- Error Check ---
        __model__.modeldata.funcs_modify.rotate(ents_arr, ray, angle);
    }
}
exports.Rotate = Rotate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm90YXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL21vZGlmeS9Sb3RhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFXdUM7QUFFdkMsb0RBQW1EO0FBQ25ELDJEQUE2QztBQUM3Qyx3Q0FBb0M7QUFLcEMsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsU0FBZ0IsTUFBTSxDQUFDLFNBQWtCLEVBQUUsUUFBbUIsRUFBRSxHQUErQixFQUFFLEtBQWE7SUFDMUcsUUFBUSxHQUFHLElBQUEsd0JBQVcsRUFBQyxRQUFRLENBQVUsQ0FBQztJQUMxQyxJQUFJLENBQUMsSUFBQSx1QkFBVSxFQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ3ZCLHNCQUFzQjtRQUN0QixNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUM7UUFDaEMsSUFBSSxRQUF1QixDQUFDO1FBQzVCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtZQUNqQixRQUFRLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLGVBQUUsQ0FBQyxJQUFJLEVBQUUsZUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUM5RSxDQUFDLHFCQUFRLENBQUMsSUFBSSxFQUFFLHFCQUFRLENBQUMsSUFBSSxFQUFFLHFCQUFRLENBQUMsSUFBSSxFQUFFLHFCQUFRLENBQUMsSUFBSTtnQkFDM0QscUJBQVEsQ0FBQyxLQUFLLEVBQUUscUJBQVEsQ0FBQyxLQUFLLEVBQUUscUJBQVEsQ0FBQyxJQUFJLEVBQUUscUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBa0IsQ0FBQztZQUNwRixHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDdkQ7YUFBTTtZQUNILFFBQVEsR0FBRyxJQUFBLHFCQUFRLEVBQUMsUUFBUSxDQUFrQixDQUFDO1NBQ2xEO1FBQ0QsR0FBRyxHQUFHLElBQUEsZ0JBQU0sRUFBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBUyxDQUFDO1FBQzlDLHNCQUFzQjtRQUN0QixTQUFTLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNqRTtBQUNMLENBQUM7QUFsQkQsd0JBa0JDIn0=