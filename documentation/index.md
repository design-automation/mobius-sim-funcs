# ANALYZE  
The `analysis` module has functions for performing various types of analysis with entities in
the model. These functions all return dictionaries containing the results of the analysis.  
Link: <analyze.md>  
  
  
# ATTRIB  
The `attrib` module has functions for working with attributes in teh model.
Note that attributes can also be set and retrieved using the "@" symbol.  
Link: <attrib.md>  
  
  
# CALC  
The `calc` module has functions for performing various types of calculations with entities in the model.
These functions neither make nor modify anything in the model.
These functions all return either numbers or lists of numbers.  
Link: <calc.md>  
  
  
# COLLECTION  
The `collections` module has functions for creating and modifying collections.  
Link: <collection.md>  
  
  
# DICT  
The `dict` module has functions for working with dictionaries.
These functions have no direct link with the model, the are generic functions for manipulating dictionaries.
These functions neither make nor modify anything in the model.
In addition to these functions, there are also inline functions available for working with dictionaries.  
Link: <dict.md>  
  
  
# EDIT  
The `edit` module has functions for editing entities in the model.
These function modify the topology of objects: vertices, edges, wires and faces.
Some functions return the IDs of the entities that are created or modified.  
Link: <edit.md>  
  
  
# INTERSECT  
The `intersect` module has functions for calculating intersections between different types of entities.  
Link: <intersect.md>  
  
  
# IO  
The `io` module has functions for importing and exporting.  
Link: <io.md>  
  
  
# LIST  
The `list` module has functions for working with lists of items.
These functions have no direct link with the model, the are generic functions for manipulating lists.
The functions are often used when manipulating lists of IDs of entities in the model.
These functions neither make nor modify anything in the model.
In addition to these functions, there are also various inline functions available for working with lists.  
Link: <list.md>  
  
  
# MAKE  
The `make` module has functions for making new entities in the model.
All these functions return the IDs of the entities that are created.  
Link: <make.md>  
  
  
# MATERIAL  
The `material` module has functions for defining materials.
The material definitions are saved as attributes at the model level.
For more informtion, see the threejs docs: https://threejs.org/  
Link: <material.md>  
  
  
# MODIFY  
The `modify` module has functions for modifying existing entities in the model.
These functions do not make any new entities, and they do not change the topology of objects.
These functions only change attribute values.
All these functions have no return value.  
Link: <modify.md>  
  
  
# PATTERN  
The `pattern` module has functions for creating patters of positions.
These functions all return lists of position IDs.
The list may be nested, depending on which function is selected.  
Link: <pattern.md>  
  
  
# POLY2D  
The `poly2D` module has a set of functions for working with 2D polygons, on the XY plane.  
Link: <poly2d.md>  
  
  
# QUERY  
The `query` module has functions for querying entities in the the model.
Most of these functions all return a list of IDs of entities in the model.  
Link: <query.md>  
  
  
# UTIL  
The `util` module has some utility functions used for debugging.  
Link: <util.md>  
  
  
# VISUALIZE  
The `visualize` module has functions for defining various settings for the 3D viewer.
Color is saved as vertex attributes.  
Link: <visualize.md>  
  
  
