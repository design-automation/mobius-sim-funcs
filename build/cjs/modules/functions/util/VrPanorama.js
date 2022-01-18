"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VrPanorama = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const _check_types_1 = require("../../../_check_types");
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
function VrPanorama(__model__, point, back_url, back_rot, fore_url, fore_rot) {
    // --- Error Check ---
    const fn_name = 'util.vrPanorama';
    let ent_arr;
    if (__model__.debug) {
        ent_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'point', point, [_check_ids_1.ID.isID], [mobius_sim_1.EEntType.POINT]);
        (0, _check_types_1.checkArgs)(fn_name, 'back_url', back_url, [_check_types_1.isStr]);
        (0, _check_types_1.checkArgs)(fn_name, 'back_rot', back_rot, [_check_types_1.isNum, _check_types_1.isNull]);
        (0, _check_types_1.checkArgs)(fn_name, 'fore_url', fore_url, [_check_types_1.isStr, _check_types_1.isNull]);
        (0, _check_types_1.checkArgs)(fn_name, 'fore_rot', fore_rot, [_check_types_1.isNum, _check_types_1.isNull]);
    }
    else {
        ent_arr = (0, mobius_sim_1.idsBreak)(point);
    }
    // --- Error Check ---
    const ent_i = ent_arr[1];
    if (!__model__.modeldata.attribs.query.hasEntAttrib(mobius_sim_1.EEntType.POINT, "vr_hotspot")) {
        __model__.modeldata.attribs.add.addEntAttrib(mobius_sim_1.EEntType.POINT, "vr_hotspot", mobius_sim_1.EAttribDataTypeStrs.DICT);
    }
    let phs_dict = __model__.modeldata.attribs.get.getEntAttribVal(mobius_sim_1.EEntType.POINT, ent_i, "vr_hotspot");
    if (phs_dict === undefined) {
        phs_dict = {};
    }
    phs_dict["background_url"] = back_url;
    if (back_rot === null) {
        phs_dict["background_rotation"] = 0;
    }
    else {
        phs_dict["background_rotation"] = back_rot;
    }
    if (fore_url !== null) {
        phs_dict["foreground_url"] = fore_url;
        if (fore_rot === null) {
            phs_dict["foreground_rotation"] = phs_dict["background_rotation"];
        }
        else {
            phs_dict["foreground_rotation"] = fore_rot;
        }
    }
    __model__.modeldata.attribs.set.setEntAttribVal(mobius_sim_1.EEntType.POINT, ent_i, "vr_hotspot", phs_dict);
}
exports.VrPanorama = VrPanorama;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVnJQYW5vcmFtYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy91dGlsL1ZyUGFub3JhbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBQThHO0FBRTlHLG9EQUFtRDtBQUNuRCx3REFBd0U7QUFHeEUsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0YsU0FBZ0IsVUFBVSxDQUNuQixTQUFrQixFQUNsQixLQUFhLEVBQ2IsUUFBZ0IsRUFBRSxRQUFnQixFQUNsQyxRQUFnQixFQUFFLFFBQWdCO0lBRXRDLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQztJQUNsQyxJQUFJLE9BQW9CLENBQUM7SUFDekIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLE9BQU8sR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUNqRCxDQUFDLGVBQUUsQ0FBQyxJQUFJLENBQUMsRUFDVCxDQUFDLHFCQUFRLENBQUMsS0FBSyxDQUFDLENBQWdCLENBQUM7UUFDckMsSUFBQSx3QkFBUyxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsb0JBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEQsSUFBQSx3QkFBUyxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsb0JBQUssRUFBRSxxQkFBTSxDQUFDLENBQUMsQ0FBQztRQUMxRCxJQUFBLHdCQUFTLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxvQkFBSyxFQUFFLHFCQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFELElBQUEsd0JBQVMsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLG9CQUFLLEVBQUUscUJBQU0sQ0FBQyxDQUFDLENBQUM7S0FDN0Q7U0FBTTtRQUNILE9BQU8sR0FBRyxJQUFBLHFCQUFRLEVBQUMsS0FBSyxDQUFnQixDQUFDO0tBQzVDO0lBQ0Qsc0JBQXNCO0lBQ3RCLE1BQU0sS0FBSyxHQUFXLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxxQkFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsRUFBRTtRQUMvRSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLHFCQUFRLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxnQ0FBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4RztJQUNELElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMscUJBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3BHLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtRQUN4QixRQUFRLEdBQUcsRUFBRSxDQUFBO0tBQ2hCO0lBQ0QsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsUUFBUSxDQUFDO0lBQ3RDLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtRQUNuQixRQUFRLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDdkM7U0FBTTtRQUNILFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLFFBQVEsQ0FBQztLQUM5QztJQUNELElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtRQUNuQixRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDdEMsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO1lBQ25CLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQ3JFO2FBQU07WUFDSCxRQUFRLENBQUMscUJBQXFCLENBQUMsR0FBRyxRQUFRLENBQUM7U0FDOUM7S0FDSjtJQUNELFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMscUJBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuRyxDQUFDO0FBNUNBLGdDQTRDQSJ9