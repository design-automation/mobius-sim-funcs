import * as THREE from "three";
import { Vector3 } from "three";

import { Sim, Txyz, ENT_TYPE, string, getArrDepth } from "../../../mobius_sim";
// ================================================================================================
export function getCenterOfMass(__model__: Sim, ents_arr: string | string[]): Txyz | Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, ent_i]: [ENT_TYPE, number] = ents_arr as string;
        const pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
        if (pgons_i.length === 0) {
            return null;
        }
        return _centerOfMass(__model__, pgons_i);
    } else {
        const cents: Txyz[] = [];
        ents_arr = ents_arr as string[];
        for (const [ent_type, ent_i] of ents_arr) {
            const pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
            if (pgons_i.length === 0) {
                cents.push(null);
            }
            cents.push(_centerOfMass(__model__, pgons_i));
        }
        return cents;
    }
}
function _centerOfMass(__model__: Sim, pgons_i: number[]): Txyz {
    const face_midpoints: Txyz[] = [];
    const face_areas: number[] = [];
    let total_area = 0;
    for (const face_i of pgons_i) {
        const [midpoint_xyz, area]: [Txyz, number] = _centerOfMassOfPgon(__model__, face_i);
        face_midpoints.push(midpoint_xyz);
        face_areas.push(area);
        total_area += area;
    }
    const cent: Txyz = [0, 0, 0];
    for (let i = 0; i < face_midpoints.length; i++) {
        const weight: number = face_areas[i] / total_area;
        cent[0] = cent[0] + face_midpoints[i][0] * weight;
        cent[1] = cent[1] + face_midpoints[i][1] * weight;
        cent[2] = cent[2] + face_midpoints[i][2] * weight;
    }
    return cent;
}
function _centerOfMassOfPgon(__model__: Sim, pgon_i: number): [Txyz, number] {
    const tri_midpoints: Txyz[] = [];
    const tri_areas: number[] = [];
    let total_area = 0;
    const map_posi_to_v3: Map<number, THREE.Vector3> = new Map();
    let midpoint: THREE.Vector3 = new Vector3();
    for (const tri_i of __model__.modeldata.geom.nav_tri.navPgonToTri(pgon_i)) {
        const posis_i: number[] = __model__.modeldata.geom.nav_tri.navTriToPosi(tri_i);
        const posis_v3: THREE.Vector3[] = [];
        for (const posi_i of posis_i) {
            let posi_v3: THREE.Vector3 = map_posi_to_v3.get(posi_i);
            if (posi_v3 === undefined) {
                const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
                posi_v3 = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);
            }
            posis_v3.push(posi_v3);
        }
        const tri_tjs: THREE.Triangle = new THREE.Triangle(posis_v3[0], posis_v3[1], posis_v3[2]);
        tri_tjs.getMidpoint(midpoint);
        const midpoint_xyz: Txyz = [midpoint.x, midpoint.y, midpoint.z];
        const area: number = tri_tjs.getArea();
        tri_midpoints.push(midpoint_xyz);
        tri_areas.push(area);
        total_area += area;
    }
    const cent: Txyz = [0, 0, 0];
    for (let i = 0; i < tri_midpoints.length; i++) {
        const weight: number = tri_areas[i] / total_area;
        cent[0] = cent[0] + tri_midpoints[i][0] * weight;
        cent[1] = cent[1] + tri_midpoints[i][1] * weight;
        cent[2] = cent[2] + tri_midpoints[i][2] * weight;
    }
    return [cent, total_area];
}
