import { Sim, ENT_TYPE } from '../../mobius_sim';
import { getArrDepth, isEmptyArr } from '../_common/_arrs';
// ================================================================================================
/**
 * Adds one or more new polygons to the model.
 *
 * @param __model__
 * @param entities List or nested lists of positions, or entities from which positions can be extracted.
 * @returns Entities, new polygon, or a list of new polygons.
 * @example `polygon1 = make.Polygon([pos1,pos2,pos3])`
 * @example_info Creates a polygon with vertices pos1, pos2, pos3 in sequence.
 * @example `polygons = make.Polygon([[pos1,pos2,pos3], [pos3,pos4,pos5]])`
 * @example_info Creates two polygons, the first with vertices at `[pos1,pos2,pos3]`, and the second
 * with vertices at `[pos3,pos4,pos5]`.
 */
export function Polygon(__model__: Sim, entities: string|string[]|string[][]): string|string[] {
    if (isEmptyArr(entities)) { return []; }
    // -----
    // const new_ents_arr: TEntTypeIdx[] = __model__.modeldata.funcs_make.polygon(ents_arr) as TEntTypeIdx[];
    // const depth: number = getArrDepth(ents_arr);
    // if (depth === 1 || (depth === 2 && ents_arr[0][0] === EEntType.POSI)) {
    //     const first_ent: TEntTypeIdx = new_ents_arr[0] as TEntTypeIdx;
    //     return idsMake(first_ent) as TId;
    // } else {
    //     return idsMake(new_ents_arr) as TId|TId[];
    // }
    const posis: string[][] = this._getPgonPosisFromEnts(entities);
    const pgons: string[] = this._polygons( posis );
    const depth: number = getArrDepth(entities);
    if (depth === 0 || (depth === 1 && entities[0] === ENT_TYPE.POSI)) {
        const first_ent: string = pgons[0] as string;
        return first_ent as string;
    } else {
        return pgons as string|string[];
    }
}
// =================================================================================================
function _polygons(__model__: Sim, posis_arr: string[]|string[][]): string|string[] {
    const depth: number = getArrDepth(posis_arr);
    if (depth === 1) {
        if (posis_arr.length < 3) {
            throw new Error('Error in make.Polygon: Polygons must have at least three positions.');
        }
        const posis_i: number[] = getEntIdxs(posis_arr as string[]);
        const pgon_i: number = this.modeldata.geom.add.addPgon(posis_i);
        return [ENT_TYPE.PGON, pgon_i] as string;
    } else {
        posis_arr = posis_arr as string[][];
        return posis_arr.map(ents_arr_item => this._polygon(ents_arr_item)) as string[];
    }
}
// =================================================================================================
function _getPgonPosisFromEnts( ents_arr: string|string[]|string[][]): string[][] {
    // check if this is a single object ID
    if (getArrDepth(ents_arr) === 1) {
        ents_arr = [ents_arr] as string[];
    }
    // check if this is a list of posis
    if (getArrDepth(ents_arr) === 2 && ents_arr[0][0] === ENT_TYPE.POSI) {
        // ents_arr =  [ents_arr] as string[][];
        const ents_arr2: string[] = [];
        for (const ent_arr of ents_arr) {
            const [ent_type, index]: string = ent_arr as string;
            if (ent_type === ENT_TYPE.POSI) {
                ents_arr2.push(ent_arr as string);
            } else {
                const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                for (const posi_i of posis_i) {
                    ents_arr2.push([ENT_TYPE.POSI, posi_i]);
                }
            }
        }
        ents_arr = [ents_arr2] as string[][];
    }
    // now process the ents
    const posis_arrs: string[][] = [];
    for (const ent_arr of ents_arr) {
        if (getArrDepth(ent_arr) === 2) { // this must be a list of posis
            posis_arrs.push(ent_arr as string[]);
            continue;
        }
        const [ent_type, index]: string = ent_arr as string;
        switch (ent_type) {
            case ENT_TYPE.WIRE:
            case ENT_TYPE.PLINE:
                const posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ent_type, index);
                const posis_arr: string[] = posis_i.map( posi_i => [ENT_TYPE.POSI, posi_i]) as string[];
                posis_arrs.push(posis_arr);
                break;
            case ENT_TYPE.PGON:
                const wires_i: number[] = this.modeldata.geom.nav.navAnyToWire(ent_type, index);
                for (let j = 0; j < wires_i.length; j++) {
                    const wire_i: number = wires_i[j];
                    const wire_posis_i: number[] = this.modeldata.geom.nav.navAnyToPosi(ENT_TYPE.WIRE, wire_i);
                    const wire_posis_arr: string[] = wire_posis_i.map( posi_i => [ENT_TYPE.POSI, posi_i]) as string[];
                    posis_arrs.push(wire_posis_arr);
                }
                break;
            default:
                break;
        }
    }
    return posis_arrs;
}
// =================================================================================================