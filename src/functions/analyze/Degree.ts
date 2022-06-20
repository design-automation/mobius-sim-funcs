import { Sim,ENT_TYPE } from '../../mobius_sim';
import cytoscape from 'cytoscape';

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
 * @param method Enum, the method to use: `'directed'` or `'undirected'`.
 * @returns A dictionary containing the results.
 */
export function Degree(
    __model__: Sim,
    source: string | string[] | string[][][],
    entities: string | string[] | string[][],
    alpha: number,
    method: _ECentralityMethod
): any {
    // source posis and network entities
    if (source === null) {
        source = [];
    } else {
        source = arrMakeFlat(source) as string[];
    }
    entities = arrMakeFlat(entities) as string[];
    // ----
    const directed: boolean = method === _ECentralityMethod.DIRECTED ? true : false;
    const source_posis_i: number[] = _getUniquePosis(__model__, source_ents_arrs);

    // TODO deal with source === null

    const [elements, graph_posis_i]: [cytoscape.ElementDefinition[], number[]] = _cyGetPosisAndElements(
        __model__,
        ents_arrs,
        source_posis_i,
        directed
    );
    // create the cytoscape object
    const cy_network = cytoscape({
        elements: elements,
        headless: true,
    });
    const posis_i: number[] = source_ents_arrs.length === 0 ? graph_posis_i : source_posis_i;
    if (directed) {
        return _centralityDegreeDirected(posis_i, cy_network, alpha);
    } else {
        return _centralityDegreeUndirected(posis_i, cy_network, alpha);
    }
}
function _centralityDegreeDirected(posis_i: number[], cy_network: any, alpha: number): any {
    const indegree: number[] = [];
    const outdegree: number[] = [];
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
        posis: idsMakeFromIdxs(ENT_TYPE.POSI, posis_i),
        indegree: indegree,
        outdegree: outdegree,
    };
}
function _centralityDegreeUndirected(posis_i: number[], cy_network: any, alpha: number) {
    const degree: number[] = [];
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
        posis: idsMakeFromIdxs(ENT_TYPE.POSI, posis_i),
        degree: degree,
    };
}
