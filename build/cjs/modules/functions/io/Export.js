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
exports._saveResource = exports._Async_Param_Export = exports.Export = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const _check_types_1 = require("../../../_check_types");
const _enum_1 = require("./_enum");
const requestedBytes = 1024 * 1024 * 200; // 200 MB local storage quota
// ================================================================================================
/**
 * Export data from the model as a file.
 * \n
 * If you expore to your  hard disk,
 * it will result in a popup in your browser, asking you to save the file.
 * \n
 * If you export to Local Storage, there will be no popup.
 * \n
 * @param __model__
 * @param entities Optional. Entities to be exported. If null, the whole model will be exported.
 * @param file_name Name of the file as a string.
 * @param data_format Enum, the file format.
 * @param data_target Enum, where the data is to be exported to.
 * @returns void.
 * @example io.Export (#pg, 'my_model.obj', obj)
 * @example_info Exports all the polgons in the model as an OBJ.
 */
function Export(__model__, entities, file_name, data_format, data_target) {
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
            (0, _check_types_1.checkArgs)(fn_name, 'file_name', file_name, [_check_types_1.isStr, _check_types_1.isStrL]);
        }
        else {
            if (entities !== null) {
                entities = (0, mobius_sim_1.arrMakeFlat)(entities);
                ents_arr = (0, mobius_sim_1.idsBreak)(entities);
            }
        }
        // --- Error Check ---
        yield _export(__model__, ents_arr, file_name, data_format, data_target);
    });
}
exports.Export = Export;
function _Async_Param_Export(__model__, entities, file_name, data_format, data_target) {
}
exports._Async_Param_Export = _Async_Param_Export;
function _export(__model__, ents_arr, file_name, data_format, data_target) {
    return __awaiter(this, void 0, void 0, function* () {
        const ssid = __model__.modeldata.active_ssid;
        switch (data_format) {
            case _enum_1._EIOExportDataFormat.GI:
                {
                    let model_data = '';
                    model_data = __model__.exportGI(ents_arr);
                    // gi_data = gi_data.replace(/\\\"/g, '\\\\\\"'); // TODO temporary fix
                    model_data = model_data.replace(/\\/g, '\\\\\\'); // TODO temporary fix
                    // === save the file ===
                    if (data_target === _enum_1._EIODataTarget.DEFAULT) {
                        return (0, mobius_sim_1.download)(model_data, file_name);
                    }
                    return _saveResource(model_data, file_name);
                }
            case _enum_1._EIOExportDataFormat.OBJ_VERT:
                {
                    const obj_verts_data = (0, mobius_sim_1.exportVertBasedObj)(__model__, ents_arr, ssid);
                    // obj_data = obj_data.replace(/#/g, '%23'); // TODO temporary fix
                    if (data_target === _enum_1._EIODataTarget.DEFAULT) {
                        return (0, mobius_sim_1.download)(obj_verts_data, file_name);
                    }
                    return _saveResource(obj_verts_data, file_name);
                }
            case _enum_1._EIOExportDataFormat.OBJ_POSI:
                {
                    const obj_posis_data = (0, mobius_sim_1.exportPosiBasedObj)(__model__, ents_arr, ssid);
                    // obj_data = obj_data.replace(/#/g, '%23'); // TODO temporary fix
                    if (data_target === _enum_1._EIODataTarget.DEFAULT) {
                        return (0, mobius_sim_1.download)(obj_posis_data, file_name);
                    }
                    return _saveResource(obj_posis_data, file_name);
                }
            // case _EIOExportDataFormat.DAE:
            //     const dae_data: string = exportDae(__model__);
            //     // dae_data = dae_data.replace(/#/g, '%23'); // TODO temporary fix
            //     if (data_target === _EIODataTarget.DEFAULT) {
            //         return download(dae_data, file_name);
            //     }
            //     return _saveResource(dae_data, file_name);
            //     break;
            case _enum_1._EIOExportDataFormat.GEOJSON:
                {
                    const geojson_data = (0, mobius_sim_1.exportGeojson)(__model__, ents_arr, true, ssid); // flatten
                    if (data_target === _enum_1._EIODataTarget.DEFAULT) {
                        return (0, mobius_sim_1.download)(geojson_data, file_name);
                    }
                    return _saveResource(geojson_data, file_name);
                }
            case _enum_1._EIOExportDataFormat.GLTF:
                {
                    const gltf_data = yield (0, mobius_sim_1.exportGltf)(__model__, ents_arr, ssid);
                    if (data_target === _enum_1._EIODataTarget.DEFAULT) {
                        return (0, mobius_sim_1.download)(gltf_data, file_name);
                    }
                    return _saveResource(gltf_data, file_name);
                }
            default:
                throw new Error('Data type not recognised');
        }
    });
}
// ================================================================================================
/**
 * Functions for saving and loading resources to file system.
 */
function _saveResource(file, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemstring = localStorage.getItem('mobius_backup_list');
        if (!itemstring) {
            localStorage.setItem('mobius_backup_list', `["${name}"]`);
            localStorage.setItem('mobius_backup_date_dict', `{ "${name}": "${(new Date()).toLocaleString()}"}`);
        }
        else {
            const items = JSON.parse(itemstring);
            let check = false;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item === name) {
                    items.splice(i, 1);
                    items.unshift(item);
                    check = true;
                    break;
                }
            }
            if (!check) {
                items.unshift(name);
                // if (items.length > 10) {
                //     const item = items.pop();
                //     localStorage.removeItem(item);
                // }
            }
            localStorage.setItem('mobius_backup_list', JSON.stringify(items));
            const itemDates = JSON.parse(localStorage.getItem('mobius_backup_date_dict'));
            itemDates[itemstring] = (new Date()).toLocaleString();
            localStorage.setItem('mobius_backup_date_dict', JSON.stringify(itemDates));
        }
        // window['_code__'] = name;
        // window['_file__'] = file;
        function saveToFS(fs) {
            const code = name;
            // console.log(code)
            fs.root.getFile(code, { create: true }, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const bb = new Blob([file + '_|_|_'], { type: 'text/plain;charset=utf-8' });
                        yield fileWriter.write(bb);
                    });
                }, (e) => { console.log(e); });
            }, (e) => { console.log(e.code); });
        }
        navigator.webkitPersistentStorage.requestQuota(requestedBytes, function (grantedBytes) {
            // @ts-ignore
            window.webkitRequestFileSystem(PERSISTENT, grantedBytes, saveToFS, function (e) { throw e; });
        }, function (e) { throw e; });
        return true;
        // localStorage.setItem(code, file);
    });
}
exports._saveResource = _saveResource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2lvL0V4cG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSw4REFZdUM7QUFFdkMsb0RBQW1EO0FBQ25ELHdEQUFpRTtBQUNqRSxtQ0FBK0Q7QUFJL0QsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyw2QkFBNkI7QUFFdkUsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsU0FBc0IsTUFBTSxDQUFDLFNBQWtCLEVBQUUsUUFBK0IsRUFDNUUsU0FBaUIsRUFBRSxXQUFpQyxFQUFFLFdBQTJCOztRQUNqRixJQUFJLE9BQU8sWUFBWSxLQUFLLFdBQVcsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUNwRCxzQkFBc0I7UUFDdEIsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDO1FBQzVCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7WUFDakIsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO2dCQUNuQixRQUFRLEdBQUcsSUFBQSx3QkFBVyxFQUFDLFFBQVEsQ0FBVSxDQUFDO2dCQUMxQyxRQUFRLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDeEQsQ0FBQyxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxxQkFBUSxDQUFDLEtBQUssRUFBRSxxQkFBUSxDQUFDLElBQUksRUFBRSxxQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFrQixDQUFDO2FBQ3JGO1lBQ0QsSUFBQSx3QkFBUyxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLENBQUMsb0JBQUssRUFBRSxxQkFBTSxDQUFDLENBQUMsQ0FBQztTQUMvRDthQUFNO1lB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