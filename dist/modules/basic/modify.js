/**
 * The `modify` module has functions for modifying existing entities in the model.
 * These functions do not make any new entities, and they do not change the topology of objects.
 * These functions only change attribute values.
 * All these functions have no return value.
 * @module
 */
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { EEntType } from '@design-automation/mobius-sim/dist/geo-info/common';
import { idsBreak } from '@design-automation/mobius-sim/dist/geo-info/common_id_funcs';
import { arrMakeFlat, isEmptyArr } from '@design-automation/mobius-sim/dist/util/arrs';
import { getRay, getPlane } from './_common';
// ================================================================================================
/**
 * Moves entities. The directio and distance if movement is specified as a vector.
 * \n
 * If only one vector is given, then all entities are moved by the same vector.
 * If a list of vectors is given, the each entity will be moved by a different vector.
 * In this case, the number of vectors should be equal to the number of entities.
 * \n
 * If a position is shared between entites that are being moved by different vectors,
 * then the position will be moved by the average of the vectors.
 * \n
 * @param __model__
 * @param entities An entity or list of entities to move.
 * @param vector A vector or a list of vectors.
 * @returns void
 * @example modify.Move(pline1, [1,2,3])
 * @example_info Moves pline1 by [1,2,3].
 * @example modify.Move([pos1, pos2, pos3], [[0,0,1], [0,0,1], [0,1,0]] )
 * @example_info Moves pos1 by [0,0,1], pos2 by [0,0,1], and pos3 by [0,1,0].
 * @example modify.Move([pgon1, pgon2], [1,2,3] )
 * @example_info Moves both pgon1 and pgon2 by [1,2,3].
 */
export function Move(__model__, entities, vectors) {
    entities = arrMakeFlat(entities);
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Move';
        let ents_arr;
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null);
            chk.checkArgs(fn_name, 'vectors', vectors, [chk.isXYZ, chk.isXYZL]);
        }
        else {
            ents_arr = idsBreak(entities);
        }
        // --- Error Check ---
        __model__.modeldata.funcs_modify.move(ents_arr, vectors);
    }
}
// ================================================================================================
/**
 * Rotates entities on plane by angle.
 * \n
 * @param __model__
 * @param entities  An entity or list of entities to rotate.
 * @param ray A ray to rotate around. \n
 * Given a plane, a ray will be created from the plane z axis. \n
 * Given an `xyz` location, a ray will be generated with an origin at this location, and a direction `[0, 0, 1]`. \n
 * Given any entities, the centroid will be extracted, \n
 * and a ray will be generated with an origin at this centroid, and a direction `[0, 0, 1]`.
 * @param angle Angle (in radians).
 * @returns void
 * @example modify.Rotate(polyline1, plane1, PI)
 * @example_info Rotates polyline1 around the z-axis of plane1 by PI (i.e. 180 degrees).
 */
export function Rotate(__model__, entities, ray, angle) {
    entities = arrMakeFlat(entities);
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Rotate';
        let ents_arr;
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
            chk.checkArgs(fn_name, 'angle', angle, [chk.isNum]);
        }
        else {
            ents_arr = idsBreak(entities);
        }
        ray = getRay(__model__, ray, fn_name);
        // --- Error Check ---
        __model__.modeldata.funcs_modify.rotate(ents_arr, ray, angle);
    }
}
// ================================================================================================
/**
 * Scales entities relative to a plane.
 * \n
 * @param __model__
 * @param entities  An entity or list of entities to scale.
 * @param plane A plane to scale around. \n
 * Given a ray, a plane will be generated that is perpendicular to the ray. \n
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \n
 * Given any entities, the centroid will be extracted, \n
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @param scale Scale factor, a single number to scale equally, or [scale_x, scale_y, scale_z] relative to the plane.
 * @returns void
 * @example modify.Scale(entities, plane1, 0.5)
 * @example_info Scales entities by 0.5 on plane1.
 * @example modify.Scale(entities, plane1, [0.5, 1, 1])
 * @example_info Scales entities by 0.5 along the x axis of plane1, with no scaling along the y and z axes.
 */
export function Scale(__model__, entities, plane, scale) {
    entities = arrMakeFlat(entities);
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Scale';
        let ents_arr;
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
            chk.checkArgs(fn_name, 'scale', scale, [chk.isNum, chk.isXYZ]);
        }
        else {
            ents_arr = idsBreak(entities);
        }
        plane = getPlane(__model__, plane, fn_name);
        // --- Error Check ---
        __model__.modeldata.funcs_modify.scale(ents_arr, plane, scale);
    }
}
// ================================================================================================
/**
 * Mirrors entities across a plane.
 * \n
 * @param __model__
 * @param entities An entity or list of entities to mirros.
 * @param plane A plane to scale around. \n
 * Given a ray, a plane will be generated that is perpendicular to the ray. \n
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \n
 * Given any entities, the centroid will be extracted, \n
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @returns void
 * @example modify.Mirror(polygon1, plane1)
 * @example_info Mirrors polygon1 across plane1.
 */
export function Mirror(__model__, entities, plane) {
    entities = arrMakeFlat(entities);
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Mirror';
        let ents_arr;
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
        }
        else {
            ents_arr = idsBreak(entities);
        }
        plane = getPlane(__model__, plane, fn_name);
        // --- Error Check ---
        __model__.modeldata.funcs_modify.mirror(ents_arr, plane);
    }
}
// ================================================================================================
/**
 * Transforms entities from a source plane to a target plane.
 * \n
 * @param __model__
 * @param entities Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @param from_plane Plane defining source plane for the transformation. \n
 * Given a ray, a plane will be generated that is perpendicular to the ray. \n
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \n
 * Given any entities, the centroid will be extracted, \n
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @param to_plane Plane defining target plane for the transformation. \n
 * Given a ray, a plane will be generated that is perpendicular to the ray. \n
 * Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. \n
 * Given any entities, the centroid will be extracted, \n
 * and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.
 * @returns void
 * @example modify.XForm(polygon1, plane1, plane2)
 * @example_info Transforms polygon1 from plane1 to plane2.
 */
export function XForm(__model__, entities, from_plane, to_plane) {
    entities = arrMakeFlat(entities);
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.XForm';
        let ents_arr;
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.POSI, EEntType.VERT, EEntType.EDGE, EEntType.WIRE,
                EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
        }
        else {
            ents_arr = idsBreak(entities);
        }
        from_plane = getPlane(__model__, from_plane, fn_name);
        to_plane = getPlane(__model__, to_plane, fn_name);
        // --- Error Check ---
        __model__.modeldata.funcs_modify.xform(ents_arr, from_plane, to_plane);
    }
}
// ================================================================================================
/**
 * Offsets wires.
 * \n
 * @param __model__
 * @param entities Edges, wires, faces, polylines, polygons, collections.
 * @param dist The distance to offset by, can be either positive or negative
 * @returns void
 * @example modify.Offset(polygon1, 10)
 * @example_info Offsets the wires inside polygon1 by 10 units. Holes will also be offset.
 */
export function Offset(__model__, entities, dist) {
    entities = arrMakeFlat(entities);
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'modify.Offset';
        let ents_arr;
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.WIRE, EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
            chk.checkArgs(fn_name, 'dist', dist, [chk.isNum]);
        }
        else {
            ents_arr = idsBreak(entities);
        }
        // --- Error Check ---
        __model__.modeldata.funcs_modify.offset(ents_arr, dist);
    }
}
// ================================================================================================
/**
 * Remesh a face or polygon.
 * \n
 * When a face or polygon is deformed, the triangles that make up that face will sometimes become incorrect.
 * \n
 * Remeshing will regenerate the triangulated mesh for the face.
 * \n
 * Remeshing is not performed automatically as it would degrade performance.
 * Instead, it is left up to the user to remesh only when it is actually required.
 * \n
 * @param __model__
 * @param entities Single or list of faces, polygons, collections.
 * @returns void
 * @example modify.Remesh(polygon1)
 * @example_info Remeshs the face of the polygon.
 */
export function Remesh(__model__, entities) {
    entities = arrMakeFlat(entities);
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        let ents_arr;
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, 'modify.Remesh', 'entities', entities, [ID.isID, ID.isIDL1], [EEntType.PGON, EEntType.COLL]);
        }
        else {
            ents_arr = idsBreak(entities);
        }
        // --- Error Check ---
        __model__.modeldata.funcs_modify.remesh(ents_arr);
    }
}
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kaWZ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZXMvYmFzaWMvbW9kaWZ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFaEQsT0FBTyxLQUFLLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQztBQUcxQyxPQUFPLEVBQXFCLFFBQVEsRUFBOEIsTUFBTSxvREFBb0QsQ0FBQztBQUM3SCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sNkRBQTZELENBQUM7QUFDdkYsT0FBTyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUN2RixPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUc3QyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0JHO0FBQ0gsTUFBTSxVQUFVLElBQUksQ0FBQyxTQUFrQixFQUFFLFFBQW1CLEVBQUUsT0FBb0I7SUFDOUUsUUFBUSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQVUsQ0FBQztJQUMxQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ3ZCLHNCQUFzQjtRQUN0QixNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUM7UUFDOUIsSUFBSSxRQUF1QixDQUFDO1FBQzVCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtZQUNqQixRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBa0IsQ0FBQztZQUMzRyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLEtB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