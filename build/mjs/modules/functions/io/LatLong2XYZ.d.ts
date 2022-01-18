import { GIModel, Txy, Txyz } from '@design-automation/mobius-sim';
import proj4 from 'proj4';
/**
 * Transform a coordinate from latitude-longitude Geodesic coordinate to a Cartesian XYZ coordinate,
 * based on the geolocation of the model.
 *
 * @param __model__
 * @param lat_long Latitude and longitude coordinates.
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns XYZ coordinates
 */
export declare function LatLong2XYZ(__model__: GIModel, lat_long: Txy, elev: number): Txyz;
/**
 * TODO MEgre with io_geojson.ts
 * Converts geojson long lat to cartesian coords
 * @param long_lat_arr
 * @param elevation
 */
export declare function _xformFromLongLatToXYZ(long_lat_arr: [number, number] | [number, number][], proj_obj: proj4.Converter, elevation: number): Txyz | Txyz[];
/**
 * TODO MEgre with io_geojson.ts
 * Get long lat, Detect CRS, create projection function
 * @param model The model.
 * @param point The features to add.
 */
export declare function _createProjection(model: GIModel): proj4.Converter;
