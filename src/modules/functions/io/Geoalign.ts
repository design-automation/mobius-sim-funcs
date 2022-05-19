import { GIModel, Txy, Txyz, vecAng2, vecFromTo, vecRot } from '@design-automation/mobius-sim';
import proj4 from 'proj4';

import { checkArgs, isNull, isNum, isXY } from '../../../_check_types';
import { _createProjection, _xformFromLongLatToXYZ } from './LatLong2XYZ';



// ================================================================================================
/**
 * Set the geolocation of the Cartesian coordinate system. 
 * Does the same as the Geolocate function, but with alternate parameters.
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
export function Geoalign(
    __model__: GIModel,
    lat_long_o: Txy,
    lat_long_x: Txy,
    elev: number
): void {
    // --- Error Check ---
    const fn_name = 'io.Geoalign';
    if (__model__.debug) {
        checkArgs(fn_name, 'lat_long_o', lat_long_o, [isXY, isNull]);
        checkArgs(fn_name, 'lat_long_x', lat_long_x, [isXY, isNull]);
        checkArgs(fn_name, 'elev', elev, [isNum, isNull]);
    }
    // --- Error Check ---
    const gl_dict = { "latitude": lat_long_o[0], "longitude": lat_long_o[1] };
    if (elev !== null) {
        gl_dict["elevation"] = elev;
    }
    __model__.modeldata.attribs.set.setModelAttribVal("geolocation", gl_dict);
    // calc
    const proj_obj: proj4.Converter = _createProjection(__model__);
    // origin
    let xyz_o: Txyz = _xformFromLongLatToXYZ([lat_long_o[1], lat_long_o[0]], proj_obj, 0) as Txyz;
    // point on x axis
    let xyz_x: Txyz = _xformFromLongLatToXYZ([lat_long_x[1], lat_long_x[0]], proj_obj, 0) as Txyz;
    // x axis vector
    const old_x_vec: Txyz = [1, 0, 0];
    const new_x_vec: Txyz = vecFromTo(xyz_o, xyz_x);
    const rot: number = vecAng2(old_x_vec, new_x_vec, [0, 0, 1]);
    // console.log("rot = ", rot, "x_vec = ", x_vec, xyz_o, xyz_x)
    // north vector
    const n_vec: Txyz = vecRot([0, 1, 0], [0, 0, 1], -rot);
    __model__.modeldata.attribs.set.setModelAttribVal("north", [n_vec[0], n_vec[1]]);
}


