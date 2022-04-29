"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJCQUEyQjtBQUMzQiw4REFBb0U7QUFFcEUsaURBQW1DO0FBQ25DLG1EQUFxQztBQUNyQyxpREFBa0Q7QUFDbEQsK0NBQWdEO0FBQ2hELDJDQUE0QztBQUM1Qyx1REFBd0Q7QUFDeEQsMkNBQTRDO0FBQzVDLDJDQUE0QztBQUM1QyxxREFBc0Q7QUFDdEQsdUNBQXdDO0FBQ3hDLDJDQUE0QztBQUM1QywyQ0FBNEM7QUFDNUMsbURBQW9EO0FBQ3BELCtDQUFnRDtBQUNoRCxpREFBa0Q7QUFDbEQsK0NBQWdEO0FBQ2hELDZDQUE4QztBQUM5QywyQ0FBNEM7QUFDNUMscURBQXNEO0FBRXRELE1BQU0sT0FBTztJQUVULFlBQVksS0FBYztRQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUs7UUFDUixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNqRCxDQUFDO0NBQ0o7QUFFRCxNQUFNLE1BQU07SUFDUixnQkFBZSxDQUFDO0lBQ2hCLE9BQU87UUFDSCxPQUFPLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBQ0QsU0FBUyxDQUFDLE1BQU0sRUFBRSxNQUFNO1FBQ3BCLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELFNBQVMsQ0FBQyxLQUFLO1FBQ1gsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25DLENBQUM7Q0FDSjtBQUVELE1BQWEsVUFBVTtJQXlCbkIsWUFBWSxLQUFlLEVBQUUsUUFBcUI7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