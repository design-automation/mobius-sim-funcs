import { arrMakeFlat, EEntType, idsBreak, idsMakeFromIdxs } from '@design-automation/mobius-sim';
import cytoscape from 'cytoscape';
import { checkIDs, ID } from '../../../_check_ids';
import { _EShortestPathMethod, _EShortestPathResult } from './_enum';
import { _cytoscapeGetElements, _cytoscapeWeightFn, _getUniquePosis } from './_shared';
/**
 * Calculates the shortest path from every source position to every target position.
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
 * Returns a dictionary containing the shortest paths.
 * \n
 * If 'distances' is selected, the dictionary will contain two list:
 * 1. 'source_posis': a list of start positions for eah path,
 * 2. 'distances': a list of distances, one list for each path starting at each source position.
 * \n
 * If 'counts' is selected, the dictionary will contain four lists:
 * 1. 'posis': a list of positions traversed by the paths,
 * 2. 'posis_count': a list of numbers that count how often each position was traversed,
 * 3. 'edges': a list of edges traversed by the paths,
 * 4. 'edges_count': a list of numbers that count how often each edge was traversed.
 * \n
 * If 'paths' is selected, the dictionary will contain two lists of lists:
 * 1. 'posi_paths': a list of lists of positions, one list for each path,
 * 2. 'edge_paths': a list of lists of edges, one list for each path.
 * \n
 * If 'all' is selected, the dictionary will contain all lists just described.
 * \n
 * @param __model__
 * @param source Path source, a list of positions, or entities from which positions can be extracted.
 * @param target Path target, a list of positions, or entities from which positions can be extracted.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param method Enum, the method to use, directed or undirected.
 * @param result Enum, the data to return, positions, edges, or both.
 * @returns A dictionary containing the results.
 */
export function ShortestPath(__model__, source, target, entities, method, result) {
    source = source === null ? [] : arrMakeFlat(source);
    target = target === null ? [] : arrMakeFlat(target);
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = "analyze.ShortestPath";
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
    const all_path_dists = [];
    for (const source_posi_i of source_posis_i) {
        const path_dists = [];
        const cy_source_elem = cy.getElementById(source_posi_i.toString());
        const dijkstra = cy.elements().dijkstra({
            root: cy_source_elem,
            weight: _cytoscapeWeightFn,
            directed: directed,
        });
        for (const target_posi_i of target_posis_i) {
            const cy_node = cy.getElementById(target_posi_i.toString());
            const dist = dijkstra.distanceTo(cy_node);
            const cy_path = dijkstra.pathTo(cy_node);
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
                path_dists.push(dist);
            }
        }
        all_path_dists.push(path_dists);
    }
    const dict = {};
    if (return_dists) {
        dict.source_posis = idsMakeFromIdxs(EEntType.POSI, source_posis_i);
        dict.distances = source_posis_i.length === 1 ? all_path_dists[0] : all_path_dists;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hvcnRlc3RQYXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2FuYWx5emUvU2hvcnRlc3RQYXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFXLFFBQVEsRUFBRSxlQUFlLEVBQW9CLE1BQU0sK0JBQStCLENBQUM7QUFDNUgsT0FBTyxTQUFTLE1BQU0sV0FBVyxDQUFDO0FBRWxDLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLG9CQUFvQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFZdkY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUNHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FDeEIsU0FBa0IsRUFDbEIsTUFBK0IsRUFDL0IsTUFBNkIsRUFDN0IsUUFBK0IsRUFDL0IsTUFBNEIsRUFDNUIsTUFBNEI7SUFFNUIsTUFBTSxHQUFHLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBVyxDQUFDO0lBQy9ELE1BQU0sR0FBRyxNQUFNLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFFLFdBQVcsQ0FBQyxNQUFNLENBQVcsQ0FBQztJQUMvRCxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBVSxDQUFDO0lBQzFDLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxzQkFBc0IsQ0FBQztJQUN2QyxJQUFJLGdCQUErQixDQUFDO0lBQ3BDLElBQUksZ0JBQStCLENBQUM7SUFDcEMsSUFBSSxT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