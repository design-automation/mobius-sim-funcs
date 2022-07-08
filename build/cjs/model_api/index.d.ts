import { GIModel, EEntType, TAttribDataTypes, TId, IAttribsMaps, Txyz } from '@design-automation/mobius-sim';
import { IThreeJS } from '@design-automation/mobius-sim/build/cjs/geo-info/ThreejsJSON';
export declare class ModelApi {
    __model__: GIModel;
    constructor(model: GIModel);
    /**
     * hasModelAttrib
     * @param name
     * @returns
     */
    hasModelAttrib(name: string): boolean;
    /**
     * getModelAttribVal
     * @param name
     * @returns
     */
    getModelAttribVal(name: string): TAttribDataTypes;
    /**
     *
     * @param ent_type
     * @param name
     * @returns
     */
    hasAttrib(ent_type: EEntType, name: string): boolean;
    /**
     * getAttribNames
     * @param ent_type
     * @returns
     */
    getAttribs(ent_type: EEntType): string[];
    /**
     * getEntAttribVal
     * @param ents
     * @param name
     * @returns
     */
    getAttribVal(ent_type: EEntType, ents_i: number | number[], name: string): TAttribDataTypes | TAttribDataTypes[];
    /**
     * getPosiCoords
     * @param posi_i
     * @returns
     */
    getPosiCoords(posi_i: number): Txyz;
    /**
     * getVertCoords
     * @param vert_i
     * @returns
     */
    getVertCoords(vert_i: number): Txyz;
    /**
     * Return unique list of ents of target_ent_type
     * @param target_ent_type
     * @param ents
     */
    getEnts(target_ent_type: EEntType, source_ent_type?: EEntType, source_ents_i?: number | number[]): number[];
    /**
     * query.numEnts
     * @param ent_type
     * @returns
     */
    numEnts(ent_type: EEntType): number;
    /**
     * query.entExists
     * @param ent
     * @returns
     */
    entExists(ent_type: EEntType, ent_i: number): boolean;
    /**
     * getActiveSnapshot
     * @returns
     */
    snapshotGetActive(): number;
    /**
     * nextSnapshot
     * @param include
     * @returns
     */
    snapshotNext(include?: number[]): number;
    /**
     * getEnts
     * @param ssid
     * @param ent_type
     * @returns
     */
    snapshotGetEnts(ssid: number, ent_type: EEntType): number[];
    /**
     *
     * @param ssid
     * @param ent_type
     * @returns
     */
    snapshotNumEnts(ssid: number, ent_type: EEntType): number;
    /**
     *
     * @param ssid
     * @param coll
     * @returns
     */
    snapshotGetCollEnts(ssid: number, coll_i: number, ent_type: EEntType): number[];
    /**
     * prepGlobalFunc
     * TODO what does this return ?
     * @param gf_start_ids
     * @returns
     */
    snapshotPrepGlobalFunc(gf_start_ids: TId | TId[]): number;
    /**
     * postGlobalFunc
     * @param curr_ss
     * @returns
     */
    snapshotPostGlobalFunc(curr_ss: number): void;
    /**
     * get3jsData
     * @param ssid
     * @returns
     */
    viewerGet3jsData(ssid: number): IThreeJS;
    /**
     * threejs.getEntsVals
     * @param ssid
     * @param selected_ents
     * @param ent_type
     * @returns
     */
    tableGetEntsVals(ssid: number, selected_ents: Map<string, number>, ent_type: EEntType): any[];
    /**
     * threejs.getAttribsForTable
     * @param ssid
     * @param ent_type
     * @returns
     */
    tableGetAttribs(ssid: number, ent_type: EEntType): {
        data: any[];
        ents: number[];
    };
    /**
     * threejs.getEntSubAttribsForTable
     * @param ssid
     * @param ent
     * @param level
     * @returns
     */
    tableGetEntSubAttribs(ssid: number, ent_type: EEntType, ent_i: number, level: EEntType): Array<Map<string, TAttribDataTypes>>;
    /**
     * threejs.getModelAttribsForTable
     * @param ssid
     * @returns
     */
    tableGetModelAttribs(ssid: number): any[];
    /**
     * attribs_maps.get
     * @param ssid
     * @returns
     */
    tableGetAttribsMaps(ssid: number): IAttribsMaps;
    /**
     *
     * @param ssid
     * @returns
     */
    getSelectedEnts(ssid: number): any;
    /**
     * Select entities in the model.
     * TODO Move this to mobius
     * @param __model__
     */
    selectEnts(ents_id: TId | TId[] | TId[][], var_name: string): void;
}
