import { arrMakeFlat, EEntType, GIModel, idsBreak, idsMakeFromIdxs, TEntTypeIdx, TId } from '@design-automation/mobius-sim';
import cytoscape from 'cytoscape';

import { checkIDs, ID } from '../../_check_ids';
import { _EShortestPathMethod, _EShortestPathResult } from './_enum';
import { _cytoscapeGetElements, _cytoscapeWeightFn, _getUniquePosis } from './_shared';


interface TClosestPathResult {
    source_posis?: TId[];
    distances?: number[];
    edges?: TId[];
    posis?: TId[];
    edges_count?: number[];
    posis_count?: number[];
    edge_paths?: TId[][];
    posi_paths?: TId[][];
}
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
export function ClosestPath(
    __model__: GIModel,
    source: TId | TId[] | TId[][][],
    target: TId | TId[] | TId[][],
    entities: TId | TId[] | TId[][],
    method: _EShortestPathMethod,
    result: _EShortestPathResult
): TClosestPathResult {
    source = source === null ? [] : (arrMakeFlat(source) as TId[]);
    target = target === null ? [] : (arrMakeFlat(target) as TId[]);
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.ClosestPath";
    let source_ents_arrs: TEntTypeIdx[];
    let target_ents_arrs: TEntTypeIdx[];
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        source_ents_arrs = checkIDs(__model__, fn_name, "origins", source, [ID.isID, ID.isIDL1], null) as TEntTypeIdx[];
        target_ents_arrs = checkIDs(__model__, fn_name, "destinations", target, [ID.isID, ID.isIDL1], null) as TEntTypeIdx[];
        ents_arrs = checkIDs(__model__, fn_name, "entities", entities, [ID.isID, ID.isIDL1], null) as TEntTypeIdx[];
    } else {
        // source_ents_arrs = splitIDs(fn_name, 'origins', source,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // target_ents_arrs = splitIDs(fn_name, 'destinations', target,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // ents_arrs = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = idsBreak(source) as TEntTypeIdx[];
        target_ents_arrs = idsBreak(target) as TEntTypeIdx[];
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const directed: boolean = method === _EShortestPathMethod.DIRECTED ? true : false;
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
    const source_posis_i: number[] = _getUniquePosis(__model__, source.length === 0 ? ents_arrs : source_ents_arrs);
    const target_posis_i: number[] = _getUniquePosis(__model__, target.length === 0 ? ents_arrs : target_ents_arrs);
    const cy_elems: any[] = _cytoscapeGetElements(__model__, ents_arrs, source_posis_i, target_posis_i, directed);
    // create the cytoscape object
    const cy = cytoscape({
        elements: cy_elems,
        headless: true,
    });
    const map_edges_i: Map<number, number> = new Map();
    const map_posis_i: Map<number, number> = new Map();
    const posi_paths: number[][] = [];
    const edge_paths: number[][] = [];
    const path_dists: number[] = [];
    for (const source_posi_i of source_posis_i) {
        const cy_source_elem = cy.getElementById(source_posi_i.toString());
        const dijkstra = cy.elements().dijkstra({
            root: cy_source_elem,
            weight: _cytoscapeWeightFn,
            directed: directed,
        });
        let closest_target_posi_i: number = null;
        let closest_dist = Infinity;
        for (const target_posi_i of target_posis_i) {
            // find shortest path
            const dist: number = dijkstra.distanceTo(cy.getElementById(target_posi_i.toString()));
            if (dist < closest_dist) {
                closest_dist = dist;
                closest_target_posi_i = target_posi_i;
            }
        }
        if (closest_target_posi_i !== null) {
            // get shortest path
            const cy_path: cytoscape.CollectionReturnValue = dijkstra.pathTo(cy.getElementById(closest_target_posi_i.toString()));
            // get the data
            const posi_path: number[] = [];
            const edge_path: number[] = [];
            for (const cy_path_elem of cy_path.toArray()) {
                if (cy_path_elem.isEdge()) {
                    const edge_i: number = cy_path_elem.data("idx");
                    if (return_counts) {
                        if (!map_edges_i.has(edge_i)) {
                            map_edges_i.set(edge_i, 1);
                        } else {
                            map_edges_i.set(edge_i, map_edges_i.get(edge_i) + 1);
                        }
                        if (!directed) {
                            const edge2_i: number = cy_path_elem.data("idx2");
                            if (edge2_i !== null) {
                                if (!map_edges_i.has(edge2_i)) {
                                    map_edges_i.set(edge2_i, 1);
                                } else {
                                    map_edges_i.set(edge2_i, map_edges_i.get(edge2_i) + 1);
                                }
                            }
                        }
                    }
                    if (return_paths) {
                        edge_path.push(edge_i);
                    }
                } else {
                    const posi_i: number = cy_path_elem.data("idx");
                    if (return_counts) {
                        if (!map_posis_i.has(posi_i)) {
                            map_posis_i.set(posi_i, 1);
                        } else {
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
        } else {
            if (return_paths) {
                edge_paths.push([]);
                posi_paths.push([]);
            }
            if (return_dists) {
                path_dists.push(1e8); // TODO, cannot pas Infinity due to JSON issues
            }
        }
    }
    const dict: TClosestPathResult = {};
    if (return_dists) {
        dict.source_posis = idsMakeFromIdxs(EEntType.POSI, source_posis_i) as TId[];
        dict.distances = path_dists;
    }
    if (return_counts) {
        dict.edges = idsMakeFromIdxs(EEntType.EDGE, Array.from(map_edges_i.keys())) as TId[];
        dict.edges_count = Array.from(map_edges_i.values());
        dict.posis = idsMakeFromIdxs(EEntType.POSI, Array.from(map_posis_i.keys())) as TId[];
        dict.posis_count = Array.from(map_posis_i.values());
    }
    if (return_paths) {
        dict.edge_paths = idsMakeFromIdxs(EEntType.EDGE, edge_paths) as TId[][];
        dict.posi_paths = idsMakeFromIdxs(EEntType.POSI, posi_paths) as TId[][];
    }
    return dict;
}
