"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._EColorRampMethod = exports.Gradient = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const chroma_js_1 = require("chroma-js");
const Mathjs = __importStar(require("mathjs"));
const _check_ids_1 = require("../../../_check_ids");
const chk = __importStar(require("../../../_check_types"));
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
function Gradient(__model__, entities, attrib, range, method) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    if (!(0, mobius_sim_1.isEmptyArr)(entities)) {
        // --- Error Check ---
        const fn_name = 'visualize.Gradient';
        let ents_arr = null;
        let attrib_name;
        let attrib_idx_or_key;
        if (__model__.debug) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1, _check_ids_1.ID.isIDL2], null);
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
                if (data_type !== mobius_sim_1.EAttribDataTypeStrs.NUMBER) {
                    throw new Error(fn_name + ': The attribute with name "' + attrib_name + '" is not a number data type.' +
                        'For generating a gradient, the attribute must be a number.');
                }
            }
        }
        else {
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            //     [IDcheckObj.isID, IDcheckObj.isIDList, IDcheckObj.isIDListOfLists], null) as TEntTypeIdx[];
            ents_arr = (0, mobius_sim_1.idsBreak)(entities);
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
exports.Gradient = Gradient;
// https://codesandbox.io/s/5w573r54w4
var _EColorRampMethod;
(function (_EColorRampMethod) {
    _EColorRampMethod["FALSE_COLOR"] = "false_color";
    _EColorRampMethod["BLACK_BODY"] = "black_body";
    _EColorRampMethod["WHITE_RED"] = "white_red";
    _EColorRampMethod["WHITE_GREEN"] = "white_green";
    _EColorRampMethod["WHITE_BLUE"] = "white_blue";
    _EColorRampMethod["BLUE_RED"] = "blue_red";
    _EColorRampMethod["GREEN_RED"] = "green_red";
    _EColorRampMethod["BLUE_GREEN"] = "blue_green";
    _EColorRampMethod["GREY_SCALE"] = "grey_scale";
    _EColorRampMethod["ORRD"] = "OrRd";
    _EColorRampMethod["PUBU"] = "PuBu";
    _EColorRampMethod["BUPU"] = "BuPu";
    _EColorRampMethod["ORANGES"] = "Oranges";
    _EColorRampMethod["BUGN"] = "BuGn";
    _EColorRampMethod["YLORBR"] = "YlOrBr";
    _EColorRampMethod["YLGN"] = "YlGn";
    _EColorRampMethod["REDS"] = "Reds";
    _EColorRampMethod["RDPU"] = "RdPu";
    _EColorRampMethod["GREENS"] = "Greens";
    _EColorRampMethod["YLGNBU"] = "YlGnBu";
    _EColorRampMethod["PURPLES"] = "Purples";
    _EColorRampMethod["GNBU"] = "GnBu";
    _EColorRampMethod["GREYS"] = "Greys";
    _EColorRampMethod["YLORRD"] = "YlOrRd";
    _EColorRampMethod["PURD"] = "PuRd";
    _EColorRampMethod["BLUES"] = "Blues";
    _EColorRampMethod["PUBUGN"] = "PuBuGn";
    _EColorRampMethod["VIRIDIS"] = "Viridis";
    _EColorRampMethod["SPECTRAL"] = "Spectral";
    _EColorRampMethod["RDYLGN"] = "RdYlGn";
    _EColorRampMethod["RDBU"] = "RdBu";
    _EColorRampMethod["PIYG"] = "PiYG";
    _EColorRampMethod["PRGN"] = "PRGn";
    _EColorRampMethod["RDYLBU"] = "RdYlBu";
    _EColorRampMethod["BRBG"] = "BrBG";
    _EColorRampMethod["RDGY"] = "RdGy";
    _EColorRampMethod["PUOR"] = "PuOr";
    _EColorRampMethod["SET2"] = "Set2";
    _EColorRampMethod["ACCENT"] = "Accent";
    _EColorRampMethod["SET1"] = "Set1";
    _EColorRampMethod["SET3"] = "Set3";
    _EColorRampMethod["DARK2"] = "Dark2";
    _EColorRampMethod["PAIRED"] = "Paired";
    _EColorRampMethod["PASTEL2"] = "Pastel2";
    _EColorRampMethod["PASTEL1"] = "Pastel1";
})(_EColorRampMethod = exports._EColorRampMethod || (exports._EColorRampMethod = {}));
function _gradient(__model__, ents_arr, attrib_name, idx_or_key, range, method) {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(mobius_sim_1.EEntType.VERT, mobius_sim_1.EAttribNames.COLOR)) {
        __model__.modeldata.attribs.add.addAttrib(mobius_sim_1.EEntType.VERT, mobius_sim_1.EAttribNames.COLOR, mobius_sim_1.EAttribDataTypeStrs.LIST);
    }
    // get the ents
    const first_ent_type = ents_arr[0][0];
    const ents_i = ents_arr.map(ent_arr => ent_arr[1]);
    // push the attrib down from the ent to its verts
    if (first_ent_type !== mobius_sim_1.EEntType.VERT) {
        __model__.modeldata.attribs.push.pushAttribVals(first_ent_type, attrib_name, idx_or_key, ents_i, mobius_sim_1.EEntType.VERT, attrib_name, null, mobius_sim_1.EAttribPush.AVERAGE);
    }
    // make a list of all the verts
    const all_verts_i = [];
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i] = ent_arr;
        if (ent_type === mobius_sim_1.EEntType.VERT) {
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
    const vert_values = __model__.modeldata.attribs.get.getEntAttribVal(mobius_sim_1.EEntType.VERT, all_verts_i, attrib_name);
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
    const col_scale = (0, chroma_js_1.scale)(scale);
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
        __model__.modeldata.attribs.set.setEntsAttribVal(mobius_sim_1.EEntType.VERT, verts_i, mobius_sim_1.EAttribNames.COLOR, col);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhZGllbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvdmlzdWFsaXplL0dyYWRpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFZdUM7QUFDdkMseUNBQWlEO0FBQ2pELCtDQUFpQztBQUVqQyxvREFBbUQ7QUFDbkQsMkRBQTZDO0FBRzdDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7R0FXRztBQUNILFNBQWdCLFFBQVEsQ0FBQyxTQUFrQixFQUFFLFFBQW1CLEVBQUUsTUFBZ0QsRUFDMUcsS0FBOEIsRUFBRSxNQUF5QjtJQUM3RCxRQUFRLEdBQUcsSUFBQSx3QkFBVyxFQUFDLFFBQVEsQ0FBVSxDQUFDO0lBQzFDLElBQUksQ0FBQyxJQUFBLHVCQUFVLEVBQUMsUUFBUSxDQUFDLEVBQUU7UUFDdkIsc0JBQXNCO1FBQ3RCLE1BQU0sT0FBTyxHQUFHLG9CQUFvQixDQUFDO1FBQ3JDLElBQUksUUFBUSxHQUFrQixJQUFJLENBQUM7UUFDbkMsSUFBSSxXQUFtQixDQUFDO1FBQ3hCLElBQUksaUJBQWdDLENBQUM7UUFDckMsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1lBQ2pCLFFBQVEsR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUN4RCxDQUFDLGVBQUUsQ0FBQyxJQUFJLEVBQUUsZUFBRSxDQUFDLE1BQU0sRUFBRSxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFrQixDQUFDO1lBQzVELEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQ25DLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzdDLEdBQUcsQ0FBQyxTQUFTLENB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