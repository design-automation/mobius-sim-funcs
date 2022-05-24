# UTIL  
  
The `util` module has some utility functions used for debugging.  
  
  
## Select  
  
  
**Description:** Select entities in the model.  
  
**Parameters:**  
  * *entities:* The entities to be selected.  
  
**Returns:** void  
  
  
## HTTPRequest  
  
  
**Description:** Create a http request to a URL.
Typically used with a server that runs simulations, or to download data.  
  
**Parameters:**  
  * *request\_data:* Request data. Can be 'null' to request everything.  
  * *request\_url:* Request url, as a string.  
  * *method:* Enum, HTTP method: `'GET', 'POST', 'PATCH', 'DELETE'` or `'PUT'`.  
  
**Returns:** The request response: JSON data in the form of a dictionary.  
**Examples:**  
  * `data = util.HTTPRequest(null, "websiteurl.com", "GET")`  
  
  
## VrHotspot  
  
  
**Description:** Creta a VR hotspot. In the VR Viewer, you can teleport to such hotspots.

  
  
**Parameters:**  
  * *point:* A point object to be used for creating hotspots.  
  * *name:* A name for the VR hotspots. If `null`, a default name will be created.  
  * *camera\_rot:* The rotation of the camera direction when you teleport to the hotspot. The
rotation is specified in degrees, in the counter-clockwise direction, starting from the Y axis.
If `null`, the camera rotation will default to 0.  
  
**Returns:** void  
  
  
## VrPanorama  
  
  
**Description:** Create a VR panorama hotspot. In the VR Viewer, you can teleport to such hotspots.When you enter
the hotspot, the panorama images will be loaded into the view. 
  
  
**Parameters:**  
  * *point:* The point object to be used for creating a panorama. If this point is already
defined as a VR hotspot, then the panorama hotspot will inherit the name and camera angle.  
  * *back\_url:* The URL of the 360 degree panorama image to be used for the background.  
  * *back\_rot:* The rotation of the background panorama image, in degrees, in the
counter-clockwise direction. If `null`, then rotation will be 0.  
  * *fore\_url:* The URL of the 360 degree panorama image to be used for the foreground. If `null`
then no foreground image will be used.  
  * *fore\_rot:* The rotation of the forground panorama image, in degrees, in the
counter-clockwise direction. If `null`, then the foreground rotation will be equal to the background rotation.  
  
**Returns:** void  
  
  
## ParamInfo  
  
  
**Description:** Returns a html string representation of the parameters in the model.
The string can be printed to the console for viewing.  
  
**Parameters:**  
  
**Returns:** A dictionary that summarises what is in the model.  
  
  
## EntityInfo  
  
  
**Description:** Returns a html string representation of one or more entities in the model.
The string can be printed to the console for viewing.  
  
**Parameters:**  
  * *entities:* One or more objects or collections.  
  
**Returns:** Text that summarises what is in the model, click print to see this text.  
  
  
## ModelInfo  
  
  
**Description:** Returns a html string representation of the contents of this model.
The string can be printed to the console for viewing.  
  
**Parameters:**  
  
**Returns:** Text that summarises what is in the model, click print to see this text.  
  
  
## ModelCheck  
  
  
**Description:** Checks the internal consistency of the model. Used for debugigng Mobius.  
  
**Parameters:**  
  
**Returns:** Text that summarises what is in the model, click print to see this text.  
  
  
## ModelCompare  
  
  
**Description:** Compares two models. Used for grading models.


Checks that every entity in this model also exists in the input_data.


Additional entities in the input data will not affect the score.


Attributes at the model level are ignored except for the `material` attributes.


For grading, this model is assumed to be the answer model, and the input model is assumed to be
the model submitted by the student.


The order or entities in this model may be modified in the comparison process.


For specifying the location of the GI Model, you can either specify a URL, or the name of a file
in LocalStorage.
In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'  
  
**Parameters:**  
  * *input\_data:* The location of the GI Model to compare this model to.  
  
**Returns:** Text that summarises the comparison between the two models.  
  
  
## ModelMerge  
  
  
**Description:** Merges data from another model into this model.
This is the same as importing the model, except that no collection is created.


For specifying the location of the GI Model, you can either specify a URL, or the name of a file
in LocalStorage.
In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'  
  
**Parameters:**  
  * *input\_data:* The location of the GI Model to import into this model.  
  
**Returns:** Text that summarises the comparison between the two models.  
  
  
## SendData  
  
  
**Description:** Post a message to the parent window. Used when Mobius is embedded in an external website.  
  
**Parameters:**  
  * *data:* The data to send, a list or a dictionary.  
  
**Returns:** A message in the parent window.  
  
  
