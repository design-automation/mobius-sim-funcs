# MATERIAL  
  
The `material` module has functions for defining materials.
The material definitions are saved as attributes at the model level.
For more informtion, see the <a href="https://threejs.org/" target="_blank">threejs docs.</a>  
  
  
## Set  
  
  
**Description:** Assign a material to one or more polylines or polygons.


A material name is assigned to the polygons. The named material must be separately defined as a
material in the model attributes. See the `material.LineMat()` or `material.MeshMat()` functions.


The material name is a string.


For polylines, the `material` argument must be a single name.


For polygons, the `material` argument can accept either a single name, or a
list of two names. If it is a single name, then the same material is assigned to both the
front and back of the polygon. If it is a list of two names, then the first material is assigned
to the front, and the second material is assigned to the back.

  
  
**Parameters:**  
  * *entities:* The entities for which to set the material.  
  * *material:* The name of the material.  
  
**Returns:** void  
  
  
## LineMat  
  
  
**Description:** Creates a line material and saves it in the model attributes.


[See the threejs docs on LineBasicMaterials](https://threejs.org/docs/#api/en/materials/LineBasicMaterial)
[See the threejs docs LineDashedMaterials](https://threejs.org/docs/#api/en/materials/LineDashedMaterial)


The color of the material can either ignore or apply the vertex rgb colors.
- If 'color' is set to `null`, it will apply the vertex rgb colors.
- If 'color' is set to `[r, g, b]`, it will apply the given color.


In order to assign a material to polylines in the model, a polyline attribute called 'material'
will be created. The value for each polyline must either be null, or must be a material name.


For dashed lines, the 'dash\_gap\_scale' parameter can be set.
- If 'dash\_gap\_scale' is null, it will result in a continuous line.
- If 'dash\_gap\_scale' is a single number: dash = gap = dash\_gap\_scale, scale = 1.
- If 'dash\_gap\_scale' is a list of two numbers: dash = dash\_gap\_scale[0], gap = dash\_gap\_scale[1], scale = 1.
- If 'dash\_gap\_scale' is a list of three numbers: dash = dash\_gap\_scale[0], gap = dash\_gap\_scale[1], scale = dash\_gap\_scale[2].


Due to limitations of the OpenGL Core Profile with the WebGL renderer on most platforms,
line widths cannot be rendered. As a result, lines width will always be set to 1.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *color:* Null to apply vertex colors, or the diffuse color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  * *dash\_gap\_scale:* Size of the dash and gap, and a scale factor. (The gap and scale are optional.)  
  
**Returns:** void  
  
  
## MeshMat  
  
  
**Description:** Creates a basic mesh material and saves it in the model attributes.


[See the threejs docs on basic mesh materials](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial)


The color of the material can either ignore or apply the vertex rgb colors.
- If 'color' is set to `null`, it will apply the vertex rgb colors.
- If 'color' is set to `[r, g, b]`, it will apply the given color.


Additional material properties can be set by calling the functions for the more advanced materials.
These include LambertMaterial, PhongMaterial, StandardMaterial, and Physical Material.
Each of these more advanced materials allows you to specify certain additional settings.


In order to assign a material to polygons in the model, a polygon attribute called 'material'
needs to be created. The value for each polygon must either be null, or must be a material name.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *color:* The diffuse color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  * *opacity:* The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).  
  * *select\_side:* Enum, select where to apply colors: `'front', 'back'`, or `'both'`.  
  
**Returns:** void  
  
  
## Glass  
  
  
**Description:** Creates a glass material with an opacity setting. The material will default to a Phong material.


In order to assign a material to polygons in the model, a polygon attribute called 'material'
needs to be created. The value for each polygon must either be null, or must be a material name.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *opacity:* The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).  
  
**Returns:** void  
  
  
## Lambert  
  
  
**Description:** Creates a Lambert material and saves it in the model attributes.
If a material with the same name already exits, these settings will be added to the existing material.


[See the threejs docs on Lambert materials](https://threejs.org/docs/#api/en/materials/MeshLambertMaterial)


In order to assign a material to polygons in the model, a polygon attribute called 'material'
needs to be created. The value for each polygon must either be null, or must be a material name.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *emissive:* The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  
**Returns:** void  
  
  
## Phong  
  
  
**Description:** Creates a Phong material and saves it in the model attributes.
If a material with the same name already exits, these settings will be added to the existing material.


[See the threejs docs on Phong materials](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial)


In order to assign a material to polygons in the model, a polygon attribute called 'material'
needs to be created. The value for each polygon must either be null, or must be a material name.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *emissive:* The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  * *specular:* The specular color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  * *shininess:* The shininess, between 0 and 100.  
  
**Returns:** void  
  
  
## Standard  
  
  
**Description:** Creates a Standard material and saves it in the model attributes.
If a material with the same name already exits, these settings will be added to the existing material.


[See the threejs docs on Standard materials](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)


In order to assign a material to polygons in the model, a polygon attribute called 'material'
needs to be created. The value for each polygon must either be null, or must be a material name.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *emissive:* The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  * *roughness:* The roughness, between 0 (smooth) and 1 (rough).  
  * *metalness:* The metalness, between 0 (non-metalic) and 1 (metalic).  
  
**Returns:** void  
  
  
## Physical  
  
  
**Description:** Creates a Physical material and saves it in the model attributes.
If a material with the same name already exits, these settings will be added to the existing material.


[See the threejs docs on Physical materials](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial)


In order to assign a material to polygons in the model, a polygon attribute called 'material'
needs to be created. The value for each polygon must either be null, or must be a material name.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *emissive:* The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  * *roughness:* The roughness, between 0 (smooth) and 1 (rough).  
  * *metalness:* The metalness, between 0 (non-metalic) and 1 (metalic).  
  * *reflectivity:* The reflectivity, between 0 (non-reflective) and 1 (reflective).  
  
**Returns:** void  
  
  
