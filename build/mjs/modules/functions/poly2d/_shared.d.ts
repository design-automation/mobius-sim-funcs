import { GIModel, TEntTypeIdx } from '@design-automation/mobius-sim';
import Shape from '@doodle3d/clipper-js';
export declare const SCALE = 1000000000;
export declare type TPosisMap = Map<number, Map<number, number>>;
export interface IClipCoord {
    X: number;
    Y: number;
}
declare type TClipPath = IClipCoord[];
declare type TClipPaths = TClipPath[];
export interface IClipResult {
    closed: boolean;
    paths: TClipPaths;
}
export interface IClipOffsetOptions {
    jointType: string;
    endType: string;
    miterLimit?: number;
    roundPrecision?: number;
}
export declare const MClipOffsetEndType: Map<string, string>;
export declare function _getPgons(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[];
export declare function _getPgonsPlines(__model__: GIModel, ents_arr: TEntTypeIdx[]): [number[], number[]];
export declare function _getPosis(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[];
export declare function _getPosiFromMap(__model__: GIModel, x: number, y: number, posis_map: TPosisMap): number;
export declare function _convertPgonToShape(__model__: GIModel, pgon_i: number, posis_map: TPosisMap): Shape;
export declare function _convertPgonsToShapeUnion(__model__: GIModel, pgons_i: number[], posis_map: TPosisMap): Shape;
export declare function _convertWireToShape(__model__: GIModel, wire_i: number, is_closed: boolean, posis_map: TPosisMap): Shape;
export declare function _convertPlineToShape(__model__: GIModel, pline_i: number, posis_map: TPosisMap): Shape;
export declare function _convertShapesToPgons(__model__: GIModel, shapes: Shape | Shape[], posis_map: TPosisMap): number[];
export declare function _convertShapeToPlines(__model__: GIModel, shape: Shape, is_closed: boolean, posis_map: TPosisMap): number[];
export declare function _convertShapeToCutPlines(__model__: GIModel, shape: Shape, posis_map: TPosisMap): number[];
export declare function _convexHull(__model__: GIModel, posis_i: number[]): number[];
export declare function _offsetPgon(__model__: GIModel, pgon_i: number, dist: number, options: IClipOffsetOptions, posis_map: TPosisMap): number[];
export declare function _offsetPline(__model__: GIModel, pline_i: number, dist: number, options: IClipOffsetOptions, posis_map: TPosisMap): number[];
export {};
