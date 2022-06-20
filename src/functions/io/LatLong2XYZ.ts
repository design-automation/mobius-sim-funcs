import {
    getArrDepth,
    Sim,
    multMatrix,
    rotateMatrix,
    TAttribDataTypes,
    Txy,
    Txyz,
    vecAng2,
} from '../../mobius_sim';
import proj4 from 'proj4';
import { Matrix4 } from 'three';

import { checkArgs, isNull, isNum, isXY } from '../../_check_types';


const LONGLAT = [103.778329, 1.298759];

// ================================================================================================
/**
 * Transform a coordinate from latitude-longitude Geodesic coordinate to a Cartesian XYZ coordinate,
 * based on the geolocation of the model.
 *
 * @param __model__
 * @param lat_long Latitude and longitude coordinates. 
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns XYZ coordinates.
 */
export function LatLong2XYZ(
    __model__: Sim,
    lat_long: Txy,
    elev: number
): Txyz {
    // --- Error Check ---
    const fn_name = 'util.LatLong2XYZ';
    if (this.debug) {
        checkArgs(fn_name, 'lat_long', lat_long, [isXY, isNull]);
        checkArgs(fn_name, 'elev', elev, [isNum, isNull]);
    }
    // --- Error Check ---
    const proj_obj: proj4.Converter = _createProjection(__model__);
    // calculate angle of rotation
    let rot_matrix: Matrix4 = null;
    if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
        const north: Txy = __model__.modeldata.attribs.get.getModelAttribVal('north') as Txy;
        if (Array.isArray(north)) {
            const rot_ang: number = vecAng2([0, 1, 0], [north[0], north[1], 0], [0, 0, 1]);
            rot_matrix = rotateMatrix([[0, 0, 0], [0, 0, 1]], rot_ang);
        }
    }
    // add feature
    let xyz: Txyz = _xformFromLongLatToXYZ([lat_long[1], lat_long[0]], proj_obj, elev) as Txyz;
    // rotate to north
    if (rot_matrix !== null) {
        xyz = multMatrix(xyz, rot_matrix);
    }
    return xyz;

}
/**
 * TODO MEgre with io_geojson.ts
 * Converts geojson long lat to cartesian coords
 * @param long_lat_arr
 * @param elevation
 */
export function _xformFromLongLatToXYZ(
    long_lat_arr: [number, number] | [number, number][], proj_obj: proj4.Converter, elevation: number): Txyz | Txyz[] {
    if (getArrDepth(long_lat_arr) === 1) {
        const long_lat: [number, number] = long_lat_arr as [number, number];
        const xy: [number, number] = proj_obj.forward(long_lat);
        return [xy[0], xy[1], elevation];
    } else {
        long_lat_arr = long_lat_arr as [number, number][];
        const xyzs_xformed: Txyz[] = [];
        for (const long_lat of long_lat_arr) {
            if (long_lat.length >= 2) {
                const xyz: Txyz = _xformFromLongLatToXYZ(long_lat, proj_obj, elevation) as Txyz;
                xyzs_xformed.push(xyz);
            }
        }
        return xyzs_xformed as Txyz[];
    }
}
/**
 * TODO MEgre with io_geojson.ts
 * Get long lat, Detect CRS, create projection function
 * @param model The model.
 * @param point The features to add.
 */
 export function _createProjection(model: Sim): proj4.Converter {
    // create the function for transformation
    const proj_str_a = '+proj=tmerc +lat_0=';
    const proj_str_b = ' +lon_0=';
    const proj_str_c = '+k=1 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs';
    let longitude = LONGLAT[0];
    let latitude = LONGLAT[1];
    if (model.modeldata.attribs.query.hasModelAttrib('geolocation')) {
        const geolocation = model.modeldata.attribs.get.getModelAttribVal('geolocation');
        const long_value: TAttribDataTypes = geolocation['longitude'];
        if (typeof long_value !== 'number') {
            throw new Error('Longitude attribute must be a number.');
        }
        longitude = long_value as number;
        if (longitude < -180 || longitude > 180) {
            throw new Error('Longitude attribute must be between -180 and 180.');
        }
        const lat_value: TAttribDataTypes = geolocation['latitude'];
        if (typeof lat_value !== 'number') {
            throw new Error('Latitude attribute must be a number');
        }
        latitude = lat_value as number;
        if (latitude < 0 || latitude > 90) {
            throw new Error('Latitude attribute must be between 0 and 90.');
        }
    }
    // console.log("lat long", latitude, longitude);
    // try to figure out what the projection is of the source file
    // let proj_from_str = 'WGS84';
    // if (geojson_obj.hasOwnProperty('crs')) {
    //     if (geojson_obj.crs.hasOwnProperty('properties')) {
    //         if (geojson_obj.crs.properties.hasOwnProperty('name')) {
    //             const name: string = geojson_obj.crs.properties.name;
    //             const epsg_index = name.indexOf('EPSG');
    //             if (epsg_index !== -1) {
    //                 let epsg = name.slice(epsg_index);
    //                 epsg = epsg.replace(/\s/g, '+');
    //                 if (epsg === 'EPSG:4326') {
    //                     // do nothing, 'WGS84' is fine
    //                 } else if (['EPSG:4269', 'EPSG:3857', 'EPSG:3785', 'EPSG:900913', 'EPSG:102113'].indexOf(epsg) !== -1) {
    //                     // these are the epsg codes that proj4 knows
    //                     proj_from_str = epsg;
    //                 } else if (epsg === 'EPSG:3414') {
    //                     // singapore
    //                     proj_from_str =
    //                         '+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 ' +
    //                         '+ellps=WGS84 +units=m +no_defs';
    //                 }
    //             }
    //         }
    //     }
    // }
    // console.log('CRS of geojson data', proj_from_str);

    const proj_from_str = 'WGS84';
    const proj_to_str = proj_str_a + latitude + proj_str_b + longitude + proj_str_c;
    const proj_obj: proj4.Converter = proj4(proj_from_str, proj_to_str);
    return proj_obj;
}
