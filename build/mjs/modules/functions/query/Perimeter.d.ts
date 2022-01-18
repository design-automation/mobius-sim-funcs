import { EEntType, GIModel, TEntTypeIdx, TId } from '@design-automation/mobius-sim';
import { _EEntType } from './_enum';
/**
* Returns a list of perimeter entities. In order to qualify as a perimeter entity,
* entities must be part of the set of input entities and must have naked edges.
* \n
* @param __model__
* @param ent_type Enum, select the type of perimeter entities to return
* @param entities List of entities.
* @returns Entities, a list of perimeter entities.
* @example query.Perimeter('edges', [polygon1,polygon2,polygon])
* @example_info Returns list of edges that are at the perimeter of polygon1, polygon2, or polygon3.
*/
export declare function Perimeter(__model__: GIModel, ent_type: _EEntType, entities: TId | TId[]): TId[];
export declare function _perimeter(__model__: GIModel, select_ent_type: EEntType, ents_arr: TEntTypeIdx[]): TEntTypeIdx[];
