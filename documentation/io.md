# IO  
  
The `io` module has functions for importing and exporting.  
  
  
## Read  
  
  
**Description:** Read data from a Url or from local storage.  
  
**Parameters:**  
  * *data:* The data to be read (from URL or from Local Storage).  
  
**Returns:** The data.  
  
  
## Write  
  
  
**Description:** Write data to the hard disk or to the local storage.
Depending on your browser's download settings,
a dialog box may pop up to manually confirm the action if writing to the hard disk.  
  
**Parameters:**  
  * *data:* The data to be saved (can be the url to the file).  
  * *file\_name:* The name to be saved in the file system as a string (file extension should be included).  
  * *data\_target:* Enum, where the data is to be exported to: `'Save to Hard Disk'` or `'Save to Local Storage'`.  
  
**Returns:** Whether the data is successfully saved. (True/false)  
  
  
## ImportData  
  
  
**Description:** Imports a string of geometry data into the model, in various formats.
The geometry will be added to the model.

  
  
**Parameters:**  
  * *model\_data:* The model data.  
  * *data\_format:* Enum, the file format: `'gi', 'sim', 'obj', 'geojson'` or `'CityJSON'`.  
  
**Returns:** A collection of entities added to the model.  
**Examples:**  
  * `io.ImportData (data_str, "obj")`  
    Imports the data in obj format.
  
  
  
## Import  
  
  
**Description:** Imports data into the model.


There are two ways of specifying the file location to be imported:
- A url, e.g. "https://www.dropbox.com/xxxx/my_data.obj"
- A file name in the local storage, e.g. "my\_data.obj". See documentation on local storage in
the menu for more info.


To place a file in local storage, go to the Mobius menu, and select 'Local Storage' from the
dropdown.
Note that a script using a file in local storage may fail when others try to open the file.

  
  
**Parameters:**  
  * *data\_url:* The url to retrieve the data from.  
  * *data\_format:* Enum, the file format: `'gi', 'sim', 'obj', 'geojson'` or `'CityJSON'`.  
  
**Returns:** A list of the positions, points, polylines, polygons and collections added to the model.  
**Examples:**  
  * `io.Import ("my_data.obj", obj)`  
    Imports the data from my\_data.obj, from local storage.
  
  
  
## Export  
  
  
**Description:** Export data from the model as a file.


If you export to your hard disk,
it will result in a popup in your browser, asking you to save the file.


If you export to Local Storage, there will be no popup.

  
  
**Parameters:**  
  * *entities:* (Optional) Entities to be exported. If null, the whole model will be exported.  
  * *file\_name:* Name of the file as a string.  
  * *data\_format:* Enum, the export file format: `'gi', 'sim', 'obj_v', 'obj_ps', 'geojson'`
or `'gltf'`.  
  * *data\_target:* Enum, where the data is to be exported to: `'Save to Hard Disk'` or
`'Save to Local Storage'`.  
  
**Returns:** void  
**Examples:**  
  * `io.Export (#pg, 'my\_model.obj', 'obj', 'Save to Hard Disk')`  
    Exports all the polygons in the model as an OBJ, saved to the hard disk.
  
  
  
## ExportData  
  
  
**Description:** Export data from the model as a string.

  
  
**Parameters:**  
  * *entities:* (Optional) Entities to be exported. If null, the whole model will be exported.  
  * *data\_format:* Enum, the export file format: `'gi', 'sim', 'obj_v', 'obj_ps', 'geojson'` or `'gltf'`.  
  
**Returns:** The model data as a string.  
**Examples:**  
  * `io.Export (#pg, 'my_model.obj', 'obj')`  
    Exports all the polygons in the model as an OBJ.
  
  
  
## Geolocate  
  
  
**Description:** Set the geolocation of the Cartesian coordinate system.
Does the same as the Geoalign function, but with alternate parameters.


The Cartesian coordinate system is geolocated by defining two points:
- The latitude-longitude of the Cartesian origin.
- The counter-clockwise rotation around the Cartesian origin, in radians.

  
  
**Parameters:**  
  * *lat\_long:* Set the latitude and longitude of the origin of the Cartesian coordinate system.  
  * *rot:* Set the counter-clockwise rotation of the Cartesian coordinate system, in radians.  
  * *elev:* Set the elevation of the Cartesian coordinate system above the ground plane.  
  
**Returns:** void  
  
  
## Geoalign  
  
  
**Description:** Set the geolocation of the Cartesian coordinate system.
Does the same as the Geolocate function, but with alternate parameters.


The Cartesian coordinate system is geolocated by defining two points:
- The latitude-longitude of the Cartesian origin.
- The latitude-longitude of a point on the positive Cartesian X-axis.

  
  
**Parameters:**  
  * *lat\_long\_o:* Set the latitude and longitude of the origin of the Cartesian coordinate
system.  
  * *lat\_long\_x:* Set the latitude and longitude of a point on the x-axis of the Cartesian
coordinate system.  
  * *elev:* Set the elevation of the Cartesian coordinate system above the ground plane.  
  
**Returns:** void  
  
  
## LatLong2XYZ  
  
  
**Description:** Transform a coordinate from latitude-longitude Geodesic coordinate to a Cartesian XYZ coordinate,
based on the geolocation of the model.  
  
**Parameters:**  
  * *lat\_long:* Latitude and longitude coordinates.  
  * *elev:* Set the elevation of the Cartesian coordinate system above the ground plane.  
  
**Returns:** XYZ coordinates.  
  
  
## _getFile  
  
  
**Description:** undefined  
  
**Parameters:**  
  * *source:* undefined  
  
  
