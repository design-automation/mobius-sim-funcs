# VISUALIZE  
  
The `visualize` module has functions for defining various settings for the 3D viewer.
Color is saved as vertex attributes.  
  
  
## Color  
  
  
**Description:** Sets color by creating a vertex attribute called 'rgb' and setting the value.


See
<a href="https://www.w3schools.com/colors/colors_rgb.asp?color=rgb(0,%200,%200)" target="_blank">w3schools</a>
for examples of RGB colors. To convert RGB(255, 255, 255) to RGB(1, 1, 1), enter vecDiv([`rgb_255_numbers`], 255).  
  
**Parameters:**  
  * *entities:* The entities for which to set the color.  
  * *color:* The color, [0,0,0] is black, [1,1,1] is white. vecDiv([255, 255, 255], 255) is also white.  
  
**Returns:** void  
  
  
## Gradient  
  
  
**Description:** Generates a colour range based on a numeric attribute.
Sets the color by creating a vertex attribute called 'rgb' and setting the value.


The available gradients are from <a href="https://colorbrewer2.org/">Color Brewer. </a>
If a custom gradient is desired, the inline expression `colScale()` can be used instead. Refer to its documentation for more information.  
  
**Parameters:**  
  * *entities:* The entities for which to set the color.  
  * *attrib:* The numeric attribute to be used to create the gradient.
You can specify an attribute with an index. For example, ['xyz', 2] will create a gradient based on height.  
  * *range:* The range of the attribute. If a list of 2 numbers is input, [minimum, maximum].
If only one number, it defaults to [0, maximum]. If null, then the range will be auto-calculated.  
  * *method:* Enum, the colour gradient to use.  
  
**Returns:** void  
  
  
## Edge  
  
  
**Description:** Controls how edges are visualized by setting the visibility of the edge.


The method can either be 'visible' or 'hidden'.
'visible' means that an edge line will be visible.
'hidden' means that no edge lines will be visible.

  
  
**Parameters:**  
  * *entities:* A list of edges, or other entities from which edges can be extracted.  
  * *method:* Enum, visible or hidden.  
  
**Returns:** void  
  
  
## Mesh  
  
  
**Description:** Controls how polygon meshes are visualized by creating normals on vertices.


The method can either be 'faceted' or 'smooth'.
'faceted' means that the normal direction for each vertex will be perpendicular to the polygon to which it belongs.
'smooth' means that the normal direction for each vertex will be the average of all polygons welded to this vertex.

  
  
**Parameters:**  
  * *entities:* Vertices belonging to polygons, or entities from which polygon vertices can be extracted.  
  * *method:* Enum, the types of normals to create, faceted or smooth.  
  
**Returns:** void  
  
  
## Ray  
  
  
**Description:** Visualises a ray or a list of rays by creating a polyline with an arrow head.  
  
**Parameters:**  
  * *rays:* Polylines representing the ray or rays.  
  * *scale:* Scales the arrow head of the vector.  
  
**Returns:** entities, a line with an arrow head representing the ray.  
**Examples:**  
  * ray1 = visualize.Ray([[1,2,3],[0,0,1]])
  
  
  
## Plane  
  
  
**Description:** Visualises a plane or a list of planes by creating polylines.  
  
**Parameters:**  
  * *planes:* A plane or a list of planes.  
  * *scale:* Scales the size of the visualized plane.  
  
**Returns:** Entities, a square plane polyline and three axis polyline.  
**Examples:**  
  * plane1 = visualize.Plane(position1, vector1, [0,1,0])  
    Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
  
  
  
## BBox  
  
  
**Description:** Visualises a bounding box by adding geometry to the model.


See `calc.BBox` for creating the bounding box.


The bounding box is an imaginary box that completely contains all the geometry.
The box is always aligned with the global x, y, and z axes.


The bounding box consists of a list of lists, as follows [[x, y, z], [x, y, z], [x, y, z], [x, y, z]].
- The first [x, y, z] is the coordinates of the centre of the bounding box.
- The second [x, y, z] is the corner of the bounding box with the lowest x, y, z values.
- The third [x, y, z] is the corner of the bounding box with the highest x, y, z values.
- The fourth [x, y, z] is the dimensions of the bounding box.  
  
**Parameters:**  
  * *bboxes:* A list of 4 lists (created from `calc.BBox`).  
  
**Returns:** Entities, twelve polylines representing the box.  
**Examples:**  
  * `bbox1 = calc.BBox(geometry)`, `bbox_vis = visualize.BBox(bbox1)`  
    Creates a box around the inital geometry.
  
  
  
