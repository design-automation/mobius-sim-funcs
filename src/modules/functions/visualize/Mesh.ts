import {
    arrMakeFlat,
    EAttribDataTypeStrs,
    EAttribNames,
    EEntType,
    GIModel,
    idsBreak,
    isEmptyArr,
    TEntTypeIdx,
    TId,
    Txyz,
    vecNorm,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';
import { _EMeshMethod } from './_enum';


// ================================================================================================
/**
 * Controls how polygon meshes are visualized by creating normals on vertices.
 * \n
 * The method can either be 'faceted' or 'smooth'.
 * - 'faceted' means that the normal direction for each vertex will be perpendicular to the polygon to which it belongs.
 * - 'smooth' means that the normal direction for each vertex will be the average of all polygons welded to this vertex.
 * \n
 * @param entities Vertices belonging to polygons, or entities from which polygon vertices can be extracted.
 * @param method Enum, the types of normals to create: `'faceted'` or `'smooth'`.
 * @returns void
 */
export function Mesh(__model__: GIModel, entities: TId|TId[], method: _EMeshMethod): void {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return; }
    // --- Error Check ---
    const fn_name = 'visualize.Mesh';
    let ents_arr: TEntTypeIdx[] = null;
    if (__model__.debug) {
        if (entities !== null) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isIDL1], null) as TEntTypeIdx[];
        }
    } else {
        // if (entities !== null) {
        //     ents_arr = splitIDs(fn_name, 'entities', entities,
        //         [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // }
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    // Get the unique verts that belong to pgons
    let verts_i: number[] = [];
    if (ents_arr !== null) {
        const set_verts_i: Set<number> = new Set();
        for (const [ent_type, ent_i] of ents_arr) {
            if (ent_type === EEntType.VERT) {
                if (__model__.modeldata.geom.query.getTopoObjType(EEntType.VERT, ent_i) === EEntType.PGON) {
                    set_verts_i.add(ent_i);
                }
            } else if (ent_type === EEntType.POINT) {
                 // skip
            } else if (ent_type === EEntType.PLINE) {
                // skip
            } else if (ent_type === EEntType.PGON) {
                const ent_verts_i: number[] = __model__.modeldata.geom.nav.navAnyToVert(EEntType.PGON, ent_i);
                for (const ent_vert_i of ent_verts_i) {
                    set_verts_i.add(ent_vert_i);
                }
            } else if (ent_type === EEntType.COLL) {
                const coll_pgons_i: number[] = __model__.modeldata.geom.nav.navCollToPgon(ent_i);
                for (const coll_pgon_i of coll_pgons_i) {
                    const ent_verts_i: number[] = __model__.modeldata.geom.nav.navAnyToVert(EEntType.PGON, coll_pgon_i);
                    for (const ent_vert_i of ent_verts_i) {
                        set_verts_i.add(ent_vert_i);
                    }
                }
            }  else {
                const ent_verts_i: number[] = __model__.modeldata.geom.nav.navAnyToVert(ent_type, ent_i);
                for (const ent_vert_i of ent_verts_i) {
                    if (__model__.modeldata.geom.query.getTopoObjType(EEntType.VERT, ent_vert_i) === EEntType.PGON) {
                        set_verts_i.add(ent_vert_i);
                    }
                }
            }
        }
        verts_i = Array.from(set_verts_i);
    } else {
        verts_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, EEntType.VERT);
    }
    // calc vertex normals and set edge visibility
    switch (method) {
        case _EMeshMethod.FACETED:
            _meshFaceted(__model__, verts_i);
            break;
        case _EMeshMethod.SMOOTH:
            _meshSmooth(__model__, verts_i);
            break;
        default:
            break;
    }
}
function _meshFaceted(__model__: GIModel, verts_i: number[]): void {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, EAttribNames.NORMAL)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.VERT, EAttribNames.NORMAL, EAttribDataTypeStrs.LIST);
    }
    // get the polygons
    const map_vert_pgons: Map<number, number> = new Map();
    const set_pgons_i: Set<number> = new Set();
    for (const vert_i of verts_i) {
        const pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(EEntType.VERT, vert_i); // TODO optimize
        if (pgons_i.length === 1) { // one polygon
            map_vert_pgons.set(vert_i, pgons_i[0]);
            set_pgons_i.add(pgons_i[0]);
        }
    }
    // calc the normals one time
    const normals: Txyz[] = [];
    for (const pgon_i of Array.from(set_pgons_i)) {
        const normal: Txyz = __model__.modeldata.geom.query.getPgonNormal(pgon_i);
        normals[pgon_i] = normal;
    }
    // set the normal
    map_vert_pgons.forEach( (pgon_i, vert_i) => {
        const normal: Txyz = normals[pgon_i];
        __model__.modeldata.attribs.set.setEntAttribVal(EEntType.VERT, vert_i, EAttribNames.NORMAL, normal);
    });
}
function _meshSmooth(__model__: GIModel, verts_i: number[]): void {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, EAttribNames.NORMAL)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.VERT, EAttribNames.NORMAL, EAttribDataTypeStrs.LIST);
    }
    // get the polygons
    const map_posi_pgons: Map<number, number[]> = new Map();
    const set_pgons_i: Set<number> = new Set();
    const vert_to_posi: number[] = [];
    for (const vert_i of verts_i) {
        const posi_i: number = __model__.modeldata.geom.nav.navVertToPosi(vert_i);
        vert_to_posi[vert_i] = posi_i;
        if (!map_posi_pgons.has(posi_i)) {
            const posi_pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(EEntType.VERT, vert_i);
            map_posi_pgons.set(posi_i, posi_pgons_i);
            for (const posi_pgon_i of posi_pgons_i) {
                set_pgons_i.add(posi_pgon_i);
            }
        }
    }
    // calc all normals one time
    const normals: Txyz[] = [];
    for (const pgon_i of Array.from(set_pgons_i)) {
        const normal: Txyz = __model__.modeldata.geom.query.getPgonNormal(pgon_i);
        normals[pgon_i] = normal;
    }
    // set normals on all verts
    for (const vert_i of verts_i) {
        const posi_i: number = vert_to_posi[vert_i];
        let normal: Txyz = [0, 0, 0];
        const posi_pgons_i: number[] = map_posi_pgons.get(posi_i);
        for (const posi_pgon_i of posi_pgons_i) {
            normal = [
                normal[0] + normals[posi_pgon_i][0],
                normal[1] + normals[posi_pgon_i][1],
                normal[2] + normals[posi_pgon_i][2]
            ];
        }
        const div: number = posi_pgons_i.length;
        normal = [normal[0] / div, normal[1] / div, normal[2] / div];
        normal = vecNorm(normal);
        __model__.modeldata.attribs.set.setEntAttribVal(EEntType.VERT, vert_i, EAttribNames.NORMAL, normal);
    }
}
