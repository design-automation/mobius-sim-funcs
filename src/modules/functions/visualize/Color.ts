import {
    arrMakeFlat,
    EAttribDataTypeStrs,
    EAttribNames,
    EEntType,
    GIModel,
    idsBreak,
    isEmptyArr,
    TColor,
    TEntTypeIdx,
    TId,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';


// ================================================================================================
/**
 * Sets color by creating a vertex attribute called 'rgb' and setting the value.
 * \n
 * See 
 * <a href="https://www.w3schools.com/colors/colors_rgb.asp?color=rgb(0,%200,%200)" target="_blank">w3schools</a>
 * for examples of RGB colors. To convert RGB(255, 255, 255) to RGB(1, 1, 1), enter vecDiv([`rgb_255_numbers`], 255).
 * @param entities The entities for which to set the color.
 * @param color The color, [0,0,0] is black, [1,1,1] is white. vecDiv([255, 255, 255], 255) is also white.
 * @returns void
 */
export function Color(__model__: GIModel, entities: TId|TId[], color: TColor): void {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return; }
    // --- Error Check ---
    const fn_name = 'visualize.Color';
    let ents_arr: TEntTypeIdx[] = null;
    if (__model__.debug) {
        if (entities !== null) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1, ID.isIDL2], null) as TEntTypeIdx[];
        }
        chk.checkArgs(fn_name, 'color', color, [chk.isColor]);
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    _color(__model__, ents_arr, color);
}
function _color(__model__: GIModel, ents_arr: TEntTypeIdx[], color: TColor): void {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.VERT, EAttribNames.COLOR)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.VERT, EAttribNames.COLOR, EAttribDataTypeStrs.LIST);
    }
    // make a list of all the verts
    let all_verts_i: number[] = [];
    if (ents_arr === null) {
        all_verts_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, EEntType.VERT);
    } else {
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
    }
    // set all verts to have same color
    __model__.modeldata.attribs.set.setEntsAttribVal(EEntType.VERT, all_verts_i, EAttribNames.COLOR, color);
}
