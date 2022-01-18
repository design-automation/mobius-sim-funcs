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
exports._Async_Param_ModelMerge = exports.ModelMerge = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const io_1 = require("../io");
// ================================================================================================
/**
 * Merges data from another model into this model.
 * This is the same as importing the model, except that no collection is created.
 *
 * For specifying the location of the GI Model, you can either specify a URL, or the name of a file in LocalStorage.
 * In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'
 *
 * @param __model__
 * @param input_data The location of the GI Model to import into this model to.
 * @returns Text that summarises the comparison between the two models.
 */
function ModelMerge(__model__, input_data) {
    return __awaiter(this, void 0, void 0, function* () {
        const input_data_str = yield (0, io_1._getFile)(input_data);
        if (!input_data_str) {
            throw new Error('Invalid imported model data');
        }
        const ents_arr = __model__.importGI(input_data_str);
        return (0, mobius_sim_1.idsMake)(ents_arr);
    });
}
exports.ModelMerge = ModelMerge;
function _Async_Param_ModelMerge(__model__, input_data) {
    return null;
}
exports._Async_Param_ModelMerge = _Async_Param_ModelMerge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWxNZXJnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy91dGlsL01vZGVsTWVyZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsOERBQW1GO0FBRW5GLDhCQUFpQztBQUdqQyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7R0FVRztBQUNILFNBQXNCLFVBQVUsQ0FBQyxTQUFrQixFQUFFLFVBQWtCOztRQUNuRSxNQUFNLGNBQWMsR0FBVyxNQUFNLElBQUEsYUFBUSxFQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1NBQ2xEO1FBQ0QsTUFBTSxRQUFRLEdBQWtCLFNBQVMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbkUsT0FBTyxJQUFBLG9CQUFPLEVBQUMsUUFBUSxDQUFVLENBQUM7SUFDdEMsQ0FBQztDQUFBO0FBUEQsZ0NBT0M7QUFDRCxTQUFnQix1QkFBdUIsQ0FBQyxTQUFrQixFQUFFLFVBQWtCO0lBQzFFLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFGRCwwREFFQyJ9