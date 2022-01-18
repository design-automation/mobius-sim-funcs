"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportData = void 0;
const Import_1 = require("./Import");
// ================================================================================================
/**
 * Imports a string of data into the model.
 * \n
 * @param model_data The model data
 * @param data_format Enum, the file format.
 * @returns A list of the positions, points, polylines, polygons and collections added to the model.
 * @example io.Import ("my_data.obj", obj)
 * @example_info Imports the data from my_data.obj, from local storage.
 */
function ImportData(__model__, model_data, data_format) {
    if (!model_data) {
        throw new Error('Invalid imported model data');
    }
    // zip file
    if (model_data.constructor === {}.constructor) {
        const coll_results = {};
        for (const data_name in model_data) {
            if (model_data[data_name]) {
                coll_results[data_name] = (0, Import_1._import)(__model__, model_data[data_name], data_format);
            }
        }
        return coll_results;
    }
    // single file
    return (0, Import_1._import)(__model__, model_data, data_format);
}
exports.ImportData = ImportData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1wb3J0RGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9pby9JbXBvcnREYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLHFDQUFtQztBQUtuQyxtR0FBbUc7QUFDbkc7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFnQixVQUFVLENBQUMsU0FBa0IsRUFBRSxVQUFrQixFQUFFLFdBQWlDO0lBQ2hHLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDYixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7S0FDbEQ7SUFDRCxXQUFXO0lBQ1gsSUFBSSxVQUFVLENBQUMsV0FBVyxLQUFLLEVBQUUsQ0FBQyxXQUFXLEVBQUU7UUFDM0MsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLEtBQUssTUFBTSxTQUFTLElBQVksVUFBVSxFQUFFO1lBQ3hDLElBQUksVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUN2QixZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBQSxnQkFBTyxFQUFDLFNBQVMsRUFBVSxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7YUFDNUY7U0FDSjtRQUNELE9BQU8sWUFBWSxDQUFDO0tBQ3ZCO0lBQ0QsY0FBYztJQUNkLE9BQU8sSUFBQSxnQkFBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDdkQsQ0FBQztBQWhCRCxnQ0FnQkMifQ==