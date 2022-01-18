import { arrMakeFlat, EEntType, idsBreak, idsMakeFromIdxs } from '@design-automation/mobius-sim';
import cytoscape from 'cytoscape';
import { checkIDs, ID } from '../../../_check_ids';
import { _ECentralityMethod } from './_enum';
import { _cyGetPosisAndElements, _cytoscapeWeightFn, _getUniquePosis } from './_shared';
// ================================================================================================
/**
 * Calculates degree centrality for positions in a network. Values are normalized in the range 0 to 1.
 * \n
 * The network is defined by a set of connected edges, consisting of polylines and/or polygons.
 * For edges to be connected, vertices must be welded.
 * For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.
 * \n
 * Degree centrality is based on the idea that the centrality of a position in a network is related to
 * the number of direct links that it has to other positions.
 * \n
 * If 'undirected' is selected,  degree centrality is calculated by summing up the weights
 * of all edges connected to a position.
 * If 'directed' is selected, then two types of centrality are calculated: incoming degree and
 * outgoing degree.
 * Incoming degree is calculated by summing up the weights of all incoming edges connected to a position.
 * Outgoing degree is calculated by summing up the weights of all outgoing edges connected to a position.
 * \n
 * Default weight is 1 for all edges. Weights can be specified using an attribute called 'weight' on edges.
 * \n
 * Returns a dictionary containing the results.
 * \n
 * If 'undirected' is selected, the dictionary will contain  the following:
 * 1. 'posis': a list of position IDs.
 * 2. 'degree': a list of numbers, the values for degree centrality.
 * \n
 * If 'directed' is selected, the dictionary will contain  the following:
 * 1. 'posis': a list of position IDs.
 * 2. 'indegree': a list of numbers, the values for incoming degree centrality.
 * 3. 'outdegree': a list of numbers, the values for outgoing degree centrality.
 * \n
 * @param __model__
 * @param source A list of positions, or entities from which positions can be extracted.
 * These positions should be part of the network.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param alpha The alpha value for the centrality calculation, ranging on [0, 1]. With value 0,
 * disregards edge weights and solely uses number of edges in the centrality calculation. With value 1,
 * disregards number of edges and solely uses the edge weights in the centrality calculation.
 * @param method Enum, the method to use, directed or undirected.
 * @returns A dictionary containing the results.
 */
export function Degree(__model__, source, entities, alpha, method) {
    // source posis and network entities
    if (source === null) {
        source = [];
    }
    else {
        source = arrMakeFlat(source);
    }
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = "analyze.Degree";
    let source_ents_arrs = [];
    let ents_arrs;
    if (__model__.debug) {
        if (source.length > 0) {
            source_ents_arrs = checkIDs(__model__, fn_name, "source", source, [ID.isID, ID.isIDL1], null);
        }
        ents_arrs = checkIDs(__model__, fn_name, "entities", entities, [ID.isID, ID.isIDL1], null);
    }
    else {
        // if (source.length > 0) {
        //     source_ents_arrs = splitIDs(fn_name, 'source', source,
        //         [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // }
        // ents_arrs = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = idsBreak(source);
        ents_arrs = idsBreak(entities);
    }
    // --- Error Check ---
    const directed = method === _ECentralityMethod.DIRECTED ? true : false;
    const source_posis_i = _getUniquePosis(__model__, source_ents_arrs);
    // TODO deal with source === null
    const [elements, graph_posis_i] = _cyGetPosisAndElements(__model__, ents_arrs, source_posis_i, directed);
    // create the cytoscape object
    const cy_network = cytoscape({
        elements: elements,
        headless: true,
    });
    const posis_i = source_ents_arrs.length === 0 ? graph_posis_i : source_posis_i;
    if (directed) {
        return _centralityDegreeDirected(posis_i, cy_network, alpha);
    }
    else {
        return _centralityDegreeUndirected(posis_i, cy_network, alpha);
    }
}
function _centralityDegreeDirected(posis_i, cy_network, alpha) {
    const indegree = [];
    const outdegree = [];
    const cy_centrality = cy_network.elements().degreeCentralityNormalized({
        weight: _cytoscapeWeightFn,
        alpha: alpha,
        directed: true,
    });
    for (const posi_i of posis_i) {
        const source_elem = cy_network.getElementById(posi_i.toString());
        indegree.push(cy_centrality.indegree(source_elem));
        outdegree.push(cy_centrality.outdegree(source_elem));
    }
    return {
        posis: idsMakeFromIdxs(EEntType.POSI, posis_i),
        indegree: indegree,
        outdegree: outdegree,
    };
}
function _centralityDegreeUndirected(posis_i, cy_network, alpha) {
    const degree = [];
    const cy_centrality = cy_network.elements().degreeCentralityNormalized({
        weight: _cytoscapeWeightFn,
        alpha: alpha,
        directed: false,
    });
    for (const posi_i of posis_i) {
        const source_elem = cy_network.getElementById(posi_i.toString());
        degree.push(cy_centrality.degree(source_elem));
    }
    return {
        posis: idsMakeFromIdxs(EEntType.POSI, posis_i),
        degree: degree,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVncmVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2FuYWx5emUvRGVncmVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFXLFFBQVEsRUFBRSxlQUFlLEVBQW9CLE1BQU0sK0JBQStCLENBQUM7QUFDNUgsT0FBTyxTQUFTLE1BQU0sV0FBVyxDQUFDO0FBRWxDLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzdDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFeEYsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Q0c7QUFDSCxNQUFNLFVBQVUsTUFBTSxDQUNsQixTQUFrQixFQUNsQixNQUErQixFQUMvQixRQUErQixFQUMvQixLQUFhLEVBQ2IsTUFBMEI7SUFFMUIsb0NBQW9DO0lBQ3BDLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtRQUNqQixNQUFNLEdBQUcsRUFBRSxDQUFDO0tBQ2Y7U0FBTTtRQUNILE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFVLENBQUM7S0FDekM7SUFDRCxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBVSxDQUFDO0lBQzFDLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQztJQUNqQyxJQUFJLGdCQUFnQixHQUFrQixFQUFFLENBQUM7SUFDekMsSUFBSSxTQUF3QixDQUFDO0lBQzdCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLGdCQUFnQixH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