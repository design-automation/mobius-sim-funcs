// functions used by mobius
import { EEntType, idsBreak, EAttribDataTypeStrs } from '@design-automation/mobius-sim';
export class ModelApi {
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
        if (target_ent_type === EEntType.TRI) {
            for (const source_ent_i of source_ents_i) {
                const pgons_i = this.__model__.modeldata.geom.nav.navAnyToAny(source_ent_type, EEntType.PGON, source_ent_i);
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
        if (source_ent_type === EEntType.TRI) {
            for (const source_ent_i of source_ents_i) {
                let ents_i;
                if (target_ent_type === EEntType.POSI) {
                    ents_i = this.__model__.modeldata.geom.nav_tri.navTriToPosi(source_ent_i);
                }
                else if (target_ent_type === EEntType.VERT) {
                    ents_i = this.__model__.modeldata.geom.nav_tri.navTriToVert(source_ent_i);
                }
                else if (target_ent_type === EEntType.PGON) {
                    ents_i = [this.__model__.modeldata.geom.nav_tri.navTriToPgon(source_ent_i)];
                }
                else if (target_ent_type === EEntType.COLL) {
                    ents_i = this.__model__.modeldata.geom.nav_tri.navTriToColl(source_ent_i);
                }
                else {
                    const pgon_i = this.__model__.modeldata.geom.nav_tri.navTriToPgon(source_ent_i);
                    ents_i = this.__model__.modeldata.geom.nav.navAnyToAny(EEntType.PGON, target_ent_type, pgon_i);
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
        if (ent_type === EEntType.PGON) {
            return this.__model__.modeldata.geom.nav_snapshot.navCollToPgon(ssid, coll_i);
        }
        else if (ent_type === EEntType.PLINE) {
            return this.__model__.modeldata.geom.nav_snapshot.navCollToPline(ssid, coll_i);
        }
        else if (ent_type === EEntType.POINT) {
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
        const ents_arr = idsBreak(ents_id_flat);
        const attrib_name = '_' + var_name;
        for (let i = 0; i < ents_arr.length; i++) {
            const ent_arr = ents_arr[i];
            const ent_indices = ents_indices[i];
            const attrib_value = var_name + '[' + ent_indices.join('][') + ']';
            activeSelected.push(ent_arr);
            if (!this.__model__.modeldata.attribs.query.hasEntAttrib(ent_arr[0], attrib_name)) {
                this.__model__.modeldata.attribs.add.addAttrib(ent_arr[0], attrib_name, EAttribDataTypeStrs.STRING);
            }
            this.__model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_arr[0], ent_arr[1], attrib_name, attrib_value);
        }
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kZWxfYXBpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDJCQUEyQjtBQUMzQixPQUFPLEVBRUgsUUFBUSxFQU1SLFFBQVEsRUFDUixtQkFBbUIsRUFDdEIsTUFDSSwrQkFBK0IsQ0FBQztBQUdyQyxNQUFNLE9BQU8sUUFBUTtJQUVqQixnR0FBZ0c7SUFDaEcsY0FBYztJQUNkLGdHQUFnRztJQUNoRyxZQUFZLEtBQWM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNELGdHQUFnRztJQUNoRyxhQUFhO0lBQ2IsZ0dBQWdHO0lBQ2hHOzs7O09BSUc7SUFDSCxjQUFjLENBQUMsSUFBWTtRQUN2QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFDRDs7OztPQUlHO0lBQ0gsaUJBQWlCLENBQUMsSUFBWTtRQUMxQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUNEOzs7OztPQUtHO0lBQ0gsU0FBUyxDQUFDLFFBQWtCLEVBQUUsSUFBWTtRQUN0QyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNILFVBQVUsQ0FBQyxRQUFrQjtRQUN6QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUNEOzs7OztPQUtH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