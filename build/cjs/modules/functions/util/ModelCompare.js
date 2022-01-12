"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._Async_Param_ModelCompare = exports.ModelCompare = void 0;
/**
 * The `util` module has some utility functions used for debugging.
 * @module
 */
const mobius_sim_1 = require("@design-automation/mobius-sim");
const io_1 = require("../io");
// ================================================================================================
/**
 * Compares two models. Used for grading models.
 *
 * Checks that every entity in this model also exists in the input_data.
 *
 * Additional entitis in the input data will not affect the score.
 *
 * Attributes at the model level are ignored except for the `material` attributes.
 *
 * For grading, this model is assumed to be the answer model, and the input model is assumed to be
 * the model submitted by the student.
 *
 * The order or entities in this model may be modified in the comparison process.
 *
 * For specifying the location of the GI Model, you can either specify a URL, or the name of a file in LocalStorage.
 * In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'
 *
 * @param __model__
 * @param input_data The location of the GI Model to compare this model to.
 * @returns Text that summarises the comparison between the two models.
 */
function ModelCompare(__model__, input_data) {
    return __awaiter(this, void 0, void 0, function* () {
        const input_data_str = yield (0, io_1._getFile)(input_data);
        if (!input_data_str) {
            throw new Error('Invalid imported model data');
        }
        const input_model = new mobius_sim_1.GIModel();
        input_model.importGI(input_data_str);
        const result = __model__.compare(input_model, true, false, false);
        return result.comment;
    });
}
exports.ModelCompare = ModelCompare;
function _Async_Param_ModelCompare(__model__, input_data) {
    return null;
}
exports._Async_Param_ModelCompare = _Async_Param_ModelCompare;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWxDb21wYXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL3V0aWwvTW9kZWxDb21wYXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7R0FHRztBQUNILDhEQUF3RDtBQUV4RCw4QkFBaUM7QUFHakMsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CRztBQUNILFNBQXNCLFlBQVksQ0FBQyxTQUFrQixFQUFFLFVBQWtCOztRQUNyRSxNQUFNLGNBQWMsR0FBVyxNQUFNLElBQUEsYUFBUSxFQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1NBQ2xEO1FBQ0QsTUFBTSxXQUFXLEdBQUcsSUFBSSxvQkFBTyxFQUFFLENBQUM7UUFDbEMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNyQyxNQUFNLE1BQU0sR0FBb0QsU0FBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNuSCxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDMUIsQ0FBQztDQUFBO0FBVEQsb0NBU0M7QUFDRCxTQUFnQix5QkFBeUIsQ0FBQyxTQUFrQixFQUFFLFVBQWtCO0lBQzVFLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFGRCw4REFFQyJ9