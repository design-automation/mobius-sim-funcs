/**
 * The `analysis` module has functions for performing various types of analysis with entities in
 * the model. These functions all return dictionaries containing the results of the analysis.
 * @module
 */
import { GIModel, TPlane, TRay, Txyz } from '@design-automation/mobius-sim';

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
    __enum__ = {
        ...Enum
    }

    // Document Enums here
    __enum_args__ = {
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


    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }

    Centrality(source: string | string[] | string[][][], entities: string | string[] | string[][], method: Enum._ECentralityMethod, cen_type: Enum._ECentralityType): any {
        return Centrality(this.__model__, source, entities, method, cen_type);
    }
    ClosestPath(source: string | string[] | string[][][], target: string | string[] | string[][], entities: string | string[] | string[][], method: Enum._EShortestPathMethod, result: Enum._EShortestPathResult): any {
        return ClosestPath(this.__model__, source, target, entities, method, result);
    }
    Degree({ source, entities, alpha, method }: { source: any; entities: any; alpha: any; method: any; }): any {
        return Degree(this.__model__, source, entities, alpha, method);
    }
    Isovist(origins: TRay[] | TPlane[], entities: string | string[] | string[][], radius: number, num_rays: number): any {
        return Isovist(this.__model__, origins, entities, radius, num_rays);
    }
    Nearest(source: string | string[], target: string | string[], radius: number, max_neighbors: number): any {
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
