/**
 * The `analysis` module has functions for performing various types of analysis with entities in
 * the model. These functions all return dictionaries containing the results of the analysis.
 * @module
 */
import { GIModel, TEntTypeIdx, TPlane, TRay, Txy, Txyz } from '@design-automation/mobius-sim';
import cytoscape from 'cytoscape';
import * as THREE from 'three';
export declare function _skyRayDirsTjs(detail: number): THREE.Vector3[];
export declare function _rayOrisDirsTjs(__model__: GIModel, origins: Txyz[] | TRay[] | TPlane[], offset: number): [THREE.Vector3, THREE.Vector3][];
export declare function _solarRaysDirectTjs(latitude: number, north: Txy, detail: number): THREE.Vector3[][];
export declare function _solarRaysIndirectTjs(latitude: number, north: Txy, detail: number): THREE.Vector3[];
export declare function _calcExposure(origins_normals_tjs: [THREE.Vector3, THREE.Vector3][], directions_tjs: THREE.Vector3[], mesh_tjs: THREE.Mesh, limits: [number, number], weighted: boolean): number[];
export declare function _getUniquePosis(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[];
export declare function _cytoscapeWeightFn(edge: cytoscape.EdgeSingular): any;
export declare function _cytoscapeGetElements(__model__: GIModel, ents_arr: TEntTypeIdx[], source_posis_i: number[], target_posis_i: number[], directed: boolean): any[];
export declare function _cyGetPosisAndElements(__model__: GIModel, ents_arr: TEntTypeIdx[], posis_i: number[], directed: boolean): [cytoscape.ElementDefinition[], number[]];
