"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Geoalign = void 0;
/**
 * The `io` module has functions for importing and exporting.
 * @module
 */
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_types_1 = require("../../../_check_types");
const LatLong2XYZ_1 = require("./LatLong2XYZ");
// ================================================================================================
/**
 * Set the geolocation of the Cartesian coordinate system.
 * \n
 * The Cartesian coordinate system is geolocated by defining two points:
 * - The latitude-longitude of the Cartesian origin.
 * - The latitude-longitude of a point on the positive Cartesian X-axis.
 * \n
 * @param __model__
 * @param lat_long_o Set the latitude and longitude of the origin of the Cartesian coordinate
 * system.
 * @param lat_long_x Set the latitude and longitude of a point on the x-axis of the Cartesian
 * coordinate system.
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns void
 */
function Geoalign(__model__, lat_long_o, lat_long_x, elev) {
    // --- Error Check ---
    const fn_name = 'io.Geoalign';
    if (__model__.debug) {
        (0, _check_types_1.checkArgs)(fn_name, 'lat_long_o', lat_long_o, [_check_types_1.isXY, _check_types_1.isNull]);
        (0, _check_types_1.checkArgs)(fn_name, 'lat_long_x', lat_long_x, [_check_types_1.isXY, _check_types_1.isNull]);
        (0, _check_types_1.checkArgs)(fn_name, 'elev', elev, [_check_types_1.isNum, _check_types_1.isNull]);
    }
    // --- Error Check ---
    const gl_dict = { "latitude": lat_long_o[0], "longitude": lat_long_o[1] };
    if (elev !== null) {
        gl_dict["elevation"] = elev;
    }
    __model__.modeldata.attribs.set.setModelAttribVal("geolocation", gl_dict);
    // calc
    const proj_obj = (0, LatLong2XYZ_1._createProjection)(__model__);
    // origin
    let xyz_o = (0, LatLong2XYZ_1._xformFromLongLatToXYZ)([lat_long_o[1], lat_long_o[0]], proj_obj, 0);
    // point on x axis
    let xyz_x = (0, LatLong2XYZ_1._xformFromLongLatToXYZ)([lat_long_x[1], lat_long_x[0]], proj_obj, 0);
    // x axis vector
    const old_x_vec = [1, 0, 0];
    const new_x_vec = (0, mobius_sim_1.vecFromTo)(xyz_o, xyz_x);
    const rot = (0, mobius_sim_1.vecAng2)(old_x_vec, new_x_vec, [0, 0, 1]);
    // console.log("rot = ", rot, "x_vec = ", x_vec, xyz_o, xyz_x)
    // north vector
    const n_vec = (0, mobius_sim_1.vecRot)([0, 1, 0], [0, 0, 1], -rot);
    __model__.modeldata.attribs.set.setModelAttribVal("north", [n_vec[0], n_vec[1]]);
}
exports.Geoalign = Geoalign;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VvYWxpZ24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvaW8vR2VvYWxpZ24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7OztHQUdHO0FBQ0gsOERBQStGO0FBRy9GLHdEQUF1RTtBQUN2RSwrQ0FBMEU7QUFHMUUsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsU0FBZ0IsUUFBUSxDQUNwQixTQUFrQixFQUNsQixVQUFlLEVBQ2YsVUFBZSxFQUNmLElBQVk7SUFFWixzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDO0lBQzlCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixJQUFBLHdCQUFTLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsQ0FBQyxtQkFBSSxFQUFFLHFCQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzdELElBQUEsd0JBQVMsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxDQUFDLG1CQUFJLEVBQUUscUJBQU0sQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBQSx3QkFBUyxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsb0JBQUssRUFBRSxxQkFBTSxDQUFDLENBQUMsQ0FBQztLQUNyRDtJQUNELHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzFFLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtRQUNmLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUM7S0FDL0I7SUFDRCxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFFLE9BQU87SUFDUCxNQUFNLFFBQVEsR0FBb0IsSUFBQSwrQkFBaUIsRUFBQyxTQUFTLENBQUMsQ0FBQztJQUMvRCxTQUFTO0lBQ1QsSUFBSSxLQUFLLEdBQVMsSUFBQSxvQ0FBc0IsRUFBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFTLENBQUM7SUFDOUYsa0JBQWtCO0lBQ2xCLElBQUksS0FBSyxHQUFTLElBQUEsb0NBQXNCLEVBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBUyxDQUFDO0lBQzlGLGdCQUFnQjtJQUNoQixNQUFNLFNBQVMsR0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbEMsTUFBTSxTQUFTLEdBQVMsSUFBQSxzQkFBUyxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRCxNQUFNLEdBQUcsR0FBVyxJQUFBLG9CQUFPLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RCw4REFBOEQ7SUFDOUQsZUFBZTtJQUNmLE1BQU0sS0FBSyxHQUFTLElBQUEsbUJBQU0sRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkQsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JGLENBQUM7QUFqQ0QsNEJBaUNDIn0=