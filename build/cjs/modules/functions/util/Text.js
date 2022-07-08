"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.Text = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const chk = __importStar(require("../../_check_types"));
// ================================================================================================
/**
 * Creates text
 * \n
 * Options can be null or can a dictionary that specifies text options. For example:
 * {
 *   'size': 60, // size of text
 *   'font': 'besley', // any of these 3 strings: "roboto", "besley", "opensans"
 *   'font_style': 'italic_bold', // accept any string containing any combination of these strings: "light"/"bold" & "italic"
 *   'color': [0.2, 1, 0] // array of 3 values from 0 to 1
 * }
 * @param __model__
 * @param text The text to create.
 * @origin
 * @options
 * @returns The ID of the text entity.
 * (The text is attached to a hidden polygon so the ID is a polygon ID.)
 */
function Text(__model__, text, origin, options) {
    options = options === null ? {} : options;
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'util.Text';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'text', text, [chk.isStr]);
        chk.checkArgs(fn_name, 'options', options, [chk.isDict]);
    }
    // --- Error Check ---
    // create the matrix one time
    let matrix;
    const origin_is_plane = (0, mobius_sim_1.getArrDepth)(origin) === 2;
    if (origin_is_plane) {
        matrix = (0, mobius_sim_1.xfromSourceTargetMatrix)(mobius_sim_1.XYPLANE, origin);
    }
    // create positions
    const size = options["size"] === undefined ? 20 : options["size"];
    const xyzs = [[0, 0, 0], [size * text.length * 0.6, 0, 0], [0, size * 0.6, 0]];
    const posis = [];
    for (const xyz of xyzs) {
        const posi_i = __model__.modeldata.geom.add.addPosi();
        if (origin_is_plane) {
            __model__.modeldata.attribs.posis.setPosiCoords(posi_i, (0, mobius_sim_1.multMatrix)(xyz, matrix));
        }
        else {
            __model__.modeldata.attribs.posis.setPosiCoords(posi_i, (0, mobius_sim_1.vecAdd)(xyz, origin));
        }
        posis.push([mobius_sim_1.EEntType.POSI, posi_i]);
    }
    // TODO check that options is valid
    // create pgon
    const pgon = __model__.modeldata.funcs_make.polygon(posis);
    // set attrib value
    options['text'] = text;
    if (__model__.modeldata.attribs.getAttrib(mobius_sim_1.EEntType.PGON, 'text') === undefined) {
        __model__.modeldata.attribs.add.addEntAttrib(mobius_sim_1.EEntType.PGON, 'text', mobius_sim_1.EAttribDataTypeStrs.DICT);
    }
    __model__.modeldata.attribs.set.setEntAttribVal(mobius_sim_1.EEntType.PGON, pgon[0][1], 'text', options);
    // return the pgon id
    return (0, mobius_sim_1.idsMake)(pgon);
}
exports.Text = Text;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy91dGlsL1RleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFhbUQ7QUFFbkQsd0RBQTBDO0FBQzFDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNILFNBQWdCLElBQUksQ0FBQyxTQUFrQixFQUFFLElBQVksRUFBRSxNQUFxQixFQUFFLE9BQWU7SUFDekYsT0FBTyxHQUFHLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQzFDLHNCQUFzQjtJQUN0QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNsRCxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDNUQ7SUFDRCxzQkFBc0I7SUFDdEIsNkJBQTZCO0lBQzdCLElBQUksTUFBcUIsQ0FBQztJQUMxQixNQUFNLGVBQWUsR0FBRyxJQUFBLHdCQUFXLEVBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xELElBQUksZUFBZSxFQUFFO1FBQ2pCLE1BQU0sR0FBRyxJQUFBLG9DQUF1QixFQUFDLG9CQUFPLEVBQUUsTUFBZ0IsQ0FBQyxDQUFDO0tBQy9EO0lBQ0QsbUJBQW1CO0lBQ25CLE1BQU0sSUFBSSxHQUFXLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFFLE1BQU0sSUFBSSxHQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxJQUFJLEdBQUcsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakYsTUFBTSxLQUFLLEdBQWtCLEVBQUUsQ0FBQztJQUNoQyxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtRQUNwQixNQUFNLE1BQU0sR0FBVyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDOUQsSUFBSSxlQUFlLEVBQUU7WUFDakIsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBQSx1QkFBVSxFQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ3BGO2FBQU07WUFDSCxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFBLG1CQUFNLEVBQUMsR0FBRyxFQUFFLE1BQWMsQ0FBQyxDQUFDLENBQUM7U0FDeEY7UUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMscUJBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUN2QztJQUNELG1DQUFtQztJQUNuQyxjQUFjO0lBQ2QsTUFBTSxJQUFJLEdBQWdCLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQWdCLENBQUM7SUFDdkYsbUJBQW1CO0lBQ25CLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDdkIsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMscUJBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssU0FBUyxFQUFFO1FBQzVFLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMscUJBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGdDQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0tBRWpHO0lBQ0QsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxxQkFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzVGLHFCQUFxQjtJQUNyQixPQUFPLElBQUEsb0JBQU8sRUFBQyxJQUFJLENBQVEsQ0FBQztBQUNoQyxDQUFDO0FBekNELG9CQXlDQyJ9