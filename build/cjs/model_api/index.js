"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelApi = void 0;
// functions used by mobius
const mobius_sim_1 = require("@design-automation/mobius-sim");
class ModelApi {
    // =============================================================================================
    // Constructor
    // =============================================================================================
    constructor(model) {
        this.__model__ = model;
    }
    // =============================================================================================
    // Attributes
    // =============================================================================================
    /**
     * hasModelAttrib
     * @param name
     * @returns
     */
    hasModelAttrib(name) {
        return this.__model__.modeldata.attribs.query.hasModelAttrib(name);
    }
    /**
     * getModelAttribVal
     * @param name
     * @returns
     */
    getModelAttribVal(name) {
        return this.__model__.modeldata.attribs.get.getModelAttribVal(name);
    }
    /**
     *
     * @param ent_type
     * @param name
     * @returns
     */
    hasAttrib(ent_type, name) {
        return this.__model__.modeldata.attribs.query.hasEntAttrib(ent_type, name);
    }
    /**
     * getAttribNames
     * @param ent_type
     * @returns
     */
    getAttribs(ent_type) {
        return this.__model__.modeldata.attribs.getAttribNames(ent_type);
    }
    /**
     * getEntAttribVal
     * @param ents
     * @param name
     * @returns
     */
    // getAttribVal(ents: TId|TId[], name: string): TAttribDataTypes|TAttribDataTypes[] {
    //     if (Array.isArray(ents)) {
    //         const ents_arr = idsBreak(ents) as TEntTypeIdx[];
    //         const values = [];
    //         for (const [ent_type, ent_i] of ents_arr) {
    //             const val = this.__model__.modeldata.attribs.get.getEntAttribVal(ent_type, ent_i, name);
    //             values.push(val);
    //         }
    //         return values;
    //     }
    //     const [ent_type, ent_i] = idsBreak(ents) as TEntTypeIdx;
    //     return this.__model__.modeldata.attribs.get.getEntAttribVal(ent_type, ent_i, name);
    // }
    getAttribVal(ent_type, ents_i, name) {
        if (Array.isArray(ents_i)) {
            const values = [];
            for (const ent_i of ents_i) {
                const val = this.__model__.modeldata.attribs.get.getEntAttribVal(ent_type, ent_i, name);
                values.push(val);
            }
            return values;
        }
        return this.__model__.modeldata.attribs.get.getEntAttribVal(ent_type, ents_i, name);
    }
    /**
     * getPosiCoords
     * @param posi_i
     * @returns
     */
    getPosiCoords(posi_i) {
        return this.__model__.modeldata.attribs.posis.getPosiCoords(posi_i);
    }
    /**
     * getVertCoords
     * @param vert_i
     * @returns
     */
    getVertCoords(vert_i) {
        return this.__model__.modeldata.attribs.posis.getVertCoords(vert_i);
    }
    // =============================================================================================
    // Entities
    // =============================================================================================
    /**
     * Return unique list of ents of target_ent_type
     * @param target_ent_type
     * @param ents
     */
    // getEnts(target_ent_type: EEntType, ents?: TId|TId[]): TId[] {
    //     if (ents === undefined) {
    //         const ents_i: number[] = this.__model__.modeldata.geom.query.getEnts(target_ent_type);
    //         return idsMakeFromIdxs(target_ent_type, ents_i) as TId[];
    //     }
    //     if (Array.isArray(ents)) {
    //         const set_ents_i: Set<number> = new Set();
    //         for (const ent of ents) {
    //             const [ent_type, ent_i] = idBreak(ent as TId);
    //             const ents_i: number[] = this.__model__.modeldata.geom.nav.navAnyToAny(ent_type, target_ent_type, ent_i);
    //             for (const ent_i of ents_i) {
    //                 set_ents_i.add(ent_i);
    //             }
    //         }
    //         return idsMakeFromIdxs(target_ent_type, Array.from(set_ents_i)) as TId[];
    //     }
    //     const [ent_type, ent_i] = idBreak(ents as TId);
    //     const ents_i: number[] = this.__model__.modeldata.geom.nav.navAnyToAny(ent_type, target_ent_type, ent_i);
    //     return idsMakeFromIdxs(ent_type, ents_i) as TId[];
    // }
    getEnts(target_ent_type, source_ent_type, source_ents_i) {
        console.log(">>>>>>>>>>>>>>>getEnts>>", this.__model__.modeldata.geom._geom_maps);
        if (source_ent_type === undefined) {
            return this.__model__.modeldata.geom.query.getEnts(target_ent_type);
        }
        if (!Array.isArray(source_ents_i)) {
            source_ents_i = [source_ents_i];
        }
        const set_ents_i = new Set();
        // target is triangles
        if (target_ent_type === mobius_sim_1.EEntType.TRI) {
            for (const source_ent_i of source_ents_i) {
                const pgons_i = this.__model__.modeldata.geom.nav.navAnyToAny(source_ent_type, mobius_sim_1.EEntType.PGON, source_ent_i);
                for (const pgon_i of pgons_i) {
                    const tris_i = this.__model__.modeldata.geom.nav_tri.navPgonToTri(pgon_i);
                    for (const tri_i of tris_i) {
                        set_ents_i.add(tri_i);
                    }
                }
            }
            return Array.from(set_ents_i);
        }
        // source is triangles
        if (source_ent_type === mobius_sim_1.EEntType.TRI) {
            for (const source_ent_i of source_ents_i) {
                let ents_i;
                if (target_ent_type === mobius_sim_1.EEntType.POSI) {
                    ents_i = this.__model__.modeldata.geom.nav_tri.navTriToPosi(source_ent_i);
                }
                else if (target_ent_type === mobius_sim_1.EEntType.VERT) {
                    ents_i = this.__model__.modeldata.geom.nav_tri.navTriToVert(source_ent_i);
                }
                else if (target_ent_type === mobius_sim_1.EEntType.PGON) {
                    ents_i = [this.__model__.modeldata.geom.nav_tri.navTriToPgon(source_ent_i)];
                }
                else if (target_ent_type === mobius_sim_1.EEntType.COLL) {
                    ents_i = this.__model__.modeldata.geom.nav_tri.navTriToColl(source_ent_i);
                }
                else {
                    const pgon_i = this.__model__.modeldata.geom.nav_tri.navTriToPgon(source_ent_i);
                    ents_i = this.__model__.modeldata.geom.nav.navAnyToAny(mobius_sim_1.EEntType.PGON, target_ent_type, pgon_i);
                }
                for (const ent_i of ents_i) {
                    set_ents_i.add(ent_i);
                }
            }
            return Array.from(set_ents_i);
        }
        // normal case
        for (const source_ent_i of source_ents_i) {
            const ents_i = this.__model__.modeldata.geom.nav.navAnyToAny(source_ent_type, target_ent_type, source_ent_i);
            for (const ent_i of ents_i) {
                set_ents_i.add(ent_i);
            }
        }
        return Array.from(set_ents_i);
    }
    /**
     * query.numEnts
     * @param ent_type
     * @returns
     */
    numEnts(ent_type) {
        return this.__model__.modeldata.geom.query.numEnts(ent_type);
    }
    /**
     * query.entExists
     * @param ent
     * @returns
     */
    // entExists(ent: TId): boolean {
    //     const [ent_type, ent_i] = idBreak(ent);
    //     return this.__model__.modeldata.geom.query.entExists(ent_type, ent_i);
    // }
    entExists(ent_type, ent_i) {
        return this.__model__.modeldata.geom.query.entExists(ent_type, ent_i);
    }
    // =============================================================================================
    // Snapshots
    // =============================================================================================
    /**
     * getActiveSnapshot
     * @returns
     */
    snapshotGetActive() {
        return this.__model__.getActiveSnapshot();
    }
    /**
     * nextSnapshot
     * @param include
     * @returns
     */
    snapshotNext(include) {
        return this.__model__.nextSnapshot(include);
    }
    /**
     * getEnts
     * @param ssid
     * @param ent_type
     * @returns
     */
    // snapshotGetEnts(ssid: number, ent_type: EEntType): TId[] {
    //     const ents_i: number[] = this.__model__.modeldata.geom.snapshot.getEnts(ssid, ent_type);
    //     return idsMakeFromIdxs(ent_type, ents_i) as TId[];
    // }
    snapshotGetEnts(ssid, ent_type) {
        return this.__model__.modeldata.geom.snapshot.getEnts(ssid, ent_type);
    }
    /**
     *
     * @param ssid
     * @param ent_type
     * @returns
     */
    snapshotNumEnts(ssid, ent_type) {
        return this.__model__.modeldata.geom.snapshot.numEnts(ssid, ent_type);
    }
    /**
     *
     * @param ssid
     * @param coll
     * @returns
     */
    // snapshotGetCollEnts(ssid: number, coll: TId, ent_type: EEntType): TId[] {
    //     const [_, coll_i] = idBreak(coll);
    //     let ents_i;
    //     if (ent_type === EEntType.PGON) {
    //         ents_i = this.__model__.modeldata.geom.nav_snapshot.navCollToPgon(ssid, coll_i);
    //     } else if (ent_type === EEntType.PLINE) {
    //         ents_i = this.__model__.modeldata.geom.nav_snapshot.navCollToPline(ssid, coll_i);
    //     } else if (ent_type === EEntType.POINT) {
    //         ents_i = this.__model__.modeldata.geom.nav_snapshot.navCollToPoint(ssid, coll_i);
    //     }
    //     return idsMakeFromIdxs(ent_type, ents_i) as TId[];
    // }
    snapshotGetCollEnts(ssid, coll_i, ent_type) {
        if (ent_type === mobius_sim_1.EEntType.PGON) {
            return this.__model__.modeldata.geom.nav_snapshot.navCollToPgon(ssid, coll_i);
        }
        else if (ent_type === mobius_sim_1.EEntType.PLINE) {
            return this.__model__.modeldata.geom.nav_snapshot.navCollToPline(ssid, coll_i);
        }
        else if (ent_type === mobius_sim_1.EEntType.POINT) {
            return this.__model__.modeldata.geom.nav_snapshot.navCollToPoint(ssid, coll_i);
        }
    }
    /**
     * prepGlobalFunc
     * TODO what does this return ?
     * @param gf_start_ids
     * @returns
     */
    snapshotPrepGlobalFunc(gf_start_ids) {
        return this.__model__.prepGlobalFunc(gf_start_ids);
    }
    /**
     * postGlobalFunc
     * @param curr_ss
     * @returns
     */
    snapshotPostGlobalFunc(curr_ss) {
        return this.__model__.postGlobalFunc(curr_ss);
    }
    // =============================================================================================
    // Viewer data
    // =============================================================================================
    /**
     * get3jsData
     * @param ssid
     * @returns
     */
    viewerGet3jsData(ssid) {
        return this.__model__.get3jsData(ssid);
    }
    // =============================================================================================
    // Table data
    // TODO simplify the table api
    // =============================================================================================
    /**
     * threejs.getEntsVals
     * @param ssid
     * @param selected_ents
     * @param ent_type
     * @returns
     */
    tableGetEntsVals(ssid, selected_ents, ent_type) {
        return this.__model__.modeldata.attribs.threejs.getEntsVals(ssid, selected_ents, ent_type);
    }
    /**
     * threejs.getAttribsForTable
     * @param ssid
     * @param ent_type
     * @returns
     */
    tableGetAttribs(ssid, ent_type) {
        return this.__model__.modeldata.attribs.threejs.getAttribsForTable(ssid, ent_type);
    }
    /**
     * threejs.getEntSubAttribsForTable
     * @param ssid
     * @param ent
     * @param level
     * @returns
     */
    // tableGetEntSubAttribs(ssid: number, ent: TId, level: EEntType): 
    //         Array<Map< string, TAttribDataTypes >> {
    //     const [ent_type, ent_i] = idBreak(ent);
    //     return this.__model__.modeldata.attribs.threejs.getEntSubAttribsForTable(
    //         ssid, ent_type, ent_i, level);
    // }
    tableGetEntSubAttribs(ssid, ent_type, ent_i, level) {
        return this.__model__.modeldata.attribs.threejs.getEntSubAttribsForTable(ssid, ent_type, ent_i, level);
    }
    /**
     * threejs.getModelAttribsForTable
     * @param ssid
     * @returns
     */
    tableGetModelAttribs(ssid) {
        return this.__model__.modeldata.attribs.threejs.getModelAttribsForTable(ssid);
    }
    /**
     * attribs_maps.get
     * @param ssid
     * @returns
     */
    tableGetAttribsMaps(ssid) {
        return this.__model__.modeldata.attribs.attribs_maps.get(ssid);
    }
    // =============================================================================================
    // Select entities
    // =============================================================================================
    /**
     *
     * @param ssid
     * @returns
     */
    getSelectedEnts(ssid) {
        return this.__model__.modeldata.geom.selected[ssid];
    }
    /**
     * Select entities in the model.
     * TODO Move this to mobius
     * @param __model__
     */
    selectEnts(ents_id, var_name) {
        // const start = performance.now();
        this.__model__.modeldata.geom.selected[this.__model__.getActiveSnapshot()] = [];
        const activeSelected = this.__model__.modeldata.geom.selected[this.__model__.getActiveSnapshot()];
        ents_id = ((Array.isArray(ents_id)) ? ents_id : [ents_id]);
        const [ents_id_flat, ents_indices] = _flatten(ents_id);
        const ents_arr = (0, mobius_sim_1.idsBreak)(ents_id_flat);
        const attrib_name = '_' + var_name;
        for (let i = 0; i < ents_arr.length; i++) {
            const ent_arr = ents_arr[i];
            const ent_indices = ents_indices[i];
            const attrib_value = var_name + '[' + ent_indices.join('][') + ']';
            activeSelected.push(ent_arr);
            if (!this.__model__.modeldata.attribs.query.hasEntAttrib(ent_arr[0], attrib_name)) {
                this.__model__.modeldata.attribs.add.addAttrib(ent_arr[0], attrib_name, mobius_sim_1.EAttribDataTypeStrs.STRING);
            }
            this.__model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_arr[0], ent_arr[1], attrib_name, attrib_value);
        }
    }
}
exports.ModelApi = ModelApi;
// Util TODO
function _flatten(arrs) {
    const arr_flat = [];
    const arr_indices = [];
    let count = 0;
    for (const item of arrs) {
        if (Array.isArray(item)) {
            const [arr_flat2, arr_indices2] = _flatten(item);
            for (let i = 0; i < arr_flat2.length; i++) {
                if (arr_flat.indexOf(arr_flat2[i]) !== -1) {
                    continue;
                }
                arr_flat.push(arr_flat2[i]);
                arr_indices2[i].unshift(count);
                arr_indices.push(arr_indices2[i]);
            }
        }
        else {
            arr_flat.push(item);
            arr_indices.push([count]);
        }
        count += 1;
    }
    return [arr_flat, arr_indices];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kZWxfYXBpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJCQUEyQjtBQUMzQiw4REFXcUM7QUFHckMsTUFBYSxRQUFRO0lBRWpCLGdHQUFnRztJQUNoRyxjQUFjO0lBQ2QsZ0dBQWdHO0lBQ2hHLFlBQVksS0FBYztRQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsZ0dBQWdHO0lBQ2hHLGFBQWE7SUFDYixnR0FBZ0c7SUFDaEc7Ozs7T0FJRztJQUNILGNBQWMsQ0FBQyxJQUFZO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUNEOzs7O09BSUc7SUFDSCxpQkFBaUIsQ0FBQyxJQUFZO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBQ0Q7Ozs7O09BS0c7SUFDSCxTQUFTLENBQUMsUUFBa0IsRUFBRSxJQUFZO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFDRDs7OztPQUlHO0lBQ0gsVUFBVSxDQUFDLFFBQWtCO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBQ0Q7Ozs7O09BS0c7SUFDSCxxRkFBcUY7SUFDckYsaUNBQWlDO0lBQ2pDLDREQUE0RDtJQUM1RCw2QkFBNkI7SUFD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