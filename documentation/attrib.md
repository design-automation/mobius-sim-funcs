# ATTRIB  
  
The `attrib` module has functions for working with attributes in teh model.
Note that attributes can also be set and retrieved using the "@" symbol.  
  
  
## Set  
  
  
**Description:** Set an attribute value for one or more entities.


If entities is null, then model level attributes will be set.

  
  
**Parameters:**  
  * *entities:* Entities, the entities to set the attribute value for.  
  * *attrib:* The attribute. Can be `name`, `[name, index]`, or `[name, key]`.  
  * *value:* The attribute value, or list of values.  
  * *method:* Enum
  
  
  
## Get  
  
  
**Description:** Get attribute values for one or more entities.


If entities is null, then model level attributes will be returned.

  
  
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
  * *ent\_type\_sel:* Enum, the attribute entity type.  
  * *data\_type\_sel:* Enum, the data type for this attribute  
  * *attribs:* A single attribute name, or a list of attribute names.
  
  
  
## Delete  
  
  
**Description:** Delete one or more attributes from the model.
The column in the attribute table will be deleted.
All values will also be deleted.

  
  
**Parameters:**  
  * *ent\_type\_sel:* Enum, the attribute entity type.  
  * *attribs:* A single attribute name, or a list of attribute names. In 'null' all attributes will be deleted.
  
  
  
## Rename  
  
  
**Description:** Rename an attribute in the model.
The header for column in the attribute table will be renamed.
All values will remain the same.

  
  
**Parameters:**  
  * *ent\_type\_sel:* Enum, the attribute entity type.  
  * *old\_attrib:* The old attribute name.  
  * *new\_attrib:* The old attribute name.
  
  
  
## Push  
  
  
**Description:** Push attributes up or down the hierarchy. The original attribute is not changed.

  
  
**Parameters:**  
  * *entities:* Entities, the entities to push the attribute values for.  
  * *attrib:* The attribute. Can be `name`, `[name, index_or_key]`,
`[source_name, source_index_or_key, target_name]` or `[source_name, source_index_or_key, target_name, target_index_or_key]`.  
  * *ent\_type\_sel:* Enum, the target entity type where the attribute values should be pushed to.  
  * *method\_sel:* Enum, the method for aggregating attribute values in cases where aggregation is necessary.
  
  
  
## Values  
  
  
**Description:** Get a list of unique attribute balues for an attribute.

  
  
**Parameters:**  
  * *ent\_type\_sel:* Enum, the attribute entity type.  
  * *attribs:* undefined  
  
**Returns:** A list of dictionaries, defining the name and type of each attribute.  
**Examples:**  
  * attribs = attrib.Discover("pg")  
    An example of `attribs`: `[{name: "description", type: "str"}, {name: "area", type: "number"}]`.
  
  
  
## Discover  
  
  
**Description:** Get all attribute names and attribute types for an entity type.

  
  
**Parameters:**  
  * *ent\_type\_sel:* Enum, the attribute entity type.  
  
**Returns:** A list of dictionaries, defining the name and type of each attribute.  
**Examples:**  
  * attribs = attrib.Discover("pg")  
    An example of `attribs`: `[{name: "description", type: "str"}, {name: "area", type: "number"}]`.
  
  
  
