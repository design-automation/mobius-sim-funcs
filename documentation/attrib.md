# ATTRIB  
  
The `attrib` module has functions for working with attributes in the model.
Note that attributes can also be set and retrieved using the "@" symbol.  
  
  
## Set  
  
  
**Description:** Set an attribute value for one or more entities.


If `entities` is null, then model level attributes will be set.

  
  
**Parameters:**  
  * *entities:* Entities, the entities to set the attribute value for.  
  * *attrib:* The attribute. Can be `name`, `[name, index]`, or `[name, key]`.  
  * *value:* The attribute value, or list of values.  
  * *method:* Enum: `'one_value'` or `'many_values'`.  
  
**Returns:** void  
  
  
## Get  
  
  
**Description:** Get attribute values for one or more entities.


If `entities` is null, then model level attributes will be returned.

  
  
**Parameters:**  
  * *entities:* Entities, the entities to get the attribute values for.  
  * *attrib:* The attribute. Can be `name`, `[name, index]`, or `[name, key]`.  
  
**Returns:** One attribute value, or a list of attribute values.  
  
  
## Add  
  
  
**Description:** Add one or more attributes to the model.
The attribute will appear as a new column in the attribute table.
(At least one entity must have a value for the column to be visible in the attribute table).
All attribute values will be set to null.

  
  
**Parameters:**  
  * *ent\_type\_sel:* Enum, the attribute entity type: `'ps', '_v', '_e', '_w', '_f', 'pt', 'pl', 'pg', 'co',` or `'mo'`.  
  * *data\_type\_sel:* Enum, the data type for this attribute: `'number', 'string', 'boolean', 'list'` or `'dict'`.  
  * *attribs:* A single attribute name, or a list of attribute names.  
  
**Returns:** void  
  
  
## Delete  
  
  
**Description:** Delete one or more attributes from the model. The column in the attribute table will be deleted.
All values will also be deleted. 
  
  
**Parameters:**  
  * *ent\_type\_sel:* Enum, the attribute entity type: `'ps', '_v', '_e', '_w', '_f', 'pt', 'pl', 'pg', 'co',` or `'mo'`.  
  * *attribs:* A single attribute name, or a list of attribute names. If 'null', all attributes
will be deleted.  
  
**Returns:** void  
  
  
## Rename  
  
  
**Description:** Rename an attribute in the model.
The header for the column in the attribute table will be renamed.
All values will remain the same.

  
  
**Parameters:**  
  * *ent\_type\_sel:* Enum, the attribute entity type: `'ps', '_v', '_e', '_w', '_f', 'pt', 'pl', 'pg', 'co',` or `'mo'`.  
  * *old\_attrib:* The old attribute name.  
  * *new\_attrib:* The new attribute name.  
  
**Returns:** void  
  
  
## Push  
  
  
**Description:** Push attributes up or down the hierarchy. The original attribute is not changed.


In addition to the standard topologies, the `ent_type_sel` argument allows `attrib.Push` to
push attributes to the following:
- `cop`, short for "Collection Parent".
- `coc`, short for "Collection Child".  
  
**Parameters:**  
  * *entities:* Entities, the entities to push the attribute values for.  
  * *attrib:* The attribute. Can be `name`, `[name, index_or_key]`,
`[source_name, source_index_or_key, target_name]` or `[source_name, source_index_or_key, target_name, target_index_or_key]`.  
  * *ent\_type\_sel:* Enum, the target entity type where the attribute values should be pushed to:
`'ps', '_v', '_e', '_w', '_f', 'pt', 'pl', 'pg', 'co', 'cop', 'coc'` or `'mo'`.  
  * *method\_sel:* Enum, the method for aggregating attribute values in cases where aggregation is necessary:
`'first', 'last', 'average', 'median', 'sum', 'min'` or `'max'`.  
  
**Returns:** void  
  
  
## Values  
  
  
**Description:** Get a list of unique attribute values for an attribute.

  
  
**Parameters:**  
  * *ent\_type\_sel:* Enum, the attribute entity type: `'ps', '_v', '_e', '_w', '_f', 'pt', 'pl', 'pg', 'co',` or `'mo'`.  
  * *attribs:* A single attribute name, or a list of attribute names.  
  
**Returns:** A list of values of the attribute.  
**Examples:**  
  * `attribs = attrib.Values("pg")`  
    An example of `attribs`: `["True", "False"]`.
  
  
  
## Discover  
  
  
**Description:** Get all attribute names and attribute types for an entity type.

  
  
**Parameters:**  
  * *ent\_type\_sel:* Enum, the attribute entity type: `'ps', '_v', '_e', '_w', '_f', 'pt', 'pl', 'pg', 'co',` or `'mo'`.  
  
**Returns:** A list of dictionaries, defining the name and type of each attribute.  
**Examples:**  
  * `attribs = attrib.Discover("pg")`  
    An example of `attribs`: `[{name: "description", type: "str"}, {name: "area", type: "number"}]`.
  
  
  
