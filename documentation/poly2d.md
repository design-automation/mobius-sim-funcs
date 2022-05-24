# POLY2D  
  
The `poly2D` module has a set of functions for working with 2D polygons, with the results
projected on the XY plane.


All the functions create new entities and do not modify the original geometry.  
  
  
## Voronoi  
  
  
**Description:** Create a voronoi subdivision of one or more polygons.


A Voronoi diagram is a partition of a plane into regions close to each of a given set of positions.
See the wikipedia page for more info: <a href="https://en.wikipedia.org/wiki/Voronoi_diagram" target="_blank">
Voronoi Diagrams</a>.
<a href="https://github.com/d3/d3-voronoi#readme" target="_blank">See the source github for
interactive examples and more information on calculating voronoi subdivisions.</a>


![Examples of voronoi outputs](/../typedoc-json/docMDimgs/funcs_poly2d_voronoi_examples.png)  
  
**Parameters:**  
  * *pgons:* A polygon, list of polygons, or entities from which polygons can be extracted. (This/these will be subdivided.)  
  * *entities:* A list of positions, or entities from which positions can be extracted.
(Each of these will be within a generated polygon.)  
  
**Returns:** A list of new polygons.  
  
  
## Delaunay  
  
  
**Description:** Create a delaunay triangulation of a set of positions.


A Delaunay triangulation for a given set of positions (`entities`) is a triangulation, DT(P), such
that no position in `entities` is inside the circumcircle of any triangle in DT(P).
See the wikipedia page for more info: <a href="https://en.wikipedia.org/wiki/Delaunay_triangulation" target="_blank">
Delanuay triangulation</a>.


<img src="https://upload.wikimedia.org/wikipedia/commons/d/db/Delaunay_circumcircles_vectorial.svg">

  
  
**Parameters:**  
  * *entities:* A list of positions, or entities from which positions can be extracted.  
  
**Returns:** A list of new polygons.  
  
  
## ConvexHull  
  
  
**Description:** Creates a convex hull from a list of positions.


For more information, see the wikipedia article:
<a href="https://en.wikipedia.org/wiki/Convex_hull" target="_blank">Convex_Hull</a>


<img
src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Extreme_points.svg/330px-Extreme_points.svg.png"
alt="Convex hull example" width="150">


In the image above, the convex hull of the red set is the blue and red convex set.  
  
**Parameters:**  
  * *entities:* A list of positions, or entities from which positions can be extracted.  
  
**Returns:** A new polygons, the convex hull of the positions.  
  
  
## BBoxPolygon  
  
  
**Description:** Create a polygon that is a 2D bounding box of the entities.


For the method, 'aabb' generates an Axis Aligned Bounding Box, and 'obb' generates an Oriented Bounding Box.


See `calc.BBox` and `visualize.BBox` for more on bounding boxes.  
  
**Parameters:**  
  * *entities:* A list of positions, or entities from which positions can be extracted.  
  * *method:* Enum, the method for generating the bounding box: `'aabb'` or `'obb'`.  
  
**Returns:** A new polygon, the bounding box of the positions.  
  
  
## Union  
  
  
**Description:** Create the union of a set of polygons. The original polygons are not edited.  
  
**Parameters:**  
  * *entities:* A list of polygons, or entities from which polygons can bet extracted.  
  
**Returns:** A list of new polygons.  
  
  
## Boolean  
  
  
**Description:** Perform a boolean operation on polylines or polygons.


The entities in A can be either polyline or polygons.
The entities in B must be polygons.
The polygons in B are first unioned before the operation is performed.
The boolean operation is then performed between each polyline or polygon in A, and the unioned B polygons.


If A is an empty list, then an empty list is returned.
If B is an empty list, then the A list is returned.


The input polygons or polylines are not deleted.  
  
**Parameters:**  
  * *a\_entities:* A list of polyline or polygons, or entities from which polyline or polygons can be extracted.  
  * *b\_entities:* A list of polygons, or entities from which polygons can be extracted.  
  * *method:* Enum, the boolean operator to apply: `'intersect', 'difference'` or `'symmetric'`.  
  
**Returns:** A list of new polylines and polygons.  
  
  
## OffsetMitre  
  
  
**Description:** Offset a polyline or polygon, with mitered joints. The original entities are unmodified.


The types of joints of the generated offset polygon are shown below.
The red border indicates the generated offset polygon, whereas the black polygon
is the original/input polygon.


![Examples of offset joints](/../typedoc-json/docMDimgs/funcs_poly2d_offsets_joints_examples.png)


See `poly2d.OffsetChamfer` and `poly2d.OffsetRound` to use different joints while offsetting.
Alternatively, try `modify.Offset` for a different offset operation that modifies the original entities.


For open polylines, the type of ends can be changed with `end\_type`, shown below.


![Examples of offset ends](/../typedoc-json/docMDimgs/funcs_poly2d_offsets_examples.png)


`limit` determines how far a mitered joint can be offset if it is at a sharp angle (see above image).
If the mitered joint's length exceeds the `limit`, a "squared" offsetting is created at the joint.  
  
**Parameters:**  
  * *entities:* A list of polylines or polygons, or entities from which polylines or polygons can be extracted.  
  * *dist:* Offset distance, a number.  
  * *limit:* Mitre limit, a number.  
  * *end\_type:* Enum, the type of end shape for open polylines: `'square_end'` or `'butt_end'`.  
  
**Returns:** A list of new polygons.  
  
  
## OffsetChamfer  
  
  
**Description:** Offset a polyline or polygon, with chamfered/squared joints. The original entities are unmodified.


The types of joints of the generated offset polygon are shown below.
The red border indicates the generated offset polygon, whereas the black polygon
is the original/input polygon.


![Examples of offset joints](/../typedoc-json/docMDimgs/funcs_poly2d_offsets_joints_examples.png)


See `poly2d.OffsetMitre` and `poly2d.OffsetRound` to use different joints while offsetting.
Alternatively, try `modify.Offset` for a different offset operation that modifies the original entities.


For open polylines, the type of ends can be changed with `end\_type`, shown below.


![Examples of offset ends](/../typedoc-json/docMDimgs/funcs_poly2d_offsets_examples.png)

  
  
**Parameters:**  
  * *entities:* A list of polyines or polygons, or entities from which polylines or polygons can
be extracted.  
  * *dist:* Offset distance, a number.  
  * *end\_type:* Enum, the type of end shape for open polylines: `'square_end'` or `'butt_end'`.  
  
**Returns:** A list of new polygons.  
  
  
## OffsetRound  
  
  
**Description:** Offset a polyline or polygon, with round joints. The original entities are unmodified.


The types of joints of the generated offset polygon are shown below.
The red border indicates the generated offset polygon, whereas the black polygon
is the original/input polygon.


![Examples of offset joints](/../typedoc-json/docMDimgs/funcs_poly2d_offsets_joints_examples.png)


See `poly2d.OffsetMitre` and `poly2d.OffsetChamfer` to use different joints while offsetting.
Alternatively, try `modify.Offset` for a different offset operation that modifies the original entities.


For open polylines, the type of ends can be changed with `end\_type`, shown below.


![Examples of offset ends](/../typedoc-json/docMDimgs/funcs_poly2d_offsetRound_examples.png)

  
  
**Parameters:**  
  * *entities:* A list of polylines or polygons, or entities from which polylines or polygons can
be extracted.  
  * *dist:* Offset distance, a number.  
  * *tolerance:* The tolerance for the rounded corners, a number that is more than 0. In general,
the smaller the number, the rounder the joints. Will also apply to `round_end` if selected.  
  * *end\_type:* Enum, the type of end shape for open polylines: `'square_end', 'butt_end'` or `'round_end'`.  
  
**Returns:** A list of new polygons.  
  
  
## Stitch  
  
  
**Description:** Adds vertices to polyline and polygons at all locations where egdges intersect one another.
The vertices are welded.
This can be useful for creating networks that can be used for shortest path calculations.


The input polyline and polygons are copied.

  
  
**Parameters:**  
  * *entities:* A list of polylines or polygons, or entities from which polylines or polygons can
be extracted.  
  * *tolerance:* The tolerance for extending open plines if they are almost intersecting.  
  
**Returns:** Copies of the input polyline and polygons, stitched.  
  
  
## Clean  
  
  
**Description:** Clean a polyline or polygon.


Vertices that are closer together than the specified tolerance will be merged.
Vertices that are colinear within the tolerance distance will be deleted.

  
  
**Parameters:**  
  * *entities:* A list of polylines or polygons, or entities from which polylines or polygons can be extracted.  
  * *tolerance:* The tolerance for deleting vertices from the polyline.  
  
**Returns:** A list of new polygons.  
  
  
