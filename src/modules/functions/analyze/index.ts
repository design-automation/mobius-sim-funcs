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
    Centrality(source, entities, method, cen_type): any {
        return Centrality(this.__model__, source, entities, method, cen_type);
    }
    ClosestPath(source, target, entities, method, result): any {
        return ClosestPath(this.__model__, source, target, entities, method, result);
    }
    Degree(source, entities, alpha, method): any {
        return Degree(this.__model__, source, entities, alpha, method);
    }
    Isovist(origins, entities, radius, num_rays): any {
        return Isovist(this.__model__, origins, entities, radius, num_rays);
    }
    Nearest(source, target, radius, max_neighbors): any {
        return Nearest(this.__model__, source, target, radius, max_neighbors);
    }
    Raytrace(rays, entities, dist, method): any {
        return Raytrace(this.__model__, rays, entities, dist, method);
    }
    ShortestPath(source, target, entities, method, result): any {
        return ShortestPath(this.__model__, source, target, entities, method, result);
    }
    Sky(origins, detail, entities, limits, method): any {
        return Sky(this.__model__, origins, detail, entities, limits, method);
    }
    SkyDome(origin, detail, radius, method): any {
        return SkyDome(this.__model__, origin, detail, radius, method);
    }
    Sun(origins, detail, entities, limits, method): any {
        return Sun(this.__model__, origins, detail, entities, limits, method);
    }

}
