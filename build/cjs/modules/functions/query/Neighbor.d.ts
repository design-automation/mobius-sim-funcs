/**
 * The `query` module has functions for querying entities in the the model.
 * Most of these functions all return a list of IDs of entities in the model.
 * @module
 */
import { EEntType, GIModel, TEntTypeIdx, TId } from '@design-automation/mobius-sim';
import { _EEntType } from './_enum';
/**
* Returns a list of neighboring entities. In order to qualify as a neighbor,
* entities must not be part of the set of input entities, but must be welded to one or more entities in the input.
* \n
* @param __model__
* @param ent_type_enum Enum, select the types of neighbors to return
* @param entities List of entities.
* @returns Entities, a list of welded neighbors
* @example query.neighbor('edges', [polyline1,polyline2,polyline3])
* @example_info Returns list of edges that are welded to polyline1, polyline2, or polyline3.
*/
export declare function Neighbor(__model__: GIModel, ent_type_enum: _EEntType, entities: TId | TId[]): TId[];
export declare function _neighbors(__model__: GIModel, select_ent_type: EEntType, ents_arr: TEntTypeIdx[]): TEntTypeIdx[];
