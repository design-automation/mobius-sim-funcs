// functions used by mobius
import { 
    GIModel, 
    EEntType, 
    TAttribDataTypes, 
    TId, 
    IAttribsMaps, 
    Txyz, 
    TEntTypeIdx, 
    idsBreak, 
    EAttribDataTypeStrs
} 
from '@design-automation/mobius-sim';
import { IThreeJS } from '@design-automation/mobius-sim/build/cjs/geo-info/ThreejsJSON';

export class ModelApi {
    __model__: GIModel
    // =============================================================================================
    // Constructor
    // =============================================================================================
    constructor(model: GIModel) {
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
    hasModelAttrib(name: string): boolean {
        return this.__model__.modeldata.attribs.query.hasModelAttrib(name);
    }
    /**
     * getModelAttribVal
     * @param name 
     * @returns 
     */
    getModelAttribVal(name: string): TAttribDataTypes  {
        return this.__model__.modeldata.attribs.get.getModelAttribVal(name);
    }
    /**
     * 
     * @param ent_type 
     * @param name 
     * @returns 
     */
    hasAttrib(ent_type: EEntType, name: string): boolean {
        return this.__model__.modeldata.attribs.query.hasEntAttrib(ent_type, name);
    }
    /**
     * getAttribNames
     * @param ent_type 
     * @returns 
     */
    getAttribs(ent_type: EEntType): string[] {
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
    getAttribVal(ent_type: EEntType, ents_i: number|number[], name: string): TAttribDataTypes|TAttribDataTypes[] {
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
    getPosiCoords(posi_i: number): Txyz {
        return this.__model__.modeldata.attribs.posis.getPosiCoords(posi_i);
    }
    /**
     * getVertCoords
     * @param vert_i 
     * @returns 
     */
    getVertCoords(vert_i: number): Txyz {
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
    getEnts(
        target_ent_type: EEntType, 
        source_ent_type?: EEntType, 
        source_ents_i?: number|number[]
    ): number[] {
        console.log(">>>>>>>>>>>>>>>getEnts>>", this.__model__.modeldata.geom._geom_maps)
        if (source_ent_type === undefined) {
            return this.__model__.modeldata.geom.query.getEnts(target_ent_type);
        }
        if (!Array.isArray(source_ents_i)) {
            source_ents_i = [source_ents_i];
        }
        const set_ents_i: Set<number> = new Set();
        // target is triangles
        if (target_ent_type === EEntType.TRI) {
            for (const source_ent_i of source_ents_i) {
                const pgons_i: number[] = this.__model__.modeldata.geom.nav.navAnyToAny(source_ent_type, EEntType.PGON, source_ent_i);
                for (const pgon_i of pgons_i) {
                    const tris_i: number[] = this.__model__.modeldata.geom.nav_tri.navPgonToTri(pgon_i);
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
                let ents_i: number[];
                if (target_ent_type === EEntType.POSI) {
                    ents_i = this.__model__.modeldata.geom.nav_tri.navTriToPosi(source_ent_i);
                } else if (target_ent_type === EEntType.VERT) {
                    ents_i = this.__model__.modeldata.geom.nav_tri.navTriToVert(source_ent_i);
                } else if (target_ent_type === EEntType.PGON) {
                    ents_i = [this.__model__.modeldata.geom.nav_tri.navTriToPgon(source_ent_i)];
                } else if (target_ent_type === EEntType.COLL) {
                    ents_i = this.__model__.modeldata.geom.nav_tri.navTriToColl(source_ent_i);
                } else {
                    const pgon_i: number = this.__model__.modeldata.geom.nav_tri.navTriToPgon(source_ent_i);
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
            const ents_i: number[] = this.__model__.modeldata.geom.nav.navAnyToAny(source_ent_type, target_ent_type, source_ent_i);
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
    numEnts(ent_type: EEntType): number {
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
    entExists(ent_type: EEntType, ent_i: number): boolean {
        return this.__model__.modeldata.geom.query.entExists(ent_type, ent_i);
    }
    // =============================================================================================
    // Snapshots
    // =============================================================================================
    /**
     * getActiveSnapshot
     * @returns 
     */
    snapshotGetActive(): number {
        return this.__model__.getActiveSnapshot();
    }
    /**
     * nextSnapshot
     * @param include 
     * @returns 
     */
    snapshotNext(include?: number[]): number {
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
    snapshotGetEnts(ssid: number, ent_type: EEntType): number[] {
        return this.__model__.modeldata.geom.snapshot.getEnts(ssid, ent_type);
    }
    /**
     * 
     * @param ssid
     * @param ent_type 
     * @returns 
     */
    snapshotNumEnts(ssid: number, ent_type: EEntType): number {
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
    snapshotGetCollEnts(ssid: number, coll_i: number, ent_type: EEntType): number[] {
        if (ent_type === EEntType.PGON) {
            return this.__model__.modeldata.geom.nav_snapshot.navCollToPgon(ssid, coll_i);
        } else if (ent_type === EEntType.PLINE) {
            return this.__model__.modeldata.geom.nav_snapshot.navCollToPline(ssid, coll_i);
        } else if (ent_type === EEntType.POINT) {
            return this.__model__.modeldata.geom.nav_snapshot.navCollToPoint(ssid, coll_i);
        }
    }
    /**
     * prepGlobalFunc
     * TODO what does this return ?
     * @param gf_start_ids 
     * @returns 
     */
    snapshotPrepGlobalFunc(gf_start_ids: TId|TId[]): number {
        return this.__model__.prepGlobalFunc(gf_start_ids);
    }
    /**
     * postGlobalFunc
     * @param curr_ss 
     * @returns 
     */
    snapshotPostGlobalFunc(curr_ss: number): void {
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
    viewerGet3jsData(ssid: number): IThreeJS {
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
    tableGetEntsVals(ssid: number, selected_ents: Map<string, number>, ent_type: EEntType): any[] {
        return this.__model__.modeldata.attribs.threejs.getEntsVals(ssid, selected_ents, ent_type);
    }
    /**
     * threejs.getAttribsForTable
     * @param ssid 
     * @param ent_type 
     * @returns 
     */
    tableGetAttribs(ssid: number, ent_type: EEntType): {data: any[], ents: number[]} {
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
    tableGetEntSubAttribs(ssid: number, ent_type: EEntType, ent_i: number, level: EEntType): 
            Array<Map< string, TAttribDataTypes >> {
        return this.__model__.modeldata.attribs.threejs.getEntSubAttribsForTable(
            ssid, ent_type, ent_i, level);
        }
    /**
     * threejs.getModelAttribsForTable
     * @param ssid 
     * @returns 
     */
    tableGetModelAttribs(ssid: number): any[] {
        return this.__model__.modeldata.attribs.threejs.getModelAttribsForTable(ssid);
    }
    /**
     * attribs_maps.get
     * @param ssid 
     * @returns 
     */
    tableGetAttribsMaps(ssid: number): IAttribsMaps {
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
    getSelectedEnts(ssid: number) {
        return this.__model__.modeldata.geom.selected[ssid];
    }
    /**
     * Select entities in the model.
     * TODO Move this to mobius
     * @param __model__
     */
    selectEnts(ents_id: TId|TId[]|TId[][], var_name: string): void {
        // const start = performance.now();
        this.__model__.modeldata.geom.selected[this.__model__.getActiveSnapshot()] = [];
        const activeSelected = this.__model__.modeldata.geom.selected[this.__model__.getActiveSnapshot()];
        ents_id = ((Array.isArray(ents_id)) ? ents_id : [ents_id]) as string[];
        const [ents_id_flat, ents_indices] = _flatten(ents_id);
        const ents_arr: TEntTypeIdx[] = idsBreak(ents_id_flat) as TEntTypeIdx[];
        const attrib_name: string = '_' + var_name;
        for (let i = 0; i < ents_arr.length; i++) {
            const ent_arr: TEntTypeIdx = ents_arr[i];
            const ent_indices: number[] = ents_indices[i];
            const attrib_value: string = var_name + '[' + ent_indices.join('][') + ']';
            activeSelected.push(ent_arr);
            if (!this.__model__.modeldata.attribs.query.hasEntAttrib(ent_arr[0], attrib_name)) {
                this.__model__.modeldata.attribs.add.addAttrib(ent_arr[0], attrib_name, EAttribDataTypeStrs.STRING);
            }
            this.__model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_arr[0], ent_arr[1], attrib_name, attrib_value);
        }
    }
}

// Util TODO
function _flatten(arrs: string|string[]|string[][]): [string[], number[][]] {
    const arr_flat: string[] = [];
    const arr_indices: number[][] = [];
    let count = 0;
    for (const item of arrs) {
        if (Array.isArray(item)) {
            const [arr_flat2, arr_indices2] = _flatten(item);
            for (let i = 0; i < arr_flat2.length; i++) {
                if (arr_flat.indexOf(arr_flat2[i]) !== -1) { continue; }
                arr_flat.push(arr_flat2[i]);
                arr_indices2[i].unshift(count);
                arr_indices.push(arr_indices2[i]);
            }
        } else {
            arr_flat.push(item);
            arr_indices.push([count]);
        }
        count += 1;
    }
    return [arr_flat, arr_indices];
}