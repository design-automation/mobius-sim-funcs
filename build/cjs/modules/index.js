"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobiusFunc = void 0;
// functions used by mobius
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _Model = __importStar(require("./_model"));
const _Output = __importStar(require("./_output"));
const analyze_1 = require("./functions/analyze");
const attrib_1 = require("./functions/attrib");
const calc_1 = require("./functions/calc");
const collection_1 = require("./functions/collection");
const dict_1 = require("./functions/dict");
const edit_1 = require("./functions/edit");
const intersect_1 = require("./functions/intersect");
const io_1 = require("./functions/io");
const list_1 = require("./functions/list");
const make_1 = require("./functions/make");
const material_1 = require("./functions/material");
const modify_1 = require("./functions/modify");
const pattern_1 = require("./functions/pattern");
const poly2d_1 = require("./functions/poly2d");
const query_1 = require("./functions/query");
const util_1 = require("./functions/util");
const visualize_1 = require("./functions/visualize");
class _output {
    constructor(model) {
        this.__model__ = model;
    }
    Return(value) {
        return _Output.Return(this.__model__, value);
    }
}
class _model {
    constructor() { }
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
class MobiusFunc {
    constructor(model, metadata) {
        if (model) {
            this.__model__ = model;
        }
        else {
            this.__model__ = new mobius_sim_1.GIModel(metadata);
        }
        this.analyze = new analyze_1.AnalyzeFunc(this.__model__);
        this.attrib = new attrib_1.AttribFunc(this.__model__);
        this.calc = new calc_1.CalcFunc(this.__model__);
        this.collection = new collection_1.CollectionFunc(this.__model__);
        this.dict = new dict_1.DictFunc();
        this.edit = new edit_1.EditFunc(this.__model__);
        this.intersect = new intersect_1.IntersectFunc(this.__model__);
        this.io = new io_1.IoFunc(this.__model__);
        this.list = new list_1.ListFunc();
        this.make = new make_1.MakeFunc(this.__model__);
        this.material = new material_1.MaterialFunc(this.__model__);
        this.modify = new modify_1.ModifyFunc(this.__model__);
        this.pattern = new pattern_1.PatternFunc(this.__model__);
        this.poly2d = new poly2d_1.Poly2dFunc(this.__model__);
        this.query = new query_1.QueryFunc(this.__model__);
        this.util = new util_1.UtilFunc(this.__model__);
        this.visualize = new visualize_1.VisualizeFunc(this.__model__);
        this._output = new _output(this.__model__);
        this._model = new _model();
    }
    _getModel() {
        return this.__model__;
    }
    _setModel(model) {
        this.__model__ = model;
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
exports.MobiusFunc = MobiusFunc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkJBQTJCO0FBQzNCLDhEQUFvRTtBQUVwRSxpREFBbUM7QUFDbkMsbURBQXFDO0FBQ3JDLGlEQUFrRDtBQUNsRCwrQ0FBZ0Q7QUFDaEQsMkNBQTRDO0FBQzVDLHVEQUF3RDtBQUN4RCwyQ0FBNEM7QUFDNUMsMkNBQTRDO0FBQzVDLHFEQUFzRDtBQUN0RCx1Q0FBd0M7QUFDeEMsMkNBQTRDO0FBQzVDLDJDQUE0QztBQUM1QyxtREFBb0Q7QUFDcEQsK0NBQWdEO0FBQ2hELGlEQUFrRDtBQUNsRCwrQ0FBZ0Q7QUFDaEQsNkNBQThDO0FBQzlDLDJDQUE0QztBQUM1QyxxREFBc0Q7QUFFdEQsTUFBTSxPQUFPO0lBRVQsWUFBWSxLQUFjO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxNQUFNLENBQUMsS0FBSztRQUNSLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FDSjtBQUVELE1BQU0sTUFBTTtJQUNSLGdCQUFlLENBQUM7SUFDaEIsT0FBTztRQUNILE9BQU8sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFDRCxTQUFTLENBQUMsTUFBTSxFQUFFLE1BQU07UUFDcEIsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQ0QsU0FBUyxDQUFDLEtBQUs7UUFDWCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQztDQUNKO0FBRUQsTUFBYSxVQUFVO0lBeUJuQixZQUFZLEtBQWUsRUFBRSxRQUFxQjtRQUM5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