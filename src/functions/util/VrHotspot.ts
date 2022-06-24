import { EAttribDataTypeStrs, ENT_TYPE, Sim, idsBreak, string } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import { checkArgs, isNull, isNum, isStr } from '../../_check_types';


// ================================================================================================
/**
 * Creta a VR hotspot. In the VR Viewer, you can teleport to such hotspots.
 * \n
 * @param __model__
 * @param point A point object to be used for creating hotspots.
 * @param name A name for the VR hotspots. If `null`, a default name will be created.
 * @param camera_rot The rotation of the camera direction when you teleport to the hotspot. The
 * rotation is specified in degrees, in the counter-clockwise direction, starting from the Y axis.
 * If `null`, the camera rotation will default to 0.
 * @returns void
 */
 export function VrHotspot(
        __model__: Sim, 
        point: string,
        name: string,
        camera_rot: number
    ): void {
    // // --- Error Check ---
    // const fn_name = 'util.vrHotspot';
    // let ent_arr: string;
    // if (this.debug) {
    //     ent_arr = checkIDs(__model__, fn_name, 'points', point,
    //         [ID.isID],
    //         [ENT_TYPE.POINT]) as string;
    //     checkArgs(fn_name, 'name', name, [isStr, isNull]);
    //     checkArgs(fn_name, 'camera_rot', camera_rot, [isNum, isNull]);
    // } else {
    //     ent_arr = idsBreak(point) as string;
    // }
    // // --- Error Check ---
    const ent_i: number = ent_arr[1];
    if (!__model__.modeldata.attribs.query.hasEntAttrib(ENT_TYPE.POINT, "vr_hotspot")) {
        __model__.modeldata.attribs.add.addEntAttrib(ENT_TYPE.POINT, "vr_hotspot", EAttribDataTypeStrs.DICT);
    }
    let hs_dict = __model__.modeldata.attribs.get.getEntAttribVal(ENT_TYPE.POINT, ent_i, "vr_hotspot");
    if (hs_dict === undefined) {
        hs_dict = {}
    }
    if (name !== null) {
        hs_dict["name"] = name;
    }
    if (camera_rot !== null) {
        hs_dict["camera_rotation"] = camera_rot;
    }
    __model__.modeldata.attribs.set.setEntAttribVal(ENT_TYPE.POINT, ent_i, "vr_hotspot", hs_dict);
}
