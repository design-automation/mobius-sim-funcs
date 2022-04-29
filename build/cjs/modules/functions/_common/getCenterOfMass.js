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
exports.getCenterOfMass = void 0;
const THREE = __importStar(require("three"));
const three_1 = require("three");
const mobius_sim_1 = require("@design-automation/mobius-sim");
// ================================================================================================
function getCenterOfMass(__model__, ents_arr) {
    if ((0, mobius_sim_1.getArrDepth)(ents_arr) === 1) {
        const [ent_type, ent_i] = ents_arr;
        const pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
        if (pgons_i.length === 0) {
            return null;
        }
        return _centerOfMass(__model__, pgons_i);
    }
    else {
        const cents = [];
        ents_arr = ents_arr;
        for (const [ent_type, ent_i] of ents_arr) {
            const pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
            if (pgons_i.length === 0) {
                cents.push(null);
            }
            cents.push(_centerOfMass(__model__, pgons_i));
        }
        return cents;
    }
}
exports.getCenterOfMass = getCenterOfMass;
function _centerOfMass(__model__, pgons_i) {
    const face_midpoints = [];
    const face_areas = [];
    let total_area = 0;
    for (const face_i of pgons_i) {
        const [midpoint_xyz, area] = _centerOfMassOfPgon(__model__, face_i);
        face_midpoints.push(midpoint_xyz);
        face_areas.push(area);
        total_area += area;
    }
    const cent = [0, 0, 0];
    for (let i = 0; i < face_midpoints.length; i++) {
        const weight = face_areas[i] / total_area;
        cent[0] = cent[0] + face_midpoints[i][0] * weight;
        cent[1] = cent[1] + face_midpoints[i][1] * weight;
        cent[2] = cent[2] + face_midpoints[i][2] * weight;
    }
    return cent;
}
function _centerOfMassOfPgon(__model__, pgon_i) {
    const tri_midpoints = [];
    const tri_areas = [];
    let total_area = 0;
    const map_posi_to_v3 = new Map();
    let midpoint = new three_1.Vector3();
    for (const tri_i of __model__.modeldata.geom.nav_tri.navPgonToTri(pgon_i)) {
        const posis_i = __model__.modeldata.geom.nav_tri.navTriToPosi(tri_i);
        const posis_v3 = [];
        for (const posi_i of posis_i) {
            let posi_v3 = map_posi_to_v3.get(posi_i);
            if (posi_v3 === undefined) {
                const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
                posi_v3 = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);
            }
            posis_v3.push(posi_v3);
        }
        const tri_tjs = new THREE.Triangle(posis_v3[0], posis_v3[1], posis_v3[2]);
        tri_tjs.getMidpoint(midpoint);
        const midpoint_xyz = [midpoint.x, midpoint.y, midpoint.z];
        const area = tri_tjs.getArea();
        tri_midpoints.push(midpoint_xyz);
        tri_areas.push(area);
        total_area += area;
    }
    const cent = [0, 0, 0];
    for (let i = 0; i < tri_midpoints.length; i++) {
        const weight = tri_areas[i] / total_area;
        cent[0] = cent[0] + tri_midpoints[i][0] * weight;
        cent[1] = cent[1] + tri_midpoints[i][1] * weight;
        cent[2] = cent[2] + tri_midpoints[i][2] * weight;
    }
    return [cent, total_area];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Q2VudGVyT2ZNYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL19jb21tb24vZ2V0Q2VudGVyT2ZNYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBQy9CLGlDQUFnQztBQUVoQyw4REFBa0c7QUFDbEcsbUdBQW1HO0FBQ25HLFNBQWdCLGVBQWUsQ0FBQyxTQUFrQixFQUFFLFFBQXFDO0lBQ3JGLElBQUksSUFBQSx3QkFBVyxFQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUM3QixNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxHQUF1QixRQUF1QixDQUFDO1FBQ3RFLE1BQU0sT0FBTyxHQUFhLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JGLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdEIsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE9BQU8sYUFBYSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUM1QztTQUFNO1FBQ0gsTUFBTSxLQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ3pCLFFBQVEsR0FBRyxRQUF5QixDQUFDO1FBQ3JDLEtBQUssTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxRQUFRLEVBQUU7WUFDdEMsTUFBTSxPQUFPLEdBQWEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDckYsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDdEIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNwQjtZQUNE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