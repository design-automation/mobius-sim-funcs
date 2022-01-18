"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Centrality = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const cytoscape_1 = __importDefault(require("cytoscape"));
const _check_ids_1 = require("../../../_check_ids");
const _enum_1 = require("./_enum");
const _shared_1 = require("./_shared");
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
function Centrality(__model__, source, entities, method, cen_type) {
    // source posis and network entities
    if (source === null) {
        source = [];
    }
    else {
        source = (0, mobius_sim_1.arrMakeFlat)(source);
    }
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    // --- Error Check ---
    const fn_name = "analyze.Centrality";
    let source_ents_arrs = [];
    let ents_arrs;
    if (__model__.debug) {
        if (source.length > 0) {
            source_ents_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, "source", source, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
        }
        ents_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, "entities", entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
    }
    else {
        // if (source.length > 0) {
        //     source_ents_arrs = splitIDs(fn_name, 'source', source,
        //         [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        // }
        // ents_arrs = splitIDs(fn_name, 'entities', entities,
        //     [IDcheckObj.isID, IDcheckObj.isIDList], null) as TEntTypeIdx[];
        source_ents_arrs = (0, mobius_sim_1.idsBreak)(source);
        ents_arrs = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    const directed = method === _enum_1._ECentralityMethod.DIRECTED ? true : false;
    const source_posis_i = (0, _shared_1._getUniquePosis)(__model__, source_ents_arrs);
    // TODO deal with source === null
    const [elements, graph_posis_i] = (0, _shared_1._cyGetPosisAndElements)(__model__, ents_arrs, source_posis_i, directed);
    // create the cytoscape object
    const cy_network = (0, cytoscape_1.default)({
        elements: elements,
        headless: true,
    });
    // calculate the centrality
    const posis_i = source_ents_arrs.length === 0 ? graph_posis_i : source_posis_i;
    switch (cen_type) {
        case _enum_1._ECentralityType.CLOSENESS:
            return _centralityCloseness(posis_i, cy_network, directed);
        case _enum_1._ECentralityType.HARMONIC:
            return _centralityHarmonic(posis_i, cy_network, directed);
        case _enum_1._ECentralityType.BETWEENNESS:
            return _centralityBetweenness(posis_i, cy_network, directed);
        default:
            throw new Error("Centrality type not recognised.");
    }
}
exports.Centrality = Centrality;
function _centralityCloseness(posis_i, cy_network, directed) {
    const results = [];
    const result_posis_i = [];
    const comps = [];
    const cy_colls = cy_network.elements().components();
    cy_colls.sort((a, b) => b.length - a.length);
    for (const cy_coll of cy_colls) {
        const comp = [];
        const cy_centrality = cy_coll.closenessCentralityNormalized({
            weight: _shared_1._cytoscapeWeightFn,
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
        posis: (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, result_posis_i),
        centrality: results,
    };
}
function _centralityHarmonic(posis_i, cy_network, directed) {
    const results = [];
    const cy_centrality = cy_network.elements().closenessCentralityNormalized({
        weight: _shared_1._cytoscapeWeightFn,
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
        posis: (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, posis_i),
        centrality: results,
    };
}
function _centralityBetweenness(posis_i, cy_network, directed) {
    const results = [];
    const cy_centrality = cy_network.elements().betweennessCentrality({
        weight: _shared_1._cytoscapeWeightFn,
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
        posis: (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, posis_i),
        centrality: results,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2VudHJhbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hbmFseXplL0NlbnRyYWxpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOERBQTRIO0FBQzVILDBEQUFrQztBQUVsQyxvREFBbUQ7QUFDbkQsbUNBQStEO0FBQy9ELHVDQUF3RjtBQUV4RixtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyQ0c7QUFDSCxTQUFnQixVQUFVLENBQ3RCLFNBQWtCLEVBQ2xCLE1BQStCLEVBQy9CLFFBQStCLEVBQy9CLE1BQTBCLEVBQzFCLFFBQTBCO0lBRTFCLG9DQUFvQztJQUNwQyxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7UUFDakIsTUFBTSxHQUFHLEVBQUUsQ0FBQztLQUNmO1NBQU07UUFDSCxNQUFNLEdBQUcsSUFBQSx3QkFBVyxFQUFDLE1BQU0sQ0FBVSxDQUFDO0tBQ3pDO0lBQ0QsUUFBUSxHQUFHLElBQUEsd0JBQVcsRUFBQyxRQUFRLENBQVUsQ0FBQztJQUMxQyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsb0JBQW9CLENBQUM7SUFDckMsSUFBSSxnQkFBZ0IsR0FBa0IsRUFBRSxDQUFDO0lBQ3pDLElBQUksU0FBd0IsQ0FBQztJQUM3QixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNuQixnQkFBZ0IsR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsZUFBRSxDQUFDLElBQUksRUFBRSxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFrQixDQUFDO1NBQ2xIO1FBQ0QsU0FBUyxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUs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