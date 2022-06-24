/**
 * The `analysis` module has functions for performing various types of analysis with entities in
 * the model. These functions all return dictionaries containing the results of the analysis.
 * @module
 */
import { Sim, ENT_TYPE } from '../../mobius_sim';
import { Txyz, TPlane, TRay, Txy } from '../_common/consts';
import uscore from 'underscore';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

import * as Enum from './_enum';
import { Centrality } from './Centrality';
import { ClosestPath } from './ClosestPath';
import { Degree } from './Degree';
import { Isovist } from './Isovist';
import { Nearest } from './Nearest';
import { Raytrace } from './Raytrace';
import { ShortestPath } from './ShortestPath';
import { Sky } from './Sky';
import { SkyDome } from './SkyDome';
import { Sun } from './Sun';
import { View } from './View';
import { Visibility } from './Visibility';

export { Raytrace }

export { Isovist }

export { Sky }

export { Sun }

export { SkyDome }

export { Nearest }

export { ShortestPath }

export { ClosestPath }

export { Degree }

export { Centrality }

export { View }

export { Visibility }

// CLASS DEFINITION
export class AnalyzeFunc {
    // to be removed

    // Document Enums here
    __enum__ = {
        Centrality: {
            method: Enum._ECentralityMethod, cen_type: Enum._ECentralityType
        },
        ClosestPath: {
            method: Enum._EShortestPathMethod, result: Enum._EShortestPathResult
        },
        Raytrace: {
            method: Enum._ERaytraceMethod
        },
        ShortestPath: {
            method: Enum._EShortestPathMethod, result: Enum._EShortestPathResult
        },
        Sky: {
            method: Enum._ESkyMethod
        },
        SkyDome: {
            method: Enum._ESunPathMethod
        },
        Sun: {
            method: Enum._ESolarMethod
        },
    };


    public __model__: Sim;
    public debug: boolean;
    constructor(model: Sim, debug: boolean) {
        this.__model__ = model;
        this.debug = debug;
    }

    Centrality(source: string | string[] | string[][][], entities: string | string[] | string[][], method: Enum._ECentralityMethod, cen_type: Enum._ECentralityType): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = "analyze.Centrality";
            if (source.length > 0) {
                checkIDs(this.__model__, fn_name, "source", source, [ID.isID, ID.isIDL1], null) as string[];
            }
            checkIDs(this.__model__, fn_name, "entities", entities, [ID.isID, ID.isIDL1], null) as string[];
        }
        // --- Error Check ---
        return Centrality(this.__model__, source, entities, method, cen_type);
    }
    ClosestPath(source: string | string[] | string[][][], target: string | string[] | string[][], entities: string | string[] | string[][], method: Enum._EShortestPathMethod, result: Enum._EShortestPathResult): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = "analyze.ClosestPath";
            checkIDs(this.__model__, fn_name, "origins", source, [ID.isID, ID.isIDL1], null) as string[];
            checkIDs(this.__model__, fn_name, "destinations", target, [ID.isID, ID.isIDL1], null) as string[];
            checkIDs(this.__model__, fn_name, "entities", entities, [ID.isID, ID.isIDL1], null) as string[];
        }
        // --- Error Check ---
        return ClosestPath(this.__model__, source, target, entities, method, result);
    }
    Degree({ source, entities, alpha, method }: { source: any; entities: any; alpha: any; method: any; }): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = "analyze.Degree";
            if (source.length > 0) {
                checkIDs(this.__model__, fn_name, "source", source, [ID.isID, ID.isIDL1], null) as string[];
            }
            checkIDs(this.__model__, fn_name, "entities", entities, [ID.isID, ID.isIDL1], null) as string[];
        }
        // --- Error Check ---
        return Degree(this.__model__, source, entities, alpha, method);
    }
    Isovist(origins: TRay[] | TPlane[], entities: string | string[] | string[][], radius: number, num_rays: number): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = "analyze.Isovist";
            chk.checkArgs(fn_name, "origins", origins, [chk.isRayL, chk.isPlnL]);
            checkIDs(this.__model__, fn_name, "entities", entities, [ID.isIDL1], [ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
            chk.checkArgs(fn_name, "radius", radius, [chk.isNum, chk.isNumL]);
            if (Array.isArray(radius)) {
                if (radius.length !== 2) {
                    throw new Error('If "radius" is a list, it must have a length of two: [min_dist, max_dist].');
                }
                if (radius[0] >= radius[1]) {
                    throw new Error('If "radius" is a list, the "min_dist" must be less than the "max_dist": [min_dist, max_dist].');
                }
            }
        }
        // --- Error Check ---
        return Isovist(this.__model__, origins, entities, radius, num_rays);
    }
    Nearest(source: string | string[], target: string | string[], radius: number, max_neighbors: number): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = "analyze.Nearest";
            checkIDs(this.__model__, fn_name, "origins", source, [ID.isID, ID.isIDL1], null) as string[];
            checkIDs(this.__model__, fn_name, "destinations", target, [ID.isID, ID.isIDL1], null) as string[];
        }
        // --- Error Check ---
        return Nearest(this.__model__, source, target, radius, max_neighbors);
    }
    Raytrace(rays: TRay | TRay[] | TRay[][], entities: string | string[] | string[][], dist: number | [number, number], method: Enum._ERaytraceMethod): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = "analyze.Raytrace";
            chk.checkArgs(fn_name, "rays", rays, [chk.isRay, chk.isRayL, chk.isRayLL]);
            checkIDs(this.__model__, fn_name, "entities", entities, [ID.isID, ID.isIDL1], [ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
            chk.checkArgs(fn_name, "dist", dist, [chk.isNum, chk.isNumL]);
            if (Array.isArray(dist)) {
                if (dist.length !== 2) {
                    throw new Error('If "dist" is a list, it must have a length of two: [min_dist, max_dist].');
                }
                if (dist[0] >= dist[1]) {
                    throw new Error('If "dist" is a list, the "min_dist" must be less than the "max_dist": [min_dist, max_dist].');
                }
            }
        }
        // --- Error Check ---    
        return Raytrace(this.__model__, rays, entities, dist, method);
    }
    ShortestPath(source: string | string[] | string[][][], target: string | string[] | string[][], entities: string | string[] | string[][], method: Enum._EShortestPathMethod, result: Enum._EShortestPathResult): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = "analyze.ShortestPath";
            checkIDs(this.__model__, fn_name, "origins", source, [ID.isID, ID.isIDL1], null) as string[];
            checkIDs(this.__model__, fn_name, "destinations", target, [ID.isID, ID.isIDL1], null) as string[];
            checkIDs(this.__model__, fn_name, "entities", entities, [ID.isID, ID.isIDL1], null) as string[];
        } 
        // --- Error Check ---    
        return ShortestPath(this.__model__, source, target, entities, method, result);
    }
    Sky(origins: TRay[] | TPlane[] | Txyz[], detail: number, entities: string | string[] | string[][], limits: number | [number, number], method: Enum._ESkyMethod): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = "analyze.Sky";
            chk.checkArgs(fn_name, "origins", origins, [chk.isXYZL, chk.isRayL, chk.isPlnL]);
            chk.checkArgs(fn_name, "detail", detail, [chk.isInt]);
            if (detail < 0 || detail > 3) {
                throw new Error(fn_name + ': "detail" must be an integer between 0 and 3 inclusive.');
            }
            checkIDs(this.__model__, fn_name, "entities", entities, [ID.isID, ID.isIDL1], [ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
        } 
        // --- Error Check ---    
        return Sky(this.__model__, origins, detail, entities, limits, method);
    }
    SkyDome(origin: TRay | TPlane | Txyz, detail: number, radius: number, method: Enum._ESunPathMethod): any {
        // --- Error Check ---
        const fn_name = "analyze.SkyDome";
        let latitude: number = null;
        let north: Txy = [0, 1];
        if (this.debug) {
            chk.checkArgs(fn_name, "origin", origin, [chk.isXYZ, chk.isRay, chk.isPln]);
            chk.checkArgs(fn_name, "detail", detail, [chk.isInt]);
            if (detail < 0 || detail > 6) {
                throw new Error(fn_name + ': "detail" must be an integer between 0 and 6.');
            }
            chk.checkArgs(fn_name, "radius", radius, [chk.isNum]);
            if (method !== _ESunPathMethod.SKY) {
                if (!this.__model__.modeldata.attribs.query.hasModelAttrib("geolocation")) {
                    throw new Error(
                        'analyze.Solar: model attribute "geolocation" is missing, \
                        e.g. @geolocation = {"latitude":12, "longitude":34}'
                    );
                } else {
                    const geolocation = this.__model__.modeldata.attribs.get.getModelAttribVal("geolocation");
                    if (uscore.isObject(geolocation) && uscore.has(geolocation, "latitude")) {
                        latitude = geolocation["latitude"];
                    } else {
                        throw new Error(
                            'analyze.Solar: model attribute "geolocation" is missing the "latitude" key, \
                            e.g. @geolocation = {"latitude":12, "longitude":34}'
                        );
                    }
                }
                if (this.__model__.modeldata.attribs.query.hasModelAttrib("north")) {
                    north = this.__model__.modeldata.attribs.get.getModelAttribVal("north") as Txy;
                    if (!Array.isArray(north) || north.length !== 2) {
                        throw new Error(
                            'analyze.Solar: model has a "north" attribute with the wrong type, \
                        it should be a vector with two values, \
                        e.g. @north =  [1,2]'
                        );
                    }
            }
        }
    } 
    // TODO are below needed for skydome
    // else {
    //     const geolocation = this.__model__.modeldata.attribs.get.getModelAttribVal("geolocation");
    //     latitude = geolocation["latitude"];
    //     if (this.__model__.modeldata.attribs.query.hasModelAttrib("north")) {
    //         north = this.__model__.modeldata.attribs.get.getModelAttribVal("north") as Txy;
    //     }
    // }
    // --- Error Check ---    
        return SkyDome(this.__model__, origin, detail, radius, method);
    }
    Sun(origins: TRay[] | TPlane[] | Txyz[], detail: number, entities: string | string[] | string[][], limits: number | [number, number], method: Enum._ESolarMethod): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = "analyze.Sun";
            let north: Txy = [0, 1];
            let latitude: number = null;
            chk.checkArgs(fn_name, "origins", origins, [chk.isXYZL, chk.isRayL, chk.isPlnL]);
            chk.checkArgs(fn_name, "detail", detail, [chk.isInt]);
            if (detail < 0 || detail > 3) {
                throw new Error(fn_name + ': "detail" must be an integer between 0 and 3 inclusive.');
            }
            checkIDs(this.__model__, fn_name, "entities", entities, [ID.isID, ID.isIDL1], [ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
            if (!this.__model__.modeldata.attribs.query.hasModelAttrib("geolocation")) {
                throw new Error(
                    'analyze.Solar: model attribute "geolocation" is missing, \
                    e.g. @geolocation = {"latitude":12, "longitude":34}'
                );
            } else {
                const geolocation = this.__model__.modeldata.attribs.get.getModelAttribVal("geolocation");
                if (uscore.isObject(geolocation) && uscore.has(geolocation, "latitude")) {
                    latitude = geolocation["latitude"];
                } else {
                    throw new Error(
                        'analyze.Solar: model attribute "geolocation" is missing the "latitude" key, \
                        e.g. @geolocation = {"latitude":12, "longitude":34}'
                    );
                }
            }
            if (this.__model__.modeldata.attribs.query.hasModelAttrib("north")) {
                north = this.__model__.modeldata.attribs.get.getModelAttribVal("north") as Txy;
                if (!Array.isArray(north) || north.length !== 2) {
                    throw new Error(
                        'analyze.Solar: model has a "north" attribute with the wrong type, \
                    it should be a vector with two values, \
                    e.g. @north =  [1,2]'
                    );
                }
            }
        } 
    // TODO are the below needed
    // else {
    //         const geolocation = this.__model__.modeldata.attribs.get.getModelAttribVal("geolocation");
    //         latitude = geolocation["latitude"];
    //         if (this.__model__.modeldata.attribs.query.hasModelAttrib("north")) {
    //             north = this.__model__.modeldata.attribs.get.getModelAttribVal("north") as Txy;
    //         }
    // 
    // TODO
    // --- Error Check ---    
        return Sun(this.__model__, origins, detail, entities, limits, method);
    }
    View(origins: TRay[] | TPlane[], entities: string | string[] | string[][], radius: number, num_rays: number, view_ang: number): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = "analyze.View";
            chk.checkArgs(fn_name, "origins", origins, [chk.isRayL, chk.isPlnL]);
            checkIDs(this.__model__, fn_name, "entities", entities, [ID.isIDL1], [ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
            chk.checkArgs(fn_name, "radius", radius, [chk.isNum, chk.isNumL]);
            if (Array.isArray(radius)) {
                if (radius.length !== 2) {
                    throw new Error('If "radius" is a list, it must have a length of two: [min_dist, max_dist].');
                }
                if (radius[0] >= radius[1]) {
                    throw new Error('If "radius" is a list, the "min_dist" must be less than the "max_dist": [min_dist, max_dist].');
                }
            }
            chk.checkArgs(fn_name, "num_rays", num_rays, [chk.isNum]);
            chk.checkArgs(fn_name, "view_ang", view_ang, [chk.isNum]);
        } 
        // --- Error Check ---    
        return View(this.__model__, origins, entities, radius, num_rays, view_ang);
    }
    Visibility(origins: TRay[] | TPlane[] | Txyz[], entities: string | string[] | string[][], radius: number, targets: string | string[] | string[][]): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = "analyze.View";
            chk.checkArgs(fn_name, "origins", origins, [chk.isRayL, chk.isPlnL]);
            checkIDs(this.__model__, fn_name, "entities", entities, [ID.isIDL1], [ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
            chk.checkArgs(fn_name, "radius", radius, [chk.isNum, chk.isNumL]);
            if (Array.isArray(radius)) {
                if (radius.length !== 2) {
                    throw new Error('If "radius" is a list, it must have a length of two: [min_dist, max_dist].');
                }
                if (radius[0] >= radius[1]) {
                    throw new Error('If "radius" is a list, the "min_dist" must be less than the "max_dist": [min_dist, max_dist].');
                }
            }
            checkIDs(this.__model__, fn_name, "targets", targets, [ID.isIDL1], null) as string[];
        } 
        // --- Error Check ---    
        return Visibility(this.__model__, origins, entities, radius, targets);
    }
}
