import { arrMakeFlat, EEntType, GIModel, idsBreak, idsMakeFromIdxs, TEntTypeIdx, TId } from '@design-automation/mobius-sim';
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
 * Centralities are calculated based on distances between positions.
 * The distance between two positions is the shortest path between those positions.
 * The shortest path is the path where the sum of the weights of the edges along the path is the minimum.
 * \n
 * Default weight is 1 for all edges. Weights can be specified using an attribute called 'weight' on edges.
 * \n
 * Closeness centrality is calculated by inverting the sum of the distances to all other positions.
 * \n
 * Harmonic centrality is calculated by summing up the inverted distances to all other positions.
 * \n
 * Betweenness centrality is calculated in two steps.
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
 * @param cen_type Enum, the type of centrality (betweenness, closeness or harmonic).
 * @returns A dictionary containing the results (posis and centrality values, between 0 and 1.)
 */
export function Centrality(
    __model__: GIModel,
    source: TId | TId[] | TId[][][],
    entities: TId | TId[] | TId[][],
    method: _ECentralityMethod,
    cen_type: _ECentralityType
): any {
    // source posis and network entities
    if (source === null) {
        source = [];
    } else {
        source = arrMakeFlat(source) as TId[];
    }
    entities = arrMakeFlat(entities) as TId[];
    // --- Error Check ---
    const fn_name = "analyze.Centrality";
    let source_ents_arrs: TEntTypeIdx[] = [];
    let ents_arrs: TEntTypeIdx[];
    if (__model__.debug) {
        if (source.length > 0) {
            source_ents_arrs = checkIDs(__model__, fn_name, "source", source, [ID.isID, ID.isIDL1], null) as TEntTypeIdx[];
        }
        ents_arrs = checkIDs(__model__, fn_name, "entities", entities, [ID.isID, ID.isIDL1], null) as TEntTypeIdx[];
    } else {
        // if (source.length > 0) {
        //     source_ents_arrs = splitIDs(fn_name, 'source', source,
        //         [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // }
        // ents_arrs = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = idsBreak(source) as TEntTypeIdx[];
        ents_arrs = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
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
    // calculate the centrality
    const posis_i: number[] = source_ents_arrs.length === 0 ? graph_posis_i : source_posis_i;
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
function _centralityCloseness(posis_i: number[], cy_network: cytoscape.Core, directed: boolean) {
    const results: number[] = [];
    const result_posis_i: number[] = [];
    const comps: number[][] = [];
    const cy_colls: cytoscape.Collection[] = cy_network.elements().components();
    cy_colls.sort((a, b) => b.length - a.length);
    for (const cy_coll of cy_colls) {
        const comp: number[] = [];
        const cy_centrality: any = cy_coll.closenessCentralityNormalized({
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

function _centralityHarmonic(posis_i: number[], cy_network: cytoscape.Core, directed: boolean) {
    const results: number[] = [];
    const cy_centrality: any = cy_network.elements().closenessCentralityNormalized({
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
function _centralityBetweenness(posis_i: number[], cy_network: cytoscape.Core, directed: boolean) {
    const results: number[] = [];
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
