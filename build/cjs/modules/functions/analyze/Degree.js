"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Degree = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const cytoscape_1 = __importDefault(require("cytoscape"));
const _check_ids_1 = require("../../../_check_ids");
const _enum_1 = require("./_enum");
const _shared_1 = require("./_shared");
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
function Degree(__model__, source, entities, alpha, method) {
    // source posis and network entities
    if (source === null) {
        source = [];
    }
    else {
        source = (0, mobius_sim_1.arrMakeFlat)(source);
    }
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    // --- Error Check ---
    const fn_name = "analyze.Degree";
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
    const posis_i = source_ents_arrs.length === 0 ? graph_posis_i : source_posis_i;
    if (directed) {
        return _centralityDegreeDirected(posis_i, cy_network, alpha);
    }
    else {
        return _centralityDegreeUndirected(posis_i, cy_network, alpha);
    }
}
exports.Degree = Degree;
function _centralityDegreeDirected(posis_i, cy_network, alpha) {
    const indegree = [];
    const outdegree = [];
    const cy_centrality = cy_network.elements().degreeCentralityNormalized({
        weight: _shared_1._cytoscapeWeightFn,
        alpha: alpha,
        directed: true,
    });
    for (const posi_i of posis_i) {
        const source_elem = cy_network.getElementById(posi_i.toString());
        indegree.push(cy_centrality.indegree(source_elem));
        outdegree.push(cy_centrality.outdegree(source_elem));
    }
    return {
        posis: (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, posis_i),
        indegree: indegree,
        outdegree: outdegree,
    };
}
function _centralityDegreeUndirected(posis_i, cy_network, alpha) {
    const degree = [];
    const cy_centrality = cy_network.elements().degreeCentralityNormalized({
        weight: _shared_1._cytoscapeWeightFn,
        alpha: alpha,
        directed: false,
    });
    for (const posi_i of posis_i) {
        const source_elem = cy_network.getElementById(posi_i.toString());
        degree.push(cy_centrality.degree(source_elem));
    }
    return {
        posis: (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, posis_i),
        degree: degree,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVncmVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2FuYWx5emUvRGVncmVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhEQUE0SDtBQUM1SCwwREFBa0M7QUFFbEMsb0RBQW1EO0FBQ25ELG1DQUE2QztBQUM3Qyx1Q0FBd0Y7QUFFeEYsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Q0c7QUFDSCxTQUFnQixNQUFNLENBQ2xCLFNBQWtCLEVBQ2xCLE1BQStCLEVBQy9CLFFBQStCLEVBQy9CLEtBQWEsRUFDYixNQUEwQjtJQUUxQixvQ0FBb0M7SUFDcEMsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO1FBQ2pCLE1BQU0sR0FBRyxFQUFFLENBQUM7S0FDZjtTQUFNO1FBQ0gsTUFBTSxHQUFHLElBQUEsd0JBQVcsRUFBQyxNQUFNLENBQVUsQ0FBQztLQUN6QztJQUNELFFBQVEsR0FBRyxJQUFBLHdCQUFXLEVBQUMsUUFBUSxDQUFVLENBQUM7SUFDMUMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDO0lBQ2pDLElBQUksZ0JBQWdCLEdBQWtCLEVBQUUsQ0FBQztJQUN6QyxJQUFJLFNBQXdCLENBQUM7SUFDN0IsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDbkIsZ0JBQWdCLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLGVBQUUsQ0FBQyxJQUFJLEVBQUUsZUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBa0IsQ0FBQztTQUNsSDtRQUNELFNBQVMsR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFV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