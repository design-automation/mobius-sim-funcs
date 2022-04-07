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
        // if (typeof localStorage === 'undefined') { return; }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhwb3J0RGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9pby9FeHBvcnREYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDhEQVd1QztBQUV2QyxvREFBbUQ7QUFDbkQsbUNBQStDO0FBRy9DOzs7Ozs7Ozs7O0dBVUc7QUFDRixTQUFzQixVQUFVLENBQUMsU0FBa0IsRUFBRSxRQUErQixFQUFFLFdBQWlDOztRQUNwSCx1REFBdUQ7UUFDdkQsc0JBQXNCO1FBQ3RCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQztRQUM1QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1lBQ2pCLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtnQkFDbkIsUUFBUSxHQUFHLElBQUEsd0JBQVcsRUFBQyxRQUFRLENBQVUsQ0FBQztnQkFDMUMsUUFBUSxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQ3hELENBQUMsZUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMscUJBQVEsQ0FBQyxLQUFLLEVBQUUscUJBQVEsQ0FBQyxJQUFJLEVBQUUscUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBa0IsQ0FBQzthQUNyRjtTQUNKO2FBQU07WUFDSCxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7Z0JBQ25CLFFBQVEsR0FBRyxJQUFBLHdCQUFXLEVBQUMsUUFBUSxDQUFVLENBQUM7Z0JBQzFDLFFBQVEsR0FBRyxJQUFBLHFCQUFRLEVBQUMsUUFBUSxDQUFrQixDQUFDO2FBQ2xEO1NBQ0o7UUFDRCxzQkFBc0I7UUFDdEIsTUFBTSxJQUFJLEdBQVcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDckQsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLFFBQVEsV0FBVyxFQUFFO1lBQ2pCLEtBQUssNEJBQW9CLENBQUMsRUFBRTtnQkFDeEIsVUFBVSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzFDLE9BQU8sVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxxQkFBcUI7WUFDckUsS0FBSyw0QkFBb0IsQ0FBQyxRQUFRO2dCQUM5QixPQUFPLElBQUEsK0JBQWtCLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6RCxLQUFLLDRCQUFvQixDQUFDLFFBQVE7Z0JBQzlCLE9BQU8sSUFBQSwrQkFBa0IsRUFBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3pELEtBQUssNEJBQW9CLENBQUMsT0FBTztnQkFDN0IsT0FBTyxJQUFBLDBCQUFhLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVO1lBQ3JFLEtBQUssNEJBQW9CLENBQUMsSUFBSTtnQkFDMUIsT0FBTyxNQUFNLElBQUEsdUJBQVUsRUFBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3ZEO2dCQUNJLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztTQUNuRDtJQUNMLENBQUM7Q0FBQTtBQW5DQSxnQ0FtQ0EifQ==