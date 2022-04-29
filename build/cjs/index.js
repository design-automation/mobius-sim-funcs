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
exports._deprecated_funcs = exports._parameterTypes = exports.GICommon = exports.Model = exports.Funcs = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
Object.defineProperty(exports, "Model", { enumerable: true, get: function () { return mobius_sim_1.GIModel; } });
const GICommon = __importStar(require("@design-automation/mobius-sim"));
exports.GICommon = GICommon;
const _parameterTypes_1 = require("./_parameterTypes");
Object.defineProperty(exports, "_parameterTypes", { enumerable: true, get: function () { return _parameterTypes_1._parameterTypes; } });
const deprecated_1 = require("./deprecated");
Object.defineProperty(exports, "_deprecated_funcs", { enumerable: true, get: function () { return deprecated_1.deprecated; } });
const modules_1 = require("./modules");
Object.defineProperty(exports, "Funcs", { enumerable: true, get: function () { return modules_1.MobiusFunc; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFBaUU7QUFTN0Qsc0ZBVGdCLG9CQUFLLE9BU2hCO0FBUlQsd0VBQTBEO0FBU3RELDRCQUFRO0FBUFosdURBQW9EO0FBUWhELGdHQVJLLGlDQUFlLE9BUUw7QUFQbkIsNkNBQStEO0FBUTNELGtHQVJtQix1QkFBaUIsT0FRbkI7QUFQckIsdUNBQWdEO0FBRzVDLHNGQUhtQixvQkFBSyxPQUduQiJ9