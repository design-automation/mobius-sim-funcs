/**
 * The `analysis` module has functions for performing various types of analysis with entities in
 * the model. These functions all return dictionaries containing the results of the analysis.
 * @module
 */
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { EEntType, EAttribDataTypeStrs } from '@design-automation/mobius-sim/dist/geo-info/common';
import { idsMakeFromIdxs, idsBreak, idMake } from '@design-automation/mobius-sim/dist/geo-info/common_id_funcs';
import { distance } from '@design-automation/mobius-sim/dist/geom/distance';
import { vecAdd, vecCross, vecMult, vecNorm, vecAng2, vecSetLen, vecRot } from '@design-automation/mobius-sim/dist/geom/vectors';
import uscore from 'underscore';
import { arrMakeFlat, getArrDepth } from '@design-automation/mobius-sim/dist/util/arrs';
import { multMatrix } from '@design-automation/mobius-sim/dist/geom/matrix';
import { XAXIS, YAXIS, ZAXIS } from '@design-automation/mobius-sim/dist/geom/constants';
import cytoscape from 'cytoscape';
import * as THREE from 'three';
import { TypedArrayUtils } from '@design-automation/mobius-sim/dist/TypedArrayUtils.js';
import * as Mathjs from 'mathjs';
import { createSingleMeshBufTjs } from '@design-automation/mobius-sim/dist/geom/mesh';
import { isRay, isXYZ, isPlane } from '@design-automation/mobius-sim/dist/geo-info/common_func';
function degToRad(deg) {
    if (Array.isArray(deg)) {
        return deg.map(a_deg => degToRad(a_deg));
    }
    return deg * (Math.PI / 180);
}
export var _ERaytraceMethod;
(function (_ERaytraceMethod) {
    _ERaytraceMethod["STATS"] = "stats";
    _ERaytraceMethod["DISTANCES"] = "distances";
    _ERaytraceMethod["HIT_PGONS"] = "hit_pgons";
    _ERaytraceMethod["INTERSECTIONS"] = "intersections";
    _ERaytraceMethod["ALL"] = "all";
})(_ERaytraceMethod || (_ERaytraceMethod = {}));
/**
 * Shoot a set of rays into a set of obstructions, consisting of polygon faces.
 * One can imagine particles being shot from the ray origin in the ray direction, hitting the
 * obstructions.
 * \n
 * Each ray will either hit an obstruction, or will hit no obstructions.
 * The length of the ray vector is ignored, only the ray origin and direction is taken into account.
 * Each particle shot out from a ray will travel a certain distance.
 * The minimum and maximum distance that the particle will travel is defined by the 'dist' argument.
 * \n
 * If a ray particle hits an obstruction, then the 'distance' for that ray is the distance from the * ray origin to the point of intersection.
 * If the ray particle does not hit an obstruction, then the 'distance' for that ray is equal to
 * the max for the 'dist' argument.
 * \n
 * Returns a dictionary containing the following data.
 * \n
 * If 'stats' is selected, the dictionary will contain the following numbers:
 * 1. 'hit_count': the total number of rays that hit an obstruction.
 * 2. 'miss_count': the total number of rays that did not hit any obstruction.
 * 3. 'total_dist': the total of all the ray distances.
 * 4. 'min_dist': the minimum distance for all the rays.
 * 5. 'max_dist': the maximum distance for all the rays.
 * 6. 'avg_dist': the average dist for all the rays.
 * 7. 'dist_ratio': the ratio of 'total_dist' to the maximum distance if not rays hit any
 * obstructions.
 * \n
 * If 'distances' is selected, the dictionary will contain the following list:
 * 1. 'distances': A list of numbers, the distance travelled for each ray.
 * \n
 * If 'hit_pgons' is selected, the dictionary will contain the following list:
 * 1. 'hit_pgons': A list of polygon IDs, the polygons hit for each ray, or 'null' if no polygon
 * was hit.
 * \n
 * If 'intersections' is selected, the dictionary will contain the following list:
 * 1. 'intersections': A list of XYZ coords, the point of intersection where the ray hit a polygon,
 * or 'null' if no polygon was hit.
 * \n
 * If 'all' is selected, the dictionary will contain all of the above.
 * \n
 * If the input is a list of rays, the output will be a single dictionary.
 * If the list is empty (i.e. contains no rays), then 'null' is returned.
 * If the input is a list of lists of rays, then the output will be a list of dictionaries.
 * \n
 * @param __model__
 * @param rays A ray, a list of rays, or a list of lists of rays.
 * @param entities The obstructions, faces, polygons, or collections of faces or polygons.
 * @param dist The ray limits, one or two numbers. Either max, or [min, max].
 * @param method Enum; values to return.
 */
export function Raytrace(__model__, rays, entities, dist, method) {
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = 'analyze.Raytrace';
    let ents_arrs;
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'rays', rays, [chk.isRay, chk.isRayL, chk.isRayLL]);
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.PGON, EEntType.COLL]);
        chk.checkArgs(fn_name, 'dist', dist, [chk.isNum, chk.isNumL]);
        if (Array.isArray(dist)) {
            if (dist.length !== 2) {
                throw new Error('If "dist" is a list, it must have a length of two: [min_dist, max_dist].');
            }
            if (dist[0] >= dist[1]) {
                throw new Error('If "dist" is a list, the "min_dist" must be less than the "max_dist": [min_dist, max_dist].');
            }
        }
    }
    else {
        ents_arrs = idsBreak(entities);
    }
    // --- Error Check ---
    const mesh = createSingleMeshBufTjs(__model__, ents_arrs);
    dist = Array.isArray(dist) ? dist : [0, dist];
    const result = _raytraceAll(__model__, rays, mesh, dist, method);
    // cleanup
    mesh[0].geometry.dispose();
    mesh[0].material.dispose();
    // return the results
    return result;
}
// Tjs raytrace function
function _raytraceAll(__model__, rays, mesh, limits, method) {
    const depth = getArrDepth(rays);
    if (depth < 2) { // an empty list
        return null;
    }
    else if (depth === 2) { // just one ray
        return _raytraceAll(__model__, [rays], mesh, limits, method);
    }
    else if (depth === 3) { // a list of rays
        const [origins_tjs, dirs_tjs] = _raytraceOriginsDirsTjs(__model__, rays);
        return _raytrace(origins_tjs, dirs_tjs, mesh, limits, method);
    }
    else if (depth === 4) { // a nested list of rays
        return rays.map(a_rays => _raytraceAll(__model__, a_rays, mesh, limits, method));
    }
}
//
function _raytraceOriginsDirsTjs(__model__, rays) {
    const origins_tjs = [];
    const dirs_tjs = [];
    for (const ray of rays) {
        origins_tjs.push(new THREE.Vector3(ray[0][0], ray[0][1], ray[0][2]));
        const dir = vecNorm(ray[1]);
        dirs_tjs.push(new THREE.Vector3(dir[0], dir[1], dir[2]));
    }
    return [origins_tjs, dirs_tjs];
}
//
function _raytrace(origins_tjs, dirs_tjs, mesh, limits, method) {
    const result = {};
    let hit_count = 0;
    let miss_count = 0;
    const result_dists = [];
    const result_ents = [];
    const result_isects = [];
    for (let i = 0; i < origins_tjs.length; i++) {
        // get the origin and direction
        const origin_tjs = origins_tjs[i];
        const dir_tjs = dirs_tjs[i];
        // shoot
        const ray_tjs = new THREE.Raycaster(origin_tjs, dir_tjs, limits[0], limits[1]);
        const isects = ray_tjs.intersectObject(mesh[0], false);
        // get the result
        if (isects.length === 0) {
            result_dists.push(limits[1]);
            miss_count += 1;
            if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.HIT_PGONS) {
                result_ents.push(null);
            }
            if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.INTERSECTIONS) {
                const origin = origin_tjs.toArray();
                const dir = dir_tjs.toArray();
                result_isects.push(vecAdd(origin, vecSetLen(dir, limits[1])));
            }
        }
        else {
            result_dists.push(isects[0]['distance']);
            hit_count += 1;
            if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.HIT_PGONS) {
                const face_i = mesh[1][isects[0].faceIndex];
                result_ents.push(idMake(EEntType.PGON, face_i));
            }
            if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.INTERSECTIONS) {
                const isect_tjs = isects[0].point;
                result_isects.push([isect_tjs.x, isect_tjs.y, isect_tjs.z]);
            }
        }
    }
    if ((method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.STATS) &&
        result_dists.length > 0) {
        result.hit_count = hit_count;
        result.miss_count = miss_count;
        result.total_dist = Mathjs.sum(result_dists);
        result.min_dist = Mathjs.min(result_dists);
        result.avg_dist = result.total_dist / result_dists.length;
        result.max_dist = Mathjs.max(result_dists);
        result.dist_ratio = result.total_dist / (result_dists.length * limits[1]);
    }
    if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.DISTANCES) {
        result.distances = result_dists;
    }
    if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.HIT_PGONS) {
        result.hit_pgons = result_ents;
    }
    if (method === _ERaytraceMethod.ALL || method === _ERaytraceMethod.INTERSECTIONS) {
        result.intersections = result_isects;
    }
    return result;
}
/**
 * Calculates an approximation of the isovist for a set of origins, defined by XYZ coords.
 * \n
 * The isovist is calculated by shooting rays out from the origins in a radial pattern.
 * The 'radius' argument defines the maximum radius of the isovist.
 * (The radius is used to define the maximum distance for shooting the rays.)
 * The 'num_rays' argument defines the number of rays that will be shot,
 * in a radial pattern parallel to the XY plane, with equal angle between rays.
 * More rays will result in more accurate result, but will also be slower to execute.
 * \n
 * Returns a dictionary containing different isovist metrics.
 * \n
 * 1. 'avg_dist': The average distance from origin to the perimeter.
 * 2. 'min_dist': The minimum distance from the origin to the perimeter.
 * 3. 'max_dist': The minimum distance from the origin to the perimeter.
 * 4. 'area': The area of the isovist.
 * 5. 'perimeter': The perimeter of the isovist.
 * 4. 'area_ratio': The ratio of the area of the isovist to the maximum area.
 * 5. 'perimeter_ratio': The ratio of the perimeter of the isovist to the maximum perimeter.
 * 6. 'circularity': The ratio of the square of the perimeter to area (Davis and Benedikt, 1979).
 * 7. 'compactness': The ratio of average distance to the maximum distance (Michael Batty, 2001).
 * 8. 'cluster': The ratio of the radius of an idealized circle with the actual area of the
 * isovist to the radius of an idealized circle with the actual perimeter of the circle (Michael Batty, 2001).
 * \n
 * \n
 * @param __model__
 * @param origins A list of Rays or a list of Planes, to be used as the origins for calculating the isovists.
 * @param entities The obstructions: faces, polygons, or collections.
 * @param radius The maximum radius of the isovist.
 * @param num_rays The number of rays to generate when calculating isovists.
 */
export function Isovist(__model__, origins, entities, radius, num_rays) {
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = 'analyze.Isovist';
    // let origin_ents_arrs: TEntTypeIdx[];
    let ents_arrs;
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'origins', origins, [chk.isRayL, chk.isPlnL]);
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities, [ID.isIDL1], [EEntType.PGON, EEntType.COLL]);
        chk.checkArgs(fn_name, 'dist', radius, [chk.isNum, chk.isNumL]);
        if (Array.isArray(radius)) {
            if (radius.length !== 2) {
                throw new Error('If "dist" is a list, it must have a length of two: [min_dist, max_dist].');
            }
            if (radius[0] >= radius[1]) {
                throw new Error('If "dist" is a list, the "min_dist" must be less than the "max_dist": [min_dist, max_dist].');
            }
        }
    }
    else {
        // origin_ents_arrs = idsBreak(origins) as TEntTypeIdx[];
        ents_arrs = idsBreak(entities);
    }
    // --- Error Check ---
    // create tjs origins for xyz, ray, or plane
    const origins_tjs = _isovistOriginsTjs(__model__, origins, 0.1); // TODO Should we lift coords by 0.1 ???
    // create tjs directions
    const dirs_xyzs = [];
    const dirs_tjs = [];
    const vec = [1, 0, 0];
    for (let i = 0; i < num_rays; i++) {
        const dir_xyz = vecRot(vec, [0, 0, 1], i * (Math.PI * 2) / num_rays);
        dirs_xyzs.push(vecSetLen(dir_xyz, radius));
        const dir_tjs = new THREE.Vector3(dir_xyz[0], dir_xyz[1], dir_xyz[2]);
        dirs_tjs.push(dir_tjs);
    }
    // calc max perim and area
    const ang = (2 * Math.PI) / num_rays;
    const opp = radius * Math.sin(ang / 2);
    const max_perim = num_rays * 2 * opp;
    const max_area = num_rays * radius * Math.cos(ang / 2) * opp;
    // create mesh
    const mesh = createSingleMeshBufTjs(__model__, ents_arrs);
    // create data structure
    const result = {};
    result.avg_dist = [];
    result.min_dist = [];
    result.max_dist = [];
    result.area = [];
    result.perimeter = [];
    result.circularity = [];
    result.area_ratio = [];
    result.perimeter_ratio = [];
    result.compactness = [];
    result.cluster = [];
    // shoot rays
    for (let i = 0; i < origins_tjs.length; i++) {
        const origin_tjs = origins_tjs[i];
        const result_dists = [];
        const result_isects = [];
        for (let j = 0; j < dirs_tjs.length; j++) {
            const dir_tjs = dirs_tjs[j];
            const ray_tjs = new THREE.Raycaster(origin_tjs, dir_tjs, 0, radius);
            const isects = ray_tjs.intersectObject(mesh[0], false);
            // get the result
            if (isects.length === 0) {
                result_dists.push(radius);
                result_isects.push(vecAdd([origin_tjs.x, origin_tjs.y, origin_tjs.z], dirs_xyzs[j]));
            }
            else {
                result_dists.push(isects[0]['distance']);
                const isect_tjs = isects[0].point;
                result_isects.push([isect_tjs.x, isect_tjs.y, isect_tjs.z]);
            }
        }
        // calc the perimeter and area
        let perim = 0;
        let area = 0;
        for (let j = 0; j < num_rays; j++) {
            const j2 = j === num_rays - 1 ? 0 : j + 1;
            // calc perim
            const c = distance(result_isects[j], result_isects[j2]);
            perim += c;
            // calc area
            area += _isovistTriArea(result_dists[j], result_dists[j2], c);
        }
        const total_dist = Mathjs.sum(result_dists);
        const avg_dist = total_dist / result_dists.length;
        const min_dist = Mathjs.min(result_dists);
        const max_dist = Mathjs.max(result_dists);
        // save the data
        result.avg_dist.push(avg_dist);
        result.min_dist.push(min_dist);
        result.max_dist.push(max_dist);
        result.area.push(area);
        result.perimeter.push(perim);
        result.area_ratio.push(area / max_area);
        result.perimeter_ratio.push(perim / max_perim);
        result.circularity.push((perim * perim) / area);
        result.compactness.push(avg_dist / max_dist);
        result.cluster.push(Math.sqrt(area / Math.PI) / (perim / (2 * Math.PI)));
    }
    // cleanup
    mesh[0].geometry.dispose();
    mesh[0].material.dispose();
    // return the results
    return result;
}
function _isovistOriginsTjs(__model__, origins, offset) {
    const vectors_tjs = [];
    const is_xyz = isXYZ(origins[0]);
    const is_ray = isRay(origins[0]);
    const is_pln = isPlane(origins[0]);
    for (const origin of origins) {
        let origin_xyz = null;
        if (is_xyz) {
            origin_xyz = origin;
        }
        else if (is_ray) {
            origin_xyz = origin[0];
        }
        else if (is_pln) {
            origin_xyz = origin[0];
        }
        else {
            throw new Error('analyze.Solar: origins arg has invalid values');
        }
        const origin_tjs = new THREE.Vector3(origin_xyz[0], origin_xyz[1], origin_xyz[2] + offset);
        vectors_tjs.push(origin_tjs);
    }
    return vectors_tjs;
}
function _isovistTriArea(a, b, c) {
    // calc area using Heron's formula
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}
// ================================================================================================
export var _ESkyMethod;
(function (_ESkyMethod) {
    _ESkyMethod["WEIGHTED"] = "weighted";
    _ESkyMethod["UNWEIGHTED"] = "unweighted";
    _ESkyMethod["ALL"] = "all";
})(_ESkyMethod || (_ESkyMethod = {}));
/**
 * Calculate an approximation of the sky exposure factor, for a set sensors positioned at specified locations.
 * The sky exposure factor for each sensor is a value between 0 and 1, where 0 means that it has no exposure
 * and 1 means that it has maximum exposure.
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
 * 2. If the ray hits an obstruction, assign a weight of 0 to that ray.
 * 3. If a ray does not hit any obstructions, assign a weight between 0 and 1, depending on the incidence angle.
 * 4. Calculate the total solar expouse by adding up the weights for all rays.
 * 5. Divide by the maximum possible exposure for an unobstructed sensor with a direction pointing straight up.
 * \n
 * If 'weighted' is selected, then
 * the exposure calculation takes into account the angle of incidence of the ray to the sensor direction.
 * Rays parallel to the sensor direction are assigned a weight of 1.
 * Rays at an oblique angle are assigned a weight equal to the cosine of the angle
 * betweeen the sensor direction and the ray.
 * \n
 * If 'unweighted' is selected, then all rays are assigned a weight of 1, irresepctive of angle.
 * \n
 * The detail parameter spacifies the number of rays that get generated.
 * The higher the level of detail, the more accurate but also the slower the analysis will be.
 * \n
 * The number of rays are as follows:
 * 0 = 89 rays,
 * 1 = 337 rays,
 * 2 = 1313 rays,
 * 3 = 5185 rays.
 * \n
 * Returns a dictionary containing exposure results.
 * \n
 * 1. 'exposure': A list of numbers, the exposure factors.
 * \n
 * \n
 * @param __model__
 * @param origins A list of coordinates, a list of Rays or a list of Planes, to be used as the origins for calculating exposure.
 * @param detail An integer between 1 and 3 inclusive, specifying the level of detail for the analysis.
 * @param entities The obstructions, faces, polygons, or collections of faces or polygons.
 * @param limits The max distance for raytracing.
 * @param method Enum; sky method.
 */
export function Sky(__model__, origins, detail, entities, limits, method) {
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = 'analyze.Sky';
    let ents_arrs;
    // let latitude: number = null;
    // let north: Txy = [0, 1];
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'origins', origins, [chk.isXYZL, chk.isRayL, chk.isPlnL]);
        chk.checkArgs(fn_name, 'detail', detail, [chk.isInt]);
        if (detail < 0 || detail > 3) {
            throw new Error(fn_name + ': "detail" must be an integer between 0 and 3 inclusive.');
        }
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.PGON, EEntType.COLL]);
    }
    else {
        ents_arrs = idsBreak(entities);
        // const geolocation = __model__.modeldata.attribs.get.getModelAttribVal('geolocation');
        // latitude = geolocation['latitude'];
        // if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
        //     north = __model__.modeldata.attribs.get.getModelAttribVal('north') as Txy;
        // }
    }
    // TODO
    // TODO
    // --- Error Check ---
    const sensor_oris_dirs_tjs = _rayOrisDirsTjs(__model__, origins, 0.01);
    const [mesh_tjs, idx_to_face_i] = createSingleMeshBufTjs(__model__, ents_arrs);
    limits = Array.isArray(limits) ? limits : [0, limits];
    // get the direction vectors
    const ray_dirs_tjs = _skyRayDirsTjs(detail);
    // run the simulation
    const weighted = method === _ESkyMethod.WEIGHTED;
    const results = _calcExposure(sensor_oris_dirs_tjs, ray_dirs_tjs, mesh_tjs, limits, weighted);
    // cleanup
    mesh_tjs.geometry.dispose();
    mesh_tjs.material.dispose();
    // return the result
    return { 'exposure': results };
}
function _skyRayDirsTjs(detail) {
    const hedron_tjs = new THREE.IcosahedronGeometry(1, detail + 2);
    // calc vectors
    const vecs = [];
    // THREE JS UPDATE --> EDITED
    // for (const vec of hedron_tjs.vertices) {
    //     // vec.applyAxisAngle(YAXIS, Math.PI / 2);
    //     if (vec.z > -1e-6) {
    //         vecs.push(vec);
    //     }
    // }
    let vec = [];
    for (const coord of hedron_tjs.getAttribute('position').array) {
        vec.push(coord);
        if (vec.length === 3) {
            if (vec[2] > -1e-6) {
                vecs.push(new THREE.Vector3(...vec));
            }
            vec = [];
        }
    }
    return vecs;
}
// ================================================================================================
export var _ESolarMethod;
(function (_ESolarMethod) {
    _ESolarMethod["DIRECT_WEIGHTED"] = "direct_weighted";
    _ESolarMethod["DIRECT_UNWEIGHTED"] = "direct_unweighted";
    _ESolarMethod["INDIRECT_WEIGHTED"] = "indirect_weighted";
    _ESolarMethod["INDIRECT_UNWEIGHTED"] = "indirect_unweighted";
})(_ESolarMethod || (_ESolarMethod = {}));
/**
 * Calculate an approximation of the solar exposure factor, for a set sensors positioned at specfied locations.
 * The solar exposure factor for each sensor is a value between 0 and 1, where 0 means that it has no exposure
 * and 1 means that it has maximum exposure.
 * \n
 * The calculation takes into account the geolocation and the north direction of the model.
 * Geolocation is specified by a model attributes as follows:
 * @geolocation={'longitude':123,'latitude':12}.
 * North direction is specified by a model attribute as follows, using a vector:
 * @north==[1,2]
 * If no north direction is specified, then [0,1] is the default (i.e. north is in the direction of the y-axis);
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
 * 3. If a ray does not hit any obstructions, assign a weight between 0 and 1, depending on the incidence angle.
 * 4. Calculate the total solar expouse by adding up the weights for all rays.
 * 5. Divide by the maximum possible solar exposure for an unobstructed sensor.
 * \n
 * The solar exposure calculation takes into account the angle of incidence of the sun ray to the sensor direction.
 * Sun rays that are hitting the sensor straight on are assigned a weight of 1.
 * Sun rays that are hitting the sensor at an oblique angle are assigned a weight equal to the cosine of the angle.
 * \n
 * If 'direct_exposure' is selected, then the points on the sky dome will follow the path of the sun throughout the year.
 * If 'indirect_exposure' is selected, then the points on the sky dome will consist of points excluded by
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
 * @param origins A list of coordinates, a list of Rays or a list of Planes, to be used as the origins for calculating exposure.
 * @param detail An integer between 1 and 3 inclusive, specifying the level of detail for the analysis.
 * @param entities The obstructions, faces, polygons, or collections of faces or polygons.
 * @param limits The max distance for raytracing.
 * @param method Enum; solar method.
 */
export function Sun(__model__, origins, detail, entities, limits, method) {
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = 'analyze.Sun';
    let ents_arrs;
    let latitude = null;
    let north = [0, 1];
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'origins', origins, [chk.isXYZL, chk.isRayL, chk.isPlnL]);
        chk.checkArgs(fn_name, 'detail', detail, [chk.isInt]);
        if (detail < 0 || detail > 3) {
            throw new Error(fn_name + ': "detail" must be an integer between 0 and 3 inclusive.');
        }
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.PGON, EEntType.COLL]);
        if (!__model__.modeldata.attribs.query.hasModelAttrib('geolocation')) {
            throw new Error('analyze.Solar: model attribute "geolocation" is missing, \
                e.g. @geolocation = {"latitude":12, "longitude":34}');
        }
        else {
            const geolocation = __model__.modeldata.attribs.get.getModelAttribVal('geolocation');
            if (uscore.isObject(geolocation) && uscore.has(geolocation, 'latitude')) {
                latitude = geolocation['latitude'];
            }
            else {
                throw new Error('analyze.Solar: model attribute "geolocation" is missing the "latitude" key, \
                    e.g. @geolocation = {"latitude":12, "longitude":34}');
            }
        }
        if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
            north = __model__.modeldata.attribs.get.getModelAttribVal('north');
            if (!Array.isArray(north) || north.length !== 2) {
                throw new Error('analyze.Solar: model has a "north" attribute with the wrong type, \
                it should be a vector with two values, \
                e.g. @north =  [1,2]');
            }
        }
    }
    else {
        ents_arrs = idsBreak(entities);
        const geolocation = __model__.modeldata.attribs.get.getModelAttribVal('geolocation');
        latitude = geolocation['latitude'];
        if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
            north = __model__.modeldata.attribs.get.getModelAttribVal('north');
        }
    }
    // TODO
    // TODO
    // --- Error Check ---
    // TODO North direction
    const sensor_oris_dirs_tjs = _rayOrisDirsTjs(__model__, origins, 0.01);
    const [mesh_tjs, idx_to_face_i] = createSingleMeshBufTjs(__model__, ents_arrs);
    limits = Array.isArray(limits) ? limits : [0, limits];
    // return the result
    const results = {};
    switch (method) {
        case _ESolarMethod.DIRECT_WEIGHTED:
        case _ESolarMethod.DIRECT_UNWEIGHTED:
            // get the direction vectors
            const ray_dirs_tjs1 = uscore.flatten(_solarDirsTjs(latitude, north, detail, method));
            // run the simulation
            const weighted1 = method === _ESolarMethod.DIRECT_WEIGHTED;
            results['direct'] = _calcExposure(sensor_oris_dirs_tjs, ray_dirs_tjs1, mesh_tjs, limits, weighted1);
            break;
        case _ESolarMethod.INDIRECT_WEIGHTED:
        case _ESolarMethod.INDIRECT_UNWEIGHTED:
            // get the direction vectors
            const ray_dirs_tjs2 = uscore.flatten(_solarDirsTjs(latitude, north, detail, method));
            // run the simulation
            const weighted2 = method === _ESolarMethod.INDIRECT_WEIGHTED;
            results['indirect'] = _calcExposure(sensor_oris_dirs_tjs, ray_dirs_tjs2, mesh_tjs, limits, weighted2);
            break;
        default:
            throw new Error('Solar method not recognised.');
    }
    // cleanup
    mesh_tjs.geometry.dispose();
    mesh_tjs.material.dispose();
    // return dict
    return results;
}
function _rayOrisDirsTjs(__model__, origins, offset) {
    const vectors_tjs = [];
    const is_xyz = isXYZ(origins[0]);
    const is_ray = isRay(origins[0]);
    const is_pln = isPlane(origins[0]);
    for (const origin of origins) {
        let origin_xyz = null;
        let normal_xyz = null;
        if (is_xyz) {
            origin_xyz = origin;
            normal_xyz = [0, 0, 1];
        }
        else if (is_ray) {
            origin_xyz = origin[0];
            normal_xyz = vecNorm(origin[1]);
        }
        else if (is_pln) {
            origin_xyz = origin[0];
            normal_xyz = vecCross(origin[1], origin[2]);
        }
        else {
            throw new Error('analyze.Solar: origins arg has invalid values');
        }
        const normal_tjs = new THREE.Vector3(...normal_xyz);
        const origin_offset_xyz = vecAdd(origin_xyz, vecMult(normal_xyz, offset));
        const origin_tjs = new THREE.Vector3(...origin_offset_xyz);
        vectors_tjs.push([origin_tjs, normal_tjs]);
    }
    return vectors_tjs;
}
function _solarDirsTjs(latitude, north, detail, method) {
    switch (method) {
        case _ESolarMethod.DIRECT_WEIGHTED:
        case _ESolarMethod.DIRECT_UNWEIGHTED:
            return _solarRaysDirectTjs(latitude, north, detail);
        case _ESolarMethod.INDIRECT_WEIGHTED:
        case _ESolarMethod.INDIRECT_UNWEIGHTED:
            return _solarRaysIndirectTjs(latitude, north, detail);
        // case _ESolarMethod.ALL:
        //     throw new Error('Not implemented');
        default:
            throw new Error('Solar method not recognised.');
    }
}
function _solarRot(day_ang, day, hour_ang, hour, latitude, north) {
    const vec = new THREE.Vector3(0, 0, -1);
    vec.applyAxisAngle(XAXIS, day_ang * day);
    vec.applyAxisAngle(YAXIS, hour_ang * hour);
    vec.applyAxisAngle(XAXIS, latitude);
    vec.applyAxisAngle(ZAXIS, -north);
    return vec;
}
function _solarRaysDirectTjs(latitude, north, detail) {
    const directions = [];
    // set the level of detail
    // const day_step = [182 / 4, 182 / 5, 182 / 6, 182 / 7, 182 / 8, 182 / 9, 182 / 10][detail];
    const day_step = [182 / 3, 182 / 6, 182 / 9, 182 / 12][detail];
    const num_day_steps = Math.round(182 / day_step) + 1;
    // const hour_step = [0.25 * 6, 0.25 * 5, 0.25 * 4, 0.25 * 3, 0.25 * 2, 0.25 * 1, 0.25 * 0.5][detail];
    const hour_step = [0.25 * 6, 0.25 * 4, 0.25 * 1, 0.25 * 0.5][detail];
    // get the angles in radians
    const day_ang_rad = degToRad(47) / 182;
    const hour_ang_rad = (2 * Math.PI) / 24;
    // get the atitude angle in radians
    const latitude_rad = degToRad(latitude);
    // get the angle from y-axis to north vector in radians
    const north_rad = vecAng2([north[0], north[1], 0], [0, 1, 0], [0, 0, 1]);
    // create the vectors
    for (let day_count = 0; day_count < num_day_steps; day_count++) {
        const day = -91 + (day_count * day_step);
        const one_day_path = [];
        // get sunrise
        let sunrise = 0;
        let sunset = 0;
        for (let hour = 0; hour < 24; hour = hour + 0.1) {
            const sunrise_vec = _solarRot(day_ang_rad, day, hour_ang_rad, hour, latitude_rad, north_rad);
            if (sunrise_vec.z > -1e-6) {
                sunrise = hour;
                sunset = 24 - hour;
                one_day_path.push(sunrise_vec);
                break;
            }
        }
        // morning sun path, count down from midday
        for (let hour = 12; hour > sunrise; hour = hour - hour_step) {
            const am_vec = _solarRot(day_ang_rad, day, hour_ang_rad, hour, latitude_rad, north_rad);
            if (am_vec.z > -1e-6) {
                one_day_path.splice(1, 0, am_vec);
            }
            else {
                break;
            }
        }
        // afternoon sunpath, count up from midday
        for (let hour = 12 + hour_step; hour < sunset; hour = hour + hour_step) {
            const pm_vec = _solarRot(day_ang_rad, day, hour_ang_rad, hour, latitude_rad, north_rad);
            if (pm_vec.z > -1e-6) {
                one_day_path.push(pm_vec);
            }
            else {
                break;
            }
        }
        // sunset
        const sunset_vec = _solarRot(day_ang_rad, day, hour_ang_rad, sunset, latitude_rad, north_rad);
        one_day_path.push(sunset_vec);
        // add it to the list
        directions.push(one_day_path);
    }
    // console.log("num rays = ", arrMakeFlat(directions).length);
    return directions;
}
function _solarRaysIndirectTjs(latitude, north, detail) {
    const hedron_tjs = new THREE.IcosahedronGeometry(1, detail + 2);
    const solar_offset = Math.cos(degToRad(66.5));
    // get the atitude angle in radians
    const latitude_rad = degToRad(latitude);
    // get the angle from y-axis to north vector in radians
    const north_rad = vecAng2([north[0], north[1], 0], [0, 1, 0], [0, 0, 1]);
    // calc vectors
    const indirect_vecs = [];
    // THREE JS UPDATE --> EDITED
    // for (const vec of hedron_tjs.vertices) {
    //     if (Math.abs(vec.y) > solar_offset) {
    //         vec.applyAxisAngle(XAXIS, latitude_rad);
    //         vec.applyAxisAngle(ZAXIS, -north_rad);
    //         if (vec.z > -1e-6) {
    //             indirect_vecs.push(vec);
    //         }
    //     }
    // }
    let coordList = [];
    for (const coord of hedron_tjs.getAttribute('position').array) {
        coordList.push(coord);
        if (coordList.length === 3) {
            const vec = new THREE.Vector3(...coordList);
            if (Math.abs(vec.y) > solar_offset) {
                vec.applyAxisAngle(XAXIS, latitude_rad);
                vec.applyAxisAngle(ZAXIS, -north_rad);
                if (vec.z > -1e-6) {
                    indirect_vecs.push(vec);
                }
            }
            coordList = [];
        }
    }
    // console.log("num rays = ", indirect_vecs.length);
    return indirect_vecs;
}
// calc the max solar exposure for a point with no obstructions facing straight up
function _calcMaxExposure(directions_tjs, weighted) {
    if (!weighted) {
        return directions_tjs.length;
    }
    let result = 0;
    const normal_tjs = new THREE.Vector3(0, 0, 1);
    for (const direction_tjs of directions_tjs) {
        // calc the weighted result based on the angle between the dir and normal
        // this applies the cosine weighting rule
        const result_weighted = normal_tjs.dot(direction_tjs);
        if (result_weighted > 0) {
            result = result + result_weighted;
        }
    }
    return result;
}
function _calcExposure(origins_normals_tjs, directions_tjs, mesh_tjs, limits, weighted) {
    const results = [];
    const result_max = _calcMaxExposure(directions_tjs, weighted);
    for (const [origin_tjs, normal_tjs] of origins_normals_tjs) {
        let result = 0;
        for (const direction_tjs of directions_tjs) {
            const dot_normal_direction = normal_tjs.dot(direction_tjs);
            if (dot_normal_direction > 0) {
                const ray_tjs = new THREE.Raycaster(origin_tjs, direction_tjs, limits[0], limits[1]);
                const isects = ray_tjs.intersectObject(mesh_tjs, false);
                if (isects.length === 0) {
                    if (weighted) {
                        // this applies the cosine weighting rule
                        result = result + dot_normal_direction;
                    }
                    else {
                        // this applies no cosine weighting
                        result = result + 1;
                    }
                }
            }
        }
        results.push(result / result_max);
    }
    return results;
}
// ================================================================================================
export var _ESunPathMethod;
(function (_ESunPathMethod) {
    _ESunPathMethod["DIRECT"] = "direct";
    _ESunPathMethod["INDIRECT"] = "indirect";
    _ESunPathMethod["SKY"] = "sky";
})(_ESunPathMethod || (_ESunPathMethod = {}));
/**
 * Generates a sun path, oriented according to the geolocation and north direction.
 * The sun path is generated as an aid to visualize the orientation of the sun relative to the model.
 * Note that the solar exposure calculations do not require the sub path to be visualized.
 * \n
 * The sun path takes into account the geolocation and the north direction of the model.
 * Geolocation is specified by a model attributes as follows:
 * @geolocation={'longitude':123,'latitude':12}.
 * North direction is specified by a model attribute as follows, using a vector:
 * @north==[1,2]
 * If no north direction is specified, then [0,1] is the default (i.e. north is in the direction of the y-axis);
 * \n
 * @param __model__
 * @param origins The origins of the rays
 * @param detail The level of detail for the analysis
 * @param radius The radius of the sun path
 * @param method Enum, the type of sky to generate.
 */
export function SkyDome(__model__, origin, detail, radius, method) {
    // --- Error Check ---
    const fn_name = 'analyze.SkyDome';
    let latitude = null;
    let north = [0, 1];
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isRay, chk.isPln]);
        chk.checkArgs(fn_name, 'detail', detail, [chk.isInt]);
        if (detail < 0 || detail > 6) {
            throw new Error(fn_name + ': "detail" must be an integer between 0 and 6.');
        }
        chk.checkArgs(fn_name, 'radius', radius, [chk.isNum]);
        if (method !== _ESunPathMethod.SKY) {
            if (!__model__.modeldata.attribs.query.hasModelAttrib('geolocation')) {
                throw new Error('analyze.Solar: model attribute "geolocation" is missing, \
                    e.g. @geolocation = {"latitude":12, "longitude":34}');
            }
            else {
                const geolocation = __model__.modeldata.attribs.get.getModelAttribVal('geolocation');
                if (uscore.isObject(geolocation) && uscore.has(geolocation, 'latitude')) {
                    latitude = geolocation['latitude'];
                }
                else {
                    throw new Error('analyze.Solar: model attribute "geolocation" is missing the "latitude" key, \
                        e.g. @geolocation = {"latitude":12, "longitude":34}');
                }
            }
            if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
                north = __model__.modeldata.attribs.get.getModelAttribVal('north');
                if (!Array.isArray(north) || north.length !== 2) {
                    throw new Error('analyze.Solar: model has a "north" attribute with the wrong type, \
                    it should be a vector with two values, \
                    e.g. @north =  [1,2]');
                }
            }
        }
    }
    else {
        const geolocation = __model__.modeldata.attribs.get.getModelAttribVal('geolocation');
        latitude = geolocation['latitude'];
        if (__model__.modeldata.attribs.query.hasModelAttrib('north')) {
            north = __model__.modeldata.attribs.get.getModelAttribVal('north');
        }
    }
    // --- Error Check ---
    // create the matrix one time
    const matrix = new THREE.Matrix4();
    const origin_depth = getArrDepth(origin);
    if (origin_depth === 2 && origin.length === 2) {
        // origin is a ray
        matrix.makeTranslation(...origin[0]);
    }
    else if (origin_depth === 2 && origin.length === 3) {
        // origin is a plane
        // matrix = xfromSourceTargetMatrix(XYPLANE, origin as TPlane); // TODO xform not nceessary
        matrix.makeTranslation(...origin[0]);
    }
    else {
        // origin is Txyz
        matrix.makeTranslation(...origin);
    }
    // generate the positions on the sky dome
    switch (method) {
        case _ESunPathMethod.DIRECT:
            const rays_dirs_tjs1 = _solarRaysDirectTjs(latitude, north, detail);
            return _sunPathGenPosisNested(__model__, rays_dirs_tjs1, radius, matrix);
        case _ESunPathMethod.INDIRECT:
            const rays_dirs_tjs2 = _solarRaysIndirectTjs(latitude, north, detail);
            return _sunPathGenPosis(__model__, rays_dirs_tjs2, radius, matrix);
        case _ESunPathMethod.SKY:
            const rays_dirs_tjs3 = _skyRayDirsTjs(detail);
            return _sunPathGenPosis(__model__, rays_dirs_tjs3, radius, matrix);
        default:
            throw new Error('Sunpath method not recognised.');
    }
}
function _sunPathGenPosisNested(__model__, rays_dirs_tjs, radius, matrix) {
    const posis = [];
    for (const one_day_tjs of rays_dirs_tjs) {
        posis.push(_sunPathGenPosis(__model__, one_day_tjs, radius, matrix));
    }
    return posis;
}
function _sunPathGenPosis(__model__, rays_dirs_tjs, radius, matrix) {
    const posis_i = [];
    for (const direction_tjs of rays_dirs_tjs) {
        let xyz = vecMult([direction_tjs.x, direction_tjs.y, direction_tjs.z], radius);
        xyz = multMatrix(xyz, matrix);
        const posi_i = __model__.modeldata.geom.add.addPosi();
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz);
        posis_i.push(posi_i);
    }
    return idsMakeFromIdxs(EEntType.POSI, posis_i);
}
// ================================================================================================
/**
 * Finds the nearest positions within a certain maximum radius.
 * \n
 * The neighbors to each source position is calculated as follows:
 * 1. Calculate the distance to all target positions.
 * 2. Creat the neighbors set by filtering out target positions that are further than the maximum radius.
 * 3. If the number of neighbors is greater than 'max_neighbors',
 * then select the 'max_neighbors' closest target positions.
 * \n
 * Returns a dictionary containing the nearest positions.
 * \n
 * If 'num_neighbors' is 1, the dictionary will contain two lists:
 * 1. 'posis': a list of positions, a subset of positions from the source.
 * 2. 'neighbors': a list of neighbouring positions, a subset of positions from target.
  * \n
 * If 'num_neighbors' is greater than 1, the dictionary will contain two lists:
 * 1. 'posis': a list of positions, a subset of positions from the source.
 * 2. 'neighbors': a list of lists of neighbouring positions, a subset of positions from target.
 * \n
 * @param __model__
 * @param source A list of positions, or entities from which positions can be extracted.
 * @param target A list of positions, or entities from which positions can be extracted.
 * If null, the positions in source will be used.
 * @param radius The maximum distance for neighbors. If null, Infinity will be used.
 * @param max_neighbors The maximum number of neighbors to return.
 * If null, the number of positions in target is used.
 * @returns A dictionary containing the results.
 */
export function Nearest(__model__, source, target, radius, max_neighbors) {
    if (target === null) {
        target = source;
    } // TODO optimise
    source = arrMakeFlat(source);
    target = arrMakeFlat(target);
    // --- Error Check ---
    const fn_name = 'analyze.Nearest';
    let source_ents_arrs;
    let target_ents_arrs;
    if (__model__.debug) {
        source_ents_arrs = checkIDs(__model__, fn_name, 'origins', source, [ID.isID, ID.isIDL1], null);
        target_ents_arrs = checkIDs(__model__, fn_name, 'destinations', target, [ID.isID, ID.isIDL1], null);
    }
    else {
        // source_ents_arrs = splitIDs(fn_name, 'origins', source,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // target_ents_arrs = splitIDs(fn_name, 'destinations', target,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = idsBreak(source);
        target_ents_arrs = idsBreak(target);
    }
    // --- Error Check ---
    const source_posis_i = _getUniquePosis(__model__, source_ents_arrs);
    const target_posis_i = _getUniquePosis(__model__, target_ents_arrs);
    const result = _nearest(__model__, source_posis_i, target_posis_i, radius, max_neighbors);
    // return dictionary with results
    return {
        'posis': idsMakeFromIdxs(EEntType.POSI, result[0]),
        'neighbors': idsMakeFromIdxs(EEntType.POSI, result[1]),
        'distances': result[2]
    };
}
function _fuseDistSq(xyz1, xyz2) {
    return Math.pow(xyz1[0] - xyz2[0], 2) + Math.pow(xyz1[1] - xyz2[1], 2) + Math.pow(xyz1[2] - xyz2[2], 2);
}
function _nearest(__model__, source_posis_i, target_posis_i, dist, num_neighbors) {
    // create a list of all posis
    const set_target_posis_i = new Set(target_posis_i);
    const set_posis_i = new Set(target_posis_i);
    for (const posi_i of source_posis_i) {
        set_posis_i.add(posi_i);
    }
    const posis_i = Array.from(set_posis_i);
    // get dist and num_neighbours
    if (dist === null) {
        dist = Infinity;
    }
    if (num_neighbors === null) {
        num_neighbors = target_posis_i.length;
    }
    // find neighbor
    const map_posi_i_to_xyz = new Map();
    const typed_positions = new Float32Array(posis_i.length * 4);
    const typed_buff = new THREE.BufferGeometry();
    typed_buff.setAttribute('position', new THREE.BufferAttribute(typed_positions, 4));
    for (let i = 0; i < posis_i.length; i++) {
        const posi_i = posis_i[i];
        const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        map_posi_i_to_xyz.set(posi_i, xyz);
        typed_positions[i * 4 + 0] = xyz[0];
        typed_positions[i * 4 + 1] = xyz[1];
        typed_positions[i * 4 + 2] = xyz[2];
        typed_positions[i * 4 + 3] = posi_i;
    }
    const kdtree = new TypedArrayUtils.Kdtree(typed_positions, _fuseDistSq, 4);
    // calculate the dist squared
    const num_posis = posis_i.length;
    const dist_sq = dist * dist;
    // deal with special case, num_neighbors === 1
    if (num_neighbors === 1) {
        const result1 = [[], [], []];
        for (const posi_i of source_posis_i) {
            const nn = kdtree.nearest(map_posi_i_to_xyz.get(posi_i), num_posis, dist_sq);
            let min_dist = Infinity;
            let nn_posi_i;
            for (const a_nn of nn) {
                const next_nn_posi_i = a_nn[0].obj[3];
                if (set_target_posis_i.has(next_nn_posi_i) && a_nn[1] < min_dist) {
                    min_dist = a_nn[1];
                    nn_posi_i = next_nn_posi_i;
                }
            }
            if (nn_posi_i !== undefined) {
                result1[0].push(posi_i);
                result1[1].push(nn_posi_i);
                result1[2].push(Math.sqrt(min_dist));
            }
        }
        return result1;
    }
    // create a neighbors list
    const result = [[], [], []];
    for (const posi_i of source_posis_i) {
        // TODO at the moment is gets all posis since no distinction is made between source and traget
        // TODO kdtree could be optimised
        const nn = kdtree.nearest(map_posi_i_to_xyz.get(posi_i), num_posis, dist_sq);
        const posis_i_dists = [];
        for (const a_nn of nn) {
            const nn_posi_i = a_nn[0].obj[3];
            if (set_target_posis_i.has(nn_posi_i)) {
                posis_i_dists.push([nn_posi_i, a_nn[1]]);
            }
        }
        posis_i_dists.sort((a, b) => a[1] - b[1]);
        const nn_posis_i = [];
        const nn_dists = [];
        for (const posi_i_dist of posis_i_dists) {
            nn_posis_i.push(posi_i_dist[0]);
            nn_dists.push(Math.sqrt(posi_i_dist[1]));
            if (nn_posis_i.length === num_neighbors) {
                break;
            }
        }
        if (nn_posis_i.length > 0) {
            result[0].push(posi_i);
            result[1].push(nn_posis_i);
            result[2].push(nn_dists);
        }
    }
    return result;
}
export var _EShortestPathMethod;
(function (_EShortestPathMethod) {
    _EShortestPathMethod["UNDIRECTED"] = "undirected";
    _EShortestPathMethod["DIRECTED"] = "directed";
})(_EShortestPathMethod || (_EShortestPathMethod = {}));
export var _EShortestPathResult;
(function (_EShortestPathResult) {
    _EShortestPathResult["DISTS"] = "distances";
    _EShortestPathResult["COUNTS"] = "counts";
    _EShortestPathResult["PATHS"] = "paths";
    _EShortestPathResult["ALL"] = "all";
})(_EShortestPathResult || (_EShortestPathResult = {}));
/**
 * Calculates the shortest path from every source position to every target position.
 * \n
 * Paths are calculated through a network of connected edges.
 * For edges to be connected, vertices must be welded.
 * For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.
 * \n
 * If 'directed' is selected, then the edge direction is taken into account. Each edge will be one-way.
 * If 'undirected' is selected, the edge direction is ignored. Each edge will be two-way.
 * \n
 * Each edge can be assigned a weight.
 * The shortest path is the path where the sum of the weights of the edges along the path is the minimum.
 * \n
 * By default, all edges are assigned a weight of 1.
 * Default weights can be overridden by creating a numeric attribute on edges call 'weight'.
 * \n
 * Returns a dictionary containing the shortest paths.
 * \n
 * If 'distances' is selected, the dictionary will contain two list:
 * 1. 'source_posis': a list of start positions for eah path,
 * 2. 'distances': a list of distances, one list for each path starting at each source position.
 * \n
 * If 'counts' is selected, the dictionary will contain four lists:
 * 1. 'posis': a list of positions traversed by the paths,
 * 2. 'posis_count': a list of numbers that count how often each position was traversed,
 * 3. 'edges': a list of edges traversed by the paths,
 * 4. 'edges_count': a list of numbers that count how often each edge was traversed.
 * \n
 * If 'paths' is selected, the dictionary will contain two lists of lists:
 * 1. 'posi_paths': a list of lists of positions, one list for each path,
 * 2. 'edge_paths': a list of lists of edges, one list for each path.
 * \n
 * If 'all' is selected, the dictionary will contain all lists just described.
 * \n
 * @param __model__
 * @param source Path source, a list of positions, or entities from which positions can be extracted.
 * @param target Path target, a list of positions, or entities from which positions can be extracted.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param method Enum, the method to use, directed or undirected.
 * @param result Enum, the data to return, positions, edges, or both.
 * @returns A dictionary containing the results.
 */
export function ShortestPath(__model__, source, target, entities, method, result) {
    source = source === null ? [] : arrMakeFlat(source);
    target = target === null ? [] : arrMakeFlat(target);
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = 'analyze.ShortestPath';
    let source_ents_arrs;
    let target_ents_arrs;
    let ents_arrs;
    if (__model__.debug) {
        source_ents_arrs = checkIDs(__model__, fn_name, 'origins', source, [ID.isID, ID.isIDL1], null);
        target_ents_arrs = checkIDs(__model__, fn_name, 'destinations', target, [ID.isID, ID.isIDL1], null);
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null);
    }
    else {
        // source_ents_arrs = splitIDs(fn_name, 'origins', source,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // target_ents_arrs = splitIDs(fn_name, 'destinations', target,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // ents_arrs = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = idsBreak(source);
        target_ents_arrs = idsBreak(target);
        ents_arrs = idsBreak(entities);
    }
    // --- Error Check ---
    const directed = method === _EShortestPathMethod.DIRECTED ? true : false;
    let return_dists = true;
    let return_counts = true;
    let return_paths = true;
    switch (result) {
        case _EShortestPathResult.DISTS:
            return_paths = false;
            return_counts = false;
            break;
        case _EShortestPathResult.COUNTS:
            return_dists = false;
            return_paths = false;
            break;
        case _EShortestPathResult.PATHS:
            return_dists = false;
            return_counts = false;
            break;
        default:
            // all true
            break;
    }
    const source_posis_i = _getUniquePosis(__model__, source.length === 0 ? ents_arrs : source_ents_arrs);
    const target_posis_i = _getUniquePosis(__model__, target.length === 0 ? ents_arrs : target_ents_arrs);
    const cy_elems = _cytoscapeGetElements(__model__, ents_arrs, source_posis_i, target_posis_i, directed);
    // create the cytoscape object
    const cy = cytoscape({
        elements: cy_elems,
        headless: true,
    });
    const map_edges_i = new Map();
    const map_posis_i = new Map();
    const posi_paths = [];
    const edge_paths = [];
    const all_path_dists = [];
    for (const source_posi_i of source_posis_i) {
        const path_dists = [];
        const cy_source_elem = cy.getElementById(source_posi_i.toString());
        const dijkstra = cy.elements().dijkstra({
            root: cy_source_elem,
            weight: _cytoscapeWeightFn,
            directed: directed
        });
        for (const target_posi_i of target_posis_i) {
            const cy_node = cy.getElementById(target_posi_i.toString());
            const dist = dijkstra.distanceTo(cy_node);
            const cy_path = dijkstra.pathTo(cy_node);
            const posi_path = [];
            const edge_path = [];
            for (const cy_path_elem of cy_path.toArray()) {
                if (cy_path_elem.isEdge()) {
                    const edge_i = cy_path_elem.data('idx');
                    if (return_counts) {
                        if (!map_edges_i.has(edge_i)) {
                            map_edges_i.set(edge_i, 1);
                        }
                        else {
                            map_edges_i.set(edge_i, map_edges_i.get(edge_i) + 1);
                        }
                        if (!directed) {
                            const edge2_i = cy_path_elem.data('idx2');
                            if (edge2_i !== null) {
                                if (!map_edges_i.has(edge2_i)) {
                                    map_edges_i.set(edge2_i, 1);
                                }
                                else {
                                    map_edges_i.set(edge2_i, map_edges_i.get(edge2_i) + 1);
                                }
                            }
                        }
                    }
                    if (return_paths) {
                        edge_path.push(edge_i);
                    }
                }
                else {
                    const posi_i = cy_path_elem.data('idx');
                    if (return_counts) {
                        if (!map_posis_i.has(posi_i)) {
                            map_posis_i.set(posi_i, 1);
                        }
                        else {
                            map_posis_i.set(posi_i, map_posis_i.get(posi_i) + 1);
                        }
                    }
                    if (return_paths) {
                        posi_path.push(posi_i);
                    }
                }
            }
            if (return_paths) {
                edge_paths.push(edge_path);
                posi_paths.push(posi_path);
            }
            if (return_dists) {
                path_dists.push(dist);
            }
        }
        all_path_dists.push(path_dists);
    }
    const dict = {};
    if (return_dists) {
        dict.source_posis = idsMakeFromIdxs(EEntType.POSI, source_posis_i);
        dict.distances = source_posis_i.length === 1 ? all_path_dists[0] : all_path_dists;
    }
    if (return_counts) {
        dict.edges = idsMakeFromIdxs(EEntType.EDGE, Array.from(map_edges_i.keys()));
        dict.edges_count = Array.from(map_edges_i.values());
        dict.posis = idsMakeFromIdxs(EEntType.POSI, Array.from(map_posis_i.keys()));
        dict.posis_count = Array.from(map_posis_i.values());
    }
    if (return_paths) {
        dict.edge_paths = idsMakeFromIdxs(EEntType.EDGE, edge_paths);
        dict.posi_paths = idsMakeFromIdxs(EEntType.POSI, posi_paths);
    }
    return dict;
}
function _getUniquePosis(__model__, ents_arr) {
    if (ents_arr.length === 0) {
        return [];
    }
    const set_posis_i = new Set();
    for (const [ent_type, ent_i] of ents_arr) {
        const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        for (const posi_i of posis_i) {
            set_posis_i.add(posi_i);
        }
    }
    return Array.from(set_posis_i);
}
function _cytoscapeWeightFn(edge) {
    return edge.data('weight');
}
function _cytoscapeWeightFn2(edge) {
    const weight = edge.data('weight');
    if (weight < 1) {
        return 1;
    }
    return weight;
}
function _cytoscapeGetElements(__model__, ents_arr, source_posis_i, target_posis_i, directed) {
    let has_weight_attrib = false;
    if (__model__.modeldata.attribs.query.hasEntAttrib(EEntType.EDGE, 'weight')) {
        has_weight_attrib = __model__.modeldata.attribs.query.getAttribDataType(EEntType.EDGE, 'weight') === EAttribDataTypeStrs.NUMBER;
    }
    // edges, starts empty
    const set_edges_i = new Set();
    // posis, starts with cource and target
    const set_posis_i = new Set(source_posis_i);
    for (const target_posi_i of target_posis_i) {
        set_posis_i.add(target_posi_i);
    }
    // network
    for (const [ent_type, ent_i] of ents_arr) {
        const edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const edge_i of edges_i) {
            set_edges_i.add(edge_i);
        }
        const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        for (const posi_i of posis_i) {
            set_posis_i.add(posi_i);
        }
    }
    // create elements
    const elements = [];
    for (const posi_i of Array.from(set_posis_i)) {
        elements.push({ data: { id: posi_i.toString(), idx: posi_i } });
    }
    if (directed) {
        // directed
        for (const edge_i of Array.from(set_edges_i)) {
            const edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            let weight = 1.0;
            if (has_weight_attrib) {
                weight = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.EDGE, edge_i, 'weight');
            }
            else {
                const c0 = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                const c1 = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
                weight = distance(c0, c1);
            }
            elements.push({ data: { id: 'e' + edge_i,
                    source: edge_posis_i[0].toString(), target: edge_posis_i[1].toString(), weight: weight, idx: edge_i } });
        }
    }
    else {
        // undirected
        const map_edges_ab = new Map();
        for (const edge_i of Array.from(set_edges_i)) {
            let edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            edge_posis_i = edge_posis_i[0] < edge_posis_i[1] ? edge_posis_i : [edge_posis_i[1], edge_posis_i[0]];
            const undir_edge_id = 'e_' + edge_posis_i[0].toString() + '_' + edge_posis_i[1].toString();
            if (map_edges_ab.has(undir_edge_id)) {
                const obj = map_edges_ab.get(undir_edge_id);
                obj['data']['idx2'] = edge_i;
                // TODO should we take the average of the two weights? Could be more than two...
            }
            else {
                let weight = 1.0;
                if (has_weight_attrib) {
                    weight = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.EDGE, edge_i, 'weight');
                }
                else {
                    const c0 = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                    const c1 = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
                    weight = distance(c0, c1);
                }
                const obj = {
                    data: {
                        id: undir_edge_id,
                        source: edge_posis_i[0].toString(),
                        target: edge_posis_i[1].toString(),
                        weight: weight,
                        idx: edge_i,
                        idx2: null
                    }
                };
                map_edges_ab.set(undir_edge_id, obj);
                elements.push(obj);
            }
        }
    }
    return elements;
}
/**
 * Calculates the shortest path from every position in source, to the closest position in target.
 * \n
 * This differs from the 'analyze.ShortestPath()' function. If you specify multiple target positions,
 * for each cource position,
 * the 'analyze.ShortestPath()' function will calculate multiple shortest paths,
 * i.e. the shortest path to all targets.
 * This function will caculate just one shortest path,
 * i.e. the shortest path to the closest target.
 * \n
 * Paths are calculated through a network of connected edges.
 * For edges to be connected, vertices must be welded.
 * For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.
 * \n
 * If 'directed' is selected, then the edge direction is taken into account. Each edge will be one-way.
 * If 'undirected' is selected, the edge direction is ignored. Each edge will be two-way.
 * \n
 * Each edge can be assigned a weight.
 * The shortest path is the path where the sum of the weights of the edges along the path is the minimum.
 * \n
 * By default, all edges are assigned a weight of 1.
 * Default weights can be overridden by creating a numeric attribute on edges call 'weight'.
 * \n
 * Returns a dictionary containing the shortes paths.
 * \n
 * If 'distances' is selected, the dictionary will contain one list:
 * 1. 'distances': a list of distances.
 * \n
 * If 'counts' is selected, the dictionary will contain four lists:
 * 1. 'posis': a list of positions traversed by the paths,
 * 2. 'posis_count': a list of numbers that count how often each position was traversed.
 * 3. 'edges': a list of edges traversed by the paths,
 * 4. 'edges_count': a list of numbers that count how often each edge was traversed.
 * \n
 * If 'paths' is selected, the dictionary will contain two lists of lists:
 * 1. 'posi_paths': a list of lists of positions, one list for each path.
 * 2. 'edge_paths': a list of lists of edges, one list for each path.
 * \n
 * If 'all' is selected, the dictionary will contain all lists just described.
 * \n
 * @param __model__
 * @param source Path source, a list of positions, or entities from which positions can be extracted.
 * @param target Path source, a list of positions, or entities from which positions can be extracted.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param method Enum, the method to use, directed or undirected.
 * @param result Enum, the data to return, positions, edges, or both.
 * @returns A dictionary containing the results.
 */
export function ClosestPath(__model__, source, target, entities, method, result) {
    source = source === null ? [] : arrMakeFlat(source);
    target = target === null ? [] : arrMakeFlat(target);
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = 'analyze.ClosestPath';
    let source_ents_arrs;
    let target_ents_arrs;
    let ents_arrs;
    if (__model__.debug) {
        source_ents_arrs = checkIDs(__model__, fn_name, 'origins', source, [ID.isID, ID.isIDL1], null);
        target_ents_arrs = checkIDs(__model__, fn_name, 'destinations', target, [ID.isID, ID.isIDL1], null);
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null);
    }
    else {
        // source_ents_arrs = splitIDs(fn_name, 'origins', source,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // target_ents_arrs = splitIDs(fn_name, 'destinations', target,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // ents_arrs = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = idsBreak(source);
        target_ents_arrs = idsBreak(target);
        ents_arrs = idsBreak(entities);
    }
    // --- Error Check ---
    const directed = method === _EShortestPathMethod.DIRECTED ? true : false;
    let return_dists = true;
    let return_counts = true;
    let return_paths = true;
    switch (result) {
        case _EShortestPathResult.DISTS:
            return_paths = false;
            return_counts = false;
            break;
        case _EShortestPathResult.COUNTS:
            return_dists = false;
            return_paths = false;
            break;
        case _EShortestPathResult.PATHS:
            return_dists = false;
            return_counts = false;
            break;
        default:
            // all true
            break;
    }
    const source_posis_i = _getUniquePosis(__model__, source.length === 0 ? ents_arrs : source_ents_arrs);
    const target_posis_i = _getUniquePosis(__model__, target.length === 0 ? ents_arrs : target_ents_arrs);
    const cy_elems = _cytoscapeGetElements(__model__, ents_arrs, source_posis_i, target_posis_i, directed);
    // create the cytoscape object
    const cy = cytoscape({
        elements: cy_elems,
        headless: true,
    });
    const map_edges_i = new Map();
    const map_posis_i = new Map();
    const posi_paths = [];
    const edge_paths = [];
    const path_dists = [];
    for (const source_posi_i of source_posis_i) {
        const cy_source_elem = cy.getElementById(source_posi_i.toString());
        const dijkstra = cy.elements().dijkstra({
            root: cy_source_elem,
            weight: _cytoscapeWeightFn,
            directed: directed
        });
        let closest_target_posi_i = null;
        let closest_dist = Infinity;
        for (const target_posi_i of target_posis_i) {
            // find shortest path
            const dist = dijkstra.distanceTo(cy.getElementById(target_posi_i.toString()));
            if (dist < closest_dist) {
                closest_dist = dist;
                closest_target_posi_i = target_posi_i;
            }
        }
        if (closest_target_posi_i !== null) {
            // get shortest path
            const cy_path = dijkstra.pathTo(cy.getElementById(closest_target_posi_i.toString()));
            // get the data
            const posi_path = [];
            const edge_path = [];
            for (const cy_path_elem of cy_path.toArray()) {
                if (cy_path_elem.isEdge()) {
                    const edge_i = cy_path_elem.data('idx');
                    if (return_counts) {
                        if (!map_edges_i.has(edge_i)) {
                            map_edges_i.set(edge_i, 1);
                        }
                        else {
                            map_edges_i.set(edge_i, map_edges_i.get(edge_i) + 1);
                        }
                        if (!directed) {
                            const edge2_i = cy_path_elem.data('idx2');
                            if (edge2_i !== null) {
                                if (!map_edges_i.has(edge2_i)) {
                                    map_edges_i.set(edge2_i, 1);
                                }
                                else {
                                    map_edges_i.set(edge2_i, map_edges_i.get(edge2_i) + 1);
                                }
                            }
                        }
                    }
                    if (return_paths) {
                        edge_path.push(edge_i);
                    }
                }
                else {
                    const posi_i = cy_path_elem.data('idx');
                    if (return_counts) {
                        if (!map_posis_i.has(posi_i)) {
                            map_posis_i.set(posi_i, 1);
                        }
                        else {
                            map_posis_i.set(posi_i, map_posis_i.get(posi_i) + 1);
                        }
                    }
                    if (return_paths) {
                        posi_path.push(posi_i);
                    }
                }
            }
            if (return_paths) {
                edge_paths.push(edge_path);
                posi_paths.push(posi_path);
            }
            if (return_dists) {
                path_dists.push(closest_dist);
            }
        }
        else {
            if (return_paths) {
                edge_paths.push([]);
                posi_paths.push([]);
            }
            if (return_dists) {
                path_dists.push(1e8); // TODO, cannot pas Infinity due to JSON issues
            }
        }
    }
    const dict = {};
    if (return_dists) {
        dict.source_posis = idsMakeFromIdxs(EEntType.POSI, source_posis_i);
        dict.distances = path_dists;
    }
    if (return_counts) {
        dict.edges = idsMakeFromIdxs(EEntType.EDGE, Array.from(map_edges_i.keys()));
        dict.edges_count = Array.from(map_edges_i.values());
        dict.posis = idsMakeFromIdxs(EEntType.POSI, Array.from(map_posis_i.keys()));
        dict.posis_count = Array.from(map_posis_i.values());
    }
    if (return_paths) {
        dict.edge_paths = idsMakeFromIdxs(EEntType.EDGE, edge_paths);
        dict.posi_paths = idsMakeFromIdxs(EEntType.POSI, posi_paths);
    }
    return dict;
}
// ================================================================================================
export var _ECentralityMethod;
(function (_ECentralityMethod) {
    _ECentralityMethod["UNDIRECTED"] = "undirected";
    _ECentralityMethod["DIRECTED"] = "directed";
})(_ECentralityMethod || (_ECentralityMethod = {}));
function _cyGetPosisAndElements(__model__, ents_arr, posis_i, directed) {
    let has_weight_attrib = false;
    if (__model__.modeldata.attribs.query.hasEntAttrib(EEntType.EDGE, 'weight')) {
        has_weight_attrib = __model__.modeldata.attribs.query.getAttribDataType(EEntType.EDGE, 'weight') === EAttribDataTypeStrs.NUMBER;
    }
    // edges, starts empty
    const set_edges_i = new Set();
    // posis, starts with posis_i
    const set_posis_i = new Set(posis_i);
    // network
    for (const [ent_type, ent_i] of ents_arr) {
        const n_edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const edge_i of n_edges_i) {
            set_edges_i.add(edge_i);
        }
        const n_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        for (const posi_i of n_posis_i) {
            set_posis_i.add(posi_i);
        }
    }
    // all unique posis
    const uniq_posis_i = Array.from(set_posis_i);
    // create elements
    const elements = [];
    for (const posi_i of uniq_posis_i) {
        elements.push({ data: { id: posi_i.toString(), idx: posi_i } });
    }
    if (directed) {
        // directed
        for (const edge_i of Array.from(set_edges_i)) {
            const edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            let weight = 1.0;
            if (has_weight_attrib) {
                weight = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.EDGE, edge_i, 'weight');
            }
            else {
                // const c0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                // const c1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
                weight = 1; // distance(c0, c1);
            }
            elements.push({ data: { id: 'e' + edge_i,
                    source: edge_posis_i[0].toString(), target: edge_posis_i[1].toString(), weight: weight, idx: edge_i } });
        }
    }
    else {
        // undirected
        const map_edges_ab = new Map();
        for (const edge_i of Array.from(set_edges_i)) {
            let edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            edge_posis_i = edge_posis_i[0] < edge_posis_i[1] ? edge_posis_i : [edge_posis_i[1], edge_posis_i[0]];
            const undir_edge_id = 'e_' + edge_posis_i[0].toString() + '_' + edge_posis_i[1].toString();
            if (map_edges_ab.has(undir_edge_id)) {
                const obj = map_edges_ab.get(undir_edge_id);
                obj['data']['idx2'] = edge_i;
                // TODO should we take the average of the two weights? Could be more than two...
            }
            else {
                let weight = 1.0;
                if (has_weight_attrib) {
                    weight = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.EDGE, edge_i, 'weight');
                }
                else {
                    // const c0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                    // const c1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
                    weight = 1; // distance(c0, c1);
                }
                const obj = {
                    data: {
                        id: undir_edge_id,
                        source: edge_posis_i[0].toString(),
                        target: edge_posis_i[1].toString(),
                        weight: weight,
                        idx: edge_i,
                        idx2: null
                    }
                };
                map_edges_ab.set(undir_edge_id, obj);
                elements.push(obj);
            }
        }
    }
    return [elements, uniq_posis_i];
}
// ================================================================================================
/**
 * Calculates degree centrality for positions in a network. Values are normalized in the range 0 to 1.
 * \n
 * The network is defined by a set of connected edges, consisting of polylines and/or polygons.
 * For edges to be connected, vertices must be welded.
 * For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.
 * \n
 * Degree centrality is based on the idea that the centrality of a position in a network is related to
 * the number of direct links that it has to other positions.
 * \n
 * If 'undirected' is selected,  degree centrality is calculated by summing up the weights
 * of all edges connected to a position.
 * If 'directed' is selected, then two types of centrality are calculated: incoming degree and
 * outgoing degree.
 * Incoming degree is calculated by summing up the weights of all incoming edges connected to a position.
 * Outgoing degree is calculated by summing up the weights of all outgoing edges connected to a position.
 * \n
 * Default weight is 1 for all edges. Weights can be specified using an attribute called 'weight' on edges.
 * \n
 * Returns a dictionary containing the results.
 * \n
 * If 'undirected' is selected, the dictionary will contain  the following:
 * 1. 'posis': a list of position IDs.
 * 2. 'degree': a list of numbers, the values for degree centrality.
 * \n
 * If 'directed' is selected, the dictionary will contain  the following:
 * 1. 'posis': a list of position IDs.
 * 2. 'indegree': a list of numbers, the values for incoming degree centrality.
 * 3. 'outdegree': a list of numbers, the values for outgoing degree centrality.
 * \n
 * @param __model__
 * @param source A list of positions, or entities from which positions can be extracted.
 * These positions should be part of the network.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param alpha The alpha value for the centrality calculation, ranging on [0, 1]. With value 0,
 * disregards edge weights and solely uses number of edges in the centrality calculation. With value 1,
 * disregards number of edges and solely uses the edge weights in the centrality calculation.
 * @param method Enum, the method to use, directed or undirected.
 * @returns A dictionary containing the results.
 */
export function Degree(__model__, source, entities, alpha, method) {
    // source posis and network entities
    if (source === null) {
        source = [];
    }
    else {
        source = arrMakeFlat(source);
    }
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = 'analyze.Degree';
    let source_ents_arrs = [];
    let ents_arrs;
    if (__model__.debug) {
        if (source.length > 0) {
            source_ents_arrs = checkIDs(__model__, fn_name, 'source', source, [ID.isID, ID.isIDL1], null);
        }
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null);
    }
    else {
        // if (source.length > 0) {
        //     source_ents_arrs = splitIDs(fn_name, 'source', source,
        //         [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // }
        // ents_arrs = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = idsBreak(source);
        ents_arrs = idsBreak(entities);
    }
    // --- Error Check ---
    const directed = method === _ECentralityMethod.DIRECTED ? true : false;
    const source_posis_i = _getUniquePosis(__model__, source_ents_arrs);
    // TODO deal with source === null
    const [elements, graph_posis_i] = _cyGetPosisAndElements(__model__, ents_arrs, source_posis_i, directed);
    // create the cytoscape object
    const cy_network = cytoscape({
        elements: elements,
        headless: true,
    });
    const posis_i = source_ents_arrs.length === 0 ? graph_posis_i : source_posis_i;
    if (directed) {
        return _centralityDegreeDirected(posis_i, cy_network, alpha);
    }
    else {
        return _centralityDegreeUndirected(posis_i, cy_network, alpha);
    }
}
function _centralityDegreeDirected(posis_i, cy_network, alpha) {
    const indegree = [];
    const outdegree = [];
    const cy_centrality = cy_network.elements().degreeCentralityNormalized({
        weight: _cytoscapeWeightFn,
        alpha: alpha,
        directed: true
    });
    for (const posi_i of posis_i) {
        const source_elem = cy_network.getElementById(posi_i.toString());
        indegree.push(cy_centrality.indegree(source_elem));
        outdegree.push(cy_centrality.outdegree(source_elem));
    }
    return {
        'posis': idsMakeFromIdxs(EEntType.POSI, posis_i),
        'indegree': indegree,
        'outdegree': outdegree
    };
}
function _centralityDegreeUndirected(posis_i, cy_network, alpha) {
    const degree = [];
    const cy_centrality = cy_network.elements().degreeCentralityNormalized({
        weight: _cytoscapeWeightFn,
        alpha: alpha,
        directed: false
    });
    for (const posi_i of posis_i) {
        const source_elem = cy_network.getElementById(posi_i.toString());
        degree.push(cy_centrality.degree(source_elem));
    }
    return {
        'posis': idsMakeFromIdxs(EEntType.POSI, posis_i),
        'degree': degree
    };
}
// ================================================================================================
export var _ECentralityType;
(function (_ECentralityType) {
    _ECentralityType["BETWEENNESS"] = "betweenness";
    _ECentralityType["CLOSENESS"] = "closeness";
    _ECentralityType["HARMONIC"] = "harmonic";
})(_ECentralityType || (_ECentralityType = {}));
/**
 * Calculates betweenness, closeness, and harmonic centrality
 * for positions in a network. Values are normalized in the range 0 to 1.
 * \n
 * The network is defined by a set of connected edges, consisting of polylines and/or polygons.
 * For edges to be connected, vertices must be welded.
 * For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.
 * \n
 * Centralities are calculate based on distances between positions.
 * The distance between two positions is the shortest path between those positions.
 * The shortest path is the path where the sum of the weights of the edges along the path is the minimum.
 * \n
 * Default weight is 1 for all edges. Weights can be specified using an attribute called 'weight' on edges.
 * \n
 * Closeness centrality is calculated by inverting the sum of the distances to all other positions.
 * \n
 * Harmonic centrality is calculated by summing up the inverted distances to all other positions.
 * \n
 * Betweenness centrality os calculated in two steps.
 * First, the shortest path between every pair of nodes is calculated.
 * Second, the betweenness centrality of each node is then the total number of times the node is traversed
 * by the shortest paths.
 * \n
 * For closeness centrality, the network is first split up into connected sub-networks.
 * This is because closeness centrality cannot be calculated on networks that are not fully connected.
 * The closeness centrality is then calculated for each sub-network seperately.
 * \n
 * For harmonic centrality, care must be taken when defining custom weights.
 * Weight with zero values or very small values will result in errors or will distort the results.
 * This is due to the inversion operation: 1 / weight.
 * \n
 * Returns a dictionary containing the results.
 * \n
 * 1. 'posis': a list of position IDs.
 * 2. 'centrality': a list of numbers, the values for centrality, either betweenness, closeness, or harmonic.
 * \n
 * @param __model__
 * @param source A list of positions, or entities from which positions can be extracted.
 * These positions should be part of the network.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param method Enum, the method to use, directed or undirected.
 * @param cen_type Enum, the data to return, positions, edges, or both.
 * @returns A list of centrality values, between 0 and 1.
 */
export function Centrality(__model__, source, entities, method, cen_type) {
    // source posis and network entities
    if (source === null) {
        source = [];
    }
    else {
        source = arrMakeFlat(source);
    }
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = 'analyze.Centrality';
    let source_ents_arrs = [];
    let ents_arrs;
    if (__model__.debug) {
        if (source.length > 0) {
            source_ents_arrs = checkIDs(__model__, fn_name, 'source', source, [ID.isID, ID.isIDL1], null);
        }
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null);
    }
    else {
        // if (source.length > 0) {
        //     source_ents_arrs = splitIDs(fn_name, 'source', source,
        //         [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // }
        // ents_arrs = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = idsBreak(source);
        ents_arrs = idsBreak(entities);
    }
    // --- Error Check ---
    const directed = method === _ECentralityMethod.DIRECTED ? true : false;
    const source_posis_i = _getUniquePosis(__model__, source_ents_arrs);
    // TODO deal with source === null
    const [elements, graph_posis_i] = _cyGetPosisAndElements(__model__, ents_arrs, source_posis_i, directed);
    // create the cytoscape object
    const cy_network = cytoscape({
        elements: elements,
        headless: true,
    });
    // calculate the centrality
    const posis_i = source_ents_arrs.length === 0 ? graph_posis_i : source_posis_i;
    switch (cen_type) {
        case _ECentralityType.CLOSENESS:
            return _centralityCloseness(posis_i, cy_network, directed);
        case _ECentralityType.HARMONIC:
            return _centralityHarmonic(posis_i, cy_network, directed);
        case _ECentralityType.BETWEENNESS:
            return _centralityBetweenness(posis_i, cy_network, directed);
        default:
            throw new Error('Centrality type not recognised.');
    }
}
function _centralityCloseness(posis_i, cy_network, directed) {
    const results = [];
    const result_posis_i = [];
    const comps = [];
    const cy_colls = cy_network.elements().components();
    cy_colls.sort((a, b) => b.length - a.length);
    for (const cy_coll of cy_colls) {
        const comp = [];
        const cy_centrality = cy_coll.closenessCentralityNormalized({
            weight: _cytoscapeWeightFn,
            harmonic: false,
            directed: directed
        });
        for (const posi_i of posis_i) {
            const source_elem = cy_coll.getElementById(posi_i.toString());
            if (source_elem.length === 0) {
                continue;
            }
            const result = cy_centrality.closeness(source_elem);
            if (isNaN(result)) {
                throw new Error('Error calculating closeness centrality.');
            }
            result_posis_i.push(posi_i);
            comp.push(posi_i);
            results.push(result);
        }
        comps.push(comp);
    }
    return {
        'posis': idsMakeFromIdxs(EEntType.POSI, result_posis_i),
        'centrality': results
    };
}
function _centralityHarmonic(posis_i, cy_network, directed) {
    const results = [];
    const cy_centrality = cy_network.elements().closenessCentralityNormalized({
        weight: _cytoscapeWeightFn,
        harmonic: true,
        directed: directed
    });
    for (const posi_i of posis_i) {
        const source_elem = cy_network.getElementById(posi_i.toString());
        if (source_elem.length === 0) {
            continue;
        }
        const result = cy_centrality.closeness(source_elem);
        if (isNaN(result)) {
            throw new Error('Error calculating harmonic centrality.');
        }
        results.push(result);
    }
    return {
        'posis': idsMakeFromIdxs(EEntType.POSI, posis_i),
        'centrality': results
    };
}
function _centralityBetweenness(posis_i, cy_network, directed) {
    const results = [];
    const cy_centrality = cy_network.elements().betweennessCentrality({
        weight: _cytoscapeWeightFn,
        directed: directed
    });
    for (const posi_i of posis_i) {
        const source_elem = cy_network.getElementById(posi_i.toString());
        const result = cy_centrality.betweennessNormalized(source_elem);
        if (isNaN(result)) {
            throw new Error('Error calculating betweenness centrality.');
        }
        results.push(result);
    }
    return {
        'posis': idsMakeFromIdxs(EEntType.POSI, posis_i),
        'centrality': results
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHl6ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGVzL2Jhc2ljL2FuYWx5emUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUVILE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFaEQsT0FBTyxLQUFLLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQztBQUcxQyxPQUFPLEVBQWEsUUFBUSxFQUN4QixtQkFBbUIsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxlQUFlLEVBQVcsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLDZEQUE2RCxDQUFDO0FBQ3pILE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUM1RSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0saURBQWlELENBQUM7QUFDakksT0FBTyxNQUFNLE1BQU0sWUFBWSxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDeEYsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQzVFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQ3hGLE9BQU8sU0FBUyxNQUFNLFdBQVcsQ0FBQztBQUNsQyxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMvQixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdURBQXVELENBQUM7QUFDeEYsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDdEYsT0FBTyxFQUFFLEtBQUssRUFBRSxL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