import { arrMakeFlat, EEntType, idsBreak, idsMakeFromIdxs } from '@design-automation/mobius-sim';
import cytoscape from 'cytoscape';
import { checkIDs, ID } from '../../../_check_ids';
import { _EShortestPathMethod, _EShortestPathResult } from './_enum';
import { _cytoscapeGetElements, _cytoscapeWeightFn, _getUniquePosis } from './_shared';
/**
 * Calculates the shortest path from every position in source, to the closest position in target.
 * \n
 * This differs from the 'analyze.ShortestPath()' function. If you specify multiple target positions,
 * for each cource position,
 * the 'analyze.ShortestPath()' function will calculate multiple shortest paths,
 * i.e. the shortest path to all targets.
 * This function will caculate just one shortest path,
 * i.e. the shortest path to the closest target.
 * \n
 * Paths are calculated through a network of connected edges.
 * For edges to be connected, vertices must be welded.
 * For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.
 * \n
 * If 'directed' is selected, then the edge direction is taken into account. Each edge will be one-way.
 * If 'undirected' is selected, the edge direction is ignored. Each edge will be two-way.
 * \n
 * Each edge can be assigned a weight.
 * The shortest path is the path where the sum of the weights of the edges along the path is the minimum.
 * \n
 * By default, all edges are assigned a weight of 1.
 * Default weights can be overridden by creating a numeric attribute on edges call 'weight'.
 * \n
 * Returns a dictionary containing the shortes paths.
 * \n
 * If 'distances' is selected, the dictionary will contain one list:
 * 1. 'distances': a list of distances.
 * \n
 * If 'counts' is selected, the dictionary will contain four lists:
 * 1. 'posis': a list of positions traversed by the paths,
 * 2. 'posis_count': a list of numbers that count how often each position was traversed.
 * 3. 'edges': a list of edges traversed by the paths,
 * 4. 'edges_count': a list of numbers that count how often each edge was traversed.
 * \n
 * If 'paths' is selected, the dictionary will contain two lists of lists:
 * 1. 'posi_paths': a list of lists of positions, one list for each path.
 * 2. 'edge_paths': a list of lists of edges, one list for each path.
 * \n
 * If 'all' is selected, the dictionary will contain all lists just described.
 * \n
 * @param __model__
 * @param source Path source, a list of positions, or entities from which positions can be extracted.
 * @param target Path source, a list of positions, or entities from which positions can be extracted.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param method Enum, the method to use, directed or undirected.
 * @param result Enum, the data to return, positions, edges, or both.
 * @returns A dictionary containing the results.
 */
export function ClosestPath(__model__, source, target, entities, method, result) {
    source = source === null ? [] : arrMakeFlat(source);
    target = target === null ? [] : arrMakeFlat(target);
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = "analyze.ClosestPath";
    let source_ents_arrs;
    let target_ents_arrs;
    let ents_arrs;
    if (__model__.debug) {
        source_ents_arrs = checkIDs(__model__, fn_name, "origins", source, [ID.isID, ID.isIDL1], null);
        target_ents_arrs = checkIDs(__model__, fn_name, "destinations", target, [ID.isID, ID.isIDL1], null);
        ents_arrs = checkIDs(__model__, fn_name, "entities", entities, [ID.isID, ID.isIDL1], null);
    }
    else {
        // source_ents_arrs = splitIDs(fn_name, 'origins', source,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // target_ents_arrs = splitIDs(fn_name, 'destinations', target,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // ents_arrs = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = idsBreak(source);
        target_ents_arrs = idsBreak(target);
        ents_arrs = idsBreak(entities);
    }
    // --- Error Check ---
    const directed = method === _EShortestPathMethod.DIRECTED ? true : false;
    let return_dists = true;
    let return_counts = true;
    let return_paths = true;
    switch (result) {
        case _EShortestPathResult.DISTS:
            return_paths = false;
            return_counts = false;
            break;
        case _EShortestPathResult.COUNTS:
            return_dists = false;
            return_paths = false;
            break;
        case _EShortestPathResult.PATHS:
            return_dists = false;
            return_counts = false;
            break;
        default:
            // all true
            break;
    }
    const source_posis_i = _getUniquePosis(__model__, source.length === 0 ? ents_arrs : source_ents_arrs);
    const target_posis_i = _getUniquePosis(__model__, target.length === 0 ? ents_arrs : target_ents_arrs);
    const cy_elems = _cytoscapeGetElements(__model__, ents_arrs, source_posis_i, target_posis_i, directed);
    // create the cytoscape object
    const cy = cytoscape({
        elements: cy_elems,
        headless: true,
    });
    const map_edges_i = new Map();
    const map_posis_i = new Map();
    const posi_paths = [];
    const edge_paths = [];
    const path_dists = [];
    for (const source_posi_i of source_posis_i) {
        const cy_source_elem = cy.getElementById(source_posi_i.toString());
        const dijkstra = cy.elements().dijkstra({
            root: cy_source_elem,
            weight: _cytoscapeWeightFn,
            directed: directed,
        });
        let closest_target_posi_i = null;
        let closest_dist = Infinity;
        for (const target_posi_i of target_posis_i) {
            // find shortest path
            const dist = dijkstra.distanceTo(cy.getElementById(target_posi_i.toString()));
            if (dist < closest_dist) {
                closest_dist = dist;
                closest_target_posi_i = target_posi_i;
            }
        }
        if (closest_target_posi_i !== null) {
            // get shortest path
            const cy_path = dijkstra.pathTo(cy.getElementById(closest_target_posi_i.toString()));
            // get the data
            const posi_path = [];
            const edge_path = [];
            for (const cy_path_elem of cy_path.toArray()) {
                if (cy_path_elem.isEdge()) {
                    const edge_i = cy_path_elem.data("idx");
                    if (return_counts) {
                        if (!map_edges_i.has(edge_i)) {
                            map_edges_i.set(edge_i, 1);
                        }
                        else {
                            map_edges_i.set(edge_i, map_edges_i.get(edge_i) + 1);
                        }
                        if (!directed) {
                            const edge2_i = cy_path_elem.data("idx2");
                            if (edge2_i !== null) {
                                if (!map_edges_i.has(edge2_i)) {
                                    map_edges_i.set(edge2_i, 1);
                                }
                                else {
                                    map_edges_i.set(edge2_i, map_edges_i.get(edge2_i) + 1);
                                }
                            }
                        }
                    }
                    if (return_paths) {
                        edge_path.push(edge_i);
                    }
                }
                else {
                    const posi_i = cy_path_elem.data("idx");
                    if (return_counts) {
                        if (!map_posis_i.has(posi_i)) {
                            map_posis_i.set(posi_i, 1);
                        }
                        else {
                            map_posis_i.set(posi_i, map_posis_i.get(posi_i) + 1);
                        }
                    }
                    if (return_paths) {
                        posi_path.push(posi_i);
                    }
                }
            }
            if (return_paths) {
                edge_paths.push(edge_path);
                posi_paths.push(posi_path);
            }
            if (return_dists) {
                path_dists.push(closest_dist);
            }
        }
        else {
            if (return_paths) {
                edge_paths.push([]);
                posi_paths.push([]);
            }
            if (return_dists) {
                path_dists.push(1e8); // TODO, cannot pas Infinity due to JSON issues
            }
        }
    }
    const dict = {};
    if (return_dists) {
        dict.source_posis = idsMakeFromIdxs(EEntType.POSI, source_posis_i);
        dict.distances = path_dists;
    }
    if (return_counts) {
        dict.edges = idsMakeFromIdxs(EEntType.EDGE, Array.from(map_edges_i.keys()));
        dict.edges_count = Array.from(map_edges_i.values());
        dict.posis = idsMakeFromIdxs(EEntType.POSI, Array.from(map_posis_i.keys()));
        dict.posis_count = Array.from(map_posis_i.values());
    }
    if (return_paths) {
        dict.edge_paths = idsMakeFromIdxs(EEntType.EDGE, edge_paths);
        dict.posi_paths = idsMakeFromIdxs(EEntType.POSI, posi_paths);
    }
    return dict;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvc2VzdFBhdGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYW5hbHl6ZS9DbG9zZXN0UGF0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBVyxRQUFRLEVBQUUsZUFBZSxFQUFvQixNQUFNLCtCQUErQixDQUFDO0FBQzVILE9BQU8sU0FBUyxNQUFNLFdBQVcsQ0FBQztBQUVsQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNyRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBYXZGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQStDRztBQUNILE1BQU0sVUFBVSxXQUFXLENBQ3ZCLFNBQWtCLEVBQ2xCLE1BQStCLEVBQy9CLE1BQTZCLEVBQzdCLFFBQStCLEVBQy9CLE1BQTRCLEVBQzVCLE1BQTRCO0lBRTVCLE1BQU0sR0FBRyxNQUFNLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFFLFdBQVcsQ0FBQyxNQUFNLENBQVcsQ0FBQztJQUMvRCxNQUFNLEdBQUcsTUFBTSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBRSxXQUFXLENBQUMsTUFBTSxDQUFXLENBQUM7SUFDL0QsUUFBUSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQVUsQ0FBQztJQUMxQyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcscUJBQXFCLENBQUM7SUFDdEMsSUFBSSxnQkFBK0IsQ0FBQztJQUNwQyxJQUFJLGdCQUErQixDQUFDO0lBQ3BDLElB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