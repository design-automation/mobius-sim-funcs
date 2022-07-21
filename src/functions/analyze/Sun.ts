import {
    arrMakeFlat,
    createSingleMeshBufTjs,
    EEntType,
    GIModel,
    idsBreak,
    TEntTypeIdx,
    TId,
    TPlane,
    TRay,
    Txy,
    Txyz,
    vecAdd,
    vecDot,
    vecMult,
} from '@design-automation/mobius-sim';
import * as THREE from 'three';
import lodash from 'lodash';
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { _ESolarMethod } from './_enum';
import { _calcExposure, _calcMaxExposure, _getSensorRays, _solarRaysDirect, _solarRaysIndirect } from './_shared';
const EPS = 1e-6;
// =================================================================================================
interface TExposure {
    exposure: number[];
}
// =================================================================================================
/**
 * Calculate an approximation of the solar exposure factor, for a set sensors positioned at specfied
 * locations.
 * The solar exposure factor for each sensor is a value between 0 and 1, where 0 means that it has 
 * no exposure
 * and 1 means that it has maximum exposure.
 * \n
 * The calculation takes into account the geolocation and the north direction of the model.
 * Geolocation is specified by a model attributes as follows:
 *  - @geolocation={'longitude':123,'latitude':12}.
 * North direction is specified by a model attribute as follows, using a vector:
 *  - @north==[1,2]
 * If no north direction is specified, then [0,1] is the default (i.e. north is in the direction of 
 * the y-axis);
 * \n
 * Each sensor has a location and direction, specified using either rays or planes.
 * The direction of the sensor specifies what is infront and what is behind the sensor.
 * For each sensor, only exposure infront of the sensor is calculated.
 * \n
 * The exposure is calculated by shooting rays in reverse.
 * from the sensor origin to a set of points on the sky dome.
 * If the rays hits an obstruction, then the sky dome is obstructed..
 * If the ray hits no obstructions, then the sky dome is not obstructed.
 * \n
 * The exposure factor at each sensor point is calculated as follows:
 * 1. Shoot rays to all sky dome points.
 * 2. If the ray hits an obstruction, assign a wight of 0 to that ray.
 * 3. If a ray does not hit any obstructions, assign a weight between 0 and 1, depending on the 
 * incidence angle.
 * 4. Calculate the total solar expouse by adding up the weights for all rays.
 * 5. Divide by the maximum possible solar exposure for an unobstructed sensor.
 * \n
 * The solar exposure calculation takes into account the angle of incidence of the sun ray to the 
 * sensor direction.
 * Sun rays that are hitting the sensor straight on are assigned a weight of 1.
 * Sun rays that are hitting the sensor at an oblique angle are assigned a weight equal to the 
 * cosine of the angle.
 * \n
 * If 'direct\_exposure' is selected, then the points on the sky dome will follow the path of the 
 * sun throughout the year.
 * If 'indirect\_exposure' is selected, then the points on the sky dome will consist of points 
 * excluded by
 * the path of the sun throughout the year.
 * \n
 * The direct sky dome points cover a strip of sky where the sun travels.
 * The inderect sky dome points cover the segments of sky either side of the direct sun strip.
 * \n
 * The detail parameter spacifies the number of rays that get generated.
 * The higher the level of detail, the more accurate but also the slower the analysis will be.
 * The number of rays differs depending on the latitde.
 * \n
 * At latitude 0, the number of rays for 'direct' are as follows:
 * 0 = 44 rays,
 * 1 = 105 rays,
 * 2 = 510 rays,
 * 3 = 1287 rays.
 * \n
 * At latitude 0, the number of rays for 'indirect' are as follows:
 * 0 = 58 rays,
 * 1 = 204 rays,
 * 2 = 798 rays,
 * 3 = 3122 rays.
 * \n
 * The number of rays for 'sky' are as follows:
 * 0 = 89 rays,
 * 1 = 337 rays,
 * 2 = 1313 rays,
 * 3 = 5185 rays.
 * \n
 * Returns a dictionary containing solar exposure results.
 * \n
 * If one  of the 'direct' methods is selected, the dictionary will contain:
 * 1. 'direct': A list of numbers, the direct exposure factors.
 * \n
 * If one  of the 'indirect' methods is selected, the dictionary will contain:
 * 1. 'indirect': A list of numbers, the indirect exposure factors.
 * \n
 * \n
 * @param __model__
 * @param sensors A list of coordinates, a list of Rays or a list of Planes, to be used as the 
 * origins for calculating exposure.
 * @param entities The obstructions, faces, polygons, or collections of faces or polygons.
 * @param radius The max distance for raytracing.
 * @param detail An integer between 1 and 3 inclusive, specifying the level of detail for the 
 * analysis.
 * @param method Enum, solar method: `'direct_weighted', 'direct_unweighted', 'indirect_weighted'`, 
 * or `'indirect_unweighted'`.
 * @returns A dictionary containing solar exposure results.
 */
export function Sun(
    __model__: GIModel,
    sensors: TRay[] | TPlane[] | TRay[][] | TPlane[][],
    entities: TId | TId[] | TId[][],
    radius: number | [number, number],
    detail: number,
    method: _ESolarMethod
): TExposure | [TExposure, TExposure] {
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.Sun";
    let ents_arrs: TEntTypeIdx[];
    let latitude: number = null;
    let north: Txy = [0, 1];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "sensors", sensors, 
            [chk.isRayL, chk.isPlnL, chk.isRayLL, chk.isPlnLL]);
        chk.checkArgs(fn_name, "detail", detail, [chk.isInt]);
        if (detail < 0 || detail > 3) {
            throw new Error(fn_name + ': "detail" must be an integer between 0 and 3 inclusive.');
        }
        ents_arrs = checkIDs(__model__, fn_name, "entities", entities, 
            [ID.isID, ID.isIDL1], 
            [EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
        if (Array.isArray(radius)) {
            if (radius.length !== 2) {
                throw new Error('If "radius" is a list, it must have a length of two: \
                [min_dist, max_dist].');
            }
            if (radius[0] >= radius[1]) {
                throw new Error('If "radius" is a list, the "min_dist" must be less than \
                the "max_dist": [min_dist, max_dist].');
            }
        }
        if (!__model__.modeldata.attribs.query.hasModelAttrib("geolocation")) {
            throw new Error(
                'analyze.Solar: model attribute "geolocation" is missing, \
                e.g. @geolocation = {"latitude":12, "longitude":34}'
            );
        } else {
            const geolocation = __model__.modeldata.attribs.get.getModelAttribVal("geolocation");
            if (typeof geolocation === 'object' && geolocation !== null && 
                    geolocation.hasOwnProperty('latitude')) {
                latitude = geolocation["latitude"];
            } else {
                throw new Error(
                    'analyze.Solar: model attribute "geolocation" is missing the "latitude" key, \
                    e.g. @geolocation = {"latitude":12, "longitude":34}'
                );
            }
        }
        if (__model__.modeldata.attribs.query.hasModelAttrib("north")) {
            north = __model__.modeldata.attribs.get.getModelAttribVal("north") as Txy;
            if (!Array.isArray(north) || north.length !== 2) {
                throw new Error(
                    'analyze.Solar: model has a "north" attribute with the wrong type, \
                it should be a vector with two values, \
                e.g. @north =  [1,2]'
                );
            }
        }
    } else {
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
        const geolocation = __model__.modeldata.attribs.get.getModelAttribVal("geolocation");
        latitude = geolocation["latitude"];
        if (__model__.modeldata.attribs.query.hasModelAttrib("north")) {
            north = __model__.modeldata.attribs.get.getModelAttribVal("north") as Txy;
        }
    }
    // --- Error Check ---
    radius = Array.isArray(radius) ? radius : [1, radius];
    // get rays for sensor points
    const [sensors0, sensors1, two_lists]: [TRay[], TRay[], boolean] = _getSensorRays(sensors, 0.01); // offset by 0.01
    // create mesh
    const [mesh_tjs, _]: [THREE.Mesh, number[]] = createSingleMeshBufTjs(__model__, ents_arrs);
    // get the direction vectors
    const dir_vecs: Txyz[] = _solarDirs(latitude, north, detail, method);
    // run the simulation
    const weighted: boolean = method === _ESolarMethod.DIRECT_WEIGHTED || 
        method === _ESolarMethod.INDIRECT_WEIGHTED;
    // run simulation
    const results0: TExposure = _calcExposure(__model__, 
        sensors0, dir_vecs, radius, mesh_tjs, weighted, false);
    const results1: TExposure = _calcExposure(__model__, 
        sensors1, dir_vecs, radius, mesh_tjs, weighted, true);
    // cleanup
    mesh_tjs.geometry.dispose();
    (mesh_tjs.material as THREE.Material).dispose();
    // return the results
    if (two_lists) { return [results0, results1]; }
    return results0;
}
// =================================================================================================
// _calcExposure is in _shared.ts
// =================================================================================================
function _solarDirs(latitude: number, north: Txy, detail: number, method: _ESolarMethod): Txyz[] {
    switch (method) {
        case _ESolarMethod.DIRECT_WEIGHTED:
        case _ESolarMethod.DIRECT_UNWEIGHTED:
            return lodash.flatten(_solarRaysDirect(latitude, north, detail));
        case _ESolarMethod.INDIRECT_WEIGHTED:
        case _ESolarMethod.INDIRECT_UNWEIGHTED:
            return _solarRaysIndirect(latitude, north, detail);
        // case _ESolarMethod.ALL:
        //     throw new Error('Not implemented');
        default:
            throw new Error("Solar method not recognised.");
    }
}
// =================================================================================================
