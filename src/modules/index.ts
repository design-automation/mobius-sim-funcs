// functions used by mobius
import { GIMetaData, GIModel } from '@design-automation/mobius-sim';

import * as _Model from './_model';
import * as _Output from './_output';
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

class _output {
    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Return(value) {
        return _Output.Return(this.__model__, value);
    }
}

class _model {
    constructor() {}
    __new__() {
        return _Model.__new__();
    }
    __merge__(model1, model2) {
        return _Model.__merge__(model1, model2);
    }
    __clone__(model) {
        return _Model.__clone__(model);
    }
}

export class MobiusFunc {
    __model__: GIModel

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

    constructor(model?: GIModel, metadata?: GIMetaData) {
        if (model) {
            this.__model__ = model;
        } else {
            this.__model__ = new GIModel(metadata);
        }
        this.analyze = new AnalyzeFunc(this.__model__);
        this.attrib = new AttribFunc(this.__model__);
        this.calc = new CalcFunc(this.__model__);
        this.collection = new CollectionFunc(this.__model__);
        this.dict = new DictFunc();
        this.edit = new EditFunc(this.__model__);
        this.intersect = new IntersectFunc(this.__model__);
        this.io = new IoFunc(this.__model__);
        this.list = new ListFunc();
        this.make = new MakeFunc(this.__model__);
        this.material = new MaterialFunc(this.__model__);
        this.modify = new ModifyFunc(this.__model__);
        this.pattern = new PatternFunc(this.__model__);
        this.poly2d = new Poly2dFunc(this.__model__);
        this.query = new QueryFunc(this.__model__);
        this.util = new UtilFunc(this.__model__);
        this.visualize = new VisualizeFunc(this.__model__);
        this._output = new _output(this.__model__);
        this._model = new _model();

    }

    _getModel() {
        return this.__model__
    }

    _setModel(model: GIModel) {
        this.__model__ = model
        this.analyze.__model__ = model;
        this.attrib.__model__ = model;
        this.calc.__model__ = model;
        this.collection.__model__ = model;
        this.edit.__model__ = model;
        this.intersect.__model__ = model;
        this.io.__model__ = model;
        this.make.__model__ = model;
        this.material.__model__ = model;
        this.modify.__model__ = model;
        this.pattern.__model__ = model;
        this.poly2d.__model__ = model;
        this.query.__model__ = model;
        this.util.__model__ = model;
        this.visualize.__model__ = model;
        this._output.__model__ = model;
    }
}
