import { arrMakeFlat, EAttribDataTypeStrs, EAttribNames, EAttribPush, EEntType, idsBreak, isEmptyArr, } from '@design-automation/mobius-sim';
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
export function Gradient(__model__, entities, attrib, range, method) {
    entities = arrMakeFlat(entities);
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'visualize.Gradient';
        let ents_arr = null;
        let attrib_name;
        let attrib_idx_or_key;
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1, ID.isIDL2], null);
            chk.checkArgs(fn_name, 'attrib', attrib, [chk.isStr, chk.isStrStr, chk.isStrNum]);
            chk.checkArgs(fn_name, 'range', range, [chk.isNull, chk.isNum, chk.isNumL]);
            attrib_name = Array.isArray(attrib) ? attrib[0] : attrib;
            attrib_idx_or_key = Array.isArray(attrib) ? attrib[1] : null;
            if (!__model__.modeldata.attribs.query.hasEntAttrib(ents_arr[0][0], attrib_name)) {
                throw new Error(fn_name + ': The attribute with name "' + attrib + '" does not exist on these entities.');
            }
            else {
                let data_type = null;
                if (attrib_idx_or_key === null) {
                    data_type = __model__.modeldata.attribs.query.getAttribDataType(ents_arr[0][0], attrib_name);
                }
                else {
                    const first_val = __model__.modeldata.attribs.get.getEntAttribValOrItem(ents_arr[0][0], ents_arr[0][1], attrib_name, attrib_idx_or_key);
                }
                if (data_type !== EAttribDataTypeStrs.NUMBER) {
                    throw new Error(fn_name + ': The attribute with name "' + attrib_name + '" is not a number data type.' +
                        'For generating a gradient, the attribute must be a number.');
                }
            }
        }
        else {
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            //     [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDListOfLists], null) as TEntTypeIdx[];
            ents_arr = idsBreak(entities);
            attrib_name = Array.isArray(attrib) ? attrib[0] : attrib;
            attrib_idx_or_key = Array.isArray(attrib) ? attrib[1] : null;
        }
        // --- Error Check ---
        if (range === null) {
            range = [null, null];
        }
        range = Array.isArray(range) ? range : [0, range];
        _gradient(__model__, ents_arr, attrib_name, attrib_idx_or_key, range, method);
    }
}
function _gradient(__model__, ents_arr, attrib_name, idx_or_key, range, method) {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, EAttribNames.COLOR)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.VERT, EAttribNames.COLOR, EAttribDataTypeStrs.LIST);
    }
    // get the ents
    const first_ent_type = ents_arr[0][0];
    const ents_i = ents_arr.map(ent_arr => ent_arr[1]);
    // push the attrib down from the ent to its verts
    if (first_ent_type !== EEntType.VERT) {
        __model__.modeldata.attribs.push.pushAttribVals(first_ent_type, attrib_name, idx_or_key, ents_i, EEntType.VERT, attrib_name, null, EAttribPush.AVERAGE);
    }
    // make a list of all the verts
    const all_verts_i = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i] = ent_arr;
        if (ent_type === EEntType.VERT) {
            all_verts_i.push(ent_i);
        }
        else {
            const verts_i = __model__.modeldata.geom.nav.navAnyToVert(ent_type, ent_i);
            for (const vert_i of verts_i) {
                all_verts_i.push(vert_i);
            }
        }
    }
    // get the attribute values
    const vert_values = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.VERT, all_verts_i, attrib_name);
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
    let scale = null;
    if (method in scales) {
        scale = scales[method];
    }
    else {
        scale = method;
    }
    const col_scale = chromaScale(scale);
    const col_domain = col_scale.domain(range);
    // make a values map, grouping together all the verts that have the same value
    const values_map = new Map();
    for (let i = 0; i < all_verts_i.length; i++) {
        if (!values_map.has(vert_values[i])) {
            // const col: TColor = colFalse(vert_values[i], range[0], range[1]);
            const ch_col = col_domain(vert_values[i]).gl();
            const col = [ch_col[0], ch_col[1], ch_col[2]];
            values_map.set(vert_values[i], [col, [all_verts_i[i]]]);
        }
        else {
            values_map.get(vert_values[i])[1].push(all_verts_i[i]);
        }
    }
    // set color of each group of verts
    values_map.forEach((col_and_verts_i) => {
        const col = col_and_verts_i[0];
        const verts_i = col_and_verts_i[1];
        __model__.modeldata.attribs.set.setEntsAttribVal(EEntType.VERT, verts_i, EAttribNames.COLOR, col);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhZGllbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvdmlzdWFsaXplL0dyYWRpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxXQUFXLEVBQ1gsbUJBQW1CLEVBQ25CLFlBQVksRUFDWixXQUFXLEVBQ1gsUUFBUSxFQUVSLFFBQVEsRUFDUixVQUFVLEdBSWIsTUFBTSwrQkFBK0IsQ0FBQztBQUN2QyxPQUFPLEVBQUUsS0FBSyxJQUFJLFdBQVcsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNqRCxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUVqQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxHQUFHLE1BQU0sdUJBQXVCLENBQUM7QUFJN0MsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBTSxVQUFVLFFBQVEsQ0FBQyxTQUFrQixFQUFFLFFBQW1CLEVBQUUsTUFBZ0QsRUFDMUcsS0FBOEIsRUFBRSxNQUF5QjtJQUM3RCxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBVSxDQUFDO0lBQzFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDdkIsc0JBQXNCO1FBQ3RCLE1BQU0sT0FBTyxHQUFHLG9CQUFvQixDQUFDO1FBQ3JDLElBQUksUUFBUSxHQUFrQixJQUFJLENBQUM7UUFDbkMsSUFBSSxXQUFtQixDQUFDO1FBQ3hCLElBQUksaUJBQWdDLENBQUM7UUFDckMsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1lBQ2pCLFFBQVEsR0FBRyxRQUFRLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUN4RCxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFB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