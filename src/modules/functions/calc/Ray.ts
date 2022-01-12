import {
    EEntType,
    getArrDepth,
    GIModel,
    idsBreak,
    isEmptyArr,
    TEntTypeIdx,
    TId,
    TPlane,
    TRay,
    Txyz,
    vecCross,
    vecSub,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../../_check_ids';
import { _getPlane } from './Plane';


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
 * Returns a ray for an edge or a polygons.
 *
 * For edges, it returns a ray along the edge, from the start vertex to the end vertex
 *
 * For a polygon, it returns the ray that is the z-axis of the plane.
 *
 * For an edge, the ray vector is not normalised. For a polygon, the ray vector is normalised.
 *
 * @param __model__
 * @param entities An edge, a wirea polygon, or a list.
 * @returns The ray.
 */
export function Ray(__model__: GIModel, entities: TId|TId[]): TRay|TRay[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Ray';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL1, ID.isIDL2], [EEntType.EDGE, EEntType.WIRE, EEntType.PLINE, EEntType.PGON]) as TEntTypeIdx|TEntTypeIdx[];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    return _getRay(__model__, ents_arr);
}
function _getRayFromEdge(__model__: GIModel, ent_arr: TEntTypeIdx): TRay {
    const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_arr[0], ent_arr[1]);
    const xyzs: Txyz[] = posis_i.map( posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i));
    return [xyzs[0], vecSub(xyzs[1], xyzs[0])];
}
function _getRayFromPgon(__model__: GIModel, ent_arr: TEntTypeIdx): TRay {
    const plane: TPlane = _getPlane(__model__, ent_arr) as TPlane;
    return rayFromPln(plane) as TRay;
}
function _getRayFromEdges(__model__: GIModel, ent_arr: TEntTypeIdx): TRay[] {
    const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_arr[0], ent_arr[1]);
    return edges_i.map( edge_i => _getRayFromEdge(__model__, [EEntType.EDGE, edge_i]) ) as TRay[];
}
function _getRay(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[]): TRay|TRay[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_arr: TEntTypeIdx = ents_arr as TEntTypeIdx;
        if (ent_arr[0] === EEntType.EDGE) {
            return _getRayFromEdge(__model__, ent_arr);
        } else if (ent_arr[0] === EEntType.PLINE || ent_arr[0] === EEntType.WIRE ) {
            return _getRayFromEdges(__model__, ent_arr);
        } else if (ent_arr[0] === EEntType.PGON) {
            return _getRayFromPgon(__model__, ent_arr);
        }
    } else {
        return (ents_arr as TEntTypeIdx[]).map( ent_arr => _getRay(__model__, ent_arr)) as TRay[];
    }
}
