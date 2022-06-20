/**
 * The `analysis` module has functions for performing various types of analysis with entities in
 * the model. These functions all return dictionaries containing the results of the analysis.
 * @module
 */
import { Sim, ENT_TYPE } from '../../mobius_sim';
import { Txyz, TPlane, TRay } from '../_common/consts';

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
        return Raytrace(this.__model__, rays, entities, dist, method);
    }
    ShortestPath(source: string | string[] | string[][][], target: string | string[] | string[][], entities: string | string[] | string[][], method: Enum._EShortestPathMethod, result: Enum._EShortestPathResult): any {
        return ShortestPath(this.__model__, source, target, entities, method, result);
    }
    Sky(origins: TRay[] | TPlane[] | Txyz[], detail: number, entities: string | string[] | string[][], limits: number | [number, number], method: Enum._ESkyMethod): any {
        return Sky(this.__model__, origins, detail, entities, limits, method);
    }
    SkyDome(origin: TRay | TPlane | Txyz, detail: number, radius: number, method: Enum._ESunPathMethod): any {
        return SkyDome(this.__model__, origin, detail, radius, method);
    }
    Sun(origins: TRay[] | TPlane[] | Txyz[], detail: number, entities: string | string[] | string[][], limits: number | [number, number], method: Enum._ESolarMethod): any {
        return Sun(this.__model__, origins, detail, entities, limits, method);
    }
    View(origins: TRay[] | TPlane[], entities: string | string[] | string[][], radius: number, num_rays: number, view_ang: number): any {
        return View(this.__model__, origins, entities, radius, num_rays, view_ang);
    }
    Visibility(origins: TRay[] | TPlane[] | Txyz[], entities: string | string[] | string[][], radius: number, targets: string | string[] | string[][]): any {
        return Visibility(this.__model__, origins, entities, radius, targets);
    }
}
