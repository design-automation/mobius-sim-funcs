import { EAttribDataTypeStrs, Sim, idsBreak, string } from '../../mobius_sim';


// ================================================================================================
/**
 * Select entities in the model.
 *
 * @param __model__
 * @param entities The entities to be selected. 
 * @returns void
 */
export function Select(__model__: Sim, entities: string|string[]|string[][]): void {
    __model__.modeldata.geom.selected[__model__.getActiveSnapshot()] = [];
    const activeSelected = __model__.modeldata.geom.selected[__model__.getActiveSnapshot()];
    entities = ((Array.isArray(entities)) ? entities : [entities]) as string[];
    const [ents_id_flat, ents_indices] = _flatten(entities);
    const ents_arr: string[] = idsBreak(ents_id_flat) as string[];
    const attrib_name = '_selected';
    for (let i = 0; i < ents_arr.length; i++) {
        const ent_arr: string = ents_arr[i];
        const ent_indices: number[] = ents_indices[i];
        const attrib_value: string = 'selected[' + ent_indices.join('][') + ']';
        activeSelected.push(ent_arr);
        if (!__model__.modeldata.attribs.query.hasEntAttrib(ent_arr[0], attrib_name)) {
            __model__.modeldata.attribs.add.addAttrib(ent_arr[0], attrib_name, EAttribDataTypeStrs.STRING);
        }
        __model__.modeldata.attribs.set.setCreateEntsAttribVal(ent_arr[0], ent_arr[1], attrib_name, attrib_value);
    }
}
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
