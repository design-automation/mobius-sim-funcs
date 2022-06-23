import {
    EEntType,
    getArrDepth,
    GIModel,
    idsMakeFromIdxs,
    multMatrix,
    TId,
    TPlane,
    TRay,
    Txy,
    Txyz,
    vecMult,
} from '@design-automation/mobius-sim';
import * as THREE from 'three';
import uscore from 'underscore';

import * as chk from '../../_check_types';
import { _ESunPathMethod } from './_enum';
import { _solarRaysDirectTjs, _solarRaysIndirectTjs } from './_shared';
import { tregenzaSky } from './_tregenza_sky';


// ================================================================================================
/**
 * Generates a sun path, oriented according to the geolocation and north direction.
 * The sun path is generated as an aid to visualize the orientation of the sun relative to the model.
 * Note that the solar exposure calculations do not require the sub path to be visualized.
 * \n
 * The sun path takes into account the geolocation and the north direction of the model.
 * Geolocation is specified by a model attributes as follows:
 * - @geolocation={'longitude':123,'latitude':12}.
 * North direction is specified by a model attribute as follows, using a vector:
 * - @north==[1,2].
 *   If no north direction is specified, then [0,1] is the default (i.e. north is in the direction
 *   of the y-axis)
 * \n
 * @param __model__
 * @param origin The origins of the rays.
 * @param detail The level of detail for the analysis.
 * @param radius The radius of the sun path.
 * @param method Enum, the type of sky to generate: `'direct', 'indirect'` or `'sky'`.
 * @returns Entities, a set of positions that are organized into sequences. 
 * A polyline can then be drawn from these positions.
 */
export function SkyDome(__model__: GIModel, origin: Txyz | TRay | TPlane, detail: number, radius: number, method: _ESunPathMethod): TId[] | TId[][] {
    // --- Error Check ---
    const fn_name = "analyze.SkyDome";
    let latitude: number = null;
    let north: Txy = [0, 1];
    if (__model__.debug) {
        chk.checkArgs(fn_name, "origin", origin, [chk.isXYZ, chk.isRay, chk.isPln]);
        chk.checkArgs(fn_name, "detail", detail, [chk.isInt]);
        if (detail < 0 || detail > 6) {
            throw new Error(fn_name + ': "detail" must be an integer between 0 and 6.');
        }
        chk.checkArgs(fn_name, "radius", radius, [chk.isNum]);
        if (method !== _ESunPathMethod.SKY) {
            if (!__model__.modeldata.attribs.query.hasModelAttrib("geolocation")) {
                throw new Error(
                    'analyze.Solar: model attribute "geolocation" is missing, \
                    e.g. @geolocation = {"latitude":12, "longitude":34}'
                );
            } else {
                const geolocation = __model__.modeldata.attribs.get.getModelAttribVal("geolocation");
                if (uscore.isObject(geolocation) && uscore.has(geolocation, "latitude")) {
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
        }
    } else {
        const geolocation = __model__.modeldata.attribs.get.getModelAttribVal("geolocation");
        latitude = geolocation["latitude"];
        if (__model__.modeldata.attribs.query.hasModelAttrib("north")) {
            north = __model__.modeldata.attribs.get.getModelAttribVal("north") as Txy;
        }
    }
    // --- Error Check ---
    // create the matrix one time
    const matrix: THREE.Matrix4 = new THREE.Matrix4();
    const origin_depth: number = getArrDepth(origin);
    if (origin_depth === 2 && origin.length === 2) {
        // origin is a ray
        matrix.makeTranslation(...(origin[0] as Txyz));
    } else if (origin_depth === 2 && origin.length === 3) {
        // origin is a plane
        // matrix = xfromSourceTargetMatrix(XYPLANE, origin as TPlane); // TODO xform not nceessary
        matrix.makeTranslation(...(origin[0] as Txyz));
    } else {
        // origin is Txyz
        matrix.makeTranslation(...(origin as Txyz));
    }
    // generate the positions on the sky dome
    switch (method) {
        case _ESunPathMethod.DIRECT:
            const rays_dirs_tjs1: THREE.Vector3[][] = _solarRaysDirectTjs(latitude, north, detail);
            return _sunPathGenPosisNested(__model__, rays_dirs_tjs1, radius, matrix);
        case _ESunPathMethod.INDIRECT:
            const rays_dirs_tjs2: THREE.Vector3[] = _solarRaysIndirectTjs(latitude, north, detail);
            return _sunPathGenPosis(__model__, rays_dirs_tjs2, radius, matrix);
        case _ESunPathMethod.SKY:
            // const rays_dirs_tjs3: THREE.Vector3[] = _skyRayDirsTjs(detail);
            const rays_dirs_tjs3: THREE.Vector3[] = tregenzaSky(detail).map( vec => new THREE.Vector3(... vec) );
            return _sunPathGenPosis(__model__, rays_dirs_tjs3, radius, matrix);
        default:
            throw new Error("Sunpath method not recognised.");
    }
}
function _sunPathGenPosisNested(__model__: GIModel, rays_dirs_tjs: THREE.Vector3[][], radius: number, matrix: THREE.Matrix4): TId[][] {
    const posis: TId[][] = [];
    for (const one_day_tjs of rays_dirs_tjs) {
        posis.push(_sunPathGenPosis(__model__, one_day_tjs, radius, matrix));
    }
    return posis;
}
function _sunPathGenPosis(__model__: GIModel, rays_dirs_tjs: THREE.Vector3[], radius: number, matrix: THREE.Matrix4): TId[] {
    const posis_i: number[] = [];
    for (const direction_tjs of rays_dirs_tjs) {
        let xyz: Txyz = vecMult([direction_tjs.x, direction_tjs.y, direction_tjs.z], radius);
        xyz = multMatrix(xyz, matrix);
        const posi_i: number = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    return idsMakeFromIdxs(EEntType.POSI, posis_i) as TId[];
}
