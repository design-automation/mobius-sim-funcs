"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mesh = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const _enum_1 = require("./_enum");
// ================================================================================================
/**
 * Controls how polygon meshes are visualized by creating normals on vertices.
 * \n
 * The method can either be 'faceted' or 'smooth'.
 * 'faceted' means that the normal direction for each vertex will be perpendicular to the polygon to which it belongs.
 * 'smooth' means that the normal direction for each vertex will be the average of all polygons welded to this vertex.
 * \n
 * @param entities Vertices belonging to polygons, or entities from which polygon vertices can be extracted.
 * @param method Enum, the types of normals to create, faceted or smooth.
 * @returns void
 */
function Mesh(__model__, entities, method) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return;
    }
    // --- Error Check ---
    const fn_name = 'visualize.Mesh';
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isIDL1], null);
        }
    }
    else {
        // if (entities !== null) {
        //     ents_arr = splitIDs(fn_name, 'entities', entities,
        //         [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // }
        ents_arr = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    // Get the unique verts that belong to pgons
    let verts_i = [];
    if (ents_arr !== null) {
        const set_verts_i = new Set();
        for (const [ent_type, ent_i] of ents_arr) {
            if (ent_type === mobius_sim_1.EEntType.VERT) {
                if (__model__.modeldata.geom.query.getTopoObjType(mobius_sim_1.EEntType.VERT, ent_i) === mobius_sim_1.EEntType.PGON) {
                    set_verts_i.add(ent_i);
                }
            }
            else if (ent_type === mobius_sim_1.EEntType.POINT) {
                // skip
            }
            else if (ent_type === mobius_sim_1.EEntType.PLINE) {
                // skip
            }
            else if (ent_type === mobius_sim_1.EEntType.PGON) {
                const ent_verts_i = __model__.modeldata.geom.nav.navAnyToVert(mobius_sim_1.EEntType.PGON, ent_i);
                for (const ent_vert_i of ent_verts_i) {
                    set_verts_i.add(ent_vert_i);
                }
            }
            else if (ent_type === mobius_sim_1.EEntType.COLL) {
                const coll_pgons_i = __model__.modeldata.geom.nav.navCollToPgon(ent_i);
                for (const coll_pgon_i of coll_pgons_i) {
                    const ent_verts_i = __model__.modeldata.geom.nav.navAnyToVert(mobius_sim_1.EEntType.PGON, coll_pgon_i);
                    for (const ent_vert_i of ent_verts_i) {
                        set_verts_i.add(ent_vert_i);
                    }
                }
            }
            else {
                const ent_verts_i = __model__.modeldata.geom.nav.navAnyToVert(ent_type, ent_i);
                for (const ent_vert_i of ent_verts_i) {
                    if (__model__.modeldata.geom.query.getTopoObjType(mobius_sim_1.EEntType.VERT, ent_vert_i) === mobius_sim_1.EEntType.PGON) {
                        set_verts_i.add(ent_vert_i);
                    }
                }
            }
        }
        verts_i = Array.from(set_verts_i);
    }
    else {
        verts_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, mobius_sim_1.EEntType.VERT);
    }
    // calc vertex normals and set edge visibility
    switch (method) {
        case _enum_1._EMeshMethod.FACETED:
            _meshFaceted(__model__, verts_i);
            break;
        case _enum_1._EMeshMethod.SMOOTH:
            _meshSmooth(__model__, verts_i);
            break;
        default:
            break;
    }
}
exports.Mesh = Mesh;
function _meshFaceted(__model__, verts_i) {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(mobius_sim_1.EEntType.VERT, mobius_sim_1.EAttribNames.NORMAL)) {
        __model__.modeldata.attribs.add.addAttrib(mobius_sim_1.EEntType.VERT, mobius_sim_1.EAttribNames.NORMAL, mobius_sim_1.EAttribDataTypeStrs.LIST);
    }
    // get the polygons
    const map_vert_pgons = new Map();
    const set_pgons_i = new Set();
    for (const vert_i of verts_i) {
        const pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(mobius_sim_1.EEntType.VERT, vert_i); // TODO optimize
        if (pgons_i.length === 1) { // one polygon
            map_vert_pgons.set(vert_i, pgons_i[0]);
            set_pgons_i.add(pgons_i[0]);
        }
    }
    // calc the normals one time
    const normals = [];
    for (const pgon_i of Array.from(set_pgons_i)) {
        const normal = __model__.modeldata.geom.query.getPgonNormal(pgon_i);
        normals[pgon_i] = normal;
    }
    // set the normal
    map_vert_pgons.forEach((pgon_i, vert_i) => {
        const normal = normals[pgon_i];
        __model__.modeldata.attribs.set.setEntAttribVal(mobius_sim_1.EEntType.VERT, vert_i, mobius_sim_1.EAttribNames.NORMAL, normal);
    });
}
function _meshSmooth(__model__, verts_i) {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(mobius_sim_1.EEntType.VERT, mobius_sim_1.EAttribNames.NORMAL)) {
        __model__.modeldata.attribs.add.addAttrib(mobius_sim_1.EEntType.VERT, mobius_sim_1.EAttribNames.NORMAL, mobius_sim_1.EAttribDataTypeStrs.LIST);
    }
    // get the polygons
    const map_posi_pgons = new Map();
    const set_pgons_i = new Set();
    const vert_to_posi = [];
    for (const vert_i of verts_i) {
        const posi_i = __model__.modeldata.geom.nav.navVertToPosi(vert_i);
        vert_to_posi[vert_i] = posi_i;
        if (!map_posi_pgons.has(posi_i)) {
            const posi_pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(mobius_sim_1.EEntType.VERT, vert_i);
            map_posi_pgons.set(posi_i, posi_pgons_i);
            for (const posi_pgon_i of posi_pgons_i) {
                set_pgons_i.add(posi_pgon_i);
            }
        }
    }
    // calc all normals one time
    const normals = [];
    for (const pgon_i of Array.from(set_pgons_i)) {
        const normal = __model__.modeldata.geom.query.getPgonNormal(pgon_i);
        normals[pgon_i] = normal;
    }
    // set normals on all verts
    for (const vert_i of verts_i) {
        const posi_i = vert_to_posi[vert_i];
        let normal = [0, 0, 0];
        const posi_pgons_i = map_posi_pgons.get(posi_i);
        for (const posi_pgon_i of posi_pgons_i) {
            normal = [
                normal[0] + normals[posi_pgon_i][0],
                normal[1] + normals[posi_pgon_i][1],
                normal[2] + normals[posi_pgon_i][2]
            ];
        }
        const div = posi_pgons_i.length;
        normal = [normal[0] / div, normal[1] / div, normal[2] / div];
        normal = (0, mobius_sim_1.vecNorm)(normal);
        __model__.modeldata.attribs.set.setEntAttribVal(mobius_sim_1.EEntType.VERT, vert_i, mobius_sim_1.EAttribNames.NORMAL, normal);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy92aXN1YWxpemUvTWVzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4REFZdUM7QUFFdkMsb0RBQW1EO0FBQ25ELG1DQUF1QztBQUd2QyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7R0FVRztBQUNILFNBQWdCLElBQUksQ0FBQyxTQUFrQixFQUFFLFFBQW1CLEVBQUUsTUFBb0I7SUFDOUUsUUFBUSxHQUFHLElBQUEsd0JBQVcsRUFBQyxRQUFRLENBQVUsQ0FBQztJQUMxQyxJQUFJLElBQUEsdUJBQVUsRUFBQyxRQUFRLENBQUMsRUFBRTtRQUFFLE9BQU87S0FBRTtJQUNyQyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsZ0JBQWdCLENBQUM7SUFDakMsSUFBSSxRQUFRLEdBQWtCLElBQUksQ0FBQztJQUNuQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO1lBQ25CLFFBQVEsR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUN4RCxDQUFDLGVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQWtCLENBQUM7U0FDM0M7S0FDSjtTQUFNO1FBQ0gsMkJBQTJCO1FBQzNCLHlEQUF5RDtRQUN6RCx5REFBeUQ7UUFDekQsSUFBSTtRQUNKLFFBQVEsR0FBRyxJQUFBLHFCQUFRLEVBQUMsUUFBUSxDQUFrQixDQUFDO0tBQ2xEO0lBQ0Qsc0JBQXNCO0lBQ3RCLDRDQUE0QztJQUM1QyxJQUFJLE9BQU8sR0FBYSxFQUFFLENBQUM7SUFDM0IsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO1FBQ25CLE1BQU0sV0FBVyxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQzNDLEtBQUssTUFBTSxDQUFDLFFBQVEsRUFB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