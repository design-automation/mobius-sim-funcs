import {
    area,
    EEntType,
    getArrDepth,
    GIModel,
    idsBreak,
    isEmptyArr,
    TEntTypeIdx,
    TId,
    triangulate,
    Txyz,
} from '@design-automation/mobius-sim';
import uscore from 'underscore';

import { checkIDs, ID } from '../../_check_ids';



// ================================================================================================
/**
 * Calculates the area of en entity.
 * \n
 * The entity can be a polygon, a face, a closed polyline, a closed wire, or a collection.
 * \n
 * Given a list of entities, a list of areas are returned.
 *
 * @param __model__
 * @param entities Single or list of polygons, closed polylines, closed wires, collections.
 * @returns A number. Area or a list of areas.
 * @example `area1 = calc.Area (surface1)`
 */
export function Area(__model__: GIModel, entities: TId|TId[]): number|number[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Area';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL1],
        [EEntType.PGON, EEntType.PLINE, EEntType.WIRE, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    return _area(__model__, ents_arr);
}
function _area(__model__: GIModel, ents_arrs: TEntTypeIdx|TEntTypeIdx[]): number|number[] {
    if (getArrDepth(ents_arrs) === 1) {
        const [ent_type, ent_i]: [EEntType, number] = ents_arrs as TEntTypeIdx;
        if (ent_type === EEntType.PGON) {
            // faces, these are already triangulated
            const tris_i: number[] = __model__.modeldata.geom.nav_tri.navPgonToTri(ent_i);
            let total_area = 0;
            for (const tri_i of tris_i) {
                const corners_i: number[] = __model__.modeldata.geom.nav_tri.navTriToPosi(tri_i);
                if (corners_i.length !== 3) { continue; } // two or more verts have same posi, so area is 0
                const corners_xyzs: Txyz[] = corners_i.map(corner_i => __model__.modeldata.attribs.posis.getPosiCoords(corner_i));
                const tri_area: number = area( corners_xyzs[0], corners_xyzs[1], corners_xyzs[2] );
                total_area += tri_area;
            }
            return total_area;
        } else if (ent_type === EEntType.PLINE || ent_type === EEntType.WIRE) {
            // wires, these need to be triangulated
            let wire_i: number = ent_i;
            if (ent_type === EEntType.PLINE) {
                wire_i = __model__.modeldata.geom.nav.navPlineToWire(ent_i);
            }
            if (!__model__.modeldata.geom.query.isWireClosed(wire_i)) {
                throw new Error('To calculate area, wire must be closed');
            }
            const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.WIRE, ent_i);
            const xyzs:  Txyz[] = posis_i.map( posi_i => __model__.modeldata.attribs.posis.getPosiCoords(posi_i) );
            const tris: number[][] = triangulate(xyzs);
            let total_area = 0;
            for (const tri of tris) {
                const corners_xyzs: Txyz[] = tri.map(corner_i => xyzs[corner_i]);
                const tri_area: number = area( corners_xyzs[0], corners_xyzs[1], corners_xyzs[2] );
                total_area += tri_area;
            }
            return total_area;
        } else {
            return 0;
        }
    } else {
        const areas: number[]|number[][] =
            (ents_arrs as TEntTypeIdx[]).map( ents_arr => _area(__model__, ents_arr) ) as number[]|number[][];
        return uscore.flatten(areas);
    }
}
