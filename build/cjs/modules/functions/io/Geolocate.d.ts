import { GIModel, Txy } from '@design-automation/mobius-sim';
/**
 * Set the geolocation of the Cartesian coordinate system.
 *
 * @param __model__
 * @param lat_long Set the latitude and longitude of the origin of the Cartesian coordinate system.
 * @param rot Set the counter-clockwise rotation of the Cartesian coordinate system, in radians.
 * @param elev Set the elevation of the Cartesian coordinate system above the ground plane.
 * @returns void
 */
export declare function Geolocate(__model__: GIModel, lat_long: Txy, rot: number, elev: number): void;
