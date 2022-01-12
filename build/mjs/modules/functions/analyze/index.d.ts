/**
 * The `analysis` module has functions for performing various types of analysis with entities in
 * the model. These functions all return dictionaries containing the results of the analysis.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';
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
export { Raytrace };
export { Isovist };
export { Sky };
export { Sun };
export { SkyDome };
export { Nearest };
export { ShortestPath };
export { ClosestPath };
export { Degree };
export { Centrality };
export declare class AnalyzeFunc {
    __model__: GIModel;
    __enum__: {
        /**
         * The `analysis` module has functions for performing various types of analysis with entities in
         * the model. These functions all return dictionaries containing the results of the analysis.
         * @module
         */
        _ECentralityMethod: typeof Enum._ECentralityMethod;
        _ECentralityType: typeof Enum._ECentralityType;
        _EShortestPathMethod: typeof Enum._EShortestPathMethod;
        _EShortestPathResult: typeof Enum._EShortestPathResult;
        _ERaytraceMethod: typeof Enum._ERaytraceMethod;
        _ESkyMethod: typeof Enum._ESkyMethod;
        _ESunPathMethod: typeof Enum._ESunPathMethod;
        _ESolarMethod: typeof Enum._ESolarMethod;
    };
    constructor(model: GIModel);
    Raytrace(rays: any, entities: any, dist: any, method: any): any;
    Isovist(origins: any, entities: any, radius: any, num_rays: any): any;
    Sky(origins: any, detail: any, entities: any, limits: any, method: any): any;
    Sun(origins: any, detail: any, entities: any, limits: any, method: any): any;
    SkyDome(origin: any, detail: any, radius: any, method: any): any;
    Nearest(source: any, target: any, radius: any, max_neighbors: any): any;
    ShortestPath(source: any, target: any, entities: any, method: any, result: any): any;
    ClosestPath(source: any, target: any, entities: any, method: any, result: any): any;
    Degree(source: any, entities: any, alpha: any, method: any): any;
    Centrality(source: any, entities: any, method: any, cen_type: any): any;
}
