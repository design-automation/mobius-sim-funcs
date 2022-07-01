import { GIModel as Model, GIMetaData as MetaData, EEntType, EEntTypeStr } from '@design-automation/mobius-sim';
import { ModelApi } from './model_api';
// functions used by mobius
import { AnalyzeFunc } from './modules/functions/analyze';
import { AttribFunc } from './modules/functions/attrib';
import { CalcFunc } from './modules/functions/calc';
import { CollectionFunc } from './modules/functions/collection';
import { DictFunc } from './modules/functions/dict';
import { EditFunc } from './modules/functions/edit';
import { IntersectFunc } from './modules/functions/intersect';
import { IoFunc } from './modules/functions/io';
import { ListFunc } from './modules/functions/list';
import { MakeFunc } from './modules/functions/make';
import { MaterialFunc } from './modules/functions/material';
import { ModifyFunc } from './modules/functions/modify';
import { PatternFunc } from './modules/functions/pattern';
import { Poly2dFunc } from './modules/functions/poly2d';
import { QueryFunc } from './modules/functions/query';
import { UtilFunc } from './modules/functions/util';
import { VisualizeFunc } from './modules/functions/visualize';
// inline functions
import { InlineFuncs } from '@design-automation/mobius-inline-funcs' 
// deprecated functions
import { deprecated } from './modules/deprecated';

// =================================================================================================
// Export
// =================================================================================================
export { Model, EEntType, EEntTypeStr };
export const LONGLAT = [1,103]; //TODO
export const FUNCS_EXPRESSIONS = {
    setattrib: 'attrib.Set',      // pgon@test = 1
    getattrib: 'attrib.Get',      // x = pgon@test
    queryGet: 'query.Get',        // pg#ps
    queryFilter: 'query.Filter',  //pg#ps ?@xyz[2] > 3
}
export const FUNCS_ASYNC = [
    'util.ModelCompare',
    'util.ModelMerge',
    'io.Write', 'io.Read',
    'io.Import', 'io.Export',
    'util.HTTPRequest'
];
export const FUNCS_DEPRECATED = deprecated;
// =================================================================================================
// SIMFuncs class
// =================================================================================================
export class SIMFuncs {
    __model__: Model
    // model api
    model: ModelApi;
    // functions
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
    // inline funcs
    inl: InlineFuncs;
    // =============================================================================================
    // Constructor
    // =============================================================================================
    constructor(model?: Model) {
        if (model) {
            this.__model__ = model;
        } else {
            this.__model__ = new Model();
        }
        // model api
        this.model = new ModelApi(this.__model__);
        // functions
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
        // inl
        this.inl = new InlineFuncs(this.__model__.debug);
    }
    // =============================================================================================
    // Model
    // =============================================================================================
    /**
     * Get the model object.
     * @returns 
     */
    getModel() {
        return this.__model__;
    }
    /**
     * Replace the model with a new model.
     * @param model 
     */
    setModel(model: Model) {
        this.__model__ = model;
        // model api
        this.model.__model__ = model;
        // functions
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
        // inline
        this.inl = new InlineFuncs(this.__model__.debug);
    }
}
