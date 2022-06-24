import {
    distance,
    ENT_TYPE,
    getArrDepth,
    Sim,
    idsBreak,
    isEmptyArr,
    string,
    string,
    TPlane,
    TRay,
    Txyz,
    vecCross,
} from '../../mobius_sim';
import uscore from 'underscore';

import { checkIDs, ID } from '../_common/_check_ids';


function rayFromPln(pln: TPlane|TPlane[]): TRay|TRay[] {
    // overloaded case
    const pln_dep: number = getArrDepth(pln);
    if (pln_dep === 3) { return (pln as TPlane[]).map( pln_one => rayFromPln(pln_one) ) as TRay[]; }
    // normal case
    pln = pln as TPlane;
    return [pln[0].slice() as Txyz, vecCross(pln[1], pln[2])];
}

// ================================================================================================
/**
 * Calculates the length of an entity.
 * \n
 * The entity can be an edge, a wire, a polyline, or anything from which wires can be extracted.
 * This includes polylines, polygons, faces, and collections.
 * \n
 * Given a list of edges, wires, or polylines, a list of lengths are returned.
 * \n
 * Given any types of entities from which wires can be extracted, a list of lengths are returned.
 * For example, given a single polygon, a list of lengths are returned (since a polygon may have multiple wires).
 *
 * @param __model__
 * @param entities Single or list of edges or wires or other entities from which wires can be extracted.
 * @returns Lengths, a number or list of numbers.
 * @example `length1 = calc.Length(line1)`
 */
export function Length(__model__: Sim, entities: string|string[]): number|number[] {
    // if (isEmptyArr(entities)) { return []; }
    // // // --- Error Check ---
    // // const fn_name = 'calc.Length';
    // // let ents_arr: string|string[];
    // // if (this.debug) {
    // //     ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1],
    // //     [ENT_TYPE.EDGE, ENT_TYPE.WIRE, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string|string[];
    // // } else {
    // //     ents_arr = idsBreak(entities) as string|string[];
    // // }
    // // // --- Error Check ---
    // return _length(__model__, ents_arr);
    throw new Error();
}
function _length(__model__: Sim, ents_arrs: string|string[]): number|number[] {
    if (getArrDepth(ents_arrs) === 1) {
        const [ent_type, index]: [ENT_TYPE, number] = ents_arrs as string;
        if (ent_type === ENT_TYPE.EDGE) {
            return _edgeLength(__model__, index);
        } else if (ent_type === ENT_TYPE.WIRE) {
            return _wireLength(__model__, index);
        } else if (ent_type === ENT_TYPE.PLINE) {
            const wire_i: number = __model__.modeldata.geom.nav.navPlineToWire(index);
            return _wireLength(__model__, wire_i);
        } else {
            const wires_i: number[] = __model__.modeldata.geom.nav.navAnyToWire(ent_type, index);
            return wires_i.map( wire_i => _wireLength(__model__, wire_i) ) as number[];
        }
    } else {
        const lengths: number[]|number[][] =
            (ents_arrs as string[]).map( ents_arr => _length(__model__, ents_arr) ) as number[]|number[][];
        return uscore.flatten(lengths);
    }
}
function _edgeLength(__model__: Sim, edge_i: number): number {
    const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ENT_TYPE.EDGE, edge_i);
    const xyz_0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
    const xyz_1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[1]);
    return distance(xyz_0, xyz_1);
}
function _wireLength(__model__: Sim, wire_i: number): number {
    const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ENT_TYPE.WIRE, wire_i);
    let dist = 0;
    for (let i = 0; i < posis_i.length - 1; i++) {
        const xyz_0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[i]);
        const xyz_1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[i + 1]);
        dist += distance(xyz_0, xyz_1);
    }
    if (__model__.modeldata.geom.query.isWireClosed(wire_i)) {
        const xyz_0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[posis_i.length - 1]);
        const xyz_1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posis_i[0]);
        dist += distance(xyz_0, xyz_1);
    }
    return dist;
}
