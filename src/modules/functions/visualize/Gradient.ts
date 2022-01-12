import {
    arrMakeFlat,
    EAttribDataTypeStrs,
    EAttribNames,
    EAttribPush,
    EEntType,
    GIModel,
    idsBreak,
    isEmptyArr,
    TColor,
    TEntTypeIdx,
    TId,
} from '@design-automation/mobius-sim';
import { scale as chromaScale } from 'chroma-js';
import * as Mathjs from 'mathjs';

import { checkIDs, ID } from '../../../_check_ids';
import * as chk from '../../../_check_types';


// ================================================================================================
/**
 * Generates a colour range based on a numeric attribute.
 * Sets the color by creating a vertex attribute called 'rgb' and setting the value.
 * \n
 * @param entities The entities for which to set the color.
 * @param attrib The numeric attribute to be used to create the gradient.
 * You can spacify an attribute with an index. For example, ['xyz', 2] will create a gradient based on height.
 * @param range The range of the attribute, [minimum, maximum].
 * If only one number, it defaults to [0, maximum]. If null, then the range will be auto-calculated.
 * @param method Enum, the colour gradient to use.
 * @returns void
 */
export function Gradient(__model__: GIModel, entities: TId|TId[], attrib: string|[string, number]|[string, string],
        range: number|[number, number], method: _EColorRampMethod): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'visualize.Gradient';
        let ents_arr: TEntTypeIdx[] = null;
        let attrib_name: string;
        let attrib_idx_or_key: number|string;
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1, ID.isIDL2], null) as TEntTypeIdx[];
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
            //     [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDListOfLists], null) as TEntTypeIdx[];
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
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
// https://codesandbox.io/s/5w573r54w4
export enum _EColorRampMethod {
    FALSE_COLOR = 'false_color',
    BLACK_BODY = 'black_body',
    WHITE_RED = 'white_red',
    WHITE_GREEN = 'white_green',
    WHITE_BLUE = 'white_blue',
    BLUE_RED = 'blue_red',
    GREEN_RED = 'green_red',
    BLUE_GREEN = 'blue_green',
    GREY_SCALE = 'grey_scale',
    ORRD= 'OrRd',
    PUBU= 'PuBu',
    BUPU= 'BuPu',
    ORANGES= 'Oranges',
    BUGN= 'BuGn',
    YLORBR= 'YlOrBr',
    YLGN= 'YlGn',
    REDS= 'Reds',
    RDPU= 'RdPu',
    GREENS= 'Greens',
    YLGNBU= 'YlGnBu',
    PURPLES= 'Purples',
    GNBU= 'GnBu',
    GREYS= 'Greys',
    YLORRD= 'YlOrRd',
    PURD= 'PuRd',
    BLUES= 'Blues',
    PUBUGN= 'PuBuGn',
    VIRIDIS= 'Viridis',
    SPECTRAL= 'Spectral',
    RDYLGN= 'RdYlGn',
    RDBU= 'RdBu',
    PIYG= 'PiYG',
    PRGN= 'PRGn',
    RDYLBU= 'RdYlBu',
    BRBG= 'BrBG',
    RDGY= 'RdGy',
    PUOR= 'PuOr',
    SET2= 'Set2',
    ACCENT= 'Accent',
    SET1= 'Set1',
    SET3= 'Set3',
    DARK2= 'Dark2',
    PAIRED= 'Paired',
    PASTEL2= 'Pastel2',
    PASTEL1= 'Pastel1',
}
function _gradient(__model__: GIModel, ents_arr: TEntTypeIdx[], attrib_name: string, idx_or_key: number|string, range: [number, number],
        method: _EColorRampMethod): void {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, EAttribNames.COLOR)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.VERT, EAttribNames.COLOR, EAttribDataTypeStrs.LIST);
    }
    // get the ents
    const first_ent_type: number = ents_arr[0][0];
    const ents_i: number[] = ents_arr.map( ent_arr => ent_arr[1] );
    // push the attrib down from the ent to its verts
    if (first_ent_type !== EEntType.VERT) {
        __model__.modeldata.attribs.push.pushAttribVals(first_ent_type, attrib_name, idx_or_key, ents_i,
            EEntType.VERT, attrib_name, null, EAttribPush.AVERAGE);
    }
    // make a list of all the verts
    const all_verts_i: number[] = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i]: [number, number] = ent_arr as TEntTypeIdx;
        if (ent_type === EEntType.VERT) {
            all_verts_i.push(ent_i);
        } else {
            const verts_i: number[] = __model__.modeldata.geom.nav.navAnyToVert(ent_type, ent_i);
            for (const vert_i of verts_i) {
                all_verts_i.push(vert_i);
            }
        }
    }
    // get the attribute values
    const vert_values: number[] = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.VERT, all_verts_i, attrib_name) as number[];
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
        __model__.modeldata.attribs.set.setEntsAttribVal(EEntType.VERT, verts_i, EAttribNames.COLOR, col);
    });
}
