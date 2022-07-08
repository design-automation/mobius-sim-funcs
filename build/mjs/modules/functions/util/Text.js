import { EAttribDataTypeStrs, EEntType, getArrDepth, idsMake, multMatrix, vecAdd, xfromSourceTargetMatrix, XYPLANE } from '@design-automation/mobius-sim';
import * as chk from '../../_check_types';
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
export function Text(__model__, text, origin, options) {
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
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin);
    }
    // create positions
    const size = options["size"] === undefined ? 20 : options["size"];
    const xyzs = [[0, 0, 0], [size * text.length * 0.6, 0, 0], [0, size * 0.6, 0]];
    const posis = [];
    for (const xyz of xyzs) {
        const posi_i = __model__.modeldata.geom.add.addPosi();
        if (origin_is_plane) {
            __model__.modeldata.attribs.posis.setPosiCoords(posi_i, multMatrix(xyz, matrix));
        }
        else {
            __model__.modeldata.attribs.posis.setPosiCoords(posi_i, vecAdd(xyz, origin));
        }
        posis.push([EEntType.POSI, posi_i]);
    }
    // TODO check that options is valid
    // create pgon
    const pgon = __model__.modeldata.funcs_make.polygon(posis);
    // set attrib value
    options['text'] = text;
    if (__model__.modeldata.attribs.getAttrib(EEntType.PGON, 'text') === undefined) {
        __model__.modeldata.attribs.add.addEntAttrib(EEntType.PGON, 'text', EAttribDataTypeStrs.DICT);
    }
    __model__.modeldata.attribs.set.setEntAttribVal(EEntType.PGON, pgon[0][1], 'text', options);
    // return the pgon id
    return idsMake(pgon);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy91dGlsL1RleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILG1CQUFtQixFQUNuQixRQUFRLEVBQ1IsV0FBVyxFQUVYLE9BQU8sRUFDUCxVQUFVLEVBS1YsTUFBTSxFQUNOLHVCQUF1QixFQUN2QixPQUFPLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUVuRCxPQUFPLEtBQUssR0FBRyxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNILE1BQU0sVUFBVSxJQUFJLENBQUMsU0FBa0IsRUFBRSxJQUFZLEVBQUUsTUFBcUIsRUFBRSxPQUFlO0lBQ3pGLE9BQU8sR0FBRyxPQUFPLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUMxQyxzQkFBc0I7SUFDdEIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQztRQUM1QixHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNqRSxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQzVEO0lBQ0Qsc0JBQXNCO0lBQ3RCLDZCQUE2QjtJQUM3QixJQUFJLE1BQXFCLENBQUM7SUFDMUIsTUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRCxJQUFJLGVBQWUsRUFBRTtRQUNqQixNQUFNLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxFQUFFLE1BQWdCLENBQUMsQ0FBQztLQUMvRDtJQUNELG1CQUFtQjtJQUNuQixNQUFNLElBQUksR0FBVyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxRSxNQUFNLElBQUksR0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsSUFBSSxHQUFHLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pGLE1BQU0sS0FBSyxHQUFrQixFQUFFLENBQUM7SUFDaEMsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDcEIsTUFBTSxNQUFNLEdBQVcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlELElBQUksZUFBZSxFQUFFO1lBQ2pCLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUNwRjthQUFNO1lBQ0gsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFjLENBQUMsQ0FBQyxDQUFDO1NBQ3hGO1FBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUN2QztJQUNELG1DQUFtQztJQUNuQyxjQUFjO0lBQ2QsTUFBTSxJQUFJLEdBQWdCLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQWdCLENBQUM7SUFDdkYsbUJBQW1CO0lBQ25CLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDdkIsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxTQUFTLEVBQUU7UUFDNUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUVqRztJQUNELFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzVGLHFCQUFxQjtJQUNyQixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQVEsQ0FBQztBQUNoQyxDQUFDIn0=