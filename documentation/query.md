# QUERY  
  
The `query` module has functions for querying entities in the the model.
Most of these functions all return a list of IDs of entities in the model.  
  
  
## Get  
  
  
**Description:** Get entities from a list of entities.
For example, you can get the position entities from a list of polygon entities.


The result will always be a list of entities, even if there is only one entity.
In a case where you want only one entity, remember to get the first item in the list.


The resulting list of entities will not contain duplicate entities.

  
  
**Parameters:**  
  * *ent\_type\_enum:* Enum, the type of entity to get: `'ps', '_v', '_e', '_w', 'pt', 'pl',
'pg',` or `'co'`.  
  * *entities:* (Optional) List of entities to get entities from, or null to get from all entities in the model.  
  
**Returns:** Entities, a list of entities.  
**Examples:**  
  * `positions = query.Get('positions', [polyline1, polyline2])`  
    Returns a list of positions that are part of polyline1 and polyline2.
  
  
  
## Filter  
  
  
**Description:** Filter a list of entities based on an attribute value.


The result will always be a list of entities, even if there is only one entity.
In a case where you want only one entity, remember to get the first item in the list.

  
  
**Parameters:**  
  * *entities:* List of entities to filter. The entities must all be of the same type.  
  * *attrib:* The attribute to use for filtering. Can be `name`, `[name, index]`, or `[name,
key]`.  
  * *operator\_enum:* Enum, the operator to use for filtering: `'==', '!=', '>=', '<=', '>', '<'` or `'='`.  
  * *value:* The attribute value to use for filtering.  
  
**Returns:** Entities, a list of entities that match the conditions specified in 'operater\_enum' and 'value'.  
  
  
## Invert  
  
  
**Description:** Returns a list of entities that are not part of the specified entities.
For example, you can get the position entities that are not part of a list of polygon entities.


This function does the opposite of `query.Get()`.
While `query.Get()` gets entities that are part of the list of entities,
this function gets the entities that are not part of the list of entities.

  
  
**Parameters:**  
  * *ent\_type\_enum:* Enum, specifies what type of entities will be returned: `'ps', '_v', '_e',
'_w', 'pt', 'pl', 'pg'`, or `'co'`.  
  * *entities:* List of entities to be excluded.  
  
**Returns:** Entities, a list of entities that match the type specified in '`ent_type_enum`', and that are not in `entities`.  
**Examples:**  
  * `positions = query.Invert('positions', [polyline1, polyline2])`  
    Returns a list of positions that are not part of polyline1 and polyline2.
  
  
  
## Sort  
  
  
**Description:** Sorts entities based on an attribute.


If the attribute is a list, index can also be specified as follows: `#@name1[index]`.

  
  
**Parameters:**  
  * *entities:* List of two or more entities to be sorted, all of the same entity type.  
  * *attrib:* Attribute name to use for sorting. Can be `name`, `[name, index]`, or `[name, key]`.  
  * *method\_enum:* Enum, sort: `'descending'` or `'ascending'`.  
  
**Returns:** Entities, a list of sorted entities.  
**Examples:**  
  * `sorted_list = query.Sort( [pos1, pos2, pos3], #@xyz[2], descending)`  
    Returns a list of three positions, sorted according to the descending z value.
  
  
  
## Perimeter  
  
  
**Description:** Returns a list of perimeter entities. In order to qualify as a perimeter entity,
entities must be part of the set of input entities and must have naked edges.

  
  
**Parameters:**  
  * *ent\_type:* Enum, select the type of perimeter entities to return: `'ps', '_v', '_e', '_w',
'pt', 'pl', 'pg',` or `'co'`.  
  * *entities:* List of entities.  
  
**Returns:** Entities, a list of perimeter entities.  
**Examples:**  
  * `query.Perimeter('edges', [polygon1,polygon2,polygon])`  
    Returns list of edges that are at the perimeter of polygon1, polygon2, or polygon3.
  
  
  
## Neighbor  
  
  
**Description:** Returns a list of neighboring entities. In order to qualify as a neighbor,
entities must not be part of the set of input entities, but must be welded to one or more entities in the input.

  
  
**Parameters:**  
  * *ent\_type\_enum:* Enum, select the types of neighbors to return: `'ps', '_v', '_e', '_w', 'pt', 'pl',
'pg',` or `'co'`.  
  * *entities:* List of entities.  
  
**Returns:** Entities, a list of welded neighbors  
**Examples:**  
  * `query.neighbor('edges', [polyline1,polyline2,polyline3])`  
    Returns list of edges that are welded to polyline1, polyline2, or polyline3.
  
  
  
## Edge  
  
  
**Description:** Given an edge, returns other edges.
- If "previous" is selected, it returns the previous edge in the wire or null if there is no previous edge.
- If "next" is selected, it returns the next edge in the wire or null if there is no next edge.
- If "both" is selected, it returns a list of two edges, [previous, next]. Either can be null.
- If "touching" is selected, it returns a list of edges from other wires that share the same start and end positions (in any order).  
  
**Parameters:**  
  * *entities:* An edge or list of edges.  
  * *edge\_query\_enum:* Enum, select the types of edges to return: `'previous', 'next', 'both'` or `'touching'`.  
  
**Returns:** Entities, an edge or list of edges, or null.  
  
  
## Type  
  
  
**Description:** Checks the type of an entity. 

- For is\_used\_posi, returns true if the entity is a posi, and it is used by at least one
  vertex.
- For is\_unused\_posi, it returns the opposite of is\_used\_posi.
- For is\_object, returns true if the entity is a point, a polyline, or a polygon.
- For is\_topology, returns true if the entity is a vertex, an edge, a wire, or a face.
- For is\_point\_topology, is\_polyline\_topology, and is\_polygon\_topology, returns true if the
  entity is a topological entity, and it is part of an object of the specified type.
- For is\_open, returns true if the entity is a wire or polyline and is open.
- For is\_closed, it returns the opposite of is\_open.
- For is\_hole, returns true if the entity is a wire, and it defines a hole in a face.
- For has\_holes, returns true if the entity is a face or polygon, and it has holes.
- For has\_no\_holes, it returns the opposite of has\_holes.  
  
**Parameters:**  
  * *entities:* An entity, or a list of entities.  
  * *type\_query\_enum:* Enum, select the conditions to test against: `'exists', 'is_position',
'is_used_posi', 'is_unused_posi', 'is_vertex', 'is_edge', 'is_wire', 'is_point',
'is_polyline', 'is_polygon', 'is_collection', 'is_object', 'is_topology',
'is_point_topology', 'is_polyline_topology', 'is_polygon_topology', 'is_open',
'is_closed', 'is_hole', 'has_holes'` or `'has_no_holes'`.  
  
**Returns:** Boolean or list of booleans in input sequence.  
**Examples:**  
  * `query.Type([polyline1, polyline2, polygon1], is_polyline)`  
    Returns a list `[true, true, false]` if polyline1 and polyline2 are polylines but
polygon1 is not a polyline.
  
  
  
