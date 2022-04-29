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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxhbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvdmlzdWFsaXplL1BsYW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBY3VDO0FBRXZDLDJEQUE2QztBQUc3QyxtR0FBbUc7QUFDbkc7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFnQixLQUFLLENBQUMsU0FBa0IsRUFBRSxNQUF1QixFQUFFLEtBQWE7SUFDNUUsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDO0lBQ2xDLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUNuQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDN0IsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQ3ZEO0lBQ0Qsc0JBQXNCO0lBQ3RCLE9BQU8sSUFBQSxvQkFBTyxFQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFVLENBQUM7QUFDakUsQ0FBQztBQVZELHNCQVVDO0FBQ0QsU0FBUyxTQUFTLENBQUMsU0FBa0IsRUFBRSxNQUF1QixFQUFFLEtBQWE7SUFDekUsSUFBSSxJQUFBLHdCQUFXLEVBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQzNCLE1BQU0sS0FBSyxHQUFXLE1BQWdCLENBQUM7UUFDdkMsTUFBTSxNQUFNLEdBQVMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sS0FBSyxHQUFTLElBQUEsb0JBQU8sRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFD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