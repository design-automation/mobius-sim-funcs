"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VrHotspot = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const _check_types_1 = require("../../../_check_types");
// ================================================================================================
/**
 * Creta a VR hotspot. In the VR Viewer, you can teleport to such hotspots.
 * \n
 * @param __model__
 * @param point A point object to be used for creating hotspots.
 * @param name A name for the VR hotspots. If `null`, a default name will be created.
 * @param camera_rot The rotation of the camera direction when you teleport yo the hotspot. The
 * rotation is specified in degrees, in the counter-clockwise direction, starting from the Y axis.
 * If `null`, the camera rotation will default to 0.
 * @returns void
 */
function VrHotspot(__model__, point, name, camera_rot) {
    // --- Error Check ---
    const fn_name = 'util.vrHotspot';
    let ent_arr;
    if (__model__.debug) {
        ent_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'points', point, [_check_ids_1.ID.isID], [mobius_sim_1.EEntType.POINT]);
        (0, _check_types_1.checkArgs)(fn_name, 'name', name, [_check_types_1.isStr, _check_types_1.isNull]);
        (0, _check_types_1.checkArgs)(fn_name, 'camera_rot', camera_rot, [_check_types_1.isNum, _check_types_1.isNull]);
    }
    else {
        ent_arr = (0, mobius_sim_1.idsBreak)(point);
    }
    // --- Error Check ---
    const ent_i = ent_arr[1];
    if (!__model__.modeldata.attribs.query.hasEntAttrib(mobius_sim_1.EEntType.POINT, "vr_hotspot")) {
        __model__.modeldata.attribs.add.addEntAttrib(mobius_sim_1.EEntType.POINT, "vr_hotspot", mobius_sim_1.EAttribDataTypeStrs.DICT);
    }
    let hs_dict = __model__.modeldata.attribs.get.getEntAttribVal(mobius_sim_1.EEntType.POINT, ent_i, "vr_hotspot");
    if (hs_dict === undefined) {
        hs_dict = {};
    }
    if (name !== null) {
        hs_dict["name"] = name;
    }
    if (camera_rot !== null) {
        hs_dict["camera_rotation"] = camera_rot;
    }
    __model__.modeldata.attribs.set.setEntAttribVal(mobius_sim_1.EEntType.POINT, ent_i, "vr_hotspot", hs_dict);
}
exports.VrHotspot = VrHotspot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVnJIb3RzcG90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL3V0aWwvVnJIb3RzcG90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhEQUE4RztBQUU5RyxvREFBbUQ7QUFDbkQsd0RBQXdFO0FBR3hFLG1HQUFtRztBQUNuRzs7Ozs7Ozs7OztHQVVHO0FBQ0YsU0FBZ0IsU0FBUyxDQUNsQixTQUFrQixFQUNsQixLQUFhLEVBQ2IsSUFBWSxFQUNaLFVBQWtCO0lBRXRCLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQztJQUNqQyxJQUFJLE9BQW9CLENBQUM7SUFDekIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLE9BQU8sR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUNsRCxDQUFDLGVBQUUsQ0FBQyxJQUFJLENBQUMsRUFDVCxDQUFDLHFCQUFRLENBQUMsS0FBSyxDQUFDLENBQWdCLENBQUM7UUFDckMsSUFBQSx3QkFBUyxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsb0JBQUssRUFBRSxxQkFBTSxDQUFDLENBQUMsQ0FBQztRQUNsRCxJQUFBLHdCQUFTLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsQ0FBQyxvQkFBSyxFQUFFLHFCQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ2pFO1NBQU07UUFDSCxPQUFPLEdBQUcsSUFBQSxxQkFBUSxFQUFDLEtBQUssQ0FBZ0IsQ0FBQztLQUM1QztJQUNELHNCQUFzQjtJQUN0QixNQUFNLEtBQUssR0FBVyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMscUJBQVEsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLEVBQUU7UUFDL0UsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxxQkFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsZ0NBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDeEc7SUFDRCxJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLHFCQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNuRyxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7UUFDdkIsT0FBTyxHQUFHLEVBQUUsQ0FBQTtLQUNmO0lBQ0QsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO1FBQ2YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztLQUMxQjtJQUNELElBQUksVUFBVSxLQUFLLElBQUksRUFBRTtRQUNyQixPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxVQUFVLENBQUM7S0FDM0M7SUFDRCxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLHFCQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDbEcsQ0FBQztBQWxDQSw4QkFrQ0EifQ==