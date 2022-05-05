import { getArrDepth, multMatrix, rotateMatrix, vecAng2, } from '@design-automation/mobius-sim';
import proj4 from 'proj4';
import { checkArgs, isNull, isNum, isXY } from '../../../_check_types';
const LONGLAT = [103.778329, 1.298759];
// ================================================================================================
/**
 * Transform a coordinate from latitude-longitude Geodesic coordinate to a Cartesian XYZ coordinate,
 * based on the geolocation of the model.
 *
 * @param __model__
 * @param lat_long Latitude and longitude coordinates.
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns XYZ coordinates
 */
export function LatLong2XYZ(__model__, lat_long, elev) {
    // --- Error Check ---
    const fn_name = 'util.LatLong2XYZ';
    if (__model__.debug) {
        checkArgs(fn_name, 'lat_long', lat_long, [isXY, isNull]);
        checkArgs(fn_name, 'elev', elev, [isNum, isNull]);
    }
    // --- Error Check ---
    const proj_obj = _createProjection(__model__);
    // calculate angle of rotation
    let rot_matrix = null;
    if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
        const north = __model__.modeldata.attribs.get.getModelAttribVal('north');
        if (Array.isArray(north)) {
            const rot_ang = vecAng2([0, 1, 0], [north[0], north[1], 0], [0, 0, 1]);
            rot_matrix = rotateMatrix([[0, 0, 0], [0, 0, 1]], rot_ang);
        }
    }
    // add feature
    let xyz = _xformFromLongLatToXYZ([lat_long[1], lat_long[0]], proj_obj, elev);
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
export function _xformFromLongLatToXYZ(long_lat_arr, proj_obj, elevation) {
    if (getArrDepth(long_lat_arr) === 1) {
        const long_lat = long_lat_arr;
        const xy = proj_obj.forward(long_lat);
        return [xy[0], xy[1], elevation];
    }
    else {
        long_lat_arr = long_lat_arr;
        const xyzs_xformed = [];
        for (const long_lat of long_lat_arr) {
            if (long_lat.length >= 2) {
                const xyz = _xformFromLongLatToXYZ(long_lat, proj_obj, elevation);
                xyzs_xformed.push(xyz);
            }
        }
        return xyzs_xformed;
    }
}
/**
 * TODO MEgre with io_geojson.ts
 * Get long lat, Detect CRS, create projection function
 * @param model The model.
 * @param point The features to add.
 */
export function _createProjection(model) {
    // create the function for transformation
    const proj_str_a = '+proj=tmerc +lat_0=';
    const proj_str_b = ' +lon_0=';
    const proj_str_c = '+k=1 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs';
    let longitude = LONGLAT[0];
    let latitude = LONGLAT[1];
    if (model.modeldata.attribs.query.hasModelAttrib('geolocation')) {
        const geolocation = model.modeldata.attribs.get.getModelAttribVal('geolocation');
        const long_value = geolocation['longitude'];
        if (typeof long_value !== 'number') {
            throw new Error('Longitude attribute must be a number.');
        }
        longitude = long_value;
        if (longitude < -180 || longitude > 180) {
            throw new Error('Longitude attribute must be between -180 and 180.');
        }
        const lat_value = geolocation['latitude'];
        if (typeof lat_value !== 'number') {
            throw new Error('Latitude attribute must be a number');
        }
        latitude = lat_value;
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
    const proj_obj = proj4(proj_from_str, proj_to_str);
    return proj_obj;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF0TG9uZzJYWVouanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvaW8vTGF0TG9uZzJYWVoudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFdBQVcsRUFFWCxVQUFVLEVBQ1YsWUFBWSxFQUlaLE9BQU8sR0FDVixNQUFNLCtCQUErQixDQUFDO0FBQ3ZDLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUcxQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFHdkUsTUFBTSxPQUFPLEdBQUcsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFdkMsbUdBQW1HO0FBQ25HOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxVQUFVLFdBQVcsQ0FDdkIsU0FBa0IsRUFDbEIsUUFBYSxFQUNiLElBQVk7SUFFWixzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsa0JBQWtCLENBQUM7SUFDbkMsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3pELFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ3JEO0lBQ0Qsc0JBQXNCO0lBQ3RCLE1BQU0sUUFBUSxHQUFvQixpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMvRCw4QkFBOEI7SUFDOUIsSUFBSSxVQUFVLEdBQVksSUFBSSxDQUFDO0lBQy9CLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUMzRCxNQUFNLEtBQUssR0FB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