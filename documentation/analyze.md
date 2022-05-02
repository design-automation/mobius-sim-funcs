# ANALYZE  
  
The `analysis` module has functions for performing various types of analysis with entities in
the model. These functions all return dictionaries containing the results of the analysis.  
  
  
## Raytrace  
  
  
**Description:** Shoot a set of rays into a set of obstructions, consisting of polygon faces.
One can imagine particles being shot from the ray origin in the ray direction, hitting the
obstructions.


Each ray will either hit an obstruction, or will hit no obstructions.
The length of the ray vector is ignored, only the ray origin and direction is taken into account.
Each particle shot out from a ray will travel a certain distance.
The minimum and maximum distance that the particle will travel is defined by the 'dist' argument.


If a ray particle hits an obstruction, then the 'distance' for that ray is the distance from the * ray origin to the point of intersection.
If the ray particle does not hit an obstruction, then the 'distance' for that ray is equal to
the max for the 'dist' argument.


Returns a dictionary containing the following data.


If 'stats' is selected, the dictionary will contain the following numbers:
1. 'hit_count': the total number of rays that hit an obstruction.
2. 'miss_count': the total number of rays that did not hit any obstruction.
3. 'total_dist': the total of all the ray distances.
4. 'min_dist': the minimum distance for all the rays.
5. 'max_dist': the maximum distance for all the rays.
6. 'avg_dist': the average dist for all the rays.
7. 'dist_ratio': the ratio of 'total_dist' to the maximum distance if not rays hit any
obstructions.


If 'distances' is selected, the dictionary will contain the following list:
1. 'distances': A list of numbers, the distance travelled for each ray.


If 'hit_pgons' is selected, the dictionary will contain the following list:
1. 'hit_pgons': A list of polygon IDs, the polygons hit for each ray, or 'null' if no polygon
was hit.


If 'intersections' is selected, the dictionary will contain the following list:
1. 'intersections': A list of XYZ coords, the point of intersection where the ray hit a polygon,
or 'null' if no polygon was hit.


If 'all' is selected, the dictionary will contain all of the above.


If the input is a list of rays, the output will be a single dictionary.
If the list is empty (i.e. contains no rays), then 'null' is returned.
If the input is a list of lists of rays, then the output will be a list of dictionaries.

  
  
**Parameters:**  
  * *rays:* A ray, a list of rays, or a list of lists of rays.  
  * *entities:* The obstructions, faces, polygons, or collections of faces or polygons.  
  * *dist:* The ray limits, one or two numbers. Either max, or [min, max].  
  * *method:* Enum; values to return.
  
  
  
## Isovist  
  
  
**Description:** Calculates an approximation of the isovist for a set of origins, defined by XYZ coords.


The isovist is calculated by shooting rays out from the origins in a radial pattern.
The 'radius' argument defines the maximum radius of the isovist.
(The radius is used to define the maximum distance for shooting the rays.)
The 'num_rays' argument defines the number of rays that will be shot,
in a radial pattern parallel to the XY plane, with equal angle between rays.
More rays will result in more accurate result, but will also be slower to execute.


Returns a dictionary containing different isovist metrics.


1. 'avg_dist': The average distance from origin to the perimeter.
2. 'min_dist': The minimum distance from the origin to the perimeter.
3. 'max_dist': The minimum distance from the origin to the perimeter.
4. 'area': The area of the isovist.
5. 'perimeter': The perimeter of the isovist.
4. 'area_ratio': The ratio of the area of the isovist to the maximum area.
5. 'perimeter_ratio': The ratio of the perimeter of the isovist to the maximum perimeter.
6. 'circularity': The ratio of the square of the perimeter to area (Davis and Benedikt, 1979).
7. 'compactness': The ratio of average distance to the maximum distance (Michael Batty, 2001).
8. 'cluster': The ratio of the radius of an idealized circle with the actual area of the
isovist to the radius of an idealized circle with the actual perimeter of the circle (Michael Batty, 2001).



  
  
**Parameters:**  
  * *origins:* A list of Rays or a list of Planes, to be used as the origins for calculating the isovists.  
  * *entities:* The obstructions: faces, polygons, or collections.  
  * *radius:* The maximum radius of the isovist.  
  * *num\_rays:* The number of rays to generate when calculating isovists.
  
  
  
## Sky  
  
  
**Description:** Calculate an approximation of the sky exposure factor, for a set sensors positioned at specified locations.
The sky exposure factor for each sensor is a value between 0 and 1, where 0 means that it has no exposure
and 1 means that it has maximum exposure.


Each sensor has a location and direction, specified using either rays or planes.
The direction of the sensor specifies what is infront and what is behind the sensor.
For each sensor, only exposure infront of the sensor is calculated.


The exposure is calculated by shooting rays in reverse.
from the sensor origin to a set of points on the sky dome.
If the rays hits an obstruction, then the sky dome is obstructed..
If the ray hits no obstructions, then the sky dome is not obstructed.


The exposure factor at each sensor point is calculated as follows:
1. Shoot rays to all sky dome points.
2. If the ray hits an obstruction, assign a weight of 0 to that ray.
3. If a ray does not hit any obstructions, assign a weight between 0 and 1, depending on the incidence angle.
4. Calculate the total solar expouse by adding up the weights for all rays.
5. Divide by the maximum possible exposure for an unobstructed sensor with a direction pointing straight up.


If 'weighted' is selected, then
the exposure calculation takes into account the angle of incidence of the ray to the sensor direction.
Rays parallel to the sensor direction are assigned a weight of 1.
Rays at an oblique angle are assigned a weight equal to the cosine of the angle
betweeen the sensor direction and the ray.


If 'unweighted' is selected, then all rays are assigned a weight of 1, irresepctive of angle.


The detail parameter spacifies the number of rays that get generated.
The higher the level of detail, the more accurate but also the slower the analysis will be.


The number of rays are as follows:
0 = 89 rays,
1 = 337 rays,
2 = 1313 rays,
3 = 5185 rays.


Returns a dictionary containing exposure results.


1. 'exposure': A list of numbers, the exposure factors.



  
  
**Parameters:**  
  * *origins:* A list of coordinates, a list of Rays or a list of Planes, to be used as the origins for calculating exposure.  
  * *detail:* An integer between 1 and 3 inclusive, specifying the level of detail for the analysis.  
  * *entities:* The obstructions, faces, polygons, or collections of faces or polygons.  
  * *limits:* The max distance for raytracing.  
  * *method:* Enum; sky method.
  
  
  
## Sun  
  
  
**Description:** Calculate an approximation of the solar exposure factor, for a set sensors positioned at specfied locations.
The solar exposure factor for each sensor is a value between 0 and 1, where 0 means that it has no exposure
and 1 means that it has maximum exposure.


The calculation takes into account the geolocation and the north direction of the model.
Geolocation is specified by a model attributes as follows:
 - @geolocation={'longitude':123,'latitude':12}.
North direction is specified by a model attribute as follows, using a vector:
 - @north==[1,2]
If no north direction is specified, then [0,1] is the default (i.e. north is in the direction of the y-axis);


Each sensor has a location and direction, specified using either rays or planes.
The direction of the sensor specifies what is infront and what is behind the sensor.
For each sensor, only exposure infront of the sensor is calculated.


The exposure is calculated by shooting rays in reverse.
from the sensor origin to a set of points on the sky dome.
If the rays hits an obstruction, then the sky dome is obstructed..
If the ray hits no obstructions, then the sky dome is not obstructed.


The exposure factor at each sensor point is calculated as follows:
1. Shoot rays to all sky dome points.
2. If the ray hits an obstruction, assign a wight of 0 to that ray.
3. If a ray does not hit any obstructions, assign a weight between 0 and 1, depending on the incidence angle.
4. Calculate the total solar expouse by adding up the weights for all rays.
5. Divide by the maximum possible solar exposure for an unobstructed sensor.


The solar exposure calculation takes into account the angle of incidence of the sun ray to the sensor direction.
Sun rays that are hitting the sensor straight on are assigned a weight of 1.
Sun rays that are hitting the sensor at an oblique angle are assigned a weight equal to the cosine of the angle.


If 'direct_exposure' is selected, then the points on the sky dome will follow the path of the sun throughout the year.
If 'indirect_exposure' is selected, then the points on the sky dome will consist of points excluded by
the path of the sun throughout the year.


The direct sky dome points cover a strip of sky where the sun travels.
The inderect sky dome points cover the segments of sky either side of the direct sun strip.


The detail parameter spacifies the number of rays that get generated.
The higher the level of detail, the more accurate but also the slower the analysis will be.
The number of rays differs depending on the latitde.


At latitude 0, the number of rays for 'direct' are as follows:
0 = 44 rays,
1 = 105 rays,
2 = 510 rays,
3 = 1287 rays.


At latitude 0, the number of rays for 'indirect' are as follows:
0 = 58 rays,
1 = 204 rays,
2 = 798 rays,
3 = 3122 rays.


The number of rays for 'sky' are as follows:
0 = 89 rays,
1 = 337 rays,
2 = 1313 rays,
3 = 5185 rays.


Returns a dictionary containing solar exposure results.


If one  of the 'direct' methods is selected, the dictionary will contain:
1. 'direct': A list of numbers, the direct exposure factors.


If one  of the 'indirect' methods is selected, the dictionary will contain:
1. 'indirect': A list of numbers, the indirect exposure factors.



  
  
**Parameters:**  
  * *origins:* A list of coordinates, a list of Rays or a list of Planes, to be used as the origins for calculating exposure.  
  * *detail:* An integer between 1 and 3 inclusive, specifying the level of detail for the analysis.  
  * *entities:* The obstructions, faces, polygons, or collections of faces or polygons.  
  * *limits:* The max distance for raytracing.  
  * *method:* Enum; solar method.
  
  
  
## SkyDome  
  
  
**Description:** Generates a sun path, oriented according to the geolocation and north direction.
The sun path is generated as an aid to visualize the orientation of the sun relative to the model.
Note that the solar exposure calculations do not require the sub path to be visualized.


The sun path takes into account the geolocation and the north direction of the model.
Geolocation is specified by a model attributes as follows:
- @geolocation={'longitude':123,'latitude':12}.
North direction is specified by a model attribute as follows, using a vector:
- @north==[1,2]
If no north direction is specified, then [0,1] is the default (i.e. north is in the direction of the y-axis);

  
  
**Parameters:**  
  * *origin:* undefined  
  * *detail:* The level of detail for the analysis  
  * *radius:* The radius of the sun path  
  * *method:* Enum, the type of sky to generate.
  
  
  
## Nearest  
  
  
**Description:** Finds the nearest positions within a certain maximum radius.


The neighbors to each source position is calculated as follows:
1. Calculate the distance to all target positions.
2. Creat the neighbors set by filtering out target positions that are further than the maximum radius.
3. If the number of neighbors is greater than 'max_neighbors',
then select the 'max_neighbors' closest target positions.


Returns a dictionary containing the nearest positions.


If 'num_neighbors' is 1, the dictionary will contain two lists:
1. 'posis': a list of positions, a subset of positions from the source.
2. 'neighbors': a list of neighbouring positions, a subset of positions from target.


If 'num_neighbors' is greater than 1, the dictionary will contain two lists:
1. 'posis': a list of positions, a subset of positions from the source.
2. 'neighbors': a list of lists of neighbouring positions, a subset of positions from target.

  
  
**Parameters:**  
  * *source:* A list of positions, or entities from which positions can be extracted.  
  * *target:* A list of positions, or entities from which positions can be extracted.
If null, the positions in source will be used.  
  * *radius:* The maximum distance for neighbors. If null, Infinity will be used.  
  * *max\_neighbors:* The maximum number of neighbors to return.
If null, the number of positions in target is used.  
  
**Returns:** A dictionary containing the results.  
  
  
## ShortestPath  
  
  
**Description:** Calculates the shortest path from every source position to every target position.


Paths are calculated through a network of connected edges.
For edges to be connected, vertices must be welded.
For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.


If 'directed' is selected, then the edge direction is taken into account. Each edge will be one-way.
If 'undirected' is selected, the edge direction is ignored. Each edge will be two-way.


Each edge can be assigned a weight.
The shortest path is the path where the sum of the weights of the edges along the path is the minimum.


By default, all edges are assigned a weight of 1.
Default weights can be overridden by creating a numeric attribute on edges call 'weight'.


Returns a dictionary containing the shortest paths.


If 'distances' is selected, the dictionary will contain two list:
1. 'source_posis': a list of start positions for eah path,
2. 'distances': a list of distances, one list for each path starting at each source position.


If 'counts' is selected, the dictionary will contain four lists:
1. 'posis': a list of positions traversed by the paths,
2. 'posis_count': a list of numbers that count how often each position was traversed,
3. 'edges': a list of edges traversed by the paths,
4. 'edges_count': a list of numbers that count how often each edge was traversed.


If 'paths' is selected, the dictionary will contain two lists of lists:
1. 'posi_paths': a list of lists of positions, one list for each path,
2. 'edge_paths': a list of lists of edges, one list for each path.


If 'all' is selected, the dictionary will contain all lists just described.

  
  
**Parameters:**  
  * *source:* Path source, a list of positions, or entities from which positions can be extracted.  
  * *target:* Path target, a list of positions, or entities from which positions can be extracted.  
  * *entities:* The network, edges, or entities from which edges can be extracted.  
  * *method:* Enum, the method to use, directed or undirected.  
  * *result:* Enum, the data to return, positions, edges, or both.  
  
**Returns:** A dictionary containing the results.  
  
  
## ClosestPath  
  
  
**Description:** Calculates the shortest path from every position in source, to the closest position in target.


This differs from the 'analyze.ShortestPath()' function. If you specify multiple target positions,
for each cource position,
the 'analyze.ShortestPath()' function will calculate multiple shortest paths,
i.e. the shortest path to all targets.
This function will caculate just one shortest path,
i.e. the shortest path to the closest target.


Paths are calculated through a network of connected edges.
For edges to be connected, vertices must be welded.
For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.


If 'directed' is selected, then the edge direction is taken into account. Each edge will be one-way.
If 'undirected' is selected, the edge direction is ignored. Each edge will be two-way.


Each edge can be assigned a weight.
The shortest path is the path where the sum of the weights of the edges along the path is the minimum.


By default, all edges are assigned a weight of 1.
Default weights can be overridden by creating a numeric attribute on edges call 'weight'.


Returns a dictionary containing the shortes paths.


If 'distances' is selected, the dictionary will contain one list:
1. 'distances': a list of distances.


If 'counts' is selected, the dictionary will contain four lists:
1. 'posis': a list of positions traversed by the paths,
2. 'posis_count': a list of numbers that count how often each position was traversed.
3. 'edges': a list of edges traversed by the paths,
4. 'edges_count': a list of numbers that count how often each edge was traversed.


If 'paths' is selected, the dictionary will contain two lists of lists:
1. 'posi_paths': a list of lists of positions, one list for each path.
2. 'edge_paths': a list of lists of edges, one list for each path.


If 'all' is selected, the dictionary will contain all lists just described.

  
  
**Parameters:**  
  * *source:* Path source, a list of positions, or entities from which positions can be extracted.  
  * *target:* Path source, a list of positions, or entities from which positions can be extracted.  
  * *entities:* The network, edges, or entities from which edges can be extracted.  
  * *method:* Enum, the method to use, directed or undirected.  
  * *result:* Enum, the data to return, positions, edges, or both.  
  
**Returns:** A dictionary containing the results.  
  
  
## Degree  
  
  
**Description:** Calculates degree centrality for positions in a network. Values are normalized in the range 0 to 1.


The network is defined by a set of connected edges, consisting of polylines and/or polygons.
For edges to be connected, vertices must be welded.
For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.


Degree centrality is based on the idea that the centrality of a position in a network is related to
the number of direct links that it has to other positions.


If 'undirected' is selected,  degree centrality is calculated by summing up the weights
of all edges connected to a position.
If 'directed' is selected, then two types of centrality are calculated: incoming degree and
outgoing degree.
Incoming degree is calculated by summing up the weights of all incoming edges connected to a position.
Outgoing degree is calculated by summing up the weights of all outgoing edges connected to a position.


Default weight is 1 for all edges. Weights can be specified using an attribute called 'weight' on edges.


Returns a dictionary containing the results.


If 'undirected' is selected, the dictionary will contain  the following:
1. 'posis': a list of position IDs.
2. 'degree': a list of numbers, the values for degree centrality.


If 'directed' is selected, the dictionary will contain  the following:
1. 'posis': a list of position IDs.
2. 'indegree': a list of numbers, the values for incoming degree centrality.
3. 'outdegree': a list of numbers, the values for outgoing degree centrality.

  
  
**Parameters:**  
  * *source:* A list of positions, or entities from which positions can be extracted.
These positions should be part of the network.  
  * *entities:* The network, edges, or entities from which edges can be extracted.  
  * *alpha:* The alpha value for the centrality calculation, ranging on [0, 1]. With value 0,
disregards edge weights and solely uses number of edges in the centrality calculation. With value 1,
disregards number of edges and solely uses the edge weights in the centrality calculation.  
  * *method:* Enum, the method to use, directed or undirected.  
  
**Returns:** A dictionary containing the results.  
  
  
## Centrality  
  
  
**Description:** Calculates betweenness, closeness, and harmonic centrality
for positions in a network. Values are normalized in the range 0 to 1.


The network is defined by a set of connected edges, consisting of polylines and/or polygons.
For edges to be connected, vertices must be welded.
For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.


Centralities are calculate based on distances between positions.
The distance between two positions is the shortest path between those positions.
The shortest path is the path where the sum of the weights of the edges along the path is the minimum.


Default weight is 1 for all edges. Weights can be specified using an attribute called 'weight' on edges.


Closeness centrality is calculated by inverting the sum of the distances to all other positions.


Harmonic centrality is calculated by summing up the inverted distances to all other positions.


Betweenness centrality os calculated in two steps.
First, the shortest path between every pair of nodes is calculated.
Second, the betweenness centrality of each node is then the total number of times the node is traversed
by the shortest paths.


For closeness centrality, the network is first split up into connected sub-networks.
This is because closeness centrality cannot be calculated on networks that are not fully connected.
The closeness centrality is then calculated for each sub-network seperately.


For harmonic centrality, care must be taken when defining custom weights.
Weight with zero values or very small values will result in errors or will distort the results.
This is due to the inversion operation: 1 / weight.


Returns a dictionary containing the results.


1. 'posis': a list of position IDs.
2. 'centrality': a list of numbers, the values for centrality, either betweenness, closeness, or harmonic.

  
  
**Parameters:**  
  * *source:* A list of positions, or entities from which positions can be extracted.
These positions should be part of the network.  
  * *entities:* The network, edges, or entities from which edges can be extracted.  
  * *method:* Enum, the method to use, directed or undirected.  
  * *cen\_type:* Enum, the data to return, positions, edges, or both.  
  
**Returns:** A list of centrality values, between 0 and 1.  
  
  
## View  
  
  
**Description:** Calculates an approximation of the unobstructed view for a set of origins.


Typically, the origins are created as centroids of a set of windows.


The unobstructed view is calculated by shooting rays out from the origins in a fan pattern.
The 'radius' argument defines the maximum radius of the unobstructed view.
(The radius is used to define the maximum distance for shooting the rays.)
The 'num_rays' argument defines the number of rays that will be shot,
in a fab pattern parallel to the XY plane, with equal angle between rays.
More rays will result in more accurate result, but will also be slower to execute.


Returns a dictionary containing different unobstructed view metrics.



  
  
**Parameters:**  
  * *origins:* A list of Rays or Planes, to be used as the origins for calculating the uobstructed views.  
  * *entities:* The obstructions: faces, polygons, or collections.  
  * *radius:* The maximum radius of the uobstructed views.  
  * *num\_rays:* The number of rays to generate when calculating uobstructed views.  
  * *view\_ang:* The angle of the unobstructed view, in radians.
  
  
  
## Visibility  
  
  
**Description:** Calculates the visibility of a set of target positions from a set of origins.


Typically, the origins are created as centroids of a set of windows. The targets are a set of positions
whose visibility is to be analysed.


The visibility is calculated by shooting rays out from the origins towards the targets.
The 'radius' argument defines the maximum radius of the visibility.
(The radius is used to define the maximum distance for shooting the rays.)


Returns a dictionary containing different visibility metrics.



  
  
**Parameters:**  
  * *origins:* A list of Rays or Planes, to be used as the origins for calculating the uobstructed views.  
  * *entities:* The obstructions: faces, polygons, or collections.  
  * *radius:* The maximum radius of the visibility analysis.  
  * *targets:* The traget positions.
  
  
  
