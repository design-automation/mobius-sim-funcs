import { Sim, ENT_TYPE } from "src/mobius_sim";
import * as THREE from "three";
import { Txyz } from "./consts";
import { getArrDepth } from "./_arrs";
// -------------------------------------------------------------------------------------------------
/**
 * Calculate centre of mass. For a single entity, a single XYZ coord is returned. For a list of
 * entities, a list of XYZ coords are returned. In both cases, the centre of mass is calculated
 * based polygon triangles.
 * @param __model__ 
 * @param ents 
 * @returns 
 */
export function getCenterOfMass(__model__: Sim, ents: string | string[]): Txyz | Txyz[] {
    if (getArrDepth(ents) === 0) {
        const pgons: string[] = __model__.getEnts(ENT_TYPE.PGON, ents);
        // modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
        if (pgons.length === 0) {
            return null;
        }
        return _centerOfMass(__model__, pgons) as Txyz;
    } else {
        const cents: Txyz[] = [];
        ents = ents as string[];
        for (const ent of ents) {
            const pgon: string[] = __model__.getEnts(ENT_TYPE.PGON, ent);
            if (pgon.length === 0) {
                cents.push(null);
            }
            cents.push(_centerOfMass(__model__, pgon));
        }
        return cents as Txyz[];
    }
}
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param __model__ 
 * @param pgons 
 * @returns 
 */
function _centerOfMass(__model__: Sim, pgons: string[]): Txyz {
    const tri_midpoints: Txyz[] = [];
    const tri_areas: number[] = [];
    let total_area = 0;
    for (const pgon of pgons) {
        const [midpoint_xyz, area]: [Txyz, number] = _centerOfMassOfPgon(__model__, pgon);
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
    return cent;
}
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param __model__ 
 * @param pgon 
 * @returns 
 */
function _centerOfMassOfPgon(__model__: Sim, pgon: string): [Txyz, number] {
    const tri_midpoints: Txyz[] = [];
    const tri_areas: number[] = [];
    let total_area = 0;
    const map_posi_to_v3: Map<string, THREE.Vector3> = new Map();
    let midpoint: THREE.Vector3 = new THREE.Vector3();
    for (const tri of __model__.getEnts(ENT_TYPE.TRI, pgon)) {
        // modeldata.geom.nav_tri.navPgonToTri(pgon)) {
        const posis: string[] = __model__.getEnts(ENT_TYPE.POSI, tri);
        // modeldata.geom.nav_tri.navTriToPosi(tri);
        const posis_v3: THREE.Vector3[] = [];
        for (const posi of posis) {
            let posi_v3: THREE.Vector3 = map_posi_to_v3.get(posi);
            if (posi_v3 === undefined) {
                const xyz: Txyz = __model__.getPosiCoords(posi);
                posi_v3 = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);
                map_posi_to_v3.set(posi, posi_v3);
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
// -------------------------------------------------------------------------------------------------