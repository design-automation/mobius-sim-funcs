import { Sim } from './mobius_sim';
import { ModelApi } from './model_api';

// functions used by mobius
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
// deprecated functions
import { deprecated } from './deprecated';

// =================================================================================================
// Export
// =================================================================================================
export const LONGLAT = [1,103]; //TODO remove this
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
    __model__: Sim;
    debug: boolean;
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
    // =============================================================================================
    // Constructor
    // =============================================================================================
    constructor(model?: Sim) {
        if (model) {
            this.__model__ = model;
        } else {
            this.__model__ = new Sim();
        }
        this.debug  = true;
        // model api
        // this.model = new ModelApi(this.__model__);
        // functions
        this.analyze = new AnalyzeFunc(this.__model__, this.debug);
        this.attrib = new AttribFunc(this.__model__, this.debug);
        this.calc = new CalcFunc(this.__model__, this.debug);
        this.collection = new CollectionFunc(this.__model__, this.debug);
        this.dict = new DictFunc(this.debug);
        this.edit = new EditFunc(this.__model__, this.debug);
        this.intersect = new IntersectFunc(this.__model__, this.debug);
        this.io = new IoFunc(this.__model__, this.debug);
        this.list = new ListFunc(this.debug);
        this.make = new MakeFunc(this.__model__, this.debug);
        this.material = new MaterialFunc(this.__model__, this.debug);
        this.modify = new ModifyFunc(this.__model__, this.debug);
        this.pattern = new PatternFunc(this.__model__, this.debug);
        this.poly2d = new Poly2dFunc(this.__model__, this.debug);
        this.query = new QueryFunc(this.__model__, this.debug);
        this.util = new UtilFunc(this.__model__, this.debug);
        this.visualize = new VisualizeFunc(this.__model__, this.debug);
    }
    // =============================================================================================
    // Model
    // =============================================================================================
    /**
     * Get the model object.
     * @returns 
     */
    getModel(): Sim {
        return this.__model__;
    }
    /**
     * Replace the model with a new model.
     * @param model 
     */
    setModel(model: Sim): void {
        this.__model__ = model;
        // model api
        // this.model.__model__ = model; TODO change model API to SIM
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
    }
    /**
     * Get debug.
     * @returns 
     */
     getDebug(): boolean {
        return this.debug;
    }
    /**
     * Set debug.
     * @param debug 
     */
    setDebug(debug: boolean): void {
        this.debug = debug;
        // functions
        this.analyze.debug = debug;
        this.attrib.debug = debug;
        this.calc.debug = debug;
        this.collection.debug = debug;
        this.edit.debug = debug;
        this.intersect.debug = debug;
        this.io.debug = debug;
        this.make.debug = debug;
        this.material.debug = debug;
        this.modify.debug = debug;
        this.pattern.debug = debug;
        this.poly2d.debug = debug;
        this.query.debug = debug;
        this.util.debug = debug;
        this.visualize.debug = debug;
    }
}
