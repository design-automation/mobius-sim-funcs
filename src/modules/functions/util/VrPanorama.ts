/**
 * The `util` module has some utility functions used for debugging.
 * @module
 */
import { EAttribDataTypeStrs, EEntType, GIModel, idsBreak, TEntTypeIdx } from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../../_check_ids';
import { checkArgs, isNull, isNum, isStr } from '../../../_check_types';


// ================================================================================================
/**
 * Create a VR panorama hotspot. In the VR Viewer, you can teleport to such hotspots.When you enter
 * the hotspot, the panorama images will be loaded into the view. \n
 * @param __model__
 * @param point The point object to be used for creating a panorama. If this point is already
 * defined as a VR hotspot, then the panorama hotspot will inherit the name and camera angle.
 * @param back_url The URL of the 360 degree panorama image to be used for the background.
 * @param Back_rot The rotation of the background panorama image, in degrees, in the
 * counter-clockwise direction. If `null`, then rotation will be 0.
 * @param fore_url The URL of the 360 degree panorama image to be used for the foreground. If `null`
 * then no foreground image will be used.
 * @param fore_rot The rotation of the forground panorama image, in degrees, in the
 * counter-clockwise direction. If `null`, then the foreground rotation will be equal to the background rotation.
 * @returns void
 */
 export function VrPanorama(
        __model__: GIModel, 
        point: string,
        back_url: number, back_rot: number,
        fore_url: number, fore_rot: number
    ): void {
    // --- Error Check ---
    const fn_name = 'util.vrPanorama';
    let ent_arr: TEntTypeIdx;
    if (__model__.debug) {
        ent_arr = checkIDs(__model__, fn_name, 'point', point,
            [ID.isID],
            [EEntType.POINT]) as TEntTypeIdx;
        checkArgs(fn_name, 'back_url', back_url, [isStr]);
        checkArgs(fn_name, 'back_rot', back_rot, [isNum, isNull]);
        checkArgs(fn_name, 'fore_url', fore_url, [isStr, isNull]);
        checkArgs(fn_name, 'fore_rot', fore_rot, [isNum, isNull]);
    } else {
        ent_arr = idsBreak(point) as TEntTypeIdx;
    }
    // --- Error Check ---
    const ent_i: number = ent_arr[1];
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.POINT, "vr_hotspot")) {
        __model__.modeldata.attribs.add.addEntAttrib(EEntType.POINT, "vr_hotspot", EAttribDataTypeStrs.DICT);
    }
    let phs_dict = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.POINT, ent_i, "vr_hotspot");
    if (phs_dict === undefined) {
        phs_dict = {}
    }
    phs_dict["background_url"] = back_url;
    if (back_rot === null) {
        phs_dict["background_rotation"] = 0;
    } else {
        phs_dict["background_rotation"] = back_rot;
    }
    if (fore_url !== null) {
        phs_dict["foreground_url"] = fore_url;
        if (fore_rot === null) {
            phs_dict["foreground_rotation"] = phs_dict["background_rotation"];
        } else {
            phs_dict["foreground_rotation"] = fore_rot;
        }
    }
    __model__.modeldata.attribs.set.setEntAttribVal(EEntType.POINT, ent_i, "vr_hotspot", phs_dict);
}
