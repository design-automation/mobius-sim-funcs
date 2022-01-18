import { arrMakeFlat, EEntType, idsBreak, idsMakeFromIdxs } from '@design-automation/mobius-sim';
import cytoscape from 'cytoscape';
import { checkIDs, ID } from '../../../_check_ids';
import { _ECentralityMethod, _ECentralityType } from './_enum';
import { _cyGetPosisAndElements, _cytoscapeWeightFn, _getUniquePosis } from './_shared';
// ================================================================================================
/**
 * Calculates betweenness, closeness, and harmonic centrality
 * for positions in a network. Values are normalized in the range 0 to 1.
 * \n
 * The network is defined by a set of connected edges, consisting of polylines and/or polygons.
 * For edges to be connected, vertices must be welded.
 * For example, if the network consists of multiple polylines, then the vertcies of those polylines must be welded.
 * \n
 * Centralities are calculate based on distances between positions.
 * The distance between two positions is the shortest path between those positions.
 * The shortest path is the path where the sum of the weights of the edges along the path is the minimum.
 * \n
 * Default weight is 1 for all edges. Weights can be specified using an attribute called 'weight' on edges.
 * \n
 * Closeness centrality is calculated by inverting the sum of the distances to all other positions.
 * \n
 * Harmonic centrality is calculated by summing up the inverted distances to all other positions.
 * \n
 * Betweenness centrality os calculated in two steps.
 * First, the shortest path between every pair of nodes is calculated.
 * Second, the betweenness centrality of each node is then the total number of times the node is traversed
 * by the shortest paths.
 * \n
 * For closeness centrality, the network is first split up into connected sub-networks.
 * This is because closeness centrality cannot be calculated on networks that are not fully connected.
 * The closeness centrality is then calculated for each sub-network seperately.
 * \n
 * For harmonic centrality, care must be taken when defining custom weights.
 * Weight with zero values or very small values will result in errors or will distort the results.
 * This is due to the inversion operation: 1 / weight.
 * \n
 * Returns a dictionary containing the results.
 * \n
 * 1. 'posis': a list of position IDs.
 * 2. 'centrality': a list of numbers, the values for centrality, either betweenness, closeness, or harmonic.
 * \n
 * @param __model__
 * @param source A list of positions, or entities from which positions can be extracted.
 * These positions should be part of the network.
 * @param entities The network, edges, or entities from which edges can be extracted.
 * @param method Enum, the method to use, directed or undirected.
 * @param cen_type Enum, the data to return, positions, edges, or both.
 * @returns A list of centrality values, between 0 and 1.
 */
export function Centrality(__model__, source, entities, method, cen_type) {
    // source posis and network entities
    if (source === null) {
        source = [];
    }
    else {
        source = arrMakeFlat(source);
    }
    entities = arrMakeFlat(entities);
    // --- Error Check ---
    const fn_name = "analyze.Centrality";
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
    // calculate the centrality
    const posis_i = source_ents_arrs.length === 0 ? graph_posis_i : source_posis_i;
    switch (cen_type) {
        case _ECentralityType.CLOSENESS:
            return _centralityCloseness(posis_i, cy_network, directed);
        case _ECentralityType.HARMONIC:
            return _centralityHarmonic(posis_i, cy_network, directed);
        case _ECentralityType.BETWEENNESS:
            return _centralityBetweenness(posis_i, cy_network, directed);
        default:
            throw new Error("Centrality type not recognised.");
    }
}
function _centralityCloseness(posis_i, cy_network, directed) {
    const results = [];
    const result_posis_i = [];
    const comps = [];
    const cy_colls = cy_network.elements().components();
    cy_colls.sort((a, b) => b.length - a.length);
    for (const cy_coll of cy_colls) {
        const comp = [];
        const cy_centrality = cy_coll.closenessCentralityNormalized({
            weight: _cytoscapeWeightFn,
            harmonic: false,
            directed: directed,
        });
        for (const posi_i of posis_i) {
            const source_elem = cy_coll.getElementById(posi_i.toString());
            if (source_elem.length === 0) {
                continue;
            }
            const result = cy_centrality.closeness(source_elem);
            if (isNaN(result)) {
                throw new Error("Error calculating closeness centrality.");
            }
            result_posis_i.push(posi_i);
            comp.push(posi_i);
            results.push(result);
        }
        comps.push(comp);
    }
    return {
        posis: idsMakeFromIdxs(EEntType.POSI, result_posis_i),
        centrality: results,
    };
}
function _centralityHarmonic(posis_i, cy_network, directed) {
    const results = [];
    const cy_centrality = cy_network.elements().closenessCentralityNormalized({
        weight: _cytoscapeWeightFn,
        harmonic: true,
        directed: directed,
    });
    for (const posi_i of posis_i) {
        const source_elem = cy_network.getElementById(posi_i.toString());
        if (source_elem.length === 0) {
            continue;
        }
        const result = cy_centrality.closeness(source_elem);
        if (isNaN(result)) {
            throw new Error("Error calculating harmonic centrality.");
        }
        results.push(result);
    }
    return {
        posis: idsMakeFromIdxs(EEntType.POSI, posis_i),
        centrality: results,
    };
}
function _centralityBetweenness(posis_i, cy_network, directed) {
    const results = [];
    const cy_centrality = cy_network.elements().betweennessCentrality({
        weight: _cytoscapeWeightFn,
        directed: directed,
    });
    for (const posi_i of posis_i) {
        const source_elem = cy_network.getElementById(posi_i.toString());
        const result = cy_centrality.betweennessNormalized(source_elem);
        if (isNaN(result)) {
            throw new Error("Error calculating betweenness centrality.");
        }
        results.push(result);
    }
    return {
        posis: idsMakeFromIdxs(EEntType.POSI, posis_i),
        centrality: results,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2VudHJhbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hbmFseXplL0NlbnRyYWxpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQVcsUUFBUSxFQUFFLGVBQWUsRUFBb0IsTUFBTSwrQkFBK0IsQ0FBQztBQUM1SCxPQUFPLFNBQVMsTUFBTSxXQUFXLENBQUM7QUFFbEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDL0QsT0FBTyxFQUFFLHNCQUFzQixFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUV4RixtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyQ0c7QUFDSCxNQUFNLFVBQVUsVUFBVSxDQUN0QixTQUFrQixFQUNsQixNQUErQixFQUMvQixRQUErQixFQUMvQixNQUEwQixFQUMxQixRQUEwQjtJQUUxQixvQ0FBb0M7SUFDcEMsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO1FBQ2pCLE1BQU0sR0FBRyxFQUFFLENBQUM7S0FDZjtTQUFNO1FBQ0gsTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQVUsQ0FBQztLQUN6QztJQUNELFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLG9CQUFvQixDQUFDO0lBQ3JDLElBQUksZ0JBQWdCLEdBQWtCLEVBQUUsQ0FBQztJQUN6QyxJQUFJLFNBQXdCLENBQUM7SUFDN0IsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDbkIsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBa0IsQ0FBQztTQUNsSDtRQUNELFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFrQixDQUFDO0tBQy9HO1NBQU07UUFDSCwyQkFBMkI7UUFDM0IsNkRBQTZEO1FBQzdELDBFQUEwRTtRQUMxRSxJQUFJO1FBQ0osc0RBQXNEO1FBQ3RELHNFQUFzRTtRQUN0RSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFrQixDQUFDO1FBQ3JELFNBQVMsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFrQixDQUFDO0tBQ25EO0lBQ0Qsc0JBQXNCO0lBQ3RCLE1BQU0sUUFBUSxHQUFZLE1BQU0sS0FBSyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ2hGLE1BQU0sY0FBYyxHQUFhLGVBQWUsQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUU5RSxpQ0FBaUM7SUFFakMsTUFBTSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsR0FBOEMsc0JBQXNCLENBQy9GLFNBQVMsRUFDVCxTQUFTLEVBQ1QsY0FBYyxFQUNkLFFBQVEsQ0FDWCxDQUFDO0lBQ0YsOEJBQThCO0lBQzlCLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUN6QixRQUFRLEVBQUUsUUFBUTtRQUNsQixRQUFRLEVBQUUsSUFBSTtLQUNqQixDQUFDLENBQUM7SUFDSCwyQkFBMkI7SUFDM0IsTUFBTSxPQUFPLEdBQWEsZ0JBQWdCLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUM7SUFDekYsUUFBUSxRQUFRLEVBQUU7UUFDZCxLQUFLLGdCQUFnQixDQUFDLFNBQVM7WUFDM0IsT0FBTyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9ELEtBQUssZ0JBQWdCLENBQUMsUUFBUTtZQUMxQixPQUFPLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDOUQsS0FBSyxnQkFBZ0IsQ0FBQyxXQUFXO1lBQzdCLE9BQU8sc0JBQXNCLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNqRTtZQUNJLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztLQUMxRDtBQUNMLENBQUM7QUFDRCxTQUFTLG9CQUFvQixDQUFDLE9BQWlCLEVBQUUsVUFBMEIsRUFBRSxRQUFpQjtJQUMxRixNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7SUFDN0IsTUFBTSxjQUFjLEdBQWEsRUFBRSxDQUFDO0lBQ3BDLE1BQU0sS0FBSyxHQUFlLEVBQUUsQ0FBQztJQUM3QixNQUFNLFFBQVEsR0FBMkIsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzVFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QyxLQUFLLE1BQU0sT0FBTyxJQUFJLFFBQVEsRUFBRTtRQUM1QixNQUFNLElBQUksR0FBYSxFQUFFLENBQUM7UUFDMUIsTUFBTSxhQUFhLEdBQVEsT0FBTyxDQUFDLDZCQUE2QixDQUFDO1lBQzdELE1BQU0sRUFBRSxrQkFBa0I7WUFDMUIsUUFBUSxFQUFFLEtBQUs7WUFDZixRQUFRLEVBQUUsUUFBUTtTQUNyQixDQUFDLENBQUM7UUFDSCxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtZQUMxQixNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQzlELElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQzFCLFNBQVM7YUFDWjtZQUNELE1BQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDcEQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO2FBQzlEO1lBQ0QsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDeEI7UUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3BCO0lBQ0QsT0FBTztRQUNILEtBQUssRUFBRSxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUM7UUFDckQsVUFBVSxFQUFFLE9BQU87S0FDdEIsQ0FBQztBQUNOLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLE9BQWlCLEVBQUUsVUFBMEIsRUFBRSxRQUFpQjtJQUN6RixNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7SUFDN0IsTUFBTSxhQUFhLEdBQVEsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLDZCQUE2QixDQUFDO1FBQzNFLE1BQU0sRUFBRSxrQkFBa0I7UUFDMUIsUUFBUSxFQUFFLElBQUk7UUFDZCxRQUFRLEVBQUUsUUFBUTtLQUNyQixDQUFDLENBQUM7SUFDSCxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtRQUMxQixNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ2pFLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDMUIsU0FBUztTQUNaO1FBQ0QsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNwRCxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztTQUM3RDtRQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDeEI7SUFDRCxPQUFPO1FBQ0gsS0FBSyxFQUFFLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztRQUM5QyxVQUFVLEVBQUUsT0FBTztLQUN0QixDQUFDO0FBQ04sQ0FBQztBQUNELFNBQVMsc0JBQXNCLENBQUMsT0FBaUIsRUFBRSxVQUEwQixFQUFFLFFBQWlCO0lBQzVGLE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztJQUM3QixNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMscUJBQXFCLENBQUM7UUFDOUQsTUFBTSxFQUFFLGtCQUFrQjtRQUMxQixRQUFRLEVBQUUsUUFBUTtLQUNyQixDQUFDLENBQUM7SUFDSCxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtRQUMxQixNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNoRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQztTQUNoRTtRQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDeEI7SUFDRCxPQUFPO1FBQ0gsS0FBSyxFQUFFLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztRQUM5QyxVQUFVLEVBQUUsT0FBTztLQUN0QixDQUFDO0FBQ04sQ0FBQyJ9