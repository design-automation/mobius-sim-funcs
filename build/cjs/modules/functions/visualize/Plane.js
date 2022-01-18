"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.Plane = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const chk = __importStar(require("../../../_check_types"));
// ================================================================================================
/**
 * Visualises a plane or a list of planes by creating polylines.
 *
 * @param __model__
 * @param plane A plane or a list of planes.
 * @returns Entities, a square plane polyline and three axis polyline.
 * @example plane1 = visualize.Plane(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
function Plane(__model__, planes, scale) {
    // --- Error Check ---
    const fn_name = 'visualize.Plane';
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'planes', planes, [chk.isPln, chk.isPlnL]);
        chk.checkArgs(fn_name, 'scale', scale, [chk.isNum]);
    }
    // --- Error Check ---
    return (0, mobius_sim_1.idsMake)(_visPlane(__model__, planes, scale));
}
exports.Plane = Plane;
function _visPlane(__model__, planes, scale) {
    if ((0, mobius_sim_1.getArrDepth)(planes) === 2) {
        const plane = planes;
        const origin = plane[0];
        const x_vec = (0, mobius_sim_1.vecMult)(plane[1], scale);
        const y_vec = (0, mobius_sim_1.vecMult)(plane[2], scale);
        let x_end = (0, mobius_sim_1.vecAdd)(origin, x_vec);
        let y_end = (0, mobius_sim_1.vecAdd)(origin, y_vec);
        const z_end = (0, mobius_sim_1.vecAdd)(origin, (0, mobius_sim_1.vecSetLen)((0, mobius_sim_1.vecCross)(x_vec, y_vec), scale));
        const plane_corners = [
            (0, mobius_sim_1.vecAdd)(x_end, y_vec),
            (0, mobius_sim_1.vecSub)(y_end, x_vec),
            (0, mobius_sim_1.vecSub)((0, mobius_sim_1.vecSub)(origin, x_vec), y_vec),
            (0, mobius_sim_1.vecSub)(x_end, y_vec),
        ];
        x_end = (0, mobius_sim_1.vecAdd)(x_end, (0, mobius_sim_1.vecMult)(x_vec, 0.1));
        y_end = (0, mobius_sim_1.vecSub)(y_end, (0, mobius_sim_1.vecMult)(y_vec, 0.1));
        // create the point
        const origin_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(origin_posi_i, origin);
        // create the x axis
        const x_end_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(x_end_posi_i, x_end);
        const x_pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, x_end_posi_i]);
        // create the y axis
        const y_end_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(y_end_posi_i, y_end);
        const y_pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, y_end_posi_i]);
        // create the z axis
        const z_end_posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(z_end_posi_i, z_end);
        const z_pline_i = __model__.modeldata.geom.add.addPline([origin_posi_i, z_end_posi_i]);
        // create pline for plane
        const corner_posis_i = [];
        for (const corner of plane_corners) {
            const posi_i = __model__.modeldata.geom.add.addPosi();
            __model__.modeldata.attribs.posis.setPosiCoords(posi_i, corner);
            corner_posis_i.push(posi_i);
        }
        const plane_i = __model__.modeldata.geom.add.addPline(corner_posis_i, true);
        // return the geometry IDs
        return [
            [mobius_sim_1.EEntType.PLINE, x_pline_i],
            [mobius_sim_1.EEntType.PLINE, y_pline_i],
            [mobius_sim_1.EEntType.PLINE, z_pline_i],
            [mobius_sim_1.EEntType.PLINE, plane_i]
        ];
    }
    else {
        const ents_arr = [];
        for (const plane of planes) {
            const plane_ents = _visPlane(__model__, plane, scale);
            for (const plane_ent of plane_ents) {
                ents_arr.push(plane_ent);
            }
        }
        return ents_arr;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxhbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvdmlzdWFsaXplL1BsYW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFjdUM7QUFFdkMsMkRBQTZDO0FBRzdDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7R0FRRztBQUNILFNBQWdCLEtBQUssQ0FBQyxTQUFrQixFQUFFLE1BQXVCLEVBQUUsS0FBYTtJQUM1RSxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsaUJBQWlCLENBQUM7SUFDbEMsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQ25DLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM3QixHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDdkQ7SUFDRCxzQkFBc0I7SUFDdEIsT0FBTyxJQUFBLG9CQUFPLEVBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQVUsQ0FBQztBQUNqRSxDQUFDO0FBVkQsc0JBVUM7QUFDRCxTQUFTLFNBQVMsQ0FBQyxTQUFrQixFQUFFLE1BQXVCLEVBQUUsS0FBYTtJQUN6RSxJQUFJLElBQUEsd0JBQVcsRUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDM0IsTUFBTSxLQUFLLEdBQVcsTUFBZ0IsQ0FBQztRQUN2QyxNQUFNLE1BQU0sR0FBUyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsTUFBTSxLQUFLLEdBQVMsSUFBQSxvQkFBTyxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFB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