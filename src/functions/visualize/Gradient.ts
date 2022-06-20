import {
    arrMakeFlat,
    EAttribDataTypeStrs,
    EAttribNames,
    EAttribPush,
    ENT_TYPE,
    Sim,
    idsBreak,
    isEmptyArr,
    TColor,
    string,
    string,
} from '../../mobius_sim';
import { scale as chromaScale } from 'chroma-js';
import * as Mathjs from 'mathjs';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../../_check_types';
import { _EColorRampMethod } from './_enum';


// ================================================================================================
/**
 * Generates a colour range based on a numeric attribute.
 * Sets the color by creating a vertex attribute called 'rgb' and setting the value.
 * \n
 * The available gradients are from <a href="https://colorbrewer2.org/">Color Brewer. </a>
 * If a custom gradient is desired, the inline expression `colScale()` can be used instead. 
 * Refer to its documentation for more information.
 * 
 * @param entities The entities for which to set the color.
 * @param attrib The numeric attribute to be used to create the gradient.
 * You can specify an attribute with an index. For example, ['xyz', 2] will create a gradient based on height.
 * @param range The range of the attribute. If a list of 2 numbers is input, [minimum, maximum].
 * If only one number, it defaults to [0, maximum]. If null, then the range will be auto-calculated.
 * @param method Enum, the colour gradient to use: `'false_color', 'black_body', 'white_red',
 * 'white_green', 'white_blue', 'blue_red', 'green_red', 'blue_green', 'grey_scale', 'OrRd', 'PuBu',
 * 'BuPu', 'Oranges', 'BuGn', 'YlOrBr', 'YlGn', 'Reds', 'RdPu', 'Greens', 'YlGnBu', 'Purples',
 * 'GnBu', 'Greys', 'YlOrRd', 'PuRd', 'Blues', 'PuBuGn', 'Viridis', 'Spectral', 'RdYlGn', 'RdBu',
 * 'PiYG', 'PRGn', 'RdYlBu', 'BrBG', 'RdGy', 'PuOr', 'Set2', 'Accent', 'Set1', 'Set3', 'Dark2',
 * 'Paired', 'Pastel2'` or `'Pastel1'`.
 * @returns void
 */
export function Gradient(__model__: Sim, entities: string|string[], attrib: string|[string, number]|[string, string],
        range: number|[number, number], method: _EColorRampMethod): void {
    entities = arrMakeFlat(entities) as string[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'visualize.Gradient';
        let ents_arr: string[] = null;
        let attrib_name: string;
        let attrib_idx_or_key: number|string;
        if (this.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1, ID.isIDL2], null) as string[];
            chk.checkArgs(fn_name, 'attrib', attrib,
                [chk.isStr, chk.isStrStr, chk.isStrNum]);
            chk.checkArgs(fn_name, 'range', range, [chk.isNull, chk.isNum, chk.isNumL]);
            attrib_name = Array.isArray(attrib) ? attrib[0] : attrib;
            attrib_idx_or_key = Array.isArray(attrib) ? attrib[1] : null;
            if (!__model__.modeldata.attribs.query.hasEntAttrib(ents_arr[0][0], attrib_name)) {
                throw new Error(fn_name + ': The attribute with name "' + attrib + '" does not exist on these entities.');
            } else {
                let data_type = null;
                if (attrib_idx_or_key === null) {
                    data_type = __model__.modeldata.attribs.query.getAttribDataType(ents_arr[0][0], attrib_name);
                } else {
                    const first_val = __model__.modeldata.attribs.get.getEntAttribValOrItem(
                        ents_arr[0][0], ents_arr[0][1], attrib_name, attrib_idx_or_key);
                }
                if (data_type !== EAttribDataTypeStrs.NUMBER) {
                    throw new Error(fn_name + ': The attribute with name "' + attrib_name + '" is not a number data type.' +
                    'For generating a gradient, the attribute must be a number.');
                }
            }
        } else {
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            //     [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDListOfLists], null) as string[];
            ents_arr = idsBreak(entities) as string[];
            attrib_name = Array.isArray(attrib) ? attrib[0] : attrib;
            attrib_idx_or_key = Array.isArray(attrib) ? attrib[1] : null;
        }
        // --- Error Check ---
        if (range === null) {
            range = [null, null];
        }
        range = Array.isArray(range) ? range : [0, range];
        _gradient(__model__, ents_arr, attrib_name, attrib_idx_or_key, range as [number, number], method);
    }
}
function _gradient(__model__: Sim, ents_arr: string[], attrib_name: string, idx_or_key: number|string, range: [number, number],
        method: _EColorRampMethod): void {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(ENT_TYPE.VERT, EAttribNames.COLOR)) {
        __model__.modeldata.attribs.add.addAttrib(ENT_TYPE.VERT, EAttribNames.COLOR, EAttribDataTypeStrs.LIST);
    }
    // get the ents
    const first_ent_type: number = ents_arr[0][0];
    const ents_i: number[] = ents_arr.map( ent_arr => ent_arr[1] );
    // push the attrib down from the ent to its verts
    if (first_ent_type !== ENT_TYPE.VERT) {
        __model__.modeldata.attribs.push.pushAttribVals(first_ent_type, attrib_name, idx_or_key, ents_i,
            ENT_TYPE.VERT, attrib_name, null, EAttribPush.AVERAGE);
    }
    // make a list of all the verts
    const all_verts_i: number[] = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i]: [number, number] = ent_arr as string;
        if (ent_type === ENT_TYPE.VERT) {
            all_verts_i.push(ent_i);
        } else {
            const verts_i: number[] = __model__.modeldata.geom.nav.navAnyToVert(ent_type, ent_i);
            for (const vert_i of verts_i) {
                all_verts_i.push(vert_i);
            }
        }
    }
    // get the attribute values
    const vert_values: number[] = __model__.modeldata.attribs.get.getEntAttribVal(ENT_TYPE.VERT, all_verts_i, attrib_name) as number[];
    // if range[0] is null, get min value
    if (range[0] === null) {
        range[0] = Mathjs.min(vert_values);
    }
    // if range[1] is null. get max value
    if (range[1] === null) {
        range[1] = Mathjs.max(vert_values);
    }
    // create color scale
    const scales = {
        'false_color': ['blue', 'cyan', 'green', 'yellow', 'red'],
        'black_body': ['black', 'red', 'yellow', 'white'],
        'white_red': ['white', 'red'],
        'white_blue': ['white', 'blue'],
        'white_green': ['white', 'green'],
        'blue_red': ['blue', 'red'],
        'green_red': ['green', 'red'],
        'blue_green': ['blue', 'green'],
        'grey_scale': ['white', 'black']
    };
    let scale: any = null;
    if (method in scales) {
        scale = scales[method];
    } else {
        scale = method;
    }
    const col_scale = chromaScale(scale);
    const col_domain  = col_scale.domain(range);

    // make a values map, grouping together all the verts that have the same value
    const values_map: Map<number, [TColor, number[]]> = new Map();
    for (let i = 0; i < all_verts_i.length; i++) {
        if (!values_map.has(vert_values[i])) {
            // const col: TColor = colFalse(vert_values[i], range[0], range[1]);
            const ch_col = col_domain(vert_values[i]).gl();
            const col: TColor = [ch_col[0], ch_col[1], ch_col[2]];
            values_map.set(vert_values[i], [col, [all_verts_i[i]]]);
        } else {
            values_map.get(vert_values[i])[1].push(all_verts_i[i]);
        }
    }
    // set color of each group of verts
    values_map.forEach((col_and_verts_i) => {
        const col: TColor = col_and_verts_i[0];
        const verts_i: number[] = col_and_verts_i[1];
        __model__.modeldata.attribs.set.setEntsAttribVal(ENT_TYPE.VERT, verts_i, EAttribNames.COLOR, col);
    });
}
