import { arrMakeFlat, download, EEntType, exportGeojson, exportGltf, exportPosiBasedObj, exportVertBasedObj, idsBreak, } from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../../_check_ids';
import { checkArgs, isStr, isStrL } from '../../../_check_types';
import { _EIODataTarget, _EIOExportDataFormat } from './_enum';
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
export async function Export(__model__, entities, file_name, data_format, data_target) {
    if (typeof localStorage === 'undefined') {
        return;
    }
    // --- Error Check ---
    const fn_name = 'io.Export';
    let ents_arr = null;
    if (__model__.debug) {
        if (entities !== null) {
            entities = arrMakeFlat(entities);
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isIDL1], [EEntType.PLINE, EEntType.PGON, EEntType.COLL]);
        }
        checkArgs(fn_name, 'file_name', file_name, [isStr, isStrL]);
    }
    else {
        if (entities !== null) {
            entities = arrMakeFlat(entities);
            ents_arr = idsBreak(entities);
        }
    }
    // --- Error Check ---
    await _export(__model__, ents_arr, file_name, data_format, data_target);
}
export function _Async_Param_Export(__model__, entities, file_name, data_format, data_target) {
}
async function _export(__model__, ents_arr, file_name, data_format, data_target) {
    const ssid = __model__.modeldata.active_ssid;
    switch (data_format) {
        case _EIOExportDataFormat.GI:
            {
                let model_data = '';
                model_data = __model__.exportGI(ents_arr);
                // gi_data = gi_data.replace(/\\\"/g, '\\\\\\"'); // TODO temporary fix
                model_data = model_data.replace(/\\/g, '\\\\\\'); // TODO temporary fix
                // === save the file ===
                if (data_target === _EIODataTarget.DEFAULT) {
                    return download(model_data, file_name);
                }
                return await _saveResource(model_data, file_name);
            }
        case _EIOExportDataFormat.OBJ_VERT:
            {
                const obj_verts_data = exportVertBasedObj(__model__, ents_arr, ssid);
                // obj_data = obj_data.replace(/#/g, '%23'); // TODO temporary fix
                if (data_target === _EIODataTarget.DEFAULT) {
                    return download(obj_verts_data, file_name);
                }
                return await _saveResource(obj_verts_data, file_name);
            }
        case _EIOExportDataFormat.OBJ_POSI:
            {
                const obj_posis_data = exportPosiBasedObj(__model__, ents_arr, ssid);
                // obj_data = obj_data.replace(/#/g, '%23'); // TODO temporary fix
                if (data_target === _EIODataTarget.DEFAULT) {
                    return download(obj_posis_data, file_name);
                }
                return await _saveResource(obj_posis_data, file_name);
            }
        // case _EIOExportDataFormat.DAE:
        //     const dae_data: string = exportDae(__model__);
        //     // dae_data = dae_data.replace(/#/g, '%23'); // TODO temporary fix
        //     if (data_target === _EIODataTarget.DEFAULT) {
        //         return download(dae_data, file_name);
        //     }
        //     return await _saveResource(dae_data, file_name);
        //     break;
        case _EIOExportDataFormat.GEOJSON:
            {
                const geojson_data = exportGeojson(__model__, ents_arr, true, ssid); // flatten
                if (data_target === _EIODataTarget.DEFAULT) {
                    return download(geojson_data, file_name);
                }
                return await _saveResource(geojson_data, file_name);
            }
        case _EIOExportDataFormat.GLTF:
            {
                const gltf_data = await exportGltf(__model__, ents_arr, ssid);
                if (data_target === _EIODataTarget.DEFAULT) {
                    return download(gltf_data, file_name);
                }
                return await _saveResource(gltf_data, file_name);
            }
        default:
            throw new Error('Data type not recognised');
    }
}
// ================================================================================================
/**
 * Functions for saving and loading resources to file system.
 */
export async function _saveResource(file, name) {
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
    const exportPromise = new Promise(resolve => {
        function saveToFS(fs) {
            const code = name;
            // console.log(code)
            fs.root.getFile(code, { create: true }, function (fileEntry) {
                fileEntry.createWriter(async function (fileWriter) {
                    const bb = new Blob([file + '_|_|_'], { type: 'text/plain;charset=utf-8' });
                    await fileWriter.write(bb);
                    resolve('success');
                }, (e) => { resolve(e); });
            }, (e) => { resolve(e); });
        }
        navigator.webkitPersistentStorage.requestQuota(requestedBytes, function (grantedBytes) {
            // @ts-ignore
            window.webkitRequestFileSystem(PERSISTENT, grantedBytes, saveToFS, function (e) { resolve(e); });
        }, function (e) { resolve(e); });
    });
    const endmsg = await exportPromise;
    return true;
    // localStorage.setItem(code, file);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2lvL0V4cG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsV0FBVyxFQUNYLFFBQVEsRUFDUixRQUFRLEVBQ1IsYUFBYSxFQUNiLFVBQVUsRUFDVixrQkFBa0IsRUFDbEIsa0JBQWtCLEVBRWxCLFFBQVEsR0FHWCxNQUFNLCtCQUErQixDQUFDO0FBRXZDLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDakUsT0FBTyxFQUFFLGNBQWMsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUkvRCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLDZCQUE2QjtBQUV2RSxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxNQUFNLENBQUMsS0FBSyxVQUFVLE1BQU0sQ0FBQyxTQUFrQixFQUFFLFFBQStCLEVBQzVFLFNBQWlCLEVBQUUsV0FBaUMsRUFBRSxXQUEyQjtJQUNqRixJQUFJLE9BQU8sWUFBWSxLQUFLLFdBQVcsRUFBRTtRQUFFLE9BQU87S0FBRTtJQUNwRCxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDO0lBQzVCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztJQUNwQixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO1lBQ25CLFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFVLENBQUM7WUFDMUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFR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