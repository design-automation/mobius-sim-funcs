import { GIMetaData, GIModel } from '@design-automation/mobius-sim';
import { AnalyzeFunc } from './functions/analyze';
import { AttribFunc } from './functions/attrib';
import { CalcFunc } from './functions/calc';
import { CollectionFunc } from './functions/collection';
import { DictFunc } from './functions/dict';
import { EditFunc } from './functions/edit';
import { IntersectFunc } from './functions/intersect';
import { IoFunc } from './functions/io';
import { ListFunc } from './functions/list';
import { MakeFunc } from './functions/make';
import { MaterialFunc } from './functions/material';
import { ModifyFunc } from './functions/modify';
import { PatternFunc } from './functions/pattern';
import { Poly2dFunc } from './functions/poly2d';
import { QueryFunc } from './functions/query';
import { UtilFunc } from './functions/util';
import { VisualizeFunc } from './functions/visualize';
declare class _output {
    __model__: GIModel;
    constructor(model: GIModel);
    Return(value: any): any;
}
declare class _model {
    constructor();
    __new__(): GIModel;
    __merge__(model1: any, model2: any): void;
    __clone__(model: any): GIModel;
}
export declare class MobiusFunc {
    __model__: GIModel;
    analyze: AnalyzeFunc;
    attrib: AttribFunc;
    calc: CalcFunc;
    collection: CollectionFunc;
    dict: DictFunc;
    edit: EditFunc;
    intersect: IntersectFunc;
    io: IoFunc;
    list: ListFunc;
    make: MakeFunc;
    material: MaterialFunc;
    modify: ModifyFunc;
    pattern: PatternFunc;
    poly2d: Poly2dFunc;
    query: QueryFunc;
    util: UtilFunc;
    visualize: VisualizeFunc;
    _output: _output;
    _model: _model;
    constructor(model?: GIModel, metadata?: GIMetaData);
    _getModel(): GIModel;
    _setModel(model: GIModel): void;
}
export {};
