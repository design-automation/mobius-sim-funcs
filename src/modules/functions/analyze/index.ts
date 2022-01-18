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


// CLASS DEFINITION
export class AnalyzeFunc {
    __enum__ = {
        ...Enum
    }

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    async Centrality(source, entities, method, cen_type): Promise<any> {
        return Centrality(this.__model__, source, entities, method, cen_type);
    }
    async ClosestPath(source, target, entities, method, result): Promise<any> {
        return ClosestPath(this.__model__, source, target, entities, method, result);
    }
    async Degree(source, entities, alpha, method): Promise<any> {
        return Degree(this.__model__, source, entities, alpha, method);
    }
    async Isovist(origins, entities, radius, num_rays): Promise<any> {
        return Isovist(this.__model__, origins, entities, radius, num_rays);
    }
    async Nearest(source, target, radius, max_neighbors): Promise<any> {
        return Nearest(this.__model__, source, target, radius, max_neighbors);
    }
    async Raytrace(rays, entities, dist, method): Promise<any> {
        return Raytrace(this.__model__, rays, entities, dist, method);
    }
    async ShortestPath(source, target, entities, method, result): Promise<any> {
        return ShortestPath(this.__model__, source, target, entities, method, result);
    }
    async Sky(origins, detail, entities, limits, method): Promise<any> {
        return Sky(this.__model__, origins, detail, entities, limits, method);
    }
    async SkyDome(origin, detail, radius, method): Promise<any> {
        return SkyDome(this.__model__, origin, detail, radius, method);
    }
    async Sun(origins, detail, entities, limits, method): Promise<any> {
        return Sun(this.__model__, origins, detail, entities, limits, method);
    }

}
