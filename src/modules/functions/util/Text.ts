import { 
    EAttribDataTypeStrs,
    EEntType, 
    getArrDepth, 
    GIModel, 
    idsMake, 
    multMatrix, 
    TEntTypeIdx, 
    TId, 
    TPlane, 
    Txyz, 
    vecAdd, 
    xfromSourceTargetMatrix, 
    XYPLANE } from '@design-automation/mobius-sim';

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
export function Text(__model__: GIModel, text: string, origin: Txyz | TPlane, options: object): TId {
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
    let matrix: THREE.Matrix4;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin as TPlane);
    }
    // create positions
    const size: number = options["size"] === undefined ? 20 : options["size"];
    const xyzs: Txyz[] = [[0,0,0], [size * text.length * 0.6,0,0], [0,size * 0.6,0]];
    const posis: TEntTypeIdx[] = [];
    for (const xyz of xyzs) {
        const posi_i: number = __model__.modeldata.geom.add.addPosi();
        if (origin_is_plane) {
            __model__.modeldata.attribs.posis.setPosiCoords(posi_i, multMatrix(xyz, matrix));
        } else {
            __model__.modeldata.attribs.posis.setPosiCoords(posi_i, vecAdd(xyz, origin as Txyz));
        }
        posis.push([EEntType.POSI, posi_i]);
    }
    // TODO check that options is valid
    // create pgon
    const pgon: TEntTypeIdx = __model__.modeldata.funcs_make.polygon(posis) as TEntTypeIdx;
    // set attrib value
    options['text'] = text;
    if (__model__.modeldata.attribs.getAttrib(EEntType.PGON, 'text') === undefined) {
        __model__.modeldata.attribs.add.addEntAttrib(EEntType.PGON, 'text', EAttribDataTypeStrs.DICT);

    }
    __model__.modeldata.attribs.set.setEntAttribVal(EEntType.PGON, pgon[0][1], 'text', options);
    // return the pgon id
    return idsMake(pgon) as TId;
}
