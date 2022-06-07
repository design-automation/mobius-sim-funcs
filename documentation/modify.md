# MODIFY  
  
The `modify` module has functions for modifying existing entities in the model.
These functions do not make any new entities, and they do not change the topology of objects.
These functions only change attribute values.
All these functions have no return value.  
  
  
## Move  
  
  
**Description:** Moves entities. The direction and distance of movement is specified as a vector.


If only one vector is given, then all entities are moved by the same vector.
If a list of vectors is given, then each entity will be moved by a different vector.
In this case, the number of vectors should be equal to the number of entities.


If a position is shared between entites that are being moved by different vectors,
then the position will be moved by the average of the vectors.

  
  
**Parameters:**  
  * *entities:* An entity or list of entities to move.  
  * *vectors:* A vector or a list of vectors.  
  
**Returns:** void  
**Examples:**  
  * `modify.Move(pline1, [1,2,3])`  
    Moves pline1 by [1,2,3].  
  * `modify.Move([pos1, pos2, pos3], [[0,0,1], [0,0,1], [0,1,0]] )`  
    Moves pos1 by [0,0,1], pos2 by [0,0,1], and pos3 by [0,1,0].  
  * `modify.Move([pgon1, pgon2], [1,2,3] )`  
    Moves both pgon1 and pgon2 by [1,2,3].
  
  
  
## Rotate  
  
  
**Description:** Rotates entities on a plane by an angle.

  
  
**Parameters:**  
  * *entities:* An entity or list of entities to rotate.  
  * *ray:* A ray to rotate around. 

Given a plane, a ray will be created from the plane's z axis. 

Given an `xyz` location, a ray will be generated with an origin at this location, and a direction `[0, 0, 1]`. 

Given any entities, the centroid will be extracted,
and a ray will be generated with an origin at this centroid, and a direction `[0, 0, 1]`.  
  * *angle:* Angle (in radians).  
  
**Returns:** void  
**Examples:**  
  * `modify.Rotate(polyline1, plane1, PI)`  
    Rotates polyline1 around the z-axis of plane1 by PI (i.e. 180 degrees).
  
  
  
## Scale  
  
  
**Description:** Scales entities relative to a plane.

  
  
**Parameters:**  
  * *entities:* An entity or list of entities to scale.  
  * *plane:* A plane to scale around. 

Given a ray, a plane will be generated that is perpendicular to the ray. 

Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. 

Given any entities, the centroid will be extracted,
and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.  
  * *scale:* Scale factor, a single number to scale equally, or [scale_x, scale_y, scale_z] relative to the plane.  
  
**Returns:** void  
**Examples:**  
  * `modify.Scale(entities, plane1, 0.5)`  
    Scales entities by 0.5 on plane1.  
  * `modify.Scale(entities, plane1, [0.5, 1, 1])`  
    Scales entities by 0.5 along the x axis of plane1, with no scaling along the y and z axes.
  
  
  
## Mirror  
  
  
**Description:** Mirrors entities across a plane.

  
  
**Parameters:**  
  * *entities:* An entity or list of entities to mirror.  
  * *plane:* A plane to scale around. 

Given a ray, a plane will be generated that is perpendicular to the ray. 

Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. 

Given any entities, the centroid will be extracted,
and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.  
  
**Returns:** void  
**Examples:**  
  * `modify.Mirror(polygon1, plane1)`  
    Mirrors polygon1 across plane1.
  
  
  
## XForm  
  
  
**Description:** Transforms entities from a source plane to a target plane.

  
  
**Parameters:**  
  * *entities:* Vertex, edge, wire, position, point, polyline, polygon, collection.  
  * *from\_plane:* Plane defining source plane for the transformation. 

Given a ray, a plane will be generated that is perpendicular to the ray. 

Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. 

Given any entities, the centroid will be extracted,
and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.  
  * *to\_plane:* Plane defining target plane for the transformation. 

Given a ray, a plane will be generated that is perpendicular to the ray. 

Given an `xyz` location, a plane will be generated with an origin at that location and with axes parallel to the global axes. 

Given any entities, the centroid will be extracted,
and a plane will be generated with an origin at the centroid, and with axes parallel to the global axes.  
  
**Returns:** void  
**Examples:**  
  * `modify.XForm(polygon1, plane1, plane2)`  
    Transforms polygon1 from plane1 to plane2.
  
  
  
## Offset  
  
  
**Description:** Performs a simple geometrical offset on the wires, such that the wires are parallel to their
original positions, modying the input entities. Works on 3D geometry.


See `poly2d.OffsetChamfer, poly2d.OffsetMitre` and `poly2d.OffsetRound` for other offset
functions that do not modify the input entities (but are limited to 2D).  
  
**Parameters:**  
  * *entities:* Edges, wires, faces, polylines, polygons, collections.  
  * *dist:* The distance to offset by, can be either positive or negative.  
  
**Returns:** void  
**Examples:**  
  * <a href="/editor?file=/assets/examples/Functions_modify.Offset_3DExamples.mob&node=1" target="_blank"> 3D Example </a>  
    A model showing offset used on 3D geometry.  
  * <a href="/editor?file=/assets/examples/Functions_modify.Offset_Self-intersecting_Example.mob&node=1" target="_blank"> Wrong Example </a>  
    A model showing self-intersecting geometries created by offset and how to fix it.  
  * `modify.Offset(polygon1, 10)`  
    Offsets the wires inside polygon1 by 10 units. Holes will also be offset.
  
  
  
## Remesh  
  
  
**Description:** Remesh a face or polygon.


When a face or polygon is deformed, the triangles that make up that face will sometimes become incorrect.


Remeshing will regenerate the triangulated mesh for the face.


Remeshing is not performed automatically as it would degrade performance.
Instead, it is left up to the user to remesh only when it is actually required.

  
  
**Parameters:**  
  * *entities:* Single or list of faces, polygons, collections.  
  
**Returns:** void  
**Examples:**  
  * <a href="/editor?file=/assets/examples/Functions_modify.Remesh_example.mob&node=1" target="_blank"> Example of Usage </a>  
    A model showing proper usage of make.Remesh, to remove extra polygons created when modifying the model.  
  * `modify.Remesh(polygon1)`  
    Remeshes the face of the polygon.

  
  
  
