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
exports.ExportData = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const _enum_1 = require("./_enum");
/**
 * Export data from the model as a string.
 * \n
 * @param __model__
 * @param entities Optional. Entities to be exported. If null, the whole model will be exported.
 * @param file_name Name of the file as a string.
 * @param data_format Enum, the file format.
 * @returns the model data as a string.
 * @example io.Export (#pg, 'my_model.obj', obj)
 * @example_info Exports all the polgons in the model as an OBJ.
 */
function ExportData(__model__, entities, data_format) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof localStorage === 'undefined') {
            return;
        }
        // --- Error Check ---
        const fn_name = 'io.Export';
        let ents_arr = null;
        if (__model__.debug) {
            if (entities !== null) {
                entities = (0, mobius_sim_1.arrMakeFlat)(entities);
                ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.PLINE, mobius_sim_1.EEntType.PGON, mobius_sim_1.EEntType.COLL]);
            }
        }
        else {
            if (entities !== null) {
                entities = (0, mobius_sim_1.arrMakeFlat)(entities);
                ents_arr = (0, mobius_sim_1.idsBreak)(entities);
            }
        }
        // --- Error Check ---
        const ssid = __model__.modeldata.active_ssid;
        let model_data = '';
        switch (data_format) {
            case _enum_1._EIOExportDataFormat.GI:
                model_data = __model__.exportGI(ents_arr);
                return model_data.replace(/\\/g, '\\\\\\'); // TODO temporary fix
            case _enum_1._EIOExportDataFormat.OBJ_VERT:
                return (0, mobius_sim_1.exportVertBasedObj)(__model__, ents_arr, ssid);
            case _enum_1._EIOExportDataFormat.OBJ_POSI:
                return (0, mobius_sim_1.exportPosiBasedObj)(__model__, ents_arr, ssid);
            case _enum_1._EIOExportDataFormat.GEOJSON:
                return (0, mobius_sim_1.exportGeojson)(__model__, ents_arr, true, ssid); // flatten
            case _enum_1._EIOExportDataFormat.GLTF:
                return yield (0, mobius_sim_1.exportGltf)(__model__, ents_arr, ssid);
            default:
                throw new Error('Data type not recognised');
        }
    });
}
exports.ExportData = ExportData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhwb3J0RGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9pby9FeHBvcnREYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDhEQVd1QztBQUV2QyxvREFBbUQ7QUFDbkQsbUNBQStDO0FBRy9DOzs7Ozs7Ozs7O0dBVUc7QUFDRixTQUFzQixVQUFVLENBQUMsU0FBa0IsRUFBRSxRQUErQixFQUFFLFdBQWlDOztRQUNwSCxJQUFJLE9BQU8sWUFBWSxLQUFLLFdBQVcsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUNwRCxzQkFBc0I7UUFDdEIsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDO1FBQzVCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7WUFDakIsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO2dCQUNuQixRQUFRLEdBQUcsSUFBQSx3QkFBVyxFQUFDLFFBQVEsQ0FBVSxDQUFDO2dCQUMxQyxRQUFRLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDeEQsQ0FBQyxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxxQkFBUSxDQUFDLEtBQUssRUFBRSxxQkFBUSxDQUFDLElBQUksRUFBRSxxQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFrQixDQUFDO2FBQ3JGO1NBQ0o7YUFBTTtZQUNILElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtnQkFDbkIsUUFBUSxHQUFHLElBQUEsd0JBQVcsRUFBQyxRQUFRLENBQVUsQ0FBQztnQkFDMUMsUUFBUSxHQUFHLElBQUEscUJBQVEsRUFBQyxRQUFRLENBQWtCLENBQUM7YUFDbEQ7U0FDSjtRQUNELHNCQUFzQjtRQUN0QixNQUFNLElBQUksR0FBVyxTQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNyRCxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDcEIsUUFBUSxXQUFXLEVBQUU7WUFDakIsS0FBSyw0QkFBb0IsQ0FBQyxFQUFFO2dCQUN4QixVQUFVLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDMUMsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLHFCQUFxQjtZQUNyRSxLQUFLLDRCQUFvQixDQUFDLFFBQVE7Z0JBQzlCLE9BQU8sSUFBQSwrQkFBa0IsRUFBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3pELEtBQUssNEJBQW9CLENBQUMsUUFBUTtnQkFDOUIsT0FBTyxJQUFBLCtCQUFrQixFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDekQsS0FBSyw0QkFBb0IsQ0FBQyxPQUFPO2dCQUM3QixPQUFPLElBQUEsMEJBQWEsRUFBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVU7WUFDckUsS0FBSyw0QkFBb0IsQ0FBQyxJQUFJO2dCQUMxQixPQUFPLE1BQU0sSUFBQSx1QkFBVSxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdkQ7Z0JBQ0ksTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1NBQ25EO0lBQ0wsQ0FBQztDQUFBO0FBbkNBLGdDQW1DQSJ9