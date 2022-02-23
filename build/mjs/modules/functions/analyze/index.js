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
// CLASS DEFINITION
export class AnalyzeFunc {
    constructor(model) {
        this.__enum__ = {
            ...Enum
        };
        this.__model__ = model;
    }
    Centrality(source, entities, method, cen_type) {
        return Centrality(this.__model__, source, entities, method, cen_type);
    }
    ClosestPath(source, target, entities, method, result) {
        return ClosestPath(this.__model__, source, target, entities, method, result);
    }
    Degree(source, entities, alpha, method) {
        return Degree(this.__model__, source, entities, alpha, method);
    }
    Isovist(origins, entities, radius, num_rays) {
        return Isovist(this.__model__, origins, entities, radius, num_rays);
    }
    Nearest(source, target, radius, max_neighbors) {
        return Nearest(this.__model__, source, target, radius, max_neighbors);
    }
    Raytrace(rays, entities, dist, method) {
        return Raytrace(this.__model__, rays, entities, dist, method);
    }
    ShortestPath(source, target, entities, method, result) {
        return ShortestPath(this.__model__, source, target, entities, method, result);
    }
    Sky(origins, detail, entities, limits, method) {
        return Sky(this.__model__, origins, detail, entities, limits, method);
    }
    SkyDome(origin, detail, radius, method) {
        return SkyDome(this.__model__, origin, detail, radius, method);
    }
    Sun(origins, detail, entities, limits, method) {
        return Sun(this.__model__, origins, detail, entities, limits, method);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYW5hbHl6ZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPQSxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUNoQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDcEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUM1QixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFHNUIsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFBO0FBRW5CLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQTtBQUVsQixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUE7QUFFZCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUE7QUFFZCxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUE7QUFFbEIsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFBO0FBRWxCLE9BQU8sRUFBRSxZQUFZLEVBQUUsQ0FBQTtBQUV2QixPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUE7QUFFdEIsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFBO0FBRWpCLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQTtBQUdyQixt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