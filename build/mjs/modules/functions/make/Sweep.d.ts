/**
 * The `make` module has functions for making new entities in the model.
 * All these functions return the IDs of the entities that are created.
 * @module
 */
import { GIModel, TId } from '@design-automation/mobius-sim';
import { _EExtrudeMethod } from './_enum';
/**
 * Sweeps a cross section wire along a backbone wire.
 *
 * @param __model__
 * @param entities Wires, or entities from which wires can be extracted.
 * @param xsection Cross section wire to sweep, or entity from which a wire can be extracted.
 * @param divisions Segment length or number of segments.
 * @param method Enum, select the method for sweeping.
 * @returns Entities, a list of new polygons or polylines resulting from the sweep.
 */
export declare function Sweep(__model__: GIModel, entities: TId | TId[], x_section: TId, divisions: number, method: _EExtrudeMethod): TId[];
