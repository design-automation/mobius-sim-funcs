/**
 * The `calc` module has functions for performing various types of calculations with entities in the model.
 * These functions neither make nor modify anything in the model.
 * These functions all return either numbers or lists of numbers.
 * @module
 */
import { GIModel, TEntTypeIdx, TId, TPlane } from '@design-automation/mobius-sim';
/**
 * Returns a plane from a polygon, a face, a polyline, or a wire.
 * For polylines or wires, there must be at least three non-colinear vertices.
 *
 * The winding order is counter-clockwise.
 * This means that if the vertices are ordered counter-clockwise relative to your point of view,
 * then the z axis of the plane will be pointing towards you.
 *
 * @param entities Any entities
 * @returns The plane.
 */
export declare function Plane(__model__: GIModel, entities: TId | TId[]): TPlane | TPlane[];
export declare function _getPlane(__model__: GIModel, ents_arr: TEntTypeIdx | TEntTypeIdx[]): TPlane | TPlane[];
