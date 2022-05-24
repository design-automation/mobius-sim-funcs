import { GIModel, Txy, Txyz, vecRot } from '@design-automation/mobius-sim';

import { checkArgs, isNull, isNum, isXY } from '../../_check_types';



const requestedBytes = 1024 * 1024 * 200; // 200 MB local storage quota

// ================================================================================================
/**
 * Set the geolocation of the Cartesian coordinate system.
 * Does the same as the Geoalign function, but with alternate parameters.
 * \n
 * The Cartesian coordinate system is geolocated by defining two points:
 * - The latitude-longitude of the Cartesian origin.
 * - The counter-clockwise rotation around the Cartesian origin, in radians.
 * \n
 * @param __model__
 * @param lat_long Set the latitude and longitude of the origin of the Cartesian coordinate system. 
 * @param rot Set the counter-clockwise rotation of the Cartesian coordinate system, in radians.
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns void
 */
export function Geolocate(
    __model__: GIModel,
    lat_long: Txy,
    rot: number,
    elev: number
): void {
    // --- Error Check ---
    const fn_name = 'io.Geolocate';
    if (__model__.debug) {
        checkArgs(fn_name, 'lat_long_o', lat_long, [isXY, isNull]);
        checkArgs(fn_name, 'rot', elev, [isNum, isNull]);
        checkArgs(fn_name, 'elev', elev, [isNum, isNull]);
    }
    // --- Error Check ---
    const gl_dict = { "latitude": lat_long[0], "longitude": lat_long[1] };
    if (elev !== null) {
        gl_dict["elevation"] = elev;
    }
    __model__.modeldata.attribs.set.setModelAttribVal("geolocation", gl_dict);
    let n_vec: Txyz = [0, 1, 0];
    if (rot !== null) {
        n_vec = vecRot(n_vec, [0, 0, 1], -rot)
    }
    __model__.modeldata.attribs.set.setModelAttribVal("north", [n_vec[0], n_vec[1]]);
}
